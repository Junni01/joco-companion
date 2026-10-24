import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CHAPTER_TEMPLATES,fillChapter} from '../dist/narrative-chapter-content.js';
import {composeChapter,inspectChapterCandidates} from '../dist/narrative-chapters.js';
import {clone,encode,decode,validate,resolveDeployment} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {chapterCampaign} from './chapter-fixtures.js';
import {commercialFallbackCampaign,finalLossCampaign} from './chapter-polish-fixtures.js';
import {tradeCampaign} from './trade-fixtures.js';
import {commit} from './m2-fixtures.js';
import {manual} from './collection07-fixtures.js';
const political=chapterCampaign(),commercial=commercialFallbackCampaign(),cooled=tradeCampaign({pressure:false}),lost=finalLossCampaign();
const final=political.state.narrative.chapters.at(-1),coda='CH08-FINAL-GRIEVANCE';
const inspect=s=>inspectChapterCandidates(s,s.turn);

test('all six fallback replacements and the coda preserve exact approved complete passages',()=>{
 const source=fs.readFileSync(new URL('../docs/narrative/writing/chapter-fallback-polish.md',import.meta.url),'utf8');
 const ids=['CH08-FACT-ADMIN-CONTINUED','CH08-FACT-TRADE-OPEN','CH08-FACT-TRADE-CONTINUED','CH08-FACT-RESTORED','CH08-FACT-TRADE-RECLOSED','CH08-FACT-LOSS',coda];
 for(const id of ids){const section=source.split('## '+id+' — ')[1].split('\n## ')[0];assert.equal(CHAPTER_TEMPLATES[id].text,section.split(/\r?\n/).filter(l=>l.startsWith('> ')).map(l=>l.slice(2)).join('\n'));}
 for(const s of [political.state,commercial.state,lost.state])for(const c of s.narrative.chapters)for(const t of c.threads)assert.equal(t.text,fillChapter(CHAPTER_TEMPLATES[t.templateId].text,t.parameters));
});

test('commercial fallbacks distinguish baseline restoration, earlier interruption, same-turn recovery and actual loss',()=>{
 const ids=commercial.state.narrative.chapters.map(c=>c.threads[0]?.templateId);
 assert.deepEqual(ids,['CH08-FACT-RESTORED','CH08-FACT-TRADE-CONTINUED','CH08-FACT-TRADE-OPEN',undefined,'CH08-FACT-LOSS']);
 const c=commercial.state.narrative.chapters[1],t=c.threads[0];assert.equal(t.parameters.contextTurn,1);assert.equal(t.endState.available,true);
 assert(c.evidence.some(r=>commercial.state.history.find(h=>h.incident.id===r.incidentId).turn===1));
 const s=clone(commercial.states.find(s=>s.narrative.chapters.length===2));s.regions.bombay.orders[t.parameters.orderId]=false;
 assert(!inspectChapterCandidates(s,2,c.closureIncidentId).candidates.some(t=>t.templateId==='CH08-FACT-TRADE-CONTINUED'));
});

test('final coda requires original earlier-turn personal loss, current grievance and actual ending possession',()=>{
 const t=final.threads[0];assert.equal(t.templateId,coda);assert.equal(t.parameters.characterId,'ruler-bombay');assert.equal(final.ending,true);
 assert.equal(t.text,'The campaign ended with the Company still holding Bombay. Madhav of Bombay’s grievance had outlived the conquest that made it. The chronicler could record possession. Agreement was another matter.');
 assert(t.memoryIds.length&&t.lineIds.length&&t.reasonRefs.length);assert.equal(t.endState.control,'company');
 assert(final.evidence.every(ref=>political.state.history.find(h=>h.incident.id===ref.incidentId)));validate(political.state);
});

test('coda is withheld for cooled personal experience and real final loss, preserving quiet endings',()=>{
 assert.equal(cooled.state.narrative.chapters.at(-1).status,'quiet');assert.equal(cooled.state.regions.bombay.control,'company');
 assert(inspect(cooled.state).rejections.some(r=>r.templateId===coda&&r.region==='bombay'&&r.reason.includes('cooled grievance')));
 assert.equal(lost.state.regions.bombay.control,'indian');assert(!lost.state.narrative.chapters.at(-1).threads.some(t=>t.templateId===coda));
 assert(inspect(lost.state).rejections.some(r=>r.templateId===coda&&r.region==='bombay'&&r.reason.includes('does not hold')));
});

