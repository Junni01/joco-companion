import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('debug UI isolates regular saves and progress, edits setup, restores checkpoints and clears test reports',async()=>{
 // Reproduce a hosting layer that exposes the root URL for the debug entry.
 globalThis.location={pathname:'/',search:''};
 globalThis.document={documentElement:{dataset:{workspaceMode:'debug'}}};
 const {initialState,encode,decode}=await import('../dist/model.js');
 const {workspaceKeys}=await import('../dist/workspace-mode.js');
 const {ACTION_PROGRESS,loadActionProgress}=await import('../dist/action-progress.js');
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
 // debug-entry.js loads this exact shared layout, then inserts only the debug panel.
 register(fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8').replace('<section id="map-page" class="page">','<section id="map-page" class="page"><section id="debug-controls"></section>'),'document');
 globalThis.document={documentElement:{dataset:{workspaceMode:'debug'}},getElementById:id=>nodes.get(id),querySelectorAll:selector=>{const attr=selector.match(/^\[data-([\w-]+)\]/)?.[1];return attr?[...dataByOwner.values()].flat().filter(n=>Object.hasOwn(n.dataset,camel(attr))&&(!selector.endsWith(':checked')||n.checked)):[];},createElement:()=>({click(){}})};
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 globalThis.confirm=()=>assert.fail('Native confirmations must not be needed');globalThis.setTimeout=()=>0;globalThis.clearTimeout=()=>{};globalThis.matchMedia=()=>({matches:true});
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){randomCalls++;a[0]=0;return a;}}});
 globalThis.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test';};globalThis.URL.revokeObjectURL=()=>{};

 const keys=workspaceKeys('/debug.html'),regular=workspaceKeys('/index.html');
 const regularSeed=initialState();regularSeed.campaignName='Regular untouched';
 const regularRaw=encode(regularSeed),regularProgress='regular progress sentinel';
 storage.set(regular.campaign,regularRaw);storage.set(regular.progress,regularProgress);
 await import('../dist/app.js?debug-ui');
 const current=()=>decode(storage.get(keys.campaign)),click=id=>{assert(nodes.get(id),id);nodes.get(id).click();};
 assert.equal(ACTION_PROGRESS,keys.progress);assert(current().state.debugMode);assert.match(nodes.get('debug-controls').innerHTML,/India test bench/);
 click('debug-reset');nodes.get('debug-preset').value='company';click('debug-confirm');
 for(const id of ['bombay','madras','bengal'])assert.equal(current().state.regions[id].unrest,2);
 click('debug-checkpoint');const saved=storage.get(keys.checkpoint);
 click('debug-flags');for(const n of document.querySelectorAll('[data-debug-law]'))if(n.dataset.debugLaw==='governorGeneral')n.checked=true;click('debug-confirm');assert(current().state.laws.governorGeneral);
 click('debug-restore');assert(!current().state.laws.governorGeneral);assert.equal(current().state.regions.bombay.unrest,2);assert.equal(storage.get(keys.checkpoint),saved);
 click('debug-event');nodes.get('debug-tile').value='madras-windfall';nodes.get('debug-top').value='mysore';click('debug-confirm');assert.equal(current().state.eventStack.pending.tileId,'madras-windfall');assert(storage.has(keys.progress));
 assert(nodes.get('debug-edit').disabled);click('debug-replay');assert.equal(current().state.eventStack.pending,null);assert.equal(loadActionProgress(current().state),null);
 click('debug-phase-button');nodes.get('debug-phase').value='parliament';click('debug-confirm');assert.equal(current().state.indiaPhase.status,'complete');
 click('debug-deploy');assert.equal(current().state.indiaPhase,null);click('cancel-deploy');
 click('debug-clear');click('debug-confirm');assert.equal(current().state.history.length,1);assert.match(current().state.history[0].title,/clear current-turn/);
 click('debug-reset');nodes.get('debug-scenario').value='1813';click('debug-confirm');assert.equal(current().state.scenario,'1813');assert.equal(current().state.turn,5);assert.equal(current().state.history.length,1);
 click('save-menu');click('snapshot');assert.equal(JSON.parse(storage.get(keys.slots)).length,1);assert(!storage.has(regular.slots));
 assert.equal(storage.get(regular.campaign),regularRaw);assert.equal(storage.get(regular.progress),regularProgress);
});
