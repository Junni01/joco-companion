import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion,encode,decode} from '../dist/model.js';
import {createEventStack} from '../dist/event-stack.js';
import {resolveAction} from '../dist/actions.js';
import {saveActionProgress,loadActionProgress} from '../dist/action-progress.js';
import {STORM_RESULTS} from '../dist/india-phase.js';
import {inParliament} from './phase-fixtures.js';

test('all six France storm faces select invasion targets without changing the India phase or event stack',()=>{
 const s=inParliament(initialState());s.eventStack=createEventStack(a=>{a[0]=0;});
 const expected=[['bengal'],['bombay'],['madras'],['bombay','madras','bengal'],[],[]];
 for(let stormFace=0;stormFace<6;stormFace++){
  const r=resolveAction(s,{type:'france',outcome:'failed',stormFace,rolls:{bombay:1,madras:1,bengal:1}});
  assert.deepEqual(r.instructions.filter(t=>t.startsWith('Foreign invasion of ')).map(t=>t.match(/Foreign invasion of (\w+)/)[1].toLowerCase()),expected[stormFace]);
  assert.equal(r.state.history.at(-1).input.storm,STORM_RESULTS[stormFace]);assert.deepEqual(r.state.eventStack,s.eventStack);assert.deepEqual(r.state.indiaPhase,s.indiaPhase);
 }
 assert.throws(()=>resolveAction(s,{type:'france',outcome:'failed',stormFace:0,storm:'west'}),/does not match/);
 assert.throws(()=>resolveAction(s,{type:'france',outcome:'failed',stormFace:6}),/Invalid France/);
});

test('France uses the digital exposed region and circle redirect even when the capital dominates every neighbour',()=>{
 let s=correctRegion(initialState(),'bombay',{control:'company',presidency:'bombay',lootAvailable:false});s=inParliament(s);s.elephant={from:'bombay',to:null};s.eventStack=createEventStack(a=>{a[0]=0;});
 s.eventStack.draw=['madras-windfall',...s.eventStack.draw.filter(id=>id!=='madras-windfall')];
 s.regions.hyderabad.overlord='madras';s.regions.mysore.overlord='madras';s.regions.madras.empireCapital=true;
 const r=resolveAction(s,{type:'france',outcome:'failed',stormFace:1,rolls:{bombay:3},defenses:{'foreign:bombay':0},officerRouts:{bombay:0},topRegion:'punjab',shape:'square',redirectShape:'triangle'});
 assert.deepEqual(r.state.elephant,{from:'hyderabad',to:'madras'});assert.equal(r.state.history.at(-1).input.topRegion,'madras');assert.equal(r.state.history.at(-1).input.redirectShape,'circle');
});

test('a saved France storm alone is portable committed progress and malformed faces are rejected',()=>{
 const s=inParliament(initialState()),values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 const input={type:'france',outcome:'failed',stormFace:0,storm:'east'};saveActionProgress(s,input,'resolve',storage);const p=loadActionProgress(s,storage),json=encode(s,[],p);
 assert.equal(decode(json).progress.input.stormFace,0);
 for(const patch of [{stormFace:-1},{stormFace:6},{stormFace:1.5},{stormFace:'0'},{storm:'west'},{outcome:'passed'}]){const bad=JSON.parse(json);Object.assign(bad.progress.input,patch);assert.throws(()=>decode(JSON.stringify(bad)),/invalid France storm die/);}
});
