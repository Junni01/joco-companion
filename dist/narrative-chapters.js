import {CHAPTER_TEMPLATES,fillChapter} from './narrative-chapter-content.js';
import {tradeContexts} from './narrative-trade.js';
import {politicalPosture} from './narrative-posture.js';

const copy=v=>JSON.parse(JSON.stringify(v));
const unique=items=>[...new Map(items.map(x=>[JSON.stringify(x),x])).values()];
const name=r=>r.charAt(0).toUpperCase()+r.slice(1);
const sorted=v=>Array.isArray(v)?v.map(sorted):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,sorted(v[k])])):v;
const equal=(a,b)=>JSON.stringify(sorted(a))===JSON.stringify(sorted(b));
const assert=(ok,message)=>{if(!ok)throw Error('Invalid narrative chapter: '+message);};
export const CHAPTER_POLICY={version:1,maxThreads:2,maxParagraphs:2};

// Reconstruct the boundary, not today's map/feelings. No save conversion or text rewriting.
export function chapterView(state,closureId){
 const cut=state.history.findIndex(h=>h.incident?.id===closureId);assert(cut>=0,'missing closing incident');
 const order=new Map(state.history.map((h,i)=>[h.incident?.id,i]));
 const at=id=>(order.get(id)??Infinity)<=cut;
 const regions=copy(state.regions);
 for(const region of Object.keys(regions))for(const h of state.history.slice(cut+1)){
  const change=h.incident?.changes.find(c=>c.region===region);if(change){regions[region]=copy(change.before);break;}
 }
 const memories=Object.fromEntries(Object.entries(state.narrative.memories).filter(([,m])=>at(m.createdIncident)).map(([id,m])=>{
  const prior=copy(m);prior.emotionalImportance-=m.updates.filter(u=>!at(u.incidentId)).reduce((sum,u)=>sum+u.delta,0);prior.updates=prior.updates.filter(u=>at(u.incidentId));
  if(prior.currentAssessment&&!at(prior.currentAssessment.incidentId))delete prior.currentAssessment;
  return [id,prior];
 }));
 const characters=Object.fromEntries(Object.entries(state.narrative.characters).map(([id,c])=>[id,{...c,memoryIds:c.memoryIds.filter(id=>memories[id]),incidents:c.incidents.filter(at)}]));
 return {...state,regions,history:state.history.slice(0,cut+1),narrative:{...state.narrative,characters,memories,statements:Object.fromEntries(Object.entries(state.narrative.statements).filter(([,s])=>at(s.incidentId))),chapters:state.narrative.chapters.filter(c=>(order.get(c.closureIncidentId)??Infinity)<cut)}};
}

function context(state,turn){
 const records=[];
 const start=state.history.findLastIndex((h,i)=>i<state.history.length-1&&['next-turn','end-game'].includes(h.actionType));
 const current=r=>r.order>start&&r.h.turn===turn;
 state.history.forEach((h,order)=>{if(!h.incident||h.kind==='correction'||['next-turn','end-game'].includes(h.actionType))return;
  h.incident.facts.forEach((fact,i)=>records.push({h,order,fact,ref:{incidentId:h.incident.id,factKey:'fact-'+i}}));
 });
 const memories=Object.values(state.narrative.memories);
 const lines=state.history.flatMap((h,order)=>(h.narrative?.lines||[]).map(line=>({h,order,line})));
 const ownership=(ownerId,region,category,incidentId)=>memories.find(m=>m.ownerId===ownerId&&m.region===region&&m.category===category&&m.createdIncident===incidentId&&m.origin==='direct'&&m.perspective!=='sovereign');
 const causes=(id)=>Object.values(state.narrative.characters[id]?.relations||{}).filter(r=>r.target.kind==='institution'&&r.target.id==='company').flatMap(r=>r.causes.filter(c=>state.history.some(h=>h.incident?.id===c.incidentId)));
 const hostility=id=>causes(id).reduce((sum,c)=>sum+(c.deltas.hostility||0),0);
 const persistent=(id,region)=>memories.find(m=>m.ownerId===id&&m.region===region&&m.category==='company-conquest'&&m.origin==='direct'&&m.emotionalImportance>0&&hostility(id)>0);
 const noLossSince=(record,region)=>!state.history.slice(record.order+1).some(h=>h.incident?.changes.some(c=>c.region===region&&c.before.control==='company'&&c.after.control!=='company'));
 return {state,turn,records,memories,lines,ownership,causes,hostility,persistent,noLossSince,current};
}
const sentence=(id,text,records=[],memoryIds=[],reasonRefs=[],lineIds=[])=>({id,text,evidence:unique(records.map(r=>r.ref)),memoryIds,reasonRefs,lineIds});
function thread(id,params,score,clauses,endState){
 const template=CHAPTER_TEMPLATES[id],text=fillChapter(template.text,params);
 return {templateId:id,version:1,key:[id,params.regionId,params.orderId||'',params.characterId||''].join(':'),title:fillChapter(template.title,params),text,parameters:params,score,paragraphs:template.paragraphs,clauses,evidence:unique(clauses.flatMap(c=>c.evidence)),memoryIds:unique(clauses.flatMap(c=>c.memoryIds)),reasonRefs:unique(clauses.flatMap(c=>c.reasonRefs)),lineIds:unique(clauses.flatMap(c=>c.lineIds)),endState};
}
const personalName=(ctx,id,incidentId)=>ctx.lines.find(l=>l.line.speakerId===id&&l.h.incident.id===incidentId)?.line.speaker;

