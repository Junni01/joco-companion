import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,clone,encode,decode,resolveDeployment,legalTargets} from '../dist/model.js';
import {SCENARIOS} from '../dist/scenarios.js';
import {TILES,drawRequest,pendingEvent} from '../dist/event-stack.js';
import {resolveAction} from '../dist/actions.js';
import {workspaceKeys} from '../dist/workspace-mode.js';
import {debugState,validateDebugState,debugEditRegion,debugEditElephant,debugPhase,debugFlags,debugDeck,debugMoveTile,debugStageEvent,debugResult} from '../dist/debug-state.js';

test('debug autosaves, snapshots and pending rolls have independent keys; every scenario starts legally',()=>{
 const regular=workspaceKeys('/'),debug=workspaceKeys('/debug.html');
 for(const key of ['campaign','slots','progress'])assert.notEqual(regular[key],debug[key]);
 assert.deepEqual(workspaceKeys('/index.html'),regular);assert.equal(debug.debug,true);
 for(const id of Object.keys(SCENARIOS)){
  const s=debugState(id),normal=initialState(id);assert(s.debugMode);assert.deepEqual(s.regions,normal.regions);assert.deepEqual(s.elephant,normal.elephant);assert.deepEqual(s.laws,normal.laws);assert.equal(s.eventStack.draw.length,20);assert.doesNotThrow(()=>validateDebugState(s));
 }
});

test('debug setup rejects wrong home armies, empire chains, invalid positions and excess physical pieces',()=>{
 const s=debugState();assert.throws(()=>debugEditRegion(s,'bombay',{control:'company',presidency:'madras'}),/own Presidency/);
 assert.throws(()=>debugEditRegion(s,'bengal',{control:'indian',overlord:'punjab'}),/capital/);
 assert.throws(()=>debugEditRegion(s,'delhi',{control:'indian',overlord:'delhi'}),/overlord/);
 assert.throws(()=>debugEditRegion(s,'mysore',{control:'indian',strength:21}),/20 tower/);
 const c=debugEditRegion(s,'bombay',{control:'company',presidency:'bombay',unrest:30});assert.throws(()=>debugEditRegion(c,'madras',{control:'company',presidency:'madras',unrest:1}),/30 unrest/);
 assert.throws(()=>debugEditElephant(c,'bombay','delhi'),/legal Elephant/);
 const invalid=clone(c);invalid.regions.bombay.presidency='madras';assert.throws(()=>validateDebugState(invalid),/home region/);
});

test('debug edits normalize subjects, flags, spent loot and Elephant while preserving the source board',()=>{
 const s=debugState(),before=JSON.stringify(s);
 const n=debugEditRegion(s,'delhi',{control:'company',presidency:'bombay',unrest:2});
 assert.equal(n.regions.punjab.overlord,null);assert.equal(n.regions.maratha.overlord,null);assert.equal(n.regions.delhi.empireCapital,false);assert.equal(n.regions.delhi.strength,0);assert.equal(n.regions.delhi.lootAvailable,false);assert.equal(JSON.stringify(s),before);
 const m=debugEditRegion(s,'maratha',{control:'company',presidency:'bombay',unrest:2});assert.deepEqual(m.elephant,{from:'maratha',to:null});
 const r=debugResult(s,m,'example');assert.match(r.state.history.at(-1).title,/Debug setup/);assert.deepEqual(decode(encode(r.state,[s])).state,m.history.length?m:r.state);
});

test('debug deck preserves every unique tile, rejects illegal piles and supports ordering either pile',()=>{
 const s=debugState(),tile=s.eventStack.draw.find(id=>id!=='madras-shuffle');
 const moved=debugMoveTile(s,tile,'discard',0);assert.equal(moved.eventStack.discard[0],tile);assert(!moved.eventStack.draw.includes(tile));
 const back=debugMoveTile(moved,tile,'draw',0);assert.equal(back.eventStack.draw[0],tile);
 assert.throws(()=>debugMoveTile(s,'madras-shuffle','discard',0),/Shuffle/);
 assert.throws(()=>debugDeck(s,[],Object.keys(TILES)),/Shuffle|empty/);
 assert.throws(()=>debugDeck(s,[...s.eventStack.draw,tile],[]),/exactly once/);
 assert.throws(()=>debugMoveTile(s,tile,'draw',999),/position/);
});

test('staged events draw and finish through the real engine, including Shuffle and March',()=>{
 for(const tile of ['madras-peace','mysore-crisis','madras-shuffle']){
  let s=debugStageEvent(debugState(),tile,'mysore');assert.equal(s.eventStack.draw[0],tile);assert.equal(TILES[s.eventStack.draw[1]].region,'mysore');
  s=resolveAction(s,drawRequest(s.eventStack)).state;assert(s.eventStack.pending);assert.throws(()=>debugMoveTile(s,'delhi-crisis','draw',0),/pending/);
  const r=resolveAction(s,pendingEvent(s.eventStack));assert.equal(r.state.eventStack.pending,null);assert.equal(r.state.indiaPhase.completed,1);assert(r.elephantMoves.length>0);
  if(tile==='madras-shuffle'){assert(!r.state.eventStack.discard.includes(tile));assert(r.state.eventStack.draw.includes(tile));}else assert.equal(r.state.eventStack.discard.at(-1),tile);
 }
});

test('debug laws, offices, phase limits, Tax, Governor General, Envoy and Deploy share real mechanics',()=>{
 let s=debugState();s=debugEditRegion(s,'bombay',{control:'company',presidency:'bombay',unrest:1});
 assert(legalTargets(s,'bombay').includes('bombay'));
 const deployment=resolveDeployment(s,{army:'bombay',target:'bombay',officers:1,regiments:0,alliances:[],outcome:'success',losses:0});assert.equal(deployment.state.regions.bombay.unrest,0);
 s=resolveAction(s,{type:'tax',region:'bombay'}).state;assert.equal(s.regions.bombay.unrest,1);s=resolveAction(s,{type:'tax',region:'bombay'}).state;assert.equal(s.regions.bombay.unrest,2);
 s=debugFlags(s,{envoyChina:true,governorGeneral:true,zamindarTaxes:true},false);assert(s.chinaOffice);
 s=resolveAction(s,{type:'govern',outcome:'failure',sixes:2}).state;assert.equal(s.regions.bombay.unrest,6);
 assert.throws(()=>resolveAction(s,{type:'envoy',outcome:'success',purpose:'order',order:'p7'}),/Governor General/);
 s=debugFlags(s,{governorGeneral:false},true);s=resolveAction(s,{type:'envoy',outcome:'success',purpose:'order',order:'p7'}).state;assert(s.regions.punjab.orders.p7);
 const parliament=debugPhase(s,'parliament');assert.deepEqual(parliament.regions,s.regions);assert.throws(()=>resolveDeployment(parliament,{army:'bombay',target:'bombay'}),/legal target/);
 const famine=resolveAction(parliament,{type:'famine',outcome:'failed'});assert.equal(famine.state.regions.bombay.unrest,7);
});
