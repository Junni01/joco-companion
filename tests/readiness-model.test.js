import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readinessExperiment} from '../scripts/simulate-readiness.mjs';
import {setup,simulate,READINESS_STRATEGIES} from '../scripts/simulate-dynasties.mjs';

test('extended seeded strategy matrix is reproducible and balances all mortality/readiness counters',()=>{
 const a=readinessExperiment({runs:1,seed:77});assert.deepEqual(a,readinessExperiment({runs:1,seed:77}));assert.equal(a.cells.length,240);
 for(const c of a.cells){const t=c.totals;assert.equal(t.drawnRulerExits,t.committedRulerDeaths+t.blockedExits);assert.equal(t.validSeatTicks,t.seatTicks);assert(c.cast.max<=64);assert.equal(typeof c.availability,'number');assert(c.availability>=0&&c.availability<=1);assert.equal(t.blockedExits,t.noHeir+t.ties+t.activeRegencyBlocked);}
 assert.throws(()=>readinessExperiment({runs:0}));
});
test('old modelling assumptions keep archived baseline results and readiness counting never changes outcomes',()=>{
 const s=setup('1710',90210),config={seed:90210,ticks:30,strategy:'births',population:'families'};
 const before=simulate(s,config),after=simulate(s,{...config,trackReadiness:true});for(const k of ['cast','retainedOriginal','completedTenures','deathAges'])assert.deepEqual(after[k],before[k]);for(const k of Object.keys(before.counters))assert.equal(after.counters[k],before.counters[k]);
});
test('witnessed recognition introduces no people or parentage; court introduction reuses supported existing people first',()=>{
 const s=setup('1710',90210),r=simulate(s,{seed:90210,ticks:30,strategy:'recognition',trace:true});assert.equal(r.cast,23);assert.equal(r.ledger.links.length,0);assert(r.counters.recognitions>0);for(const e of r.timeline.filter(e=>e.type==='hypothetical-witnessed-recognition')){assert(e.id.startsWith('heir-'));assert(e.evidence.some(v=>v.kind==='existing-legacy-family'));}
 const court=simulate(s,{seed:90210,ticks:4,strategy:'court',trace:true});assert.equal(court.counters.courtIntroductions,0);assert.equal(court.cast,23);
});
test('emergency combinations run only after independent risk draw, preserve known identities and do not bypass Company policy',()=>{
 for(const strategy of ['recognition-emergency','court-emergency','recognition-court-emergency']){
  const s=setup('1813',5),r=simulate(s,{seed:8,ticks:30,strategy,trace:true,population:'families'});for(const region of ['bombay','madras','bengal'])assert.equal(r.ledger.seats[region],s.narrative.seats[region]);
  for(const e of r.timeline.filter(e=>e.type==='hypothetical-introduction'&&e.kind==='unrelated-court-appointee'))assert(r.timeline.some(t=>t.step===e.step&&t.type==='hypothetical-succession'&&t.to===e.id));
  assert.equal(r.counters.validSeatTicks,r.counters.seatTicks);
 }
});
test('combined adoption/birth policies retain explicit model-only lineage and all simulated casts stay capped',()=>{
 for(const strategy of READINESS_STRATEGIES){const r=simulate(setup('1710',7),{seed:9,ticks:30,strategy,trace:true,population:'families'});assert(r.cast<=64);for(const c of r.ledger.claims)if(c.basis==='parentage'||c.basis==='adoption')assert(c.support.familyLinkIds.length);}
});
test('readiness simulation modules remain absent from normal browser/game imports',()=>{
 for(const file of fs.readdirSync(new URL('../dist/',import.meta.url)).filter(f=>/\.(html|js)$/.test(f)))assert(!/simulate-readiness|readiness-fixtures|readinessExperiment/.test(fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8')),file);
});