function governance(ctx,region,rejections){
 const {state,turn,records}=ctx,end=state.regions[region];
 const admin=records.filter(r=>r.fact.type==='unrest'&&r.fact.region===region&&ctx.current(r)&&((r.fact.cause==='unrest'&&r.fact.reason==='failure')||(r.fact.cause==='govern'&&['failure','catastrophe'].includes(r.h.incident.input.outcome)))).at(-1);
 if(!admin)return [];
 const conquest=records.filter(r=>r.fact.type==='company-conquest'&&r.fact.region===region&&r.order<admin.order).at(-1);
 const tax=conquest&&records.find(r=>r.fact.region===region&&r.fact.type==='tax'&&r.order>conquest.order&&r.order<admin.order&&ctx.current(r));
 const armed=conquest&&records.find(r=>r.h===conquest.h&&r.fact.type==='deployment'&&r.fact.outcome==='success');
 if(!conquest||!tax||!armed||end.control!=='company'||!ctx.noLossSince(conquest,region)){
  rejections.push({templateId:'CH08-01',region,reason:'Requires ordered conquest → Tax → unsuccessful administration and continuous Company control through the close.'});return [];
 }
 const base={regionId:region,region:name(region)},endState={region,control:end.control};
 const facts=[conquest,armed,tax,admin];
 if(!ctx.current(conquest)){
  rejections.push({templateId:'CH08-01',region,reason:'Earlier-turn conquest cannot be retold as a new conquest this turn; use explicitly dated factual context.'});
  return [thread('CH08-FACT-ADMIN-CONTINUED',{...base,contextTurn:conquest.h.turn},60,[sentence('ordered-governance','Earlier conquest; this-turn Tax and failed administration; Company control at close.',facts)],endState)];
 }
 const grievance=ctx.memories.find(m=>m.category==='company-conquest'&&m.createdIncident===conquest.h.incident.id&&m.origin==='direct'&&m.region===region&&state.narrative.characters[m.ownerId]?.role==='ruler'&&m.emotionalImportance>0&&ctx.hostility(m.ownerId)>0);
 const owner=grievance?.ownerId,assessment=owner&&ctx.ownership(owner,region,'administration',admin.h.incident.id);
 const cause=assessment&&ctx.causes(owner).find(c=>c.incidentId===admin.h.incident.id&&c.memoryIds.includes(assessment.id)&&Object.hasOwn(c.deltas,'hostility'));
 const person=owner&&personalName(ctx,owner,conquest.h.incident.id);
 const paragraphs=[sentence('conquest-and-governance','Military conquest was followed by a Tax demand and unsuccessful administration this turn.',facts),sentence('end-control','The Company held the region at the close.',[admin])];
 const unfavorable=owner&&politicalPosture(state,owner,region,state.history.at(-1).incident.id).kind==='hostile';
 if(grievance&&assessment&&cause&&person&&unfavorable){
  paragraphs.push(sentence('persistent-personal-judgment','The same directly affected person retains a conquest grievance and an adverse administration assessment.',facts,[grievance.id,assessment.id],[{ownerId:owner,target:'institution:company',causeId:cause.id}],ctx.lines.filter(l=>l.line.speakerId===owner&&l.h.incident.id===conquest.h.incident.id).map(l=>l.line.id)));
  return [thread('CH08-01',{...base,person,characterId:owner},100,paragraphs,endState)];
 }
 rejections.push({templateId:'CH08-01',region,reason:'Missing owned conquest grievance, identity at the loss or sourced adverse personal assessment after administration; omit the personal sentence.'});
 return [thread('CH08-01-FACTUAL',base,85,paragraphs,endState)];
}

