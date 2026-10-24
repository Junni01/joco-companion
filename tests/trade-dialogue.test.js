import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TRADE_DIALOGUE} from '../dist/narrative-trade-content.js';
import {tradeContexts,tradeExperience,selectTradeDialogue} from '../dist/narrative-trade.js';
import {initialState,resolveDeployment,validate,encode,decode,clone} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {profileHTML,sceneHTML} from '../dist/narrative-ui.js';
import {politicalPosture} from '../dist/narrative-posture.js';
import {narrativeState,commit,deployment} from './m2-fixtures.js';
import {manual} from './collection07-fixtures.js';
import {tradeCampaign} from './trade-fixtures.js';
const military=tradeCampaign(),diplomatic=tradeCampaign({kind:'diplomatic'}),procedural=tradeCampaign({profile:'procedural'});
const savedLines=s=>s.history.flatMap(h=>h.narrative?.lines||[]),latest=s=>s.history.at(-1)?.narrative?.lines||[];
const restored=s=>savedLines(s).filter(l=>l.speakerId==='secretary-bombay'&&['trade-military','trade-diplomacy'].includes(l.tradeKind));

test('08A entries preserve exact approved wording and exclude 08B and unsupported prerequisites',()=>{
 const source=fs.readFileSync(new URL('../docs/narrative/writing/commerce-and-chronicles.md',import.meta.url),'utf8');assert.equal(TRADE_DIALOGUE.length,20);
 for(const e of TRADE_DIALOGUE){const block=source.split('### '+e.id+' — ')[1].split('\n### ')[0];assert.equal(e.text,block.match(/^> (.+)$/m)[1],e.id);}
 for(const id of ['TR08-MIL-CH-01','TR08-MIL-RUL-02','TR08-REL-RUL-02'])assert(!TRADE_DIALOGUE.some(e=>e.id===id));
 assert(!TRADE_DIALOGUE.some(e=>/new masters had promised|Price of Prosperity/.test(e.text)));
});

test('first versus repeated disruption never invents an earlier closure',()=>{
 let s=commit(narrativeState(),manual('turmoil','bombay'));assert(!latest(s).some(l=>l.templateId==='TR08-DISR-CH-01'));
 assert(latest(s).some(l=>l.templateId.startsWith('TR08-DISR')));s=commit(s,manual('turmoil','bombay'));
 const l=latest(s).find(l=>l.templateId==='TR08-DISR-CH-01');assert(l);assert(l.selectionEvidence.length);assert(l.text.includes('Bombay'));
});

test('diplomacy requires actual Special Envoy opening, never conquest, military or a failed check',()=>{
 let s=commit(narrativeState(),manual('turmoil','bombay'));const order=Object.keys(s.regions.bombay.orders).find(o=>!s.regions.bombay.orders[o]);
 const failed=commit(s,{type:'envoy',purpose:'order',order,region:'bombay',outcome:'failure'});assert.equal(tradeContexts(failed,failed.history.at(-1)).length,0);
 const reopened=commit(s,{type:'envoy',purpose:'order',order,region:'bombay',outcome:'success'});assert(tradeContexts(reopened,reopened.history.at(-1)).every(c=>c.category==='trade-diplomacy'));
 assert(latest(reopened).some(l=>l.templateId.startsWith('TR08-DIPL')));assert(!latest(reopened).some(l=>l.templateId.startsWith('TR08-MIL')));
 const conquest=commit(s,{type:'deploy',...deployment()});assert(!latest(conquest).some(l=>l.tradeKind==='trade-military'));
});

test('military restoration requires an intervention with reopened commercial opportunity, not unrest alone',()=>{
 let s=commit(narrativeState(),{type:'deploy',...deployment()});s=commit(s,{type:'unrest',region:'bombay',reason:'failure'});
 const onlyUnrest=commit(s,{type:'deploy',...deployment()});assert(!latest(onlyUnrest).some(l=>l.tradeKind));
 s=commit(s,manual('turmoil','bombay'));const failed=commit(s,{type:'deploy',...deployment('bombay',{outcome:'failure'})});assert(!latest(failed).some(l=>l.tradeKind==='trade-military'));
 const restored=commit(s,{type:'deploy',...deployment()});assert(latest(restored).some(l=>l.tradeKind==='trade-military'));assert(!latest(restored).some(l=>l.templateId==='m2-assurance-orders'));
});

test('cascade dialogue requires an actual cascade and connected closures, not merely simultaneous disruption',()=>{
 let s=narrativeState();for(let i=0;i<2;i++)s=commit(s,manual('turmoil','bombay'));
 const cascaded=commit(s,manual('turmoil','bombay')),h=cascaded.history.at(-1);
 assert(h.incident.facts.some(f=>f.type==='trade-cascade'));assert(h.incident.facts.some(f=>f.type==='order-closed'&&f.cascadeFrom==='bombay'));
 assert(latest(cascaded).some(l=>l.templateId==='TR08-CASC-CH-01'));
 const ordinary=commit(narrativeState(),manual('turmoil','bombay'));assert(!latest(ordinary).some(l=>l.templateId.startsWith('TR08-CASC')));
 const malformed=clone(cascaded);for(const f of malformed.history.at(-1).incident.facts)if(f.type==='trade-cascade')f.type='unrelated';assert.throws(()=>validate(malformed),/Invalid narrative/);
});

