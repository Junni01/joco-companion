import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion,resolveDeployment,validate,encode,decode,clone} from '../dist/model.js';
import {resolveAction,NeedsInput} from '../dist/actions.js';
import {createNarrative,commitNarrative} from '../dist/narrative.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {createEventStack,drawRequest,pendingEvent} from '../dist/event-stack.js';
import {inParliament} from './phase-fixtures.js';
import {sceneHTML,narrativeExportHTML,profileHTML,rosterCardsHTML} from '../dist/narrative-ui.js';
import {readableChronicle} from '../dist/chronicle.js';
import {debugResult,debugEditRegion,debugState,debugPhase} from '../dist/debug-state.js';
const enabled=(s=initialState())=>{s.narrative=createNarrative(s,1234);return s;};
const apply=(s,d)=>validate(commitNarrative(s,resolveAction(s,d)));
const event=(name,patch={})=>({type:'event',event:name,manualTest:true,topRegion:'delhi',shape:'circle',redirectShape:'circle',modifier:0,...patch});
const deploy=(patch={})=>({army:'bombay',target:'bombay',regiments:6,officers:2,alliances:[],outcome:'success',losses:1,...patch});
function mechanics(s){const n=clone(s);delete n.narrative;if(n.gameEnd)delete n.gameEnd.at;for(const h of n.history){delete h.at;delete h.narrative;if(h.incident)delete h.incident.id;}return n;}

test('new cast matches all four scenarios, remains fictional and leaves legacy saves untouched',()=>{
 for(const scenario of ['1710','1758','1813','1710-long']){
  const legacy=initialState(scenario),s=enabled(clone(legacy));validate(s);
  assert.deepEqual(decode(encode(legacy)).state,legacy);assert.equal(legacy.narrative,undefined);
  assert.equal(Object.keys(s.narrative.seats).length,8);
  assert.equal(Object.values(s.narrative.characters).filter(c=>c.role==='heir').length,8);
  for(const [region,id] of Object.entries(s.narrative.seats)){assert.equal(s.narrative.characters[id].region,region);assert.equal(s.narrative.characters[id].family.length,1);}
  assert(s.narrative.allegiances.every(a=>a.origin==='unknown'));
  assert.deepEqual(decode(encode(s)).state,s);
 }
});

test('previews never change cast, random state, history or chapters',()=>{
 const s=enabled(),original=clone(s);
 for(let i=0;i<4;i++)resolveDeployment(s,deploy());
 const ready=enabled(inParliament(initialState()));ready.parliamentFinishedTurn=ready.turn;
 const snapshot=clone(ready);resolveAction(ready,{type:'next-turn'});resolveAction(ready,{type:'next-turn'});
 assert.deepEqual(s,original);assert.deepEqual(ready,snapshot);
});

test('conquest commits one stable scene, retains ruler and records real one-time loot',()=>{
 const s=enabled(),r=resolveDeployment(s,deploy()),next=validate(commitNarrative(s,r));
 assert.equal(s.regions.bombay.control,'indian');assert.equal(next.regions.bombay.control,'company');
 assert.equal(next.narrative.seats.bombay,s.narrative.seats.bombay);
 const h=next.history.at(-1);assert(h.incident.facts.some(f=>f.type==='company-conquest'&&f.lootConsumed));
 assert.equal(h.narrative.lines.length,3);assert.equal(h.narrative.id,h.incident.id);
 assert.deepEqual(commitNarrative(s,{state:next}),next);
 const loaded=decode(encode(next)).state;assert.equal(sceneHTML(loaded.history.at(-1).narrative),sceneHTML(h.narrative));
 assert.equal(loaded.narrative.characters['ruler-bombay'].condition,'alive');
});

test('board and structured gameplay facts are identical with narrative enabled or disabled',()=>{
 const off=initialState(),on=enabled(clone(off));
 const a=resolveDeployment(off,deploy()),b=commitNarrative(on,resolveDeployment(on,deploy()));
 assert.deepEqual(mechanics(a.state),mechanics(b));
 for(const action of [{type:'tax',region:'bombay'},{type:'tax',region:'bombay'},event('turmoil'),event('leader',{topRegion:'maratha',modifier:-3})]){
  const plain=resolveAction(a.state,action),fiction=commitNarrative(b,resolveAction(b,action));assert.deepEqual(mechanics(plain.state),mechanics(fiction));
 }
});

