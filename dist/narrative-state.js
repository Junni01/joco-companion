import {POLITICAL_VERSION,DIMENSIONS,POLICY} from './narrative-policy.js';
import {evidenceIndex,resolveFact} from './narrative-evidence.js';
const check=(ok,message)=>{if(!ok)throw Error('Invalid narrative evidence: '+message);};
const score=n=>Number.isInteger(n)&&n>=0&&n<=100;
const record=o=>o&&typeof o==='object'&&!Array.isArray(o);
const text=s=>typeof s==='string'&&s.length<=5000;
function matches(category,f){
 if(category==='statement')return true;
 if(category==='company-conquest'||category==='company-loss'||category==='intervention')return f.type===category;
 if(category==='subordination')return f.type==='join';
 if(category==='released')return f.type==='release';
 if(category.startsWith('rebellion-'))return f.type==='battle'&&f.kind==='rebellion'&&f.won===(category==='rebellion-won');
 if(category.startsWith('deployment-'))return f.type==='deployment'&&f.outcome===(category==='deployment-catastrophe'?'catastrophe':'failure');
 if(category==='company-defence')return f.type==='battle'&&f.kind==='company-defence'&&f.won;
 if(category==='administration')return f.type==='unrest';
 if(category==='tax-repeat')return (f.type==='tax'&&f.ordinal>1&&f.mode!=='general')||(f.type==='unrest'&&f.reason==='tax');
 if(category==='tax')return f.type==='tax'||(f.type==='unrest'&&f.reason==='tax');
 return false;
}
export function validatePoliticalMemory(state){
 const n=state.narrative;
 check(n.version===POLITICAL_VERSION&&n.policyVersion===POLICY.id,'unsupported current development narrative version');
 check(record(n.memories)&&record(n.statements)&&Array.isArray(n.arcs)&&n.arcs.length===0,'memory/statement collections; arc generation is deferred');
 check(Array.isArray(state.history),'canonical history collection');
 for(const h of state.history){check(record(h),'history entry');if(h.incident)check(record(h.incident)&&Array.isArray(h.incident.facts)&&h.incident.facts.every(f=>record(f)&&typeof f.type==='string'&&(!f.region||state.regions[f.region])),'canonical incident facts');}
 const index=evidenceIndex(state),ids=new Set(),sceneOrders=new Map();
 for(const [order,h] of state.history.entries()){
  if(h.incident){check(typeof h.incident.id==='string'&&!ids.has(h.incident.id),'duplicate incident ID');ids.add(h.incident.id);check(h.incident.facts.every((f,i)=>f.factId==='fact-'+i),'stable fact identity');}
  if(h.narrative)check(h.incident?.id===h.narrative.id,'scene must reference its actual committed incident');
  if(h.narrative)sceneOrders.set(h.narrative.id,order);
 }
 function refs(evidence,maxOrder){check(Array.isArray(evidence),'fact references');for(const r of evidence){const resolved=resolveFact(index,r);check(resolved&&resolved.order<=maxOrder,'dangling or future fact reference');}}
 for(const c of Object.values(n.characters)){
  check(Array.isArray(c.memoryIds)&&new Set(c.memoryIds).size===c.memoryIds.length&&c.memoryIds.every(id=>n.memories[id]?.ownerId===c.id),'character memory ownership');
  check(c.incidents.every(id=>ids.has(id)),'personal incident journal source');
  check(score(c.confidence)&&record(c.voice)&&['formality','directness','restraint','humour'].every(k=>Number.isInteger(c.voice[k])&&c.voice[k]>=0&&c.voice[k]<=3),'voice/confidence');
  check(c.pacing&&Number.isInteger(c.pacing.relevant)&&c.pacing.relevant>=0&&Number.isInteger(c.pacing.lastAppearance)&&c.pacing.lastAppearance<=c.pacing.relevant&&Array.isArray(c.pacing.templates)&&Array.isArray(c.pacing.phrases)&&record(c.pacing.callbacks),'saved pacing');
  check(Number.isInteger(c.pacing.lastCallbackAt)&&c.pacing.lastCallbackAt<=c.pacing.relevant,'callback clock');
  for(const p of c.pacing.templates)check(text(p.id)&&Number.isInteger(p.at)&&p.at<=c.pacing.relevant,'template pacing');
  for(const p of c.pacing.phrases)check(text(p.family)&&Number.isInteger(p.at)&&p.at<=c.pacing.relevant,'phrase pacing');
  for(const [key,v] of Object.entries(c.pacing.callbacks))check((n.memories[key]||n.statements[key])&&Number.isInteger(v.at)&&v.at>=0&&v.at<=c.pacing.relevant&&v.cooldown===POLICY.memoryCooldown&&ids.has(v.incidentId),'callback pacing source');
  check(c.development&&Array.isArray(c.development.strongExperiences)&&c.development.strongExperiences.every(id=>ids.has(id))&&Array.isArray(c.development.changes),'development records');
  for(const change of c.development.changes)check(Object.hasOwn(c.traits,change.trait)&&Number.isInteger(change.delta)&&Math.abs(change.delta)<=2&&change.incidentIds.every(id=>ids.has(id)),'trait cause');
  for(const relation of Object.values(c.relations)){
   check(relation.target&&((relation.target.kind==='institution'&&relation.target.id==='company')||(relation.target.kind==='character'&&n.characters[relation.target.id])),'relationship target');
   check(Array.isArray(relation.causes)&&relation.origins.every(id=>ids.has(id)),'relationship source');
   for(const cause of relation.causes){const order=index.incidents.get(cause.incidentId)?.order;check(order!==undefined&&cause.memoryIds.every(id=>n.memories[id]?.ownerId===c.id&&index.incidents.get(n.memories[id].createdIncident)?.order<=order)&&cause.statementIds.every(id=>n.statements[id]&&index.incidents.get(n.statements[id].incidentId)?.order<=order)&&record(cause.deltas)&&Object.entries(cause.deltas).every(([d,v])=>DIMENSIONS.includes(d)&&Number.isInteger(v))&&text(cause.reason),'relationship cause');}
  }
 }
 for(const [id,m] of Object.entries(n.memories)){
  const created=index.incidents.get(m.createdIncident);check(m.id===id&&created&&n.characters[m.ownerId]?.memoryIds.includes(id),'memory identity/source');
  check(['direct','indirect','statement','inherited'].includes(m.origin)&&state.regions[m.region]&&Array.isArray(m.relatedCharacterIds)&&m.relatedCharacterIds.every(id=>n.characters[id]),'memory provenance');
  check(score(m.historicalSignificance)&&score(m.emotionalImportance)&&text(m.emotion)&&m.interpretation?.version===1&&['opinion','suspicion','supported-observation'].includes(m.interpretation.kind)&&text(m.interpretation.text),'memory interpretation/scores');
  refs(m.evidence,created.order);check(m.evidence.length>0&&m.evidence.some(r=>matches(m.category,resolveFact(index,r).fact)),'memory category factual predicate');
  check(m.evidence.every(r=>resolveFact(index,r).fact.region===m.region),'memory region factual predicate');
  check(Array.isArray(m.statementIds)&&m.statementIds.every(id=>n.statements[id]),'memory statement source');
  for(const update of m.updates){const source=index.incidents.get(update.incidentId);check(source&&source.order>=created.order&&Number.isInteger(update.delta)&&text(update.kind),'memory update source');refs(update.evidence,source.order);}
  if(m.currentAssessment){const source=index.incidents.get(m.currentAssessment.incidentId);check(source&&source.order>=created.order&&m.currentAssessment.kind==='opinion'&&text(m.currentAssessment.text),'current assessment');refs(m.currentAssessment.evidence,source.order);}
 }
 for(const [id,s] of Object.entries(n.statements)){
  const source=index.lines.get(s.lineId);check(s.id===id&&source&&s.incidentId===source.entry.incident.id&&s.text===source.line.text&&s.speakerId===source.line.speakerId&&source.line.statementId===id,'exact saved statement');
  check(['assurance','gratitude','threat','insult','promise'].includes(s.type)&&s.audienceIds.every(id=>n.characters[id]),'statement type/audience');refs(s.evidence,source.order);
 }
 const lineIds=new Set();
 for(const chapter of n.chapters)check(chapter.incidents.every(id=>ids.has(id)),'chapter source');
 for(const [order,h] of state.history.entries())for(const l of h.narrative?.lines||[]){
  check(typeof l.id==='string'&&!lineIds.has(l.id),'duplicate line ID');lineIds.add(l.id);refs(l.evidence,order);
  check(Array.isArray(l.callbackMemoryIds)&&Array.isArray(l.callbackStatementIds),'callback fields');
  for(const id of l.callbackMemoryIds){const m=n.memories[id];check(m&&m.ownerId===l.speakerId&&index.incidents.get(m.createdIncident).order<order,'dangling, future or unknown memory callback');}
  for(const id of l.callbackStatementIds){const s=n.statements[id];check(s&&index.incidents.get(s.incidentId).order<order&&(s.speakerId===l.speakerId||s.audienceIds.includes(l.speakerId)),'dangling, future or unknown quotation');check(l.text.includes(s.text),'quotation must preserve exact saved wording');}
  if(l.replyToLineId){const reply=index.lines.get(l.replyToLineId);check(reply&&reply.order===order&&lineIds.has(l.replyToLineId)&&n.statements[l.replyToStatementId]?.lineId===l.replyToLineId,'reply must follow an actual saved line');}
 }
}
