import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,encode,decode,clone,validate} from '../dist/model.js';
import {createNarrative,commitNarrative} from '../dist/narrative.js';
import {resolveAction} from '../dist/actions.js';
import {openIndiaPhase} from '../dist/phase-dialog.js';
import {takeStageViews} from '../dist/narrative-stage-views.js';
import {ensurePhaseScene,phaseScene,selectStaged} from '../dist/narrative-staged.js';
import {validateActionProgress} from '../dist/action-progress.js';
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


const state=()=>{const s=initialState();s.narrative=createNarrative(s,717);return s;};
for(const face of [0,1,2,3,4,5])test(`automatic weather ${face}: one scene above physical instructions, same mandatory report, inert reopen and stable restore`,()=>{
 const h=ui();let s=commitNarrative(state(),resolveAction(state(),{type:'phase-start',face})),commits=0;
 const open=()=>openIndiaPhase({state:s,showDialog:h.showDialog,esc:String,onPresentation:next=>s=next,apply:r=>{commits++;r.state=commitNarrative(s,r);s=r.state;},drawEvent:()=>{},blackmail:()=>{}});
 open();const words=clone(phaseScene(s,'weather'));assert(h.html().indexOf('staged-dialogue')<h.html().indexOf(face<4?'Physical ship instructions':'The seas are calm'));
 assert(!h.html().includes('Read scene'));assert(h.nodes.has(face<4?'ships-resolved':'calm-continue'));assert(!s.narrative.weather.weatherPresented);assert(s.narrative.weather.scenePresented);assert.equal(commits,0);
 open();assert(!h.html().includes('staged-dialogue'));assert.deepEqual(phaseScene(s,'weather'),words);
 const restored=decode(encode(s)).state;assert.deepEqual(restored,s);h.storage.clear();s=restored;open();assert(!h.html().includes('staged-dialogue'));
 h.click(face<4?'ships-resolved':'calm-continue');assert(h.html().includes('staged-dialogue'));assert(h.nodes.has('events-revealed'));assert.equal(commits,face<4?1:0);
 open();assert(!h.html().includes('staged-dialogue'));assert.deepEqual(s.history.find(h=>h.actionType==='phase-start').narrative.stagedScenes[0],words);
});
test('local presentation journal survives Undo-style missing markers; distinct action, campaign and workspace remain independent',()=>{
 const h=ui(),s=state(),scene=selectStaged(s,'weather',{face:0},'weather'),before=encode(s);
 assert.deepEqual(takeStageViews(s,'i1',[scene]),[scene]);assert.deepEqual(takeStageViews(s,'i1',[scene]),[]);assert.equal(encode(s),before);
 assert.deepEqual(takeStageViews(s,'i2',[scene]),[scene]);const other=state();other.narrative.characters['ruler-bombay'].name+=' II';assert.deepEqual(takeStageViews(other,'i1',[scene]),[scene]);
 globalThis.document.documentElement={dataset:{workspaceMode:'debug'}};assert.deepEqual(takeStageViews(s,'i1',[scene]),[scene]);globalThis.document.documentElement.dataset.workspaceMode='regular';assert.deepEqual(takeStageViews(s,'i1',[scene]),[]);
 h.storage.clear();assert.deepEqual(takeStageViews(s,'i1',[scene],['weather']),[]);
});
test('no-scene/quiet weather writes no viewing journal, generates no dialogue and adds no control',()=>{
 const h=ui();assert.deepEqual(takeStageViews(state(),'noop',[]),[]);assert.equal(h.storage.size,0);let s=state();s.narrative.intensity='quiet';s=commitNarrative(s,resolveAction(s,{type:'phase-start',face:0}));
 openIndiaPhase({state:s,showDialog:h.showDialog,esc:String,onPresentation:()=>assert.fail(),apply:()=>assert.fail()});assert(!h.html().includes('staged-dialogue'));assert(h.nodes.has('ships-resolved'));assert.equal(h.storage.size,0);
});
test('optional viewing metadata validates independently from selected wording and cannot claim unknown scenes',()=>{
 let s=state();s=commitNarrative(s,resolveAction(s,{type:'phase-start',face:0}));s=ensurePhaseScene(s,'weather');s.narrative.weather.scenePresented=true;validate(s);s.narrative.weather.scenePresented='yes';assert.throws(()=>validate(s),/weather/);
 const before=state(),input={type:'france',outcome:'failed',stormFace:4,storm:'none'},scene=selectStaged(before,'announcement',{type:'france',targets:[],companyTargets:[],governorGeneral:false,courts:{}},'announcement');
 const p={fingerprint:JSON.stringify(before),input,stage:'resolve',ui:{stagedScenes:[scene],stagedPresented:['announcement']}};assert.equal(validateActionProgress(before,p),p);p.ui.stagedPresented=['force:bombay'];assert.throws(()=>validateActionProgress(before,p),/viewing position/);
});
