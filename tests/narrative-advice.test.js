import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {encode,decode,clone,validate,resolveDeployment} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {createNarrative,commitNarrative} from '../dist/narrative.js';
import {COUNSEL_BY_ID} from '../dist/narrative-counsel-content.js';
import {createAdviceAttempt} from '../dist/narrative-advice-session.js';
import {ADVICE_OUTCOMES,ADVICE_OUTCOME_BY_ID} from '../dist/narrative-advice-content.js';
import {semanticsFor} from '../dist/narrative-advice-policy.js';
import {outcomeCandidates} from '../dist/narrative-advice.js';
import {readableChronicle} from '../dist/chronicle.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {counselState,profile,deployment,dangerState,dissentState,step} from './counsel-fixtures.js';
import {displayed,advisedResult} from './advice-fixtures.js';
const records=s=>Object.values(s.narrative.statements).filter(r=>r.type==='advice');
const response=(s,r)=>s.history.find(h=>h.incident?.id===r.incidentId).narrative.lines.find(l=>l.id===r.responseLineId);
const plain={kind:'deploy',army:'bombay',target:'delhi'};
function strongWarning(){const s=dangerState();profile(s,'army-madras','careful');profile(s,'secretary-madras','fiscal');return s;}
const warningPlan={kind:'deploy',army:'madras',target:'hyderabad'};

test('all 30 outcome entries preserve approved exact text; 27 enabled and three untracked Governor effects withheld',()=>{
 const source=['collection09d1-outcome-candidates.md','collection09c-adviser-candidates.md'].map(f=>fs.readFileSync(new URL('../docs/narrative/writing/'+f,import.meta.url),'utf8')).join('\n');
 assert.equal(ADVICE_OUTCOMES.length,30);assert.equal(ADVICE_OUTCOMES.filter(e=>!e.withheld).length,27);for(const e of ADVICE_OUTCOMES)assert(source.includes(e.text),e.id);
 const honest=semanticsFor('09C-army-strong-opponent-honest');assert.equal(honest.stance,'encourage');assert.deepEqual(honest.qualification,['considerable danger.']);assert.equal(honest.confidenceTone,'explicit-risk');
 for(const e of Object.values(COUNSEL_BY_ID).filter(e=>e.selectable))for(const [i,line]of (e.lines||[{text:e.text}]).entries())for(const q of semanticsFor(e.id,i).qualification)assert(line.text.includes(q),e.id+' reservation');
});

for(const stance of ['encourage','discourage'])for(const outcome of ['success','failure','catastrophe'])test(`${stance} / ${outcome}: genuine pre-check words bind once to the real Army/target and exact immediate reaction`,()=>{
 const s=stance==='encourage'?counselState():strongWarning(),plan=stance==='encourage'?plain:warningPlan;if(stance==='encourage')profile(s,'army-bombay','ambitious');
 const input=deployment({army:plan.army,target:plan.target,outcome}),before=encode(s),result=advisedResult(s,plan,input),row=records(result.state)[0];
 assert.equal(encode(s),before);assert.equal(row.stance,stance);assert.equal(row.utterancePhase,'pre-check');assert.equal(row.outcomeKind,outcome);assert.deepEqual(row.targetIds,[plan.target]);assert.equal(row.armyId,plan.army);assert.equal(row.followedStatus,stance==='discourage'?'proceeded-despite-warning':'followed');
 assert.equal(response(result.state,row).text,ADVICE_OUTCOME_BY_ID[response(result.state,row).templateId].text);if(outcome==='catastrophe')assert.match(response(result.state,row).templateId,/catastrophe/);
 const normal=commitNarrative(s,resolveDeployment(s,input));assert.equal(result.state.narrative.rng,normal.narrative.rng);assert.deepEqual(result.state.narrative.outlooks,normal.narrative.outlooks);assert.deepEqual(result.state.regions,normal.regions);
});

