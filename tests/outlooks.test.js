import test from 'node:test';
import assert from 'node:assert/strict';
import {publicKnowledge,forecastRegion,outlookCandidates} from '../dist/narrative-outlooks.js';
import {OUTLOOK_TEXT} from '../dist/narrative-outlook-content.js';
import {clone,encode,decode,validate,resolveDeployment} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {commitNarrative} from '../dist/narrative.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {debugResult,debugEditElephant} from '../dist/debug-state.js';
import {rulerSummaryHTML,profileHTML} from '../dist/narrative-ui.js';
import {readableChronicle} from '../dist/chronicle.js';
import {incidentReferences} from '../dist/narrative-evidence.js';
import {outlookFixture} from './outlook-fixtures.js';
import {tradeCampaign} from './trade-fixtures.js';
const topic=(s,r)=>forecastRegion(publicKnowledge(s),r);

test('public projection never copies hidden faces, tile IDs or saved Shuffle permutations',()=>{
 const f=outlookFixture();f.step({type:'phase-start',face:4});f.draw();
 const s=f.state;s.eventStack.pending.rebuild=new Proxy({}, {get(){throw Error('hidden rebuild read');}});
 s.eventStack.draw=new Proxy(s.eventStack.draw,{get(target,key){if(/^\d+$/.test(String(key))&&key!=='0')throw Error('hidden position read');return target[key];}});
 const p=publicKnowledge(s);assert.equal(p.revealed,'shuffle');assert.equal(p.visibleBackRegion,'punjab');assert(!JSON.stringify(p).includes('tileId'));assert(!('draw'in p));
});

test('hidden permutations with identical public information give identical projections, forecasts, templates and text',()=>{
 const a=outlookFixture().state,b=clone(a),sameBack=b.eventStack.draw.indexOf('madras-peace');[b.eventStack.draw[0],b.eventStack.draw[sameBack]]=[b.eventStack.draw[sameBack],b.eventStack.draw[0]];
 assert.deepEqual(publicKnowledge(a),publicKnowledge(b));
 for(const region of Object.keys(a.regions)){
  const person={c:a.narrative.characters[a.narrative.seats[region]],grievance:null,helpful:[]};
  assert.deepEqual(outlookCandidates(topic(a,region),person,70),outlookCandidates(topic(b,region),person,70));
 }
 const next=s=>commitNarrative(s,resolveAction(s,{type:'event',manualTest:true,event:'windfall',topRegion:'delhi'}));
 assert.deepEqual(next(a).narrative.outlooks,next(b).narrative.outlooks);
});

test('known-batch and pending rebuild permutations with the same public back cannot change eligibility',()=>{
 const f=outlookFixture(['delhi-crisis','mysore-peace']);f.shuffle();const a=clone(f.state),b=clone(a);
 [b.eventStack.draw[5],b.eventStack.draw[6]]=[b.eventStack.draw[6],b.eventStack.draw[5]];
 assert.deepEqual(publicKnowledge(a),publicKnowledge(b));assert.deepEqual(topic(a,'delhi'),topic(b,'delhi'));
});

test('a real Shuffle returns three known Crisis types in unknown order and consumes them exactly once at each reveal',()=>{
 const f=outlookFixture();f.shuffle();assert.deepEqual(f.state.narrative.foresight.batch.counts,{crisis:3});assert.equal(topic(f.state,'delhi').climate,'military');
 const source=f.state.history.at(-1).incident.id;assert(incidentReferences(f.state,source).includes('Public forecast knowledge'));
 for(const remaining of [2,1,0]){
  const drawn=f.draw();assert.equal(drawn.narrative.foresight.batch?.remaining||0,remaining);
  assert.deepEqual(commitNarrative(drawn,{state:drawn}),drawn);f.resolve();assert.equal(f.state.narrative.foresight.batch?.remaining||0,remaining);
 }
 assert.equal(f.state.narrative.foresight.batch,null);assert.equal(topic(f.state,'delhi').climate,'uncertain');
});

