import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,clone,validate,encode,decode,resolveDeployment} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {commitNarrative} from '../dist/narrative.js';
import {evidenceIndex,resolveFact,assertHistoryDeletionAllowed} from '../dist/narrative-evidence.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {profileHTML} from '../dist/narrative-ui.js';
import {narrativeState,commit,deployment,storySequence} from './m2-fixtures.js';
const memories=(s,c='ruler-bombay')=>Object.values(s.narrative.memories).filter(m=>m.ownerId===c);

test('conquest → memory → grievance → Tax callback → inspectable evidence is playable and grounded',()=>{
 const before=narrativeState(),conquered=commit(before,{type:'deploy',...deployment()}),memory=memories(conquered).find(m=>m.category==='company-conquest');
 assert(memory);assert.equal(memory.origin,'direct');assert(memory.historicalSignificance>=80);assert(memory.emotionalImportance>=70);
 const evidence=resolveFact(evidenceIndex(conquered),memory.evidence[0]);assert.equal(evidence.fact.type,'company-conquest');assert.equal(evidence.fact.region,'bombay');
 const relation=conquered.narrative.characters['ruler-bombay'].relations['institution:company'];assert(relation.hostility>=15&&relation.hostility<=25);assert.equal(relation.causes[0].memoryIds[0],memory.id);
 const taxed=commit(conquered,{type:'tax',region:'bombay'}),line=taxed.history.at(-1).narrative.lines.find(l=>l.callbackMemoryIds.includes(memory.id));
 assert(line);assert(line.text.includes('Company took control of Bombay'));assert(line.evidence.every(r=>r.incidentId===taxed.history.at(-1).incident.id));
 assert(taxed.narrative.memories[memory.id].emotionalImportance>memory.emotionalImportance);
 const html=profileHTML(taxed,'ruler-bombay');for(const text of ['Defining memories','Historical significance','Current emotional importance','Relationship reasons','Chronological personal memory journal',memory.createdIncident])assert(html.includes(text),text);
 assert.deepEqual(decode(encode(taxed)).state,taxed);
});

test('one incident creates selective direct and indirect memories with different importance',()=>{
 const s=commit(narrativeState(),{type:'deploy',...deployment()}),direct=memories(s).find(m=>m.category==='company-conquest');
 const family=memories(s,'heir-bombay').find(m=>m.category==='company-conquest'),adviser=memories(s,'army-bombay').find(m=>m.category==='company-conquest');
 assert.equal(family.origin,'indirect');assert.equal(adviser.origin,'indirect');assert(direct.historicalSignificance>adviser.historicalSignificance);assert(adviser.historicalSignificance>family.historicalSignificance);
 assert.equal(memories(s,'ruler-mysore').length,0);assert.equal(memories(s,'secretary-bengal').length,0);
});

test('partial reconciliation preserves conquest evidence, gratitude and hostility coexist without adviser guilt',()=>{
 const {states}=storySequence(),before=states[3],after=states[4],id=memories(before).find(m=>m.category==='company-conquest').id;
 assert.equal(after.narrative.memories[id].historicalSignificance,before.narrative.memories[id].historicalSignificance);
 assert(after.narrative.memories[id].emotionalImportance<before.narrative.memories[id].emotionalImportance);
 const r=after.narrative.characters['ruler-bombay'].relations['institution:company'];assert(r.hostility>0&&r.gratitude>0&&r.respect>0);assert(r.causes.length>=4);
 const personal=after.narrative.characters['ruler-bombay'].relations['character:secretary-bombay'];assert(personal);assert.equal(personal.hostility,0);assert(personal.gratitude>0);assert(personal.causes[0].statementIds.length>0);
});

test('actual saved assurance is quoted exactly later without claiming intentional deception',()=>{
 const {state,states}=storySequence(),statement=Object.values(states[4].narrative.statements)[0];assert(statement);
 const quoted=state.history.at(-1).narrative.lines.find(l=>l.callbackStatementIds.includes(statement.id));assert(quoted);assert(quoted.text.includes(statement.text));
 const oldLine=states[4].history.at(-1).narrative.lines.find(l=>l.id===statement.lineId);assert.equal(oldLine.text,statement.text);assert(statement.audienceIds.includes(quoted.speakerId));
 assert(quoted.text.includes('new unrest'));assert(!/lied|betrayed|deliberately|conspired/.test(quoted.text));
 assert(Object.values(state.narrative.memories).some(m=>m.statementIds.includes(statement.id)&&m.updates.some(u=>u.kind==='challenged-expectation')));
});

test('callback, template and speaker pacing persist independently; repeated taxes vary or fall silent',()=>{
 let s=commit(narrativeState(),{type:'deploy',...deployment()});s=commit(s,{type:'tax',region:'bombay'});const first=s.history.at(-1).narrative.lines.find(l=>l.speakerId==='ruler-bombay');assert(first.callbackMemoryIds.length);
 s=commit(s,{type:'tax',region:'bombay'});const second=s.history.at(-1).narrative.lines.find(l=>l.speakerId==='ruler-bombay');assert(second);assert.equal(second.callbackMemoryIds.length,0);
 const p=s.narrative.characters['ruler-bombay'].pacing;assert(p.templates.length>0&&p.phrases.length>0&&Object.keys(p.callbacks).length>0);assert(p.lastAppearance>=0);
 for(let i=0;i<6;i++)s=commit(s,{type:'tax',region:'bombay'});
 assert(s.history.every(h=>h.narrative.lines.length<=3));assert.deepEqual(decode(encode(s)).state.narrative.characters['ruler-bombay'].pacing,s.narrative.characters['ruler-bombay'].pacing);
});

