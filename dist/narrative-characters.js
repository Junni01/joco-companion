// Character identity/fate foundations only. No fate or succession generator.
export const CONDITION_LABELS=Object.freeze({alive:'Alive',exiled:'Exiled','presumed-dead':'Presumed dead',dead:'Confirmed dead',missing:'Missing',imprisoned:'Imprisoned'});
export const POLITICAL_ROLES=Object.freeze({'sovereign-ruler':'Sovereign ruler','vassal-ruler':'Vassal ruler','company-dependent-ruler':'Company-dependent ruler',regent:'Regent',claimant:'Claimant','former-ruler':'Former ruler','family-member':'Family member',heir:'Recognised heir',minister:'Minister','court-member':'Court member',secretary:'Institutional secretary','army-adviser':'Army adviser'});
const same=(a,b)=>a?.kind===b?.kind&&a?.region===b?.region;
const ruling=new Set(['sovereign-ruler','vassal-ruler','company-dependent-ruler','regent']);
const baseRoles=new Set(['sovereign-ruler','vassal-ruler','company-dependent-ruler']);
const boardRole=b=>b.control==='company'?'company-dependent-ruler':b.overlord?'vassal-ruler':'sovereign-ruler';
const copy=v=>JSON.parse(JSON.stringify(v));
export function legacyPoliticalRole(state,c){
 const seated=state.narrative.seats[c.region]===c.id;
 const kind=c.role==='ruler'?(seated?(c.position==='retained local ruler'?'company-dependent-ruler':c.position==='subordinate ruler'?'vassal-ruler':'sovereign-ruler'):'former-ruler'):c.role==='heir'?'family-member':c.role==='army'?'army-adviser':'secretary';
 return {kind,region:c.region};
}
export const politicalRoleOf=(state,c)=>c.politicalRole||legacyPoliticalRole(state,c);
export const conditionLabel=c=>CONDITION_LABELS[c.condition];
// Called only where existing committed code already updates the same ruler's position.
export function recordPoliticalRole(before,state,entry,region){
 const c=state.narrative.characters[state.narrative.seats[region]],old=before.narrative.characters[c.id];
 let from=politicalRoleOf(before,old);const to=legacyPoliticalRole(state,c);
 if(!baseRoles.has(from.kind))return; // Regent/other explicit roles need a later approved writer.
 const actualFrom=boardRole(before.regions[region]),actualTo=boardRole(state.regions[region]);
 if(actualFrom===actualTo){
  // A test/setup may have changed the map outside a narrative commit. Synchronize
  // empty current metadata, but NEVER attribute that earlier change to this action.
  if(c.politicalRole&&!c.politicalHistory?.length)c.politicalRole=to;
  return;
 }
 if(!c.politicalHistory?.length)from={kind:actualFrom,region};
 if(same(from,to))return;
 const last=c.politicalHistory?.at(-1);if(last&&same(last.to,to)&&(entry.incident?last.source.incidentId===entry.incident.id:last.source.historyIndex===state.history.length-1))return;
 c.politicalRole=to;c.politicalHistory=[...(c.politicalHistory||[]),{from:copy(from),to:copy(to),turn:entry.turn,source:entry.incident?{incidentId:entry.incident.id,actionType:entry.actionType||entry.incident.type}:{historyIndex:state.history.length-1,actionType:entry.kind},reason:entry.kind==='correction'?'Debug setup changed the recorded regional status.':'Recorded regional control or allegiance changed.'}];
}
export function validateCharacterContinuity(before,state){
 for(const [id,c]of Object.entries(before.narrative.characters))if(c.condition==='dead'&&state.narrative.characters[id]?.condition!=='dead')throw Error('Invalid character history: confirmed death is irreversible.');
}
export function validateCharacters(state){
 const n=state.narrative,fail=m=>{throw Error('Invalid character history: '+m);},object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const role=v=>object(v)&&Object.keys(v).every(k=>['kind','region'].includes(k))&&Object.hasOwn(POLITICAL_ROLES,v.kind)&&Object.hasOwn(state.regions,v.region);
 const source=t=>{
  if(!object(t)||!Number.isInteger(t.turn)||t.turn<1||(!state.debugMode&&t.turn>state.turn)||typeof t.reason!=='string'||!t.reason.trim()||t.reason.length>1000||!object(t.source))fail('transition provenance');
  const s=t.source;let index;
  if(Object.keys(s).length===2&&typeof s.incidentId==='string'&&typeof s.actionType==='string')index=state.history.findIndex(h=>h.incident?.id===s.incidentId&&(h.actionType||h.incident.type)===s.actionType);
  else if(Object.keys(s).length===2&&Number.isInteger(s.historyIndex)&&s.actionType==='correction')index=s.historyIndex;
  const h=state.history[index];if(!h||h.turn!==t.turn||(s.historyIndex!==undefined&&h.kind!=='correction'))fail('unknown or mismatched source');return index;
 };
 for(const c of Object.values(n.characters)){
  if(!Object.hasOwn(CONDITION_LABELS,c.condition))fail('condition');
  if(['secretlyAlive','willReturn','returnPlanned','survivalResolved'].some(k=>Object.hasOwn(c,k)))fail('predetermined hidden fate');
  if(c.politicalRole!==undefined&&!role(c.politicalRole))fail('political role');
  for(const [key,current,isRole]of [['conditionHistory',c.condition,false],['politicalHistory',politicalRoleOf(state,c),true]]){
   const rows=c[key];if(rows===undefined)continue;if(!Array.isArray(rows)||rows.length>1000)fail('bounded transition history');let previous,order=-1;
   for(const t of rows){const next=source(t);if(next<=order)fail('transition order');order=next;
    if(isRole){if(!role(t.from)||!role(t.to)||same(t.from,t.to)||(previous&&!same(previous,t.from)))fail('role transition chain');}
    else if(!Object.hasOwn(CONDITION_LABELS,t.from)||!Object.hasOwn(CONDITION_LABELS,t.to)||t.from===t.to||t.from==='dead'||previous&&previous!==t.from)fail('life transition chain or confirmed-dead return');
    if(isRole&&baseRoles.has(t.from.kind)&&baseRoles.has(t.to.kind)){
     const h=state.history[next];if(h.incident){const change=h.incident.changes.find(change=>change.region===c.region);if(!change||t.from.region!==c.region||t.to.region!==c.region||boardRole(change.before)!==t.from.kind||boardRole(change.after)!==t.to.kind)fail('role transition contradicts recorded control change');}
    }
    previous=t.to;
   }
   if(rows.length&&(isRole?!same(previous,current):previous!==current))fail('current status contradicts history');
  }
  const seat=n.seats[c.region]===c.id;
  if(seat&&(c.condition!=='alive'||c.politicalRole&&!ruling.has(c.politicalRole.kind)))fail('active ruler must be alive and hold a ruling role');
  if(c.politicalRole&&ruling.has(c.politicalRole.kind)&&(!seat||c.politicalRole.region!==c.region||c.condition!=='alive'))fail('political office contradicts seat');
 }
}