test('conditional caution is not rewritten as opposition or a promise; absence of pre-check timing suppresses retrospective claims',()=>{
 const s=counselState();profile(s,'army-bombay','careful');const r=advisedResult(s,plain,deployment()),row=records(r.state)[0];assert.equal(row.stance,'conditional');assert.equal(row.followedStatus,'not-applicable/unknown');assert.equal(row.responseLineId,null);assert(row.qualification.length);
 profile(s,'army-bombay','ambitious');const unknown=advisedResult(s,plain,deployment({outcome:'failure'}),{ack:false});const u=records(unknown.state)[0];assert.equal(u.utterancePhase,'pre-commit');assert.equal(u.followedStatus,'not-applicable/unknown');assert.equal(u.responseLineId,null);
});

test('qualified support retains its actual reservation, without claiming prediction accuracy',()=>{
 const s=dangerState();profile(s,'army-madras','ambitious');profile(s,'secretary-madras','fiscal');const {state}=advisedResult(s,warningPlan,deployment({army:'madras',target:'hyderabad',outcome:'failure'}));const row=records(state)[0];
 assert.equal(row.stance,'encourage');assert.deepEqual(row.qualification,['If disorder spreads']);assert.equal(row.confidenceTone,'conditional-opportunity');assert(!Object.hasOwn(row,'correct'));assert(!Object.hasOwn(row,'accuracy'));assert.equal(row.outcomeKind,'failure');
});

test('two delivered advisers remain an intact unit, with separate stances, audiences and reactions but no rivalry scores',()=>{
 const s=dissentState(),{state}=advisedResult(s,warningPlan,deployment({army:'madras',target:'hyderabad',outcome:'catastrophe'})),rs=records(state);assert.equal(rs.length,2);assert.equal(rs[0].unitId,rs[1].unitId);assert.deepEqual(rs.map(r=>r.stance),['discourage','encourage']);assert.deepEqual(rs[0].audienceIds,[rs[1].speakerId]);assert.deepEqual(rs[1].audienceIds,[rs[0].speakerId]);
 assert.equal(state.history.at(-1).narrative.lines.filter(l=>l.adviceIds).length,2);assert.deepEqual(state.narrative.characters['army-madras'].relations,s.narrative.characters['army-madras'].relations);
});

test('unseen, cancelled or post-report acknowledgements cannot manufacture pre-check speech',()=>{
 const s=counselState();profile(s,'army-bombay','ambitious');
 assert.equal(records(advisedResult(s,plain,deployment(),{ack:false,visible:false}).state).length,0);
 const a=createAdviceAttempt(s),v=displayed(a,s,plain);v.close();a.report(plain,'success');assert.equal(records(commitNarrative(s,a.attach(resolveDeployment(s,deployment()),plain))).length,0);
 const b=createAdviceAttempt(s),late=displayed(b,s,plain,{ack:false});b.report(plain,'success');late.button.onclick();const loaded=validate(commitNarrative(s,b.attach(resolveDeployment(s,deployment()),plain)));assert.equal(records(loaded)[0].utterancePhase,'pre-commit');
});

test('changing targets before reporting discards abandoned advice; only the final actual plan may bind',()=>{
 const s=counselState();profile(s,'army-bombay','ambitious');const a=createAdviceAttempt(s);displayed(a,s,plain);const final={...plain,target:'hyderabad'};displayed(a,s,final);a.report(final,'success');const state=validate(commitNarrative(s,a.attach(resolveDeployment(s,deployment({target:'hyderabad'})),final)));assert.equal(records(state).length,1);assert.deepEqual(records(state)[0].targetIds,['hyderabad']);
 const b=createAdviceAttempt(s);displayed(b,s,plain);b.report(plain,'success');displayed(b,s,final,{ack:true});const post=validate(commitNarrative(s,b.attach(resolveDeployment(s,deployment({target:'hyderabad'})),final)));assert.equal(records(post)[0].utterancePhase,'post-check');assert.equal(records(post)[0].responseLineId,null);
});

