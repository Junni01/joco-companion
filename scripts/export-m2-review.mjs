import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {performance} from 'node:perf_hooks';
import {encode,decode,validate} from '../dist/model.js';
import {readableChronicle} from '../dist/chronicle.js';
import {storySequence,narrativeState,commit,deployment} from '../tests/m2-fixtures.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),out=path.join(root,'docs/narrative/review/m2');
fs.mkdirSync(out,{recursive:true});
const fixedTime='2026-10-24T12:00:00.000Z';
function stable(state){for(const h of state.history)h.at=fixedTime;if(state.gameEnd)state.gameEnd.at=fixedTime;return state;}
const rows=[],trace=['# M2 deterministic narrative review traces','','These are synthetic, seeded campaigns for joint narrative review. They are not personal campaign exports or historical accounts. Each uses the actual gameplay resolvers and authored offline narrative. Starting households are fictional. Current-version JSON is provided to inspect the same evidence in the app.',''];
function write(name,state,target){
 state=stable(state);state.campaignName='M2 review · '+name;validate(state);
 const raw=encode(state);assert.deepEqual(decode(raw).state,state);
 fs.writeFileSync(path.join(out,name+'.json'),raw);fs.writeFileSync(path.join(out,name+'.html'),readableChronicle(state));
 rows.push({name,scenario:state.scenario,jsonBytes:Buffer.byteLength(raw),incidents:state.history.length,memories:Object.keys(state.narrative.memories).length,statements:Object.keys(state.narrative.statements).length,callbacks:state.history.reduce((n,h)=>n+(h.narrative?.lines.filter(l=>l.callbackMemoryIds.length||l.callbackStatementIds.length).length||0),0)});
 trace.push(`## ${name}`,'',`Scenario ${state.scenario}; focus ${target}.`, '');
 for(const h of state.history){trace.push(`### ${h.incident.id} · ${h.title}`,'');for(const l of h.narrative?.lines||[]){trace.push(`**${l.speaker}:** ${l.text}`);if(l.callbackMemoryIds.length||l.callbackStatementIds.length)trace.push(`Sources: ${[...l.callbackMemoryIds,...l.callbackStatementIds].map(id=>'`'+id+'`').join(', ')}.`);trace.push('');}}
}
for(const scenario of ['1710','1758','1813','1710-long']){const {state,target}=storySequence(scenario,1234);write('story-'+scenario,state,target);}
let political=narrativeState('1710-long',4321);political.regions.bombay.strength=5;political.elephant={from:'bombay',to:'delhi'};
// This is a stated synthetic board setup, not an invented witnessed campaign event.
political=commit(political,{type:'event',event:'crisis',manualTest:true,topRegion:'delhi',shape:'circle',redirectShape:'circle',modifier:0});
political=commit(political,{type:'event',event:'leader',manualTest:true,topRegion:'delhi',shape:'circle',redirectShape:'circle',modifier:-3});
political=commit(political,{type:'event',event:'leader',manualTest:true,topRegion:'delhi',shape:'circle',redirectShape:'circle',modifier:10});
write('capital-and-rebellion',political,'capital collapse, unknown starting allegiance origins, opposing rebellion memories');
let setbacks=narrativeState('1813',2468);setbacks=commit(setbacks,{type:'deploy',...deployment('hyderabad',{outcome:'catastrophe',losses:1})});
setbacks=commit(setbacks,{type:'event',event:'foreign',manualTest:true,topRegion:'punjab',shape:'circle',redirectShape:'circle',storm:'all',rolls:{bombay:5,madras:4,bengal:3},defenses:{'foreign:bombay':0,'foreign:madras':0,'foreign:bengal':0},officerRouts:{bombay:2,madras:0,bengal:1}});
write('setbacks-and-routs',setbacks,'catastrophic deployment and three separately reported rout counts; no named deaths');
let long=narrativeState('1710-long',1234);long=commit(long,{type:'deploy',...deployment()});
for(let i=0;i<120;i++)long=commit(long,{type:'tax',region:'bombay'});
const start=performance.now(),large=encode(long,Array(20).fill(long),null,Array(20).fill(null),Array.from({length:20},()=>({state:long,progress:null}))),elapsed=performance.now()-start,decoded=decode(large);
assert(Buffer.byteLength(large)<6000000);assert.equal(decoded.state.history.length,121);assert.deepEqual(decoded.state.narrative,long.narrative);
const measurements={policy:'m2-trial-1',saveVersion:2,fixtures:rows,stress:{taxReports:120,retainedIncidents:long.history.length,memories:Object.keys(long.narrative.memories).length,currentCampaignBytes:Buffer.byteLength(encode(long)),withReversibleFramesBytes:Buffer.byteLength(large),undoFramesRetained:decoded.undo.length,redoFramesRetained:decoded.redo.length,encodingMilliseconds:Math.round(elapsed)}};
fs.writeFileSync(path.join(out,'storage-measurements.json'),JSON.stringify(measurements,null,2)+'\n');
fs.writeFileSync(path.join(out,'narrative-traces.md'),trace.join('\n')+'\n');
const index=`# Milestone 2 review package\n\nSynthetic deterministic output for joint human review. Seed 1234 is used for the four core story loops; other seeds are documented in the generator.\n\n${rows.map(r=>`- [${r.name}](./${r.name}.html) · [current-version JSON](./${r.name}.json) · ${r.memories} memories, ${r.statements} statements, ${r.callbacks} contextual callbacks.`).join('\n')}\n\nRead [the narrative traces](./narrative-traces.md) for exact saved words and callback source IDs. See [storage measurements](./storage-measurements.json) for UTF-8 save sizes and the 120-Tax stress case.\n\nReview the sense of continuity, different political perspectives, restraint of callbacks, absence of unsupported motives/deaths, and the separation of original and current interpretations. Passing technical tests does not constitute human narrative-quality acceptance.\n\nRegenerate with \`node scripts/export-m2-review.mjs\`. No network, AI service, portrait generation or save migration is used.\n`;
fs.writeFileSync(path.join(out,'README.md'),index);console.log(JSON.stringify(measurements,null,2));
