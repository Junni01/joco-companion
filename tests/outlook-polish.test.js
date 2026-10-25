import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {APPROVED_OUTLOOKS,OUTLOOK_TEXT} from '../dist/narrative-outlook-content.js';
import {publicKnowledge,forecastRegion,outlookCandidates,legacyOutlookCandidates} from '../dist/narrative-outlooks.js';
import {clone,encode,decode,validate} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {commitNarrative} from '../dist/narrative.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {rulerSummaryHTML,profileHTML} from '../dist/narrative-ui.js';
import {outlookFixture} from './outlook-fixtures.js';
const entries=new Map(APPROVED_OUTLOOKS.map(e=>[e.id,e]));
export function profile(state,id,traits={},confidence=50,mood='watchful'){
 const c=clone(state.narrative.characters[id]);c.traits={ambition:20,pride:20,caution:20,ruthlessness:20,loyalty:20,vindictiveness:20,...traits};c.confidence=confidence;c.mood=mood;
 return {c,grievance:null,helpful:[],recentCategory:null};
}
const select=(context,p,k=70)=>outlookCandidates(context,p,k)[0];

test('all 60 IDs and exact complete authored texts match the approved catalogue, with 48 selectable and 12 blocked',()=>{
 const source=fs.readFileSync(new URL('../docs/narrative/writing/collection09-outlook-polish.md',import.meta.url),'utf8');
 const rows=source.split(/\r?\n/).map(line=>line.match(/^\| `(09B-[^`]+)` \| `([^`]+)` \| ([^|]+) \| (.+) \|$/)).filter(Boolean);
 assert.equal(rows.length,60);assert.equal(APPROVED_OUTLOOKS.length,60);
 for(const [,id,,voice,text]of rows){assert.equal(entries.get(id).text,text);assert.equal(entries.get(id).voice,voice.trim());assert.equal(OUTLOOK_TEXT[id],text);}
 assert.equal(APPROVED_OUTLOOKS.filter(e=>!e.blocked).length,48);assert.equal(APPROVED_OUTLOOKS.filter(e=>e.blocked).length,12);
});

test('the 09A projection, forecasting and public batch update code and event-stack mechanics remain byte-for-byte unchanged',()=>{
 const read=name=>fs.readFileSync(new URL('../dist/'+name,import.meta.url),'utf8').replaceAll('\r\n','\n'),hash=s=>createHash('sha256').update(s).digest('hex');
 const source=read('narrative-outlooks.js');
 assert.equal(hash(source.slice(source.indexOf('export function publicKnowledge'),source.indexOf('function personal'))),'0960e59d51ffe63075f943a59f521482ea1606acc8b73c13d20110f77ad8681f');
 assert.equal(hash(source.slice(source.indexOf('export function updateOutlooks'),source.indexOf('export function validateOutlooks'))),'736b595a8d4be1b6839c9084640d3646ec407343fe857f2e9809dfbe4df8b819');
 assert.equal(hash(read('event-stack.js')),'b637369841c6f80c5cb366f48b6c0d7d8549e645cb6e265be3f562103333881e');
});

test('a factual family is required and blocked past actions, revenues, road and office claims are never selected',()=>{
 const s=outlookFixture().state,p=profile(s,'ruler-delhi'),context=forecastRegion(publicKnowledge(s),'delhi');
 for(const family of new Set(APPROVED_OUTLOOKS.map(e=>e.family))){
  const c={...context,issues:[family]};p.grievance=family==='grievance'||family==='qualified'?'owned-source':null;p.helpful=family==='qualified'?['help-1','help-2']:[];c.local={...c.local,control:p.grievance?'company':'indian'};
  const choices=outlookCandidates(c,p,70);assert(choices.every(x=>!entries.get(x.key)?.blocked));assert(choices.filter(x=>x.family!=='neutral').every(x=>x.family===family||family==='qualified'&&x.family==='grievance'));
 }
 const quiet={...context,issues:[]};assert.equal(select(quiet,p).family,'neutral');
 p.grievance=null;p.helpful=['unowned-help'];assert(!outlookCandidates({...quiet,local:{...quiet.local,control:'company'}},p,70).some(x=>x.family==='qualified'));
});

test('direct local risk, occupied unrest and sourced personal grievance outrank general military atmosphere',()=>{
 const s=outlookFixture().state,p=profile(s,'ruler-bombay',{vindictiveness:90,pride:80}),base=forecastRegion(publicKnowledge(s),'bombay');
 for(const family of ['weak-defender','strong-attacker','subject','capital','company-primary','company-secondary','occupied-discontent'])assert.equal(select({...base,issues:[family,'military-climate']},p).family,family);
 p.grievance='owned-conquest';assert.equal(select({...base,issues:['military-climate'],local:{...base.local,control:'company'}},p).family,'grievance');
 p.helpful=['help-1','help-2'];assert.equal(select({...base,issues:['military-climate'],local:{...base.local,control:'company'}},p).family,'qualified');
});

