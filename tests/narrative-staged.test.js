import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STAGED_DIALOGUE} from '../dist/narrative-staged-content.js';
import {stagedCandidates,selectStaged,validateStaged,invasionContext,validatePendingScenes,ensurePhaseScene,phaseScene} from '../dist/narrative-staged.js';
import {initialState,correctRegion,encode,decode,clone,validate} from '../dist/model.js';
import {createNarrative,commitNarrative} from '../dist/narrative.js';
import {resolveAction} from '../dist/actions.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {readableChronicle} from '../dist/chronicle.js';
const state=()=>{const s=initialState();s.narrative=createNarrative(s,717);return s;};
const step=(s,d)=>commitNarrative(s,resolveAction(s,d));
function phase(face){return step(state(),{type:'phase-start',face});}
function company(){let s=state();for(const id of ['bombay','madras','bengal'])s=correctRegion(s,id,{control:'company',presidency:id,lootAvailable:false});return s;}
test('all 81 scenes and every speaker/text turn are exact approved source material; no cast identities invented',()=>{
 const source=['collection09e-weather-and-tensions-candidates.md','collection09e-invasions-candidates.md'].map(f=>fs.readFileSync(new URL('../docs/narrative/writing/'+f,import.meta.url),'utf8')).join('\n');assert.equal(STAGED_DIALOGUE.length,81);assert.equal(new Set(STAGED_DIALOGUE.map(s=>s.id)).size,81);for(const e of STAGED_DIALOGUE)for(const l of e.lines)assert(source.includes(`**${l.speaker}:** ${l.text}`),e.id);assert.equal(STAGED_DIALOGUE.filter(s=>s.kind==='weather').length,25);assert.equal(STAGED_DIALOGUE.filter(s=>s.kind==='tension').length,20);assert.equal(STAGED_DIALOGUE.filter(s=>s.kind==='force').length,15);
});
for(let face=0;face<6;face++)test(`weather ${face}: five genuine alternatives, stable saved weather and guarded delayed tensions`,()=>{
 let s=phase(face),count=s.indiaPhase.total;assert.equal(stagedCandidates('weather',{face}).length,5);s=ensurePhaseScene(s,'weather');assert(phaseScene(s,'weather'));const before=encode(s);assert.equal(encode(ensurePhaseScene(s,'weather')),before);assert.deepEqual(decode(before).state,s);assert.equal(s.narrative.rng,phase(face).narrative.rng);assert.equal(Object.keys(s.narrative.characters).length,23);assert.equal(ensurePhaseScene(s,'tension'),s);
 if(face<4)s=step(s,{type:'phase-ships'});else s.narrative.weather.weatherPresented=true;
 s=ensurePhaseScene(s,'tension');assert.equal(phaseScene(s,'tension').context.count,count);assert.notEqual(phaseScene(s,'weather').theme,phaseScene(s,'tension').theme);assert(readableChronicle(s).includes(phaseScene(s,'tension').lines[0].text.replaceAll('&','&amp;').replaceAll("'",'&#39;')));
 const frame=undoFrame(s,null,[decode(before).state],[null],[]);assert.deepEqual(redoFrame(frame.state,frame.progress,frame.undo,frame.undoProgress,frame.redo).state,s);
});
for(const count of [1,2,3,4])test(`tension ${count}: exactly five alternatives, no future event selector`,()=>{const s=state(),c={count};assert.equal(stagedCandidates('tension',c).length,5);const a=selectStaged(s,'tension',c,'tension');s.eventStack={secret:'never read'};assert.deepEqual(selectStaged(s,'tension',c,'tension'),a);});
for(const raw of [1,2,3,4,5,6])test(`force ${raw}: five editorial alternatives, saved raw only and correct actual target`,()=>{
 const s=company(),input={type:'event',event:'foreign',storm:'all',rolls:{bombay:raw}},context=invasionContext(s,input,'bombay');assert.equal(stagedCandidates('force',context).length,5);const scene=selectStaged(s,'force',context,'force:bombay');validatePendingScenes(s,input,[scene]);assert.equal(scene.context.raw,raw);assert(!scene.lines.some(l=>l.text.includes('{region}')));assert.throws(()=>validatePendingScenes(s,{...input,rolls:{bombay:raw===6?1:6}},[scene]),/evidence/);
});
test('generic/French single/multiple and no-target announcements use real source; Governor and court guards remain strict',()=>{
 const s=company();for(const type of ['event','france'])for(const storm of ['all','west','none']){const d={type,event:'foreign',outcome:'failed',storm,topRegion:'mysore'},c=invasionContext(s,d);const rows=stagedCandidates('announcement',c);assert(rows.length);if(type==='event')assert(rows.every(e=>!e.sourceId.startsWith('FR')&&e.sourceId!=='N-01'));if(type==='france'&&storm==='none')assert.deepEqual(rows.map(e=>e.sourceId),['N-01']);}
 const d={type:'event',event:'foreign',storm:'all'},c=invasionContext(s,d);assert(stagedCandidates('announcement',c).some(e=>e.sourceId==='F-09'));s.laws.governorGeneral=true;assert(!stagedCandidates('announcement',invasionContext(s,d)).some(e=>e.sourceId==='F-09'));s.narrative.characters[s.narrative.seats.bombay].condition='dead';assert(!stagedCandidates('force',invasionContext(s,{...d,rolls:{bombay:6}},'bombay')).some(e=>e.sourceId==='H-03'));
});
test('variation avoids immediate scenes and adjacent joke families without advancing any random stream',()=>{
 const s=state(),original=encode(s),seen=new Set();let prior=[];for(let i=0;i<12;i++){const scene=selectStaged(s,'weather',{face:0},'weather',prior);if(prior.length)assert.notEqual(scene.templateId,prior.at(-1).templateId);seen.add(scene.templateId);prior.push(scene);}assert(seen.size>=2);assert.equal(encode(s),original);
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto');Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(){assert.fail('dialogue used gameplay RNG');}}});try{selectStaged(s,'weather',{face:3},'weather');}finally{Object.defineProperty(globalThis,'crypto',descriptor);}
});
test('exact wording, actor labels, raw evidence and hidden fields cannot be tampered; old current-schema saves remain valid',()=>{
 let s=ensurePhaseScene(phase(4),'weather'),scene=phaseScene(s,'weather');for(const change of [r=>r.lines[0].text+=' false',r=>r.lines[0].speaker='invented VIP',r=>r.context.face=0,r=>r.context.secretTile='foreign']){const bad=clone(scene);change(bad);assert.throws(()=>validateStaged(bad),/09E/);}const old=phase(4);assert.deepEqual(decode(encode(old)).state,old);const bad=clone(s);bad.history.at(-1).narrative.stagedScenes[0].lines[0].text='There will be a rebellion.';assert.throws(()=>validate(bad),/09E/);
});

