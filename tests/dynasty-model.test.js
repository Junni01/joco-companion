import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {simulate,setup,draw,mortality,distribution,ageAudit,experiment} from '../scripts/simulate-dynasties.mjs';
import {readinessFixtures,readinessReport} from './dynasty-model-fixtures.js';
import {selectSuccessor} from '../dist/narrative-succession.js';
import {commitNarrative} from '../dist/narrative.js';
import {resolveAction} from '../dist/actions.js';
import {validate} from '../dist/model.js';
import {inParliament} from './phase-fixtures.js';

test('offline simulation reproduces full traces and results without mutating input or consuming either production RNG',()=>{
 const s=setup('1710',17),before=structuredClone(s),random=Math.random,desc=Object.getOwnPropertyDescriptor(globalThis,'crypto');
 try{Math.random=()=>assert.fail('gameplay random');Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(){assert.fail('gameplay crypto');}}});
  const cfg={seed:77,ticks:30,strategy:'births',population:'families',trace:true};const a=simulate(s,cfg);assert.deepEqual(a,simulate(s,cfg));assert.deepEqual(s,before);assert.deepEqual(setup('1710',17),s);
 }finally{Math.random=random;Object.defineProperty(globalThis,'crypto',desc);}
});
test('seed streams differ, are bounded and keyed by person, and repeat experiments byte-for-byte',()=>{
 const a=Array.from({length:100},(_,i)=>draw(1,i,'x'));assert(a.every(v=>v>=0&&v<1));assert.notDeepEqual(a,a.map((_,i)=>draw(2,i,'x')));assert.notEqual(draw(1,1,'a'),draw(1,1,'b'));
 assert.deepEqual(experiment({runs:1,seed:55}),experiment({runs:1,seed:55}));
});
test('age curves are per-turn, ordered, cover exceptional ages without a forced death cap',()=>{
 for(const a of [0,18,39,40,54,55,64,65,74,75,84,85,101,201,400]){assert(mortality(a,'restrained')<mortality(a,'middle'));assert(mortality(a,'middle')<mortality(a,'elevated'));assert(mortality(a,'elevated')<1);}
 assert.equal(mortality(84,'middle'),.16);assert.equal(mortality(85,'middle'),.30);assert.throws(()=>mortality(-1,'middle'));assert.throws(()=>simulate(setup('1710',1),{ticks:0}));assert.throws(()=>experiment({runs:0}));
});
test('all scenario starts share same ages; horizons count transitions, not rounds',()=>{
 const audit=ageAudit(4);assert.deepEqual(audit.map(a=>a.ageTicks),[4,4,3,7]);assert.deepEqual(audit.map(a=>a.yearsAdded),[12,12,9,21]);for(const a of audit)assert.deepEqual(a.ages,audit[0].ages);
 const s=setup('1710',5);let ready=inParliament(s);ready.parliamentFinishedTurn=ready.turn;const after=commitNarrative(ready,resolveAction(ready,{type:'next-turn'}));for(const [id,c]of Object.entries(s.narrative.characters))assert.equal(after.narrative.characters[id].age,c.age+3);
});
test('actual M2B-1 evaluator requires claims and distinct adult guardians, preserves ties and active-regency block',()=>{
 const report=Object.fromEntries(readinessReport().map(r=>[r.name,r]));for(const id of ['adult','daughter','adopted','minor'])assert(report[id].transactionReady);
 for(const id of ['legacy','minor-no-regent','elderly-sole'])assert.equal(report[id].evaluatorStatus,'none');assert.equal(report.tied.evaluatorStatus,'ambiguous');assert.equal(report['active-regency'].transactionReady,false);
 const f=readinessFixtures();for(const s of Object.values(f))validate(s);assert.equal(selectSuccessor(f.minor,'delhi').chosen.regentId,'demo-widow');
});
test('appointment hypothesis never manufactures a claimant to resolve a tie or a Company vacancy',()=>{
 const s=readinessFixtures().tied;s.narrative.characters[s.narrative.seats.delhi].age=85;
 let seed=1;while(draw(seed,1,s.narrative.seats.delhi,'mortality')>=.45)seed++;
 const r=simulate(s,{seed,ticks:1,curve:'elevated',strategy:'appointment',trace:true});assert(r.counters.ties>0);assert(!r.timeline.some(e=>e.type==='hypothetical-introduction'&&e.region==='delhi'));
 const company=setup('1813',1);for(const id of Object.values(company.narrative.seats))company.narrative.characters[id].age=85;
 const c=simulate(company,{seed:8,ticks:10,curve:'elevated',strategy:'appointment',trace:true});for(const region of ['bombay','madras','bengal'])assert.equal(c.ledger.seats[region],company.narrative.seats[region]);assert(c.counters.noHeir>0);
});
test('hidden event content cannot influence the offline model and keyed draws have a basic spread sanity check',()=>{
 const s=setup('1710',1),other=structuredClone(s);s.eventStack={hidden:'a'};other.eventStack={hidden:'b',order:[3,1,8]};
 assert.deepEqual(simulate(s,{seed:6,ticks:20,strategy:'adoption'}),simulate(other,{seed:6,ticks:20,strategy:'adoption'}));
 const mean=Array.from({length:20000},(_,i)=>draw(5,i,'mortality')).reduce((a,b)=>a+b,0)/20000;assert(mean>.48&&mean<.52);
});
test('baseline cannot fabricate lineage or heirs and blocked exits retain valid original seats',()=>{
 const s=setup('1710',3),r=simulate(s,{seed:1,ticks:50,curve:'elevated',trace:true});assert.equal(r.cast,23);assert.equal(r.retainedOriginal,8);assert.equal(r.counters.committedRulerDeaths,0);assert.equal(r.counters.validSeatTicks,400);assert(r.counters.blockedExits>0);assert.deepEqual(r.ledger.links,[]);assert.deepEqual(r.ledger.claims,[]);
});
test('hypothetical growth is explicit prospective evidence, capped; appointees have no fabricated parents',()=>{
 for(const strategy of ['births','adoption','appointment']){
  const r=simulate(setup('1710',3),{seed:19,ticks:50,curve:'elevated',strategy,trace:true,population:'families'});assert(r.cast<=64);assert.equal(r.counters.validSeatTicks,r.counters.seatTicks);
  for(const e of r.timeline.filter(e=>e.type==='hypothetical-birth-and-recognition')){assert.equal(e.parents.length,2);assert(r.timeline.some(t=>t.type==='hypothetical-introduction'&&t.id===e.id&&t.step===e.step));for(const id of e.parents)assert(r.ledger.links.some(l=>l.type==='parent'&&l.fromId===id&&l.toId===e.id));}
  if(strategy==='appointment')assert.equal(r.ledger.links.filter(l=>l.type==='parent'||l.type==='adoptive-parent').length,0);
  for(const e of r.timeline.filter(e=>e.type==='hypothetical-succession'))assert.notEqual(e.from,e.regent);
 }
});
test('family exposure differs from ruler-only and no age-bound hard death is imposed',()=>{
 const s=setup('1710',3);const a=simulate(s,{seed:8,ticks:30,population:'rulers'}),b=simulate(s,{seed:8,ticks:30,population:'families'});assert.equal(a.counters.relativeDeaths,0);assert(b.counters.relativeDeaths>0);assert.equal(a.maxLivingAge>100,true);
});
test('before/after tick sampling uses the stated band; newborns are not aged on introduction',()=>{
 const s=setup('1710',1);for(const id of Object.values(s.narrative.seats))s.narrative.characters[id].age=54;
 let found=false;for(let seed=1;seed<50&&!found;seed++){
  const before=simulate(s,{seed,ticks:1,timing:'before'}),after=simulate(s,{seed,ticks:1,timing:'after'});
  if(after.counters.drawnRulerExits>before.counters.drawnRulerExits)found=true;
 }assert(found);
 let births=0;for(let seed=1;seed<20;seed++){
  const r=simulate(setup('1710',1),{seed,ticks:1,strategy:'births',trace:true});
  for(const e of r.timeline.filter(e=>e.type==='hypothetical-birth-and-recognition')){assert.equal(r.ledger.people[e.id].age,0);births++;}
 }assert(births>0);
});
test('active-regency titular exits and lost-regent risk are explicit blocked outcomes, never invalid seats',()=>{
 const s=readinessFixtures()['active-regency'];s.narrative.characters['demo-widow'].age=85;
 let seed=1;while(draw(seed,1,'demo-child','mortality')>=.008||draw(seed,1,'demo-widow','mortality')>=.45)seed++;
 const r=simulate(s,{seed,ticks:1,curve:'elevated',population:'families',trace:true});assert.equal(r.counters.activeRegencyBlocked,1);assert.equal(r.counters.regentLostBlocked,1);assert.equal(r.counters.validSeatTicks,8);assert.equal(r.ledger.people['demo-child'].condition,'alive');assert.equal(r.ledger.people['demo-widow'].condition,'alive');
});
test('production source never imports modelling script or fixtures; normal cast/RNG/flow unchanged',()=>{
 for(const file of fs.readdirSync(new URL('../dist/',import.meta.url)).filter(f=>/\.(js|html)$/.test(f)))assert(!/simulate-dynasties|dynasty-model-fixtures/.test(fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8')),file);
 const s=setup('1710',717);assert.equal(Object.keys(s.narrative.characters).length,23);assert(!s.narrative.claimsV2);assert(!s.narrative.regencies);assert(!s.narrative.successionRecords);
});
test('distribution reports censored/empty samples honestly and does not reorder input',()=>{const v=[3,1,2];assert.equal(distribution(v).median,2);assert.deepEqual(v,[3,1,2]);assert.equal(distribution([]).mean,null);});
