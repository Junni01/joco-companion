import test from 'node:test';
import assert from 'node:assert/strict';
import {clone,validate,encode,decode,correctRegion} from '../dist/model.js';
import {createNarrative} from '../dist/narrative.js';
import {debugResult,debugState} from '../dist/debug-state.js';
import {storySequence,narrativeState,commit,deployment} from './m2-fixtures.js';
const event=(event,patch={})=>({type:'event',event,manualTest:true,topRegion:'delhi',shape:'circle',redirectShape:'circle',modifier:0,...patch});
const find=(s,owner,cat)=>Object.values(s.narrative.memories).filter(m=>m.ownerId===owner&&m.category===cat);
function nextTurn(s){let n=clone(s);n.indiaPhase={turn:n.turn,face:4,total:4,completed:4,status:'complete'};n.parliamentFinishedTurn=n.turn;return commit(n,{type:'next-turn'});}

test('successful and failed rebellions have grounded, opposing personal interpretations',()=>{
 for(const [modifier,won] of [[-3,false],[10,true]]){
  const before=narrativeState(),s=commit(before,event('leader',{topRegion:'punjab',modifier})),cat=won?'rebellion-won':'rebellion-failed';
  const subject=find(s,'ruler-punjab',cat)[0],capital=find(s,'ruler-delhi',cat)[0];assert(subject&&capital);assert.equal(subject.origin,'direct');assert.equal(capital.origin,'direct');assert.notEqual(subject.emotion,capital.emotion);assert.notEqual(subject.interpretation.text,capital.interpretation.text);
  assert.equal(s.regions.punjab.overlord,won?null:'delhi');assert.equal(s.narrative.seats.punjab,before.narrative.seats.punjab);assert(Object.values(s.narrative.characters).every(c=>c.condition==='alive'));
  const lines=s.history.at(-1).narrative.lines;assert(lines.some(l=>l.speakerId==='ruler-punjab'));assert(lines.some(l=>l.speakerId==='ruler-delhi'));assert(!lines.some(l=>/betray|execut|restored claimant/.test(l.text)));
 }
});

test('Indian conquest remembers allegiance origin and actual freed subjects, never a starting conquest',()=>{
 let s=narrativeState();s.regions.bombay.strength=5;s.elephant={from:'bombay',to:'delhi'};s=commit(s,event('crisis'));
 assert.equal(s.regions.delhi.overlord,'bombay');assert(find(s,'ruler-delhi','subordination').length);assert(find(s,'ruler-bombay','subordination').length);
 assert.equal(find(s,'ruler-delhi','subordination')[0].emotion,'resentment');assert.equal(find(s,'ruler-bombay','subordination')[0].emotion,'pride');
 for(const region of ['punjab','maratha']){assert.equal(s.regions[region].overlord,null);assert(find(s,'ruler-'+region,'released').length);assert.equal(s.narrative.allegiances.find(a=>a.subject===region).origin,'unknown');}
 assert.equal(s.narrative.allegiances.find(a=>a.subject==='delhi'&&!a.end).origin,'battle');
 assert(find(s,'ruler-mysore','released').length===0);
});

test('capital collapse via foreign invasion gives the defeated capital and true subjects distinct memories',()=>{
 let s=narrativeState();s.regions.bombay.overlord='delhi';
 // Make this an explicit test starting position, not an invented witnessed conquest.
 s.narrative=createNarrative(s,4321);s=commit(s,event('foreign',{storm:'none',topRegion:'delhi',rolls:{delhi:6}}));
 assert.equal(s.regions.punjab.overlord,null);assert.equal(s.regions.maratha.overlord,null);assert.equal(s.regions.bombay.overlord,null);
 assert(find(s,'ruler-delhi','released').every(m=>m.emotion==='humiliation'));assert(find(s,'ruler-delhi','released').length>=3);
 for(const region of ['punjab','maratha','bombay'])assert(find(s,'ruler-'+region,'released')[0].emotion==='relief');
});

test('failed/catastrophic Company expeditions relieve an Indian defender without inventing officer deaths',()=>{
 for(const outcome of ['failure','catastrophe']){
  const s=commit(narrativeState(),{type:'deploy',...deployment('bombay',{outcome,losses:1})}),cat=outcome==='failure'?'deployment-failed':'deployment-catastrophe';
  assert.equal(find(s,'ruler-bombay',cat)[0].emotion,'relief');assert.equal(find(s,'army-bombay',cat)[0].emotion,outcome==='failure'?'disappointment':'humiliation');
  assert.equal(s.regions.bombay.control,'indian');assert(Object.values(s.narrative.characters).every(c=>c.condition==='alive'));
 }
});

