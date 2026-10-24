import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,encode,decode} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {createEventStack,pendingEvent} from '../dist/event-stack.js';
import {openGameActions} from '../dist/action-dialogs.js';
import {openIndiaPhase} from '../dist/phase-dialog.js';
import {loadActionProgress,saveActionProgress} from '../dist/action-progress.js';
import {STORM_RESULTS} from '../dist/india-phase.js';

function harness(initial=initialState()){
 const nodes=new Map(),storage=new Map();let state=initial,title='',html='',calls=0;
 const node=()=>({value:'',disabled:false,open:true,classList:{remove(){}},setAttribute(k,v){this[k]=v;},close(){this.open=false;}});
 nodes.set('dialog',node());nodes.set('dialog-content',node());
 globalThis.matchMedia=()=>({matches:true});
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){calls++;a[0]=4;return a;}}});
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:selector=>selector==='[data-phase-face]'?[...nodes.values()].filter(n=>n.dataset?.phaseFace!==undefined):[]};
 const showDialog=(t,body,actions='')=>{title=t;html=body+actions;
  for(const m of (html+'<p id="form-error"></p>').matchAll(/\bid="([^"]+)"/g))nodes.set(m[1],node());
  for(const m of html.matchAll(/data-phase-face="(\d)"/g)){const n=node();n.dataset={phaseFace:m[1]};nodes.set('face-'+m[1],n);}
  for(const m of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))nodes.get(m[1]).value=m[2].match(/<option value="([^"]*)"[^>]*selected/)?.[1]||'';
 };
 const args=()=>({state,showDialog,apply:r=>state=r.state,esc:String});
 return {nodes,get state(){return state;},get html(){return html;},get title(){return title;},get calls(){return calls;},click:id=>nodes.get(id).onclick(),phase:()=>openIndiaPhase({...args(),drawEvent(){},blackmail(){}}),event:start=>openGameActions({...args(),start}),drain(){for(let i=0;html.includes('id="continue-resolution-step"');i++){assert(i<20);nodes.get('continue-resolution-step').onclick();}}};
}

test('physical phase roll waits for confirmation, uses every distinct face and never rolls in the app',()=>{
 for(const [face,total,status] of [[0,2,'ships'],[1,2,'ships'],[2,3,'ships'],[3,1,'ships'],[4,4,'events']]){
  const h=harness();h.phase();assert.match(h.html,/Roll physical die/);h.click('manual-phase-storm');assert.match(h.html,/id="confirm-phase-storm"[^>]*disabled/);
  h.click('confirm-phase-storm');assert.equal(h.state.indiaPhase,null);
  h.click('face-'+face);assert.equal(h.state.indiaPhase,null);assert.equal(h.calls,0);const confirm=h.nodes.get('confirm-phase-storm').onclick;confirm();confirm();
  assert.equal(h.calls,0);assert.equal(h.state.indiaPhase.face,face);assert.equal(h.state.indiaPhase.total,total);assert.equal(h.state.indiaPhase.status,status);assert.equal(h.state.history.length,1);
  h.phase();assert(!h.html.includes('manual-phase-storm'));assert.deepEqual(decode(encode(h.state)).state.indiaPhase,h.state.indiaPhase);
 }
});

test('app phase roll still saves a single result and displays its animation',()=>{
 const h=harness();h.phase();const start=h.nodes.get('start-india-phase').onclick;start();assert.equal(h.calls,1);assert.equal(h.title,'Rolling the storm die');assert.equal(h.state.indiaPhase.total,4);h.click('dice-continue');assert.equal(h.title,'Events in India');
});

test('drawn Foreign Invasion automatically rolls once and resumes its saved face without a selector',()=>{
 let s=resolveAction(initialState(),{type:'phase-start',face:4}).state;s.eventStack=createEventStack(a=>a[0]=0);
 s.eventStack.draw=['maratha-foreign',...s.eventStack.draw.filter(id=>id!=='maratha-foreign')];s=resolveAction(s,{type:'stack-draw'}).state;
 const h=harness(s);h.event(pendingEvent(s.eventStack));assert(!h.html.includes('id="storm"'));assert.equal(h.calls,0);h.click('review-action');assert.equal(h.calls,1);assert.equal(h.title,'Rolling the storm die');
 const saved=loadActionProgress(s);assert.equal(saved.input.stormFace,4);assert.equal(saved.input.storm,'none');assert.equal(decode(encode(s,[],saved)).progress.input.stormFace,4);
 h.event();assert.equal(h.calls,1);assert.match(h.title,/Foreign invasion/);h.click('roll-invasion');assert.equal(h.calls,2);h.click('dice-continue');h.drain();assert.match(h.title,/Review/);h.click('confirm-action');assert.equal(h.state.indiaPhase.completed,1);assert.equal(h.state.indiaPhase.total,4);assert.equal(h.state.history.at(-1).input.stormFace,4);
});

test('manual event tests also roll Foreign Invasion storm automatically and retain it on reopening',()=>{
 const h=harness();h.event({type:'event',event:'foreign',manualTest:true,topRegion:'punjab',shape:'circle',redirectShape:'circle'});assert(!h.html.includes('id="storm"'));h.click('review-action');assert.equal(h.calls,1);assert.equal(loadActionProgress(h.state).input.stormFace,4);h.event();assert.equal(h.calls,1);assert.match(h.title,/Foreign invasion/);
});

test('Foreign Invasion saved faces select correct targets and reject contradictory or invalid input',()=>{
 const s=initialState(),expected=[['bengal'],['bombay'],['madras'],['bombay','madras','bengal'],['punjab'],['punjab']];
 for(let stormFace=0;stormFace<6;stormFace++){
  const input={type:'event',event:'foreign',manualTest:true,topRegion:'punjab',shape:'circle',redirectShape:'circle',stormFace,rolls:{bombay:1,madras:1,bengal:1,punjab:1}};
  const r=resolveAction(s,input);assert.deepEqual(r.instructions.filter(t=>t.startsWith('Foreign invasion of ')).map(t=>t.match(/Foreign invasion of (\w+)/)[1].toLowerCase()),expected[stormFace]);assert.equal(r.state.history.at(-1).input.storm,STORM_RESULTS[stormFace]);
 }
 assert.throws(()=>resolveAction(s,{type:'event',event:'foreign',stormFace:0,storm:'west'}),/does not match/);
 assert.throws(()=>resolveAction(s,{type:'event',event:'foreign',stormFace:6}),/Invalid Foreign Invasion/);
 const storage={value:null,setItem(k,v){this.value=v;},getItem(){return this.value;},removeItem(){this.value=null;}};
 saveActionProgress(s,{type:'event',event:'foreign',manualTest:true,stormFace:2,storm:'south'},'resolve',storage);const p=loadActionProgress(s,storage);assert(p);
 const bad=JSON.parse(encode(s,[],p));bad.progress.input.storm='west';assert.throws(()=>decode(JSON.stringify(bad)),/Foreign Invasion storm die/);
});
