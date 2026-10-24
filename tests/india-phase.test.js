import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,legalTargets,encode,decode,validate} from '../dist/model.js';
import {resolveAction,NeedsInput} from '../dist/actions.js';
import {STORM_FACES,phaseFor,rollStormFace,shipInstructions} from '../dist/india-phase.js';
const start=(face=0)=>resolveAction(initialState(),{type:'phase-start',face}).state;
const event=patch=>({type:'event',event:'windfall',topRegion:'delhi',...patch});

test('storm die preserves all six faces, duplicate None probability and printed event counts',()=>{
 assert.deepEqual(STORM_FACES.map(f=>f.events),[2,2,3,1,4,4]);
 assert.deepEqual(STORM_FACES.map(f=>f.seas.length),[1,1,1,3,0,0]);
 for(let i=0;i<6;i++)assert.equal(rollStormFace(a=>{a[0]=i;}),i);
 let calls=0;assert.equal(rollStormFace(a=>{a[0]=calls++===0?4294967295:2;}),2);assert.equal(calls,2);
});

test('phase saves one roll, prevents a second start and blocks draws until storm ships are resolved',()=>{
 const s=start(0);assert.equal(s.indiaPhase.status,'ships');assert.equal(s.indiaPhase.total,2);
 assert.throws(()=>resolveAction(s,{type:'phase-start',face:3}),/already begun/);
 assert.throws(()=>resolveAction(s,event()),/Resolve storms/);
 assert.throws(()=>resolveAction(s,{type:'phase-finish'}),/Resolve all/);
 const restored=decode(encode(s)).state;
 assert.deepEqual(restored.indiaPhase,s.indiaPhase);assert.equal(restored.history.at(-1).input.face,0);
 const ships=resolveAction(restored,{type:'phase-ships'}).state;
 assert.equal(ships.indiaPhase.status,'events');assert.equal(ships.indiaPhase.completed,0);
 assert.throws(()=>resolveAction(ships,{type:'phase-ships'}),/no pending/);
});

test('events advance only on a fully calculated result; scandal actions do not consume an event',()=>{
 const s=resolveAction(start(3),{type:'phase-ships'}).state;
 let attacker=structuredClone(s);attacker.regions.bombay.control='company';attacker.regions.bombay.presidency='bombay';attacker.regions.bombay.strength=0;attacker.elephant={from:'bombay',to:null};
 assert.throws(()=>resolveAction(attacker,event({event:'crisis',modifier:1})),e=>e instanceof NeedsInput);
 assert.equal(attacker.indiaPhase.completed,0);
 const scandal=resolveAction(s,{type:'blackmail',card:'india',office:'president:bombay'}).state;
 assert.equal(scandal.indiaPhase.completed,0);
 const preview=resolveAction(scandal,event());assert.equal(scandal.indiaPhase.completed,0);assert.equal(preview.state.indiaPhase.completed,1);
 assert.throws(()=>resolveAction(preview.state,event()),/finish this phase/);
 const finished=resolveAction(preview.state,{type:'phase-finish'}).state;
 assert.equal(finished.indiaPhase.status,'complete');assert.throws(()=>resolveAction(finished,{type:'phase-finish'}),/Resolve all/);
});

test('no-storm result skips ship rolls and requires exactly four events, including Shuffle',()=>{
 let s=start(5);assert.equal(s.indiaPhase.status,'events');assert.equal(s.indiaPhase.total,4);
 assert.throws(()=>resolveAction(s,{type:'phase-ships'}),/no pending/);
 for(let i=0;i<4;i++){s=resolveAction(s,event(i===1?{event:'shuffle',topRegion:'mysore',shape:'circle'}:{})).state;assert.equal(s.indiaPhase.completed,i+1);}
 const next=resolveAction(resolveAction(resolveAction(s,{type:'phase-finish'}).state,{type:'parliament-finish'}).state,{type:'next-turn'}).state;
 assert.equal(next.turn,2);assert.equal(phaseFor(next),null);assert.equal(next.indiaPhase,null);
 assert.doesNotThrow(()=>resolveAction(next,{type:'phase-start',face:2}));
});

