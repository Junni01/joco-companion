import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CHAPTER_TEMPLATES} from '../dist/narrative-chapter-content.js';
import {composeChapter,inspectChapterCandidates,chapterView} from '../dist/narrative-chapters.js';
import {clone,validate,encode,decode,resolveDeployment} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {commitNarrative} from '../dist/narrative.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {chaptersHTML} from '../dist/narrative-ui.js';
import {tradeCampaign} from './trade-fixtures.js';
import {chapterCampaign} from './chapter-fixtures.js';
import {commit,deployment} from './m2-fixtures.js';
import {manual} from './collection07-fixtures.js';
const governance=chapterCampaign(),trade=tradeCampaign(),cooperation=tradeCampaign({pressure:false});
const first=governance.states[governance.boundaries[0]+1],commercial=trade.states.find(s=>s.narrative.chapters.length===1);
const chapter=s=>s.narrative.chapters.at(-1);
const inspect=(s,c=chapter(s))=>inspectChapterCandidates(s,c.turn,c.closureIncidentId);

test('active reference prose and permitted omissions preserve approved wording',()=>{
 const source=fs.readFileSync(new URL('../docs/narrative/writing/thematic-chapters.md',import.meta.url),'utf8');
 const passage=id=>source.split('## '+id+' — ')[1].split('\n## ')[0].split(/\r?\n/).filter(l=>l.startsWith('>')).map(l=>l.replace(/^> ?/,'')).join('\n').replaceAll('Bombay','{region}').replaceAll('Madhav','{person}').replaceAll('Mr. Hale','{person}');
 assert.equal(CHAPTER_TEMPLATES['CH08-01'].text,passage('CH08-01'));assert.equal(CHAPTER_TEMPLATES['CH08-02'].text,passage('CH08-02'));
 assert.equal(CHAPTER_TEMPLATES['CH08-04-FACTUAL'].text,passage('CH08-04').replace('He had allowed himself to hope for a different result. ',''));
 assert.equal(CHAPTER_TEMPLATES['CH08-01-FACTUAL'].text,passage('CH08-01').replace('{person}, who had lost the region to the Company, found little reason to revise his opinion after an unsuccessful attempt at administration. ',''));
});

test('ordered conquest, Tax, administration, owned grievance and personal reason support the complete first passage',()=>{
 const c=chapter(first),t=c.threads[0];assert.equal(t.templateId,'CH08-01');assert.equal(t.parameters.characterId,'ruler-bombay');assert(t.memoryIds.length>=2);assert(t.reasonRefs.length);assert(t.lineIds.length);
 assert.equal(t.endState.control,'company');assert(c.evidence.some(ref=>first.history.find(h=>h.incident.id===ref.incidentId).incident.facts[Number(ref.factKey.slice(5))].type==='tax'));
 assert(!/Administration and its replies|Army of .*;/.test(c.text));assert.equal(first.narrative.rng,governance.states[governance.boundaries[0]].narrative.rng);
});

test('missing personal assessment selects the expressly permitted factual omission',()=>{
 const s=clone(first),t=chapter(s).threads[0],assessment=s.narrative.memories[t.memoryIds.find(id=>s.narrative.memories[id].category==='administration')];
 delete s.narrative.memories[assessment.id];s.narrative.characters[assessment.ownerId].memoryIds=s.narrative.characters[assessment.ownerId].memoryIds.filter(id=>id!==assessment.id);
 for(const r of Object.values(s.narrative.characters[assessment.ownerId].relations))for(const c of r.causes)c.memoryIds=c.memoryIds.filter(id=>id!==assessment.id);
 const selected=composeChapter(s,1,false,chapter(s).closureIncidentId);assert.equal(selected.threads[0].templateId,'CH08-01-FACTUAL');assert(!selected.text.includes(t.parameters.person));
 assert(inspect(s).rejections.some(r=>r.templateId==='CH08-01'&&r.reason.includes('personal assessment')));
});

test('display titles and instructions do not create or alter chapter facts',()=>{
 const s=clone(first),expected=chapter(s);for(const h of s.history){h.title='Invented treaty, payment and glorious victory';h.report='A made-up promise and a surrendered kingdom.';}
 assert.deepEqual(composeChapter(s,expected.turn,expected.ending,expected.closureIncidentId),expected);
});

test('wrong event order rejects the attractive governance passage',()=>{
 const s=clone(first),a=s.history.findIndex(h=>h.actionType==='tax'),b=s.history.findIndex(h=>h.actionType==='unrest');[s.history[a],s.history[b]]=[s.history[b],s.history[a]];
 assert(!inspect(s).candidates.some(t=>t.templateId==='CH08-01'));assert.throws(()=>validate(s),/Invalid narrative/);
});

