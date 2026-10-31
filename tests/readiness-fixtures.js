// All new events/identities here are explicit synthetic fixtures, never live setup.
import {characterCampaign,statusFixture} from './character-engine-fixtures.js';
import {successionFixture,successionDemos,TEST_AUTH} from './succession-fixtures.js';
import {recognizeTestHeir,introduceTestCourtCandidate,applyTestEmergencySuccession} from '../dist/narrative-court.js';
import {successionReadiness} from '../dist/narrative-readiness.js';
export const recognizeRequest=s=>({id:'recognize-delhi',region:'delhi',authorityId:s.narrative.seats.delhi,characterId:'heir-delhi',purpose:'Explicit witnessed synthetic sibling designation'});
export const candidateRequest=s=>({id:'court-delhi',region:'delhi',authorityId:s.narrative.seats.delhi,purpose:'Explicit synthetic minister to address a documented candidate gap',candidate:{id:'synthetic-court-delhi',name:'Synthetic Court Candidate Alpha',age:28}});
export const emergencyRequest=s=>({id:'emergency-delhi',region:'delhi',authorityId:s.narrative.seats.delhi,purpose:'Controlled future emergency; not a gameplay death',candidate:{id:'synthetic-emergency-delhi',name:'Synthetic Emergency Candidate Beta',age:32},exit:'confirmed-death',warrant:{kind:'synthetic-fixture',reason:'Independently supplied explicit test death; no board event implies this fate'}});
export function courtDemos(){
 const original=characterCampaign(),recognized=recognizeTestHeir(original,recognizeRequest(original),TEST_AUTH),gap=statusFixture();
 const minister=introduceTestCourtCandidate(gap,candidateRequest(gap),TEST_AUTH),emergency=applyTestEmergencySuccession(gap,emergencyRequest(gap),TEST_AUTH);
 const prior=successionDemos();const cross=successionFixture();cross.narrative.characters['demo-son'].region='punjab';cross.narrative.characters['demo-son'].politicalRole.region='punjab';cross.narrative.claimsV2=cross.narrative.claimsV2.filter(c=>c.id==='son-claim');
 return {original,recognized,gap,minister,emergency,minor:prior.child,contested:successionFixture(),cross,diagnostics:{original:successionReadiness(original,'delhi'),recognized:successionReadiness(recognized,'delhi'),minister:successionReadiness(minister,'delhi'),activeRegency:successionReadiness(prior.child,'delhi'),cross:successionReadiness(cross,'delhi')}};
}