for(const original of ['order','china'])test(`Envoy ${original} preference survives success and a genuinely different final effect without backdating later speech`,()=>{
 const s=counselState();profile(s,'secretary-general','careful');profile(s,'secretary-bengal','confident');const a=createAdviceAttempt(s),first={kind:'envoy',purpose:original,...(original==='order'?{order:'d3'}:{})},final={kind:'envoy',purpose:original==='order'?'china':'order',...(original==='china'?{order:'d3'}:{})};
 displayed(a,s,first);a.report(first,'success');displayed(a,s,final,{ack:false});const input={type:'envoy',purpose:final.purpose,order:final.order,outcome:'success'},state=validate(commitNarrative(s,a.attach(resolveAction(s,input),final))),rs=records(state);
 assert.equal(rs.length,2);assert.equal(rs[0].utterancePhase,'pre-check');assert.equal(rs[0].followedStatus,'different-effect');assert.equal(rs[1].utterancePhase,'post-check');assert.equal(rs[1].followedStatus,'not-applicable/unknown');assert.equal(rs[0].text,COUNSEL_BY_ID[rs[0].templateId].text);assert(response(state,rs[0]));assert.equal(state.chinaOffice,original==='order');assert.equal(state.regions.delhi.orders.d3,original==='china');assert(!state.history.some(h=>h.actionType==='china-trade'));
});

test('pre-report exploratory Envoy changes are not recorded as ignored recommendations',()=>{
 const s=counselState();profile(s,'secretary-general','careful');profile(s,'secretary-bengal','confident');const a=createAdviceAttempt(s);displayed(a,s,{kind:'envoy',purpose:'order',order:'d3'});const final={kind:'envoy',purpose:'china'};displayed(a,s,final);a.report(final,'success');const state=validate(commitNarrative(s,a.attach(resolveAction(s,{type:'envoy',purpose:'china',outcome:'success'}),final)));assert.equal(records(state).length,1);assert.equal(records(state)[0].followedStatus,'followed');assert.equal(records(state)[0].speakerId,'secretary-bengal');assert.deepEqual(Object.keys(state.history.at(-1).narrative.advice.context.people),['secretary-bengal']);
});

for(const purpose of ['order','china'])test(`failed Envoy ${purpose}: no successful effect, court refusal or ignored-advice claim`,()=>{
 const s=counselState();profile(s,'secretary-general','careful');profile(s,'secretary-bengal','confident');const p={kind:'envoy',purpose,...(purpose==='order'?{order:'d3'}:{})};const {state}=advisedResult(s,p,{type:'envoy',purpose,order:p.order,outcome:'failure'}),r=records(state)[0];assert.equal(r.followedStatus,'no-choice-on-failure');assert.equal(r.selectedEffect,null);assert.deepEqual(state.regions,s.regions);assert.equal(state.chinaOffice,false);assert(response(state,r));assert(!response(state,r).text.includes('refused'));
});

for(const failed of [false,true])test(`Governor ${failed?'unsuccessful Administer':'Tax'} preserves supported post-success choice semantics`,()=>{
 const s=counselState();profile(s,'secretary-bombay','fiscal');const p={kind:'governor',region:'bombay'},input=failed?{type:'unrest',region:'bombay',reason:'failure',governorAction:true}:{type:'tax',region:'bombay'};const {state}=advisedResult(s,p,input),r=records(state)[0];assert(r);assert.equal(r.followedStatus,failed?'no-choice-on-failure':'followed');assert.equal(r.selectedEffect?.kind,failed?undefined:'tax');assert(response(state,r));assert(!response(state,r).templateId.includes('overruled'));
});

