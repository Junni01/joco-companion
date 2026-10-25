import {createNarrative,commitNarrative} from '../dist/narrative.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion,PRESIDENCIES,REGIONS,legalTargets,resolveDeployment} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {companyOperationsHTML} from '../dist/company-operations.js';
import {openDeployment} from '../dist/deploy.js';
import {openGameActions,ACTION_DRAFT} from '../dist/action-dialogs.js';

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
const owned=(s,id,p=id)=>correctRegion(s,id,{control:'company',presidency:p,lootAvailable:false});

test('permanent Operations panels order offices, derive availability and reflect Governor General replacement',()=>{
 let s=initialState(),before=JSON.stringify(s),html=companyOperationsHTML(s);
 assert(html.indexOf('Director of Trade')<html.indexOf('Bombay Army'));assert(html.indexOf('Bombay Army')<html.indexOf('Madras Army'));assert(html.indexOf('Madras Army')<html.indexOf('Bengal Army'));
 for(const army of PRESIDENCIES)assert.match(html,new RegExp(`id="operations-deploy-${army}"  aria-describedby`));
 assert.equal(JSON.stringify(s),before);
 s.laws.governorGeneral=true;html=companyOperationsHTML(s);assert.match(html,/<h3>Governor General<\/h3>/);assert.match(html,/id="operations-envoy" disabled/);assert.match(html,/regional Governor offices are removed/);
 s=resolveAction(initialState(),{type:'phase-start',face:4}).state;html=companyOperationsHTML(s);for(const army of PRESIDENCIES)assert.match(html,new RegExp(`id="operations-deploy-${army}" disabled`));
});

for(const army of PRESIDENCIES)test(`${army} origin remains fixed across multiple target choices, back, validation and cancellation`,()=>{
 const s=owned(initialState(),army),h=ui(),before=JSON.stringify(s),targets=legalTargets(s,army);assert(targets.length>1);
 openDeployment({state:s,army,showDialog:h.showDialog,apply:()=>assert.fail('preview committed'),esc:String});
 assert.match(h.html(),new RegExp(`${REGIONS[army].name} Army`));assert(!h.nodes.has('army'));assert(!h.nodes.has('back-deploy'));
 const other=PRESIDENCIES.find(id=>id!==army);assert(!h.html().includes(`<option value="${other}"`));assert.match(h.html(),/home region/);
 h.set('target',other);h.click('next-deploy');assert.match(h.nodes.get('form-error').textContent,/legal target/);
 for(const target of targets){h.set('target',target);assert.match(h.nodes.get('strength-summary').innerHTML,new RegExp(REGIONS[target].name));h.click('next-deploy');assert(!h.nodes.has('army'));h.click('back-deploy');assert.equal(h.nodes.get('target').value,target);}
 h.click('cancel-deploy');assert.equal(JSON.stringify(s),before);assert.equal(h.storage.size,0);
});

for(const army of PRESIDENCIES)for(const outcome of ['success','failure','catastrophe'])test(`${army} ${outcome} uses the unchanged deployment resolver`,()=>{
 const s=initialState(),h=ui(),before=JSON.stringify(s);let result;
 openDeployment({state:s,army,showDialog:h.showDialog,apply:r=>result=r,esc:String});
 h.click('next-deploy');h.set('regiments','6');h.set('officers','1');h.click('next-deploy');h.set('outcome',outcome);h.click('next-deploy');h.set('losses','0');h.click('next-deploy');assert.equal(JSON.stringify(s),before);h.click('next-deploy');
 const expected=resolveDeployment(s,{army,target:army,regiments:6,officers:1,alliances:[],outcome,losses:0});
 assert.deepEqual(result.state.regions,expected.state.regions);assert.deepEqual(result.instructions,expected.instructions);assert.equal(result.state.history.at(-1).army,army);assert.equal(h.storage.size,0);
});

test('Special Envoy shows intended action before outcome, rejects missing/Company/open targets and leaves previews ephemeral',()=>{
 const s=owned(initialState(),'bombay'),h=ui(),before=JSON.stringify(s);
 openGameActions({state:s,start:'envoy',showDialog:h.showDialog,apply:()=>assert.fail(),esc:String});
 assert(h.html().indexOf('id="purpose"')<h.html().indexOf('id="outcome"'));assert(h.nodes.get('outcome').disabled);
 for(const [id]of REGIONS.bombay.orders)assert(!h.html().includes(`<option value="${id}"`));assert(!h.html().includes('<option value="d5n"'));
 h.set('purpose','order');h.set('order','bo3n');h.set('outcome','success');h.click('review-action');assert.match(h.nodes.get('form-error').textContent,/specific closed Order/);
 h.set('order','d3');h.set('outcome','success');h.click('review-action');assert.match(h.title(),/Review/);assert.equal(JSON.stringify(s),before);assert(!h.storage.has(ACTION_DRAFT));
});

