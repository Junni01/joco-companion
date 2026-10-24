import {inParliament} from './phase-fixtures.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion,resolveDeployment} from '../dist/model.js';
import {resolveAction,NeedsInput} from '../dist/actions.js';
import {EVENT_TILES,drawRequest,pendingEvent,exposedRegion} from '../dist/event-stack.js';
import {openGameActions} from '../dist/action-dialogs.js';
import {openDeployment} from '../dist/deploy.js';
import {showElephantSteps,stackRegionHTML} from '../dist/resolution-pages.js';
import {loadActionProgress} from '../dist/action-progress.js';
const owned=(s,id)=>correctRegion(s,id,{control:'company',presidency:id,lootAvailable:false});
const zero=a=>{a[0]=0;};
const stack=(first,discard=[])=>({version:1,draw:[...first,...EVENT_TILES.map(t=>t.id).filter(id=>!first.includes(id)&&!discard.includes(id))],discard:[...discard],pending:null});
const ready=st=>{const s=initialState();s.eventStack=st;return resolveAction(s,{type:'phase-start',face:4}).state;};
function harness(){
 const nodes=new Map(),storage=new Map(),pages=[];let title='',html='';
 const node=()=>({value:'',onclick:null,onchange:null,innerHTML:'',close(){this.closed=true;}});
 nodes.set('dialog',node());nodes.set('dialog-content',node());
 globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:()=>[]};
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const showDialog=(t,body,actions='')=>{
  title=t;html=body+actions;pages.push({title,html});nodes.get('dialog-content').onchange=null;
  for(const m of (html+'<p id="form-error"></p>').matchAll(/\bid="([^"]+)"/g))nodes.set(m[1],node());
  for(const m of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const selected=m[2].match(/<option value="([^"]*)"[^>]*selected/);nodes.get(m[1]).value=selected?.[1]||'';}
  for(const m of html.matchAll(/<input[^>]*id="([^"]+)"[^>]*value="([^"]*)"/g))nodes.get(m[1]).value=m[2];
 };
 const click=id=>{assert.equal(typeof nodes.get(id)?.onclick,'function',id);nodes.get(id).onclick();};
 return {nodes,storage,pages,showDialog,click,get title(){return title;},get html(){return html;}};
}
function drain(h){for(let i=0;h.html.includes('id="continue-resolution-step"');i++){assert(i<20);h.click('continue-resolution-step');}}

test('events, blackmail and successful conquest record explicit before/after Elephant moves',()=>{
 const s=initialState();
 const event=resolveAction(s,{type:'event',manualTest:true,event:'peace',topRegion:'mysore',shape:'square'});
 assert.equal(event.elephantMoves.length,1);assert.deepEqual(event.elephantMoves[0].before,s.elephant);assert.deepEqual(event.elephantMoves[0].after,event.state.elephant);
 const card=resolveAction(s,{type:'blackmail',card:'envoy',from:'bombay',to:'delhi'});assert.equal(card.elephantMoves.length,1);assert.deepEqual(card.elephantMoves[0].after,{from:'bombay',to:'delhi'});
 const base=owned(s,'bombay');base.elephant={from:'delhi',to:'bengal'};
 const deploy=resolveDeployment(base,{army:'bombay',target:'delhi',regiments:10,officers:0,alliances:[],outcome:'success',losses:0});
 assert.deepEqual(deploy.elephantMoves[0].after,{from:'delhi',to:null});assert.equal(deploy.instructions[deploy.elephantMoves[0].instructionIndex],deploy.elephantMoves[0].instruction);
 assert.deepEqual(deploy.state.history.at(-1).elephantMoves,deploy.elephantMoves);
});

