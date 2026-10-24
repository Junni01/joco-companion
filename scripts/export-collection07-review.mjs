import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {encode,decode,validate,clone} from '../dist/model.js';
import {readableChronicle} from '../dist/chronicle.js';
import {POLISH_DIALOGUE} from '../dist/narrative-polish-content.js';
import {politicalPosture} from '../dist/narrative-posture.js';
import {makeCampaign} from '../tests/collection07-fixtures.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),out=path.join(root,'docs/narrative/review/collection07');fs.mkdirSync(out,{recursive:true});
const rows=[],used=new Set(),trace=['# Collection 07 — multi-turn campaign dialogue review','','Synthetic campaigns, not personal saves or historical accounts. These fixtures run actual resolvers, saved event-stack draws, Events in India, Parliament and final scoring. No turn number, phase-completion flag or political fact is inserted directly. Initial fictional personality profiles are declared; all later attitudes arise from saved incidents. Manual Leader/Turmoil tests are clearly marked. Controlled physical outcomes (including secondary defence/rout answers) are supplied explicitly. No payment, death, command role, return journey or administrative reform is inferred.',''];
const stable=s=>{for(const h of s.history)h.at='2026-10-24T12:00:00.000Z';if(s.gameEnd)s.gameEnd.at='2026-10-24T12:00:00.000Z';return s;};
for(const options of [
 {name:'proud-grievance',scenario:'1710',profile:'proud'},
 {name:'cautious-resistance',scenario:'1710',profile:'cautious'},
 {name:'reconciliation',scenario:'1710',profile:'vindictive',evolving:true},
 {name:'late-company',scenario:'1813',profile:'cautious'},
 {name:'mid-company',scenario:'1758',profile:'proud'}
]){
 const f=makeCampaign(options),s=stable(f.state);s.campaignName='Collection 07 · '+options.name;validate(s);
 const raw=encode(s);assert.deepEqual(decode(raw).state,s);fs.writeFileSync(path.join(out,options.name+'.json'),raw);fs.writeFileSync(path.join(out,options.name+'.html'),readableChronicle(s));
 trace.push(`## ${options.name}`,'',`Scenario ${options.scenario}; narrative seed 707; ${f.states[0].turn}–${s.turn}; ${options.profile} initial ruler (${options.profile==='proud'?'pride':options.profile==='vindictive'?'vindictiveness':'caution'} 85, other core traits 25). ${options.evolving?'Repeated restoration of closed orders supports changing attitudes, without deleting conquest.':'Conquest, tax, suppressed rebellion, later successful rebellion, failed reconquest and renewed control.'}`,'');
 let turn=null;
 for(const [i,h] of s.history.entries()){
  if(turn!==h.turn){turn=h.turn;trace.push(`### Turn ${turn}`,'');}
  const before=f.states[i],person=before.narrative.characters['ruler-'+f.target],posture=politicalPosture(before,person,f.target);
  trace.push(`#### ${h.incident.id} · ${h.title}${h.incident.provenance==='manual-test'?' · MANUALLY TRIGGERED TEST EVENT':''}`,'');
  if(h.incident.facts.some(x=>x.region===f.target))trace.push(`Prior political context: **${posture.kind}**, institutional hostility ${posture.scores.hostility}, gratitude ${posture.scores.gratitude}; active grievance ${posture.grievance}. These are derived review diagnostics, not new permanent character attributes.`,'');
  for(const l of h.narrative?.lines||[]){
   if(l.templateId.startsWith('FB07-')){const e=POLISH_DIALOGUE.find(e=>e.id===l.templateId);assert.equal(l.text,e.text);used.add(e.id);}
   trace.push(`**${l.speaker}** · \`${l.templateId}\` · ${l.emotion}`,l.text,'');
   if(l.speakerId!=='chronicler')trace.push(`Saved pacing after selection: relevant incident ${f.states[i+1].narrative.characters[l.speakerId].pacing.relevant}; callback clock ${f.states[i+1].narrative.characters[l.speakerId].pacing.lastCallbackAt}.`);
   if(l.evidence.length)trace.push('Current facts: '+l.evidence.map(r=>r.incidentId+'/'+r.factKey).join(', ')+'.');
   if(l.selectionEvidence?.length)trace.push('Prior political/expectation evidence: '+l.selectionEvidence.map(r=>r.incidentId+'/'+r.factKey).join(', ')+'.');
   for(const id of l.callbackMemoryIds){const m=s.narrative.memories[id];trace.push(`Memory callback: \`${id}\` · ${m.category} · created turn ${m.createdTurn}.`);}
   for(const id of l.callbackStatementIds)trace.push(`Earlier exact utterance: \`${id}\` — ${s.narrative.statements[id].text}`);
   trace.push('');
  }
 }
 trace.push('### Thematic chapters','',...s.narrative.chapters.flatMap(c=>[`**Turn ${c.turn} — ${c.title}**`,c.text,'']));
 rows.push({name:options.name,scenario:s.scenario,turns:s.narrative.chapters.length,incidents:s.history.length,manualEvents:s.history.filter(h=>h.incident.provenance==='manual-test').length,stackDraws:s.history.filter(h=>h.actionType==='stack-draw').length,finalPosture:politicalPosture(s,'ruler-'+f.target,f.target).kind,jsonBytes:Buffer.byteLength(raw)});
 if(options.name==='proud-grievance'){
  const i=f.states.findIndex(x=>x.history.at(-1)?.incident.facts.some(f=>f.kind==='company-defence'&&f.key==='leader'));
  fs.writeFileSync(path.join(out,'before-hostile-defence.json'),encode(stable(clone(f.states[i-1]))));
 }
}
fs.writeFileSync(path.join(out,'dialogue-traces.md'),trace.join('\n').trimEnd()+'\n');
fs.writeFileSync(path.join(out,'coverage.json'),JSON.stringify({collection07Entries:POLISH_DIALOGUE.length,demonstratedIds:[...used].sort(),fixtures:rows},null,2)+'\n');
fs.writeFileSync(path.join(out,'README.md'),`# Collection 07 multi-turn review\n\nSynthetic campaigns for narrative review by the user and ChatGPT. No personal saves. Start with [dialogue traces](dialogue-traces.md), which include exact words, stable IDs, prior political posture, evidence, relevant-incident clocks and thematic chapters.\n\n${rows.map(r=>`- [${r.name}](${r.name}.html) · [JSON](${r.name}.json) — ${r.turns} turns, ${r.stackDraws} actual stack draws, final derived posture ${r.finalPosture}.`).join('\n')}\n\nAll campaigns reach their scenario's real final turn and scoring, using actual phase and Parliament resolvers. Initial personalities are declared, manual events explicitly labelled, and physical outcomes supplied as fixture inputs. The no-storm foreign-event result and phase storm face are controlled test inputs, not newly generated narrative outcomes. The reconciliation campaign tests an experience-based change; Company control or a core loyalty trait alone never means Company alignment.\n\n[Coverage](coverage.json), [technical report and deferrals](../../collection07-implementation.md). A [pre-defence checkpoint](before-hostile-defence.json) supports isolated browser verification.\n\nReview continuity across turns, differing political responses, callback gaps and repetition, chapter usefulness and remaining neutral/older lines. Passing tests does not grant narrative-quality acceptance. Regenerate with \`node scripts/export-collection07-review.mjs\`.\n`);
console.log(JSON.stringify({demonstrated:used.size,integrated:POLISH_DIALOGUE.length,fixtures:rows},null,2));
