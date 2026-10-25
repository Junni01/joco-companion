import {EVENT_TILES} from './event-stack.js';
import {COUNSEL_BY_ID} from './narrative-counsel-content.js';
import {ADVICE_OUTCOME_BY_ID} from './narrative-advice-content.js';
import {semanticsFor,intendedEffect,planKey} from './narrative-advice-policy.js';
import {capturedAdvice} from './narrative-advice-session.js';
import {eligiblePlanningCounsel} from './narrative-counsel.js';
const copy=v=>JSON.parse(JSON.stringify(v)),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const assert=(ok,message)=>{if(!ok)throw Error('Invalid committed advice: '+message);};

export function actionOutcome(entry){
 const i=entry.incident,d=i?.input;if(!d)return null;
 if(i.type==='deploy'){
  const f=i.facts.find(f=>f.type==='deployment');
  return f&&f.army===d.army&&f.region===d.target&&f.outcome===d.outcome?{kind:f.outcome,plan:{kind:'deploy',army:d.army,target:d.target},selectedEffect:null}:null;
 }
 if(i.type==='envoy'&&['success','failure','catastrophe'].includes(d.outcome))return {kind:d.outcome,plan:d.purpose==='china'?{kind:'envoy',purpose:'china'}:{kind:'envoy',purpose:'order',order:d.order},selectedEffect:d.outcome!=='success'?null:d.purpose==='china'?{kind:'china-office'}:{kind:'order',order:d.order}};
 if(i.type==='tax'&&! i.laws.before.governorGeneral&&i.facts.some(f=>f.type==='tax'&&f.mode==='governor'&&f.region===d.region))return {kind:'success',plan:{kind:'governor',region:d.region},selectedEffect:{kind:'tax',region:d.region}};
 if(i.type==='unrest'&&d.governorAction&&d.reason==='failure'&&i.facts.some(f=>f.type==='unrest'&&f.reason==='failure'&&f.region===d.region))return {kind:'failure',plan:{kind:'governor',region:d.region},selectedEffect:null};
 return null;
}
export function followedStatus(record,outcome){
 if(record.actionKind!=='deploy'&&outcome.kind!=='success')return 'no-choice-on-failure';
 if(record.utterancePhase!=='pre-check')return 'not-applicable/unknown';
 if(record.actionKind==='deploy')return record.stance==='discourage'?'proceeded-despite-warning':record.stance==='encourage'?'followed':'not-applicable/unknown';
 return record.stance==='prefer-effect'?(same(record.recommendedEffect,outcome.selectedEffect)?'followed':'different-effect'):'not-applicable/unknown';
}
export function outcomeCandidates(record,outcome,person){
 const rows=[],pre=record.utterancePhase==='pre-check',kind=outcome.kind,success=kind==='success';
 const add=(id,score=100)=>{if(ADVICE_OUTCOME_BY_ID[id]&&!ADVICE_OUTCOME_BY_ID[id].withheld)rows.push({id,score});};
 const {pride:P,caution:C,ambition:A}=person.traits,F=person.confidence,V=person.voice;
 if(record.actionKind==='deploy'&&pre){
  if(record.stance==='discourage'){
   if(success){add('09D1-deploy-discouraged-victory-professional',100+C*.2);add('09D1-deploy-discouraged-victory-vain',80+P*.45);add('09D-warning-success',90+V.restraint*8+P*.1);}
   else if(kind==='failure'){add('09D1-deploy-discouraged-failure-relieved',100+V.humour*5);add('09D-warning-failure',90+C*.15+(100-F)*.1);}
   else if(kind==='catastrophe')add('09D1-deploy-discouraged-catastrophe-sober');
  }else if(record.stance==='encourage'){
   if(success){add('09D1-deploy-supported-victory-ambitious',100+A*.2);add('09D-advocate-success',90+P*.3);}
   else if(kind==='failure'){add('09D1-deploy-supported-failure-defensive',100+C*.15);add('09D-advocate-failure',90+P*.2+V.humour*3);}
   else if(kind==='catastrophe')add('09D1-deploy-supported-catastrophe-humbled');
  }
 }else if(record.actionKind==='envoy'){
  if(!success){
   if(record.plan.purpose==='order'&&record.institutionId==='director-of-trade'){add('09D1-envoy-failed-india',100+V.formality*4);add('09C-envoy-india-failure',100+V.humour*5);}
   if(record.plan.purpose==='china'&&record.institutionId==='china-affairs'){add('09D1-envoy-failed-china',100+V.humour*4);add('09C-china-office-failure',100+V.formality*4);}
  }else if(record.followedStatus==='different-effect'){
   if(record.plan.purpose==='order'&&outcome.selectedEffect?.kind==='china-office'){add('09D1-envoy-chose-china-after-india',100+P*.1);add('09D-envoy-switched-to-china',95+C*.15);}
   if(record.plan.purpose==='china'&&outcome.selectedEffect?.kind==='order'){add('09D1-envoy-chose-india-after-china',100+V.humour*5);add('09D-envoy-switched-to-india',95+P*.15);}
  }else if(outcome.selectedEffect?.kind==='order'&&record.plan.purpose==='order'&&record.plan.order===outcome.selectedEffect.order&&record.institutionId==='director-of-trade'){
   add('09D1-envoy-success-india',100+P*.1);add('09C-envoy-india-success',95+V.humour*5);
  }else if(outcome.selectedEffect?.kind==='china-office'&&record.plan.purpose==='china'&&record.institutionId==='china-affairs'){
   add('09D1-envoy-success-china',100+C*.1);add('09C-china-office-created',95+V.formality*5);
  }
 }else if(record.actionKind==='governor'){
  if(success&&pre&&record.followedStatus==='followed'){
   add('09D1-governor-tax-followed',100+person.traits.loyalty*.1);add('09D-governor-followed',95+V.restraint*5);
  }else if(!success){if(pre)add('09D1-governor-check-failed',110+C*.1);add('09D-governor-check-failed',100+V.humour*3);}
 }
 return rows.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
function wholeUnits(rows){return rows.filter(r=>!COUNSEL_BY_ID[r.templateId].lines||COUNSEL_BY_ID[r.templateId].lines.every((_,index)=>rows.some(other=>other.unitKey===r.unitKey&&other.lineIndex===index)));}
export function commitAdvice(before,state,entry,scene,result){
 const capture=capturedAdvice(result),outcome=actionOutcome(entry);
 if(!capture||!outcome||!before.narrative||!same(capture.finalPlan,outcome.plan))return;
 const rows=wholeUnits(capture.rows);if(!rows.length)return;
 const n=state.narrative,units=new Map(),records=[];
 scene.advice={version:1,context:{...copy(capture.context),chinaOfficeBefore:before.chinaOffice},report:copy(capture.report),statementIds:[]};
 for(const [index,row]of rows.entries()){
  const semantics=semanticsFor(row.templateId,row.lineIndex);if(!semantics)continue;
  const id=entry.incident.id+':advice-'+index;
  if(!units.has(row.unitKey))units.set(row.unitKey,entry.incident.id+':advice-unit-'+units.size);
  const record={id,type:'advice',incidentId:entry.incident.id,speakerId:row.speakerId,speaker:capture.context.people[row.speakerId].name,institutionId:row.institutionId,role:row.role,templateId:row.templateId,lineIndex:row.lineIndex,unitId:units.get(row.unitKey),text:row.text,actionKind:row.plan.kind,plan:row.plan,armyId:row.plan.army||null,targetIds:row.plan.kind==='deploy'?[row.plan.target]:row.plan.kind==='governor'?[row.plan.region]:row.plan.purpose==='order'?[row.plan.order]:['china-office'],stance:semantics.stance,qualification:copy(semantics.qualification),confidenceTone:semantics.confidenceTone,recommendedEffect:semantics.stance==='prefer-effect'?intendedEffect(row.plan):null,utterancePhase:row.utterancePhase,shownInAttempt:row.shownInAttempt,visibility:'participating-company',audienceIds:rows.filter(other=>other.unitKey===row.unitKey&&other.speakerId!==row.speakerId).map(other=>other.speakerId),publicEvidence:row.publicEvidence,evidence:entry.incident.facts.map((f,i)=>({incidentId:entry.incident.id,factKey:'fact-'+i})),outcomeKind:outcome.kind,selectedEffect:outcome.selectedEffect,followedStatus:'not-applicable/unknown',responseLineId:null};
  record.followedStatus=followedStatus(record,outcome);n.statements[id]=record;scene.advice.statementIds.push(id);records.push(record);
  const c=n.characters[row.speakerId];if(!c.incidents.includes(entry.incident.id))c.incidents.push(entry.incident.id);
 }
 const responses=[],spoken=new Set();
 for(const record of records){
  if(spoken.has(record.speakerId)||responses.length>=2)continue;
  const candidate=outcomeCandidates(record,outcome,capture.context.people[record.speakerId])[0];if(!candidate)continue;
  const authored=ADVICE_OUTCOME_BY_ID[candidate.id],id=entry.incident.id+':advice-response-'+responses.length;
  responses.push({id,templateId:authored.id,text:authored.text,speakerId:record.speakerId,speaker:record.speaker,role:record.role,emotion:outcome.kind==='catastrophe'?'sober':authored.voice,incidentId:entry.incident.id,evidence:copy(record.evidence),callbackMemoryIds:[],callbackStatementIds:[],adviceIds:[record.id],provenance:'Authored immediate subjective adviser reaction'});
  record.responseLineId=id;record.interpretation={kind:'subjective-response',lineId:id};spoken.add(record.speakerId);
 }
 scene.lines.splice(1,0,...responses);
}

function beforeFrame(state,entry,context){
 const index=state.history.indexOf(entry),regions=copy(context.board);
 // Debug setup edits have no canonical before/after incident. Retain the actual
 // public observation once per action instead of letting later edits rewrite it.
 return {...state,regions,turn:entry.turn,gameEnd:null,indiaPhase:null,parliamentFinishedTurn:null,eventStack:null,laws:entry.incident.laws.before,elephant:entry.incident.elephant.before,chinaOffice:context.chinaOfficeBefore,history:state.history.slice(0,index),narrative:{...state.narrative,characters:{...state.narrative.characters,...context.people}}};
}
export function validateAdviceHistory(state){
 const n=state.narrative,linked=new Set();
 for(const [index,entry]of state.history.entries()){
  const a=entry.narrative?.advice;if(!a)continue;
  assert(a.version===1&&a.context&&a.context.people&&Array.isArray(a.statementIds)&&a.statementIds.length>0&&a.statementIds.length<=12,'scene advice format');
  const outcome=actionOutcome(entry);assert(outcome&&a.report&&Number.isInteger(a.report.sequence)&&a.report.sequence>0,'real supported action/report');
  assert(a.report.outcome===outcome.kind,'actual outcome must match reported result');
  assert(a.context.board&&same(Object.keys(a.context.board).sort(),Object.keys(state.regions).sort()),'observed board identity');
  for(const r of Object.values(a.context.board))assert(Object.keys(r).sort().join(',')==='control,empireCapital,lootAvailable,orders,overlord,presidency,strength,unrest'&&['company','indian'].includes(r.control)&&Number.isInteger(r.strength)&&r.strength>=0&&Number.isInteger(r.unrest)&&r.unrest>=0&&typeof r.empireCapital==='boolean'&&typeof r.lootAvailable==='boolean'&&Object.values(r.orders).every(v=>typeof v==='boolean'),'public board snapshot fields');
  for(const change of entry.incident.changes)assert(same(a.context.board[change.region],change.before),'observation must precede canonical consequences');
  const frame=beforeFrame(state,entry,a.context),p=a.context.publicKnowledge;
  assert(p&&same(p.elephant,entry.incident.elephant.before)&&Object.keys(p.regions).length===8&&typeof a.context.chinaOfficeBefore==='boolean','public observation frame');
  assert(Object.keys(p).sort().join(',')==='allegiances,batch,elephant,ended,regions,remaining,revealed,sepoyMultiplier,visibleBackRegion','no hidden observation fields');
  for(const [id,r]of Object.entries(frame.regions)){
   const expected={control:r.control,overlord:r.overlord,empireCapital:r.empireCapital,strength:r.strength,unrest:r.unrest,commercialOpen:Object.values(r.orders).filter(Boolean).length,commercialTotal:Object.keys(r.orders).length};
   assert(same(p.regions[id],expected),'public board must precede the real action');
  }
  assert(p.revealed===null&&p.ended===false&&p.sepoyMultiplier===(frame.laws.sepoyRecruitment?2:1)&&(p.visibleBackRegion===null||frame.regions[p.visibleBackRegion]),'public Operations context');
  const eventCounts=EVENT_TILES.reduce((m,t)=>(m[t.event]=(m[t.event]||0)+1,m),{});
  const validCounts=counts=>counts&&Object.entries(counts).every(([key,v])=>Object.hasOwn(eventCounts,key)&&Number.isInteger(v)&&v>=0&&v<=eventCounts[key]);
  assert(p.remaining===null||validCounts(p.remaining),'public remaining counts');
  assert(Array.isArray(p.allegiances)&&p.allegiances.every(a=>Object.keys(a).sort().join(',')==='capital,origin,subject'&&frame.regions[a.subject]?.overlord===a.capital&&['unknown','battle','negotiated'].includes(a.origin)),'public allegiance fields');
  assert(same(a.report.plan,JSON.parse(planKey(a.report.plan))),'canonical report plan');
  if(p.batch){assert(Object.keys(p.batch).sort().join(',')==='counts,remaining,sourceIncidentId'&&validCounts(p.batch.counts),'public batch fields');const source=state.history.findIndex(h=>h.incident?.id===p.batch.sourceIncidentId);assert(source>=0&&source<index&&state.history[source].incident.input.stackTile==='madras-shuffle'&&p.batch.remaining>0&&Object.values(p.batch.counts).reduce((a,b)=>a+b,0)===p.batch.remaining,'known batch source/count');}
  for(const [id,c]of Object.entries(a.context.people))assert(n.characters[id]&&c.id===id&&c.name===n.characters[id].name&&c.condition==='alive'&&c.role===n.characters[id].role&&c.region===n.characters[id].region&&Object.values(c.traits).every(v=>Number.isInteger(v)&&v>=0&&v<=100)&&Array.isArray(c.memoryIds)&&c.memoryIds.every(mid=>n.memories[mid]?.ownerId===id&&state.history.findIndex(h=>h.incident?.id===n.memories[mid].createdIncident)<index),'speaker snapshot and owned past');
  const records=a.statementIds.map(id=>n.statements[id]);
  for(const s of records){
   assert(s&&s.type==='advice'&&!linked.has(s.id)&&s.incidentId===entry.incident.id,'unique bound statement');linked.add(s.id);
   const unit=COUNSEL_BY_ID[s.templateId],semantics=semanticsFor(s.templateId,s.lineIndex);assert(unit?.selectable&&semantics,'approved delivered source');
   const candidate=eligiblePlanningCounsel(frame,s.plan,p).find(c=>c.templateId===s.templateId),line=candidate?.lines[s.lineIndex];
   assert(line&&line.speakerId===s.speakerId&&line.renderedText===s.text&&line.role===s.role&&s.speaker===a.context.people[s.speakerId]?.name&&same(s.publicEvidence,candidate.publicEvidence),'exact eligible observed words/person/evidence');
   const institution=s.lineIndex&&candidate.lines.length>1?'presidency:'+s.plan.army:candidate.institutionId;
   assert(s.institutionId===institution&&s.actionKind===s.plan.kind&&s.armyId===(s.plan.army||null)&&same(s.targetIds,[s.plan.target||s.plan.region||s.plan.order||'china-office']),'institution/action/target linkage');
   assert(same(s.plan,JSON.parse(planKey(s.plan))),'canonical statement plan');
   assert(['pre-check','pre-commit','post-check'].includes(s.utterancePhase)&&s.shownInAttempt&&Number.isInteger(s.shownInAttempt.sequence)&&s.shownInAttempt.sequence>0,'display provenance');
   if(s.utterancePhase==='pre-check')assert(s.shownInAttempt.method==='player-attested-before-check'&&s.shownInAttempt.sequence<a.report.sequence,'pre-check acknowledgement must precede report');
   else assert(s.shownInAttempt.method==='viewport-visible'&&(s.utterancePhase==='post-check'?s.shownInAttempt.sequence>a.report.sequence:s.shownInAttempt.sequence<a.report.sequence),'visible timing cannot be backdated');
   if(s.actionKind==='deploy'||s.actionKind==='governor')assert(same(s.plan,outcome.plan),'final attempted target must match');
   else assert(s.utterancePhase==='post-check'?same(s.plan,outcome.plan):same(s.plan,a.report.plan),'Envoy original intent vs final effect');
   assert(s.stance===semantics.stance&&same(s.qualification,semantics.qualification)&&s.confidenceTone===semantics.confidenceTone&&same(s.recommendedEffect,semantics.stance==='prefer-effect'?intendedEffect(s.plan):null),'authored stance/reservations, not hindsight');
   assert(same(s.evidence,entry.incident.facts.map((f,i)=>({incidentId:entry.incident.id,factKey:'fact-'+i}))),'canonical outcome fact references');
   assert(s.outcomeKind===outcome.kind&&same(s.selectedEffect,outcome.selectedEffect)&&s.followedStatus===followedStatus(s,outcome),'actual outcome and action-specific choice semantics');
   assert(s.visibility==='participating-company'&&same(s.audienceIds,records.filter(other=>other.unitId===s.unitId&&other.speakerId!==s.speakerId).map(other=>other.speakerId)),'no invented audience');
   if(unit.lines)assert(unit.lines.every((_,i)=>records.some(other=>other.unitId===s.unitId&&other.templateId===s.templateId&&other.lineIndex===i)),'intact delivered exchange');
   if(s.responseLineId){const line=entry.narrative.lines.find(l=>l.id===s.responseLineId),authored=ADVICE_OUTCOME_BY_ID[line?.templateId];assert(authored&&!authored.withheld&&line.speakerId===s.speakerId&&line.text===authored.text&&same(line.adviceIds,[s.id])&&outcomeCandidates(s,outcome,a.context.people[s.speakerId]).some(c=>c.id===line.templateId)&&s.interpretation?.kind==='subjective-response'&&s.interpretation.lineId===line.id,'same-attempt eligible exact response');}
  }
  for(const line of entry.narrative.lines)if(line.adviceIds)assert(records.some(s=>s.responseLineId===line.id&&same(line.adviceIds,[s.id])),'response advice link');
 }
 for(const s of Object.values(n.statements))if(s.type==='advice')assert(linked.has(s.id),'orphaned advice');
}
