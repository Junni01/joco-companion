import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {POLISH_DIALOGUE} from '../dist/narrative-polish-content.js';
import {politicalPosture} from '../dist/narrative-posture.js';
import {approvedById,approvedCandidates} from '../dist/narrative-approved.js';
import {clone,decode,encode,validate,resolveDeployment} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {profileHTML,sceneHTML} from '../dist/narrative-ui.js';
import {commit,narrativeState,deployment,storySequence} from './m2-fixtures.js';
import {makeCampaign,manual} from './collection07-fixtures.js';
const ordinary=makeCampaign(),cautious=makeCampaign({profile:'cautious'}),evolving=makeCampaign({profile:'vindictive',evolving:true});
const lines=s=>s.history.at(-1)?.narrative?.lines||[];
const allLines=s=>s.history.flatMap(h=>h.narrative?.lines||[]);
const target='ruler-bombay';
const context=s=>({region:'bombay',major:false});

test('Collection 07 preserves every integrated exact line and expression from the approved headings',()=>{
 const source=fs.readFileSync(new URL('../docs/narrative/writing/fallback-dialogue-polish.md',import.meta.url),'utf8');
 assert.equal(POLISH_DIALOGUE.length,19);
 for(const e of POLISH_DIALOGUE){const block=source.split('### '+e.id+' — ')[1].split('\n### ')[0];assert(block,e.id);
  assert.equal(e.text,block.match(/^- \*\*Exact text:\*\* (.+)$/m)[1]);assert.equal(e.emotion,block.match(/^- \*\*Expression:\*\* (.+)$/m)[1].replace(/\.$/,''));
 }
 for(const id of ['FB07-TAX-SEC-02','FB07-ADM-RUL-02','FB07-MIL-RUL-02','FB07-REB-RUL-03'])assert(!approvedById.has(id));
});

test('hostile rulers do not gain automatic gratitude or relief when Company suppresses rebellion',()=>{
 const i=ordinary.states.findIndex(s=>s.history.at(-1)?.incident?.facts.some(f=>f.kind==='company-defence'&&f.key==='leader'));
 const before=ordinary.states[i-1],after=ordinary.states[i],entry=after.history.at(-1);
 assert.equal(politicalPosture(before,target,'bombay').kind,'hostile');
 const memory=Object.values(after.narrative.memories).find(m=>m.ownerId===target&&m.createdIncident===entry.incident.id&&m.category==='company-defence');
 assert.equal(memory.emotion,'resentment');assert.equal(after.narrative.characters[target].relations['institution:company'].gratitude,before.narrative.characters[target].relations['institution:company'].gratitude);
 const line=lines(after).find(l=>l.speakerId===target);assert(['FB07-DEF-RUL-01','FB07-REB-RUL-01','FB07-DEF-RUL-02'].includes(line.templateId));assert(line.selectionEvidence.length);assert(!/relie|satisf/i.test(line.emotion));
});

test('core loyalty and starting Company control alone do not establish Company alignment',()=>{
 const s=narrativeState('1813');s.narrative.characters[target].traits.loyalty=100;
 assert.equal(politicalPosture(s,target,'bombay').kind,'ambiguous');
 const defended=commit(s,manual('leader','bombay',{defenses:{leader:100}}));
 assert(!lines(defended).some(l=>l.templateId==='FB07-DEF-RUL-03'||l.templateId==='ruler-defence-1'));
 const memory=Object.values(defended.narrative.memories).find(m=>m.ownerId===target&&m.category==='company-defence');assert.equal(memory.emotion,'uncertainty');assert(!defended.narrative.characters[target].relations['institution:company']);
});

test('beneficial experiences can change posture without erasing conquest or adding permanent attributes',()=>{
 const phases=evolving.states.map(s=>politicalPosture(s,target,'bombay').kind);assert(phases.includes('hostile'));assert.equal(phases.at(-1),'aligned');
 const aligned=allLines(evolving.state).find(l=>l.templateId==='FB07-DEF-RUL-03');assert(aligned);assert(aligned.selectionEvidence.length>1);
 assert(Object.values(evolving.state.narrative.memories).some(m=>m.ownerId===target&&m.category==='company-conquest'));
 assert(!Object.hasOwn(evolving.state.narrative.characters[target],'alignment'));assert(!Object.hasOwn(evolving.state.narrative.characters[target],'posture'));
 assert.deepEqual(decode(encode(evolving.state)).state,evolving.state);
});

test('cautious rulers can lament an actual repeated rebellion defeat without claiming personal command',()=>{
 const line=allLines(cautious.state).find(l=>l.templateId==='FB07-DEF-RUL-02');assert(line);assert(line.callbackMemoryIds.length);
 const source=cautious.state.narrative.memories[line.callbackMemoryIds[0]];assert(['company-conquest','company-defence'].includes(source.category));assert.equal(source.ownerId,target);
 const h=cautious.state.history.find(h=>h.incident.id===line.incidentId);assert(h.incident.facts.some(f=>f.kind==='company-defence'&&f.won&&f.key==='leader'));
});

