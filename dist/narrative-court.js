// Controlled fixture API only. Never imported by live actions, setup or UI.
import {validate,clone} from './model.js';
import {TRAITS} from './narrative-content.js';
import {POLICY} from './narrative-policy.js';
import {equalData,activeRegency,politicalKind} from './narrative-succession-state.js';
import {politicalRoleOf} from './narrative-characters.js';
import {successionReadiness} from './narrative-readiness.js';
import {applyTestSuccession} from './narrative-succession.js';
const fail=m=>{throw Error('Controlled court rejected: '+m);};
const named=v=>typeof v==='string'&&/^[a-z][a-z0-9-]{0,79}$/.test(v);
function authorize(a){if(a?.mode!=='synthetic-test'||typeof a.label!=='string'||!a.label.trim())fail('explicit labelled test authorization required');}
function check(s,q,a,kind){
 authorize(a);validate(s);
 if(!s.narrative||!q||!named(q.id)||!Object.hasOwn(s.regions,q.region)||typeof q.purpose!=='string'||!q.purpose.trim()||q.purpose.length>500)fail('request identity/context');
 const keys=['id','region','authorityId','purpose',...(kind==='recognition'?['characterId','basis','priorClaimId']:['candidate'])];if(Object.keys(q).some(k=>!keys.includes(k)))fail('unsupported request facts');
 const previous=s.narrative.courtRecords?.find(r=>r.id===q.id);
 if(previous){if(previous.kind!==kind||!equalData(previous.request,q))fail('conflicting repeated request');return previous;}
 if(s.gameEnd||s.eventStack?.pending||['ships','events'].includes(s.indiaPhase?.status))fail('finish protected action first');
 if(s.regions[q.region].control==='company')fail('Company court appointment policy deferred');
 const authority=s.narrative.characters[q.authorityId];
 if(!authority||s.narrative.seats[q.region]!==authority.id||authority.condition!=='alive'||politicalRoleOf(s,authority).kind!==politicalKind(s.regions[q.region])||activeRegency(s,q.region))fail('present coherent ruling authority required; active-regency contract deferred');
 return null;
}
export function planCourtCandidate(s,region){
 const r=successionReadiness(s,region);
 if(!r.courtDevelopmentAllowed)return {status:'rejected',reason:r.courtPolicyReason,readiness:r};
 if(r.blockers.some(b=>['blocked-regency','game-ended','protected-action-pending','unavailable-incumbent','incumbent-board-role-mismatch'].includes(b)))return {status:'rejected',reason:r.blockers[0],readiness:r};
 if(r.decision.status==='selected')return {status:'reuse-eligible',chosen:r.decision.chosen,readiness:r};
 if(r.decision.status==='ambiguous')return {status:'rejected',reason:'contested-no-automatic-tie-policy',readiness:r};
 if(r.blockers.includes('blocked-cross-region'))return {status:'rejected',reason:'cross-region-policy-deferred',readiness:r};
 if(r.documentationOptions.length)return {status:'reuse-needs-recognition',candidates:r.documentationOptions,readiness:r};
 // Existing unsupported/ineligible claims need policy review, not a way around them.
 if(r.decision.assessments.some(a=>a.characterId!==r.incumbentId&&s.narrative.characters[a.characterId].condition!=='dead'))return {status:'rejected',reason:'existing-claims-need-resolution',readiness:r};
 return {status:'introduction-possible',reason:'no-supported-existing-person',readiness:r};
}
function append(s,q,kind,person,prior){
 const sequence=(s.incidentSequence??s.history.length)+1,id='incident-'+sequence;
 const origin={turn:s.turn,source:{incidentId:id,actionType:'test-court'},reason:'Synthetic witnessed court: '+q.purpose};
 s.incidentSequence=sequence;s.narrative.nextIncident=Math.max(s.narrative.nextIncident,sequence+1);s.narrative.lastIncident=id;
 const record={id:q.id,testOnly:true,kind,request:clone(q),region:q.region,authorityId:q.authorityId,characterId:person.id,ageAtRecord:person.age,roleAtRecord:clone(politicalRoleOf(s,person)),claimId:prior?.id||'court-claim-'+q.id,priorClaim:prior?clone(prior):null,boardBefore:clone(s.regions[q.region]),origin};
 s.history.push({kind:'action',actionType:'test-court',title:'SYNTHETIC TEST · witnessed '+kind,turn:s.turn,input:{type:'test-court',manualTest:true,testId:q.id,request:clone(q)},incident:{version:1,id,type:'test-court',turn:s.turn,scenario:s.scenario,provenance:'manual-test',input:{type:'test-court',manualTest:true,testId:q.id,request:clone(q)},changes:[],facts:[],laws:{before:clone(s.laws),after:clone(s.laws)},elephant:{before:clone(s.elephant),after:clone(s.elephant)}},narrative:{id,turn:s.turn,lines:[],coverage:'specific',provenance:'manual-test'}});
 return record;
}
function finish(s,r,person,basis){
 const n=s.narrative;let claim=r.priorClaim?n.claimsV2.find(c=>c.id===r.claimId):null;
 if(claim){if(claim.status!=='asserted'){(claim.statusHistory??=[]).push({from:claim.status,to:'asserted',origin:clone(r.origin)});claim.status='asserted';}claim.standing='recognised';}
 else{claim={id:r.claimId,claimantId:person.id,region:r.region,basis,standing:'recognised',status:'asserted',origin:clone(r.origin),support:{},statusHistory:[]};(n.claimsV2??=[]).push(claim);}
 r.claimAfter=clone(claim);
 for(const id of [r.authorityId,person.id])if(!n.characters[id].incidents.includes(r.origin.source.incidentId))n.characters[id].incidents.push(r.origin.source.incidentId);
 if(r.kind==='introduction')r.introduced=clone(person);
 (n.courtRecords??=[]).push(r);s.history.at(-1).incident.facts.push({factId:'fact-0',type:'synthetic-court',record:clone(r)});
 s.history.at(-1).report='SYNTHETIC TEST · '+r.kind+' · '+person.name+' · '+r.region+' · no board change';return validate(s);
}
export function recognizeTestHeir(state,request,authorization){
 if(check(state,request,authorization,'recognition'))return state;
 const c=state.narrative.characters[request.characterId],basis=request.basis||'designation';
 if(!c||c.id===request.authorityId||c.region!==request.region||c.condition!=='alive'||['army','secretary'].includes(c.role)||Object.values(state.narrative.seats).includes(c.id)||state.narrative.regencies?.some(t=>!t.end&&t.regentId===c.id)||!['designation','witnessed-authority'].includes(basis))fail('candidate identity/status/region/office/basis');
 const claims=(state.narrative.claimsV2||[]).filter(k=>k.claimantId===c.id&&k.region===request.region);
 const prior=claims.find(k=>k.id===request.priorClaimId);
 if(claims.length&&(!prior||prior.basis!==basis||prior.status==='realised'||prior.status==='relinquished'||prior.standing==='recognised'&&prior.status==='asserted')||request.priorClaimId&&!prior)fail('existing claim requires a compatible explicit prior claim; no conflicting recognition');
 const s=clone(state),person=s.narrative.characters[c.id],r=append(s,request,'recognition',person,prior);return finish(s,r,person,basis);
}
export function introduceTestCourtCandidate(state,request,authorization){
 if(check(state,request,authorization,'introduction'))return state;
 const plan=planCourtCandidate(state,request.region),input=request.candidate;
 if(plan.status!=='introduction-possible')fail(plan.reason||'reuse supported existing person before introduction');
 if(!input||!named(input.id)||Object.hasOwn(state.narrative.characters,input.id)||typeof input.name!=='string'||!input.name.startsWith('Synthetic ')||input.name.length>160||!Number.isInteger(input.age)||input.age<18||input.age>100||Object.keys(input).some(k=>!['id','name','age'].includes(k)))fail('explicit synthetic adult identity only');
 const s=clone(state),person={id:input.id,name:input.name,aliases:[],region:request.region,age:input.age,dynasty:'Synthetic court; no recorded dynasty',role:'heir',condition:'alive',position:'court minister',politicalRole:{kind:'minister',region:request.region},politicalHistory:[],conditionHistory:[],mood:'watchful',traits:Object.fromEntries(TRAITS.map(t=>[t,50])),family:[],claims:[],relations:{},incidents:[],memoryIds:[],background:'Synthetic fictional court candidate introduced for a controlled test; no earlier biography is asserted.',provenance:'Synthetic test introduction; no cultural naming claim'};
 Object.assign(person,{confidence:POLICY.confidenceInitial,voice:{formality:1,directness:1,restraint:1,humour:0},pacing:{relevant:0,lastAppearance:-10,lastCallbackAt:-10,templates:[],phrases:[],callbacks:{}},development:{strongExperiences:[],changes:[],lastChangedTurn:null}});
 s.narrative.characters[person.id]=person;const r=append(s,request,'introduction',person,null);person.introduction={kind:'introduced',age:person.age,origin:clone(r.origin)};
 return finish(s,r,person,'witnessed-authority');
}
export function applyTestEmergencySuccession(state,request,authorization){
 authorize(authorization);validate(state);
 const previous=state.narrative?.successionRecords?.find(r=>r.id===request?.id);
 if(previous){if(!equalData(previous.request.emergencyRequest,request))fail('conflicting repeated emergency');return state;}
 if(!named(request?.id)||!['confirmed-death','abdication'].includes(request.exit)||request.warrant?.kind!=='synthetic-fixture'||typeof request.warrant.reason!=='string'||!request.warrant.reason.trim()||request.warrant.reason.length>500)fail('independently supplied labelled synthetic exit warrant required');
 if(Object.keys(request).some(k=>!['id','region','authorityId','purpose','candidate','exit','warrant'].includes(k))||Object.keys(request.warrant).some(k=>!['kind','reason'].includes(k)))fail('unsupported emergency facts');
 const plan=planCourtCandidate(state,request.region);let s=state;
 if(plan.status==='rejected')fail(plan.reason);
 const q={id:request.id+'-court',region:request.region,authorityId:request.authorityId,purpose:request.purpose};
 if(plan.status==='reuse-needs-recognition'){
  if(request.candidate)fail('reuse existing documented candidate');
  if(plan.candidates.length!==1)fail('multiple potential candidates require explicit controlled recognition');
  s=recognizeTestHeir(s,{...q,characterId:plan.candidates[0].characterId},authorization);
 }else if(plan.status==='introduction-possible')s=introduceTestCourtCandidate(s,{...q,candidate:request.candidate},authorization);
 else if(request.candidate)fail('reuse eligible claimant');
 // No intermediate state escapes this pure function; any failure discards every write.
 return applyTestSuccession(s,{id:request.id,region:request.region,incumbentId:request.authorityId,exit:request.exit,courtRecordId:s===state?null:q.id,emergencyRequest:clone(request)},authorization);
}