test('Undo/Redo restores exact memories, statements, quotes and RNG; alternate branch has no abandoned words',()=>{
 const {states}=storySequence(),before=states[3],after=states[4],frame=undoFrame(after,null,[before],[null],[]),saved=decode(encode(frame.state,frame.undo,frame.progress,frame.undoProgress,frame.redo));
 assert.equal(Object.keys(saved.state.narrative.statements).length,0);
 const redone=redoFrame(saved.state,saved.progress,saved.undo,saved.undoProgress,saved.redo);assert.deepEqual(redone.state,after);
 const alternative=commit(saved.state,{type:'tax',region:'bombay'});assert.equal(Object.keys(alternative.narrative.statements).length,0);assert(alternative.history.at(-1).narrative.lines.every(l=>l.callbackStatementIds.length===0));
});

test('previews, repeated processing and profile rendering do not mutate memories or resample RNG',()=>{
 const s=storySequence().state,original=clone(s);resolveAction(s,{type:'tax',region:'bombay'});profileHTML(s,'ruler-bombay');encode(s);assert.deepEqual(s,original);
 const next=commit(s,{type:'tax',region:'bombay'});assert.deepEqual(commitNarrative(s,{state:next}),next);
});

test('current-version evidence validation rejects missing, future, wrong-region and fabricated quotation sources',()=>{
 const good=storySequence().state;
 for(const mutate of [
  s=>Object.values(s.narrative.memories)[0].evidence[0].incidentId='missing',
  s=>Object.values(s.narrative.memories)[0].region='delhi',
  s=>Object.values(s.narrative.statements)[0].text='A fabricated promise',
  s=>s.history[1].narrative.lines[1].callbackMemoryIds=[Object.values(s.narrative.memories).at(-1).id]
 ]){const bad=clone(good);mutate(bad);assert.throws(()=>validate(bad),/Invalid narrative/);}
});

test('M1 development files are rejected; current narrative-off/on saves still round-trip',()=>{
 for(const s of [initialState(),narrativeState()])assert.deepEqual(decode(encode(s)).state,s);
 const old=JSON.parse(encode(narrativeState()));old.version=1;assert.throws(()=>decode(JSON.stringify(old)),/Unsupported development save version/);
});

test('challenged assurances preserve original interpretations and allow personality-dependent reassessment',()=>{
 const s=storySequence().states[4],statement=Object.values(s.narrative.statements)[0],id=Object.values(s.narrative.memories).find(m=>m.ownerId==='ruler-bombay'&&m.statementIds.includes(statement.id)).id;
 const original=clone(s.narrative.memories[id].interpretation);s.narrative.characters['ruler-bombay'].traits.loyalty=80;
 const next=commit(s,{type:'tax',region:'bombay'});assert.deepEqual(next.narrative.memories[id].interpretation,original);assert.match(next.narrative.memories[id].currentAssessment.text,/inclined to trust/);
 assert(profileHTML(next,'ruler-bombay').includes('Current assessment'));
});

test('referenced debug incident deletion is blocked with named evidence; unreferenced records remain removable',()=>{
 const s=storySequence().state,id=s.history[0].incident.id;
 assert.throws(()=>assertHistoryDeletionAllowed(s,[id]),e=>e.message.includes(id)&&e.message.includes('Memory')&&e.message.includes('Saved line'));
 assert.doesNotThrow(()=>assertHistoryDeletionAllowed(s,['not-referenced']));
});

test('representative complete loops work in all four scenarios with supported adviser associations',()=>{
 for(const scenario of ['1710','1758','1813','1710-long']){
  const {state,target}=storySequence(scenario);validate(state);assert(Object.values(state.narrative.memories).some(m=>m.region===target&&m.category==='company-conquest'));
  assert(state.history.some(h=>h.narrative?.lines.some(l=>l.callbackMemoryIds.length)));assert(state.history.some(h=>h.narrative?.lines.some(l=>l.callbackStatementIds.length)));
  const generalTax=state.history.find(h=>h.actionType==='tax');if(scenario==='1813')assert(generalTax.incident.facts.some(f=>f.type==='tax'&&f.mode==='general'));
 }
});

test('political-memory processing never consumes the gameplay crypto source',()=>{
 const s=narrativeState(),descriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto');
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(){assert.fail('Narrative consumed gameplay randomness');}}});
 try{const conquered=commit(s,{type:'deploy',...deployment()});commit(conquered,{type:'tax',region:'bombay'});}finally{if(descriptor)Object.defineProperty(globalThis,'crypto',descriptor);else delete globalThis.crypto;}
});

test('invalid current-version undo frames and malformed canonical fact arrays cannot be exported',()=>{
 const good=storySequence().state,bad=clone(good);Object.values(bad.narrative.memories)[0].evidence[0].incidentId='not-real';
 assert.throws(()=>encode(good,[bad]),/Invalid narrative/);
 const malformed=clone(good);malformed.history[0].incident.facts=null;assert.throws(()=>validate(malformed),/canonical incident facts/);
});
