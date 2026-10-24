import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,encode,decode} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {openGameActions,ACTION_DRAFT} from '../dist/action-dialogs.js';
import {loadActionProgress} from '../dist/action-progress.js';
import {inParliament,afterParliament} from './phase-fixtures.js';
function harness(initial=inParliament(initialState())){
 const nodes=new Map(),storage=new Map();let state=initial,title='';
 const element=()=>({value:'',innerHTML:'',disabled:false,open:true,classList:{remove(){}},close(){this.open=false;}});
 nodes.set('dialog-content',element());nodes.set('dialog',element());
 globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:()=>[]};
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 globalThis.matchMedia=()=>({matches:true});
 const showDialog=(t,body,actions='')=>{title=t;const html=body+actions;nodes.get('dialog-content').innerHTML=html;
  for(const m of (html+'<p id="form-error"></p>').matchAll(/\bid="([^"]+)"/g))nodes.set(m[1],element());
  for(const m of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))nodes.get(m[1]).value=m[2].match(/<option value="([^"]*)"[^>]*selected/)?.[1]||'';
 };
 return {nodes,storage,get state(){return state;},get title(){return title;},get html(){return nodes.get('dialog-content').innerHTML;},open:()=>openGameActions({state,showDialog,apply:r=>{state=r.state;},esc:String,start:'parliament-menu'}),click:id=>nodes.get(id).onclick()};
}
test('Parliament presents only India laws and two dilemmas and records a law in the same view',()=>{
 const h=harness();h.open();assert.match(h.html,/aria-label="Laws"/);assert.match(h.html,/aria-label="Dilemmas"/);
 for(const label of ['Calico Acts','Military Oversight','Public Demands Impeachment','Masses Demand Franchise','Old Ideas Made New','Record passed law'])assert(!h.html.includes(label),label);
 assert(!h.html.includes('parliament-law-royalProtection'));assert(h.html.includes('france-action'));assert(h.html.includes('famine-action'));
 h.click('parliament-law-envoyChina');assert.equal(h.title,'Parliament');assert.match(h.html,/aria-label="Laws"/);assert.match(h.html,/aria-label="Dilemmas"/);assert(!h.html.includes('id="parliament-failed"'));assert.equal(h.state.chinaOffice,false);
 const pass=h.nodes.get('parliament-passed').onclick;pass();pass();
 assert(h.state.laws.envoyChina&&h.state.chinaOffice);assert.equal(h.state.history.at(-1).input.outcome,'passed');
 assert.equal(h.state.history.length,1);assert(!h.html.includes('parliament-law-envoyChina'));assert.match(h.html,/Create the China office/);assert.equal(h.title,'Parliament');assert(!h.storage.has(ACTION_DRAFT));
 h.click('parliament-law-sepoyRecruitment');h.click('parliament-passed');assert.equal(h.state.history.length,2);assert(h.state.laws.sepoyRecruitment);
});
test('applicable dilemmas have both outcomes and famine applies effects in the same Parliament view',()=>{
 const h=harness(),board=structuredClone(h.state.regions);
 h.open();h.click('france-action');assert(h.html.includes('id="parliament-failed"'));h.click('parliament-passed');assert.equal(h.state.history.length,0);h.click('confirm-parliament-outcome');assert.deepEqual(h.state.regions,board);assert.match(h.html,/3 non-extra ships/);
 h.click('famine-action');h.click('parliament-passed');assert.equal(h.state.history.length,1);h.click('confirm-parliament-outcome');assert.deepEqual(h.state.regions,board);
 h.click('famine-action');h.click('parliament-failed');assert.deepEqual(h.state.regions,board);assert.equal(h.state.history.length,2);h.click('confirm-parliament-outcome');assert.equal(h.title,'Parliament');assert.equal(h.state.history.at(-1).input.outcome,'failed');assert.notDeepEqual(h.state.regions,board);assert.match(h.html,/Close Bombay/);
 assert.equal(h.state.history.length,3);
 assert.deepEqual(decode(encode(h.state)).state.history,h.state.history);
});
test('France only rolls after Confirm, saves the storm once and resumes without reroll or manual selectors',()=>{
 let calls=0;Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){calls++;a[0]=4;return a;}}});
 const h=harness();h.open();h.click('france-action');h.click('confirm-parliament-outcome');assert.equal(calls,0);
 h.click('parliament-failed');assert.equal(h.title,'Parliament');assert.equal(calls,0);assert.equal(h.state.history.length,0);assert(!h.storage.has(ACTION_DRAFT));
 const confirm=h.nodes.get('confirm-parliament-outcome').onclick;confirm();confirm();assert.equal(calls,1);assert.equal(h.title,'Rolling the storm die');assert.equal(loadActionProgress(h.state).input.stormFace,4);assert.equal(loadActionProgress(h.state).input.storm,'none');
 for(const field of ['storm','topRegion','shape','redirectShape'])assert(!h.html.includes(`id="${field}"`));
 h.open();assert.equal(calls,1);assert.match(h.title,/Review/);h.click('confirm-action');assert.equal(h.state.history.length,1);assert.equal(h.state.history[0].input.outcome,'failed');assert.match(h.state.history[0].report,/No storms/);assert.equal(h.title,'Parliament');assert(!h.storage.has(ACTION_DRAFT));
});
test('dilemma outcome selections are reversible and closing before Confirm discards them',()=>{
 const h=harness();h.open();h.click('famine-action');h.click('parliament-failed');h.click('parliament-passed');assert.equal(h.state.history.length,0);assert.match(h.html,/id="parliament-passed" aria-pressed="true"/);assert(!h.storage.has(ACTION_DRAFT));
 h.open();assert(!h.html.includes('confirm-parliament-outcome'));assert.equal(h.state.history.length,0);
 h.click('famine-action');h.click('parliament-failed');h.click('france-action');assert.match(h.html,/id="confirm-parliament-outcome"[^>]*disabled/);
});
test('End Parliament requires no card entry and shows upkeep instructions without another review',()=>{
 const h=harness();h.open();h.click('parliament-law-envoyChina');const finish=h.nodes.get('finish-parliament').onclick;finish();finish();
 assert.equal(h.title,'Parliament complete');assert.equal(h.state.history.length,1);assert.equal(h.state.history[0].actionType,'parliament-finish');assert.equal(h.state.parliamentFinishedTurn,h.state.turn);assert(!h.state.laws.envoyChina);assert.match(h.html,/Complete Upkeep and Refresh/);assert(!h.html.includes('review-action'));
});
test('legacy out-of-scope Parliament records stay readable without appearing in the menu',()=>{
 let s=inParliament(initialState());s=resolveAction(s,{type:'law',law:'militaryOversight',outcome:'passed'}).state;s=resolveAction(s,{type:'law',law:'calicoActs',outcome:'passed'}).state;s=resolveAction(s,{type:'dilemma',dilemma:'franchise',outcome:'failed'}).state;
 assert.deepEqual(decode(encode(s)).state.history,s.history);const h=harness(s);h.open();assert(!h.html.includes('Military Oversight'));assert(!h.html.includes('Calico Acts'));assert(!h.html.includes('franchise-action'));
});
test('new dilemma records obey Parliament phase boundaries and validate their selected office',()=>{
 const d={type:'dilemma',dilemma:'impeachment',office:'president:bombay',outcome:'passed'};
 assert.throws(()=>resolveAction(initialState(),d),/Finish Events/);
 assert.throws(()=>resolveAction(afterParliament(initialState()),d),/Parliament is finished/);
 assert.throws(()=>resolveAction(inParliament(initialState()),{...d,office:'not-an-office'}),/officeholder/);
 assert.throws(()=>resolveAction(inParliament(initialState()),{...d,outcome:'invalid'}),/Passed or Failed/);
});