test('mixed batches, empty-pile Shuffle, pending reveals and conservative unknown disclosure history remain distinct',()=>{
 const mixed=outlookFixture(['delhi-crisis','mysore-peace']);mixed.shuffle();assert.equal(topic(mixed.state,'delhi').climate,'mixed');
 const empty=outlookFixture([],true);empty.shuffle();assert.equal(empty.state.narrative.foresight.batch.remaining,19);assert.equal(topic(empty.state,'delhi').climate,'mixed');
 const unknown=clone(mixed.state);delete unknown.narrative.foresight;delete unknown.narrative.outlooks;validate(unknown);
 assert.equal(publicKnowledge(unknown).batch,null);assert(!rulerSummaryHTML(unknown,'delhi').includes('outlook-text'));
 const updated=commitNarrative(unknown,resolveAction(unknown,{type:'event',manualTest:true,event:'windfall',topRegion:'delhi'}));assert.equal(updated.narrative.foresight.batch,null);
});

test('public counts come from the catalogue and revealed discards, never undrawn identities',()=>{
 const s=outlookFixture().state,p=publicKnowledge(s);assert.equal(p.remaining.crisis,3);assert.equal(p.remaining.shuffle,1);
 assert.equal(topic(s,'punjab').issues.includes('regional-attention'),false); // The visible back is Madras; not a target claim.
 assert.equal(p.visibleBackRegion,'madras');
});

test('sovereign attack, defence, actual relative strength and independent competence yield different interpretations',()=>{
 const s=outlookFixture().state,p=publicKnowledge(s),attacker=forecastRegion(p,'delhi'),defender=forecastRegion(p,'bombay');
 assert(attacker.issues.includes('strong-attacker'));assert(defender.issues.includes('weak-defender'));
 const person={c:clone(s.narrative.characters['ruler-delhi']),grievance:null,helpful:[]};person.c.traits.ambition=90;person.c.traits.caution=10;
 const ambitious=outlookCandidates(attacker,person,80)[0];assert.equal(ambitious.family,'strong-attacker');person.c.traits.ambition=10;person.c.traits.caution=95;assert.notEqual(outlookCandidates(attacker,person,80)[0].key,ambitious.key);
 person.c.confidence=80;assert.equal(outlookCandidates(attacker,person,10)[0].family,'strong-attacker');assert.equal(outlookCandidates(attacker,person,80)[0].family,'strong-attacker');
 p.regions.bombay.strength=15;assert(forecastRegion(p,'delhi').issues.includes('weak-attacker'));assert(forecastRegion(p,'bombay').issues.includes('strong-defender'));
});

test('subject strength uses its capital alone; Company primary and secondary unrest exposure are distinct',()=>{
 const p=publicKnowledge(outlookFixture().state);p.elephant={from:'punjab',to:'delhi'};
 assert(forecastRegion(p,'punjab').issues.includes('subject'));assert(forecastRegion(p,'delhi').issues.includes('capital'));
 assert.equal(forecastRegion(p,'punjab').defenderStrength,p.regions.delhi.strength);
 p.elephant={from:'bombay',to:null};p.regions.bombay={...p.regions.bombay,control:'company',unrest:2,strength:0};p.regions.madras={...p.regions.madras,control:'company',unrest:1};p.sepoyMultiplier=2;
 assert(forecastRegion(p,'bombay').issues.includes('company-primary'));assert(forecastRegion(p,'madras').issues.includes('company-secondary'));assert.equal(forecastRegion(p,'madras').companyUnrestStrength,2);
 assert(!forecastRegion(p,'madras').issues.includes('weak-defender'));
 p.elephant={from:'delhi',to:'bombay'};const companyFrontier=forecastRegion(p,'delhi');
 assert(companyFrontier.issues.includes('company-frontier'));assert(!companyFrontier.issues.includes('strong-attacker'));assert.equal(companyFrontier.defenderStrength,null);
});

test('re-reading panels, profiles and exports never changes exact private thoughts or either random source',()=>{
 const f=outlookFixture(),s=f.state,old=clone(s);for(let i=0;i<10;i++){rulerSummaryHTML(s,'delhi');rulerSummaryHTML(s,'bombay');profileHTML(s,'ruler-delhi');readableChronicle(s);}
 assert.deepEqual(s,old);const thoughts=clone(s.narrative.outlooks);
 f.step({type:'rename',name:'A quiet correction'});assert.deepEqual(f.state.narrative.outlooks,thoughts);
 const windfall=f.step({type:'event',manualTest:true,event:'windfall',topRegion:'delhi'});assert.deepEqual(windfall.narrative.outlooks,thoughts);
});