test('proud and cautious rulers express a threatened frontier differently without changing its factual eligibility',()=>{
 const s=outlookFixture().state,context=forecastRegion(publicKnowledge(s),'bombay');
 const proud=select(context,profile(s,'ruler-bombay',{pride:95,caution:5},55));
 const cautious=select(context,profile(s,'ruler-bombay',{pride:5,caution:95,loyalty:80},40));
 assert.equal(proud.key,'09B-weak-defender-proud');assert.equal(cautious.key,'09B-weak-defender-diplomatic');
 assert.equal(proud.family,cautious.family);
});

test('low aptitude permits occasional error and sensible assessments; high aptitude does not prevent arrogant denial',()=>{
 const s=outlookFixture().state,base=forecastRegion(publicKnowledge(s),'bombay'),low=new Set(),high=new Set();
 for(const back of Object.keys(s.regions)){
  const context={...base,visibleBackRegion:back};
  low.add(select(context,profile(s,'ruler-bombay',{caution:90},90),10).key);
  high.add(select(context,profile(s,'ruler-bombay',{pride:95},90),90).key);
 }
 assert(low.has('09B-weak-defender-denial'));assert(low.has('09B-weak-defender-diplomatic'));
 assert(high.has('09B-weak-defender-denial'));assert(high.has('09B-weak-defender-proud'));
});

test('ambition and caution distinguish the same dangerous climate, and mood/recent experience affect eligible expression',()=>{
 const f=outlookFixture();f.shuffle();const s=f.state,context=forecastRegion(publicKnowledge(s),'madras');
 assert.equal(select(context,profile(s,'ruler-madras',{ambition:95,caution:5},75)).key,'09B-dangerous-climate-ambitious');
 assert.equal(select(context,profile(s,'ruler-madras',{caution:95},40)).key,'09B-dangerous-climate-anxious');
 const mixed={...context,issues:['mixed-climate']},p=profile(s,'ruler-madras',{caution:60},40);
 const before=select(mixed,p).key;p.c.mood='weariness';assert.notEqual(select(mixed,p).key,before);assert.equal(select(mixed,p).key,'09B-uncertain-diplomacy-fatigued');
 const recent=profile(s,'ruler-madras',{ambition:50,pride:50,caution:50,vindictiveness:50},50),traits=clone(recent.c.traits),weak={...context,issues:['weak-attacker']};
 const earlier=select(weak,recent).key;recent.recentCategory='administration';assert.notEqual(select(weak,recent).key,earlier);assert.deepEqual(recent.c.traits,traits);
});

test('earlier saved version-1 thoughts retain exact wording and validation through reads, routine commits and Undo/Redo',()=>{
 const f=outlookFixture(),s=f.state;
 for(const o of Object.values(s.narrative.outlooks)){
  const c={...s.narrative.characters[o.characterId],traits:o.personal.traits,confidence:o.personal.confidence};
  o.version=1;delete o.selectionPolicy;delete o.personal.mood;delete o.personal.recentCategory;delete o.personal.recentMemoryId;
  o.templateId=legacyOutlookCandidates(o.context,{c,grievance:o.personal.grievance,helpful:o.personal.helpful},o.personal.competence)[0].key;o.text=OUTLOOK_TEXT[o.templateId];
 }
 validate(s);const loaded=decode(encode(s)).state;assert.deepEqual(loaded,s);
 const initial=clone(loaded);rulerSummaryHTML(loaded,'delhi');profileHTML(loaded,'ruler-delhi');assert.deepEqual(loaded,initial);
 const routine=commitNarrative(loaded,resolveAction(loaded,{type:'event',manualTest:true,event:'windfall',topRegion:'delhi'}));assert.deepEqual(routine.narrative.outlooks,loaded.narrative.outlooks);
 const changed=commitNarrative(loaded,resolveAction(loaded,{type:'event',manualTest:true,event:'turmoil',topRegion:'bombay'}));assert.equal(changed.narrative.outlooks.bombay.version,2);
 const u=undoFrame(changed,null,[loaded],[null],[]),saved=decode(encode(u.state,u.undo,u.progress,u.undoProgress,u.redo));assert.deepEqual(redoFrame(saved.state,saved.progress,saved.undo,saved.undoProgress,saved.redo).state,changed);
});

test('approved selected words, mood and private evidence persist exactly and unsupported wording or IDs reject import',()=>{
 const f=outlookFixture();f.shuffle();const s=f.state;assert(Object.values(s.narrative.outlooks).every(o=>o.version===2));
 assert.deepEqual(decode(encode(s)).state,s);
 for(const mutate of [o=>o.text+=' Another thought.',o=>o.templateId='09B-strong-defender-dismissive',o=>o.personal.recentMemoryId='missing']){const bad=clone(s);mutate(bad.narrative.outlooks.delhi);assert.throws(()=>validate(bad),/Invalid private outlook/);}
 const before=clone(s);for(let i=0;i<5;i++)rulerSummaryHTML(s,'delhi');assert.deepEqual(s,before);
});
