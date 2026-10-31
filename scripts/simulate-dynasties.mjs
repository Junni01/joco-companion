// OFFLINE MODEL ONLY. Not a player save, live generator, or approved policy.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {initialState, IDS} from '../dist/model.js';
import {createNarrative} from '../dist/narrative.js';
import {SCENARIOS} from '../dist/scenarios.js';
import {selectSuccessor} from '../dist/narrative-succession.js';

export const CURVES = {
  restrained: [0.002, 0.004, 0.012, 0.035, 0.09, 0.18],
  middle: [0.004, 0.008, 0.025, 0.07, 0.16, 0.30],
  elevated: [0.008, 0.016, 0.05, 0.13, 0.27, 0.45]
};
export const BANDS = [0, 40, 55, 65, 75, 85];
export function mortality(age, curve) {
  if (!Number.isFinite(age) || age < 0 || !Object.hasOwn(CURVES, curve)) throw Error('Invalid age/curve');
  return CURVES[curve][BANDS.findLastIndex(b => age >= b)];
}
// String-keyed independent streams make comparisons reproducible and paired.
export function draw(seed, ...parts) {
  let h = 2166136261;
  for (const c of [seed, ...parts].join('|')) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
export function setup(scenario, seed) {
  const s = initialState(scenario); s.narrative = createNarrative(s, seed); return s;
}
export function distribution(values) {
  const a = [...values].sort((x,y)=>x-y), q = p => a[Math.floor((a.length-1)*p)] ?? null;
  return {n:a.length, mean:a.length ? a.reduce((x,y)=>x+y,0)/a.length : null, p05:q(.05), median:q(.5), p95:q(.95), min:q(0), max:q(1)};
}
export function ageAudit(seeds = 1000) {
  return Object.entries(SCENARIOS).map(([id,c]) => {
    const ages={rulers:[],siblings:[],advisers:[]};
    for(let seed=1;seed<=seeds;seed++) for(const p of Object.values(setup(id,seed).narrative.characters))
      ages[p.role==='ruler'?'rulers':p.role==='heir'?'siblings':'advisers'].push(p.age);
    return {scenario:id, start:c.start, end:c.end, rounds:c.end-c.start+1, ageTicks:c.end-c.start, yearsAdded:3*(c.end-c.start), ages:Object.fromEntries(Object.entries(ages).map(([k,v])=>[k,distribution(v)]))};
  });
}
const origin = step => ({turn:step,source:{setup:true},reason:'HYPOTHETICAL MODEL ledger event; not production provenance'});
const claim = (id, person, region, step, basis='designation', support={}) => ({id,claimantId:person,region,basis,status:'asserted',standing:'recognised',origin:origin(step),support});

// Compact modelling projection; deliberately NOT validated/exported as an application save.
// Production candidate eligibility is reused, but proposed exits/growth are ledger operations.
export function simulate(input, config) {
  const {seed=1,ticks=4,curve='middle',population='rulers',strategy='none',timing='after',trace=false}=config;
  if(!Number.isSafeInteger(seed)||!Number.isInteger(ticks)||ticks<1||ticks>100||!CURVES[curve]||!['rulers','families'].includes(population)||!['none','adoption','births','appointment'].includes(strategy)||!['before','after'].includes(timing)) throw Error('Invalid simulation configuration');
  const s=structuredClone(input), n=s.narrative;
  n.familyLinks ??=[]; n.claimsV2 ??=[]; n.regencies ??=[];
  const initialIds=new Set(Object.keys(n.characters)), originalSeats={...n.seats}, timeline=[], events=[];
  const counters={drawnRulerExits:0,committedRulerDeaths:0,relativeDeaths:0,blockedExits:0,noHeir:0,ties:0,activeRegencyBlocked:0,regentLostBlocked:0,regencies:0,regencyEnds:0,widowOpportunities:0,introductions:0,births:0,adoptions:0,appointments:0,validSeatTicks:0,seatTicks:0};
  const deathAges=[],tenures=[], starts=Object.fromEntries(IDS.map(r=>[r,0]));
  let serial=0;
  const log=(step,type,data)=>{events.push({step,type,...data});if(trace)timeline.push({step,type,...data});};
  const add=(region,age,step,kind)=>{
    if(Object.keys(n.characters).length>=64)return null;
    const id=`model-${region}-${++serial}`;
    n.characters[id]={id,name:id,age,region,role:'heir',condition:'alive',family:[],claims:[],relations:{},introduction:{kind,origin:origin(step)}};
    counters.introductions++; log(step,'hypothetical-introduction',{id,region,age,kind}); return id;
  };
  // Birth comparison starts with an explicit hypothetical adult spouse per court.
  // These eight extra identities count towards growth; no original biography is changed.
  if(strategy==='births')for(const r of IDS){const id=add(r,30,0,'synthetic-spouse');n.familyLinks.push({id:`marriage-${r}`,type:'spouse',fromId:n.seats[r],toId:id,origin:origin(0)});}
  for(let step=1;step<=ticks;step++) {
    // Starting-alive cohort only: a new identity is neither aged nor sampled twice.
    const present=Object.values(n.characters).filter(p=>p.condition!=='dead');
    const ages=new Map(present.map(p=>[p.id,p.age]));
    for(const p of present)p.age+=3;
    for(const t of n.regencies.filter(t=>!t.end))if(n.characters[t.rulerId].age>=18){t.end=origin(step);counters.regencyEnds++;log(step,'hypothetical-regency-end',{ruler:t.rulerId,regent:t.regentId});}
    // Nonfatal introductions precede mortality; one prospective adoption/region,
    // and only while the court has no eligible documented candidate.
    for(const r of IDS){
      const ruler=n.characters[n.seats[r]];
      if(strategy==='adoption'&&ruler.age>=30&&!events.some(e=>e.type==='hypothetical-adoption'&&e.region===r)&&selectSuccessor(s,r).status==='none'&&draw(seed,step,r,'adopt')<.12){
        const id=add(r,16,step,'prospective-adoption');if(id){
          const prior=`incumbent-${r}-${step}`;n.claimsV2.push({...claim(prior,ruler.id,r,step,'previous-rulership'),status:'realised'});
          const link=`adopt-${id}`;n.familyLinks.push({id:link,type:'adoptive-parent',fromId:ruler.id,toId:id,origin:origin(step)});
          n.claimsV2.push(claim(`claim-${id}`,id,r,step,'adoption',{familyLinkIds:[link],claimIds:[prior]}));
          n.familyLinks.push({id:`guard-${id}`,type:'guardian',fromId:ruler.id,toId:id,origin:origin(step)});
          // An adult sibling may be explicitly nominated guardian, but is not made a parent/heir.
          const sibling=n.characters[`heir-${r}`];if(sibling?.condition==='alive'&&sibling.age>=18)n.familyLinks.push({id:`guard2-${id}`,type:'guardian',fromId:sibling.id,toId:id,origin:origin(step)});
          counters.adoptions++;log(step,'hypothetical-adoption',{id,region:r,parent:ruler.id});
        }
      }
      if(strategy==='births')for(const m of n.familyLinks.filter(l=>l.type==='spouse'&&!l.end&&[l.fromId,l.toId].includes(ruler.id))){
        const a=n.characters[m.fromId],b=n.characters[m.toId];
        if(a.condition==='alive'&&b.condition==='alive'&&a.age>=18&&b.age>=18&&a.age<=55&&b.age<=55&&draw(seed,step,r,'birth')<.10){
          const id=add(r,0,step,'prospective-birth');if(id){
            for(const parent of [a,b])n.familyLinks.push({id:`parent-${parent.id}-${id}`,type:'parent',fromId:parent.id,toId:id,origin:origin(step)});
            // Explicit hypothetical recognition, not inheritance inferred from biology.
            n.claimsV2.push(claim(`claim-${id}`,id,r,step));
            n.familyLinks.push({id:`guard-${id}`,type:'guardian',fromId:b.id,toId:id,origin:origin(step)});
            counters.births++;log(step,'hypothetical-birth-and-recognition',{id,region:r,parents:[a.id,b.id]});
          }
        }
      }
    }
    // Freeze the risk cohort before any exit. Outcomes do not depend on loop order.
    const risk = present.filter(p=>Object.values(n.seats).includes(p.id)||(population==='families'&&p.role==='heir'));
    const sampled=new Set(risk.filter(p=>draw(seed,step,p.id,'mortality')<mortality(timing==='before'?ages.get(p.id):p.age,curve)).map(p=>p.id));
    // Conservative guard: don't commit a regent death this foundation cannot handle.
    for(const id of sampled){
      if(Object.values(n.seats).includes(id))continue;
      const p=n.characters[id];
      if(n.regencies.some(t=>!t.end&&t.regentId===id)){counters.regentLostBlocked++;continue;}
      p.condition='dead';counters.relativeDeaths++;deathAges.push(p.age);log(step,'hypothetical-relative-death',{id,age:p.age});
      for(const m of n.familyLinks.filter(l=>l.type==='spouse'&&!l.end&&[l.fromId,l.toId].includes(id))){m.end={...origin(step),outcome:'widowed',deceasedId:id};if(n.characters[m.fromId===id?m.toId:m.fromId].condition==='alive')counters.widowOpportunities++;}
    }
    for(const r of IDS){
      const id=n.seats[r],ruler=n.characters[id];
      if(sampled.has(id)){
        counters.drawnRulerExits++;
        if(n.regencies.some(t=>!t.end&&t.region===r)){counters.blockedExits++;counters.activeRegencyBlocked++;log(step,'blocked-active-regency',{region:r,id});}
        else {
          let decision=selectSuccessor(s,r);
          if(decision.status==='none'&&strategy==='appointment'&&s.regions[r].control!=='company'){
            const appointee=add(r,28,step,'unrelated-court-appointee');if(appointee){n.claimsV2.push(claim(`claim-${appointee}`,appointee,r,step,'witnessed-authority'));counters.appointments++;decision=selectSuccessor(s,r);}
          }
          if(decision.status!=='selected'){
            counters.blockedExits++;if(decision.status==='ambiguous')counters.ties++;else counters.noHeir++;
            log(step,'blocked-'+decision.status,{region:r,id,reason:decision.reason});
          }else{
            const next=decision.chosen.characterId;
            // Current incumbent cannot remain an available regent after its death.
            if(decision.chosen.regentId===id){counters.blockedExits++;counters.noHeir++;log(step,'blocked-departing-regent',{region:r,id});}
            else{
              ruler.condition='dead';deathAges.push(ruler.age);counters.committedRulerDeaths++;tenures.push(step-starts[r]);starts[r]=step;
              n.seats[r]=next;n.claimsV2.find(c=>c.id===decision.chosen.claimId).status='realised';
              for(const m of n.familyLinks.filter(l=>l.type==='spouse'&&!l.end&&[l.fromId,l.toId].includes(id))){m.end={...origin(step),outcome:'widowed',deceasedId:id};if(n.characters[m.fromId===id?m.toId:m.fromId].condition==='alive')counters.widowOpportunities++;}
              if(decision.chosen.regentId){n.regencies.push({region:r,rulerId:next,regentId:decision.chosen.regentId,start:origin(step)});counters.regencies++;}
              log(step,'hypothetical-succession',{region:r,from:id,to:next,age:ruler.age,successorAge:n.characters[next].age,regent:decision.chosen.regentId,claim:decision.chosen.claimId});
            }
          }
        }
      }
      counters.seatTicks++;if(n.characters[n.seats[r]]?.condition==='alive'&&(!n.regencies.some(t=>!t.end&&t.region===r)||n.regencies.filter(t=>!t.end&&t.region===r).every(t=>n.characters[t.regentId].condition==='alive'&&n.characters[t.regentId].age>=18)))counters.validSeatTicks++;
    }
  }
  return {counters,deathAges,completedTenures:tenures,censoredTenures:IDS.map(r=>ticks-starts[r]),retainedOriginal:IDS.filter(r=>n.seats[r]===originalSeats[r]).length,cast:Object.keys(n.characters).length,living:Object.values(n.characters).filter(p=>p.condition==='alive').length,maxLivingAge:Math.max(...Object.values(n.characters).filter(p=>p.condition==='alive').map(p=>p.age)),addedIds:Object.keys(n.characters).filter(id=>!initialIds.has(id)),timeline,ledger:trace?{people:n.characters,links:n.familyLinks,claims:n.claimsV2,seats:n.seats,regencies:n.regencies}:undefined};
}

export function experiment({runs=1000,seed=90210}={}){
  if(!Number.isInteger(runs)||runs<1||runs>100000||!Number.isSafeInteger(seed))throw Error('Invalid runs/seed');
  const horizons=[...Object.entries(SCENARIOS).map(([scenario,c])=>({label:scenario,scenario,ticks:c.end-c.start})),{label:'hypothetical-30',scenario:'1710',ticks:30}];
  const bases=Array.from({length:runs},(_,i)=>Object.fromEntries(Object.keys(SCENARIOS).map(id=>[id,setup(id,seed+i)])));
  const cells=[];
  for(const h of horizons)for(const curve of Object.keys(CURVES))for(const population of ['rulers','families'])for(const strategy of ['none','adoption','births','appointment'])for(const timing of ['before','after']){
    const results=bases.map((b,i)=>simulate(b[h.scenario],{...h,curve,population,strategy,timing,seed:seed+i}));
    const totals=Object.fromEntries(Object.keys(results[0].counters).map(k=>[k,results.reduce((v,r)=>v+r.counters[k],0)]));
    cells.push({...h,curve,population,strategy,timing,runs,totals,anyRulerDeath:results.filter(r=>r.counters.committedRulerDeaths).length/runs,anyDrawnExit:results.filter(r=>r.counters.drawnRulerExits).length/runs,anyNoHeir:results.filter(r=>r.counters.noHeir).length/runs,validSeatRate:totals.validSeatTicks/totals.seatTicks,deathAges:distribution(results.flatMap(r=>r.deathAges)),completedTenure:distribution(results.flatMap(r=>r.completedTenures)),censoredTenure:distribution(results.flatMap(r=>r.censoredTenures)),cast:distribution(results.map(r=>r.cast)),living:distribution(results.map(r=>r.living)),retainedOriginal:distribution(results.map(r=>r.retainedOriginal)),turnover:distribution(results.map(r=>r.counters.committedRulerDeaths)),regency:distribution(results.map(r=>r.counters.regencies)),maxLivingAge:distribution(results.map(r=>r.maxLivingAge))});
  }
  return {label:'UNAPPROVED ILLUSTRATIVE PROPOSALS — offline model, not live policy or historical mortality',seed,runs,curves:CURVES,bands:BANDS,ageAudit:ageAudit(Math.min(runs,1000)),cells};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const args=process.argv.slice(2);if(args.length>3)throw Error('Usage: node scripts/simulate-dynasties.mjs [output.json] [runs=1000] [seed=90210]');
  const output=JSON.stringify(experiment({runs:args[1]===undefined?1000:Number(args[1]),seed:args[2]===undefined?90210:Number(args[2])}),null,2)+'\n';
  if(args[0])fs.writeFileSync(args[0],output);else process.stdout.write(output);
}