function commercialEvents(ctx,region,orderId){
 return ctx.state.history.flatMap((h,order)=>{
  if(!h.incident||h.kind==='correction'||['next-turn','end-game'].includes(h.actionType))return [];
  const change=h.incident.changes.find(c=>c.region===region);if(!change)return [];
  const proof=ctx.records.filter(r=>r.h===h&&r.fact.region===region);
  if(change.before.orders[orderId]&&!change.after.orders[orderId]&&proof.some(r=>r.fact.type==='order-closed'&&r.fact.order===orderId))return [{h,order,kind:'disruption',proof:proof.filter(r=>r.fact.type==='order-closed'&&r.fact.order===orderId)}];
  if(!change.before.orders[orderId]&&change.after.orders[orderId]&&tradeContexts(ctx.state,h).some(c=>c.region===region&&['trade-military','trade-diplomacy'].includes(c.category)))return [{h,order,kind:'restoration',proof:proof.filter(r=>r.fact.type==='intervention'||(r.fact.type==='order-opened'&&r.fact.order===orderId))}];
  return [];
 });
}
function commerce(ctx,region,rejections){
 const choices=[];
 for(const orderId of Object.keys(ctx.state.regions[region].orders)){
  const events=commercialEvents(ctx,region,orderId),current=events.filter(e=>ctx.current(e)),last=events.at(-1);if(!current.length||!last)continue;
  const available=ctx.state.regions[region].orders[orderId],base={regionId:region,region:name(region),orderId},endState={region,orderId,available};
  // A full reference passage is used only for the complete, current-turn episode.
  const episode=current.slice(-4),[d1,r1,d2,r2]=episode;
  if(episode.length===4&&[d1.kind,r1.kind,d2.kind,r2.kind].join('/')==='disruption/restoration/disruption/restoration'){
   const hope=ctx.lines.find(l=>l.h===r1.h&&l.line.templateId==='TR08-REST-SEC-01'&&l.line.tradeRegion===region&&ctx.state.narrative.characters[l.line.speakerId]?.role==='secretary');
   const cautious=hope&&ctx.lines.find(l=>l.h===r2.h&&l.line.templateId==='TR08-REST-SEC-02'&&l.line.speakerId===hope.line.speakerId&&l.line.experienceLineIds?.includes(hope.line.id));
   const owned=hope&&[r1,r2].map(r=>ctx.memories.find(m=>m.ownerId===hope.line.speakerId&&m.region===region&&m.createdIncident===r.h.incident.id&&['trade-military','trade-diplomacy','intervention'].includes(m.category)));
   if(available&&last===r2&&hope&&cautious&&owned.every(Boolean)){
    const records=episode.flatMap(e=>e.proof),ids=[hope.line.id,cautious.line.id];
    choices.push(thread('CH08-02',{...base,person:cautious.line.speaker,characterId:hope.line.speakerId},110,[sentence('same-opportunity-cycles','Two ordered disruption/restoration cycles concern this same opportunity this turn.',records),sentence('personal-change','The same secretary saved hopeful words and a later cautious reassessment.',records,owned.map(m=>m.id),[],ids),sentence('available-at-close','The specific opportunity was available at the close.',r2.proof)],endState));
   }else rejections.push({templateId:'CH08-02',region,orderId,reason:'Requires the same secretary’s actual hopeful and cautious announcements, owned restorations and the opportunity still available at the close.'});
  }else rejections.push({templateId:'CH08-02',region,orderId,reason:'No complete current-turn disruption → restoration → disruption → restoration episode for this specific opportunity; earlier context must not be retold as new.'});
  if(last.kind==='restoration'&&available&&ctx.current(last)){
   const earlier=events.filter(e=>e.order<last.order&&e.kind==='disruption').at(-1),records=[...(earlier?.proof||[]),...last.proof];
   const id=!earlier?'CH08-FACT-RESTORED':ctx.current(earlier)?'CH08-FACT-TRADE-OPEN':'CH08-FACT-TRADE-CONTINUED';
   choices.push(thread(id,{...base,...(earlier?{contextTurn:earlier.h.turn}:{})},40,[sentence('commercial-ending','This turn restored a specific commercial opportunity; it was available at the close.',records)],endState));
  }else if(last.kind==='disruption'&&!available&&ctx.current(last)){
   const restored=events.filter(e=>e.kind==='restoration'&&ctx.current(e)&&e.order<last.order).at(-1);
   if(restored)choices.push(thread('CH08-FACT-TRADE-RECLOSED',base,65,[sentence('reversed-recovery','A this-turn restoration was followed by renewed disruption of this opportunity.',[...restored.proof,...last.proof])],endState));
  }
 }
 const military=ctx.state.history.filter(h=>ctx.current({h,order:ctx.state.history.indexOf(h)})&&tradeContexts(ctx.state,h).some(c=>c.region===region&&c.category==='trade-military'));
 if(military.length)rejections.push({templateId:'CH08-03',region,reason:'Beneficial reopening alone does not establish a saved current judgment valuing protection while preserving independent objections, or the Company’s expected thanks. Full reference remains deferred.'});
 return choices;
}

