// Explicit test-only sources/people. Never imported by application setup/actions.
import {dynastyFixture} from './character-family-fixtures.js';
import {validate,correctRegion,clone} from '../dist/model.js';
import {commitNarrative} from '../dist/narrative.js';
import {resolveAction} from '../dist/actions.js';
import {inParliament} from './phase-fixtures.js';
import {politicalKind,positionFor} from '../dist/narrative-succession-state.js';
import {applyTestSuccession,endTestRegency} from '../dist/narrative-succession.js';
export const TEST_AUTH={mode:'synthetic-test',label:'Controlled M2B-1 fixture, not a production event'};
export function successionFixture(kind='sovereign-ruler'){
 let s=dynastyFixture();const region=kind==='sovereign-ruler'?'delhi':'bombay';
 if(region!=='delhi'){
  for(const c of Object.values(s.narrative.characters).filter(c=>c.id.startsWith('demo-'))){c.region=region;c.politicalRole.region=region;for(const t of c.politicalHistory){t.from.region=region;t.to.region=region;}}
  for(const c of s.narrative.claimsV2)c.region=region;
  s=correctRegion(s,region,kind==='company-dependent-ruler'?{control:'company',presidency:'bombay',overlord:null,lootAvailable:false}:{control:'indian',presidency:null,overlord:'delhi'});
  const c=s.narrative.characters[s.narrative.seats[region]];c.position=positionFor(kind);c.politicalRole={kind,region};
 }
 const c=s.narrative.characters[s.narrative.seats[region]],origin=clone(s.narrative.claimsV2[0].origin);s.narrative.claimsV2.push({id:'incumbent-claim',claimantId:c.id,region,basis:'previous-rulership',standing:'recognised',status:'realised',origin,support:{},statusHistory:[]});
 return validate(s);
}
export const requestFor=(s,overrides={})=>({id:'demo-adult',region:'delhi',incumbentId:s.narrative.seats.delhi,exit:'abdication',policy:{basisPriority:['designation']},...overrides});
export function advanceTestTurn(state){let s=inParliament(state);s.parliamentFinishedTurn=s.turn;return validate(commitNarrative(s,resolveAction(s,{type:'next-turn'})));}
export function successionDemos(){
 const adultBase=successionFixture(),adult=applyTestSuccession(adultBase,requestFor(adultBase),TEST_AUTH);
 const childBase=successionFixture(),child=applyTestSuccession(childBase,requestFor(childBase,{id:'demo-child',exit:'confirmed-death',choice:{characterId:'demo-child',claimId:'child-claim',regentId:'demo-widow'}}),TEST_AUTH);
 let aged=advanceTestTurn(advanceTestTurn(child));const ended=endTestRegency(aged,{id:'demo-end',regencyId:aged.narrative.regencies[0].id},TEST_AUTH);
 const disputedBase=successionFixture(),disputed=applyTestSuccession(disputedBase,requestFor(disputedBase,{id:'demo-disputed',policy:{standings:['recognised','contested'],allowDormant:true},choice:{characterId:'demo-daughter',claimId:'daughter-claim'}}),TEST_AUTH);
 const variants={};for(const kind of ['vassal-ruler','company-dependent-ruler']){const s=successionFixture(kind);variants[kind]=applyTestSuccession(s,requestFor(s,{id:'demo-'+kind,region:'bombay',incumbentId:s.narrative.seats.bombay}),TEST_AUTH);}
 return {disputedBase,disputed,adultBase,adult,childBase,child,aged,ended,...variants};
}
