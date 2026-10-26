import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion,resolveDeployment,encode,decode,clone,validate} from '../dist/model.js';
import {createNarrative,commitNarrative} from '../dist/narrative.js';
import {resolveAction} from '../dist/actions.js';
import {openDeployment} from '../dist/deploy.js';
import {openGameActions} from '../dist/action-dialogs.js';
import {EVENT_TILES,drawRequest,pendingEvent} from '../dist/event-stack.js';
import {loadActionProgress} from '../dist/action-progress.js';
import {showActionStory,actionSceneLines,actionSceneHTML,anticipationLines,actionResultTitle} from '../dist/narrative-resolution.js';
import {readableChronicle} from '../dist/chronicle.js';
import {phaseRecapHTML} from '../dist/phase-dialog.js';
function harness(initial){
 const nodes=new Map(),storage=new Map(),pages=[];let state=initial,applied=0,title='',body='';
 const node=()=>({value:'',innerHTML:'',textContent:'',disabled:false,close(){this.closed=true;}});nodes.set('dialog',node());nodes.set('dialog-content',node());
 globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:()=>[]};globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const showDialog=(t,b,actions='')=>{title=t;body=b;pages.push({title,body,actions});nodes.get('dialog-content').onchange=null;for(const k of [...nodes.keys()])if(!['dialog','dialog-content'].includes(k))nodes.delete(k);for(const m of (b+actions+'<p id="form-error"></p>').matchAll(/\bid="([^"]+)"/g))nodes.set(m[1],node());for(const m of b.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))nodes.get(m[1]).value=m[2].match(/<option value="([^"]*)"[^>]*selected/)?.[1]||'';for(const m of b.matchAll(/<input[^>]*id="([^"]+)"[^>]*value="([^"]*)"/g))nodes.get(m[1]).value=m[2];};
 const apply=r=>{r.state=commitNarrative(state,r);state=r.state;applied++;};
 const click=id=>{assert.equal(typeof nodes.get(id)?.onclick,'function',id);nodes.get(id).onclick();assert(!nodes.get('form-error')?.textContent);};
 const drain=()=>{while(nodes.has('continue-resolution-step'))click('continue-resolution-step');};
 return {nodes,storage,pages,showDialog,apply,click,drain,get state(){return state;},get applied(){return applied;},get title(){return title;},get body(){return body;}};
}
function campaign(narrative=true){const s=correctRegion(initialState(),'bombay',{control:'company',presidency:'bombay',lootAvailable:false});if(narrative)s.narrative=createNarrative(s,717);return s;}
function deploy(h,outcome){openDeployment({state:h.state,showDialog:h.showDialog,apply:h.apply,esc:String,army:'bombay'});h.nodes.get('target').value='delhi';h.click('next-deploy');h.nodes.get('regiments').value='6';h.click('next-deploy');h.nodes.get('outcome').value=outcome;h.click('next-deploy');h.click('next-deploy');h.drain();}
for(const outcome of ['success','failure','catastrophe'])test(`actual Deploy ${outcome}: physical instructions first, exact committed scene second, navigation read-only, Normal has no story`,()=>{
 const h=harness(campaign());deploy(h,outcome);assert(!h.body.includes('action-story'));assert.equal(h.applied,0);const title=h.title;h.click('next-deploy');assert.equal(h.applied,1);assert.equal(h.title,title.replace('Deploy · ',''));assert.match(h.body,/action-story/);const saved=encode(h.state),lines=actionSceneLines({state:h.state});for(const l of lines)assert(h.body.includes(l.text.replaceAll('&','&amp;').replaceAll("'",'&#39;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')));assert(!h.body.includes('<summary>More voices'));
 for(let j=0;j<2;j++){h.click('story-instructions');h.drain();assert(!h.body.includes('action-story'));h.click('return-to-story');assert.equal(encode(h.state),saved);}h.click('story-done');assert(h.nodes.get('dialog').closed);assert.equal(h.applied,1);assert.equal(encode(decode(saved).state),saved);
 const normal=harness(campaign(false));deploy(normal,outcome);normal.click('next-deploy');assert(!normal.nodes.has('story-done'));assert(normal.nodes.get('dialog').closed);assert.deepEqual(normal.state.regions,h.state.regions);assert.deepEqual(normal.state.elephant,h.state.elephant);
});
for(const event of ['turmoil','windfall','peace','leader','shuffle'])test(`actual ${event} stack resolution: protected mechanical pages, parent scene, separate public anticipation, no hidden face`,()=>{
 let s=campaign();const first=EVENT_TILES.find(t=>t.event===event).id,next=EVENT_TILES.find(t=>t.id!==first&&t.region==='delhi').id;s.eventStack={version:1,draw:[first,next,...EVENT_TILES.map(t=>t.id).filter(id=>![first,next].includes(id))],discard:[],pending:null};s=commitNarrative(s,resolveAction(s,{type:'phase-start',face:4}));s=commitNarrative(s,resolveAction(s,drawRequest(s.eventStack,a=>{a[0]=0;return a;})));
 const h=harness(s);openGameActions({state:s,showDialog:h.showDialog,apply:h.apply,esc:String,start:pendingEvent(s.eventStack)});h.click('review-action');h.drain();assert.equal(h.applied,0);assert(loadActionProgress(s));h.click('confirm-action');assert.equal(h.applied,1);assert.match(h.body,/action-story/);assert(!h.body.includes('Closing this window keeps'));assert(!loadActionProgress(h.state));const before=encode(h.state);assert(h.state.history.at(-1).narrative.anticipation);assert(readableChronicle(h.state).includes('Private outlooks after this event'));assert.equal(encode(decode(before).state),before);const bad=clone(h.state);bad.history.at(-1).narrative.anticipation.thoughts[0].text='The next tile is Crisis.';assert.throws(()=>validate(bad),/anticipation/);h.click('story-done');assert.equal(h.title,'Region on top of the event stack');h.click('stack-region-done');assert.equal(h.title,'Across India');assert.match(h.body,/Private outlook/);assert.match(h.body,/Elephant:/);assert.match(h.body,/Visible stack region:/);h.click('anticipation-instructions');assert.equal(h.title,'Region on top of the event stack');h.click('stack-region-done');assert.equal(encode(h.state),before);h.click('anticipation-done');assert.equal(h.state.indiaPhase.completed,1);assert(phaseRecapHTML(h.state,String).includes(h.state.history.at(-1).title));assert(!phaseRecapHTML(h.state,String).includes('action-story'));
 const hidden=clone(h.state);hidden.eventStack.draw=[hidden.eventStack.draw[0],...hidden.eventStack.draw.slice(1).reverse()];assert.deepEqual(anticipationLines(hidden,h.state.eventStack.draw[0].split('-')[0]),anticipationLines(h.state,h.state.eventStack.draw[0].split('-')[0]));
});
test('quiet mode, old current-schema save and unavailable scenes add no empty narrative page',()=>{
 const s=campaign();s.narrative.intensity='quiet';let r=resolveDeployment(s,{army:'bombay',target:'delhi',regiments:6,officers:0,alliances:[],outcome:'success',losses:0});r.state=commitNarrative(s,r);assert.deepEqual(actionSceneLines(r),[]);const h=harness(s);let done=0;showActionStory({result:r,showDialog:h.showDialog,onDone:()=>done++});assert.equal(done,1);assert.equal(h.pages.length,0);
 const no=campaign(false);r=resolveDeployment(no,{army:'bombay',target:'delhi',regiments:6,officers:0,alliances:[],outcome:'success',losses:0});assert.equal(decode(encode(r.state)).state.narrative,undefined);assert.deepEqual(actionSceneLines(r),[]);
});
test('full scene has stable identity hooks, escaping and no per-line controls or fact-coverage requirements',()=>{
 const html=actionSceneHTML([{speakerId:'army-bombay',speaker:'A & B',role:'Army',text:'<untrusted>'},{speaker:'Chronicler',text:'Second voice'}]);assert.match(html,/data-character-id="army-bombay"/);assert.match(html,/A &amp; B/);assert.match(html,/&lt;untrusted&gt;/);assert(!html.includes('<button'));assert(!html.includes('<details'));
});


test('primary scene keeps authored chronicler and complete selected turns, while redundant fallback and superseded same-speaker response remain archived',()=>{
 const state=campaign(),lines=[{speakerId:'chronicler',templateId:'chronicler-deploy-v1',text:'Mechanical summary'},{speakerId:'army-bombay',templateId:'09D1-deploy-supported-victory-ambitious',adviceIds:['real-advice'],text:'Exact approved response'},{speakerId:'ruler-delhi',templateId:'approved-ruler',text:'Ruler response'},{speakerId:'army-bombay',templateId:'old-generic',text:'Earlier generic reaction'}];state.history=[{actionType:'deploy',narrative:{lines}}];const before=JSON.stringify(state);assert.deepEqual(actionSceneLines({state}),lines.slice(1,3));assert.equal(JSON.stringify(state),before);lines[0].templateId='CH-C01';assert.deepEqual(actionSceneLines({state}),lines.slice(0,3));
});
