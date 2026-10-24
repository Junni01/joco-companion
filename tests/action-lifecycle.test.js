import {inParliament} from './phase-fixtures.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {openGameActions} from '../dist/action-dialogs.js';
import {openDeployment} from '../dist/deploy.js';
import {ACTION_PROGRESS,loadActionProgress,saveActionProgress} from '../dist/action-progress.js';
import {initialState,correctRegion} from '../dist/model.js';
import {createEventStack,drawRequest,pendingEvent} from '../dist/event-stack.js';
import {resolveAction} from '../dist/actions.js';

function harness(){
 const nodes=new Map(),storage=new Map();
 const node=()=>({value:'',innerHTML:'',onclick:null,onchange:null,closed:false,open:true,classList:{remove(){}},close(){this.closed=true;this.open=false;}});
 nodes.set('dialog',node());nodes.set('dialog-content',node());
 globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:()=>[]};
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 globalThis.confirm=()=>assert.fail('Closing an unconfirmed form must not ask for confirmation');
 globalThis.matchMedia=()=>({matches:true});
 const showDialog=(title,body,actions='')=>{
  const html=body+actions;nodes.get('dialog-content').onchange=null;nodes.get('dialog-content').innerHTML=html;
  for(const m of (html+'<p id="form-error"></p>').matchAll(/\bid="([^"]+)"/g))nodes.set(m[1],node());
  for(const m of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const selected=m[2].match(/<option value="([^"]*)"[^>]*selected/);nodes.get(m[1]).value=selected?.[1]||'';}
  for(const m of html.matchAll(/<input[^>]*id="([^"]+)"[^>]*value="([^"]*)"/g))nodes.get(m[1]).value=m[2];
 };
 const click=id=>{assert.equal(typeof nodes.get(id)?.onclick,'function',`Missing handler: ${id}`);nodes.get(id).onclick();};
 return {nodes,storage,showDialog,click};
}

test('ordinary edits and previews leave no resumable action and do not block a different form',()=>{
 const h=harness(),state=correctRegion(initialState(),'bombay',{control:'company',presidency:'bombay'}),before=JSON.stringify(state);
 const open=start=>openGameActions({state,showDialog:h.showDialog,apply:()=>assert.fail('An unconfirmed form cannot apply'),esc:String,start});
 open({type:'unrest',regionContext:'bombay'});h.nodes.get('reason').value='failure';h.nodes.get('dialog-content').onchange();
 assert(!h.storage.has(ACTION_PROGRESS));h.click('review-action');assert(!h.storage.has(ACTION_PROGRESS));
 h.nodes.get('dialog').close();open({type:'tax',regionContext:'bombay'});assert.match(h.nodes.get('tax-effect').innerHTML,/0 unrest/);
 assert(!h.nodes.get('dialog-content').innerHTML.includes('Resume pending action'));assert.equal(JSON.stringify(state),before);
});

test('closing deployment at review forgets everything and reopening starts with zero troops',()=>{
 const h=harness(),state=initialState(),before=JSON.stringify(state),args={state,showDialog:h.showDialog,apply:()=>assert.fail('Unconfirmed deployment applied'),esc:String,targetRegion:'bombay'};
 openDeployment(args);h.nodes.get('army').value='bombay';h.click('next-deploy');h.nodes.get('regiments').value='5';h.nodes.get('officers').value='0';h.click('next-deploy');h.nodes.get('outcome').value='success';h.click('next-deploy');h.nodes.get('losses').value='0';h.click('next-deploy');
 assert.match(h.nodes.get('dialog-content').innerHTML,/Confirming records this deployment/);assert.equal(h.storage.size,0);
 h.nodes.get('dialog').close();openDeployment(args);assert.match(h.nodes.get('dialog-content').innerHTML,/STEP 1 OF 5/);h.nodes.get('army').value='bombay';h.click('next-deploy');assert.equal(h.nodes.get('regiments').value,'0');
 h.click('cancel-deploy');assert(h.nodes.get('dialog').closed);assert.equal(h.nodes.get('dialog-content').onchange,null);assert.equal(JSON.stringify(state),before);
});

test('revealed tile progress reopens automatically and cannot be replaced by a different action',()=>{
 const h=harness();let state=initialState();state.eventStack=createEventStack(a=>{a[0]=0;});
 const first='madras-windfall';state.eventStack.draw=[first,...state.eventStack.draw.filter(id=>id!==first)];
 state=resolveAction(state,{type:'phase-start',face:4}).state;state=resolveAction(state,drawRequest(state.eventStack)).state;
 const before=JSON.stringify(state);let result;
 const args={state,showDialog:h.showDialog,apply:r=>result=r,esc:String};
 openGameActions({...args,start:pendingEvent(state.eventStack)});assert(h.storage.has(ACTION_PROGRESS));h.nodes.get('dialog').close();
 openGameActions({...args,start:'tax'});assert.match(h.nodes.get('dialog-content').innerHTML,/Tile back:/);assert(!h.nodes.get('dialog-content').innerHTML.includes('Discard pending'));
 assert.equal(JSON.stringify(state),before);h.click('review-action');h.click('confirm-action');assert.equal(result.state.eventStack.pending,null);assert.equal(result.state.indiaPhase.completed,1);assert(!h.storage.has(ACTION_PROGRESS));
});

test('France saves its automatic storm before invasion strength, and neither result rerolls on resume',()=>{
 const h=harness(),state=inParliament(initialState()),before=JSON.stringify(state);let calls=0,result;
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){calls++;a[0]=calls===1?1:2;return a;}}});
 const args={state,showDialog:h.showDialog,apply:r=>result=r,esc:String};
 openGameActions({...args,start:'france'});h.nodes.get('outcome').value='failed';assert(!h.storage.has(ACTION_PROGRESS));h.click('review-action');assert.equal(loadActionProgress(state).input.storm,'west');h.click('dice-continue');
 h.click('roll-invasion');assert.equal(calls,2);assert.equal(loadActionProgress(state).input.rolls.bombay,3);assert.equal(JSON.stringify(state),before);
 h.nodes.get('dialog').close();openGameActions({...args,start:'tax'});assert.equal(calls,2);assert.match(h.nodes.get('dialog-content').innerHTML,/saved roll is already part/);assert(h.nodes.get('confirm-action'));
 h.click('confirm-action');assert.equal(calls,2);assert.equal(result.state.history.at(-1).input.rolls.bombay,3);assert(!h.storage.has(ACTION_PROGRESS));
});

test('legacy form drafts are removed, while previously committed storm and stack results are retained',()=>{
 const h=harness(),state=initialState(),fingerprint=JSON.stringify(state);
 h.storage.set(ACTION_PROGRESS,JSON.stringify({fingerprint,input:{type:'unrest',region:'bombay',reason:'tax'},stage:'resolve'}));assert.equal(loadActionProgress(state),null);assert(!h.storage.has(ACTION_PROGRESS));
 saveActionProgress(state,{type:'phase-start',face:3},'resolve');assert.equal(loadActionProgress(state).input.face,3);
 saveActionProgress(state,{type:'stack-draw',rebuild:{draw:['madras-shuffle'],discards:[]}},'resolve');assert.equal(loadActionProgress(state).input.type,'stack-draw');
 const other=initialState();other.turn=2;assert.equal(loadActionProgress(other),null);assert(!h.storage.has(ACTION_PROGRESS));
});
