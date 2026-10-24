import {POLISH_POLICY as P} from './narrative-policy.js';
// Derived at the incident boundary. No new permanent alignment attribute.
export function politicalPosture(state,character,region,incidentId=null){
 const c=typeof character==='string'?state.narrative.characters[character]:character;
 const order=new Map(state.history.map((h,i)=>[h.incident?.id,i]));
 const cut=order.get(incidentId)??state.history.length;
 const before=id=>(order.get(id)??Infinity)<cut;
 const relation=c.relations['institution:company'],scores={hostility:0,mistrust:0,gratitude:0,loyalty:0};
 const causes=(relation?.causes||[]).filter(x=>before(x.incidentId));
 for(const cause of causes)for(const key of Object.keys(scores))scores[key]+=cause.deltas[key]||0;
 const memories=c.memoryIds.map(id=>state.narrative.memories[id]).filter(m=>m.region===region&&m.origin==='direct'&&before(m.createdIncident));
 const importance=m=>m.emotionalImportance-m.updates.filter(u=>!before(u.incidentId)).reduce((sum,u)=>sum+u.delta,0);
 const grievance=memories.some(m=>['company-conquest','tax-repeat'].includes(m.category)&&importance(m)>=P.activeGrievance);
 const positive=scores.gratitude+scores.loyalty,negative=scores.hostility+scores.mistrust;
 const beneficial=causes.filter(c=>c.memoryIds.some(id=>['intervention','company-defence'].includes(state.narrative.memories[id]?.category))&&(c.deltas.gratitude||0)>0);
 const aligned=positive>=P.alignmentMinimum&&positive>=negative+P.alignmentMargin&&beneficial.length>=P.beneficialCauses&&!grievance;
 const hostile=!aligned&&(scores.hostility>=P.hostilityMinimum||grievance);
 const kind=aligned?'aligned':hostile?'hostile':'ambiguous';
 const ids=new Set([...causes.map(c=>c.incidentId),...memories.filter(m=>['company-conquest','tax-repeat'].includes(m.category)).map(m=>m.createdIncident)]);
 const evidence=state.history.flatMap(h=>ids.has(h.incident?.id)?h.incident.facts.flatMap((f,i)=>f.region===region?[{incidentId:h.incident.id,factKey:'fact-'+i}]:[]):[]);
 return {kind,evidence,scores,grievance};
}
