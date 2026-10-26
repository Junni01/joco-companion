import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {encode,decode,clone} from '../dist/model.js';
import {storySequence} from './m2-fixtures.js';

test('old stored bytes stay untouched; current M2 memories and protected progress survive real app save controls',async()=>{
 const nodes=new Map(),owners=new Map(),storage=new Map(),downloads=[];const camel=s=>s.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
 class Element{
  constructor(id){Object.assign(this,{id,value:'',dataset:{},disabled:false,hidden:false,open:false,style:{},classList:{add(){},remove(){},toggle(){}}});}
  set innerHTML(html){this.html=html;register(html,this.id);}get innerHTML(){return this.html||'';}
  querySelectorAll(){return [];}setAttribute(){}showModal(){this.open=true;}close(){this.open=false;}click(){if(!this.disabled)this.onclick?.({});}
 }
 function register(html,owner){const data=[];owners.set(owner,data);
  for(const m of html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)){const attrs=m[2],id=attrs.match(/\bid="([^"]+)"/)?.[1];if(!id&&!/data-[\w-]+=/.test(attrs))continue;const n=new Element(id);if(id)nodes.set(id,n);n.disabled=/\bdisabled\b/.test(attrs);n.value=attrs.match(/\bvalue="([^"]*)"/)?.[1]||'';for(const a of attrs.matchAll(/data-([\w-]+)="([^"]*)"/g))n.dataset[camel(a[1])]=a[2];if(Object.keys(n.dataset).length)data.push(n);}
  for(const m of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))nodes.get(m[1]).value=m[2].match(/<option value="([^"]*)"[^>]*selected/)?.[1]||'';
 }
 register(fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8'),'document');
 globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:sel=>{const attr=sel.match(/^\[data-([\w-]+)\]/)?.[1];return attr?[...owners.values()].flat().filter(n=>Object.hasOwn(n.dataset,camel(attr))&&(!sel.endsWith(':checked')||n.checked)):[];},createElement:()=>({click(){}})};
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 globalThis.setTimeout=()=>0;globalThis.clearTimeout=()=>{};globalThis.matchMedia=()=>({matches:true});globalThis.location={search:''};
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){a[0]=0;return a;}}});
 globalThis.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test';};globalThis.URL.revokeObjectURL=()=>{};
 const key='jc-india-campaign-v1',progressKey='jc-india-action-draft-v1',currentStory=storySequence().state;
 const oldObject=JSON.parse(encode(currentStory));oldObject.version=1;const oldBytes=JSON.stringify(oldObject),oldProgress='{"old":"protected progress left untouched"}';storage.set(key,oldBytes);storage.set(progressKey,oldProgress);
 await import('../dist/app.js?m2-unsupported-startup');
 assert.equal(storage.get(key),oldBytes);assert.equal(storage.get(progressKey),oldProgress);assert.match(nodes.get('storage-alert').textContent,/Unsupported development save version/);
 const click=id=>{assert(nodes.get(id),id);nodes.get(id).click();};const current=()=>decode(storage.get(key));
 const data=(attr,value)=>{const n=document.querySelectorAll('[data-'+attr+']').find(n=>n.dataset[camel(attr)]===value);assert(n);n.click();};
 click('game-actions');assert.equal(storage.get(progressKey),oldProgress);click('save-menu');assert(nodes.get('rename').disabled&&nodes.get('snapshot').disabled);click('export');assert.equal(await downloads.at(-1).text(),oldBytes);
 click('new-campaign');click('narrative-on');click('close-dialog');assert.equal(storage.get(key),oldBytes);assert.equal(storage.get(progressKey),oldProgress);
 click('save-menu');const raw=encode(currentStory);await nodes.get('file').onchange({target:{files:[{size:raw.length,text:async()=>raw}]}});click('confirm-choice');assert.deepEqual(current().state,currentStory);
 click('events-phase-action');const oldCrypto=Object.getOwnPropertyDescriptor(globalThis,'crypto');Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){a[0]=4;return a;}}});click('start-india-phase');Object.defineProperty(globalThis,'crypto',oldCrypto);click('calm-continue');click('events-revealed');click('phase-map');click('phase-next');
 const pending=current();assert(pending.progress&&pending.state.eventStack.pending);assert.deepEqual(pending.state.narrative.memories,currentStory.narrative.memories);
 const protectedInput=clone(pending.progress.input),cursor=pending.progress.ui.instructionCursor;
 click('close-dialog');click('save-menu');click('snapshot');
 await import('../dist/app.js?m2-protected-reload');assert.deepEqual(current(),pending);
 click('save-menu');assert(!nodes.get('rename').disabled,nodes.get('storage-alert').textContent);nodes.get('campaign-name').value='M2 renamed with pending tile';click('rename');assert.equal(nodes.get('form-error').textContent||'','');assert.equal(current().state.campaignName,'M2 renamed with pending tile');assert.deepEqual(current().progress.input,protectedInput);assert.equal(current().progress.ui.instructionCursor,cursor);
 click('undo');assert.deepEqual(current(),{...pending,redo:current().redo});click('redo');assert.equal(current().state.campaignName,'M2 renamed with pending tile');
 click('save-menu');data('load','0');click('confirm-choice');assert.deepEqual(current(),pending);
 click('game-actions');click('review-action');click('confirm-action');const finished=current();assert.equal(finished.progress,null);assert.equal(finished.state.indiaPhase.completed,1);assert.deepEqual(finished.state.narrative.memories,currentStory.narrative.memories);
 click('undo');assert.deepEqual(current().progress.input,protectedInput);click('redo');assert.deepEqual(current().state,finished.state);
 const safe=storage.get(key);click('save-menu');await nodes.get('file').onchange({target:{files:[{size:oldBytes.length,text:async()=>oldBytes}]}});assert.match(nodes.get('form-error').textContent,/Unsupported development save version/);assert.equal(storage.get(key),safe);
 const bad=JSON.parse(encode(finished.state));Object.values(bad.state.narrative.memories)[0].evidence[0].incidentId='missing';const badText=JSON.stringify(bad);click('save-menu');await nodes.get('file').onchange({target:{files:[{size:badText.length,text:async()=>badText}]}});assert.match(nodes.get('form-error').textContent,/Invalid narrative/);assert.equal(storage.get(key),safe);
 storage.set(key,oldBytes);storage.set(progressKey,oldProgress);globalThis.location={search:'?scenario=1710&reset=1&narrative=1'};globalThis.history={replaceState(){}};
 await import('../dist/app.js?m2-explicit-url-reset');assert.equal(current().state.history.length,0);assert.equal(current().state.narrative.version,2);click('save-menu');assert(!nodes.get('rename').disabled&&!nodes.get('snapshot').disabled);
});
