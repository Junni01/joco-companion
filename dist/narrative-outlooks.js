import {EVENT_TILES,TILES,exposedRegion} from './event-stack.js';
import {OUTLOOK_TEXT} from './narrative-outlook-content.js';
const copy=v=>JSON.parse(JSON.stringify(v));
const counts=ids=>ids.reduce((c,id)=>{const type=TILES[id].event;c[type]=(c[type]||0)+1;return c;},{});
const sum=c=>Object.values(c).reduce((a,b)=>a+b,0);
const hash=s=>[...s].reduce((h,c)=>(Math.imul(h,31)+c.charCodeAt(0))>>>0,17);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const check=(ok,m)=>{if(!ok)throw Error('Invalid private outlook: '+m);};

// The ONLY deck boundary. Never copy tile IDs, hidden fronts, modifiers, positions or rebuild plans.
export function publicKnowledge(state){
 const stack=state.eventStack,remaining=counts(EVENT_TILES.map(t=>t.id));
 const revealed=stack?.pending?TILES[stack.pending.tileId].event:null;
 for(const [type,n] of Object.entries(counts(stack?.discard||[])))remaining[type]-=n;
 if(revealed)remaining[revealed]--;
 const batch=state.narrative?.foresight?.batch;
 return {regions:Object.fromEntries(Object.entries(state.regions).map(([id,r])=>[id,{control:r.control,overlord:r.overlord,empireCapital:r.empireCapital,strength:r.strength,unrest:r.unrest,commercialOpen:Object.values(r.orders).filter(Boolean).length,commercialTotal:Object.keys(r.orders).length}])),elephant:copy(state.elephant),sepoyMultiplier:state.laws.sepoyRecruitment?2:1,visibleBackRegion:exposedRegion(stack),revealed,remaining:stack?remaining:null,batch:batch?copy(batch):null,allegiances:(state.narrative?.allegiances||[]).filter(a=>!a.end).map(a=>({subject:a.subject,capital:a.capital,origin:a.origin})),ended:!!state.gameEnd};
}

// Pure forecasting consumes only the projection, not a campaign/deck object.
export function forecastRegion(p,region){
 const r=p.regions[region],{from,to}=p.elephant,a=p.regions[from],target=to&&p.regions[to];
 const strength=id=>{const cap=p.regions[id].overlord||id;return Object.entries(p.regions).filter(([key,r])=>key===cap||r.overlord===cap).reduce((n,[,r])=>n+r.strength,0);};
 const possible=type=>p.revealed===type||(p.remaining?.[type]??1)>0;
 const border=!!to&&a.control==='indian'&&!a.overlord;
 const companyPrimary=(!to&&a.control==='company')||(border&&target.control==='company');
 const issues=[];
 if(possible('crisis')){
  if(border&&from===region)issues.push(target.control==='company'?'company-frontier':strength(from)>strength(to)?'strong-attacker':'weak-attacker');
  if(border&&to===region&&r.control==='indian')issues.push(strength(from)>strength(to)?'weak-defender':'strong-defender');
  if(a.overlord&&from===region)issues.push('subject');
  if(a.overlord===region)issues.push('capital');
  if(companyPrimary&&(from===region&&!to||to===region))issues.push('company-primary');
  if(companyPrimary&&r.control==='company'&&r.unrest>0&&region!==(to||from))issues.push('company-secondary');
 }
 const batch=p.batch,climate=batch&&batch.remaining>0?(batch.counts.crisis===batch.remaining?'military':batch.counts.crisis&&batch.counts.peace?'mixed':'uncertain'):'uncertain';
 if(climate==='military')issues.push('military-climate');
 if(climate==='mixed')issues.push('mixed-climate');
 if(r.control==='company'&&r.unrest>0)issues.push('occupied-discontent');
 if(region===p.visibleBackRegion)issues.push('regional-attention');
 if(r.commercialOpen<r.commercialTotal)issues.push('commercial-disruption');
 if(r.commercialOpen>0)issues.push('commercial-access');
 return {region,issues,climate,elephant:copy(p.elephant),visibleBackRegion:p.visibleBackRegion,revealed:p.revealed,local:copy(r),attackerStrength:border?strength(from):a.strength,defenderStrength:border?(target.control==='company'?null:strength(to)):a.overlord?p.regions[a.overlord].strength:null,subjectStrength:a.overlord?a.strength:null,companyUnrestStrength:r.control==='company'?r.unrest*p.sepoyMultiplier:0,batch:batch?copy(batch):null,allegiance:p.allegiances.find(a=>a.subject===region)||null,ended:p.ended};
}

