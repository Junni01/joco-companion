import {REGIONS,PRESIDENCIES,legalTargets} from './model.js';
import {operationsBlockReason,taxBlockReason} from './administration.js';
import {publicKnowledge,forecastRegion} from './narrative-outlooks.js';
import {institutionalAdviser,adviserAptitude,adviserPlanningRole} from './narrative-advisers.js';
import {COUNSEL_BY_ID} from './narrative-counsel-content.js';
const copy=v=>JSON.parse(JSON.stringify(v));
const exposure=['company-primary','company-secondary'];
// Lazy catalogue lookup avoids an initialization cycle when saved advice is validated.
const orderOwner=order=>Object.keys(REGIONS).find(id=>REGIONS[id].orders.some(([oid])=>oid===order));
const voice=(state,c)=>({A:c.traits.ambition,P:c.traits.pride,C:c.traits.caution,R:c.traits.ruthlessness,L:c.traits.loyalty,V:c.traits.vindictiveness,F:c.confidence,K:adviserAptitude(state,c),formal:c.voice.formality,restraint:c.voice.restraint,humour:c.voice.humour});
const frontierCount=(state,extra=null)=>new Set(Object.keys(state.regions).filter(id=>state.regions[id].control==='company'||id===extra).flatMap(id=>REGIONS[id].neighbors).filter(id=>state.regions[id].control!=='company'&&id!==extra)).size;

// Owned memory plus a real resolver fact is required. Generic institutional files,
// another person's recollections and manually written history titles are insufficient.
function recentDeployments(state,c,army){
 const n=state.narrative,results=[];
 for(const memoryId of c.memoryIds||[]){
  const m=n.memories[memoryId];if(!m||m.ownerId!==c.id)continue;
  const h=state.history.find(h=>h.incident?.id===m.createdIncident);
  if(!h||h.turn>state.turn||h.turn<state.turn-1)continue;
  const index=h.incident.facts.findIndex(f=>f.type==='deployment'&&f.army===army);
  if(index<0||!(m.evidence||[]).some(e=>e.incidentId===h.incident.id&&h.incident.facts.some((f,i)=>e.factKey==='fact-'+i&&f.region===h.incident.facts[index].region)))continue;
  results.push({memoryId,incidentId:h.incident.id,factKey:'fact-'+index,outcome:h.incident.facts[index].outcome});
 }
 return results;
}

