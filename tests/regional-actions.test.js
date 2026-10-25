import {afterParliament} from './phase-fixtures.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion,deploymentBlockReason,legalTargets,encode,decode} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {governorTaxCount,taxBlockReason,envoyBlockReason} from '../dist/administration.js';
import {openDeployment} from '../dist/deploy.js';
import {openGameActions,ACTION_DRAFT} from '../dist/action-dialogs.js';
const owned=(s,id,p=id)=>correctRegion(s,id,{control:'company',presidency:p,lootAvailable:false});
const tax=(s,id)=>resolveAction(s,{type:'tax',region:id}).state;

test('regional deployment reasons match legal targets, including first foothold and ineffective interventions',()=>{
 let s=initialState();assert.equal(deploymentBlockReason(s,'bombay','bombay'),'');assert.match(deploymentBlockReason(s,'madras','bombay'),/home region/);assert.match(deploymentBlockReason(s,'bombay','delhi'),/No Company region/);
 s=owned(s,'bombay');assert.equal(deploymentBlockReason(s,'bombay','delhi'),'');
 for(const id of Object.keys(s.regions))for(const army of ['bombay','madras','bengal'])assert.equal(!deploymentBlockReason(s,army,id),legalTargets(s,army).includes(id));
 for(const o of Object.keys(s.regions.bombay.orders))s.regions.bombay.orders[o]=true;
 assert.match(deploymentBlockReason(s,'bombay','bombay'),/No effect/);s.regions.bombay.unrest=1;assert.equal(deploymentBlockReason(s,'bombay','bombay'),'');
 const failed=resolveAction(s,{type:'phase-start',face:4}).state;assert.match(deploymentBlockReason(failed,'bombay','bombay'),/Operation has ended/);
});

test('Governor taxes are counted independently per region and turn, persist, and are not doubled by laws',()=>{
 let s=owned(owned(initialState(),'bombay'),'madras');s.laws.zamindarTaxes=true;
 s=tax(s,'bombay');assert.equal(s.regions.bombay.unrest,0);assert.equal(governorTaxCount(s,'bombay'),1);
 s=tax(s,'madras');assert.equal(s.regions.madras.unrest,0);
 const beforeSecond=s;s=tax(s,'bombay');assert.equal(s.regions.bombay.unrest,1);assert.equal(governorTaxCount(s,'bombay'),2);
 const loaded=decode(encode(s,[beforeSecond]));assert.equal(governorTaxCount(loaded.state,'bombay'),2);assert.equal(governorTaxCount(loaded.undo[0],'bombay'),1);
 s=tax(s,'bombay');assert.equal(s.regions.bombay.unrest,2);
 s=resolveAction(afterParliament(s),{type:'next-turn'}).state;assert.equal(governorTaxCount(s,'bombay'),0);assert.equal(tax(s,'bombay').regions.bombay.unrest,2);
 const legacy=resolveAction(owned(initialState(),'bombay'),{type:'unrest',region:'bombay',reason:'tax'}).state;
 assert.equal(governorTaxCount(legacy,'bombay'),2);assert.equal(tax(legacy,'bombay').regions.bombay.unrest,2);
});

test('Governor General taxes always add one, share regional limits with legacy reports and do not use Governor counts',()=>{
 let s=owned(owned(initialState(),'bombay'),'madras');s=tax(s,'bombay');s.laws.governorGeneral=true;s.laws.zamindarTaxes=true;
 s=tax(s,'bombay');assert.equal(s.regions.bombay.unrest,1);assert.match(taxBlockReason(s,'bombay'),/already been placed/);assert.throws(()=>tax(s,'bombay'),/already been placed/);
 assert.throws(()=>resolveAction(s,{type:'unrest',region:'bombay',reason:'tax'}),/already been placed/);
 s=tax(s,'madras');assert.equal(s.regions.madras.unrest,1);
 assert.throws(()=>resolveAction(s,{type:'unrest',region:'bombay',reason:'failure'}),/Governor General/);
 const later=resolveAction(s,{type:'phase-start',face:4}).state;assert.throws(()=>tax(later,'bombay'),/Operations has ended/);
});