function personal(state,id){
 const c=state.narrative.characters[id],memories=c.memoryIds.map(id=>state.narrative.memories[id]).filter(m=>m&&m.region===c.region&&m.origin==='direct');
 const grievance=memories.find(m=>m.category==='company-conquest'&&m.emotionalImportance>=40);
 const causes=c.relations['institution:company']?.causes||[];
 const hostility=causes.reduce((n,c)=>n+(c.deltas.hostility||0),0),gratitude=causes.reduce((n,c)=>n+(c.deltas.gratitude||0),0);
 const helpful=memories.filter(m=>m.category==='intervention');
 return {c,grievance:grievance&&hostility>0?grievance.id:null,helpful:helpful.length>=2&&gratitude>0?helpful.slice(-2).map(m=>m.id):[],reasons:causes.slice(-3).map(c=>c.id)};
}
export function outlookCandidates(situation,person,competence){
 const {c,grievance,helpful}=person,has=key=>situation.issues.includes(key),choices=[];
 const add=(key,score)=>choices.push({key,score});
 add('watch',10);if(has('regional-attention'))add('attention',20);
 if(grievance&&situation.local.control==='company')add('grievance',45+c.traits.vindictiveness/10);
 if(grievance&&helpful.length&&situation.local.control==='company')add('qualified',60);
 const ambitious=c.traits.ambition>=60,careful=c.traits.caution>=60;
 if(has('strong-attacker'))add(ambitious?'ambition':'measured',75);
 if(has('weak-attacker'))add(ambitious&&c.confidence>=50?'bluff':'restraint',80);
 if(has('weak-defender'))add('defence',85);
 if(has('strong-defender'))add('secure',75);
 if(has('company-frontier'))add('companyFrontier',75);
 if(has('company-primary'))add('exposure',70);
 if(has('subject'))add('subject',70);if(has('capital'))add('capital',70);
 if(has('company-primary')&&situation.local.unrest>0)add('occupation',90);
 if(has('company-secondary'))add('secondary',80);
 if(has('occupied-discontent'))add('occupation',65);
 if(has('military-climate'))add(ambitious&&!careful?'opportunity':'alarm',95);
 if(has('mixed-climate'))add('mixed',68);
 if(has('commercial-disruption'))add('disruption',12);else if(has('commercial-access'))add('commerce',8);
 // Independent aptitude can miss a structural danger, without changing its legal/factual eligibility.
 if(competence<30&&c.confidence>=60&&choices.some(x=>x.score>=70))add('sanguine',100);
 return choices.sort((a,b)=>b.score-a.score||a.key.localeCompare(b.key));
}
function refresh(state,entryId=null){
 const n=state.narrative,p=publicKnowledge(state);
 for(const [region,id] of Object.entries(n.seats)){
  const person=personal(state,id),old=n.outlooks[region];
  if(person.c.condition!=='alive'){delete n.outlooks[region];continue;}
  n.foresight.aptitudes[id]??=hash(id+':'+n.rng)%101;
  const situation=forecastRegion(p,region),selected=outlookCandidates(situation,person,n.foresight.aptitudes[id])[0];
  // Same wording is legitimate. Do not churn its saved source on unrelated or routine changes.
  if(old?.characterId===id&&old.templateId===selected.key&&equal(old.context,situation))continue;
  const memoryIds=[...(person.grievance?[person.grievance]:[]),...person.helpful];
  n.outlooks[region]={version:1,visibility:'private',characterId:id,templateId:selected.key,text:OUTLOOK_TEXT[selected.key],sourceIncidentId:entryId,context:situation,personal:{traits:copy(person.c.traits),confidence:person.c.confidence,competence:n.foresight.aptitudes[id],grievance:person.grievance,helpful:person.helpful,reasonIds:person.reasons},memoryIds};
 }
}
export function initializeOutlooks(state,n){
 n.foresight={version:1,batch:null,observedIncidentId:null,aptitudes:{}};n.outlooks={};refresh({...state,narrative:n});return n;
}
export function updateOutlooks(before,state,entry){
 const n=state.narrative;if(!n)return;
 if(!n.foresight){initializeOutlooks(state,n);n.outlooks={};} // Unknown disclosure history: no reconstructed batch. Attribute new thoughts to this commit.
 const id=entry?.incident?.id||null;
 if(id&&n.foresight.observedIncidentId===id)return;
 if(entry?.kind==='correction')n.foresight.batch=null;
 else if(entry?.actionType==='stack-draw'&&state.eventStack?.pending){
  const type=TILES[state.eventStack.pending.tileId].event,b=n.foresight.batch;
  if(b){if(!b.counts[type])n.foresight.batch=null;else{b.counts[type]--;b.remaining--;if(!b.remaining)n.foresight.batch=null;}}
 }else if(entry?.actionType==='event'&&entry.incident.input.stackTile&&before.eventStack?.pending&&TILES[before.eventStack.pending.tileId].event==='shuffle'){
  const count=counts(before.eventStack.discard);n.foresight.batch=sum(count)?{counts:count,remaining:sum(count),sourceIncidentId:id}:null;
 }
 n.foresight.observedIncidentId=id;
 refresh(state,id);
}