test('each intermediate invasion redirect is retained before the next target asks for defence',()=>{
 let s=initialState();for(const id of ['bombay','madras','bengal'])s=owned(s,id);s.elephant={from:'bombay',to:null};s=inParliament(s);
 const input={type:'france',outcome:'failed',storm:'all',topRegion:'madras',shape:'circle',redirectShape:'circle',rolls:{bombay:3,madras:3,bengal:3},defenses:{'foreign:bombay':0},officerRouts:{bombay:0,madras:0,bengal:0}};
 assert.throws(()=>resolveAction(s,input),e=>e instanceof NeedsInput&&e.request.region==='madras'&&e.request.elephantMoves.length===1);
 const result=resolveAction(s,{...input,defenses:{'foreign:bombay':0,'foreign:madras':0,'foreign:bengal':0}});
 assert.equal(result.elephantMoves.length,2);assert.deepEqual(result.elephantMoves[0].after,result.elephantMoves[1].before);assert(result.elephantMoves[0].instructionIndex<result.elephantMoves[1].instructionIndex);
});

test('walkthrough keeps physical instructions and each movement in order and can resume after acknowledgement',()=>{
 const h=harness(),instructions=['First change','Move 1','Second change','Move 2','Last change'];let cursor=0,done;
 const moves=[{instructionIndex:1,before:{from:'bombay',to:'delhi'},after:{from:'bombay',to:null}},{instructionIndex:3,before:{from:'bombay',to:null},after:{from:'madras',to:null}}];
 showElephantSteps({instructions,elephantMoves:moves,showDialog:h.showDialog,esc:String,onProgress:c=>cursor=c,onDone:c=>{done=c;h.showDialog('Done','');}});
 h.click('continue-resolution-step');assert.equal(h.title,'Move the Elephant');assert.match(h.html,/wholly inside Bombay/);const oldButton=h.nodes.get('continue-resolution-step');h.click('continue-resolution-step');oldButton.onclick();assert.equal(cursor,2);
 showElephantSteps({instructions,elephantMoves:moves,after:cursor,showDialog:h.showDialog,esc:String,onDone:c=>{done=c;h.showDialog('Done','');}});drain(h);assert.equal(done,4);
 assert.equal(h.pages.filter(p=>p.title==='Move the Elephant').length,2);assert(!h.pages.some(p=>p.html.includes('blockquote')));
});

test('a stack event resumes after acknowledged movement, commits once, then shows the exposed region',()=>{
 const h=harness();let state=ready(stack(['mysore-peace','madras-windfall']));state=resolveAction(state,drawRequest(state.eventStack,zero)).state;
 const original=JSON.stringify(state);let applied=0;
 const open=()=>openGameActions({state,showDialog:h.showDialog,apply:r=>{state=r.state;applied++;},esc:String,start:pendingEvent(state.eventStack)});
 open();h.click('review-action');h.click('continue-resolution-step');assert.equal(h.title,'Move the Elephant');
 h.nodes.get('dialog').close();open();assert.equal(h.title,'Move the Elephant');h.click('continue-resolution-step');assert.match(h.title,/Review/);assert.equal(applied,0);assert.equal(JSON.stringify(state),original);
 assert(loadActionProgress(state).ui.instructionCursor>0);h.nodes.get('dialog').close();open();assert.match(h.title,/Review/);
 const confirm=h.nodes.get('confirm-action');confirm.onclick();confirm.onclick();assert.equal(applied,1);assert.equal(state.indiaPhase.completed,1);assert.equal(h.title,'Region on top of the event stack');
 assert.match(h.html,/Madras/);assert(!h.html.includes('Windfall'));assert(!h.html.includes('saved roll is already part'));assert(!loadActionProgress(state));h.click('stack-region-done');assert(h.nodes.get('dialog').closed);
});

test('Shuffle recap uses its resulting top region rather than the pre-shuffle March region',()=>{
 const h=harness();let state=ready(stack(['madras-shuffle','delhi-turmoil'],['mysore-peace']));state=resolveAction(state,drawRequest(state.eventStack,zero)).state;
 assert.equal(pendingEvent(state.eventStack).topRegion,'delhi');
 openGameActions({state,showDialog:h.showDialog,apply:r=>state=r.state,esc:String,start:pendingEvent(state.eventStack)});h.click('review-action');drain(h);h.click('confirm-action');
 assert.equal(exposedRegion(state.eventStack),'mysore');assert.match(h.html,/<h4 class="stack-region-name">Mysore/);assert(!h.html.includes('Peace'));
 const html=stackRegionHTML(state,String);assert.match(html,/Tower levels/);assert.match(html,/Closed orders/);assert(!html.includes('<blockquote'));
});