test('outlooks and known batches survive current-version autosave/snapshot encoding, Undo/Redo and alternative branches',()=>{
 const f=outlookFixture();f.shuffle();const before=clone(f.state);f.draw();const after=clone(f.state);
 const u=undoFrame(after,null,[before],[null],[]),saved=decode(encode(u.state,u.undo,u.progress,u.undoProgress,u.redo));
 const restored=redoFrame(saved.state,saved.progress,saved.undo,saved.undoProgress,saved.redo);assert.deepEqual(restored.state,after);assert.deepEqual(decode(encode(before)).state,before);
 const alternative=commitNarrative(before,resolveAction(before,{type:'event',manualTest:true,event:'windfall',topRegion:'delhi'}));assert.equal(alternative.narrative.foresight.batch.remaining,3);
});

test('debug setup invalidates the known batch conservatively and refreshes a committed Elephant outlook',()=>{
 const f=outlookFixture();f.shuffle();const s=clone(f.state);s.debugMode=true;
 const after=commitNarrative(s,debugResult(s,debugEditElephant(s,'delhi','bombay'),'Elephant'));
 assert.equal(after.narrative.foresight.batch,null);assert.deepEqual(after.narrative.outlooks.delhi.context.elephant,{from:'delhi',to:'bombay'});
});

test('private assessments never enter statements, public dialogue callbacks, game instructions or narrative-off state',()=>{
 const f=outlookFixture(),on=f.initial;let off=clone(on);delete off.narrative;f.shuffle();f.draw();f.resolve();
 const mechanics=s=>{const n=clone(s);delete n.narrative;for(const h of n.history){delete h.narrative;delete h.at;}return n;};
 for(const [i,input] of f.inputs.entries()){off=(input.type==='deploy'?resolveDeployment:resolveAction)(off,input).state;assert.deepEqual(mechanics(off),mechanics(f.states[i+1]));}
 assert(!off.narrative);assert.equal(f.states[3].narrative.rng,f.initial.narrative.rng); // Shuffle itself has no ordinary character reactions.
 assert(Object.values(f.state.narrative.outlooks).every(o=>o.visibility==='private'));
 assert(Object.values(f.state.narrative.statements).every(s=>!s.text.includes(OUTLOOK_TEXT.alarm)));
 for(const text of Object.values(OUTLOOK_TEXT))assert(!/\b(elephant|tile|deck|discard|dice|game turn|turn [0-9]+|cube|crisis|shuffle|probabilit|bonus)\b/i.test(text));
});

test('malformed text, owners, hidden-context fields, batch sources and personal evidence are rejected',()=>{
 const f=outlookFixture();f.shuffle();
 for(const mutate of [s=>s.narrative.outlooks.delhi.text+=' Invented promise.',s=>s.narrative.outlooks.delhi.characterId='ruler-bombay',s=>s.narrative.foresight.batch.remaining=9,s=>s.narrative.foresight.batch.sourceIncidentId='missing',s=>s.narrative.outlooks.delhi.context.rebuild=[],s=>s.narrative.outlooks.delhi.memoryIds=['missing']]){const s=clone(f.state);mutate(s);assert.throws(()=>validate(s),/Invalid private outlook/);}
});

test('actual personal conquest and repeated helpful interventions support qualified private gratitude without public knowledge transfer',()=>{
 const f=tradeCampaign({pressure:false}),s=f.states.find(s=>s.narrative.outlooks.bombay.templateId.startsWith('09B-qualified-'));assert(s);
 const o=s.narrative.outlooks.bombay;assert(o.personal.grievance);assert.equal(o.personal.helpful.length,2);assert(o.memoryIds.every(id=>s.narrative.memories[id].ownerId===o.characterId));
 assert.equal(o.text,OUTLOOK_TEXT[o.templateId]);assert(!s.history.flatMap(h=>h.narrative?.lines||[]).some(l=>l.text===o.text));
});