export function validateOutlooks(state){
 const n=state.narrative;if(n.foresight===undefined&&n.outlooks===undefined)return;
 const f=n.foresight,ids=new Set(state.history.map(h=>h.incident?.id));
 const record=v=>v&&typeof v==='object'&&!Array.isArray(v);
 check(f?.version===1&&record(f.aptitudes)&&record(n.outlooks)&&Object.keys(n.outlooks).length<=8,'format');
 const source=id=>id===null||typeof id==='string'&&ids.has(id);
 check(Object.keys(f).sort().join(',')==='aptitudes,batch,observedIncidentId,version','knowledge boundary');
 check(source(f.observedIncidentId),'observation source');
 function batch(b){if(!b)return;const h=state.history.find(h=>h.incident?.id===b.sourceIncidentId);check(Object.keys(b).sort().join(',')==='counts,remaining,sourceIncidentId'&&h?.actionType==='event'&&h.incident.input.stackTile==='madras-shuffle'&&!h.incident.input.manualTest,'batch source');check(Number.isInteger(b.remaining)&&b.remaining>0&&b.remaining<=19&&sum(b.counts)===b.remaining,'batch count');for(const [t,v]of Object.entries(b.counts))check(Object.hasOwn(counts(EVENT_TILES.map(t=>t.id)),t)&&Number.isInteger(v)&&v>=0&&v<=EVENT_TILES.filter(x=>x.event===t).length,'batch composition');}
 batch(f.batch);
 for(const [id,value] of Object.entries(f.aptitudes))check(n.characters[id]?.role==='ruler'&&Number.isInteger(value)&&value>=0&&value<=100,'independent aptitude');
 for(const [region,o] of Object.entries(n.outlooks)){
  check(record(o)&&record(o.context)&&record(o.personal)&&record(o.personal.traits)&&Array.isArray(o.memoryIds)&&Array.isArray(o.personal.helpful)&&Array.isArray(o.personal.reasonIds),'saved private assessment');
  check(state.regions[region]&&o.version===1&&o.visibility==='private'&&n.characters[o.characterId]?.region===region&&o.text===OUTLOOK_TEXT[o.templateId]&&source(o.sourceIncidentId),'identity/text/source');
  check(o.context?.region===region&&Array.isArray(o.context.issues)&&Object.keys(o.context).sort().join(',')==='allegiance,attackerStrength,batch,climate,companyUnrestStrength,defenderStrength,elephant,ended,issues,local,region,revealed,subjectStrength,visibleBackRegion','public context');batch(o.context.batch);
  check(o.context.issues.every(x=>['strong-attacker','weak-attacker','weak-defender','strong-defender','company-frontier','subject','capital','company-primary','company-secondary','military-climate','mixed-climate','occupied-discontent','regional-attention','commercial-disruption','commercial-access'].includes(x)),'public issues');
  check(Object.keys(o.context.local).sort().join(',')==='commercialOpen,commercialTotal,control,empireCapital,overlord,strength,unrest'&&['company','indian'].includes(o.context.local.control),'public local context');
  check(o.context.visibleBackRegion===null||!!state.regions[o.context.visibleBackRegion],'visible back');
  check(o.context.revealed===null||EVENT_TILES.some(t=>t.event===o.context.revealed),'revealed public event');
  check(typeof o.context.ended==='boolean'&&['military','mixed','uncertain'].includes(o.context.climate),'assessment kind');
  check(o.context.climate!=='military'||o.context.batch?.counts.crisis===o.context.batch?.remaining,'military evidence');
  check(o.memoryIds.every(id=>n.memories[id]?.ownerId===o.characterId),'owned personal evidence');
  check(!o.personal.grievance||o.memoryIds.includes(o.personal.grievance)&&n.memories[o.personal.grievance]?.category==='company-conquest','conquest interpretation');
  check(o.personal.helpful.every(id=>o.memoryIds.includes(id)&&n.memories[id]?.category==='intervention'),'helpful experience');
  check(o.personal.reasonIds.every(id=>Object.values(n.characters[o.characterId].relations).some(r=>r.causes.some(c=>c.id===id))),'personal reasons');
  const c={...n.characters[o.characterId],traits:o.personal.traits,confidence:o.personal.confidence};
  check(o.personal.competence===f.aptitudes[o.characterId]&&outlookCandidates(o.context,{c,grievance:o.personal.grievance,helpful:o.personal.helpful},o.personal.competence)[0].key===o.templateId,'eligible selection');
 }
}
