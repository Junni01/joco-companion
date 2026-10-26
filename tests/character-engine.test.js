import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createNarrative,commitNarrative} from '../dist/narrative.js';
import {validate,clone,encode,decode,resolveDeployment,initialState} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {CONDITION_LABELS,politicalRoleOf} from '../dist/narrative-characters.js';
import {profileHTML,rosterCardsHTML,narrativeExportHTML} from '../dist/narrative-ui.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {inParliament} from './phase-fixtures.js';
import {characterCampaign,legacyCampaign,statusFixture} from './character-engine-fixtures.js';
const deploy={army:'bombay',target:'bombay',regiments:6,officers:2,alliances:[],outcome:'success',losses:1};
test('fresh cast is exactly the same 23 stable identities, siblings and traits; optional foundations do not consume RNG',()=>{
 const s=characterCampaign(),old=legacyCampaign();assert.equal(Object.keys(s.narrative.characters).length,23);assert.equal(s.narrative.version,2);assert.equal(s.narrative.rng,old.narrative.rng);
 const stripped=clone(s);for(const c of Object.values(stripped.narrative.characters)){delete c.politicalRole;delete c.politicalHistory;delete c.conditionHistory;}assert.deepEqual(stripped,old);
 for(const [region,id]of Object.entries(s.narrative.seats)){assert.equal(id,'ruler-'+region);assert.equal(s.narrative.characters[id].family[0].tie,'younger sibling');assert.equal(s.narrative.characters['heir-'+region].politicalRole.kind,'family-member');}
});
test('old current-version campaigns round-trip exactly with absent fields, including all committed quoted words',()=>{
 let s=legacyCampaign();s=commitNarrative(s,resolveDeployment(s,deploy));for(const c of Object.values(s.narrative.characters)){delete c.politicalRole;delete c.politicalHistory;delete c.conditionHistory;}
 const bytes=encode(s),before=clone(s);validate(s);profileHTML(s,'ruler-bombay');rosterCardsHTML(s);narrativeExportHTML(s);assert.deepEqual(s,before);assert.deepEqual(decode(bytes).state,s);assert.equal(encode(decode(bytes).state),bytes);assert.equal(politicalRoleOf(s,s.narrative.characters['ruler-bombay']).kind,'company-dependent-ruler');
});
for(const condition of Object.keys(CONDITION_LABELS))test(`test-only ${condition}: exact public status label, persistent original ID, no future-survival flag`,()=>{
 const s=statusFixture(),c=Object.values(s.narrative.characters).find(c=>c.role==='heir'&&c.condition===condition),before=encode(s);assert(c);const html=profileHTML(s,c.id),roster=rosterCardsHTML(s,{query:CONDITION_LABELS[condition]});assert(html.includes(CONDITION_LABELS[condition]));assert(roster.includes(c.name));assert(narrativeExportHTML(s).includes(CONDITION_LABELS[condition]));assert(!html.includes('secretlyAlive'));assert.equal(encode(s),before);assert.deepEqual(decode(before).state,s);assert.equal(Object.keys(s.narrative.characters).length,23);
});
test('actual control change records political role only, with exact source and unchanged person/history/gameplay',()=>{
 const before=characterCampaign(),r=resolveDeployment(before,deploy),next=validate(commitNarrative(before,r)),c=next.narrative.characters['ruler-bombay'],t=c.politicalHistory[0];assert.equal(c.condition,'alive');assert.deepEqual(c.conditionHistory,[]);assert.equal(t.from.kind,'sovereign-ruler');assert.equal(t.to.kind,'company-dependent-ruler');assert.equal(t.source.incidentId,next.history.at(-1).incident.id);assert.equal(t.source.actionType,'deploy');assert.equal(c.name,before.narrative.characters[c.id].name);assert.deepEqual(next.regions,r.state.regions);assert(profileHTML(next,c.id).includes('Political role history'));assert(!profileHTML(next,c.id).includes('Life status history'));
 const bad=clone(next);bad.narrative.characters[c.id].politicalHistory[0].from.kind='vassal-ruler';assert.throws(()=>validate(bad),/recorded control change/);
 const undone=undoFrame(next,null,[before],[null],[]);assert.deepEqual(undone.state,before);const redone=redoFrame(undone.state,undone.progress,undone.undo,undone.undoProgress,undone.redo);assert.deepEqual(redone.state,next);assert.deepEqual(decode(encode(next)).state,next);
});
test('unknown references, duplicate/contradictory histories, invalid role/condition, unavailable seats and secret fates rejected',()=>{
 const cases=[s=>s.narrative.characters['heir-delhi'].condition='resurrected',s=>s.narrative.characters['heir-delhi'].politicalRole.region='london',s=>s.narrative.characters['heir-delhi'].conditionHistory[0].source.incidentId='unknown',s=>s.narrative.characters['heir-delhi'].conditionHistory[0].turn=8,s=>s.narrative.characters['heir-delhi'].conditionHistory.push(clone(s.narrative.characters['heir-delhi'].conditionHistory[0])),s=>s.narrative.characters['heir-delhi'].condition='alive',s=>s.narrative.characters['heir-delhi'].politicalHistory[0].to.kind='regent',s=>s.narrative.characters['heir-delhi'].id='ruler-delhi',s=>s.narrative.characters['heir-delhi'].secretlyAlive=true,s=>s.narrative.characters['ruler-bombay'].condition='dead',s=>s.narrative.characters['ruler-delhi'].condition='exiled',s=>s.narrative.characters['ruler-bengal'].condition='presumed-dead',s=>s.narrative.characters['heir-delhi'].conditionHistory=Array(1001).fill({})];for(const bad of cases){const s=statusFixture();bad(s);assert.throws(()=>validate(s));}
});
test('confirmed death cannot transition to life or any other fate, even if a caller removes transition history',()=>{
 for(const to of ['alive','exiled','presumed-dead','missing','imprisoned']){const before=statusFixture(),r=resolveAction(before,{type:'event',event:'windfall',topRegion:'mysore',shape:'circle',manualTest:true});r.state.narrative.characters['heir-bombay'].condition=to;delete r.state.narrative.characters['heir-bombay'].conditionHistory;assert.throws(()=>commitNarrative(before,r),/irreversible/);}
 const s=statusFixture(),c=s.narrative.characters['heir-bombay'];c.conditionHistory[0].from='dead';c.condition='alive';c.conditionHistory[0].to='alive';assert.throws(()=>validate(s),/confirmed-dead/);
});
test('all non-confirmed-dead characters retain +3 ageing exactly once on committed New Turn; fates and seats stay fixed',()=>{
 let s=statusFixture();s=inParliament(s);s.parliamentFinishedTurn=s.turn;const before=clone(s),r=resolveAction(s,{type:'next-turn'}),next=validate(commitNarrative(s,r));for(const c of Object.values(next.narrative.characters)){assert.equal(c.condition,before.narrative.characters[c.id].condition);assert.equal(c.age,before.narrative.characters[c.id].age+(c.condition==='dead'?0:3));}assert.deepEqual(next.narrative.seats,before.narrative.seats);assert.deepEqual(commitNarrative(s,{...r,state:next}),next);
});
test('existing pre-M1 current-schema review saves still decode without rewriting identities or saved prose',()=>{
 const root=new URL('../docs/narrative/review/collection08a/',import.meta.url);let count=0;for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.json'))){const raw=fs.readFileSync(new URL(name,root),'utf8');const parsed=JSON.parse(raw);if(!parsed.state&&!parsed.schemaVersion)continue;try{const s=decode(raw).state;if(s?.narrative){assert.equal(Object.keys(s.narrative.characters).length,23);count++;}}catch(e){if(!/unsupported|format|version/i.test(e.message))throw e;}}assert(count>0);
});

