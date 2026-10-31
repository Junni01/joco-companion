// Rebuilds numerical review tables; nothing here is production policy.
import fs from 'node:fs';
const [file,out]=process.argv.slice(2);if(!file||!out)throw Error('Usage: node scripts/report-readiness.mjs results.json analysis.md');
const data=JSON.parse(fs.readFileSync(file,'utf8')),pct=v=>(v*100).toFixed(1)+'%',num=v=>v===null?'—':v.toFixed(2),range=v=>`${num(v.mean)} [${v.p05}–${v.p95}]`;
const lines=[
 '# M2B-2b-1 — succession-readiness simulation analysis',
 '',
 '31 October 2026. **UNAPPROVED ILLUSTRATIVE ASSUMPTIONS**, not live mortality/court triggers, historical rates or accepted character naming. This extends the M2B-2a model; all proposals require review.',
 '',
 `Master seed **${data.seed}**, **${data.runs} campaigns per cell**, **${data.cells.length} cells** (${data.runs*data.cells.length} synthetic campaigns per complete run). Four actual scenario horizons (3/4/4/7 +3 ticks) plus 30-tick hypothetical stress. Two candidate mortality curves (restrained/middle), ruler-only and small-family exposure, 12 strategies, after-tick sampling. The earlier elevated and before-tick sensitivity remains in the [M2B-2a analysis](character-engine-m2b2a-analysis.md). Matched seeds/horizons are correlated, not independent historical evidence.`,
 '',
 '```sh',
 `node scripts/simulate-readiness.mjs results.json ${data.runs} ${data.seed}`,
 'node scripts/report-readiness.mjs results.json docs/narrative/character-engine-m2b2b1-analysis.md',
 'node scripts/demo-readiness.mjs demo.json',
 'npm test',
 '```',
 '',
 '## Assumptions and strategy definitions',
 '',
 '- **Recognition:** 8% chance per region/tick of a hypothetical compatible witnessed court event. Only Indian courts, only when no eligible claimant, and only one supported existing person may be recognised without a tie policy. An original sibling has a recorded legacy sibling edge; no parent is invented. A new explicit designation is recorded in the model, not inferred from a name/category. It does not change core traits, gratitude or political control.',
 '- **Court:** separate 3% per-region/tick nonfatal witnessed court-introduction event. Introduce a 28-year-old minister with a witnessed-authority claim only if no supported existing person/eligible claimant or unresolved living claim blocks the plan. This does **not** automatically grant every region a new heir. Court-only therefore often correctly does nothing while a known sibling needs documentation.',
 '- **Emergency (new combinations):** only after an independent hypothetical mortality draw. Prefer explicit recognition of one existing supported person; otherwise introduce an unrelated adult only when no living unresolved claimant remains. No Company appointments and no tie bypass. This differs deliberately from the old M2B-2a `appointment` comparator, which assumed immediate new unrelated appointees without the new reuse-first contract.',
 '- **Existing comparators:** none, one prospective adoption per region (12%/tick when needed), initial explicitly synthetic spouses plus births/recognition (10%/eligible couple/tick), and old immediate appointment. Their original numerical assumptions are preserved. New combined policies can include recognition plus adoption or births; these are hypotheses, not claims that live event evidence or production naming already exists.',
 '- **No hidden backfill:** no heir/claim is added at setup by recognition/court/emergency policies. Births comparator alone explicitly starts with eight synthetic spouses, counted in growth. No added person inherits old memories, quotations, parentage or a dynasty by proximity to the throne.',
 '- **Shared constraints:** adulthood 18, introduced people not aged/sampled in their introduction tick, fixed +3, total recorded cast cap 64 including dead people. No health/illness state, no hard death cap. Protected gameplay is absent from this offline model. Active-regency death/regent-loss and ties remain counted blocks. Hypothetical adulthood closes regency in the ledger only; production still does not do so.',
 '',
 '8%, 3%, 12%, 10%, ages 16/28/30, fertility window 18–55 and cap 64 are **candidate assumptions, not approved defaults**. Pure M2B-1 eligibility is reused. The offline ledger is not a validated application save; actual court/claim provenance and atomic transactions are separately exercised by the controlled fixture tests.',
 '',
 '## Primary comparisons',
 '',
 'Middle curve / small-family exposure / after tick. “Ready ticks” = fraction of region-end-of-tick states with a policy-selected candidate and no active regency, **not** the percentage of future deaths safely resolved. Mean [p05–p95] describes the campaign distribution. Original retained is mean / 8. No-heir campaign is any blocked exit for missing eligibility; active-tenure blocks and ties are separate totals in the JSON.',
 '',
 '| Horizon | Strategy | Ready ticks | No-heir campaign | No-heir blocks mean | Turnover mean [p05–p95] | Regencies mean [p05–p95] | Cast mean [p05–p95] | Original retained |',
 '|---|---|---:|---:|---:|---|---|---|---:|'
];
for(const ticks of [3,4,7,30])for(const strategy of ['none','recognition','court','recognition-court','recognition-adoption','recognition-births','appointment','recognition-emergency','court-emergency','recognition-court-emergency']){
 const c=data.cells.find(c=>c.config.ticks===ticks&&c.config.curve==='middle'&&c.config.population==='families'&&c.config.strategy===strategy);lines.push(`| ${ticks===3?'1813':ticks===4?'1710':ticks===7?'1710-long':'hypothetical-30'} | ${strategy} | ${pct(c.availability)} | ${pct(c.anyNoHeir)} | ${num(c.noHeir.mean)} | ${range(c.turnover)} | ${range(c.regencies)} | ${range(c.cast)} | ${num(c.retainedOriginal.mean)} |`);
}
lines.push('',
 '1758 has the same four-tick age horizon as 1710 but starts with Company Bengal. Full results for it remain in the JSON; Company-policy exclusions can therefore produce different rates despite identical starting ages.',
 '',
 '## Curve and household-exposure sensitivity',
 '',
 '| Horizon | Curve | Exposure | Strategy | Any committed ruler death | Original retained | Cast mean | Contested blocks total |',
 '|---|---|---|---|---:|---:|---:|---:|'
);
for(const ticks of [3,4,7,30])for(const curve of ['restrained','middle'])for(const population of ['rulers','families'])for(const strategy of ['recognition-court','recognition-court-emergency']){
 const c=data.cells.find(c=>c.config.ticks===ticks&&c.config.curve===curve&&c.config.population===population&&c.config.strategy===strategy);lines.push(`| ${ticks} ticks | ${curve} | ${population} | ${strategy} | ${pct(c.anyRulerDeath)} | ${num(c.retainedOriginal.mean)} | ${num(c.cast.mean)} | ${c.totals.ties} |`);
}
lines.push('',
 '## Readiness bias, limits and recommended candidates for review',
 '',
 '1. **Missing documentation is not mortality immunity.** The safe model retains rulers when no successor can be installed; those are explicitly blocked exits. Its 100% valid-seat rate is a guard invariant, not proof that a policy is ready. Compare drawn exits, actual turnover, retained originals and no-heir blocks together. Never report blocked rulers as naturally surviving an independently committed death.',
 '2. **Recognition first is a useful nonfatal candidate**, because it can reuse the known sibling without cast growth or invented ancestry. At an illustrative 8% court-event rate, short games still leave substantial readiness gaps: this is intentionally rare, not a guaranteed heir pipeline. Selecting exact real triggers, frequencies, names and prose belongs to separately approved M2B-2b-2.',
 '3. **New court figures are conditional, not universal.** Refusing to generate an outsider while a suitable known person awaits recognition is desirable. Nonfatal court-only strategy can therefore look ineffective; the relevant combined policy is recognition + court, with unresolved-claim protection intact.',
 '4. **Emergency fallback reduces no-heir bias conditionally**, but requires a separately warranted exit and real atomic evidence. It cannot solve Company appointment policy, tied claims or active-regency handling. No live mortality should launch on the assumption that every draw can simply generate an appointee.',
 '5. **Long games expose exhausted one-generation policies.** Record all people, including deceased holders; cap 64 is only an experiment assumption. Repeated family/marriage growth and cross-region histories remain future design. No deletion of inconvenient dead people or automatic regent to ruler promotion is used.',
 '6. Keep the restrained-to-middle, age-only, post-+3, ruler-only window from M2B-2a as **candidates for later review**, not new defaults. Family exposure increases lost-heir/guardian gaps. A death is never inferred from battle, officer loss, tax, old age or a read of the dossier.',
 '',
 'For 1,000 seeded replicates, a probability near 50% has an approximate worst-case ±3.1 percentage-point Monte Carlo margin. Rare-event tails have much larger relative uncertainty. These keyed deterministic draws are illustrative sensitivity experiments, not historical demography or a fit to observational data. Initial reigns have unknown pre-campaign tenure (left truncation); surviving segments are right-censored. Both completed and censored tenure distributions are retained in the JSON; do not average survivors as completed reigns.',
 '',
 'The pure readiness and controlled transaction demonstrations are in [the small demo](character-engine-m2b2b1-demo.md). Exceptional-regency and cross-region contracts remain blocked for the exact reasons documented in [implementation](character-engine-m2b2b1-implementation.md). No live deaths, births, marriages, regency changes, recognition, court appointments or new identities are enabled. No Site deployment.',
 ''
);
fs.writeFileSync(out,lines.join('\n'));