test('regional Special Envoy is restricted to eligible closed orders in the chosen region',()=>{
 const s=initialState();assert.equal(envoyBlockReason(s,'delhi'),'');assert.equal(envoyBlockReason(s,'hyderabad'),'');s.regions.hyderabad.orders.h7=true;assert.match(envoyBlockReason(s,'hyderabad'),/no closed orders/);
 assert.match(envoyBlockReason(owned(s,'bombay'),'bombay'),/Company regions/);
 assert.throws(()=>resolveAction(s,{type:'envoy',region:'delhi',purpose:'order',order:'md4',outcome:'success'}),/selected region/);
 const r=resolveAction(s,{type:'envoy',region:'delhi',purpose:'order',order:'d3',outcome:'success'});assert.equal(r.state.regions.delhi.orders.d3,true);assert.equal(r.state.regions.madras.orders.md4,false);
 s.laws.governorGeneral=true;assert.match(envoyBlockReason(s,'delhi'),/replaced/);assert.throws(()=>resolveAction(s,{type:'envoy',purpose:'order',order:'d3',outcome:'success'}),/replaced/);
});

function ui(){
 const nodes=new Map(),storage=new Map();
 const element=()=>({value:'',disabled:false,innerHTML:'',onclick:null,onchange:null,close(){}});
 nodes.set('dialog',element());nodes.set('dialog-content',element());
 globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:()=>[]};
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const showDialog=(title,body,actions='')=>{
  const html=body+actions;nodes.get('dialog-content').innerHTML=html;nodes.get('dialog-content').onchange=null;
  for(const m of (html+'<p id="form-error"></p>').matchAll(/\bid="([^"]+)"/g))nodes.set(m[1],element());
  for(const m of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const option=m[2].match(/<option value="([^"]*)"[^>]*selected/);nodes.get(m[1]).value=option?.[1]||'';}
  for(const m of html.matchAll(/<button id="([^"]+)"([^>]*)>/g))nodes.get(m[1]).disabled=/\bdisabled\b/.test(m[2]);
 };
 return {nodes,storage,showDialog,click:id=>nodes.get(id).onclick()};
}

test('targeted Deploy disables ineligible armies, locks the region and prevents ineffective Company deployment',()=>{
 const h=ui(),s=owned(initialState(),'bombay');
 openDeployment({state:s,showDialog:h.showDialog,apply:()=>assert.fail(),esc:String,targetRegion:'delhi'});
 assert.match(h.nodes.get('dialog-content').innerHTML,/<option value="madras"[^>]*disabled/);
 assert.match(h.nodes.get('dialog-content').innerHTML,/No Company region assigned to Madras/);
 h.nodes.get('army').value='madras';h.click('next-deploy');assert.match(h.nodes.get('form-error').textContent,/No Company region/);
 h.nodes.get('army').value='bombay';h.click('next-deploy');assert(h.nodes.has('regiments'));
 assert(!h.storage.has('jc-deploy-draft-v2'));assert.match(h.nodes.get('strength-summary').innerHTML,/Delhi/);assert(!h.nodes.get('dialog-content').innerHTML.includes('<select id="target"'));
 h.click('back-deploy');assert.match(h.nodes.get('dialog-content').innerHTML,/Target: <b>Delhi/);
 h.storage.clear();for(const o of Object.keys(s.regions.bombay.orders))s.regions.bombay.orders[o]=true;
 openDeployment({state:s,showDialog:h.showDialog,apply:()=>assert.fail(),esc:String,targetRegion:'bombay'});
 assert(h.nodes.get('next-deploy').disabled);assert.match(h.nodes.get('dialog-content').innerHTML,/No effect/);
});

