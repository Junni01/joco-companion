import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {encode,decode,validate} from '../dist/model.js';
import {readableChronicle} from '../dist/chronicle.js';
import {APPROVED_DIALOGUE} from '../dist/narrative-approved-content.js';
import {storySequence,narrativeState,commit,deployment} from '../tests/m2-fixtures.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),out=path.join(root,'docs/narrative/review/approved-dialogue');
fs.mkdirSync(out,{recursive:true});
const used=new Set(),rows=[],trace=['# Approved dialogue — representative campaign traces','','Synthetic campaigns using actual gameplay resolvers. No personal saves or historical quotations. Fixed seeds and supplied physical outcomes make these review fixtures reproducible. Exact approved wording is retained. Ordinary presentation is one chronicler and up to two reactions; this trace includes every saved voice. Existing M2 fallbacks remain labelled by their original template IDs.',''];
const event=patch=>({type:'event',event:'leader',manualTest:true,topRegion:'bombay',shape:'circle',redirectShape:'circle',modifier:0,...patch});
function write(name,state,premise){
 state.campaignName='Approved dialogue review · '+name;for(const h of state.history)h.at='2026-10-24T12:00:00.000Z';validate(state);
 const raw=encode(state);assert.deepEqual(decode(raw).state,state);
 fs.writeFileSync(path.join(out,name+'.json'),raw);fs.writeFileSync(path.join(out,name+'.html'),readableChronicle(state));
 trace.push(`## ${name}`,'',premise,'');let approved=0;
 for(const h of state.history){
  trace.push(`### ${h.incident.id} · Turn ${h.turn} · ${h.title}`,'',`Canonical facts: ${h.incident.facts.map(f=>f.type+(f.region?' / '+f.region:'')+(f.kind?' / '+f.kind:'')+(f.outcome?' / '+f.outcome:'')).join('; ')}.`,'');
  for(const l of h.narrative?.lines||[]){
   const entry=APPROVED_DIALOGUE.find(e=>e.id===l.templateId);if(entry){assert.equal(l.text,entry.text);used.add(entry.id);approved++;}
   trace.push(`**${l.speaker}** · \`${l.templateId}\`${entry?' · approved collection':' · existing M2 fallback'}`,l.text,'',`Current evidence: ${l.evidence.map(r=>r.incidentId+'/'+r.factKey).join(', ')||'action summary'}.`);
   for(const id of l.callbackMemoryIds){const m=state.narrative.memories[id];trace.push(`Callback: \`${id}\`; owner ${state.narrative.characters[m.ownerId].name}; ${m.origin}; source ${m.evidence.map(r=>r.incidentId+'/'+r.factKey).join(', ')}.`);}
   for(const id of l.callbackStatementIds)trace.push(`Saved quotation: \`${id}\` — ${state.narrative.statements[id].text}`);
   trace.push('');
  }
 }
 rows.push({name,scenario:state.scenario,premise,incidents:state.history.length,approvedLines:approved,jsonBytes:Buffer.byteLength(raw)});
}
for(const scenario of ['1710','1758','1813','1710-long'])write('story-'+scenario,storySequence(scenario,1234).state,'Seed 1234. Normal reported conquest, Tax, administrative failure, intervention and renewed unrest. Existing exact assurance callbacks remain part of this sequence.');
for(const [profile,trait] of [['proud','pride'],['cautious','caution'],['vindictive','vindictiveness']]){
 let s=narrativeState('1710-long',4321),r=s.narrative.characters['ruler-bombay'];
 for(const key of Object.keys(r.traits))r.traits[key]=20;r.traits[trait]=90;
 r.voice={formality:2,directness:2,restraint:profile==='cautious'?3:1,humour:1};
 const officer=s.narrative.characters['army-bombay'];for(const key of Object.keys(officer.traits))officer.traits[key]=20;
 officer.traits.caution=90;officer.voice.restraint=3;
 const secretary=s.narrative.characters['secretary-bombay'];secretary.traits.pride=90;secretary.traits.caution=20;
 s=commit(s,{type:'deploy',...deployment()});s=commit(s,{type:'tax',region:'bombay'});s=commit(s,{type:'tax',region:'bombay'});
 s=commit(s,event({defenses:{leader:100}}));
 s=commit(s,{type:'unrest',region:'bombay',reason:'failure'});s=commit(s,event({defenses:{leader:0},officerRouts:{bombay:0}}));
 s=commit(s,{type:'deploy',...deployment('bombay',{outcome:'failure'})});
 write('personality-'+profile,s,`Seed 4321. Initial fictional ${profile} ruler profile (${trait}=90; other core traits=20), a cautious professional Army adviser and vain secretary are explicitly selected test personas. No campaign history is injected. Conquest → two Taxes → genuinely suppressed rebellion → actual unsuccessful administration → genuine Company loss to rebellion → failed attempt to reconquer. Leader events are explicitly manual-test event resolution with supplied defence outcomes, never inferred from unrest.`);
}
for(const [profile,trait] of [['professional','caution'],['overconfident','pride'],['careerist','ambition']]){
 let s=narrativeState('1710-long',2468),officer=s.narrative.characters['army-bombay'];
 for(const key of Object.keys(officer.traits))officer.traits[key]=20;officer.traits[trait]=90;officer.voice={formality:profile==='professional'?1:3,directness:2,restraint:profile==='professional'?3:1,humour:1};
 s=commit(s,{type:'deploy',...deployment('bombay',{outcome:'failure'})});s=commit(s,{type:'deploy',...deployment()});s=commit(s,{type:'tax',region:'bombay'});s=commit(s,{type:'tax',region:'bombay'});s=commit(s,{type:'deploy',...deployment('bombay',{outcome:'catastrophe',losses:1})});
 write('military-'+profile,s,`Seed 2468. Initial fictional ${profile} Army adviser profile (${trait}=90; other core traits=20). Actual failed attack → actual successful conquest → Tax callback → repeat Tax/unrest → explicitly reported catastrophic intervention with one officer loss (no named death). No further deployment is attempted after catastrophe. No command, weather, retreat or casualty circumstances are invented.`);
}
fs.writeFileSync(path.join(out,'dialogue-traces.md'),trace.join('\n').trimEnd()+'\n');
fs.writeFileSync(path.join(out,'coverage.json'),JSON.stringify({integrated:APPROVED_DIALOGUE.length,demonstratedIds:[...used].sort(),fixtures:rows},null,2)+'\n');
fs.writeFileSync(path.join(out,'README.md'),`# Approved dialogue integration review\n\nThese are synthetic campaign fixtures for the user's narrative-quality review with ChatGPT. Passing technical checks is not narrative acceptance. No personal campaigns are included.\n\nStart with [dialogue traces](dialogue-traces.md). Each line includes its catalogue ID, exact saved wording, current facts and any earlier callback source. Open an HTML chronicle for readable presentation, or import its current-version JSON into an isolated test campaign to inspect dossiers.\n\n${rows.map(r=>`- [${r.name}](${r.name}.html) · [JSON](${r.name}.json) — ${r.incidents} incidents, ${r.approvedLines} approved lines.`).join('\n')}\n\n[Coverage](coverage.json) lists demonstrated entries, not a guarantee that every integrated entry appears in these ten campaigns. Initial personality profiles are declared in the traces. All outcomes use actual resolvers; manual-test events are labelled.\n\nReview continuity, individual voices, restraint, satire, and the remaining M2 fallback wording. Long exchanges, Collection 05 and unsupported prerequisites remain deferred: see [entry-level deferrals](../../approved-dialogue-deferred.md).\n\nRegenerate with \`node scripts/export-approved-dialogue-review.mjs\`.\n`);
console.log(JSON.stringify({fixtures:rows.length,integrated:APPROVED_DIALOGUE.length,demonstrated:used.size,ids:[...used].sort()},null,2));
