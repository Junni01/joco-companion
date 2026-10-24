import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {initialState,encode,decode} from '../dist/model.js';
import {ACTION_PROGRESS,loadActionProgress} from '../dist/action-progress.js';
import {inParliament} from './phase-fixtures.js';

test('app transfers unfinished play, browses full chronicle and operates saves without native confirmations',async()=>{
 const nodes=new Map(),dataByOwner=new Map(),storage=new Map(),downloads=[];let randomCalls=0;
 const camel=name=>name.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
 class Element{
  constructor(id){this.id=id;this.value='';this.dataset={};this.disabled=false;this.hidden=false;this.open=false;this.style={};this.classList={add(){},remove(){},toggle(){}};}
  set innerHTML(html){this.html=html;register(html,this.id);}get innerHTML(){return this.html||'';}
  querySelectorAll(){return [];}setAttribute(){}showModal(){this.open=true;}close(){this.open=false;}
  click(){if(!this.disabled)this.onclick?.({});}
 }
 function register(html,owner){
  const data=[];dataByOwner.set(owner,data);
  for(const m of html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)){
   const attrs=m[2],id=attrs.match(/\bid="([^"]+)"/)?.[1];if(!id&&!/data-[\w-]+=/.test(attrs))continue;
   const node=new Element(id);if(id)nodes.set(id,node);node.disabled=/\bdisabled\b/.test(attrs);node.hidden=/\bhidden\b/.test(attrs);node.checked=/\bchecked\b/.test(attrs);node.value=attrs.match(/\bvalue="([^"]*)"/)?.[1]||'';
   for(const a of attrs.matchAll(/data-([\w-]+)="([^"]*)"/g))node.dataset[camel(a[1])]=a[2];if(Object.keys(node.dataset).length)data.push(node);
  }
  for(const m of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const selected=m[2].match(/<option value="([^"]*)"[^>]*selected/);nodes.get(m[1]).value=selected?.[1]||'';}
 }
 register(fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8'),'document');
 globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:selector=>{const attr=selector.match(/^\[data-([\w-]+)\]/)?.[1];return attr?[...dataByOwner.values()].flat().filter(n=>Object.hasOwn(n.dataset,camel(attr))&&(!selector.endsWith(':checked')||n.checked)):[];},createElement:()=>({click(){}})};
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 globalThis.confirm=()=>assert.fail('Native confirmations must not be needed');globalThis.setTimeout=()=>0;globalThis.clearTimeout=()=>{};globalThis.matchMedia=()=>({matches:true});
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){randomCalls++;a[0]=0;return a;}}});
 globalThis.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test';};globalThis.URL.revokeObjectURL=()=>{};
 const key='jc-india-campaign-v1',slotsKey='jc-india-slots-v1';
 let seed=initialState();seed.turn=2;seed=inParliament(seed);seed.campaignName='Original';
 seed.history=Array.from({length:65},(_,i)=>({kind:i%2?'deploy':'action',actionType:'event',army:'bombay',outcome:'success',turn:i<40?1:2,title:`Entry ${i}`,report:'Physical instructions',at:'2026-10-19T12:00:00Z'}));
 seed.history.at(-1).regionLosses=['bombay','madras'];
 const progress={fingerprint:JSON.stringify(seed),input:{type:'france',outcome:'failed',storm:'west',rolls:{bombay:4}},stage:'resolve',ui:{instructionCursor:0}};
 storage.set(key,encode(seed,[],progress));
 await import('../dist/app.js?save-ui-first');
 const current=()=>decode(storage.get(key)),click=id=>{assert(nodes.get(id),id);nodes.get(id).click();};
 const data=(attr,value)=>{const node=document.querySelectorAll(`[data-${attr}]`).find(n=>Object.values(n.dataset).includes(String(value)));assert(node,attr+' '+value);return node;};
 assert.equal(loadActionProgress(current().state).input.rolls.bombay,4);
 assert(!nodes.get('stats').innerHTML.includes('COMPANY OPIUM ICONS'));assert(!nodes.get('context-panel').innerHTML.includes('Opium in Company regions'));
 assert.match(nodes.get('stats').innerHTML,/<strong>2<\/strong><span>REGIONS LOST THIS TURN<\/span>/);assert.match(nodes.get('stats').innerHTML,/Next loss: −3 Standing/);
 const afterBootCalls=randomCalls;
 data('tab','register').click();assert.match(nodes.get('register-page').innerHTML,/Entries 1–25 of 65/);click('log-next');click('log-next');assert.match(nodes.get('register-page').innerHTML,/Entry 0/);
 const beforeFilter=storage.get(key);data('log-turn','1').click();data('log-kind','deploy').click();assert.match(nodes.get('register-page').innerHTML,/of 20/);assert.equal(storage.get(key),beforeFilter);
 click('export-chronicle');let html=await downloads.at(-1).text();assert(html.includes('Entry 0'));assert(html.includes('Entry 64'));
 click('save-menu');click('snapshot');assert.equal(JSON.parse(storage.get(slotsKey))[0].payload.includes('"bombay": 4'),true);
 nodes.get('campaign-name').value='Changed';click('rename');assert.equal(current().state.campaignName,'Changed');assert.equal(current().progress.input.rolls.bombay,4);
 click('undo');assert.equal(current().state.campaignName,'Original');assert.equal(current().progress.input.rolls.bombay,4);
 click('save-menu');click('export');const exported=await downloads.at(-1).text();assert.equal(decode(exported).progress.input.rolls.bombay,4);
 nodes.get('campaign-name').value='Changed';click('rename');click('save-menu');data('load','0').click();click('cancel-choice');assert.equal(current().state.campaignName,'Changed');
 data('load','0').click();click('confirm-choice');assert.equal(current().state.campaignName,'Original');assert.equal(current().progress.input.rolls.bombay,4);
 click('save-menu');data('remove','0').click();click('cancel-choice');assert.equal(JSON.parse(storage.get(slotsKey)).length,1);data('remove','0').click();click('confirm-choice');assert.equal(JSON.parse(storage.get(slotsKey)).length,0);
 click('new-campaign');data('scenario','1813').click();click('new-game-back');assert.equal(current().state.campaignName,'Original');click('new-campaign');data('scenario','1813').click();click('start-scenario');assert.equal(current().state.scenario,'1813');assert.equal(current().state.turn,5);assert.equal(current().state.laws.governorGeneral,true);assert.equal(current().progress,null);
 click('game-actions');assert(data('action','parliament').disabled);assert(data('action','next-turn').disabled);assert(!nodes.get('end-game-action').disabled);
 assert.match(nodes.get('stats').innerHTML,/COMPANY OPIUM ICONS/);assert.match(nodes.get('stats').innerHTML,/£12 on successful China trade/);assert.match(nodes.get('context-panel').innerHTML,/Superintendent bonus/);
 click('close-dialog');click('undo');assert.equal(current().state.campaignName,'Original');assert.equal(current().progress.input.rolls.bombay,4);
 storage.delete(ACTION_PROGRESS);await import('../dist/app.js?save-ui-recovery');assert.equal(loadActionProgress(current().state).input.rolls.bombay,4);
 const beforeResumeCalls=randomCalls;click('game-actions');assert.match(nodes.get('dialog-content').innerHTML,/Review/);click('confirm-action');assert.equal(current().progress,null);assert.equal(current().state.regions.bombay.strength,2);assert.equal(randomCalls,beforeResumeCalls);
 click('undo');assert.equal(current().progress.input.rolls.bombay,4);
 click('save-menu');await nodes.get('file').onchange({target:{files:[{size:exported.length,text:async()=>exported}]}});click('confirm-choice');assert.equal(current().progress.input.rolls.bombay,4);
 const beforeInvalid=storage.get(key),bad=JSON.parse(exported);bad.progress.input.rolls.bombay=9;const raw=JSON.stringify(bad);
 click('save-menu');await nodes.get('file').onchange({target:{files:[{size:raw.length,text:async()=>raw}]}});assert.match(nodes.get('form-error').textContent,/invalid invasion dice/);assert.equal(storage.get(key),beforeInvalid);
 assert(afterBootCalls>0);assert.equal(randomCalls,beforeResumeCalls);
 const beforeDebug=storage.get(key),debugSave=JSON.parse(beforeDebug);debugSave.state.debugMode=true;if(debugSave.progress)debugSave.progress.fingerprint=JSON.stringify(debugSave.state);
 click('save-menu');await nodes.get('file').onchange({target:{files:[{size:2000,text:async()=>JSON.stringify(debugSave)}]}});click('confirm-choice');
 assert.match(nodes.get('form-error').textContent,/Debug mode/);assert.equal(storage.get(key),beforeDebug);
 globalThis.location={href:''};click('save-menu');click('new-campaign');click('mode-debug');click('start-scenario');assert.match(globalThis.location.href,/debug.html\?scenario=1710&reset=1/);assert.equal(storage.get(key),beforeDebug);
});
