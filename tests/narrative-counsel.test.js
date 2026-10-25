import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {initialState,encode,decode,validate,clone} from '../dist/model.js';
import {createNarrative} from '../dist/narrative.js';
import {COUNSEL_CATALOGUE,COUNSEL_BY_ID,WITHHELD_COUNSEL} from '../dist/narrative-counsel-content.js';
import {ADVISER_BINDINGS,institutionalAdviser,adviserAptitude} from '../dist/narrative-advisers.js';
import {eligiblePlanningCounsel,createCounselSession,planningCounselHTML} from '../dist/narrative-counsel.js';
import {publicKnowledge} from '../dist/narrative-outlooks.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {counselState,profile,step,deployment,dangerState,dissentState} from './counsel-fixtures.js';
const expansion={kind:'deploy',army:'bombay',target:'delhi'};
const selected=(s,p)=>createCounselSession(s).preview(p);
const ids=(s,p)=>eligiblePlanningCounsel(s,p).map(e=>e.templateId);

test('all 47 authored units match approved wording; 17 are selectable and 30 explicitly withheld',()=>{
 const text=fs.readFileSync(new URL('../docs/narrative/writing/collection09c-adviser-candidates.md',import.meta.url),'utf8');
 assert.equal(COUNSEL_CATALOGUE.length,47);assert.equal(COUNSEL_CATALOGUE.filter(e=>e.selectable).length,17);assert.equal(WITHHELD_COUNSEL.length,30);
 for(const entry of COUNSEL_CATALOGUE){assert(text.includes('`'+entry.id+'`'));for(const words of entry.lines||[{text:entry.text}])assert(text.includes(words.text),entry.id);if(!entry.selectable)assert(entry.withheldReason);}
 for(const entry of COUNSEL_CATALOGUE.filter(e=>e.selectable))assert(!entry.id.startsWith('09D-'));
});

for(const scenario of ['1710','1758','1813','1710-long'])test(`${scenario}: existing adviser IDs persist without new characters or save mutations`,()=>{
 const s=initialState(scenario);s.narrative=createNarrative(s,1717);const before=encode(s),count=Object.keys(s.narrative.characters).length;
 for(const [institution,id]of Object.entries(ADVISER_BINDINGS)){const c=institutionalAdviser(s,institution);if(institution==='director-of-trade'&&s.laws.governorGeneral)assert.equal(c,null);else assert.equal(c?.id,id);}
 assert.equal(count,23);assert.equal(encode(s),before);assert.equal(encode(decode(before).state),before);assert.equal(s.narrative.characters['secretary-general'].name,'Arthur Pembroke');
});

test('same legal expansion produces cautious, ambitious and bureaucratic voices from persistent personality',()=>{
 const s=counselState(),a=profile(s,'army-bombay','careful');assert.equal(selected(s,expansion).templateId,'09C-army-expansion-careful');
 profile(s,a.id,'ambitious');assert.equal(selected(s,expansion).templateId,'09C-army-expansion-hungry');
 profile(s,a.id,'administrative');assert.equal(selected(s,expansion).templateId,'09C-army-expansion-bureaucratic');
 const traits=new Set();for(let seed=1;seed<12;seed++){const c=institutionalAdviser(counselState('bombay',seed),'army:bombay');traits.add(JSON.stringify(c.traits));}assert(traits.size>5);
});

test('friendly defence needs actual unrest/exposure; quiet commercial restoration is not automatically defence',()=>{
 const s=counselState();profile(s,'army-bombay','careful');assert(!ids(s,{kind:'deploy',army:'bombay',target:'bombay'}).some(id=>id.includes('defend')));
 s.regions.bombay.unrest=2;assert.equal(selected(s,{kind:'deploy',army:'bombay',target:'bombay'}).templateId,'09C-army-defend-professional');
 profile(s,'army-bombay','proud');assert.equal(selected(s,{kind:'deploy',army:'bombay',target:'bombay'}).templateId,'09C-army-defend-vain');
 profile(s,'army-bombay','ambitious');assert.equal(selected(s,{kind:'deploy',army:'bombay',target:'bombay'}).templateId,'09C-army-defend-calculating');
});

test('illegal target, vassal conquest and first home foothold do not acquire independent-neighbour advice',()=>{
 const s=counselState();profile(s,'army-bombay','careful');assert.deepEqual(ids(s,{...expansion,target:'madras'}),[]);assert(!ids(s,{...expansion,target:'maratha'}).some(id=>id.includes('expansion')));
 const first=initialState();first.narrative=createNarrative(first,717);profile(first,'army-bombay','careful');assert.equal(selected(first,{...expansion,target:'bombay'}),null);
});