test('Undo and Redo restore exact words, RNG, identities and protected progress through save/load',()=>{
 const before=enabled(),after=commitNarrative(before,resolveDeployment(before,deploy()));
 const frame=undoFrame(after,null,[before],[null],[]);assert.deepEqual(frame.state,before);
 const saved=decode(encode(frame.state,frame.undo,frame.progress,frame.undoProgress,frame.redo));
 const redone=redoFrame(saved.state,saved.progress,saved.undo,saved.undoProgress,saved.redo);assert.deepEqual(redone.state,after);
 const pending=enabled();pending.eventStack=createEventStack();
 const roll={fingerprint:JSON.stringify(pending),input:{type:'event',event:'foreign',manualTest:true,stormFace:0,storm:'east',rolls:{bengal:5}},stage:'resolve',ui:{instructionCursor:2}};
 // Face zero is East in the existing printed die catalogue.
 const pframe={state:pending,progress:roll};
 const restored=decode(encode(after,[before],null,[null],[pframe]));assert.deepEqual(restored.redo[0].progress,roll);
});

test('capital collapse uses true released subjects and preserves unknown initial allegiance origins',()=>{
 let s=correctRegion(initialState(),'bombay',{control:'company',presidency:'bombay',lootAvailable:false});s=enabled(s);
 const next=commitNarrative(s,resolveDeployment(s,deploy({target:'delhi',regiments:12}))),h=next.history.at(-1);
 assert.deepEqual(h.incident.facts.filter(f=>f.type==='release').map(f=>f.region),['punjab','maratha']);
 assert(next.narrative.allegiances.every(a=>a.origin==='unknown'&&a.end));
 const text=h.narrative.lines.map(l=>l.text).join(' ');assert(text.includes('Punjab became sovereign'));assert(text.includes('Maratha became sovereign'));
 assert(!text.includes('rule imposed on Punjab'));
});

test('allegiance episodes are ended and recreated when the same subject joins again',()=>{
 let s=initialState();s.regions.bombay.strength=5;s.elephant={from:'bombay',to:'delhi'};s=enabled(s);
 s=apply(s,event('crisis'));assert.equal(s.regions.delhi.overlord,'bombay');
 const episode=s.narrative.allegiances.find(a=>a.subject==='delhi'&&!a.end);assert.equal(episode.origin,'battle');
 s=apply(s,event('leader',{topRegion:'delhi',modifier:10}));assert.equal(s.regions.delhi.overlord,null);
 assert(s.narrative.allegiances.find(a=>a.id===episode.id).end);
 s.elephant={from:'bombay',to:'delhi'};s=apply(s,event('crisis',{modifier:10}));
 assert.equal(s.narrative.allegiances.filter(a=>a.subject==='delhi').length,2);
});

test('failed rebellion cannot replace its incumbent or invent independence or death',()=>{
 const s=enabled(),id=s.narrative.seats.punjab,next=apply(s,event('leader',{topRegion:'punjab',modifier:-3}));
 assert.equal(next.narrative.seats.punjab,id);assert.equal(next.regions.punjab.overlord,'delhi');
 assert.equal(next.narrative.characters[id].condition,'alive');
 assert.match(next.history.at(-1).narrative.lines[0].text,/rebellion in Punjab failed/);
 assert(!next.history.at(-1).narrative.lines.some(l=>l.templateId==='ruler-rebellion-win-1'));
});

test('multi-target foreign invasion records ordered attacks and routs without killing named characters',()=>{
 const s=enabled(initialState('1813')),d=event('foreign',{storm:'all',topRegion:'punjab',rolls:{bombay:5,madras:3,bengal:1},defenses:{'foreign:bombay':0,'foreign:madras':0,'foreign:bengal':0},officerRouts:{bombay:2,madras:0,bengal:1}});
 const next=apply(s,d),h=next.history.at(-1);
 assert.deepEqual(h.incident.facts.filter(f=>f.type==='company-loss').map(f=>[f.region,f.removed]),[['bombay',2],['madras',0],['bengal',1]]);
 assert.equal(next.narrative.nextIncident,2);assert(h.narrative.lines.length>3);
 assert(Object.values(next.narrative.characters).every(c=>c.condition==='alive'));
 assert.match(h.narrative.lines[0].text,/removal does not establish death/);
});