test('a later Company loss before close rejects the held-region ending using real outcomes',()=>{
 let s=clone(governance.states[governance.boundaries[0]]);s=commit(s,manual('leader','bombay',{defenses:{leader:0},officerRouts:{bombay:0}}));s=commit(s,{type:'next-turn'});
 assert.equal(s.regions.bombay.control,'indian');assert(!chapter(s).threads.some(t=>t.templateId.startsWith('CH08-01')));assert(chapter(s).threads.some(t=>t.templateId==='CH08-FACT-LOSS'));
});

test('later losses or changed feelings never rewrite an earlier chapter end state',()=>{
 const old=clone(chapter(first));let s=commit(first,{type:'deploy',...deployment()});s=commit(s,{type:'unrest',region:'bombay',reason:'failure'});s=commit(s,manual('leader','bombay',{defenses:{leader:0},officerRouts:{bombay:0}}));
 validate(s);assert.deepEqual(s.narrative.chapters[0],old);const view=chapterView(s,old.closureIncidentId);assert.equal(view.regions.bombay.control,'company');assert.equal(s.regions.bombay.control,'indian');
});

test('the same secretary and same opportunity support the exact commercial reassessment passage',()=>{
 const t=chapter(commercial).threads.find(t=>t.templateId==='CH08-02');assert(t);assert.equal(t.parameters.characterId,'secretary-bombay');assert(t.parameters.orderId);assert.equal(t.lineIds.length,2);assert.equal(t.endState.available,true);
 const words=t.lineIds.map(id=>commercial.history.flatMap(h=>h.narrative?.lines||[]).find(l=>l.id===id));assert(words.every(l=>l.speakerId===t.parameters.characterId));assert(words[1].experienceLineIds.includes(words[0].id));
});

test('another secretary’s words or a missing hopeful source cannot supply private experience',()=>{
 for(const mutate of [
  s=>{const l=s.history.flatMap(h=>h.narrative?.lines||[]).find(l=>l.templateId==='TR08-REST-SEC-02');l.speakerId='secretary-madras';},
  s=>{const h=s.history.find(h=>h.narrative?.lines.some(l=>l.templateId==='TR08-REST-SEC-01'));h.narrative.lines=h.narrative.lines.filter(l=>l.templateId!=='TR08-REST-SEC-01');}
 ]){const s=clone(commercial);mutate(s);assert(!inspect(s).candidates.some(t=>t.templateId==='CH08-02'));}
});

test('renewed disruption after restoration rejects the available-at-close claim',()=>{
 const boundary=cooperation.states.findIndex(s=>s.history.at(-1)?.actionType==='next-turn');let s=clone(cooperation.states[boundary-1]);
 const opportunity=chapter(cooperation.states[boundary]).threads[0].parameters.orderId;
 while(s.regions.bombay.orders[opportunity])s=commit(s,manual('turmoil','bombay'));
 s=commit(s,{type:'next-turn'});assert(!chapter(s).threads.some(t=>t.templateId==='CH08-02'));assert(chapter(s).threads.some(t=>t.templateId==='CH08-FACT-TRADE-RECLOSED'));
});

test('an earlier-turn conquest is dated explicitly instead of being narrated as new',()=>{
 const c=governance.state.narrative.chapters[1];assert.equal(c.threads[0].templateId,'CH08-FACT-ADMIN-CONTINUED');assert(c.text.includes('in turn 1'));assert(c.text.includes('This turn'));assert(c.evidence.some(r=>r.incidentId===first.history[0].incident.id));
});

test('full protector and hopeful-rebellion references remain rejected when their personal prerequisites are absent',()=>{
 const c=cooperation.state.narrative.chapters[4],rejected=inspect(cooperation.state,c).rejections;assert(rejected.some(r=>r.templateId==='CH08-03'&&r.reason.includes('judgment valuing protection')));
 const defeat=governance.state.narrative.chapters[2];assert.equal(defeat.threads[0].templateId,'CH08-04-FACTUAL');assert(!defeat.text.includes('allowed himself to hope'));
 assert(inspect(governance.state,defeat).rejections.some(r=>r.templateId==='CH08-04'&&r.reason.includes('hope')));
});

test('repeated unchanged passages are suppressed and quiet turns do not fabricate a story',()=>{
 const texts=trade.state.narrative.chapters.flatMap(c=>c.threads.map(t=>t.text));assert.equal(texts.length,new Set(texts).size);
 const quiet=governance.state.narrative.chapters.filter(c=>c.status==='quiet');assert(quiet.length);assert(quiet.every(c=>c.text===''&&c.threads.length===0));assert(governance.state.history.length>governance.state.narrative.chapters.length);
});