test('missing identity, successor ownership, unsupported reassessment and absent personal cause cannot enable a coda',()=>{
 const mutations=[
  (s,m)=>{m.ownerId='heir-bombay';},
  (s,m)=>{m.origin='indirect';},
  (s,m)=>{m.perspective='sovereign';},
  (s,m)=>{m.evidence=[];},
  (s,m)=>{m.emotionalImportance=0;},
  (s,m)=>{m.currentAssessment={kind:'opinion',text:'I consider the grievance settled.',incidentId:m.createdIncident,evidence:m.evidence};},
  (s,m)=>{s.history.find(h=>h.incident.id===m.createdIncident).narrative.lines=s.history.find(h=>h.incident.id===m.createdIncident).narrative.lines.filter(l=>l.speakerId!==m.ownerId);},
  (s,m)=>{s.history.find(h=>h.incident.id===m.createdIncident).turn=s.turn;},
  (s,m)=>{s.narrative.characters[m.ownerId].relations['institution:company'].causes=s.narrative.characters[m.ownerId].relations['institution:company'].causes.filter(c=>!c.memoryIds.includes(m.id));},
  (s,m)=>{for(const c of s.narrative.characters[m.ownerId].relations['institution:company'].causes)c.deltas.hostility=0;}
 ];
 for(const mutate of mutations){const s=clone(political.state),m=s.narrative.memories[final.memoryIds[0]];mutate(s,m);assert(!inspect(s).candidates.some(t=>t.templateId===coda));}
 const ordinary=political.states.find(s=>s.narrative.chapters.length===4);assert(!inspect(ordinary).candidates.some(t=>t.templateId===coda));
});

test('coda uses the existing pacing budget, suppresses the same regional thought and cannot repeat',()=>{
 for(const s of [political.state,lost.state,commercial.state,cooled.state])for(const c of s.narrative.chapters){assert(c.threads.length<=2);assert(c.threads.reduce((n,t)=>n+t.paragraphs,0)<=2);assert(c.threads.filter(t=>t.templateId===coda).length<=1);}
 assert.equal(final.threads.length,1);assert.equal(political.state.narrative.chapters.filter(c=>c.threads.some(t=>t.templateId===coda)).length,1);
 assert.equal(political.state.narrative.chapters[3].status,'quiet');
});

test('an eligible final coda replaces a same-region failed-rebellion reflection instead of repeating its grievance',()=>{
 const cut=political.states.findIndex(s=>s.turn===5&&s.history.at(-1)?.actionType==='phase-start')-1;
 let s=commit(political.states[cut],{type:'unrest',region:'bombay',reason:'failure'});
 s=commit(s,manual('leader','bombay',{defenses:{leader:1}}));
 for(const input of political.inputs.slice(cut))s=commit(s,clone(input));
 assert(inspect(s).rejections.some(r=>r.templateId==='CH08-04-FACTUAL'&&r.reason.includes('already saved')));
 assert.deepEqual(s.narrative.chapters.at(-1).threads.map(t=>t.templateId),[coda]);
});

test('fallbacks and final coda persist exactly through save/load and persisted Undo/Redo without RNG draws',()=>{
 const before=political.states.at(-2),after=political.state;
 assert.equal(after.narrative.rng,before.narrative.rng);
 const undone=undoFrame(after,null,[before],[null],[]),saved=decode(encode(undone.state,undone.undo,undone.progress,undone.undoProgress,undone.redo));
 assert.deepEqual(redoFrame(saved.state,saved.progress,saved.undo,saved.undoProgress,saved.redo).state,after);
 for(const s of [after,commercial.state,cooled.state,lost.state])assert.deepEqual(decode(encode(s)).state,s);
 const forged=clone(after);forged.narrative.chapters.at(-1).threads[0].parameters.characterId='heir-bombay';assert.throws(()=>validate(forged),/Invalid narrative/);
});

test('new fallback sequences preserve every gameplay report, instruction, RNG and actual state narrative-on/off',()=>{
 const mechanical=s=>{const out=clone(s);delete out.narrative;if(out.gameEnd)delete out.gameEnd.at;for(const h of out.history){delete h.narrative;delete h.at;}return out;};
 for(const f of [commercial,lost]){let off=clone(f.states[0]);delete off.narrative;for(const [i,input] of f.inputs.entries()){off=(input.type==='deploy'?resolveDeployment:resolveAction)(off,input).state;assert.deepEqual(mechanical(off),mechanical(f.states[i+1]));}}
});
