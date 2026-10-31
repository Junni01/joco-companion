// Additive persisted TEST record validation only; no production transition writer.
import {originOrder} from './narrative-family.js';
import {seatAt,conditionAt} from './narrative-character-history.js';
import {equalData} from './narrative-succession-state.js';
const fail=m=>{throw Error('Invalid controlled court record: '+m);};
export function courtOrigins(s){return (s.narrative?.courtRecords||[]).flatMap(r=>[{label:'Controlled court '+r.id,origin:r.origin},...(r.priorClaim?[{label:'Prior court claim '+r.id,origin:r.priorClaim.origin}]:[])]);}
export function validateCourtState(s){
 const n=s.narrative,rows=n.courtRecords===undefined?[]:n.courtRecords;
 if(!Array.isArray(rows)||rows.length>1000)fail('bounded registry');
 const seen=new Set();let last=-1;
 for(const r of rows){
  if(!r||typeof r.id!=='string'||!r.id||seen.has(r.id)||r.testOnly!==true||!['recognition','introduction'].includes(r.kind))fail('identity/kind');seen.add(r.id);
  const at=originOrder(s,r.origin),h=s.history[at],f=h?.incident?.facts.find(f=>f.type==='synthetic-court');
  if(at<=last||h.actionType!=='test-court'||h.incident.provenance!=='manual-test'||!h.input.manualTest||!h.incident.input.manualTest||h.input.testId!==r.id||!equalData(h.input.request,r.request)||!equalData(h.incident.input.request,r.request)||!equalData(f?.record,r)||h.incident.changes.length||!equalData(h.incident.laws.before,h.incident.laws.after)||!equalData(h.incident.elephant.before,h.incident.elephant.after))fail('canonical source');last=at;
  if(r.request.id!==r.id||r.request.region!==r.region||r.request.authorityId!==r.authorityId||typeof r.request.purpose!=='string'||!r.request.purpose.trim()||r.request.purpose.length>500)fail('request/context');
  const authority=n.characters[r.authorityId],person=n.characters[r.characterId],claim=(n.claimsV2||[]).find(c=>c.id===r.claimId);
  if(!authority||!person||person.region!==r.region||r.characterId===r.authorityId||seatAt(s,r.region,h)!==r.authorityId||conditionAt(s,r.authorityId,h)!=='alive'||r.boardBefore.control==='company')fail('authority/identity');
  let board=s.regions[r.region];for(let i=s.history.length-1;i>at;i--)for(const change of s.history[i].incident?.changes||[])if(change.region===r.region)board=change.before;
  if(!equalData(board,r.boardBefore)||conditionAt(s,r.characterId,h)!=='alive'||!Number.isInteger(r.ageAtRecord)||r.ageAtRecord<0||r.ageAtRecord>person.age||['army','secretary'].includes(person.role))fail('witnessed availability/board');
  if(!claim||claim.claimantId!==r.characterId||claim.region!==r.region||!['designation','witnessed-authority'].includes(r.claimAfter.basis)||r.claimAfter.standing!=='recognised'||r.claimAfter.status!=='asserted'||!equalData(claim.origin,r.claimAfter.origin)||claim.basis!==r.claimAfter.basis||!equalData(claim.support,r.claimAfter.support))fail('recognised claim');
  const latest=rows.filter(x=>x.claimId===r.claimId).at(-1);if(latest===r&&claim.standing!==r.claimAfter.standing)fail('current standing');
  if(r.priorClaim){if(r.request.priorClaimId!==r.priorClaim.id||r.priorClaim.id!==r.claimId||originOrder(s,r.priorClaim.origin)>=at||r.priorClaim.claimantId!==r.characterId||r.priorClaim.basis!==r.claimAfter.basis||r.priorClaim.status==='realised')fail('prior claim');}
  else if(originOrder(s,claim.origin)!==at)fail('new claim source');
  if(r.claimAfter.id!==r.claimId||r.claimAfter.claimantId!==r.characterId||r.claimAfter.region!==r.region)fail('claim identity');
  if(r.claimAfter.basis!==(r.kind==='introduction'?'witnessed-authority':r.request.basis||'designation'))fail('requested basis');
  if(r.kind==='introduction'){
   const c=r.introduced;
   if(!c||c.id!==r.characterId||c.region!==r.region||c.age!==r.ageAtRecord||c.age<18||c.age>100||c.condition!=='alive'||c.politicalRole?.kind!=='minister'||!equalData(c.politicalRole,r.roleAtRecord)||c.role!=='heir'||c.introduction?.kind!=='introduced'||c.introduction.age!==c.age||!equalData(c.introduction.origin,r.origin)||!c.name.startsWith('Synthetic ')||!equalData(r.request.candidate,{id:c.id,name:c.name,age:c.age}))fail('introduction');
   for(const k of ['family','claims','memoryIds','politicalHistory','conditionHistory'])if(c[k]?.length)fail('inherited history');
   if(Object.keys(c.relations).length||c.dynastyId||c.dynastyAffiliations||c.gender||c.incidents.length!==1||c.incidents[0]!==r.origin.source.incidentId||c.pacing?.templates.length||c.pacing?.phrases.length||Object.keys(c.pacing?.callbacks||{}).length||c.development?.changes.length||c.development?.strongExperiences.length)fail('inherited identity');
   for(const k of ['id','name','region','role','traits','background','provenance','dynasty'])if(!equalData(c[k],person[k]))fail('rewritten introduced identity');
   if(person.age<c.age||!equalData(person.introduction,c.introduction))fail('introduction chronology');
  }else if(r.request.characterId!==r.characterId||r.introduced)fail('recognition identity');
 }
 for(const r of n.successionRecords||[])if(r.request?.courtRecordId){
  const court=rows.find(c=>c.id===r.request.courtRecordId),q=r.request.emergencyRequest,w=q?.warrant;
  if(!court||court.region!==r.region||court.characterId!==r.successorId||originOrder(s,court.origin)>=originOrder(s,r.origin)||q?.id!==r.id||q.region!==r.region||q.authorityId!==r.incumbentId||q.exit!==r.exit||q.purpose!==court.request.purpose||w?.kind!=='synthetic-fixture'||typeof w.reason!=='string'||!w.reason.trim()||w.reason.length>500||court.kind==='introduction'&&!equalData(q.candidate,court.request.candidate)||court.kind==='recognition'&&q.candidate)fail('emergency linkage');
 }
 for(const h of s.history)for(const f of h.incident?.facts||[])if(f.type==='synthetic-court'&&!rows.some(r=>r.origin.source.incidentId===h.incident.id))fail('orphan source');
}