test('New Turn ages all living characters exactly once; ending adds no unplayed years',()=>{
 let s=enabled(inParliament(initialState()));s.parliamentFinishedTurn=s.turn;
 const original=clone(s),preview=resolveAction(s,{type:'next-turn'});assert.deepEqual(s,original);
 const next=validate(commitNarrative(s,preview));
 for(const [id,c] of Object.entries(next.narrative.characters))assert.equal(c.age,s.narrative.characters[id].age+3);
 assert.equal(next.narrative.chapters.length,1);assert.deepEqual(commitNarrative(s,{state:next}),next);
 const ended=apply(next,{type:'end-game',reason:'failure'});assert.equal(ended.turn,next.turn);
 for(const [id,c] of Object.entries(ended.narrative.characters))assert.equal(c.age,next.narrative.characters[id].age);
 assert.equal(ended.narrative.chapters.at(-1).ending,true);
});

test('quiet mode keeps every saved line and exports safe printable cast and chronology',()=>{
 const s=enabled(),next=commitNarrative(s,resolveDeployment(s,deploy())),scene=next.history.at(-1).narrative;
 const before=clone(scene),quiet=sceneHTML(scene,{intensity:'quiet'});assert.match(quiet,/Read saved scene/);assert.deepEqual(scene,before);
 assert.match(rosterCardsHTML(next,{query:'bombay'}),/ruler-bombay/);
 next.narrative.characters['ruler-bombay'].name='<script>bad()</script>';
 assert(!profileHTML(next,'ruler-bombay').includes('<script>'));
 assert(!narrativeExportHTML(next).includes('<script>'));
 const html=readableChronicle(next);assert(html.includes('Character appendix'));assert(html.includes(scene.lines[0].text));assert(html.includes('<svg'));
});

test('narrative validation rejects broken references, duplicate scenes, random state and malformed redo',()=>{
 const s=enabled(),next=commitNarrative(s,resolveDeployment(s,deploy()));
 for(const change of [n=>n.narrative.rng=-1,n=>n.narrative.seats.bombay='unknown',n=>n.narrative.characters['ruler-bombay'].family=[{id:'unknown',tie:'parent'}],n=>n.history.at(-1).narrative.lines[0].speakerId='unknown']){
  const bad=clone(next);change(bad);assert.throws(()=>validate(bad),/Invalid narrative/);
 }
 const raw=JSON.parse(encode(next));raw.redo=[{state:s,progress:{input:{type:'phase-start',face:0}}}];assert.throws(()=>decode(JSON.stringify(raw)),/Invalid saved resolution/);
});

test('debug setup changes remain unknown provenance, never fabricated conquests or grievances',()=>{
 let s=enabled(debugState());const before=clone(s);
 const next=validate(commitNarrative(s,debugResult(s,debugEditRegion(s,'bombay',{control:'company',presidency:'bombay'}),'change control')));
 assert.equal(next.narrative.characters['ruler-bombay'].position,'retained local ruler');
 assert.equal(next.history.at(-1).narrative,undefined);assert.deepEqual(next.narrative.characters['ruler-bombay'].relations,{});
 assert.deepEqual(s,before);
});

test('long campaign saves prune reversible frames before current narrative or protected progress',()=>{
 let s=enabled(initialState('1710-long'));s=commitNarrative(s,resolveDeployment(s,deploy()));
 // A realistic retained history has thousands of entries, each with grounded incident data.
 const template=clone(s.history[0]);
 s.history=Array.from({length:300},(_,i)=>{const h=clone(template);h.incident.id='incident-'+(i+1);h.narrative.id=h.incident.id;h.narrative.lines.forEach((l,j)=>{l.incidentId=h.narrative.id;l.id=h.incident.id+':line-'+j;});return h;});
 s.incidentSequence=300;s.narrative.nextIncident=301;
 const raw=encode(s,Array.from({length:20},()=>s),null,Array(20).fill(null),Array.from({length:20},()=>({state:s,progress:null})));
 assert(Buffer.byteLength(raw)<6000000);const restored=decode(raw);assert.deepEqual(restored.state,s);assert(restored.undo.length<20);assert(restored.redo.length<20);
});