function rebellion(ctx,region,rejections){
 const battle=ctx.records.filter(r=>ctx.current(r)&&r.fact.region===region&&r.fact.type==='battle'&&r.fact.kind==='company-defence'&&r.fact.won&&(r.fact.key==='leader'||r.fact.key==='crisis'||r.fact.stage==='secondary')).at(-1);
 if(!battle)return [];
 rejections.push({templateId:'CH08-04',region,reason:'No supported earlier saved personal hope for this rebellion’s different outcome; the full hope sentence is deferred.'});
 const end=ctx.state.regions[region];if(end.control!=='company'||!ctx.noLossSince(battle,region))return [];
 const affected=ctx.memories.find(m=>m.createdIncident===battle.h.incident.id&&m.region===region&&m.category==='company-defence'&&m.origin==='direct'&&m.emotion==='resentment'&&ctx.state.narrative.characters[m.ownerId]?.role==='ruler');
 const grievance=affected&&ctx.persistent(affected.ownerId,region),person=affected&&personalName(ctx,affected.ownerId,battle.h.incident.id);
 if(!affected||!grievance||!person)return [];
 return [thread('CH08-04-FACTUAL',{regionId:region,region:name(region),person,characterId:affected.ownerId},120,[sentence('actual-failed-rebellion','An actual rebellion against Company rule failed this turn and Company authority survived to the close.',[battle]),sentence('owned-unresolved-grievance','This directly affected character retains a sourced conquest grievance.',[battle],[affected.id,grievance.id])],{region,control:end.control})];
}