test('changed identities, words, clauses, final state or source references cannot be imported as valid chapters',()=>{
 const mutations=[
  c=>c.threads[0].parameters.characterId='ruler-madras',c=>c.text+=' A fabricated promise.',c=>c.threads[0].clauses[0].evidence[0].factKey='fact-999',c=>c.threads[0].endState.control='indian',c=>c.closureIncidentId='not-a-boundary',c=>c.threads[0].lineIds=['wrong-person'],c=>{delete c.version;}
 ];
 for(const mutate of mutations){const s=clone(first);mutate(chapter(s));assert.throws(()=>validate(s),/Invalid narrative/);}
});

test('chapters render and export saved words/evidence without state changes or unsafe HTML',()=>{
 const s=clone(commercial),original=clone(s),html=chaptersHTML(s);assert(html.includes('Chapter evidence'));assert(html.includes('TR08')||html.includes('Saved words'));assert(html.includes('closing incident'));assert.deepEqual(s,original);
 s.narrative.chapters[0].title='<img src=x onerror=evil()>';assert(!chaptersHTML(s).includes('<img src=x'));assert(chaptersHTML(s).includes('&lt;img'));
});

test('08A ordinary scenes and independent narrative RNG remain exactly equal to the committed 08A review baseline',()=>{
 const previous=JSON.parse(fs.readFileSync(new URL('../docs/narrative/review/collection08a/hostile-military.json',import.meta.url),'utf8')).state;
 const events=s=>s.history.filter(h=>!['next-turn','end-game'].includes(h.actionType)).map(h=>h.narrative);
 assert.deepEqual(events(trade.state),events(previous));assert.equal(trade.state.narrative.rng,previous.narrative.rng);
});

test('current-version persistence and Undo/Redo reproduce exact chapters and a new branch drops the abandoned boundary',()=>{
 const before=governance.states[governance.boundaries[0]],after=first,frame=undoFrame(after,null,[before],[null],[]),saved=decode(encode(frame.state,frame.undo,frame.progress,frame.undoProgress,frame.redo));
 const redone=redoFrame(saved.state,saved.progress,saved.undo,saved.undoProgress,saved.redo);assert.deepEqual(redone.state,after);assert.deepEqual(decode(encode(governance.state)).state,governance.state);
 const alternative=commit(saved.state,manual('leader','bombay',{defenses:{leader:0},officerRouts:{bombay:0}}));assert.equal(alternative.narrative.chapters.length,0);
 const result=commitNarrative(before,{state:after});assert.deepEqual(result,after);
});

test('multi-turn chapter generation cannot alter gameplay, physical instructions or final age progression',()=>{
 const mechanics=s=>{const c=clone(s);delete c.narrative;if(c.gameEnd)delete c.gameEnd.at;for(const h of c.history){delete h.narrative;delete h.at;}return c;};
 let off=clone(governance.states[0]);delete off.narrative;
 governance.inputs.forEach((d,i)=>{const plain=d.type==='deploy'?resolveDeployment(off,d):resolveAction(off,d);off=plain.state;assert.deepEqual(mechanics(off),mechanics(governance.states[i+1]));});
 assert.equal(governance.state.narrative.chapters.length,5);assert.equal(governance.state.narrative.characters['ruler-bombay'].age,governance.states[0].narrative.characters['ruler-bombay'].age+12);
});

test('ordinary chapters select at most two connected threads and two paragraphs, rather than an event catalogue',()=>{
 let s=clone(governance.states[1]);s=commit(s,{type:'deploy',...deployment('hyderabad')});
 for(const input of governance.inputs.slice(3,governance.boundaries[0]+1))s=commit(s,clone(input));
 const c=chapter(s);assert.equal(c.threads.length,2);assert.equal(c.text.split('\n\n').length,2);assert(c.threads.every(t=>t.templateId==='CH08-FACT-CONTROL'));
 assert.equal(new Set(c.threads.map(t=>t.parameters.regionId)).size,2);assert.equal(c.title,'Changing Authority');
});

test('later qualified cooperation prevents an old adverse reason from being called the current unfavorable judgment',()=>{
 let s=clone(governance.states[3]); // Conquest, Tax and failed administration before the first phase.
 for(let i=0;i<8;i++){s=commit(s,manual('turmoil','bombay'));s=commit(s,{type:'deploy',...deployment()});}
 for(const input of governance.inputs.slice(3,governance.boundaries[0]+1))s=commit(s,clone(input));
 assert(!chapter(s).threads.some(t=>t.templateId==='CH08-01'));assert(inspect(s).rejections.some(r=>r.templateId==='CH08-01'&&r.reason.includes('personal assessment')));
});