// Selection sees publicKnowledge's explicit projection only for forecasts. It never
// reads undrawn faces, saved Shuffle permutations, hidden positions or narrative RNG.
export function eligiblePlanningCounsel(state,plan,projection=null){
 if(!state.narrative?.enabled||operationsBlockReason(state))return [];
 const choices=[],{kind}=plan;
 const add=(id,c,institutionId,score,stance,evidence)=>{
  if(!c||!COUNSEL_BY_ID[id]?.selectable)return;
  const entry=COUNSEL_BY_ID[id];
  choices.push({templateId:id,actionKind:kind,armyId:plan.army||null,targetIds:[plan.target||plan.order||plan.region||'china-office'],institutionId,score,stance,publicEvidence:copy(evidence),publicEvidenceIds:evidence.map(e=>e.id),lines:[{speakerId:c.id,speaker:c.name,role:adviserPlanningRole(institutionId),renderedText:entry.text}]});
 };
 if(kind==='deploy'){
  if(!PRESIDENCIES.includes(plan.army)||!legalTargets(state,plan.army).includes(plan.target))return [];
  const institution='army:'+plan.army,c=institutionalAdviser(state,institution);if(!c)return [];
  const v=voice(state,c),r=state.regions[plan.target],p=projection||publicKnowledge(state);
  const bases=Object.keys(state.regions).filter(id=>state.regions[id].control==='company'&&state.regions[id].presidency===plan.army);
  const exposed=bases.filter(id=>forecastRegion(p,id).issues.some(x=>exposure.includes(x)));
  const friendly=r.control==='company',expansion=!friendly&&!r.overlord&&bases.some(id=>REGIONS[id].neighbors.includes(plan.target));
  const defence=friendly&&(r.unrest>0||forecastRegion(p,plan.target).issues.some(x=>exposure.includes(x)));
  const evidence=[{id:'board:'+plan.target,kind:'public-board',region:plan.target,control:r.control,overlord:r.overlord,presidency:r.presidency,unrest:r.unrest},{id:'army:'+plan.army,kind:'legal-plan',army:plan.army,bases}];
  if(defence){
   if(v.C>=55||v.K>=60&&v.restraint>=2)add('09C-army-defend-professional',c,institution,80+v.C*.2+v.K*.1,'qualified',evidence);
   if(v.P>=60)add('09C-army-defend-vain',c,institution,80+v.P*.25,'qualified',evidence);
   if(v.A>=55)add('09C-army-defend-calculating',c,institution,80+v.A*.2,'encourage',evidence);
  }
  if(expansion){
   if(v.C>=55)add('09C-army-expansion-careful',c,institution,50+v.C*.2+v.restraint,'qualified',evidence);
   if(v.A>=60)add('09C-army-expansion-hungry',c,institution,50+v.A*.2+v.F*.04,'encourage',evidence);
   if(v.formal>=2&&(v.L>=45||v.C>=55))add('09C-army-expansion-bureaucratic',c,institution,50+v.formal*4+v.L*.08,'qualified',evidence);
  }
  const batch=p.batch,knownCrisis=batch&&batch.remaining>0&&batch.counts.crisis===batch.remaining;
  // An Army's own exposed Company base, not generic instability elsewhere.
  const implicated=knownCrisis&&(friendly?exposed.includes(plan.target):expansion&&exposed.length>0);
  if(implicated){
   const proof=[...evidence,{id:'public-crisis-batch',kind:'public-forecast',batch:copy(batch),elephant:copy(p.elephant),exposed}];
   if(v.C>=55||v.F<45)add('09C-army-known-danger',c,institution,120+v.C*.1,'discourage',proof);
   if(v.A>=60)add('09C-army-known-danger-predatory',c,institution,120+v.A*.1,'encourage',proof);
   // One coherent exchange, with a same-Presidency administrative interest.
   // The extra frontier is calculated from actual public adjacency/control.
   const secretary=institutionalAdviser(state,'presidency:'+plan.army);
   if(expansion&&!state.laws.governorGeneral&&v.C>=70&&v.K>=60&&secretary&&secretary.id!==c.id&&secretary.traits.ambition>=70&&secretary.traits.pride>=55&&frontierCount(state,plan.target)===frontierCount(state)+1){
    const entry=COUNSEL_BY_ID['09C-exchange-prudence-vs-glory'];
    choices.push({templateId:entry.id,actionKind:kind,armyId:plan.army,targetIds:[plan.target],institutionId:institution,score:160,stance:'disagreement',publicEvidence:[...copy(proof),{id:'additional-frontier',kind:'public-adjacency',before:frontierCount(state),after:frontierCount(state,plan.target)}],publicEvidenceIds:[...proof.map(e=>e.id),'additional-frontier'],lines:[c,secretary].map((speaker,i)=>({speakerId:speaker.id,speaker:speaker.name,role:adviserPlanningRole(i?'presidency:'+plan.army:institution),renderedText:entry.lines[i].text}))});
   }
  }
  const recent=recentDeployments(state,c,plan.army),failed=recent.filter(r=>['failure','catastrophe'].includes(r.outcome)),won=recent.filter(r=>r.outcome==='success');
  if(failed.length&&(v.C>=55||v.F<55))add('09C-army-recent-failure',c,institution,110,'discourage',[...evidence,...failed.map(r=>({id:'memory:'+r.memoryId,kind:'owned-experience',...r}))]);
  if(won.length&&v.F>=55)add('09C-army-recent-success',c,institution,100,'qualified',[...evidence,...won.map(r=>({id:'memory:'+r.memoryId,kind:'owned-experience',...r}))]);
 }else if(kind==='envoy'){
  if(state.laws.governorGeneral)return [];
  if(plan.purpose==='order'){
   const region=orderOwner(plan.order);if(!region||state.regions[region].control!=='indian'||state.regions[region].orders[plan.order])return [];
   const institution='director-of-trade',c=institutionalAdviser(state,institution);if(!c)return [];const v=voice(state,c);
   const evidence=[{id:'closed-order:'+plan.order,kind:'public-order',order:plan.order,region,control:'indian',open:false}];
   if(v.C>=55||v.L>=65)add('09C-envoy-india-diplomat',c,institution,50+v.C*.2+v.L*.1,'qualified',evidence);
   if(v.R>=60||v.V>=60||v.humour>=2&&v.restraint<=1)add('09C-envoy-india-cynic',c,institution,50+v.R*.2+v.humour*3,'qualified',evidence);
   if(v.F>=60)add('09C-envoy-india-confident',c,institution,50+v.F*.2+v.P*.1,'encourage',evidence);
  }else if(plan.purpose==='china'&&!state.chinaOffice){
   const institution='china-affairs',c=institutionalAdviser(state,institution);if(!c)return [];const v=voice(state,c),evidence=[{id:'china-office-absent',kind:'public-office',active:false,intent:'establishment'}];
   if(v.A>=60&&v.R>=45||v.F>=65&&v.P>=55)add('09C-china-office-plan',c,institution,50+v.A*.2+v.F*.1,'encourage',evidence);
   if(v.R<=40&&(v.C>=55||v.restraint>=2))add('09C-china-prospects-uneasy',c,institution,50+(100-v.R)*.3,'qualified',evidence);
  }
 }else if(kind==='governor'){
  const r=state.regions[plan.region];if(!r||r.control!=='company'||state.laws.governorGeneral||taxBlockReason(state,plan.region))return [];
  const institution='presidency:'+r.presidency,c=institutionalAdviser(state,institution);if(!c)return [];const v=voice(state,c);
  if(v.L>=55&&v.C>=45)add('09C-governor-plan-tax',c,institution,60,'encourage',[{id:'governor-tax:'+plan.region,kind:'legal-potential-effect',region:plan.region,effect:'tax',conditionalOnSuccess:true}]);
 }
 return choices.sort((a,b)=>b.score-a.score||a.templateId.localeCompare(b.templateId));
}

