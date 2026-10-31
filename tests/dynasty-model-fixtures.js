// Controlled, labelled readiness inputs; no new production setup/claims.
import {characterCampaign} from './character-engine-fixtures.js';
import {successionFixture,requestFor,TEST_AUTH} from './succession-fixtures.js';
import {selectSuccessor,applyTestSuccession} from '../dist/narrative-succession.js';
export function readinessFixtures(){
  const base=successionFixture();
  const only=(ids)=>{const s=structuredClone(base);s.narrative.claimsV2=s.narrative.claimsV2.filter(c=>ids.includes(c.id));return s;};
  const adult=only(['son-claim']),daughter=only(['founder-claim','daughter-claim']);
  const adopted=only(['founder-claim','adopted-claim']);adopted.narrative.characters['demo-adopted'].age=20;adopted.narrative.claimsV2.find(c=>c.id==='adopted-claim').standing='recognised';
  const child=only(['founder-claim','child-claim']);
  const noRegent=structuredClone(child);noRegent.narrative.familyLinks=noRegent.narrative.familyLinks.filter(l=>l.type!=='guardian');
  const elderly=characterCampaign();elderly.narrative.characters[elderly.narrative.seats.delhi].age=100;
  const active=applyTestSuccession(base,requestFor(base,{id:'model-active',choice:{characterId:'demo-child',claimId:'child-claim',regentId:'demo-widow'}}),TEST_AUTH);
  return {legacy:characterCampaign(),adult,daughter,adopted,minor:child,'minor-no-regent':noRegent,tied:base,'elderly-sole':elderly,'active-regency':active};
}
export function readinessReport(){return Object.entries(readinessFixtures()).map(([name,state])=>{
  const d=selectSuccessor(state,'delhi');const active=state.narrative.regencies?.some(t=>t.region==='delhi'&&!t.end)||false;
  return {name,evaluatorStatus:d.status,transactionReady:d.status==='selected'&&!active,block:active?'M2B-1 active-regency transaction guard':d.reason??null,chosen:d.chosen??null,assessments:d.assessments.map(a=>({id:a.characterId,eligible:a.eligible,reasons:a.reasons}))};
});}