test('same secretary changes interpretation across ten real restorations without repeating reassurance',()=>{
 const lines=restored(military.state),ids=lines.map(l=>l.templateId);assert.equal(military.inputs.filter(i=>i.type==='deploy').length,11);
 assert(ids.includes('TR08-REST-SEC-01'));assert(ids.includes('TR08-REST-SEC-02'));assert(ids.includes('TR08-REST-SEC-04'));assert.equal(new Set(ids).size,ids.length);
 assert.equal(savedLines(military.state).filter(l=>l.speakerId==='secretary-bombay'&&l.templateId==='m2-assurance-orders').length,0);
 const before=military.states[0].narrative.characters['secretary-bombay'],after=military.state.narrative.characters['secretary-bombay'];assert(after.confidence<before.confidence);assert.deepEqual(after.traits,before.traits);assert.equal(after.development.changes.length,0);
 assert(after.memoryIds.some(id=>military.state.narrative.memories[id].currentAssessment));assert.equal(military.state.narrative.chapters.length,5);
});

test('an earlier personal hope is saved exactly, without an invented audience, and later used as owned experience',()=>{
 const first=restored(military.state).find(l=>l.templateId==='TR08-REST-SEC-01'),later=restored(military.state).find(l=>l.templateId==='TR08-REST-SEC-02');assert(first&&later);
 assert.deepEqual(later.experienceLineIds,[first.id]);const s=military.state.narrative.statements[first.statementId];assert.equal(s.text,first.text);assert.deepEqual(s.audienceIds,[]);
 const html=profileHTML(military.state,'secretary-bombay');assert(html.includes('Earlier words by this character'));assert(html.includes('more cautious'));
 const changed=clone(military.state);savedLines(changed).find(l=>l.id===later.id).experienceLineIds=['future-or-other-person'];assert.throws(()=>validate(changed),/Invalid narrative/);
});

test('a different secretary cannot inherit the predecessor’s private repetition or hope',()=>{
 const position=military.checkpoints[5].index,after=clone(military.states[position+1]),entry=after.history.at(-1),ctx=tradeContexts(after,entry)[0];
 const original=after.narrative.characters['secretary-bombay'],replacement=clone(original);replacement.id='secretary-bombay-new-identity';replacement.name='New identity for isolation test';replacement.memoryIds=[];replacement.incidents=[];replacement.relations={};replacement.pacing={relevant:0,lastAppearance:-10,lastCallbackAt:-10,templates:[],phrases:[],callbacks:{}};
 after.narrative.characters[replacement.id]=replacement;
 const experience=tradeExperience(after,replacement,ctx,entry);assert.equal(experience.restores.length,0);assert.equal(experience.hope,undefined);
 const line=selectTradeDialogue(after,entry,replacement,ctx,'secretary');assert.equal(line.templateId,'TR08-REST-SEC-01');assert.deepEqual(line.experienceLineIds,[]);
 delete after.narrative.characters[replacement.id];
});

test('procedural and cautious personalities do not follow a compulsory shared script',()=>{
 assert(!restored(procedural.state).some(l=>l.templateId==='TR08-REST-SEC-01'));assert(!restored(procedural.state).some(l=>l.templateId==='TR08-REST-SEC-02'));
 assert(restored(procedural.state).some(l=>l.templateId==='TR08-REST-SEC-03'));assert(restored(diplomatic.state).some(l=>l.templateId==='TR08-REST-SEC-01'));
});

test('hostility can persist despite restored opportunities without implying prosperity or obedience',()=>{
 assert.equal(politicalPosture(military.state,'ruler-bombay','bombay').kind,'hostile');
 assert(savedLines(military.state).some(l=>l.templateId==='TR08-MIL-RUL-01'||l.templateId==='TR08-REL-RUL-01'));
 assert(!military.state.history.some(h=>h.incident.facts.some(f=>['treaty','payment','trade-completed','order-filled'].includes(f.type))));
});

test('trade memories and saved experience survive current-version load, Undo/Redo and branching',()=>{
 const i=military.states.findIndex(s=>latest(s).some(l=>l.templateId==='TR08-REST-SEC-02')),before=military.states[i-1],after=military.states[i];
 assert.deepEqual(decode(encode(after)).state,after);
 const u=undoFrame(after,null,[before],[null],[]),stored=decode(encode(u.state,u.undo,u.progress,u.undoProgress,u.redo));assert.deepEqual(redoFrame(stored.state,stored.progress,stored.undo,stored.undoProgress,stored.redo).state,after);
 const alternative=commit(before,manual('turmoil','bombay'));assert(!alternative.history.some(h=>h.incident.id===after.history.at(-1).incident.id&&h.narrative?.lines.some(l=>l.templateId==='TR08-REST-SEC-02')));
});

