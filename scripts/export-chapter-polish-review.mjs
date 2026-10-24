import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {clone,encode,decode,validate} from '../dist/model.js';
import {readableChronicle} from '../dist/chronicle.js';
import {chapterView,inspectChapterCandidates} from '../dist/narrative-chapters.js';
import {evidenceIndex,resolveFact} from '../dist/narrative-evidence.js';
import {chapterCampaign} from '../tests/chapter-fixtures.js';
import {commercialFallbackCampaign,finalLossCampaign} from '../tests/chapter-polish-fixtures.js';
import {tradeCampaign} from '../tests/trade-fixtures.js';
import {commit} from '../tests/m2-fixtures.js';
import {manual} from '../tests/collection07-fixtures.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),out=path.join(root,'docs/narrative/review/collection08b-polish');fs.mkdirSync(out,{recursive:true});
const traces=['# Collection 08B — approved fallback polish and final coda traces','','Synthetic campaigns with actual gameplay resolvers, event-stack draws, phases, Parliament and committed chapter boundaries. Manual test events are explicitly labelled in the chronological journal and listed below. Every selected passage is shown beside its factual, personal and end-state evidence. This is material for human narrative review, not narrative-quality approval.',''];
const rejections=['# Attractive passages withheld','','These references are NOT emitted when their prerequisites are missing. Beneficial commerce alone does not create a protection-valuing judgment, political independence, promised gratitude or an earlier personal hope.',''];
const rows=[];
const fixed=s=>{for(const h of s.history)h.at='2026-10-25T09:00:00.000Z';if(s.gameEnd)s.gameEnd.at='2026-10-25T09:00:00.000Z';return s;};
function write(name,f,description){
 const state=fixed(clone(f.state));state.campaignName='08B review · '+name;validate(state);const raw=encode(state);assert.deepEqual(decode(raw).state,state);
 fs.writeFileSync(path.join(out,name+'.json'),raw);fs.writeFileSync(path.join(out,name+'.html'),readableChronicle(state));
 traces.push(`## ${name}`,'',description,'',`Manual test incidents: ${state.history.filter(h=>h.incident?.provenance==='manual-test').map(h=>h.incident.id+' / turn '+h.turn+' / '+h.title).join('; ')||'none'}.`,'');
 for(const c of state.narrative.chapters){
  const view=chapterView(state,c.closureIncidentId),index=evidenceIndex(view),inspection=inspectChapterCandidates(state,c.turn,c.closureIncidentId);
  traces.push(`### Turn ${c.turn} · ${c.title}`,'',`Saved ${c.id}; ${c.status}; ${c.ending?'final closing account':'ordinary end-of-turn account'}; ${c.threads.length} threads.`, '',c.text||'*No substantial chapter. The complete chronological journal remains available.*','');
  for(const t of c.threads){
   traces.push(`#### ${t.templateId}`,'',`Parameters: \`${JSON.stringify(t.parameters)}\`.`, '',`End state at \`${c.closureIncidentId}\`: \`${JSON.stringify(t.endState)}\`.`, '');
   for(const claim of t.clauses){
    traces.push(`**Evidence clause ${claim.id}:** ${claim.text}`);
    for(const ref of claim.evidence){const source=resolveFact(index,ref);traces.push(`- \`${ref.incidentId}/${ref.factKey}\` · turn ${source.entry.turn}: \`${JSON.stringify(source.fact)}\`.`);}
    for(const id of claim.memoryIds){const m=view.narrative.memories[id];traces.push(`- Owned memory \`${id}\`: ${view.narrative.characters[m.ownerId].name}; ${m.origin}; ${m.category}; emotional importance at this close ${m.emotionalImportance}. Original ${m.interpretation.kind}: ${m.interpretation.text}`);}
    for(const ref of claim.reasonRefs){const cause=view.narrative.characters[ref.ownerId].relations[ref.target].causes.find(c=>c.id===ref.causeId);traces.push(`- Personal relationship reason \`${ref.causeId}\`: deltas \`${JSON.stringify(cause.deltas)}\`; ${cause.reason}`);}
    for(const id of claim.lineIds){const source=index.lines.get(id);traces.push(`- Saved words \`${id}\` by **${source.line.speaker}**: ${source.line.text}`);}
    traces.push(`- Closing state reference: \`${JSON.stringify(claim.endStateRef)}\`.`, '');
   }
  }
  if(c.ending){const m=Object.values(view.narrative.memories).find(m=>m.category==='company-conquest'&&m.ownerId==='ruler-bombay');traces.push('**Final coda check:** '+JSON.stringify({companyControl:view.regions.bombay.control,originalRuler:m?.ownerId,conquestTurn:m?.createdTurn,currentEmotionalImportance:m?.emotionalImportance,currentAssessment:m?.currentAssessment||null,selected:c.threads.some(t=>t.templateId==='CH08-FINAL-GRIEVANCE')}),'');}
  const rejected=inspection.rejections.filter(r=>['CH08-01','CH08-02','CH08-03','CH08-04','CH08-FINAL-GRIEVANCE'].includes(r.templateId));
  if(rejected.length){rejections.push(`## ${name} · turn ${c.turn}`,'',...rejected.map(r=>`- **${r.templateId}** / ${r.region}${r.orderId?' / '+r.orderId:''}: ${r.reason}`),'',`Selected instead: ${c.threads.map(t=>t.templateId).join(', ')||'a quiet page'}.`,'');}
 }
 rows.push({name,turns:state.narrative.chapters.length,incidents:state.history.length,templates:state.narrative.chapters.map(c=>({turn:c.turn,status:c.status,threads:c.threads.map(t=>t.templateId)})),jsonBytes:Buffer.byteLength(raw)});
}
const political=chapterCampaign(),commercial=tradeCampaign(),cooperative=tradeCampaign({pressure:false}),diplomatic=tradeCampaign({kind:'diplomatic'});
write('possession-and-governance',political,'Five actual turns: conquest → Tax → failed administration; explicitly dated continued government; failed anti-Company rebellion without an invented earlier hope; a quiet fourth turn; one final coda supported by the original ruler’s persistent hostile grievance. Narrative seed 808.');
write('commercial-memory',commercial,'Five actual turns, narrative seed 808, cautious secretary and persistent taxation pressure. The same commercial opportunity and same person support the first full CH08-02; later developments use dated/narrower material or a quiet page rather than repeating its paragraph.');
write('useful-partner-is-not-protection-proof',cooperative,'Five actual turns, narrative seed 808, repeated beneficial interventions without repeated Tax pressure. The tempting CH08-03 is correctly withheld: an actually useful partner is not automatically evidence of valuing protection or an expectation of thanks.');
write('commercial-fallbacks',commercialFallbackCampaign(),'Five actual turns: baseline-closed opportunity restored by Envoy; an interruption restored in a later turn; a new same-turn interruption/restoration; quiet fourth turn; final-turn conquest followed by a real failed Company defence and loss. The final coda is correctly withheld: no earlier-turn conquest and no ending possession.');
write('ending-possession-lost',finalLossCampaign(),'Five actual turns sharing the governance chain, but legal failed administration and a manually triggered successful rebellion occur during the last turn. The original grievance survives, but ending Company possession does not. The coda must be withheld.');
write('diplomatic-memory',diplomatic,'Five actual turns outside Company control, with real Special Envoy openings. No conquest, completed sale or military protection is invented for the commercial passage.');
const boundary=cooperative.states.findIndex(s=>s.history.at(-1)?.actionType==='next-turn');let reversal=clone(cooperative.states[boundary-1]);const orderId=cooperative.states[boundary].narrative.chapters[0].threads[0].parameters.orderId;
while(reversal.regions.bombay.orders[orderId])reversal=commit(reversal,manual('turmoil','bombay'));
reversal=commit(reversal,{type:'next-turn'});write('reclosed-before-the-chapter',{state:reversal},'One completed turn, not a finished campaign: additional explicitly manual Turmoil reverses the restored opportunity before closing. The attractive available-at-close CH08-02 must be rejected.');
fs.writeFileSync(path.join(out,'before-final-coda.json'),encode(fixed(clone(political.states.at(-2)))));
const commercialBoundary=commercial.states.findIndex(s=>s.history.at(-1)?.actionType==='next-turn');
const checkpoint=clone(commercial.states[commercialBoundary-1]);fs.writeFileSync(path.join(out,'before-first-chapter.json'),encode(fixed(checkpoint)));
fs.writeFileSync(path.join(out,'chapter-traces.md'),traces.join('\n').trimEnd()+'\n');fs.writeFileSync(path.join(out,'rejected-passages.md'),rejections.join('\n').trimEnd()+'\n');
fs.writeFileSync(path.join(out,'coverage.json'),JSON.stringify({fixtures:rows},null,2)+'\n');
fs.writeFileSync(path.join(out,'README.md'),`# Collection 08B fallback polish review\n\nSynthetic output for the user's review with ChatGPT. Start with [chapter text and its evidence](chapter-traces.md) and [attractive passages correctly rejected](rejected-passages.md). No personal saves are included.\n\n${rows.map(r=>`- [${r.name}](${r.name}.html) · [current-version JSON](${r.name}.json) — ${r.turns} completed chapter boundaries.`).join('\n')}\n\nSix five-turn campaigns use actual event-stack/phase/Parliament/final-scoring workflows. The reclosed-before-the-chapter fixture is explicitly a one-turn reversal checkpoint. Compare the final coda in possession-and-governance with the quiet ending in useful-partner-is-not-protection-proof and the withheld coda in ending-possession-lost. Manual test events and controlled physical outcomes are disclosed. Complete chronology remains separate from selected thematic threads.\n\n[Technical implementation, writing audit and deferrals](../../collection08b-fallback-polish-implementation.md). [Coverage](coverage.json). A pre-chapter checkpoint supports isolated browser verification.\n\nRegenerate with \`node scripts/export-chapter-polish-review.mjs\`. Passing technical checks is not narrative-quality approval.\n`);
console.log(JSON.stringify(rows,null,2));