test('first ordinary Tax differs from repeated Tax, while first Governor General Tax never invents a repeat',()=>{
 let s=enabled(correctRegion(initialState(),'bombay',{control:'company',presidency:'bombay',lootAvailable:false}));
 s=apply(s,{type:'tax',region:'bombay'});assert(s.history.at(-1).narrative.lines.some(l=>l.templateId==='ruler-tax-first-1'));
 s=apply(s,{type:'tax',region:'bombay'});assert(s.history.at(-1).incident.facts.some(f=>f.type==='tax'&&f.ordinal===2));assert(s.history.at(-1).narrative.lines.some(l=>l.templateId==='ruler-tax-repeat-1'||l.callbackMemoryIds.some(id=>['tax','tax-repeat'].includes(s.narrative.memories[id].category))));
 const general=apply(enabled(initialState('1813')),{type:'tax',region:'bombay'});
 assert(general.history.at(-1).narrative.lines.some(l=>l.templateId==='ruler-tax-general-1'));
 assert(!general.history.at(-1).narrative.lines.some(l=>l.templateId==='ruler-tax-repeat-1'));
});

test('dead rulers remain archived and never speak new lines',()=>{
 const s=enabled();s.narrative.characters['ruler-bombay'].condition='dead';
 const next=commitNarrative(s,resolveDeployment(s,deploy()));validate(next);
 assert(!next.history.at(-1).narrative.lines.some(l=>l.speakerId==='ruler-bombay'));
 assert.equal(next.narrative.characters['ruler-bombay'].condition,'dead');
});

test('imprisoned living characters age while dead characters do not',()=>{
 const s=enabled(inParliament(initialState()));s.parliamentFinishedTurn=s.turn;
 s.narrative.characters['ruler-bombay'].condition='imprisoned';s.narrative.characters['ruler-delhi'].condition='dead';
 const next=apply(s,{type:'next-turn'});
 assert.equal(next.narrative.characters['ruler-bombay'].age,s.narrative.characters['ruler-bombay'].age+3);
 assert.equal(next.narrative.characters['ruler-delhi'].age,s.narrative.characters['ruler-delhi'].age);
});

test('debug turn staging rebases the narrative clock without changing ages or inventing witnessed history',()=>{
 const s=enabled(debugState('1710-long'));s.turn=4;s.narrative.lastAgedTurn=4;
 const ages=Object.values(s.narrative.characters).map(c=>c.age);s.turn=2;
 const staged=debugPhase(s,'operations');validate(staged);assert.equal(staged.narrative.lastAgedTurn,2);
 assert.deepEqual(Object.values(staged.narrative.characters).map(c=>c.age),ages);assert.equal(staged.narrative.chapters.length,0);
});

test('every scenario plays through its real event stack and final ending with identical narrative-on/off rules',()=>{
 const fixed=a=>{a[0]=0;return a;};
 for(const [scenario,end] of [['1710',5],['1758',7],['1813',8],['1710-long',8]]){
  let off=initialState(scenario);off.eventStack=createEventStack(fixed);let on=enabled(clone(off));const start=off.turn,ages=Object.values(on.narrative.characters).map(c=>c.age);
  const step=d=>{const plain=resolveAction(off,d),fiction=commitNarrative(on,resolveAction(on,d));assert.deepEqual(mechanics(plain.state),mechanics(fiction));off=plain.state;on=validate(fiction);};
  for(;;){
   step({type:'phase-start',face:4});
   for(let i=0;i<4;i++){
    step(drawRequest(off.eventStack,fixed));const d=pendingEvent(off.eventStack);
    if(d.event==='foreign')Object.assign(d,{stormFace:4,storm:'none',rolls:{}});
    for(let attempts=0;;attempts++){
     assert(attempts<40,'event must finish');
     try{resolveAction(off,d);break;}catch(e){assert(e instanceof NeedsInput,e.message);const q=e.request;
      if(q.type==='defense')d.defenses={...d.defenses,[q.key]:q.strength};
      else if(q.type==='officer-rout')d.officerRouts={...d.officerRouts,[q.region]:0};
      else if(q.type==='invasion-roll')d.rolls={...d.rolls,[q.region]:3};
      else if(q.type==='attack-order')d.attackOrder={...d.attackOrder,[q.key]:q.regions[0]};
      else assert.fail('Unexpected input '+q.type);
     }
    }
    step(d);
   }
   step({type:'phase-finish'});step({type:'parliament-finish'});
   const portable=decode(encode(on));assert.deepEqual(portable.state,on);
   if(off.turn===end)break;step({type:'next-turn'});
  }
  step({type:'end-game',reason:'completed'});assert.equal(on.gameEnd.turn,end);assert.equal(on.narrative.chapters.length,end-start+1);
  Object.values(on.narrative.characters).forEach((c,i)=>assert.equal(c.age,ages[i]+3*(end-start)));
 }
});
