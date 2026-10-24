import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,encode,decode} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {EVENT_TILES,TILES,createEventStack,validateEventStack,drawRequest,pendingEvent,exposedRegion} from '../dist/event-stack.js';
const zero=a=>{a[0]=0;},ids=EVENT_TILES.map(t=>t.id);
const ordered=(first,discard=[])=>({version:1,draw:[...first,...ids.filter(id=>!first.includes(id)&&!discard.includes(id))],discard:[...discard],pending:null});
function ready(stack){let s=initialState();s.eventStack=stack;return resolveAction(s,{type:'phase-start',face:4}).state;}
function draw(s){return resolveAction(s,drawRequest(s.eventStack,zero)).state;}
function finish(s){return resolveAction(s,pendingEvent(s.eventStack)).state;}

test('catalogue preserves 20 paired tiles and the supplied front modifiers and symbols',()=>{
 const count={};for(const t of EVENT_TILES)count[t.event]=(count[t.event]||0)+1;
 assert.deepEqual(count,{crisis:6,windfall:2,peace:2,turmoil:4,leader:4,shuffle:1,foreign:1});
 assert.equal(TILES['punjab-crisis'].modifier,-1);assert.equal(TILES['hyderabad-leader'].modifier,4);
 assert.equal(TILES['madras-shuffle'].shape,'circle');assert.equal(TILES['mysore-peace'].shape,'square');
 const stack=createEventStack(zero);assert.equal(new Set(stack.draw).size,20);validateEventStack(stack);
});

test('draw exposes the next tile back and uses the DRAWN front symbol for March',()=>{
 const before=ready(ordered(['delhi-crisis','bombay-turmoil']));assert.equal(exposedRegion(before.eventStack),'delhi');
 const reserved=draw(before),input=pendingEvent(reserved.eventStack);
 assert.equal(reserved.indiaPhase.completed,0);assert.equal(exposedRegion(reserved.eventStack),'bombay');
 assert.equal(input.modifier,0);assert.equal(input.shape,'triangle');assert.equal(input.topRegion,'bombay');
 const result=finish(reserved);assert.deepEqual(result.elephant,{from:'bombay',to:'punjab'});
 assert.equal(result.indiaPhase.completed,1);assert.equal(result.eventStack.pending,null);assert.deepEqual(result.eventStack.discard,['delhi-crisis']);
 assert.equal(before.eventStack.draw[0],'delhi-crisis');
});

test('revealed event and reshuffle permutations survive reload; an unresolved draw cannot be replaced',()=>{
 const s=draw(ready(ordered(['madras-shuffle','punjab-turmoil'],['bombay-turmoil','delhi-turmoil'])));
 const saved=decode(encode(s)).state;
 assert.deepEqual(saved.eventStack,s.eventStack);assert.deepEqual(pendingEvent(saved.eventStack),pendingEvent(s.eventStack));
 assert.throws(()=>resolveAction(saved,{type:'stack-draw'}),/already revealed/);
 assert.throws(()=>resolveAction(saved,{type:'blackmail',card:'india',office:'president:bombay'}),/revealed stack event/);
 assert.throws(()=>resolveAction(saved,{type:'event',event:'windfall',manualTest:true,topRegion:'delhi'}),/revealed stack tile/);
});

test('normal Shuffle marches using the pre-reshuffle top, then layers shuffled discards over the remaining pile',()=>{
 const s=draw(ready(ordered(['madras-shuffle','punjab-turmoil'],['bombay-turmoil','delhi-turmoil'])));
 const p=s.eventStack.pending,plan=structuredClone(p.rebuild);assert.equal(pendingEvent(s.eventStack).topRegion,'punjab');
 const result=finish(s);assert.deepEqual(result.elephant,{from:'punjab',to:'delhi'});
 assert.deepEqual(result.eventStack.draw,[...plan.discards,...plan.draw]);assert.deepEqual(result.eventStack.discard,[]);
 assert.equal(result.eventStack.draw.length,20);assert.equal(result.indiaPhase.completed,1);
 assert.notEqual(exposedRegion(result.eventStack),'punjab');
});

test('Shuffle as the last tile rebuilds first and marches using the newly exposed region',()=>{
 const stack={version:1,draw:['madras-shuffle'],discard:ids.filter(id=>id!=='madras-shuffle'),pending:null};
 const s=draw(ready(stack)),p=s.eventStack.pending;
 assert.equal(exposedRegion(s.eventStack),null);assert.equal(p.emptyAfterDraw,true);
 const top=p.rebuild.discards[0],region=TILES[top].region;
 assert.equal(pendingEvent(s.eventStack).topRegion,region);
 const result=finish(s);assert.equal(result.elephant.from,region);assert.equal(exposedRegion(result.eventStack),region);assert.equal(result.eventStack.draw.length,20);
});

test('manual resolution changes the map without consuming the stack or phase quota, including after phase completion',()=>{
 const s=ready(ordered(['madras-windfall']));
 const result=resolveAction(s,{type:'event',manualTest:true,event:'turmoil',topRegion:'bombay'}).state;
 assert.equal(result.regions.bombay.orders.bo3n,false);assert.deepEqual(result.eventStack,s.eventStack);assert.equal(result.indiaPhase.completed,0);
 const complete=structuredClone(s);complete.indiaPhase.completed=4;complete.indiaPhase.status='complete';
 assert.doesNotThrow(()=>resolveAction(complete,{type:'event',manualTest:true,event:'windfall',topRegion:'delhi'}));
 assert.equal(resolveAction(complete,{type:'event',manualTest:true,event:'windfall',topRegion:'delhi'}).state.indiaPhase.completed,4);
});

test('stack fields cannot be overridden and invalid duplicated or missing tiles are rejected',()=>{
 const s=draw(ready(ordered(['madras-windfall','punjab-turmoil'])));
 const input=pendingEvent(s.eventStack),result=resolveAction(s,{...input,event:'turmoil',topRegion:'bombay',modifier:9}).state;
 assert.equal(result.regions.bombay.orders.bo3n,true);assert.match(result.history.at(-1).report,/Punjab, Delhi, Bombay/);
 const duplicate=createEventStack(zero);duplicate.draw[0]=duplicate.draw[1];assert.throws(()=>validateEventStack(duplicate),/exactly once/);
});
