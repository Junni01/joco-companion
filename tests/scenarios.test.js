import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,validate,encode,decode,IDS,summary} from '../dist/model.js';
import {SCENARIOS,finalTurn} from '../dist/scenarios.js';
import {resolveAction} from '../dist/actions.js';
import {canCompleteGame} from '../dist/game-end.js';
import {nextTurnBlockReason} from '../dist/india-phase.js';
import {turnGuideHTML} from '../dist/turn-guide.js';
import {readableChronicle} from '../dist/chronicle.js';

test('all four scenarios use the printed turn range and independently owned setup data',()=>{
 for(const [id,c] of Object.entries(SCENARIOS)){
  const s=validate(initialState(id));assert.equal(s.turn,c.start);assert.equal(s.chinaOffice,id==='1813');
  const restored=decode(encode(s)).state;assert.deepEqual(restored,s);
  assert.match(readableChronicle(s),new RegExp(`Turn ${c.start} of ${c.end}`));
  assert(!nextTurnBlockReason(s).includes('final turn'));
  s.turn=c.end-1;s.indiaPhase={turn:s.turn,face:3,total:1,completed:1,status:'complete'};
  const next=resolveAction(resolveAction(s,{type:'parliament-finish'}).state,{type:'next-turn'}).state;
  assert.equal(next.turn,c.end);assert.equal(next.indiaPhase,null);validate(next);
  s.turn=c.end;s.indiaPhase={turn:c.end,face:3,total:1,completed:1,status:'complete'};
  assert(!canCompleteGame(s));const finished=resolveAction(s,{type:'parliament-finish'});
  assert.match(finished.report,/skip refresh/);assert(canCompleteGame(finished.state));
  assert.match(nextTurnBlockReason(finished.state),/final turn/);
  assert.throws(()=>resolveAction(finished.state,{type:'next-turn'}),/final turn/);
  const ended=resolveAction(finished.state,{type:'end-game',reason:'completed'});validate(ended.state);
  s.elephant.from='bombay';assert.notEqual(initialState(id).elephant.from,'bombay');
 }
 assert.equal(finalTurn({...initialState(),turn:5}),true);
 assert.equal(finalTurn({...initialState('1710-long'),turn:5}),false);
});
test('1758 and 1813 board setups match Company control, towers, empires, orders, loot and Elephant',()=>{
 const s=initialState('1758');assert.deepEqual(summary(s),{company:1,opium:2,unrest:0,closed:7});
 assert.deepEqual(IDS.map(id=>s.regions[id].strength),[1,1,0,2,2,1,2,1]);
 assert.equal(s.regions.punjab.overlord,'delhi');assert.equal(s.regions.maratha.overlord,null);
 assert.equal(s.regions.bengal.presidency,'bengal');assert.equal(s.regions.bengal.lootAvailable,false);
 assert.deepEqual(s.elephant,{from:'delhi',to:'bengal'});assert.equal(s.laws.royalProtection,false);assert.equal(s.laws.calicoActs,true);
 assert.equal(s.regions.madras.orders.md5,false);assert.equal(s.regions.mysore.orders.my6,false);
 const n=initialState('1813');assert.deepEqual(summary(n),{company:3,opium:3,unrest:0,closed:7});
 assert.deepEqual(IDS.map(id=>n.regions[id].strength),[2,1,0,0,2,1,2,0]);
 assert(IDS.every(id=>n.regions[id].overlord===null));assert(n.laws.governorGeneral&&n.laws.deregulation&&n.laws.militaryOversight);
 assert.deepEqual(n.elephant,{from:'mysore',to:'madras'});assert.equal(n.regions.hyderabad.orders.h7,true);
 for(const id of ['bombay','madras','bengal']){assert.equal(n.regions[id].presidency,id);assert.equal(n.regions[id].lootAvailable,false);}
 assert.equal(resolveAction(n,{type:'tax',region:'bombay'}).state.regions.bombay.unrest,1);
 assert.match(turnGuideHTML('family',5,n),/Firms phase/);
 assert.deepEqual(initialState('1710-long').regions,initialState().regions);
});
test('Deregulation is a special early-turn vote and cannot bypass scenario or phase restrictions',()=>{
 for(const id of ['1758','1710-long']){
  const s=initialState(id),failed=resolveAction(s,{type:'deregulation',outcome:'failed'});assert(!failed.state.laws.deregulation);
  const passed=resolveAction(s,{type:'deregulation',outcome:'passed'});assert(passed.state.laws.deregulation);
  assert.deepEqual(passed.state.regions,s.regions);assert.equal(passed.state.laws.governorGeneral,false);
  assert.match(turnGuideHTML('family',s.turn,passed.state),/Firms phase/);
  assert.throws(()=>resolveAction(passed.state,{type:'deregulation',outcome:'passed'}),/already active/);
  s.indiaPhase={turn:s.turn,face:3,total:1,completed:1,status:'complete'};
  assert.throws(()=>resolveAction(s,{type:'deregulation',outcome:'passed'}),/start of the turn/);
 }
 assert.throws(()=>resolveAction(initialState(),{type:'deregulation',outcome:'passed'}),/not available/);
});
test('old 1710 saves retain their board and remain readable at legacy turn six',()=>{
 const s=initialState();s.turn=6;s.regions.hyderabad.orders.h7=true;delete s.laws.calicoActs;delete s.laws.militaryOversight;delete s.laws.deregulation;
 const restored=decode(encode(s)).state;assert.equal(restored.regions.hyderabad.orders.h7,true);assert.equal(restored.turn,6);assert(finalTurn(restored));
 assert.match(nextTurnBlockReason(restored),/final turn/);
 assert.throws(()=>validate({...initialState('1758'),turn:1}),/range/);
 assert.throws(()=>validate({...initialState('1813'),turn:9}),/range/);
});
