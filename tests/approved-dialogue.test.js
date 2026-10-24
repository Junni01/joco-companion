import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {APPROVED_DIALOGUE} from '../dist/narrative-approved-content.js';
import {approvedCandidates,approvedById} from '../dist/narrative-approved.js';
import {clone,encode,decode,validate,resolveDeployment} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {profileHTML,sceneHTML} from '../dist/narrative-ui.js';
import {storySequence,narrativeState,commit,deployment} from './m2-fixtures.js';
const scene=s=>s.history.at(-1).narrative;
const eligible=(original,role='ruler',region='bombay')=>{const s=clone(original),c=s.narrative.characters[role==='ruler'?'ruler-'+region:role+'-bombay'];c.pacing.templates=[];return approvedCandidates(s,s.history.at(-1),c,{region,major:false},role).map(x=>x.entry.id);};
function persona(s,id,trait){const c=s.narrative.characters[id];for(const k of Object.keys(c.traits))c.traits[k]=20;c.traits[trait]=90;c.voice={formality:1,directness:2,restraint:1,humour:1};return s;}
const event=patch=>({type:'event',event:'leader',manualTest:true,topRegion:'bombay',shape:'circle',redirectShape:'circle',modifier:0,...patch});

test('every integrated catalogue entry exactly matches its approved source wording and expression',()=>{
 assert.equal(new Set(APPROVED_DIALOGUE.map(e=>e.id)).size,APPROVED_DIALOGUE.length);
 for(const e of APPROVED_DIALOGUE){
  const source=fs.readFileSync(new URL('../docs/narrative/writing/'+e.source,import.meta.url),'utf8');
  const row=source.split(/\r?\n/).find(l=>l.startsWith('| '+e.id+' |'));
  assert(row,e.id);const cells=row.split('|').slice(1,-1).map(s=>s.trim());
  assert.equal(e.text,cells[3],e.id);assert.equal(e.emotion,cells[2],e.id);
 }
});

test('approved conquest voices respond to personality without changing the committed outcome',()=>{
 const profiles=[['pride',['RC-P01','RU-M04-05']],['caution',['RC-D01','RC-D02']],['vindictiveness',['RC-V01','RC-V02']]];
 for(const [trait,ids] of profiles){const s=persona(narrativeState(),'ruler-bombay',trait),next=commit(s,{type:'deploy',...deployment()});
  const l=scene(next).lines.find(l=>l.speakerId==='ruler-bombay');assert(ids.includes(l.templateId),`${trait}: ${l.templateId}`);
  assert.equal(l.text,approvedById.get(l.templateId).text);assert.equal(next.regions.bombay.control,'company');
 }
});

test('conquest grievance leads to an exact approved callback with inspectable source evidence',()=>{
 const {states,target}=storySequence(),s=states[2],l=scene(s).lines.find(l=>l.speakerId==='ruler-'+target);
 assert(approvedById.has(l.templateId));assert.equal(l.callbackMemoryIds.length,1);
 const m=s.narrative.memories[l.callbackMemoryIds[0]];assert.equal(m.category,'company-conquest');assert.equal(m.origin,'direct');assert.equal(m.createdIncident,states[1].history.at(-1).incident.id);
 assert(l.evidence.every(r=>r.incidentId===s.history.at(-1).incident.id));assert.equal(l.text,approvedById.get(l.templateId).text);
 const html=profileHTML(s,l.speakerId);assert(html.includes('Saved words and their evidence'));assert(html.includes(l.templateId));assert(html.includes(m.createdIncident));
 assert.deepEqual(decode(encode(s)).state,s);
});

test('current relationships gate bitterness and reconciliation does not delete the source memory',()=>{
 const s=persona(narrativeState(),'ruler-bombay','loyalty');let occupied=commit(s,{type:'deploy',...deployment()});
 const demanded=commit(occupied,{type:'tax',region:'bombay'});assert(scene(demanded).lines.some(l=>['CB-C-TAX-01','CB-T02-03'].includes(l.templateId)));
 occupied=commit(occupied,{type:'unrest',region:'bombay',reason:'failure'});
 occupied=commit(occupied,{type:'deploy',...deployment()});occupied=commit(occupied,{type:'unrest',region:'bombay',reason:'failure'});occupied=commit(occupied,{type:'deploy',...deployment()});
 const cooler=commit(occupied,{type:'tax',region:'bombay'});assert(!eligible(cooler).includes('CB-C-TAX-01'));assert(Object.values(cooler.narrative.memories).some(m=>m.ownerId==='ruler-bombay'&&m.category==='company-conquest'));
});

test('scenario starting Company control never supplies an invented earlier conquest',()=>{
 const s=commit(narrativeState('1813'),{type:'tax',region:'bombay'});
 assert(!scene(s).lines.some(l=>l.callbackMemoryIds.some(id=>s.narrative.memories[id].category==='company-conquest')));
 assert(!eligible(s).some(id=>['CB-C-TAX-01','CB-C-TAX-02','CB-C-TAX-03','CB-T02-03','RU-T02-02'].includes(id)));
});