// Session data is transient and never attached to action input or saved state.
// Deterministic selection makes reopening unchanged plans equally stable.
export function createCounselSession(state){
 const cache=new Map();let reported=false;
 return {preview(plan,outcome=''){
  if(['success','failure','catastrophe'].includes(outcome))reported=true;
  if(!state.narrative?.enabled||state.narrative.intensity==='quiet'||['failure','catastrophe'].includes(outcome))return null;
  const canonical={kind:plan.kind,army:plan.army,target:plan.target,purpose:plan.purpose,order:plan.purpose==='china'?undefined:plan.order,region:plan.region};
  const key=JSON.stringify(canonical);
  if(!cache.has(key))cache.set(key,eligiblePlanningCounsel(state,canonical)[0]||null);
  const selected=cache.get(key);return selected?{...copy(selected),temporalRole:reported?'after-report':'before-report'}:null;
 }};
}
export function planningCounselHTML(preview,esc){
 if(!preview)return '';
 const after=preview.temporalRole==='after-report';
 return `<section class="planning-counsel" aria-label="Planning counsel" data-counsel-template="${esc(preview.templateId)}" data-counsel-phase="${preview.temporalRole}"><p class="eyebrow">${after?'AFTER THE REPORTED CHECK':'PLANNING COUNSEL'} · NONBINDING</p>${after?'<p class="small-note">Shown after the reported result; this is not an earlier warning.</p>':''}${preview.lines.map(line=>`<blockquote data-counsel-speaker="${esc(line.speakerId)}"><b>${esc(line.speaker)}</b><small>${esc(line.role)}</small><p>${esc(line.renderedText)}</p></blockquote>`).join('')}<p class="small-note">Fictional advice. Follow the physical rules and choose any permitted effect.</p></section>`;
}