test('card and office timing is enforced throughout the phase and after it',()=>{
 const s=start(4);
 assert.throws(()=>resolveAction(s,{type:'blackmail',card:'envoy',from:'maratha',to:'delhi'}),/before Events/);
 assert.doesNotThrow(()=>resolveAction(s,{type:'blackmail',card:'london',office:'chairman'}));
 assert.doesNotThrow(()=>resolveAction(s,{type:'blackmail',card:'india',office:'president:madras'}));
 assert.deepEqual(legalTargets(s,'bombay'),[]);
 for(const d of [{type:'envoy'},{type:'govern'},{type:'unrest'}])assert.throws(()=>resolveAction(s,d),/Operations has ended/);
 for(const d of [{type:'next-turn'},{type:'law',law:'sepoyRecruitment',outcome:'passed'},{type:'france',outcome:'passed'}])assert.throws(()=>resolveAction(s,d),/Finish Events/);
 let completed=s;for(let i=0;i<4;i++)completed=resolveAction(completed,event()).state;
 completed=resolveAction(completed,{type:'phase-finish'}).state;
 assert.doesNotThrow(()=>resolveAction(completed,{type:'law',law:'sepoyRecruitment',outcome:'passed'}));
 assert.throws(()=>resolveAction(completed,{type:'blackmail',card:'envoy',from:'maratha',to:'delhi'}),/before Events/);
});

test('ship reminders cover fatigue, sinking, exemptions and the China sea; old saves remain valid',()=>{
 const east=shipInstructions(0).join(' '),all=shipInstructions(3).join(' ');
 assert.match(east,/except Company ships and Extra ships/);assert.match(east,/China/);assert.match(east,/1–2: no effect/);assert.match(east,/3–4/);assert.match(east,/already fatigued, it sinks/);assert.match(east,/5–6/);assert.match(east,/non-fatigued/);
 for(const sea of ['West','South','East'])assert(all.includes(sea+' Indian Ocean'));
 assert(!shipInstructions(1).join(' ').includes('China'));
 assert.match(shipInstructions(4)[0],/no ship rolls/);
 const old=initialState();delete old.indiaPhase;assert.doesNotThrow(()=>decode(encode(old)));
 const broken=start(4);broken.indiaPhase.completed=5;assert.throws(()=>validate(broken),/event count/);
});

test('Finish Parliament needs no applicable law and preserves India state through the next turn',()=>{
 let s=start(4);for(let i=0;i<4;i++)s=resolveAction(s,event()).state;s=resolveAction(s,{type:'phase-finish'}).state;
 assert.throws(()=>resolveAction(s,{type:'next-turn'}),/Finish Parliament/);
 const finished=resolveAction(s,{type:'parliament-finish'}).state;
 assert.equal(finished.parliamentFinishedTurn,1);assert.equal(finished.turn,1);assert.deepEqual(finished.regions,s.regions);assert.deepEqual(finished.elephant,s.elephant);
 assert.throws(()=>resolveAction(finished,{type:'parliament-finish'}),/already been finished/);
 assert.throws(()=>resolveAction(finished,{type:'law',law:'sepoyRecruitment',outcome:'passed'}),/Parliament is finished/);
 const restored=decode(encode(finished,[s])).state,next=resolveAction(restored,{type:'next-turn'}).state;
 assert.equal(next.turn,2);assert.equal(next.parliamentFinishedTurn,null);assert.equal(next.indiaPhase,null);assert.deepEqual(next.regions,finished.regions);assert.deepEqual(next.eventStack,finished.eventStack);
});

test('recorded law survives Finish Parliament and the final turn directs players to scoring',()=>{
 let s=start(3);s=resolveAction(s,{type:'phase-ships'}).state;s=resolveAction(s,event()).state;s=resolveAction(s,{type:'phase-finish'}).state;
 s=resolveAction(s,{type:'law',law:'sepoyRecruitment',outcome:'passed'}).state;s=resolveAction(s,{type:'parliament-finish'}).state;assert.equal(s.laws.sepoyRecruitment,true);
 const final=initialState();final.turn=6;final.indiaPhase={turn:6,face:3,total:1,completed:1,status:'complete'};
 const result=resolveAction(final,{type:'parliament-finish'});assert.match(result.report,/skip refresh and proceed to Final Scoring/);assert.throws(()=>resolveAction(result.state,{type:'next-turn'}),/final turn/);
});