test('unrest, genuine administrative failure and failed military deployments stay distinct',()=>{
 let s=commit(narrativeState(),{type:'deploy',...deployment()});
 const taxed=commit(s,{type:'tax',region:'bombay'});assert(!eligible(taxed,'secretary').includes('AD-T02-03'));
 const failed=commit(s,{type:'unrest',region:'bombay',reason:'failure'});assert(failed.history.at(-1).incident.facts.some(f=>f.reason==='failure'));
 assert(!eligible(failed,'army').some(id=>id.startsWith('AD-M04')));assert(!scene(failed).lines.some(l=>l.templateId==='CH-R03-02'));
 const ordinary=commit(narrativeState(),{type:'deploy',...deployment('bombay',{outcome:'failure'})});
 const catastrophic=commit(narrativeState(),{type:'deploy',...deployment('bombay',{outcome:'catastrophe',losses:1})});
 assert.equal(scene(ordinary).lines[0].templateId,'CH-M04-01');assert.equal(scene(catastrophic).lines[0].templateId,'CH-M04-02');
 assert(!eligible(ordinary,'army').includes('AD-M04-04'));assert(!eligible(catastrophic,'army').includes('AD-M04-03'));
});

test('Company rebellion success and suppression are distinguished from invasions and ordinary unrest',()=>{
 let occupied=commit(narrativeState(),{type:'deploy',...deployment()});occupied=commit(occupied,{type:'unrest',region:'bombay',reason:'failure'});
 const freed=commit(occupied,event({defenses:{leader:0},officerRouts:{bombay:0}}));
 assert.equal(freed.regions.bombay.control,'indian');assert(freed.history.at(-1).incident.facts.some(f=>f.type==='company-loss'));
 assert(scene(freed).lines.some(l=>l.templateId==='CB-R03-01'||l.templateId==='CB-C-REB-03'||l.templateId==='RU-R03-06'));
 const held=commit(occupied,event({defenses:{leader:100}}));assert.equal(held.regions.bombay.control,'company');assert(!scene(held).lines.some(l=>l.templateId==='CH-R03-02'));
 const invasion=commit(occupied,{...event({event:'foreign',storm:'west',rolls:{bombay:5},defenses:{'foreign:bombay':0},officerRouts:{bombay:0}})});
 assert(!scene(invasion).lines.some(l=>['CB-R03-01','CB-C-REB-03','CH-R03-02','RU-R03-06'].includes(l.templateId)));
});

test('memory callbacks obey source cooldown even when another approved wording is available',()=>{
 let s=commit(narrativeState(),{type:'deploy',...deployment()});s=commit(s,{type:'tax',region:'bombay'});
 const first=scene(s).lines.find(l=>l.speakerId==='ruler-bombay');assert(first.callbackMemoryIds.length);
 s=commit(s,{type:'tax',region:'bombay'});assert(!scene(s).lines.some(l=>l.callbackMemoryIds.includes(first.callbackMemoryIds[0])));
});

test('selected approved words and callback evidence survive saved Undo/Redo; abandoned branches disappear',()=>{
 const {states}=storySequence(),before=states[1],after=states[2];
 const undone=undoFrame(after,null,[before],[null],[]),saved=decode(encode(undone.state,undone.undo,undone.progress,undone.undoProgress,undone.redo));
 const restored=redoFrame(saved.state,saved.progress,saved.undo,saved.undoProgress,saved.redo);assert.deepEqual(restored.state,after);
 const alternative=commit(saved.state,{type:'unrest',region:'bombay',reason:'failure'});assert(!alternative.history.some(h=>h.actionType==='tax'));assert(!scene(alternative).lines.some(l=>l.templateId.startsWith('CB-C-TAX')));
});

test('on/off gameplay equivalence covers the whole approved dialogue loop in all four scenarios',()=>{
 const mechanics=s=>{const x=clone(s);delete x.narrative;for(const h of x.history){delete h.narrative;delete h.at;}return x;};
 for(const scenario of ['1710','1758','1813','1710-long']){
  const {states,inputs}=storySequence(scenario);let off=clone(states[0]);delete off.narrative;
  inputs.forEach((d,i)=>{off=(d.type==='deploy'?resolveDeployment(off,d):resolveAction(off,d)).state;assert.deepEqual(mechanics(states[i+1]),mechanics(off));});
 }
});

test('malformed approved wording, false triggers and wrong branch evidence are rejected',()=>{
 const {states}=storySequence();const good=states[2];
 for(const mutate of [
  l=>{l.text+=' Invented words.';},
  l=>{l.templateId='CH-M04-02';l.text=approvedById.get(l.templateId).text;l.emotion=approvedById.get(l.templateId).emotion;},
  l=>{l.evidence[0].incidentId=states[1].history.at(-1).incident.id;},
  l=>{l.callbackMemoryIds=[];}
 ]){const bad=clone(good),l=scene(bad).lines.find(l=>l.speakerId==='ruler-bombay');mutate(l);assert.throws(()=>validate(bad),/Invalid narrative/);}
});

test('standard scenes stay brief and expansion/rendering never selects additional speech',()=>{
 const s=storySequence().state,original=clone(s),html=sceneHTML(scene(s),{intensity:'standard'});
 assert((html.split('<blockquote').length-1)<=3||html.includes('<details'));
 profileHTML(s,'ruler-bombay');sceneHTML(scene(s),{intensity:'full'});assert.deepEqual(s,original);
 assert(!APPROVED_DIALOGUE.some(e=>e.id.startsWith('EX-')||e.source.includes('dynasties')));
});

test('unsupported reforms, petitions, casualties, promises, careers and whole scenes stay withheld',()=>{
 for(const id of ['CH-T02-01','RU-T02-03','EX-T02-02','EX-T02-03','AD-M04-06','RU-M04-04','CH-M04-03','RV-M04-07','RV-M04-08','EX-M04-02','CB-C-REB-01','CB-C-REB-02'])assert(!approvedById.has(id));
});