test('successful Envoy may change from China to a different Indian order, and failure opens neither effect',()=>{
 let s=initialState(),result;const h=ui(),open=()=>openGameActions({state:s,start:'envoy',showDialog:h.showDialog,apply:r=>{result=r;s=r.state;},esc:String});
 open();h.set('purpose','china');h.set('outcome','success');h.click('review-action');assert(!s.chinaOffice);h.click('revise-envoy');assert.equal(h.nodes.get('outcome').value,'success');h.set('purpose','order');h.set('order','d3');h.click('review-action');h.click('confirm-action');assert(!s.chinaOffice);assert(s.regions.delhi.orders.d3);
 for(const purpose of ['china','order']){const before=JSON.stringify(s.regions);open();h.set('purpose',purpose);if(purpose==='order')h.set('order','md4');h.set('outcome','failure');h.click('review-action');h.click('confirm-action');assert.equal(JSON.stringify(s.regions),before);assert(!s.chinaOffice);assert.equal(result.state.history.at(-1).input.outcome,'failure');}
});

test('successful Envoy can revise an Indian plan to create China office once; GG disables it',()=>{
 let s=initialState();const h=ui(),open=()=>openGameActions({state:s,start:'envoy',showDialog:h.showDialog,apply:r=>s=r.state,esc:String});
 open();h.set('purpose','order');h.set('order','d3');h.set('outcome','success');h.click('review-action');h.click('revise-envoy');h.set('purpose','china');h.click('review-action');h.click('confirm-action');assert(s.chinaOffice);assert(!Object.hasOwn(s.history.at(-1).input,'order'));assert(!s.regions.delhi.orders.d3);assert(!s.history.some(h=>h.actionType==='china-trade'));
 open();assert(!h.html().includes('<option value="china"'));h.set('purpose','china');h.set('outcome','success');h.click('review-action');assert.match(h.nodes.get('form-error').textContent,/available intended/);
 s.laws.governorGeneral=true;open();assert.match(h.title(),/unavailable/);assert(!h.nodes.has('purpose'));assert(!h.nodes.has('confirm-action'));
});

test('Operations previews preserve private outlooks and RNG; actual UI commits keep narrative-on/off mechanics equivalent',()=>{
 let off=initialState(),on=initialState();on.narrative=createNarrative(on,71823);
 const before=JSON.stringify(on),h=ui();
 for(const army of PRESIDENCIES){openDeployment({state:on,army,showDialog:h.showDialog,apply:()=>assert.fail(),esc:String});h.click('cancel-deploy');}
 openGameActions({state:on,start:'envoy',showDialog:h.showDialog,apply:()=>assert.fail(),esc:String});h.set('purpose','china');h.set('outcome','success');h.click('review-action');assert.equal(JSON.stringify(on),before);assert.equal(h.storage.size,0);
 const mechanics=s=>{const n=structuredClone(s);delete n.narrative;for(const log of n.history){delete log.narrative;delete log.at;}return n;};
 const run=(state,narrative)=>{
  const h=ui(),apply=r=>state=narrative?commitNarrative(state,r):r.state;
  openDeployment({state,army:'bombay',showDialog:h.showDialog,apply,esc:String});h.click('next-deploy');h.set('regiments','6');h.click('next-deploy');h.set('outcome','success');h.click('next-deploy');h.set('losses','0');h.click('next-deploy');h.click('next-deploy');
  for(const [purpose,outcome]of [['order','success'],['china','failure'],['china','success']]){openGameActions({state,start:'envoy',showDialog:h.showDialog,apply,esc:String});h.set('purpose',purpose);if(purpose==='order')h.set('order','d3');h.set('outcome',outcome);h.click('review-action');h.click('confirm-action');}
  return state;
 };
 const original=Object.getOwnPropertyDescriptor(globalThis,'crypto');let randomCalls=0;
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){randomCalls++;return a;}}});
 try{off=run(off,false);on=run(on,true);assert.equal(randomCalls,0);assert.deepEqual(mechanics(on),mechanics(off));}finally{if(original)Object.defineProperty(globalThis,'crypto',original);else delete globalThis.crypto;}
});
