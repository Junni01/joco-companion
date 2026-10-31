// Pure technical assessment. No recognition, introduction, selection RNG or UI writes.
import {selectSuccessor,assessSuccessor} from './narrative-succession.js';
import {activeRegency,politicalKind} from './narrative-succession-state.js';
import {politicalRoleOf} from './narrative-characters.js';
export function documentationOptions(s,region){
 const n=s.narrative,incumbent=n.seats[region];
 return Object.values(n.characters).flatMap(c=>{
  const evidence=[];
  for(const f of c.family||[])if(f.id===incumbent&&/sibling/.test(f.tie))evidence.push({kind:'existing-legacy-family',characterId:c.id,relativeId:incumbent,tie:f.tie,provenance:c.provenance});
  for(const l of n.familyLinks||[])if(!l.end&&[l.fromId,l.toId].includes(c.id)&&[l.fromId,l.toId].includes(incumbent))evidence.push({kind:'family-link',id:l.id,origin:structuredClone(l.origin)});
  const role=politicalRoleOf(s,c);if(['minister','court-member','heir'].includes(role.kind))evidence.push({kind:'recorded-court-role',characterId:c.id,role:structuredClone(role),origin:c.introduction?.origin?structuredClone(c.introduction.origin):null});
  if(!evidence.length)return [];
  const a=assessSuccessor(s,{region,characterId:c.id});
  if(a.reasons.some(r=>r!=='no-documented-claim'))return [];
  return [{characterId:c.id,age:c.age,requiresRecognition:true,evidence}];
 }).sort((a,b)=>a.characterId.localeCompare(b.characterId));
}
export function successionReadiness(s,region,policy={}){
 if(!s.narrative||!Object.hasOwn(s.narrative.seats,region))throw Error('Readiness requires a known narrative region');
 const n=s.narrative,c=n.characters[n.seats[region]],decision=selectSuccessor(s,region,policy),options=documentationOptions(s,region),blockers=[];
 if(activeRegency(s,region))blockers.push('blocked-regency');
 if(c.condition!=='alive')blockers.push('unavailable-incumbent');
 if(politicalRoleOf(s,c).kind!==politicalKind(s.regions[region]))blockers.push('incumbent-board-role-mismatch');
 if(s.gameEnd)blockers.push('game-ended');
 if(s.eventStack?.pending||['ships','events'].includes(s.indiaPhase?.status))blockers.push('protected-action-pending');
 const candidateBlockers=decision.assessments.flatMap(a=>a.reasons.map(reason=>({characterId:a.characterId,claimId:a.claimId,reason})));
 if(decision.status!=='selected')for(const {reason} of candidateBlockers)if(['incompatible-regional-assignment','no-eligible-regent','already-holds-office'].includes(reason))blockers.push(reason==='incompatible-regional-assignment'?'blocked-cross-region':reason);
 const structural=blockers.filter(b=>!['blocked-cross-region','no-eligible-regent','already-holds-office'].includes(b));
 const transactionReady=decision.status==='selected'&&!structural.length;
 let status=decision.status==='selected'?(decision.candidate.minor?'ready-minor-with-regent':'ready-adult'):decision.status==='ambiguous'?(decision.reason==='controlled-regent-choice-required'?'blocked-regency-choice':'contested'):options.length?'needs-documentation':'needs-candidate';
 if(structural.length)status=structural[0];else if(decision.status==='none'&&!options.length&&blockers.includes('blocked-cross-region'))status='blocked-cross-region';
 return {region,incumbentId:c.id,status,transactionReady,blockers:[...new Set(blockers)],candidateBlockers,decision:structuredClone(decision),documentationOptions:options,courtDevelopmentAllowed:s.regions[region].control!=='company',courtPolicyReason:s.regions[region].control==='company'?'company-court-policy-deferred':null};
}
export const regionalReadiness=s=>Object.fromEntries(Object.keys(s.narrative.seats).map(r=>[r,successionReadiness(s,r)]));
// Explicitly unsupported transitions; presence of alternative candidates is not a tenure plan.
export function exceptionalSuccessionContract(s,region){
 const r=successionReadiness(s,region),tenure=activeRegency(s,region),alternatives=tenure?assessSuccessor(s,{region,characterId:tenure.rulerId}).regents.filter(a=>a.eligible):[];
 return {region,readiness:r,activeRegency:r.blockers.includes('blocked-regency')?{supported:false,reason:'requires-atomic-old-tenure-closure-new-seat-and-regency',regentReplacement:{supported:false,reason:'requires-sourced-unavailability-and-new-tenure-link',documentedAlternatives:alternatives}}:null,crossRegion:r.blockers.includes('blocked-cross-region')?{supported:false,reason:'requires-sourced-regional-reassignment-and-office-conflict-policy'}:null,tiePolicy:r.decision.status==='ambiguous'?{supported:false,reason:r.decision.reason,options:['approved-local-court-priority','explicit-controlled-fixture-choice'],never:['name-order','gender-default','invented-custom']}:null};
}