test('repelled invasions and simple interventions never activate failed-rebellion claims',()=>{
 let s=commit(narrativeState(),{type:'deploy',...deployment()});s=commit(s,{type:'unrest',region:'bombay',reason:'failure'});
 const invasion=commit(s,manual('foreign','delhi',{storm:'west',rolls:{bombay:5},defenses:{'foreign:bombay':100}}));
 assert(!lines(invasion).some(l=>['FB07-DEF-RUL-02','FB07-REB-RUL-01','FB07-REB-RUL-02'].includes(l.templateId)));
 const restored=commit(s,{type:'deploy',...deployment()});assert(!lines(restored).some(l=>l.templateId.startsWith('FB07-DEF')||l.templateId.startsWith('FB07-REB')));
});

test('another defeat and earlier conquest callbacks require their actual preceding sources',()=>{
 const fresh=narrativeState('1813');const defended=commit(fresh,manual('leader','bombay',{defenses:{leader:100}}));
 assert(!lines(defended).some(l=>['FB07-DEF-RUL-02','FB07-REB-RUL-01','FB07-REB-RUL-02'].includes(l.templateId)));
 const admin=commit(fresh,{type:'govern',outcome:'failure',sixes:0});assert(!lines(admin).some(l=>l.templateId==='FB07-ADM-RUL-01'));
 let conquered=commit(narrativeState(),{type:'deploy',...deployment()});conquered=commit(conquered,{type:'unrest',region:'bombay',reason:'failure'});
 const approved=lines(conquered).find(l=>l.templateId==='FB07-ADM-RUL-01');assert(approved);assert(approved.callbackMemoryIds.length);
});

test('short chronicler satire is excluded for large or catastrophic administration',()=>{
 const s=narrativeState('1813'),n=commit(s,{type:'govern',outcome:'catastrophe',sixes:3});
 assert(!lines(n).some(l=>l.templateId==='FB07-CH-ADM-01'));
 const routine=ordinary.state.history.find(h=>h.narrative?.lines.some(l=>l.templateId==='FB07-CH-ADM-01'));assert(routine);assert.equal(routine.incident.input.reason,'failure');
});

test('new ordinary scenes do not emit retired data narration and retain brief optional presentation',()=>{
 const retired=['secretary-tax-1','army-loss-1','army-deploy-failure-1','secretary-admin-1','ruler-defence-1','m2-admin-2','m2-secretary-tax-2','m2-secretary-admin-2'];
 for(const fixture of [ordinary,cautious,evolving])for(const line of allLines(fixture.state)){
  assert(!retired.includes(line.templateId));if(line.speakerId!=='chronicler')assert(!/physical table|physical reports|recorded result|Tax has been recorded/.test(line.text));
 }
 const saved=clone(ordinary.state);profileHTML(saved,target);sceneHTML(saved.history.at(-2).narrative,{intensity:'standard'});assert.deepEqual(saved,ordinary.state);
 assert(ordinary.state.history.filter(h=>h.actionType==='next-turn').every(h=>h.narrative.lines.length===1));
});

test('multi-turn fixtures use real stack phases, correct age progression, callbacks and thematic chapters',()=>{
 for(const f of [ordinary,cautious,evolving]){
  assert.equal(f.state.turn,5);assert.equal(f.state.narrative.chapters.length,5);assert.equal(f.state.narrative.characters[target].age,f.states[0].narrative.characters[target].age+12);
  assert.equal(f.inputs.filter(d=>d.type==='stack-draw').length,5);assert.equal(f.inputs.filter(d=>d.type==='phase-finish').length,5);
  assert(f.state.narrative.chapters.every(c=>c.status==='quiet'?c.text==='':c.incidents.length>0&&c.text.length>0));assert(f.state.narrative.chapters.some(c=>c.text.includes('Company')));
  assert(f.state.history.some(h=>h.turn>=3&&h.narrative?.lines.some(l=>l.callbackMemoryIds.length)));
 }
 const first=ordinary.state.history.filter(h=>h.incident.facts.some(f=>f.kind==='company-defence'&&f.key==='leader'));
 assert(first.some(h=>h.incident.facts.some(f=>f.type==='company-loss')));assert(first.some(h=>h.incident.facts.some(f=>f.kind==='company-defence'&&f.won)));
});

