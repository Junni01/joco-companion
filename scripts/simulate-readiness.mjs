// Offline policy comparison only. No application imports this runner.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {setup,simulate,distribution,READINESS_STRATEGIES} from './simulate-dynasties.mjs';
import {SCENARIOS} from '../dist/scenarios.js';
export function readinessExperiment({runs=1000,seed=90210}={}){
 if(!Number.isInteger(runs)||runs<1||runs>100000||!Number.isSafeInteger(seed))throw Error('Invalid seeded run configuration');
 const horizons=[...Object.entries(SCENARIOS).map(([scenario,c])=>({scenario,ticks:c.end-c.start})),{scenario:'1710',ticks:30}];
 const bases=Array.from({length:runs},(_,i)=>Object.fromEntries(Object.keys(SCENARIOS).map(id=>[id,setup(id,seed+i)]))),cells=[];
 for(const horizon of horizons)for(const curve of ['restrained','middle'])for(const population of ['rulers','families'])for(const strategy of ['none','adoption','births','appointment',...READINESS_STRATEGIES]){
  const config={...horizon,curve,population,strategy,timing:'after',trackReadiness:true},results=bases.map((b,i)=>simulate(b[horizon.scenario],{...config,seed:seed+i}));
  const totals=Object.fromEntries(Object.keys(results[0].counters).map(k=>[k,results.reduce((v,r)=>v+r.counters[k],0)]));
  cells.push({config,runs,totals,anyRulerDeath:results.filter(r=>r.counters.committedRulerDeaths).length/runs,anyNoHeir:results.filter(r=>r.counters.noHeir).length/runs,validSeatRate:totals.validSeatTicks/totals.seatTicks,availability:totals.availableSeatTicks===undefined?null:totals.availableSeatTicks/totals.seatTicks,cast:distribution(results.map(r=>r.cast)),turnover:distribution(results.map(r=>r.counters.committedRulerDeaths)),noHeir:distribution(results.map(r=>r.counters.noHeir)),regencies:distribution(results.map(r=>r.counters.regencies)),retainedOriginal:distribution(results.map(r=>r.retainedOriginal)),completedTenure:distribution(results.flatMap(r=>r.completedTenures)),censoredTenure:distribution(results.flatMap(r=>r.censoredTenures))});
 }
 return {label:'UNAPPROVED HYPOTHETICAL STRATEGIES — not live triggers, historical estimates or approved defaults',seed,runs,assumptions:{timing:'after +3',recognitionEventPerRegionTick:.08,courtIntroductionEventPerRegionTick:.03,cap:64,adultAge:18,adoptionPerTick:.12,birthPerCoupleTick:.10,emergency:'only after independent model mortality draw; prefer known supported person; refuse Company policy/ties/living unresolved claims'},cells};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const [file,runs='1000',seed='90210']=process.argv.slice(2);if(!file)throw Error('Usage: node scripts/simulate-readiness.mjs output.json [runs=1000] [seed=90210]');fs.writeFileSync(file,JSON.stringify(readinessExperiment({runs:Number(runs),seed:Number(seed)}),null,2)+'\n');}
