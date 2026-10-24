export function evidenceIndex(state){
 const incidents=new Map(),facts=new Map(),lines=new Map();
 state.history.forEach((h,order)=>{
  if(h.incident){incidents.set(h.incident.id,{entry:h,order});h.incident.facts.forEach((f,i)=>facts.set(`${h.incident.id}/fact-${i}`,{fact:f,entry:h,order}));}
  for(const l of h.narrative?.lines||[])if(l.id)lines.set(l.id,{line:l,entry:h,order});
 });return {incidents,facts,lines};
}
export function factRef(entry,index){return {incidentId:entry.incident.id,factKey:`fact-${index}`};}
export function resolveFact(index,ref){return index.facts.get(`${ref.incidentId}/${ref.factKey}`);}
export function incidentReferences(state,id){
 const n=state.narrative;if(!n)return [];const found=[];
 for(const m of Object.values(n.memories||{}))if(m.evidence.some(r=>r.incidentId===id))found.push(`Memory ${m.id} (${n.characters[m.ownerId]?.name||m.ownerId})`);
 for(const s of Object.values(n.statements||{}))if(s.incidentId===id)found.push(`Statement ${s.id}`);
 for(const c of Object.values(n.characters))for(const relation of Object.values(c.relations))for(const cause of relation.causes||[])if(cause.incidentId===id)found.push(`Relationship cause ${cause.id} (${c.name})`);
 for(const h of state.history)for(const l of h.narrative?.lines||[])if([...(l.evidence||[]),...(l.selectionEvidence||[])].some(r=>r.incidentId===id)||(l.callbackMemoryIds||[]).some(mid=>n.memories[mid]?.evidence.some(r=>r.incidentId===id))||(l.callbackStatementIds||[]).some(sid=>n.statements[sid]?.incidentId===id))found.push(`Saved line ${l.id}`);
 for(const c of Object.values(n.characters))for(const change of c.development?.changes||[])if(change.incidentIds.includes(id))found.push(`Trait change for ${c.name}`);
 for(const c of Object.values(n.characters))if(c.incidents.includes(id))found.push(`Personal incident journal (${c.name})`);
 for(const chapter of n.chapters)if(chapter.incidents.includes(id)||chapter.closureIncidentId===id)found.push(`Chapter ${chapter.title}`);
 for(const arc of n.arcs||[])if((arc.incidentIds||[]).includes(id))found.push(`Arc ${arc.id}`);
 return [...new Set(found)];
}
export function assertHistoryDeletionAllowed(state,ids){
 const blocks=ids.flatMap(id=>incidentReferences(state,id).map(ref=>`${id}: ${ref}`));
 if(blocks.length)throw Error('These incidents support saved narrative evidence and cannot be deleted:\n'+blocks.join('\n')+'\nUse Undo/Redo, restore a checkpoint, or reset the whole debug campaign.');
}