test('regional dialogs lock their region and Tax reason can be changed back to failed Administer',()=>{
 const h=ui();let s=owned(initialState(),'bombay');let result;
 const open=start=>openGameActions({state:s,showDialog:h.showDialog,apply:r=>{result=r;s=r.state;},esc:String,start});
 open({type:'tax',regionContext:'bombay'});assert(!h.nodes.get('dialog-content').innerHTML.includes('<select id="region"'));
 assert.match(h.nodes.get('tax-effect').innerHTML,/0 unrest/);h.click('review-action');h.click('confirm-action');assert.equal(s.regions.bombay.unrest,0);
 open({type:'tax',regionContext:'bombay'});assert.match(h.nodes.get('tax-effect').innerHTML,/1 unrest/);h.click('review-action');h.click('confirm-action');assert.equal(s.regions.bombay.unrest,1);
 open({type:'unrest',regionContext:'bombay'});h.nodes.get('reason').value='tax';h.nodes.get('dialog-content').onchange();h.nodes.get('reason').value='failure';h.nodes.get('dialog-content').onchange();h.click('review-action');h.click('confirm-action');assert.equal(result.state.history.at(-1).actionType,'unrest');assert.equal(s.regions.bombay.unrest,2);
 open({type:'envoy'});assert(h.nodes.get('dialog-content').innerHTML.includes('value="md4"'));h.nodes.get('purpose').value='order';h.nodes.get('outcome').value='success';h.nodes.get('order').value='d3';h.click('review-action');h.click('confirm-action');assert.equal(s.regions.delhi.orders.d3,true);
 assert(!h.storage.has(ACTION_DRAFT));
});

test('Governor actions routes Tax and unsuccessful Administer without changing state until confirmation',()=>{
 const h=ui();let s=owned(initialState(),'bombay');
 const open=()=>openGameActions({state:s,showDialog:h.showDialog,apply:r=>{s=r.state;},esc:String,start:{type:'governor',regionContext:'bombay'}});
 const before=JSON.stringify(s);open();assert.match(h.nodes.get('dialog-content').innerHTML,/Unsuccessful Administer/);assert.equal(JSON.stringify(s),before);assert(!h.storage.has(ACTION_DRAFT));
 h.click('governor-tax');assert(!h.nodes.get('dialog-content').innerHTML.includes('<select id="region"'));h.click('review-action');assert.equal(JSON.stringify(s),before);h.click('confirm-action');assert.equal(s.regions.bombay.unrest,0);
 open();h.click('governor-tax');h.click('review-action');h.click('confirm-action');assert.equal(s.regions.bombay.unrest,1);
 s.laws.zamindarTaxes=true;open();h.click('governor-administer');assert(!h.nodes.get('dialog-content').innerHTML.includes('<select id="reason"'));h.click('review-action');h.click('confirm-action');assert.equal(s.regions.bombay.unrest,3);assert.equal(s.history.at(-1).input.reason,'failure');
 s.laws.governorGeneral=true;open();assert(h.nodes.get('governor-tax').disabled);assert(h.nodes.get('governor-administer').disabled);
});

test('opening a different regional deployment starts fresh without a saved draft or discard prompt',()=>{
 const h=ui(),s=owned(initialState(),'bombay'),args={state:s,showDialog:h.showDialog,apply:()=>assert.fail(),esc:String};
 const key='jc-deploy-draft-v2';h.storage.set(key,JSON.stringify({fingerprint:JSON.stringify(s),step:2,d:{army:'bombay',target:'bombay',regiments:20}}));
 openDeployment({...args,targetRegion:'delhi'});assert(!h.storage.has(key));assert.match(h.nodes.get('dialog-content').innerHTML,/Target: <b>Delhi/);assert(!h.nodes.get('dialog-content').innerHTML.includes('Resume existing'));
 h.click('cancel-deploy');openDeployment({...args,targetRegion:'maratha'});assert.match(h.nodes.get('dialog-content').innerHTML,/Target: <b>Maratha/);assert(!h.storage.has(key));
});
