import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {clone,encode,decode,validate} from '../dist/model.js';
import {readableChronicle} from '../dist/chronicle.js';
import {TRADE_DIALOGUE} from '../dist/narrative-trade-content.js';
import {tradeContexts,tradeExperience} from '../dist/narrative-trade.js';
import {politicalPosture} from '../dist/narrative-posture.js';
import {tradeCampaign} from '../tests/trade-fixtures.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),out=path.join(root,'docs/narrative/review/collection08a');fs.mkdirSync(out,{recursive:true});
const rows=[],used=new Set(),traces=['# Collection 08A — multi-turn commercial dialogue traces','','Synthetic campaigns using actual resolvers, event-stack draws, phase resolution, Parliament and final scoring. Initial fictional voices are declared. Manually triggered Turmoil events are explicitly labelled. Supplied dice, defence and officer-rout answers are test inputs, not inferred narrative outcomes. No personal save or historical quotation is included. Section 7/thematic chapter work (08B) remains deferred; archived chapters retain the previous implementation.',''];
const log=['# Repeated restoration — saved secretary choices','','The empty entries below are intentional silence when no fresh eligible authored reaction remains. Counts are personal, deduplicated by committed incident, and do not include another adviser’s memories. No line is reconstructed when the dossier opens.','','| Campaign | Turn | Incident | Method | Earlier known restorations | Confidence after | Saved secretary reaction |','| --- | --- | --- | --- | --- | --- | --- |'];
function stable(s){for(const h of s.history)h.at='2026-10-24T12:00:00.000Z';if(s.gameEnd)s.gameEnd.at='2026-10-24T12:00:00.000Z';return s;}
for(const options of [
 {name:'hostile-military',kind:'military',profile:'cautious'},
 {name:'procedural-military',kind:'military',profile:'procedural'},
 {name:'diplomatic-access',kind:'diplomatic',profile:'cautious'},
 {name:'cooperative-commerce',kind:'military',profile:'cautious',pressure:false},
 {name:'connected-cascades',kind:'cascade',profile:'cautious',scenario:'1813'}
]){
 const f=tradeCampaign(options),state=stable(f.state);state.campaignName='08A review · '+options.name;validate(state);
 const raw=encode(state);assert.deepEqual(decode(raw).state,state);fs.writeFileSync(path.join(out,options.name+'.json'),raw);fs.writeFileSync(path.join(out,options.name+'.html'),readableChronicle(state));
 traces.push(`## ${options.name}`,'',`Scenario ${f.scenario}; seed 808; ${state.narrative.chapters.length} turns. Initial ${options.profile} secretary: formality 3, humour 1, ${options.profile==='cautious'?'caution 85 / pride 30':'caution 30 / pride 85'}. ${options.pressure===false?'No repeated Tax pressure; cooperation may develop from actual beneficial interventions.':options.kind==='diplomatic'?'No Company conquest; Special Envoy restores actual closed opportunities.':'Repeated Tax/administrative pressure keeps conquest grievances salient despite useful restored commerce.'}`,'');
 let currentTurn=null,restores=0;
 for(const [i,h] of state.history.entries()){
  if(currentTurn!==h.turn){currentTurn=h.turn;traces.push(`### Turn ${currentTurn}`,'');}
  traces.push(`#### ${h.incident.id} · ${h.title}${h.incident.provenance==='manual-test'?' · MANUALLY TRIGGERED TEST EVENT':''}`,'');
  const contexts=tradeContexts(state,h),secretary=f.states[i+1].narrative.characters['secretary-bombay'];
  if(contexts.length)traces.push(`Secretary confidence after incident: ${secretary.confidence}; mood: ${secretary.mood}; core caution: ${secretary.traits.caution}. Ruler's prior political attitude: ${politicalPosture(f.states[i],'ruler-bombay','bombay').kind}.`,'');
  for(const ctx of contexts.filter(c=>['trade-military','trade-diplomacy'].includes(c.category))){
   restores++;const c=state.narrative.characters[ctx.adviserId],experience=c&&tradeExperience(state,c,ctx,h),line=h.narrative.lines.find(l=>l.speakerId===ctx.adviserId&&l.tradeKind===ctx.category);
   log.push(`| ${options.name} | ${h.turn} | ${h.incident.id} | ${ctx.category} | ${experience?.restores.length??'no eligible adviser'} | ${ctx.adviserId?f.states[i+1].narrative.characters[ctx.adviserId].confidence:'—'} | ${line?'`'+line.templateId+'` — '+line.text:'Silence'} |`);
  }
  for(const l of h.narrative?.lines||[]){
   if(l.templateId.startsWith('TR08-')){const e=TRADE_DIALOGUE.find(e=>e.id===l.templateId);assert.equal(l.text,e.text.replaceAll('{region}',l.tradeRegion.charAt(0).toUpperCase()+l.tradeRegion.slice(1)));used.add(e.id);}
   traces.push(`**${l.speaker}** · \`${l.templateId}\` · ${l.emotion}`,l.text,'');
   if(l.evidence.length)traces.push('Current evidence: '+l.evidence.map(r=>r.incidentId+'/'+r.factKey).join(', ')+'.');
   if(l.selectionEvidence?.length)traces.push('Earlier experience/attitude evidence: '+l.selectionEvidence.map(r=>r.incidentId+'/'+r.factKey).join(', ')+'.');
   if(l.callbackMemoryIds.length)traces.push('Owned callback memories: '+l.callbackMemoryIds.map(id=>'`'+id+'`').join(', ')+'.');
   for(const id of l.experienceLineIds||[]){const earlier=state.history.flatMap(h=>h.narrative?.lines||[]).find(l=>l.id===id);traces.push(`Earlier words by this same character: \`${id}\` — ${earlier.text}`);}
   traces.push('');
  }
 }
 const reactions=state.history.flatMap(h=>h.narrative?.lines||[]).filter(l=>l.speakerId==='secretary-bombay'&&['trade-military','trade-diplomacy'].includes(l.tradeKind));
 rows.push({name:options.name,scenario:f.scenario,turns:state.narrative.chapters.length,incidents:state.history.length,restorations:restores,savedSecretaryReactions:reactions.map(l=>l.templateId),jsonBytes:Buffer.byteLength(raw)});
 if(options.name==='hostile-military'||options.name==='diplomatic-access'){
  const checkpoint=f.states[f.checkpoints[0].index];fs.writeFileSync(path.join(out,options.kind==='diplomatic'?'before-diplomacy.json':'before-military.json'),encode(stable(clone(checkpoint))));
 }
 if(options.name==='connected-cascades'){
  const index=f.state.history.findIndex(h=>h.incident.facts.some(f=>f.type==='trade-cascade')&&h.incident.facts.some(f=>f.type==='order-closed'&&f.cascadeFrom));assert(index>=0);
  fs.writeFileSync(path.join(out,'before-cascade.json'),encode(stable(clone(f.states[index]))));fs.writeFileSync(path.join(out,'cascade-input.json'),JSON.stringify(f.inputs[index],null,2)+'\n');
 }
}
fs.writeFileSync(path.join(out,'dialogue-traces.md'),traces.join('\n').trimEnd()+'\n');fs.writeFileSync(path.join(out,'restoration-log.md'),log.join('\n')+'\n');
fs.writeFileSync(path.join(out,'coverage.json'),JSON.stringify({integrated:TRADE_DIALOGUE.length,demonstratedIds:[...used].sort(),fixtures:rows},null,2)+'\n');
fs.writeFileSync(path.join(out,'README.md'),`# Collection 08A narrative review\n\nSynthetic campaigns for the user and ChatGPT's narrative-quality review. Start with the [restoration log](restoration-log.md) to inspect the repeated-secretary issue, then [dialogue traces](dialogue-traces.md) for exact saved words, memory/evidence and changing interpretation.\n\n${rows.map(r=>`- [${r.name}](${r.name}.html) · [JSON](${r.name}.json) — ${r.turns} turns, ${r.restorations} restorations.`).join('\n')}\n\nAll games use actual actions, real event-stack/phase/Parliament progression and final scoring. Manual test events are labelled. Opening an order establishes an available opportunity, never a sale, treaty or material prosperity. Repetition experience stays with the actual character. New appointee generation is deferred; identity isolation is tested separately.\n\n[Technical report and deferrals](../../collection08a-implementation.md), [coverage](coverage.json). Thematic chapters intentionally retain their existing format: **08B is not implemented**. Pre-action JSON checkpoints support isolated browser testing.\n\nRegenerate with \`node scripts/export-trade-review.mjs\`. Passing technical tests does not grant creative acceptance.\n`);
console.log(JSON.stringify({integrated:TRADE_DIALOGUE.length,demonstrated:used.size,fixtures:rows},null,2));