test('all 81 alternatives are reachable across eligible campaigns, not just stored in the catalogue',()=>{
 const reached=new Set();for(let seed=0;seed<200;seed++){const s=company();s.narrative.rng=seed;for(const face of [0,1,2,3,4])reached.add(selectStaged(s,'weather',{face},'weather').templateId);for(const count of [1,2,3,4])reached.add(selectStaged(s,'tension',{count},'tension').templateId);for(const type of ['event','france'])for(const storm of ['all','west','none']){const input={type,event:'foreign',outcome:'failed',storm,topRegion:'mysore'};reached.add(selectStaged(s,'announcement',invasionContext(s,input),'announcement').templateId);}for(const raw of [1,3,5])reached.add(selectStaged(s,'force',invasionContext(s,{type:'event',storm:'west',rolls:{bombay:raw}},'bombay'),'force:bombay').templateId);}assert.equal(reached.size,81,[...STAGED_DIALOGUE.filter(e=>!reached.has(e.id)).map(e=>e.id)].join(','));
});

test('quiet presentation suppresses cached stage views without rewriting saved scenes',()=>{
 const s=ensurePhaseScene(phase(4),'weather'),words=clone(s.history.at(-1).narrative.stagedScenes);s.narrative.intensity='quiet';assert.equal(phaseScene(s,'weather'),null);assert.equal(selectStaged(s,'weather',{face:4},'weather'),null);assert.deepEqual(s.history.at(-1).narrative.stagedScenes,words);
});

test('committed attack scenes preserve exact metadata without changing cast, memories or mechanics; political evidence is checked',()=>{
 const s=company(),input={type:'event',manualTest:true,event:'foreign',topRegion:'mysore',shape:'circle',storm:'all',rolls:{bombay:1,madras:3,bengal:5},defenses:{'foreign:bombay':1,'foreign:madras':3,'foreign:bengal':5}};const scenes=[selectStaged(s,'announcement',invasionContext(s,input),'announcement')];for(const id of ['bombay','madras','bengal'])scenes.push(selectStaged(s,'force',invasionContext(s,input,id),'force:'+id,scenes));const r=resolveAction(s,input);r.stagedScenes=scenes;const saved=validate(commitNarrative(s,r)),normal=commitNarrative(s,resolveAction(s,input));assert.deepEqual(saved.narrative.characters,normal.narrative.characters);assert.deepEqual(saved.narrative.memories,normal.narrative.memories);assert.deepEqual(saved.narrative.statements,normal.narrative.statements);assert.equal(saved.narrative.rng,normal.narrative.rng);assert.deepEqual(decode(encode(saved)).state,saved);assert.equal(saved.history.at(-1).narrative.stagedScenes.length,4);const bad=clone(saved);bad.history.at(-1).narrative.stagedScenes[0].context.companyTargets=[];assert.throws(()=>validate(bad),/09E/);
});

test('real turn boundaries retain prior scene cooldowns without carrying a dialog cache into the next phase',()=>{
 let s=state(),previous=null;const ids=[];for(let turn=0;turn<3;turn++){s=step(s,{type:'phase-start',face:0});s=ensurePhaseScene(s,'weather');const scene=phaseScene(s,'weather');if(previous)assert.notEqual(scene.templateId,previous);previous=scene.templateId;ids.push(previous);s=step(s,{type:'phase-ships'});s=ensurePhaseScene(s,'tension');for(let i=0;i<2;i++)s=step(s,{type:'event',event:'windfall',topRegion:'mysore'});s=step(s,{type:'phase-finish'});s=step(s,{type:'parliament-finish'});s=step(s,{type:'next-turn'});}assert.equal(ids.length,3);assert.deepEqual(decode(encode(s)).state,s);
});