test('deployment shows inward movement separately before its final confirmation without changing state early',()=>{
 const h=harness();let state=owned(initialState(),'bombay');state.elephant={from:'delhi',to:'bengal'};const before=JSON.stringify(state);let applied=0;
 openDeployment({state,showDialog:h.showDialog,apply:r=>{state=r.state;applied++;},esc:String,targetRegion:'delhi'});
 h.nodes.get('army').value='bombay';h.click('next-deploy');h.nodes.get('regiments').value='10';h.nodes.get('officers').value='0';h.click('next-deploy');h.nodes.get('outcome').value='success';h.click('next-deploy');h.nodes.get('losses').value='0';h.click('next-deploy');
 h.click('continue-resolution-step');assert.equal(h.title,'Move the Elephant');assert.match(h.html,/wholly inside Delhi/);assert.equal(JSON.stringify(state),before);h.click('continue-resolution-step');
 assert(!h.html.includes('Move the Elephant wholly inside'));h.click('next-deploy');assert.equal(applied,1);assert.deepEqual(state.elephant,{from:'delhi',to:null});
});

test('movement pages are displayed before later foreign-invasion defence prompts',()=>{
 const h=harness();let state=initialState();for(const id of ['bombay','madras','bengal'])state=owned(state,id);state.elephant={from:'bombay',to:null};state=inParliament(state);let applied=0;
 openGameActions({state,showDialog:h.showDialog,apply:r=>{state=r.state;applied++;},esc:String,start:{type:'france',outcome:'failed',storm:'all',topRegion:'madras',shape:'circle',redirectShape:'circle',rolls:{bombay:3,madras:3,bengal:3},defenses:{'foreign:bombay':0},officerRouts:{bombay:0,madras:0,bengal:0}}});
 h.click('review-action');drain(h);assert.equal(h.title,'Defend Madras');assert.equal(h.pages.filter(p=>p.title==='Move the Elephant').length,1);
 h.nodes.get('defense').value='0';h.click('report-defense');drain(h);assert.equal(h.title,'Defend Bengal');assert.equal(h.pages.filter(p=>p.title==='Move the Elephant').length,2);
 h.nodes.get('defense').value='0';h.click('report-defense');assert.match(h.title,/Review/);assert.equal(applied,0);h.click('confirm-action');assert.equal(applied,1);
});

test('officer rout dialog reports a physical count and resumes without committing the map early',()=>{
 const h=harness();let state=owned(initialState(),'bombay');state.elephant={from:'bombay',to:null};const before=JSON.stringify(state);let applied=0;
 const start={type:'event',manualTest:true,event:'crisis',modifier:1,topRegion:'mysore',shape:'circle',defenses:{crisis:0}};
 const open=()=>openGameActions({state,showDialog:h.showDialog,apply:r=>{state=r.state;applied++;},esc:String,start});
 open();h.click('review-action');drain(h);assert.equal(h.title,'Officer rout · Bombay');assert.match(h.html,/one die per officer/);assert.equal(h.nodes.get('rout-removed').value,'0');
 h.nodes.get('rout-removed').value='2';h.click('report-rout');drain(h);
 assert.equal(applied,0);assert.equal(JSON.stringify(state),before);assert.equal(loadActionProgress(state).input.officerRouts.bombay,2);
 h.nodes.get('dialog').close();open();drain(h);assert.match(h.title,/Review/);h.click('confirm-action');
 assert.equal(applied,1);assert.deepEqual(state.history.at(-1).officerRouts,[{region:'bombay',presidency:'bombay',removed:2}]);assert(!h.html.includes('<blockquote>'));
});
