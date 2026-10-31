// Regenerates the review artefacts from a saved, reproducible numerical run.
import fs from 'node:fs';
import path from 'node:path';
import {simulate,setup} from './simulate-dynasties.mjs';
import {readinessReport} from '../tests/dynasty-model-fixtures.js';
const [source,target]=process.argv.slice(2);
if(!source||!target)throw Error('Usage: node scripts/report-dynasties.mjs results.json output-directory');
const data=JSON.parse(fs.readFileSync(source,'utf8'));
fs.mkdirSync(target,{recursive:true});
const pct=n=>(n*100).toFixed(1)+'%',num=n=>n==null?'—':n.toFixed(2);
const get=(label,curve='middle',strategy='none',population='rulers',timing='after')=>data.cells.find(c=>c.label===label&&c.curve===curve&&c.strategy===strategy&&c.population===population&&c.timing===timing);
const readiness=readinessReport(),samples=[];
for(const strategy of ['adoption','births','appointment']){
 let picked=null;
 for(let offset=0;offset<1000;offset++){
  const seed=data.seed+offset,r=simulate(setup('1710',seed),{seed,ticks:30,strategy,curve:'middle',population:'families',timing:'after',trace:true});
  if(!picked||r.counters.regencies>picked.result.counters.regencies)picked={seed,result:r};
  if(strategy==='appointment'?r.counters.committedRulerDeaths>=4:r.counters.regencies>0) {picked={seed,result:r};break;}
 }
 samples.push({strategy,seed:picked.seed,config:{scenario:'1710',ticks:30,curve:'middle',population:'families',timing:'after'},...picked.result});
}
const small=samples.map(s=>({strategy:s.strategy,seed:s.seed,config:s.config,counters:s.counters,cast:s.cast,timeline:s.timeline}));
fs.writeFileSync(path.join(target,'character-engine-m2b2a-samples.json'),JSON.stringify({label:data.label,readiness,samples:small},null,2)+'\n');
const lines=[
 '# Character Engine M2B-2a — offline modelling analysis',
 '',
 '31 October 2026. **All probabilities, growth strategies and numerical settings below are UNAPPROVED ILLUSTRATIVE PROPOSALS for review, not historical estimates or live game policy.** No production source, UI, dialogue, save schema or game resolver was changed. No Site deployment.',
 '',
 '## Reproduction and scope',
 '',
 `Master seed **${data.seed}**; **${data.runs.toLocaleString('en-US')} campaigns per cell**, ${data.cells.length} cells, **${(data.runs*data.cells.length).toLocaleString('en-US')} synthetic campaigns total**. Five horizons × three curves × two exposure cohorts × four strategies × two age timings. Cells share seeds for paired comparison; overlapping horizons and identical scenario-age setups are correlated, not independent replications.`,
 '',
 '```sh',
 `node scripts/simulate-dynasties.mjs results.json ${data.runs} ${data.seed}`,
 'node scripts/report-dynasties.mjs results.json docs/narrative',
 'npm test',
 '```',
 '',
 'The JSON results file contains every cell, counters, death-age/tenure/cast/turnover/regency distributions (minimum, 5th percentile, median, 95th percentile, maximum). The companion samples file includes full labelled timelines and actual M2B-1 readiness reasons. CLI output contains no timestamp; identical code/config/seed produces identical bytes. PRNG is a deterministic non-cryptographic keyed hash of master/replicate seed, step, identity and draw purpose; it never consumes gameplay or an existing campaign’s character RNG. Setup passes an explicit seed to a fresh copy of the existing cast generator. The separate age audit uses seeds 1–1,000; experiment replicates use master seed plus replicate index.',
 '',
 '## Actual shipped baseline',
 '',
 'Existing setup generates eight rulers aged **35–55**, eight younger siblings aged **27–47** (each exactly eight younger than its ruler), and seven institutional advisers aged **30–50**. The Governor General secretary copies Bengal secretary age, so those are correlated. All four scenarios use the same age-generation code and matched seeds yield the same age arrays; their board affiliations, starting turns and campaign lengths differ. There are 23 people and eight original seats. Legacy “heir” is a category for a younger sibling: **no typed claimant, parent, spouse, child or designated successor is inferred**.',
 '',
 '| Scenario | Board rounds | New Turn ticks | Added age | Sample ruler mean / p05–p95 at start |',
 '|---|---:|---:|---:|---|'
];
for(const a of data.ageAudit)lines.push(`| ${a.scenario} | ${a.rounds} | ${a.ageTicks} | ${a.yearsAdded} | ${num(a.ages.rulers.mean)} / ${a.ages.rulers.p05}–${a.ages.rulers.p95} |`);
lines.push('',
 'A scenario includes its starting round: five rounds mean four +3 ticks, not five. Early Company and Company Under Siege have four ticks, Post Monopoly three, Long 1710 seven. No artificial final tick is added. The hypothetical horizon has **30 ticks / 90 abstract narrative years**, not 30 historical years, and ignores board termination purely for stress testing. Actual New Turn adds +3 once to every non-dead character (including exiles/missing people); this model begins with available people and adds no new fate categories. Mortality samples either pre-tick or post-tick ages, once per eligible starting-alive identity. Introduced people are not aged or sampled in their introduction tick. Stored death ages are post-tick ages under either comparison.',
 '',
 '## Illustrative mortality curves and ordering',
 '',
 '| Curve | 0–39 | 40–54 | 55–64 | 65–74 | 75–84 | 85+ |',
 '|---|---:|---:|---:|---:|---:|---:|'
);
for(const [name,p]of Object.entries(data.curves))lines.push(`| ${name} | ${p.map(pct).join(' | ')} |`);
lines.push('',
 'These are **per-New-Turn probabilities**, not annual death rates; never apply them three times per tick. If one only wanted a mathematical annual equivalent for a constant band, it is 1−(1−p)^(1/3), not p/3 exactly; no historical calibration is implied. The youngest band is a convenience, not an infant-mortality model. There is no health field, assumed illness, forced terminal age or mortality probability of one. The 85+ band stays constant at exceptional ages. The offline ledger permits >200 for a no-hard-cap stress test; actual app validation currently bounds age at 200, which remains a future live-design decision.',
 '',
 'Ruler-only exposes seated holders; small-families also exposes known sibling-category people and explicitly introduced household members, never institutional advisers. Relatives are resolved before rulers from the frozen risk cohort, so an heir who also dies cannot succeed. Active regent loss and titular death during active regency are blocked and counted because M2B-1 cannot safely represent those continuations. A regency reaching age 18 is explicitly ended **only in the hypothetical ledger** at the next tick; production New Turn does no such thing.',
 '',
 'No claimant / unresolved tie means the proposed exit is blocked and the ruler stays alive. This is a conservative continuity experiment, **not an unbiased estimate of realised mortality**. “Drawn exit” is mortality pressure; “committed death” is what these readiness assumptions permit. Report both. Valid-seat rate is a guard invariant, not proof that succession is ready.',
 '',
 '## Mortality pressure without invented heirs',
 '',
 'After-tick ruler-only baseline (no typed claims or introductions):',
 '',
 '| Horizon | Curve | Campaign has ≥1 drawn ruler exit | Committed death | No-heir campaign | Mean original rulers retained |',
 '|---|---|---:|---:|---:|---:|'
);
for(const h of ['1813','1710','1758','1710-long','hypothetical-30'])for(const curve of Object.keys(data.curves)){
 const c=get(h,curve);lines.push(`| ${h} | ${curve} | ${pct(c.anyDrawnExit)} | ${pct(c.anyRulerDeath)} | ${pct(c.anyNoHeir)} | ${num(c.retainedOriginal.mean)} / 8 |`);
}
lines.push('',
 'All baseline committed-death rates are zero because no supported successor exists. A natural-death draw is not evidence for inventing an heir or killing a ruler into a vacant seat.',
 '',
 '## Explicit hypothetical growth strategies',
 '',
 '- **none:** existing identities/claims only; no person or lineage added.',
 '- **adoption:** up to one prospective 16-year-old adoption per region, 12% per tick when ruler ≥30 and no eligible candidate. Records an adoptive parent, the incumbent’s realised claim, an adoption claim, and explicit guardianship; a living adult legacy sibling may be nominated guardian but is never turned into a parent/heir. No retroactive birth biography. Default recognised-claim policy remains unchanged.',
 '- **births:** start with eight explicitly synthetic adult spouses aged 30 (counted in cast growth), then 10% per eligible couple per tick, both alive, ages 18–55. A new child starts at zero; parent edges are prospective and explicit. A separate hypothetical recognition grants a designation claim and the spouse is explicitly guardian. No new marriages/re-marriages after setup. This deliberately conservative family model does not magically supply future spouses to every grown child. Multiple recognised children can create unresolved ties; no primogeniture/gender rule is invented.',
 '- **appointment:** only after a drawn exit and no eligible claimant, introduce an unrelated adult aged 28 with an explicit model-only witnessed-authority claim. Existing candidate evaluator still checks age/availability/region/office; no parent edges or inherited memories. Never bypass a tie; Company-controlled seats are excluded. This is a hypothesis about future documented court appointments, **not** production generator or approval of Company settlement.',
 '',
 'All strategies cap total ever-recorded cast at **64**, including dead identities; nothing is deleted to free space. 12%, 10%, ages 16/28/30, age-55 fertility boundary and cap 64 are sensitivity assumptions, not accepted defaults. There is no fabricated initial family tree for the original 23.',
 '',
 '## Strategy and exposure results',
 '',
 'Middle curve, after tick. Blocked = rejected drawn ruler exits / all drawn ruler exits. Counts per campaign unless stated; cast and turnover include p05–p95 ranges.',
 '',
 '| Horizon | Exposure | Strategy | Any death | Any no-heir | Blocked | Turnover mean [p05–p95] | Cast mean [p05–p95] | Regencies mean | Widows mean | Ties total | Valid seats |',
 '|---|---|---|---:|---:|---:|---|---|---:|---:|---:|---:|'
);
for(const h of ['1813','1710','1710-long','hypothetical-30'])for(const population of ['rulers','families'])for(const strategy of ['none','adoption','births','appointment']){
 const c=get(h,'middle',strategy,population),t=c.totals;lines.push(`| ${h} | ${population} | ${strategy} | ${pct(c.anyRulerDeath)} | ${pct(c.anyNoHeir)} | ${t.drawnRulerExits?pct(t.blockedExits/t.drawnRulerExits):'—'} | ${num(c.turnover.mean)} [${c.turnover.p05}–${c.turnover.p95}] | ${num(c.cast.mean)} [${c.cast.p05}–${c.cast.p95}] | ${num(c.regency.mean)} | ${num(t.widowOpportunities/c.runs)} | ${t.ties} | ${pct(c.validSeatRate)} |`);
}
lines.push('',
 '“Widow opportunity” counts a recorded spouse surviving the partner’s modelled death; it does not mean an eligible succession claim, automatic marriage, regency or approved story. Ruler-only leaves spouses unexposed, so its opportunity rate is intentionally more optimistic than family exposure. Ties include candidate or regent ambiguity; an incumbent cannot act as regent after its own exit.',
 '',
 '## Timing and tenure sensitivity',
 '',
 '| Horizon | Curve | Before-tick drawn exit campaign | After-tick drawn exit campaign | Difference |',
 '|---|---|---:|---:|---:|'
);
for(const h of ['1813','1710','1710-long','hypothetical-30'])for(const curve of Object.keys(data.curves)){
 const b=get(h,curve,'none','rulers','before'),a=get(h,curve);lines.push(`| ${h} | ${curve} | ${pct(b.anyDrawnExit)} | ${pct(a.anyDrawnExit)} | ${((a.anyDrawnExit-b.anyDrawnExit)*100).toFixed(1)} pp |`);
}
lines.push('',
 '| Horizon | Strategy (middle/families/after) | Completed tenure mean / p05–p95 (ticks) | Surviving tenure median (right-censored) | Committed death age mean / p05–p95 | Retained originals mean / 8 |',
 '|---|---|---|---:|---|---:|'
);
for(const h of ['1710','1710-long','hypothetical-30'])for(const strategy of ['adoption','births','appointment']){
 const c=get(h,'middle',strategy,'families');lines.push(`| ${h} | ${strategy} | ${num(c.completedTenure.mean)} / ${c.completedTenure.p05??'—'}–${c.completedTenure.p95??'—'} | ${c.censoredTenure.median} | ${num(c.deathAges.mean)} / ${c.deathAges.p05??'—'}–${c.deathAges.p95??'—'} | ${num(c.retainedOriginal.mean)} |`);
}
lines.push('',
 '**Tenure warning:** these are completed observed reign segments, not expected lifetime reigns. The initial ruler’s earlier tenure is unknown (left-truncated); reigns still active at horizon end are reported separately as right-censored, never treated as completed deaths. Death-age distribution here includes eligible relative deaths under family exposure as well as rulers. Blocked exits censor actual mortality and may leave very old rulers. For a 1,000-run probability estimate the worst-case approximate 95% Monte Carlo margin is ±3.1 percentage points; distribution tails and rare regencies have greater relative uncertainty. These descriptive runs are neither historical evidence nor an optimized statistical fit.',
 '',
 '## Existing evaluator readiness: controlled fixtures',
 '',
 'These use the actual M2B-1 selector, with pre-existing explicit M2A fixture provenance; they are not newly generated people in an ordinary save. Adopted claimant is explicitly made adult/recognised for that named controlled case.',
 '',
 '| Fixture | Evaluator | Transaction ready | Reason / selected identity |',
 '|---|---|---|---|'
);
for(const r of readiness)lines.push(`| ${r.name} | ${r.evaluatorStatus} | ${r.transactionReady} | ${r.block||JSON.stringify(r.chosen)} |`);
lines.push('',
 'Candidate eligibility alone is insufficient: active regency can leave eligible alternatives while the atomic executor still refuses a new succession. The model reports that block. Claims are not inferred from legacy sibling category, a spouse, a house name or age.',
 '',
 '## Readable synthetic histories',
 '',
 'These are illustrative ledger events, not literary scenes, historic claims, production saves or evidence of live generation. Full traces and fixtures are in `character-engine-m2b2a-samples.json`.'
);
for(const sample of small){
 lines.push('',`### ${sample.strategy}, seed ${sample.seed}`, '',`30 ticks, middle curve, family exposure, after-tick. ${sample.counters.committedRulerDeaths} ruler deaths, ${sample.counters.regencies} regencies, ${sample.counters.blockedExits} blocked exits, final recorded cast ${sample.cast}.`,'');
 const focus=sample.timeline.find(e=>e.type==='hypothetical-succession'&&e.regent)?.region||'delhi';
 lines.push(`Focus: **${focus}**${focus!=='delhi'?' (chosen to show the first recorded regency)':''}.`,'');
 const relevant=sample.timeline.filter(e=>e.region===focus||e.id?.includes(focus)||e.ruler?.includes(focus));
 for(const e of relevant.slice(0,18))lines.push(`- Tick ${e.step}: ${e.type}; ${JSON.stringify(Object.fromEntries(Object.entries(e).filter(([k])=>!['step','type'].includes(k))))}`);
 if(!relevant.length)lines.push('- This region has no selected event in this replicate; no story is invented.');
 if(relevant.length>18)lines.push('- Further entries are in the full JSON trace; no events are removed there.');
}
lines.push('',
 '## Candidate recommendation for review — not authorization',
 '',
 '1. Keep **age-only, after the single +3 tick** as the simplest candidate boundary; do not add invented health. Compare the **restrained to middle** curves as a tuning window, retaining elevated as a stress test rather than a default. Decide an acceptable *campaign-level* death frequency first: eight simultaneous rulers compound even small individual risks. Numerical results above concern all eight seats, not one ruler.',
 '2. Do not enable mortality against the current unclaimed starting roster: its zero succession readiness is structural. Births cannot mature in three/four short-game ticks; even seven ticks provide little time. Nonfatal explicit adoption/introduction can improve readiness without inventing ancestry, but needs authored identity/provenance policy. Court appointment is a separate culturally/institutionally sensitive fallback; its much better continuity result is conditional on assumptions, and excludes Company control.',
 '3. Prefer ruler-only exposure for a first limited candidate, pending review of narrative burden and safe regent/relative-death handling. Broader household mortality consumes guardians and creates additional gaps; it should not be silently bundled with ruler mortality.',
 '4. Keep tied claims unresolved until a culturally defensible approved contextual policy exists. Do not use lexical order, universal male preference or player heir-management controls. Require active-regency re-succession and regent loss to be designed before any live child-ruler rollout.',
 '5. For long games, do not scale rare events up just to show them. The one-adoption policy and initial-couple-only births are intentionally limited: repeated continuity eventually needs separately approved introductions/marriage/appointee policy. Review cast **64** against lower caps and actual narrative usefulness; this is an experiment cap, not an approved live population limit.',
 '',
 '## Limitations and next approval boundary',
 '',
 'No battles, illnesses, gender-specific lifespans, physical game endings, hidden events, player officeholders, historic demography or personality-based fertility are simulated. No live RNG or resolver, pending roll, 81-scene catalogue, saves, UI, import/export or Undo/Redo implementation changed. Ledger transitions are **not** claimed to be valid application succession transactions: actual atomic transactions remain the existing M2B-1 controlled API and its regression suite. The reused selector assumes valid input; our hypothetical ledger records explicit source labels but is not a production save/provenance validator. No generated JSON can be imported as a campaign. Sampling refusal is reported rather than secretly resurrecting a deceased character; blocked deaths never commit in the model.',
 '',
 'Readiness, adult age 18, regency adulthood, appointment policy, ties, population cap and mortality curves require further review before M2B-2b. No probability or fictional output is creatively approved by passing tests. **No live mortality, births, succession, new characters, dialogue or UI has been enabled.**',
 ''
);
fs.writeFileSync(path.join(target,'character-engine-m2b2a-analysis.md'),lines.join('\n'));