test('multi-turn on/off mechanics equivalence and current-version persisted Undo/Redo retain exact political evidence',()=>{
 const strip=s=>{const c=clone(s);delete c.narrative;if(c.gameEnd)delete c.gameEnd.at;for(const h of c.history){delete h.narrative;delete h.at;}return c;};
 for(const fixture of [ordinary,evolving]){
  let off=clone(fixture.states[0]);delete off.narrative;
  fixture.inputs.forEach((d,i)=>{off=(d.type==='deploy'?resolveDeployment(off,d):resolveAction(off,d)).state;assert.deepEqual(strip(off),strip(fixture.states[i+1]));});
 }
 const at=evolving.states.findIndex(s=>lines(s).some(l=>l.templateId==='FB07-DEF-RUL-03')),after=evolving.states[at],before=evolving.states[at-1];
 const undone=undoFrame(after,null,[before],[null],[]),stored=decode(encode(undone.state,undone.undo,undone.progress,undone.undoProgress,undone.redo));
 assert.deepEqual(redoFrame(stored.state,stored.progress,stored.undo,stored.undoProgress,stored.redo).state,after);
});

test('historical stance validates after later reconciliation; edited wording or political evidence is rejected',()=>{
 assert.doesNotThrow(()=>validate(evolving.state));
 const edited=clone(evolving.state),line=allLines(edited).find(l=>l.templateId==='FB07-DEF-RUL-03');line.selectionEvidence=[];assert.throws(()=>validate(edited),/political selection evidence/);
 const words=clone(ordinary.state),l=allLines(words).find(l=>l.templateId.startsWith('FB07'));l.text+=' changed';assert.throws(()=>validate(words),/Invalid narrative/);
});

test('first-tax and careerist alternatives require matching events and voices',()=>{
 let s=narrativeState('1813');s.narrative.characters[target].traits.pride=90;s.narrative.characters[target].voice.restraint=3;
 const taxed=commit(s,{type:'tax',region:'bombay'});assert(lines(taxed).some(l=>l.templateId==='FB07-TAX-RUL-01'));
 s=narrativeState();const officer=s.narrative.characters['army-bombay'];officer.traits.ambition=90;officer.traits.caution=20;
 const failed=commit(s,{type:'deploy',...deployment('bombay',{outcome:'failure'})});assert(lines(failed).some(l=>l.templateId==='FB07-MIL-ARM-02'));
 let conquered=commit(s,{type:'deploy',...deployment()});conquered=commit(conquered,{type:'unrest',region:'bombay',reason:'failure'});
 const lost=commit(conquered,manual('leader','bombay',{defenses:{leader:0},officerRouts:{bombay:0}}));assert(lines(lost).some(l=>l.templateId==='FB07-LOSS-ARM-02'));
});

test('stunned loss requires actual earlier overconfidence, not a newly assigned proud trait',()=>{
 let s=narrativeState(),c=s.narrative.characters['army-bombay'];for(const k of Object.keys(c.traits))c.traits[k]=20;c.traits.pride=90;c.voice={formality:1,humour:0,restraint:1,directness:2};
 s=commit(s,{type:'deploy',...deployment()});assert(lines(s).some(l=>['AC-C03','AD-M04-07'].includes(l.templateId)));
 s=commit(s,{type:'unrest',region:'bombay',reason:'failure'});s=commit(s,manual('leader','bombay',{defenses:{leader:0},officerRouts:{bombay:0}}));
 const surprised=lines(s).find(l=>l.templateId==='FB07-LOSS-ARM-03');assert(surprised);assert(surprised.selectionEvidence.length);
 let fresh=narrativeState('1813');fresh.narrative.characters['army-bombay'].traits.pride=90;fresh=commit(fresh,{type:'tax',region:'bombay'});fresh=commit(fresh,manual('leader','bombay',{defenses:{leader:0},officerRouts:{bombay:0}}));
 assert(!lines(fresh).some(l=>l.templateId==='FB07-LOSS-ARM-03'));
});

test('Indian-subject reassessment needs an actual earlier local defeat',()=>{
 let s=narrativeState();s.narrative.characters['ruler-punjab'].traits.caution=90;
 s=commit(s,manual('leader','punjab',{modifier:-3}));assert(!lines(s).some(l=>l.templateId==='FB07-REB-RUL-02'));
 s=commit(s,manual('leader','punjab',{modifier:-3}));assert(lines(s).some(l=>l.templateId==='FB07-REB-RUL-02'));
});

test('Collection 07 template cooldowns count relevant incidents across real turn boundaries',()=>{
 for(const fixture of [ordinary,cautious,evolving]){
  const seen=new Map();fixture.state.history.forEach((h,i)=>{for(const l of h.narrative?.lines||[]){
   if(l.speakerId==='chronicler'||!l.templateId.startsWith('FB07-'))continue;
   const key=l.speakerId+'/'+l.templateId,at=fixture.states[i+1].narrative.characters[l.speakerId].pacing.relevant;
   if(seen.has(key))assert(at-seen.get(key)>=3,key);seen.set(key,at);
  }});
 }
});