test('known danger comes from a real Shuffle batch surviving into next Operations, and requires own exposure',()=>{
 const s=dangerState(),p={kind:'deploy',army:'madras',target:'hyderabad'};assert.equal(s.indiaPhase,null);assert.equal(s.turn,2);assert.deepEqual(s.elephant,{from:'hyderabad',to:'madras'});
 profile(s,'army-madras','careful');assert.equal(selected(s,p).templateId,'09C-army-known-danger');
 profile(s,'army-madras','ambitious');assert.equal(selected(s,p).templateId,'09C-army-known-danger-predatory');
 const unknown=clone(s);unknown.narrative.foresight.batch=null;assert(!ids(unknown,p).some(id=>id.includes('known-danger')));
 const other=clone(s);other.elephant={from:'delhi',to:'bengal'};assert(!ids(other,p).some(id=>id.includes('known-danger')));
});

test('rare coherent exchange needs two real eligible people, exposed base and one actual additional frontier',()=>{
 const s=dissentState(),p={kind:'deploy',army:'madras',target:'hyderabad'},advice=selected(s,p);assert.equal(advice.templateId,'09C-exchange-prudence-vs-glory');assert.equal(advice.lines.length,2);assert.deepEqual(advice.lines.map(l=>l.speakerId),['army-madras','secretary-madras']);
 assert.equal(advice.publicEvidence.at(-1).after,advice.publicEvidence.at(-1).before+1);
 const second=s.narrative.characters['secretary-madras'];second.condition='missing';assert(!ids(s,p).includes(advice.templateId));second.condition='alive';second.traits.ambition=20;assert(!ids(s,p).includes(advice.templateId));
});

test('hidden permutations and numeric force changes cannot select or rotate counsel',()=>{
 const s=dangerState(),p={kind:'deploy',army:'madras',target:'hyderabad'};profile(s,'army-madras','careful');const hidden=clone(s);hidden.eventStack.draw=[hidden.eventStack.draw[0],...hidden.eventStack.draw.slice(1).reverse()];
 assert.deepEqual(publicKnowledge(s),publicKnowledge(hidden));assert.deepEqual(eligiblePlanningCounsel(s,p),eligiblePlanningCounsel(hidden,p));
 const before=encode(s),session=createCounselSession(s),first=session.preview(p);
 for(let n=0;n<30;n++)assert.deepEqual(session.preview({...p,regiments:n,officers:30-n,alliances:['nizam']}),first);
 assert.deepEqual(createCounselSession(decode(before).state).preview(p),first);assert.equal(encode(s),before);
});

test('target changes update advice, repeats are stable, missing/dead people never speak',()=>{
 const s=counselState();profile(s,'army-bombay','careful');const session=createCounselSession(s),first=session.preview(expansion);assert(first);assert.equal(session.preview({...expansion,target:'maratha'}),null);assert.deepEqual(session.preview(expansion),first);
 for(const condition of ['dead','missing','imprisoned']){s.narrative.characters['army-bombay'].condition=condition;assert.equal(selected(s,expansion),null);}
});

test('recent failure/success require the same adviser owned memory and a structured institutional deployment',()=>{
 let s=counselState();profile(s,'army-bombay','careful');s=step(s,deployment({outcome:'failure'}));assert.equal(selected(s,expansion).templateId,'09C-army-recent-failure');
 const other=clone(s);other.narrative.characters['army-bombay'].memoryIds=[];assert(!ids(other,expansion).includes('09C-army-recent-failure'));
 const forged=clone(s);for(const h of forged.history)h.incident.facts=h.incident.facts.filter(f=>f.type!=='deployment');assert(!ids(forged,expansion).includes('09C-army-recent-failure'));
 s=counselState();profile(s,'army-bombay','confident');s=step(s,deployment());assert.equal(selected(s,{...expansion,target:'punjab'}).templateId,'09C-army-recent-success');
 s.turn+=2;assert(!ids(s,{...expansion,target:'punjab'}).includes('09C-army-recent-success'));
});

test('Director personalities use only a specific eligible non-Company closed order',()=>{
 const s=counselState(),p={kind:'envoy',purpose:'order',order:'d3'};profile(s,'secretary-general','careful');assert.equal(selected(s,p).templateId,'09C-envoy-india-diplomat');
 profile(s,'secretary-general','cynical');assert.equal(selected(s,p).templateId,'09C-envoy-india-cynic');profile(s,'secretary-general','confident');assert.equal(selected(s,p).templateId,'09C-envoy-india-confident');
 assert.equal(selected(s,{...p,order:'bo3n'}),null);assert.equal(selected(s,{...p,order:'d5n'}),null);assert.equal(selected(s,{...p,order:'unknown'}),null);s.laws.governorGeneral=true;assert.equal(selected(s,p),null);
});