test('trade lines retain exact words and obey template/callback pacing without resampling during render',()=>{
 const before=clone(military.state);profileHTML(military.state,'secretary-bombay');sceneHTML(military.state.history.at(-2).narrative);assert.deepEqual(military.state,before);
 const text=new Map(TRADE_DIALOGUE.map(e=>[e.id,e.text]));for(const l of savedLines(military.state))if(l.templateId.startsWith('TR08-'))assert.equal(l.text,text.get(l.templateId).replaceAll('{region}',l.tradeRegion.charAt(0).toUpperCase()+l.tradeRegion.slice(1)));
 const bad=clone(military.state);savedLines(bad).find(l=>l.templateId.startsWith('TR08-')).text+=' rewritten';assert.throws(()=>validate(bad),/Invalid narrative/);
});

test('multi-turn diplomatic and military campaigns are mechanically identical with narrative disabled',()=>{
 const plain=s=>{const c=clone(s);delete c.narrative;if(c.gameEnd)delete c.gameEnd.at;for(const h of c.history){delete h.narrative;delete h.at;}return c;};
 for(const fixture of [military,diplomatic]){
  let off=clone(fixture.states[0]);delete off.narrative;
  fixture.inputs.forEach((input,i)=>{off=(input.type==='deploy'?resolveDeployment(off,input):resolveAction(off,input)).state;assert.deepEqual(plain(off),plain(fixture.states[i+1]));});
 }
});

test('pre-change physical instructions, action reports and board outcomes are preserved exactly; 08B chapter source is untouched',()=>{
 const baseline=JSON.parse(fs.readFileSync(new URL('./trade-gameplay-baseline.json',import.meta.url),'utf8'));
 for(const {name,state,input,instructions,report,regions} of baseline.cases){const r=input.type==='deploy'?resolveDeployment(state,input):resolveAction(state,input);assert.deepEqual(r.instructions,instructions,name);assert.equal(r.report,report,name);assert.deepEqual(r.state.regions,regions,name);}
 const code=fs.readFileSync(new URL('../dist/narrative.js',import.meta.url),'utf8'),chapter=code.slice(code.indexOf('function chapter('),code.indexOf('// Called exactly'));
 assert.equal(chapter.replaceAll('\r\n','\n'),baseline.chapter.replaceAll('\r\n','\n'));
});

test('existing owned intervention evidence counts as personal commercial experience without converting saved dialogue',()=>{
 const raw=fs.readFileSync(new URL('../docs/narrative/review/collection07/reconciliation.json',import.meta.url),'utf8'),s=decode(raw).state,before=clone(s);
 const entry=s.history.findLast(h=>h.incident.facts.some(f=>f.type==='intervention'));
 const ctx=tradeContexts(s,entry).find(c=>c.region==='bombay');assert(ctx);
 const experience=tradeExperience(s,s.narrative.characters['secretary-bombay'],ctx,entry);assert(experience.restores.length>=3);
 assert.deepEqual(s,before);assert.deepEqual(decode(encode(s)).state,before);
 assert(savedLines(s).some(l=>l.templateId==='m2-assurance-orders'));
});

test('the same institutional secretary learns across related regions, without double-counting a restoration',()=>{
 const i=military.states.findIndex(s=>latest(s).some(l=>l.templateId==='TR08-REST-SEC-01'));let s=clone(military.states[i]);
 s=commit(s,{type:'deploy',...deployment('hyderabad')});s=commit(s,manual('turmoil','hyderabad'));s=commit(s,{type:'deploy',...deployment('hyderabad')});
 const line=latest(s).find(l=>l.speakerId==='secretary-bombay');assert.equal(line.templateId,'TR08-REST-SEC-02');assert.equal(line.tradeRegion,'hyderabad');assert(line.experienceLineIds.length);
 const final=military.state,experience=tradeExperience(final,final.narrative.characters['secretary-bombay'],{region:'bombay'},final.history.at(-1));assert.equal(experience.restores.length,10);
});

test('commercial hopes do not become a repeated legacy reassurance on unrelated Tax unrest',()=>{
 const first=savedLines(military.state).find(l=>l.templateId==='TR08-REST-SEC-01');assert(first);
 assert(!savedLines(military.state).some(l=>l.templateId==='m2-quote-assurance'&&l.callbackStatementIds.includes(first.statementId)));
 const good=clone(military.state);good.narrative.statements[first.statementId].audienceIds=['ruler-bombay'];assert.throws(()=>validate(good),/commercial hope ownership or audience/);
});

test('a procedural secretary can select the approved first diplomatic alternative without inventing a hopeful past',()=>{
 let s=narrativeState();s.narrative.characters['secretary-bombay'].traits.caution=20;s=commit(s,manual('turmoil','bombay'));
 const order=Object.keys(s.regions.bombay.orders).find(o=>!s.regions.bombay.orders[o]);s=commit(s,{type:'envoy',purpose:'order',region:'bombay',order,outcome:'success'});
 assert(latest(s).some(l=>l.templateId==='TR08-DIPL-SEC-01'));assert(!latest(s).some(l=>l.templateId==='TR08-REST-SEC-02'));
});