test('Debug political changes retain setup provenance without invented fate or duplicate role history',async()=>{
 const {debugState,debugEditRegion,debugResult}=await import('../dist/debug-state.js');let s=debugState();s.narrative=createNarrative(s,717);const changed=debugEditRegion(s,'bombay',{control:'company',presidency:'bombay',lootAvailable:false});const r=debugResult(s,changed,'Test regional setup');const next=validate(commitNarrative(s,r)),c=next.narrative.characters['ruler-bombay'];assert.equal(c.condition,'alive');assert.equal(c.politicalHistory.length,1);assert.equal(c.politicalHistory[0].source.actionType,'correction');assert.match(c.politicalHistory[0].reason,/Debug setup/);assert.deepEqual(commitNarrative(s,{...r,state:next}),next);
});

test('recorded fate and role provenance has named deletion blockers, including Debug-only index sources',async()=>{
 const {incidentReferences,assertHistoryDeletionAllowed}=await import('../dist/narrative-evidence.js');const s=statusFixture(),id=s.history.at(-1).incident.id;assert(incidentReferences(s,id).some(s=>s.startsWith('Character status/role history')));assert.throws(()=>assertHistoryDeletionAllowed(s,[id]),/Character status\/role history/);
 const {debugState,debugEditRegion,debugResult}=await import('../dist/debug-state.js');let before=debugState();before.narrative=createNarrative(before,717);const changed=debugEditRegion(before,'bombay',{control:'company',presidency:'bombay',lootAvailable:false});const next=commitNarrative(before,debugResult(before,changed,'source'));const deleted=clone(next);deleted.history=[];assert.throws(()=>debugResult(next,deleted,'delete'),/supports this Debug setup/);
});
test('Debug staging an earlier turn preserves recorded role provenance and existing ageing boundary behaviour',async()=>{
 const {debugState,debugEditRegion,debugResult,debugPhase}=await import('../dist/debug-state.js');let before=debugState('1710-long');before.turn=2;before.narrative=createNarrative(before,717);const changed=debugEditRegion(before,'bombay',{control:'company',presidency:'bombay',lootAvailable:false});const next=commitNarrative(before,debugResult(before,changed,'turn-two setup'));next.turn=1;const staged=debugPhase(next,'operations');validate(staged);assert.equal(staged.narrative.characters['ruler-bombay'].politicalHistory[0].turn,2);assert.equal(staged.narrative.lastAgedTurn,1);
});

test('preconfigured map metadata is not misreported as a political change caused by an unrelated later action',async()=>{
 const {correctRegion}=await import('../dist/model.js');let s=characterCampaign();s=correctRegion(s,'bombay',{control:'company',presidency:'bombay',lootAvailable:false});s=commitNarrative(s,resolveAction(s,{type:'tax',region:'bombay'}));const next=validate(commitNarrative(s,resolveAction(s,{type:'tax',region:'bombay'})));const c=next.narrative.characters['ruler-bombay'];assert.deepEqual(c.politicalHistory,[]);assert.equal(c.politicalRole.kind,'company-dependent-ruler');
});
test('an explicit regent role is not overwritten by an ordinary regional strength or unrest change',()=>{
 const s=characterCampaign();s.narrative.characters['ruler-bombay'].politicalRole={kind:'regent',region:'bombay'};const next=validate(commitNarrative(s,resolveAction(s,{type:'event',event:'leader',topRegion:'bombay',shape:'circle',modifier:0,manualTest:true})));assert.equal(next.narrative.characters['ruler-bombay'].politicalRole.kind,'regent');assert.deepEqual(next.narrative.characters['ruler-bombay'].politicalHistory,[]);
});