test('China assistant may be eager, uneasy or silent; no unverified opium or accomplished trade claims',()=>{
 const s=counselState(),p={kind:'envoy',purpose:'china'};profile(s,'secretary-bengal','confident');assert.equal(selected(s,p).templateId,'09C-china-office-plan');profile(s,'secretary-bengal','uneasy');assert.equal(selected(s,p).templateId,'09C-china-prospects-uneasy');
 profile(s,'secretary-bengal','administrative');assert.equal(selected(s,p),null);s.chinaOffice=true;assert.equal(selected(s,p),null);
 const blocked=['09C-china-zero-access','09C-china-access-gain','09C-china-access-loss','09C-china-high-access','09C-china-prospects-commercial','09C-exchange-frontier-vs-opium'];for(const id of blocked)assert.equal(COUNSEL_BY_ID[id].selectable,false);
});

test('post-report revision is labelled later counsel; failures never imply rejected advice',()=>{
 const s=counselState();profile(s,'secretary-general','careful');profile(s,'secretary-bengal','confident');const before=encode(s),session=createCounselSession(s);
 assert.equal(session.preview({kind:'envoy',purpose:'order',order:'d3'}).temporalRole,'before-report');
 const changed=session.preview({kind:'envoy',purpose:'china'},'success');assert.equal(changed.temporalRole,'after-report');assert.equal(changed.lines[0].speakerId,'secretary-bengal');assert.match(planningCounselHTML(changed,String),/not an earlier warning/);
 assert.equal(session.preview({kind:'envoy',purpose:'china'},'failure'),null);assert.equal(session.preview({kind:'envoy',purpose:'order',order:'d3'},'catastrophe'),null);assert.equal(encode(s),before);
});

test('Governor planning is optional, regional and nonbinding; missing success-effect guards and General voices stay withheld',()=>{
 const s=counselState();profile(s,'secretary-bombay','fiscal');const p={kind:'governor',region:'bombay'},advice=selected(s,p);assert.equal(advice.templateId,'09C-governor-plan-tax');assert.equal(advice.lines[0].speakerId,'secretary-bombay');assert.equal(advice.publicEvidence[0].conditionalOnSuccess,true);
 assert.equal(selected(s,{...p,region:'delhi'}),null);for(const id of ['09C-governor-plan-regiment','09C-governor-plan-ship','09C-governor-plan-prudent'])assert(!COUNSEL_BY_ID[id].selectable);s.laws.governorGeneral=true;assert.equal(selected(s,p),null);
});

test('officeholder dismissal, commit, saved words, Undo/Redo and current-schema saves retain adviser identities/history',()=>{
 let s=counselState();profile(s,'army-bombay','careful');s=step(s,deployment({outcome:'failure'}));const before=clone(s),person=clone(institutionalAdviser(s,'army:bombay'));
 s=step(s,{type:'blackmail',card:'london',office:'commander:bombay'});assert.deepEqual(institutionalAdviser(s,'army:bombay'),person);
 const undo=undoFrame(s,null,[before],[null],[]),redo=redoFrame(undo.state,undo.progress,undo.undo,undo.undoProgress,undo.redo);assert.deepEqual(redo.state,s);
 const loaded=decode(encode(s,[before],null,[null]));assert.deepEqual(loaded.state,s);assert.deepEqual(loaded.state.history.map(h=>h.narrative),s.history.map(h=>h.narrative));
 assert(!JSON.stringify(s).includes('09C-army-'));assert(!Object.hasOwn(s.narrative,'counsel'));assert.equal(Object.keys(s.narrative.characters).length,23);
});

test('narrative off/quiet and closed Operations add no preview or random call',()=>{
 const off=initialState();assert.deepEqual(eligiblePlanningCounsel(off,expansion),[]);const s=counselState();profile(s,'army-bombay','careful');s.narrative.intensity='quiet';assert.equal(selected(s,expansion),null);s.narrative.intensity='standard';
 const original=Object.getOwnPropertyDescriptor(globalThis,'crypto');Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(){assert.fail('preview consumed gameplay RNG');}}});
 const before=encode(s);try{for(let i=0;i<10;i++)selected(s,expansion);assert.equal(encode(s),before);const ended=clone(s);ended.gameEnd={};assert.deepEqual(eligiblePlanningCounsel(ended,expansion),[]);}finally{Object.defineProperty(globalThis,'crypto',original);}
});
