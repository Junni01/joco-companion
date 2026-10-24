import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion} from '../dist/model.js';
import {openGameActions,ACTION_DRAFT} from '../dist/action-dialogs.js';

function harness(state){
 const nodes=new Map(),storage=new Map();let html='',result=null;
 const element=()=>({value:'',close(){}});nodes.set('dialog',element());nodes.set('dialog-content',element());
 globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:()=>[]};
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const showDialog=(title,body,actions='')=>{html=body+actions;nodes.get('dialog-content').onchange=null;for(const m of (html+'<p id="form-error"></p>').matchAll(/\bid="([^"]+)"/g))nodes.set(m[1],element());for(const m of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))nodes.get(m[1]).value=m[2].match(/<option value="([^"]*)"[^>]*selected/)?.[1]||'';};
 const open=()=>openGameActions({state,showDialog,apply:r=>result=r,esc:String,start:{type:'blackmail',card:'envoy'}});
 return {nodes,storage,open,get html(){return html;},get result(){return result;},click:id=>nodes.get(id).onclick(),choose:(id,value)=>{nodes.get(id).value=value;nodes.get('dialog-content').onchange();},drain(){for(let i=0;html.includes('id="continue-resolution-step"');i++){assert(i<20);nodes.get('continue-resolution-step').onclick();}}};
}

test('Envoy chooses placement, then a legal start and destination, without changing the map before confirmation',()=>{
 const s=initialState(),before=JSON.stringify(s),h=harness(s);h.open();assert(!h.html.includes('id="position"'));assert(!h.html.includes('id="envoy-from"'));assert.match(h.html,/id="envoy-inside"[^>]*disabled/);
 h.click('envoy-border');h.choose('envoy-from','punjab');const destinations=h.html.match(/<select id="envoy-to"[^>]*>([\s\S]*?)<\/select>/)[1];assert.match(destinations,/<option value="delhi"/);assert(!destinations.includes('<option value="bengal"'));h.choose('envoy-to','delhi');assert(!h.storage.has(ACTION_DRAFT));
 h.choose('envoy-from','bombay');assert.equal(h.nodes.get('envoy-to').value,'');assert.match(h.html,/id="review-action"[^>]*disabled/);
 h.choose('envoy-to','mysore');h.click('review-action');h.drain();assert.equal(JSON.stringify(s),before);assert.equal(h.result,null);h.click('confirm-action');assert.deepEqual(h.result.state.elephant,{from:'bombay',to:'mysore'});assert.match(h.result.report,/Take £4/);
});

test('inside placement offers only Company regions and changing placement clears earlier choices',()=>{
 const s=correctRegion(initialState(),'bengal',{control:'company',presidency:'bengal'}),h=harness(s);h.open();h.click('envoy-inside');assert.match(h.html,/<option value="bengal"/);assert(!h.html.includes('<option value="delhi"'));assert(!h.html.includes('id="envoy-to"'));
 h.choose('envoy-from','bengal');h.click('envoy-border');assert.equal(h.nodes.get('envoy-from').value,'');assert(!h.html.includes('<option value="bengal"'));assert(!h.html.includes('id="envoy-to"'));
 h.click('envoy-inside');h.choose('envoy-from','bengal');h.click('review-action');h.drain();h.click('confirm-action');assert.deepEqual(h.result.state.elephant,{from:'bengal',to:null});
});

test('closing an unconfirmed Envoy selection forgets it and creates no saved progress',()=>{
 const h=harness(initialState());h.open();h.click('envoy-border');h.choose('envoy-from','bombay');h.choose('envoy-to','delhi');assert(!h.storage.has(ACTION_DRAFT));h.nodes.get('dialog').close();h.open();assert(!h.html.includes('id="envoy-from"'));assert.equal(h.result,null);
});
