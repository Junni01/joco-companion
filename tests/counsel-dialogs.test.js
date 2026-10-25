import test from 'node:test';
import assert from 'node:assert/strict';
import {encode} from '../dist/model.js';
import {openDeployment} from '../dist/deploy.js';
import {openGameActions} from '../dist/action-dialogs.js';
import {counselState,profile} from './counsel-fixtures.js';
function ui(){
 const nodes=new Map(),storage=new Map();let title='';
 const node=()=>({value:'',disabled:false,hidden:false,innerHTML:'',textContent:'',checked:false,dataset:{},close(){this.closed=true;}});
 nodes.set('dialog',node());nodes.set('dialog-content',node());
 globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:()=>[]};
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const showDialog=(heading,body,actions='')=>{
  title=heading;const html=body+actions;for(const key of [...nodes.keys()])if(!['dialog','dialog-content'].includes(key))nodes.delete(key);
  nodes.get('dialog-content').innerHTML=html;nodes.get('dialog-content').onchange=null;
  for(const m of (html+'<p id="form-error"></p>').matchAll(/\bid="([^"]+)"/g))nodes.set(m[1],node());
  for(const m of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))nodes.get(m[1]).value=m[2].match(/<option value="([^"]*)"[^>]*selected/)?.[1]||m[2].match(/<option value="([^"]*)"/)?.[1]||'';
  for(const m of html.matchAll(/<input id="([^"]+)"[^>]*value="([^"]*)"/g))nodes.get(m[1]).value=m[2];
  for(const m of html.matchAll(/<button id="([^"]+)"([^>]*)>/g))nodes.get(m[1]).disabled=/\bdisabled\b/.test(m[2]);
 };
 return {nodes,storage,showDialog,title:()=>title,html:()=>nodes.get('dialog-content').innerHTML,click:id=>{assert(nodes.has(id),id);nodes.get(id).onclick();},set:(id,v)=>{nodes.get(id).value=v;nodes.get('dialog-content').onchange?.();}};
}

test('Army dialog target/Back changes counsel; repeated force adjustments and cancelled plans leave saves exact',()=>{
 const s=counselState(),h=ui();profile(s,'army-bombay','careful');const before=encode(s);
 const open=()=>openDeployment({state:s,army:'bombay',showDialog:h.showDialog,apply:()=>assert.fail(),esc:String});
 open();h.set('target','delhi');const first=h.nodes.get('deploy-counsel').innerHTML;assert.match(first,/09C-army-expansion-careful/);assert(!h.nodes.has('army'));
 h.click('next-deploy');assert.equal(h.nodes.get('deploy-counsel').innerHTML,first);for(let n=1;n<9;n++){h.set('regiments',String(n));h.set('officers',String(n));assert.equal(h.nodes.get('deploy-counsel').innerHTML,first);}
 h.click('back-deploy');h.set('target','maratha');assert.equal(h.nodes.get('deploy-counsel').innerHTML,'');h.set('target','delhi');assert.equal(h.nodes.get('deploy-counsel').innerHTML,first);h.click('cancel-deploy');
 open();h.set('target','delhi');assert.equal(h.nodes.get('deploy-counsel').innerHTML,first);h.click('cancel-deploy');assert.equal(encode(s),before);assert.equal(h.storage.size,0);
});

test('Envoy never carries an Indian quotation into a revised China plan or a failed-check accusation',()=>{
 const s=counselState(),h=ui();profile(s,'secretary-general','careful');profile(s,'secretary-bengal','confident');const before=encode(s);
 openGameActions({state:s,start:'envoy',showDialog:h.showDialog,apply:()=>assert.fail(),esc:String});
 h.set('purpose','order');h.set('order','d3');assert.match(h.nodes.get('envoy-counsel').innerHTML,/09C-envoy-india-diplomat/);assert.match(h.nodes.get('envoy-counsel').innerHTML,/before-report/);
 h.set('outcome','success');h.click('review-action');assert(!h.nodes.has('envoy-counsel'));h.click('revise-envoy');h.set('purpose','china');const html=h.nodes.get('envoy-counsel').innerHTML;assert.match(html,/09C-china-office-plan/);assert.match(html,/after-report/);assert.match(html,/not an earlier warning/);assert(!html.includes('09C-envoy-india'));
 h.set('outcome','failure');assert.equal(h.nodes.get('envoy-counsel').innerHTML,'');assert.equal(encode(s),before);assert.equal(h.storage.size,0);
});

test('Governor has an optional planning view, retains post-check choice and shows no advice on failed reporting',()=>{
 const s=counselState(),h=ui();profile(s,'secretary-bombay','fiscal');const before=encode(s);
 openGameActions({state:s,start:{type:'governor',regionContext:'bombay'},showDialog:h.showDialog,apply:()=>assert.fail(),esc:String});
 assert(!h.html().includes('09C-governor-plan-tax'));h.click('governor-plan');assert.match(h.html(),/09C-governor-plan-tax/);assert.match(h.html(),/then choose any permitted successful effect/);assert.match(h.html(),/not evidence of an earlier warning/);
 h.click('governor-return');h.click('governor-administer');assert(!h.html().includes('planning-counsel'));h.click('review-action');assert(!h.html().includes('09D-governor'));assert.equal(encode(s),before);assert.equal(h.storage.size,0);
});

test('narrative off or General replacement cannot create adviser speech in planning controls',()=>{
 const s=counselState(),h=ui();delete s.narrative;
 openDeployment({state:s,army:'bombay',showDialog:h.showDialog,apply:()=>assert.fail(),esc:String});assert(!h.nodes.has('deploy-counsel'));
 const general=counselState();general.laws.governorGeneral=true;
 openGameActions({state:general,start:{type:'governor',regionContext:'bombay'},showDialog:h.showDialog,apply:()=>assert.fail(),esc:String});assert(h.nodes.get('governor-plan').disabled);h.click('governor-plan');assert(!h.html().includes('planning-counsel'));
});
