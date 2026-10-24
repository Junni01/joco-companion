import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {initialState,encode,decode} from '../dist/model.js';
import {loadActionProgress} from '../dist/action-progress.js';

test('narrative new-game activation, deployment, quiet display, dossier, reload and Redo work through app controls',async()=>{
 const nodes=new Map(),owners=new Map(),storage=new Map();let randomCalls=0;
 const camel=n=>n.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
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
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){randomCalls++;a[0]=0;return a;}}});
 const key='jc-india-campaign-v1',legacy=initialState();storage.set(key,encode(legacy));
 await import('../dist/app.js?narrative-controls-first');
 const current=()=>decode(storage.get(key)),click=id=>{assert(nodes.get(id),id);nodes.get(id).click();assert.equal(nodes.get('form-error')?.textContent||'','');};
 const data=(attr,value)=>{const n=document.querySelectorAll('[data-'+attr+']').find(n=>n.dataset[camel(attr)]===value);assert(n,attr+' '+value);n.click();};
 click('save-menu');click('new-campaign');click('narrative-on');click('close-dialog');assert.equal(current().state.narrative,undefined);
 click('save-menu');click('new-campaign');click('narrative-on');click('start-scenario');
 assert(current().state.narrative);assert.equal(Object.keys(current().state.narrative.seats).length,8);
 const initialCast=current().state.narrative;
 click('deploy-action');click('next-deploy');click('next-deploy');nodes.get('regiments').value='6';nodes.get('officers').value='2';click('next-deploy');nodes.get('outcome').value='success';click('next-deploy');nodes.get('losses').value='0';click('next-deploy');
 assert.deepEqual(current().state.narrative,initialCast);click('next-deploy');
 const conquest=current().state;assert.equal(conquest.regions.bombay.control,'company');assert(conquest.history.at(-1).narrative);
 click('undo');assert.equal(current().state.regions.bombay.control,'indian');assert.equal(current().redo.length,1);
 const beforeReload=randomCalls;await import('../dist/app.js?narrative-controls-reload');assert.equal(randomCalls,beforeReload);click('redo');assert.deepEqual(current().state,conquest);
 data('narrative-mode','quiet');assert.equal(current().state.narrative.intensity,'quiet');assert.match(nodes.get('narrative-panel').innerHTML,/Read saved scene/);
 click('undo');assert.equal(current().state.narrative.intensity,'standard');assert.equal(loadActionProgress(current().state),null);
 click('redo');assert.equal(current().state.narrative.intensity,'quiet');
 click('ruler-profile');assert.match(nodes.get('dialog-content').innerHTML,/Fictional pre-campaign background/);click('close-dialog');
 click('open-roster');nodes.get('character-search').value='no such ruler';nodes.get('character-search').oninput();assert.match(nodes.get('character-list').innerHTML,/No characters match/);
 data('tab','map');click('undo');click('undo');assert.equal(current().state.regions.bombay.control,'indian');
 // A new committed branch clears Redo, including after a reload.
 click('save-menu');nodes.get('campaign-name').value='A new branch';click('rename');assert.equal(current().redo.length,0);assert(nodes.get('redo').disabled);
 click('events-phase-action');click('manual-phase-storm');data('phase-face','4');click('confirm-phase-storm');click('phase-map');
 const phase=current().state;assert.equal(current().progress,null);
 data('narrative-mode','quiet');click('undo');assert.equal(current().progress,null);assert.deepEqual(current().state,phase);
 click('undo');assert.equal(current().progress.input.face,4);assert.equal(current().state.indiaPhase,null);
 click('redo');assert.deepEqual(current().state,phase);assert.equal(current().progress,null);
 assert.equal(storage.get('jc-india-debug-campaign-v1'),undefined);
});
