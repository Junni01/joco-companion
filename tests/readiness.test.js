import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {initialState,clone,validate,encode,decode} from '../dist/model.js';
import {createNarrative} from '../dist/narrative.js';
import {successionReadiness,regionalReadiness,exceptionalSuccessionContract} from '../dist/narrative-readiness.js';
import {recognizeTestHeir,introduceTestCourtCandidate,planCourtCandidate,applyTestEmergencySuccession} from '../dist/narrative-court.js';
import {incidentReferences,assertHistoryDeletionAllowed} from '../dist/narrative-evidence.js';
import {applyTestSuccession,selectSuccessor} from '../dist/narrative-succession.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {characterCampaign,legacyCampaign,statusFixture} from './character-engine-fixtures.js';
import {successionFixture,successionDemos,requestFor,TEST_AUTH,advanceTestTurn} from './succession-fixtures.js';
import {readinessFixtures} from './dynasty-model-fixtures.js';
import {courtDemos,recognizeRequest,candidateRequest,emergencyRequest} from './readiness-fixtures.js';
const board=s=>{const c=clone(s);delete c.narrative;delete c.history;delete c.incidentSequence;return c;};

test('untouched version-2 and legacy saves have eight needs-documentation reports, never automatic heirs',()=>{
 for(const s of [characterCampaign(),legacyCampaign()]){const before=encode(s);const report=regionalReadiness(s);assert.equal(Object.keys(report).length,8);for(const r of Object.values(report)){assert.equal(r.status,'needs-documentation');assert(!r.transactionReady);assert.equal(r.documentationOptions.length,1);assert.equal(r.decision.status,'none');assert(r.documentationOptions[0].evidence.some(e=>e.kind==='existing-legacy-family'));}assert.equal(encode(s),before);}
});
test('readiness distinguishes adults/minors, ties, absent regents, active tenure and cross-region structural blocks',()=>{
 const f=readinessFixtures();assert.equal(successionReadiness(f.adult,'delhi').status,'ready-adult');assert.equal(successionReadiness(f.minor,'delhi').status,'ready-minor-with-regent');assert.equal(successionReadiness(f.tied,'delhi').status,'contested');assert(successionReadiness(f['minor-no-regent'],'delhi').blockers.includes('no-eligible-regent'));
 const active=successionReadiness(f['active-regency'],'delhi');assert.equal(active.status,'blocked-regency');assert(!active.transactionReady);assert(courtDemos().diagnostics.cross.blockers.includes('blocked-cross-region'));
});
test('multiple regents are a tenure-choice block; rejected alternative claimants do not block a valid selected adult',()=>{
 const f=readinessFixtures().minor,origin=clone(f.narrative.claimsV2.find(c=>c.id==='child-claim').origin);f.narrative.familyLinks.push({id:'second-guardian',type:'guardian',fromId:'demo-former-spouse',toId:'demo-child',origin,ages:{from:45,to:12}});validate(f);assert.equal(successionReadiness(f,'delhi').status,'blocked-regency-choice');
 const adult=successionReadiness(successionFixture(),'delhi',{basisPriority:['designation']});assert.equal(adult.status,'ready-adult');assert.equal(adult.transactionReady,true);assert.deepEqual(adult.blockers,[]);assert(adult.candidateBlockers.length>0);
});
test('recognition is a current witnessed designation, preserves all old people/family/board/RNG and claims nobody is a child',()=>{
 const s=characterCampaign(),r=recognizeTestHeir(s,recognizeRequest(s),TEST_AUTH);assert.deepEqual(board(r),board(s));assert.deepEqual(r.narrative.seats,s.narrative.seats);assert.equal(r.narrative.rng,s.narrative.rng);assert.equal(Object.keys(r.narrative.characters).length,23);assert(!s.narrative.claimsV2);assert(!r.narrative.familyLinks);assert.equal(successionReadiness(r,'delhi').status,'ready-adult');
 const claim=r.narrative.claimsV2[0];assert.equal(claim.basis,'designation');assert.equal(claim.origin.source.incidentId,r.history.at(-1).incident.id);assert.equal(r.narrative.courtRecords[0].authorityId,'ruler-delhi');
 for(const id of Object.keys(s.narrative.characters)){const a=clone(s.narrative.characters[id]),b=clone(r.narrative.characters[id]);delete a.incidents;delete b.incidents;assert.deepEqual(a,b);}assert.deepEqual(decode(encode(r)).state,r);
});
test('replay is stable, conflicting recognition/duplicate claim is rejected with no changes',()=>{
 const s=characterCampaign(),q=recognizeRequest(s),r=recognizeTestHeir(s,q,TEST_AUTH),bytes=encode(r);assert.equal(recognizeTestHeir(r,q,TEST_AUTH),r);for(const next of [{...q,purpose:'changed'},{...q,id:'second'}])assert.throws(()=>recognizeTestHeir(r,next,TEST_AUTH));assert.throws(()=>introduceTestCourtCandidate(r,q,TEST_AUTH));assert.equal(encode(r),bytes);
});
test('existing compatible unrecognised dormant claim is explicitly re-recognised with prior snapshot and status provenance',()=>{
 // Use a genuine M2A fixture claim, not a retroactively edited recognition.
 const f=successionFixture();f.narrative.claimsV2=[{id:'prior-designation',claimantId:'heir-delhi',region:'delhi',basis:'designation',standing:'unrecognised',status:'dormant',origin:{turn:f.turn,source:{setup:true},reason:'Explicit test prior designation'},support:{},statusHistory:[]}];
 const q={...recognizeRequest(f),id:'re-recognition',priorClaimId:'prior-designation'};const r=recognizeTestHeir(f,q,TEST_AUTH);assert.equal(r.narrative.claimsV2[0].status,'asserted');assert.equal(r.narrative.claimsV2[0].standing,'recognised');assert.equal(r.narrative.courtRecords[0].priorClaim.status,'dormant');assert.equal(r.narrative.claimsV2[0].statusHistory[0].origin.source.incidentId,r.history.at(-1).incident.id);
});
test('recognition refuses bad authority, unknown/dead/unavailable/foreign/adviser/occupied candidates and fake family bases',()=>{
 const s=statusFixture(),bytes=encode(s),q=recognizeRequest(s);for(const patch of [{authorityId:'ruler-punjab'},{characterId:'unknown'},{characterId:'heir-delhi'},{characterId:'heir-bombay'},{characterId:'secretary-bengal'},{characterId:'ruler-delhi'},{characterId:'heir-bengal'},{basis:'parentage',characterId:'heir-madras'}])assert.throws(()=>recognizeTestHeir(s,{...q,...patch},TEST_AUTH));assert.throws(()=>recognizeTestHeir(s,q));assert.equal(encode(s),bytes);
});
test('introduction prefers known people, rejects Company policy, and introduces only explicit adult synthetic minister',()=>{
 const s=statusFixture(),r=introduceTestCourtCandidate(s,candidateRequest(s),TEST_AUTH),c=r.narrative.characters['synthetic-court-delhi'];assert.equal(planCourtCandidate(characterCampaign(),'delhi').status,'reuse-needs-recognition');assert.throws(()=>introduceTestCourtCandidate(characterCampaign(),candidateRequest(characterCampaign()),TEST_AUTH));assert.equal(c.politicalRole.kind,'minister');assert.equal(r.narrative.seats.delhi,s.narrative.seats.delhi);assert.equal(c.introduction.kind,'introduced');assert.equal(c.introduction.age,28);for(const k of ['family','claims','memoryIds','politicalHistory','conditionHistory'])assert.deepEqual(c[k],[]);assert.deepEqual(c.relations,{});assert(!c.dynastyId);assert.equal(courtDemos().diagnostics.minister.status,'ready-adult');assert.deepEqual(board(s),board(r));
 const company=initialState('1813');company.narrative=createNarrative(company,717);
 const q={...candidateRequest(s),region:'bengal',authorityId:'ruler-bengal'};assert.throws(()=>introduceTestCourtCandidate(company,q,TEST_AUTH),/Company/);
});
test('bad synthetic candidate payloads, duplicate IDs and invented histories cannot be introduced',()=>{
 const s=statusFixture(),q=candidateRequest(s),before=encode(s);for(const patch of [{age:17},{age:101},{name:'Cultural Name Claim'},{id:'ruler-delhi'},{family:[{id:'ruler-delhi',tie:'father'}]},{memoryIds:['old-memory']}])assert.throws(()=>introduceTestCourtCandidate(s,{...q,candidate:{...q.candidate,...patch}},TEST_AUTH));assert.equal(encode(s),before);const r=introduceTestCourtCandidate(s,q,TEST_AUTH);assert.equal(introduceTestCourtCandidate(r,q,TEST_AUTH),r);
});
test('emergency fallback is one returned atomic boundary, linked introduction then sourced death/accession; exact reload/Undo/Redo',()=>{
 const s=statusFixture(),q=emergencyRequest(s),r=applyTestEmergencySuccession(s,q,TEST_AUTH);assert.equal(s.narrative.characters['ruler-delhi'].condition,'alive');assert.equal(r.narrative.characters['ruler-delhi'].condition,'dead');assert.equal(r.narrative.seats.delhi,q.candidate.id);assert.equal(r.history.length,s.history.length+2);assert.equal(r.narrative.successionRecords[0].request.courtRecordId,r.narrative.courtRecords[0].id);assert.equal(applyTestEmergencySuccession(r,q,TEST_AUTH),r);assert.deepEqual(board(s),board(r));assert.deepEqual(decode(encode(r)).state,r);
 const u=undoFrame(r,null,[s],[null],[]);assert.deepEqual(u.state,s);const redo=redoFrame(u.state,u.progress,u.undo,u.undoProgress,u.redo);assert.deepEqual(redo.state,r);
});
test('failed emergency discards introductions/claims/death, requires independent warrant and reuses a documented sibling',()=>{
 const s=statusFixture(),before=encode(s),q=emergencyRequest(s);for(const bad of [{...q,warrant:null},{...q,exit:'lost-battle'},{...q,authorityId:'ruler-punjab'},{...q,candidate:{...q.candidate,age:8}}])assert.throws(()=>applyTestEmergencySuccession(s,bad,TEST_AUTH));assert.equal(encode(s),before);
 const original=characterCampaign(),request={...emergencyRequest(original)};delete request.candidate;const r=applyTestEmergencySuccession(original,request,TEST_AUTH);assert.equal(Object.keys(r.narrative.characters).length,23);assert.equal(r.narrative.seats.delhi,'heir-delhi');assert.throws(()=>applyTestEmergencySuccession(original,emergencyRequest(original),TEST_AUTH));
});
test('new source/provenance/claim/identity tampering and orphaned court registry are rejected; source deletion is guarded',()=>{
 const d=courtDemos();for(const state of [d.recognized,d.minister,d.emergency]){const record=state.narrative.courtRecords[0];assert(incidentReferences(state,record.origin.source.incidentId).length);assert.throws(()=>assertHistoryDeletionAllowed(state,[record.origin.source.incidentId]));for(const mutate of [s=>delete s.narrative.courtRecords,s=>s.narrative.courtRecords[0].authorityId='ruler-punjab',s=>s.narrative.courtRecords[0].origin.source.incidentId='missing',s=>s.narrative.claimsV2[0].standing='unrecognised',s=>s.history.find(h=>h.actionType==='test-court').incident.facts=[]]){const bad=clone(state);mutate(bad);assert.throws(()=>validate(bad));}}
 const bad=clone(d.minister);bad.narrative.characters['synthetic-court-delhi'].name='Changed identity';assert.throws(()=>validate(bad));
});
test('minor recognition keeps titular eligibility distinct from separate regent and normal ageing never triggers succession',()=>{
 const f=readinessFixtures().minor,r=successionReadiness(f,'delhi');assert.equal(r.decision.chosen.regentId,'demo-widow');const s=characterCampaign(),aged=advanceTestTurn(s);assert.equal(Object.keys(aged.narrative.characters).length,23);assert(!aged.narrative.courtRecords);assert(!aged.narrative.claimsV2);assert.deepEqual(aged.narrative.seats,s.narrative.seats);
});
test('introduced and emergency identities survive actual later ageing without inheriting private outlooks',()=>{
 const d=courtDemos();for(const [s,id]of [[d.minister,'synthetic-court-delhi'],[d.emergency,'synthetic-emergency-delhi']]){const r=advanceTestTurn(s);assert.equal(r.narrative.characters[id].age,s.narrative.characters[id].age+3);assert.deepEqual(decode(encode(r)).state,r);assert.equal(r.narrative.rng>=0,true);if(r.narrative.outlooks.delhi)assert.equal(r.narrative.outlooks.delhi.characterId,r.narrative.seats.delhi);}
});
test('vassal court candidate and controlled succession keep overlord and full board unchanged',()=>{
 const s=statusFixture(),person=s.narrative.characters['heir-punjab'],source=s.history.at(-1);person.condition='missing';person.conditionHistory=[{from:'alive',to:'missing',turn:s.turn,source:{incidentId:source.incident.id,actionType:source.actionType},reason:'Explicit synthetic absence fixture; not caused by Windfall'}];validate(s);
 const q={...candidateRequest(s),id:'punjab-court',region:'punjab',authorityId:'ruler-punjab',candidate:{id:'synthetic-punjab-court',name:'Synthetic Vassal Court Figure',age:34}},minister=introduceTestCourtCandidate(s,q,TEST_AUTH);
 const r=applyTestSuccession(minister,requestFor(minister,{id:'punjab-accession',region:'punjab',incumbentId:'ruler-punjab'}),TEST_AUTH);assert.deepEqual(board(r),board(s));assert.equal(r.regions.punjab.overlord,'delhi');assert.equal(r.narrative.characters[q.candidate.id].politicalRole.kind,'vassal-ruler');
});
test('active regency, unavailable regent, cross-region and tied-claim contracts fail without corrupting any old tenure or board',()=>{
 const d=courtDemos(),active=d.minor;active.narrative.familyLinks.push({id:'replacement-guardian',type:'guardian',fromId:'demo-former-spouse',toId:'demo-child',ages:{from:45,to:12},origin:clone(active.narrative.claimsV2.find(c=>c.id==='child-claim').origin)});validate(active);const contract=exceptionalSuccessionContract(active,'delhi');assert(!contract.activeRegency.supported);assert(contract.activeRegency.regentReplacement.documentedAlternatives.some(a=>a.characterId==='demo-former-spouse'));const before=encode(active);assert.throws(()=>applyTestEmergencySuccession(active,emergencyRequest(active),TEST_AUTH));assert.equal(encode(active),before);
 const lost=clone(active);lost.narrative.characters['demo-widow'].condition='missing';assert.throws(()=>validate(lost));assert.throws(()=>applyTestEmergencySuccession(lost,emergencyRequest(lost),TEST_AUTH));
 const cross=d.cross;validate(cross);assert(!exceptionalSuccessionContract(cross,'delhi').crossRegion.supported);assert.throws(()=>applyTestSuccession(cross,requestFor(cross),TEST_AUTH));assert.equal(exceptionalSuccessionContract(d.contested,'delhi').tiePolicy.supported,false);assert.equal(selectSuccessor(d.contested,'delhi').status,'ambiguous');
});
test('readiness/previews/cancel are pure, RNG-free, detached, protect pending actions and never wire into live actions or UI',()=>{
 const s=characterCampaign(),gap=statusFixture(),before=encode(s),random=Math.random,desc=Object.getOwnPropertyDescriptor(globalThis,'crypto');try{Math.random=()=>assert.fail('RNG');Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(){assert.fail('crypto');}}});const r=successionReadiness(s,'delhi');r.documentationOptions[0].evidence[0].tie='changed';recognizeTestHeir(s,recognizeRequest(s),TEST_AUTH);assert.equal(introduceTestCourtCandidate(gap,candidateRequest(gap),TEST_AUTH).narrative.rng,gap.narrative.rng);assert.equal(applyTestEmergencySuccession(gap,emergencyRequest(gap),TEST_AUTH).narrative.rng,gap.narrative.rng);assert.equal(encode(s),before);}finally{Math.random=random;Object.defineProperty(globalThis,'crypto',desc);}
 const pending=clone(s);pending.indiaPhase={status:'events'};assert(successionReadiness(pending,'delhi').blockers.includes('protected-action-pending'));assert.throws(()=>recognizeTestHeir(pending,recognizeRequest(pending),TEST_AUTH));
 for(const file of ['app.js','actions.js','deploy.js','phase-dialog.js'])assert(!/recognizeTestHeir|introduceTestCourtCandidate|applyTestEmergencySuccession|narrative-court\.js/.test(fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8')));
});