export function inspectChapterCandidates(state,turn,closureId=state.history.at(-1)?.incident?.id){
 const view=chapterView(state,closureId),ctx=context(view,turn),rejections=[],candidates=[];
 for(const region of Object.keys(view.regions)){
  candidates.push(...governance(ctx,region,rejections),...commerce(ctx,region,rejections),...rebellion(ctx,region,rejections));
  const conquest=ctx.records.filter(r=>ctx.current(r)&&r.fact.region===region&&r.fact.type==='company-conquest').at(-1);
  const loss=ctx.records.filter(r=>ctx.current(r)&&r.fact.region===region&&r.fact.type==='company-loss').at(-1);
  if(conquest&&view.regions[region].control==='company'&&ctx.noLossSince(conquest,region))candidates.push(thread('CH08-FACT-CONTROL',{regionId:region,region:name(region)},55,[sentence('current-conquest','Company conquest occurred this turn and control was retained.',[conquest])],{region,control:'company'}));
  if(loss&&view.regions[region].control!=='company')candidates.push(thread('CH08-FACT-LOSS',{regionId:region,region:name(region)},75,[sentence('current-loss','Company control was lost this turn and had not returned at the close.',[loss])],{region,control:view.regions[region].control}));
 }
 const seen=view.narrative.chapters.flatMap(c=>c.threads||[]),eligible=[];
 for(const candidate of candidates){
  if(seen.some(old=>old.key===candidate.key||old.text===candidate.text))rejections.push({templateId:candidate.templateId,region:candidate.parameters.regionId,reason:'This passage/thread was already saved; avoid repeating an unchanged paragraph.'});
  else eligible.push(candidate);
 }
 eligible.sort((a,b)=>b.score-a.score||a.key.localeCompare(b.key));
 return {view,candidates:eligible,rejections};
}
export function composeChapter(state,turn,ending=false,closureId=state.history.at(-1)?.incident?.id){
 const {view,candidates}=inspectChapterCandidates(state,turn,closureId),threads=[];let paragraphs=0;
 for(const c of candidates){if(threads.length>=CHAPTER_POLICY.maxThreads||paragraphs+c.paragraphs>CHAPTER_POLICY.maxParagraphs||threads.some(t=>t.parameters.regionId===c.parameters.regionId))continue;threads.push(c);paragraphs+=c.paragraphs;}
 for(const t of threads)t.clauses=t.clauses.map(c=>({...c,endStateRef:{incidentId:closureId,...t.endState}}));
 const evidence=unique(threads.flatMap(t=>t.evidence)),memoryIds=unique(threads.flatMap(t=>t.memoryIds)),lineIds=unique(threads.flatMap(t=>t.lineIds)),reasonRefs=unique(threads.flatMap(t=>t.reasonRefs));
 const incidents=unique([...evidence.map(r=>r.incidentId),...memoryIds.map(id=>view.narrative.memories[id].createdIncident),...lineIds.map(id=>view.history.find(h=>h.narrative?.lines.some(l=>l.id===id)).incident.id),...reasonRefs.map(ref=>view.narrative.characters[ref.ownerId].relations[ref.target].causes.find(c=>c.id===ref.causeId).incidentId)]);
 return {id:'chapter:'+closureId,version:CHAPTER_POLICY.version,templateId:'CH08-COMPOSITION-1',closureIncidentId:closureId,turn,ending,status:threads.length?'substantial':'quiet',title:unique(threads.map(t=>t.title)).join(' · ')||'Turn '+turn+' closes',text:threads.map(t=>t.text).join('\n\n'),threads,evidence,memoryIds,lineIds,reasonRefs,incidents};
}
export function validateChapters(state){
 const chapters=state.narrative.chapters,seen=new Set();let previous=-1;
 for(const chapter of chapters){
  if(chapter.version===undefined){
   // Existing fields remain stored verbatim; no migration/backfill or silent downgrade.
   assert(!('threads' in chapter)&&!('closureIncidentId' in chapter)&&!('templateId' in chapter),'missing chapter version');continue;
  }
  assert(chapter.version===1&&chapter.templateId==='CH08-COMPOSITION-1','unsupported chapter format');
  assert(typeof chapter.ending==='boolean','closing mode');
  const index=state.history.findIndex(h=>h.incident?.id===chapter.closureIncidentId),boundary=state.history[index];
  assert(index>previous&&!seen.has(chapter.closureIncidentId),'duplicate or out-of-order chapter boundary');previous=index;seen.add(chapter.closureIncidentId);
  assert(boundary&&boundary.turn===chapter.turn&&(chapter.ending?boundary.actionType==='end-game':boundary.actionType==='next-turn'),'chapter closing turn');
  const expected=composeChapter(state,chapter.turn,chapter.ending,chapter.closureIncidentId);
  assert(equal(chapter,expected),'unsupported wording, parameters, evidence, event order or ending');
 }
}