test('foreign primary attacks and secondary rebellions retain order, region/rout counts and one coherent scene',()=>{
 let s=narrativeState('1813');s=correctRegion(s,'hyderabad',{control:'company',presidency:'bombay',lootAvailable:false,unrest:2});
 const d=event('foreign',{storm:'all',rolls:{bombay:5,madras:4,bengal:3},defenses:{'foreign:bombay':0,'foreign:madras':0,'foreign:bengal':0,'foreign:secondary:hyderabad':0},officerRouts:{bombay:2,madras:0,bengal:1,hyderabad:0},topRegion:'punjab'});
 s=commit(s,d);const h=s.history.at(-1),battles=h.incident.facts.filter(f=>f.type==='battle'&&f.kind==='company-defence');
 assert.deepEqual(battles.map(f=>f.stage),['primary','primary','primary','secondary']);assert.deepEqual(h.officerRouts.map(r=>r.removed),[2,0,1,0]);
 for(const region of ['bombay','madras','bengal','hyderabad'])assert(find(s,'ruler-'+region,'company-loss').length===1);
 assert.equal(h.narrative.lines.filter(l=>l.speakerId==='chronicler').length,1);assert(Object.values(s.narrative.characters).every(c=>c.condition==='alive'));
});

test('ongoing occupation suspends blind fading, resolved minor emotions cool without losing evidence',()=>{
 let s=commit(narrativeState(),{type:'deploy',...deployment()});s=commit(s,{type:'tax',region:'bombay'});
 const conquest=find(s,'ruler-bombay','company-conquest')[0],tax=find(s,'ruler-bombay','tax')[0],ids=Object.keys(s.narrative.memories);s=nextTurn(s);
 assert.equal(s.narrative.memories[conquest.id].emotionalImportance,conquest.emotionalImportance);assert.equal(s.narrative.memories[conquest.id].historicalSignificance,conquest.historicalSignificance);
 assert.equal(s.narrative.memories[tax.id].emotionalImportance,tax.emotionalImportance-2);assert.deepEqual(Object.keys(s.narrative.memories),ids);
});

test('three strong experiences can cause a small supported trait change, never a mechanical effect',()=>{
 let s=narrativeState(),base=s.narrative.characters['ruler-punjab'].traits.caution;
 for(let i=0;i<3;i++)s=commit(s,event('leader',{topRegion:'punjab',modifier:-3}));
 const c=s.narrative.characters['ruler-punjab'];assert(c.traits.caution>base&&c.traits.caution<=base+2);assert.equal(c.development.changes.length,1);assert.equal(c.development.changes[0].incidentIds.length,3);
 assert.equal(s.regions.punjab.overlord,'delhi');assert.deepEqual(decode(encode(s)).state,s);
});

test('a major later loss may reopen a remembered conquest with fresh wording inside its cooldown',()=>{
 let s=commit(narrativeState(),{type:'deploy',...deployment()});s=commit(s,{type:'tax',region:'bombay'});
 const old=find(s,'ruler-bombay','company-conquest')[0];
 s=commit(s,event('foreign',{storm:'west',topRegion:'delhi',rolls:{bombay:5},defenses:{'foreign:bombay':0},officerRouts:{bombay:0}}));
 const line=s.history.at(-1).narrative.lines.find(l=>l.speakerId==='ruler-bombay');assert(line.callbackMemoryIds.includes(old.id));assert.equal(line.cooldownOverride,'new-major-political-outcome');assert(line.text.includes('has ended'));
});

test('debug deletion reports current-version blockers, while whole-campaign reset remains allowed',()=>{
 let s=storySequence().state;s.debugMode=true;const removed=clone(s);removed.history=[];
 assert.throws(()=>debugResult(s,removed,'clear reports'),/Memory.*|support saved narrative evidence/s);
 assert.doesNotThrow(()=>debugResult(s,debugState(),'reset whole campaign'));
});

test('accumulated major successes can reduce caution slightly with three surviving sources',()=>{
 let s=narrativeState();s.regions.bombay.strength=5;const baseline=s.narrative.characters['ruler-bombay'].traits.caution;
 for(const target of ['delhi','maratha','hyderabad']){s.elephant={from:'bombay',to:target};s=commit(s,event('crisis',{modifier:5}));}
 const c=s.narrative.characters['ruler-bombay'];assert(c.traits.caution<baseline&&c.traits.caution>=baseline-2);assert.equal(c.development.changes[0].incidentIds.length,3);assert(c.development.changes[0].delta<0);
});