test('repeated displays, same-attempt interpretation and restore paths never duplicate or reroll advice',()=>{
 const s=counselState();profile(s,'army-bombay','ambitious');const a=createAdviceAttempt(s);for(let i=0;i<8;i++)displayed(a,s,plain);a.report(plain,'success');const state=validate(commitNarrative(s,a.attach(resolveDeployment(s,deployment()),plain)));assert.equal(records(state).length,1);assert.deepEqual(commitNarrative(s,{state}),state);
 const data=encode(state,[s],null,[null]),loaded=decode(data);assert.deepEqual(loaded.state,state);const undone=undoFrame(state,null,[s],[null],[]),redone=redoFrame(undone.state,undone.progress,undone.undo,undone.undoProgress,undone.redo);assert.deepEqual(redone.state,state);assert.equal(readableChronicle(state).includes('Advice shown for this action'),true);assert(readableChronicle(state).includes(records(state)[0].text));
});

test('old campaigns stay unchanged and new advice is not retroactively inferred from history',()=>{
 const s=counselState();profile(s,'army-bombay','ambitious');const old=step(s,deployment()),bytes=encode(old);assert.equal(records(old).length,0);assert.equal(encode(decode(bytes).state),bytes);assert(!old.history.at(-1).narrative.advice);
});

test('hidden permutations, physical RNG and narrative-off outcomes stay isolated from advice',()=>{
 const s=strongWarning(),other=clone(s);other.eventStack.draw=[other.eventStack.draw[0],...other.eventStack.draw.slice(1).reverse()];const input=deployment({army:'madras',target:'hyderabad',outcome:'failure'}),first=advisedResult(s,warningPlan,input).state,second=advisedResult(other,warningPlan,input).state;assert.deepEqual(records(first),records(second));
 const off=clone(s);delete off.narrative;const a=createAdviceAttempt(off);a.report(warningPlan,'failure');const plain=resolveDeployment(off,input),result=commitNarrative(off,a.attach(plain,warningPlan));assert.equal(result.narrative,undefined);assert.deepEqual(result.regions,first.regions);
 const savedCrypto=Object.getOwnPropertyDescriptor(globalThis,'crypto');Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(){assert.fail('advice consumed physical RNG');}}});try{advisedResult(s,warningPlan,input);}finally{Object.defineProperty(globalThis,'crypto',savedCrypto);}
});

test('tampered advice text, chronology, actor, effect, audience, public fields and response are rejected',()=>{
 const s=counselState();profile(s,'army-bombay','ambitious');const good=advisedResult(s,plain,deployment()).state;
 const changes=[r=>r.text+=' invented',r=>r.speakerId='army-madras',r=>r.plan.target='bengal',r=>r.shownInAttempt.sequence=999,r=>r.stance='discourage',r=>r.selectedEffect={kind:'ship'},r=>r.audienceIds=['ruler-delhi'],r=>r.followedStatus='different-effect'];
 for(const mutate of changes){const bad=clone(good);mutate(records(bad)[0]);assert.throws(()=>validate(bad),/Invalid/);}
 const hidden=clone(good);hidden.history.at(-1).narrative.advice.context.publicKnowledge.hiddenFace='crisis';assert.throws(()=>validate(hidden),/Invalid/);
 const quote=clone(good);response(quote,records(quote)[0]).text='It was an easy certain victory.';assert.throws(()=>validate(quote),/Invalid/);
});

test('later debug corrections and General replacement preserve exact historical observation/office context',async()=>{
 const {debugEditRegion,debugResult,debugFlags}=await import('../dist/debug-state.js');
 let s=counselState();s.debugMode=true;profile(s,'army-bombay','ambitious');s=advisedResult(s,plain,deployment()).state;const old=clone(records(s));
 const edited=debugEditRegion(s,'mysore',{strength:2});s=validate(commitNarrative(s,debugResult(s,edited,'adjust unrelated tower')));assert.deepEqual(records(s),old);
 const flags=debugFlags(s,{governorGeneral:true},s.chinaOffice);s=validate(commitNarrative(s,debugResult(s,flags,'General law')));assert.deepEqual(records(s),old);
});
