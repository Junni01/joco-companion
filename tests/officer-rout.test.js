import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion,encode,decode} from '../dist/model.js';
import {resolveAction,NeedsInput} from '../dist/actions.js';
import {saveActionProgress,loadActionProgress} from '../dist/action-progress.js';
import {readableChronicle} from '../dist/chronicle.js';
const owned=(s,id,presidency='bombay')=>correctRegion(s,id,{control:'company',presidency,lootAvailable:false});
const crisis={type:'event',manualTest:true,event:'crisis',modifier:1,topRegion:'mysore',shape:'circle'};

test('only a lost Company region requests rout; zero is an explicit recorded result',()=>{
 const s=owned(initialState(),'bombay');s.elephant={from:'bombay',to:null};const before=JSON.stringify(s);
 assert.deepEqual(resolveAction(s,{...crisis,defenses:{crisis:1}}).state.history.at(-1).officerRouts,[]);
 assert.throws(()=>resolveAction(s,{...crisis,defenses:{crisis:0}}),e=>e instanceof NeedsInput&&e.request.type==='officer-rout'&&e.request.region==='bombay'&&e.request.presidency==='bombay');
 assert.equal(JSON.stringify(s),before);
 const r=resolveAction(s,{...crisis,defenses:{crisis:0},officerRouts:{bombay:0}});
 assert.deepEqual(r.state.history.at(-1).officerRouts,[{region:'bombay',presidency:'bombay',removed:0}]);
 assert.match(readableChronicle(r.state),/0 officers removed/);
 for(const removed of [-1,1.5,'2',1001])assert.throws(()=>resolveAction(s,{...crisis,defenses:{crisis:0},officerRouts:{bombay:removed}}),/whole number/);
});

test('additional rebellions record separate routs for two regions of the same Army',()=>{
 let s=owned(initialState(),'bombay');s=owned(s,'hyderabad');s.regions.hyderabad.unrest=1;s.elephant={from:'bombay',to:null};
 const d={...crisis,defenses:{crisis:0,'crisis:secondary:hyderabad':0},officerRouts:{bombay:2}};
 assert.throws(()=>resolveAction(s,d),e=>e instanceof NeedsInput&&e.request.type==='officer-rout'&&e.request.region==='hyderabad');
 const r=resolveAction(s,{...d,officerRouts:{bombay:2,hyderabad:1}});
 const saved=decode(encode(r.state,[s]));
 assert.deepEqual(saved.state.history.at(-1).officerRouts,[{region:'bombay',presidency:'bombay',removed:2},{region:'hyderabad',presidency:'bombay',removed:1}]);
 assert.equal(saved.undo[0].history.length,s.history.length);
});

test('a manually reported rout preserves progress and rejects malformed portable counts',()=>{
 const s=owned(initialState(),'bombay');s.elephant={from:'bombay',to:null};const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 const d={...crisis,defenses:{crisis:0},officerRouts:{bombay:0}};
 saveActionProgress(s,d,'resolve',storage);const p=loadActionProgress(s,storage);assert.equal(p.input.officerRouts.bombay,0);
 const json=encode(s,[],p);assert.equal(decode(json).progress.input.officerRouts.bombay,0);
 for(const badCounts of [{bombay:-1},{bombay:0.5},{unknown:1},[],'bad']){const bad=JSON.parse(json);bad.progress.input.officerRouts=badCounts;assert.throws(()=>decode(JSON.stringify(bad)),/invalid officer rout counts/);}
});
