import fs from 'node:fs';
import {publicKnowledge,forecastRegion,outlookCandidates} from '../dist/narrative-outlooks.js';
import {OUTLOOK_TEXT} from '../dist/narrative-outlook-content.js';
import {clone} from '../dist/model.js';
import {rulerSummaryHTML} from '../dist/narrative-ui.js';
import {outlookFixture} from '../tests/outlook-fixtures.js';
const f=outlookFixture(),rows=['# Collection 09A/09B — small creative-review demonstration','','New bundled prose is proposed implementation wording, **not creative approval**. This synthetic fixture explicitly stages the public discard pile with three Crisis tiles and Shuffle as the next actual draw. It supplies no hidden face to the forecast. Actual phase/draw/event resolvers produce the subsequent states. No physical outcome is invented by an outlook.',''];
function show(label,s,region){const o=s.narrative.outlooks[region];rows.push(`## ${label}`,'',`**${s.narrative.characters[o.characterId].name} · private thought**`,'',`> ${o.text}`,'',`Public support: ${o.context.issues.join(', ')}; visible back region ${o.context.visibleBackRegion}; posture ${JSON.stringify(o.context.elephant)}. ${o.context.batch?`Known returned composition ${JSON.stringify(o.context.batch.counts)}; ${o.context.batch.remaining} future draws in unknown order.`:'No known returned batch.'} Source: ${o.sourceIncidentId||'fictional cast/setup and public starting board'}.`,'');}
show('Imperial frontier',f.state,'delhi');show('The threatened neighbour',f.state,'bombay');
const person={c:clone(f.state.narrative.characters['ruler-delhi']),grievance:null,helpful:[]},situation=forecastRegion(publicKnowledge(f.state),'delhi');
rows.push('## Same public circumstances, contrasting initial personalities','','Controlled editorial comparison; these two alternatives are not additional public speeches.');
for(const ambition of [90,10]){person.c.traits.ambition=ambition;person.c.confidence=50;const selected=outlookCandidates(situation,person,80)[0];rows.push('',`**${ambition===90?'Ambitious':'Restrained'} ruler:** ${OUTLOOK_TEXT[selected.key]}`);}
f.shuffle();show('After actual Shuffle resolution',f.state,'delhi');
const before=JSON.stringify(f.state);for(let i=0;i<8;i++)rulerSummaryHTML(f.state,'delhi');rows.push('Repeated panel reads: exact state and wording '+(before===JSON.stringify(f.state)?'unchanged.':'CHANGED — ERROR.'),'');
f.draw();f.resolve();show('After the next real event resolves',f.state,'delhi');
while(f.state.narrative.foresight.batch){f.draw();f.resolve();}
show('Returned batch exhausted',f.state,'delhi');
rows.push('## Review questions','','Do the frontier voices differ enough? Does alarm remain provisional? Is a legitimate unchanged outlook preferable to rotating a new quip? Is the evidence expansion clear about private belief versus public knowledge?','','Known limits: no pre-action counsel, public/private prediction callbacks, competence development or speech relocation. Those remain 09C/09D.');
fs.writeFileSync(new URL('../docs/narrative/collection09-demo.md',import.meta.url),rows.join('\n')+'\n');console.log(`${rows.length} small demonstration lines written`);
