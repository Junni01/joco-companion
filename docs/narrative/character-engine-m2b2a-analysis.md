# Character Engine M2B-2a — offline modelling analysis

31 October 2026. **All probabilities, growth strategies and numerical settings below are UNAPPROVED ILLUSTRATIVE PROPOSALS for review, not historical estimates or live game policy.** No production source, UI, dialogue, save schema or game resolver was changed. No Site deployment.

## Reproduction and scope

Master seed **90210**; **1,000 campaigns per cell**, 240 cells, **240,000 synthetic campaigns total**. Five horizons × three curves × two exposure cohorts × four strategies × two age timings. Cells share seeds for paired comparison; overlapping horizons and identical scenario-age setups are correlated, not independent replications.

```sh
node scripts/simulate-dynasties.mjs results.json 1000 90210
node scripts/report-dynasties.mjs results.json docs/narrative
npm test
```

The JSON results file contains every cell, counters, death-age/tenure/cast/turnover/regency distributions (minimum, 5th percentile, median, 95th percentile, maximum). The companion samples file includes full labelled timelines and actual M2B-1 readiness reasons. CLI output contains no timestamp; identical code/config/seed produces identical bytes. PRNG is a deterministic non-cryptographic keyed hash of master/replicate seed, step, identity and draw purpose; it never consumes gameplay or an existing campaign’s character RNG. Setup passes an explicit seed to a fresh copy of the existing cast generator. The separate age audit uses seeds 1–1,000; experiment replicates use master seed plus replicate index.

## Actual shipped baseline

Existing setup generates eight rulers aged **35–55**, eight younger siblings aged **27–47** (each exactly eight younger than its ruler), and seven institutional advisers aged **30–50**. The Governor General secretary copies Bengal secretary age, so those are correlated. All four scenarios use the same age-generation code and matched seeds yield the same age arrays; their board affiliations, starting turns and campaign lengths differ. There are 23 people and eight original seats. Legacy “heir” is a category for a younger sibling: **no typed claimant, parent, spouse, child or designated successor is inferred**.

| Scenario | Board rounds | New Turn ticks | Added age | Sample ruler mean / p05–p95 at start |
|---|---:|---:|---:|---|
| 1710 | 5 | 4 | 12 | 44.90 / 36–54 |
| 1758 | 5 | 4 | 12 | 44.90 / 36–54 |
| 1813 | 4 | 3 | 9 | 44.90 / 36–54 |
| 1710-long | 8 | 7 | 21 | 44.90 / 36–54 |

A scenario includes its starting round: five rounds mean four +3 ticks, not five. Early Company and Company Under Siege have four ticks, Post Monopoly three, Long 1710 seven. No artificial final tick is added. The hypothetical horizon has **30 ticks / 90 abstract narrative years**, not 30 historical years, and ignores board termination purely for stress testing. Actual New Turn adds +3 once to every non-dead character (including exiles/missing people); this model begins with available people and adds no new fate categories. Mortality samples either pre-tick or post-tick ages, once per eligible starting-alive identity. Introduced people are not aged or sampled in their introduction tick. Stored death ages are post-tick ages under either comparison.

## Illustrative mortality curves and ordering

| Curve | 0–39 | 40–54 | 55–64 | 65–74 | 75–84 | 85+ |
|---|---:|---:|---:|---:|---:|---:|
| restrained | 0.2% | 0.4% | 1.2% | 3.5% | 9.0% | 18.0% |
| middle | 0.4% | 0.8% | 2.5% | 7.0% | 16.0% | 30.0% |
| elevated | 0.8% | 1.6% | 5.0% | 13.0% | 27.0% | 45.0% |

These are **per-New-Turn probabilities**, not annual death rates; never apply them three times per tick. If one only wanted a mathematical annual equivalent for a constant band, it is 1−(1−p)^(1/3), not p/3 exactly; no historical calibration is implied. The youngest band is a convenience, not an infant-mortality model. There is no health field, assumed illness, forced terminal age or mortality probability of one. The 85+ band stays constant at exceptional ages. The offline ledger permits >200 for a no-hard-cap stress test; actual app validation currently bounds age at 200, which remains a future live-design decision.

Ruler-only exposes seated holders; small-families also exposes known sibling-category people and explicitly introduced household members, never institutional advisers. Relatives are resolved before rulers from the frozen risk cohort, so an heir who also dies cannot succeed. Active regent loss and titular death during active regency are blocked and counted because M2B-1 cannot safely represent those continuations. A regency reaching age 18 is explicitly ended **only in the hypothetical ledger** at the next tick; production New Turn does no such thing.

No claimant / unresolved tie means the proposed exit is blocked and the ruler stays alive. This is a conservative continuity experiment, **not an unbiased estimate of realised mortality**. “Drawn exit” is mortality pressure; “committed death” is what these readiness assumptions permit. Report both. Valid-seat rate is a guard invariant, not proof that succession is ready.

## Mortality pressure without invented heirs

After-tick ruler-only baseline (no typed claims or introductions):

| Horizon | Curve | Campaign has ≥1 drawn ruler exit | Committed death | No-heir campaign | Mean original rulers retained |
|---|---|---:|---:|---:|---:|
| 1813 | restrained | 15.7% | 0.0% | 15.7% | 8.00 / 8 |
| 1813 | middle | 30.6% | 0.0% | 30.6% | 8.00 / 8 |
| 1813 | elevated | 49.5% | 0.0% | 49.5% | 8.00 / 8 |
| 1710 | restrained | 24.5% | 0.0% | 24.5% | 8.00 / 8 |
| 1710 | middle | 43.8% | 0.0% | 43.8% | 8.00 / 8 |
| 1710 | elevated | 65.6% | 0.0% | 65.6% | 8.00 / 8 |
| 1758 | restrained | 24.5% | 0.0% | 24.5% | 8.00 / 8 |
| 1758 | middle | 43.8% | 0.0% | 43.8% | 8.00 / 8 |
| 1758 | elevated | 65.6% | 0.0% | 65.6% | 8.00 / 8 |
| 1710-long | restrained | 56.0% | 0.0% | 56.0% | 8.00 / 8 |
| 1710-long | middle | 80.8% | 0.0% | 80.8% | 8.00 / 8 |
| 1710-long | elevated | 94.5% | 0.0% | 94.5% | 8.00 / 8 |
| hypothetical-30 | restrained | 100.0% | 0.0% | 100.0% | 8.00 / 8 |
| hypothetical-30 | middle | 100.0% | 0.0% | 100.0% | 8.00 / 8 |
| hypothetical-30 | elevated | 100.0% | 0.0% | 100.0% | 8.00 / 8 |

All baseline committed-death rates are zero because no supported successor exists. A natural-death draw is not evidence for inventing an heir or killing a ruler into a vacant seat.

## Explicit hypothetical growth strategies

- **none:** existing identities/claims only; no person or lineage added.
- **adoption:** up to one prospective 16-year-old adoption per region, 12% per tick when ruler ≥30 and no eligible candidate. Records an adoptive parent, the incumbent’s realised claim, an adoption claim, and explicit guardianship; a living adult legacy sibling may be nominated guardian but is never turned into a parent/heir. No retroactive birth biography. Default recognised-claim policy remains unchanged.
- **births:** start with eight explicitly synthetic adult spouses aged 30 (counted in cast growth), then 10% per eligible couple per tick, both alive, ages 18–55. A new child starts at zero; parent edges are prospective and explicit. A separate hypothetical recognition grants a designation claim and the spouse is explicitly guardian. No new marriages/re-marriages after setup. This deliberately conservative family model does not magically supply future spouses to every grown child. Multiple recognised children can create unresolved ties; no primogeniture/gender rule is invented.
- **appointment:** only after a drawn exit and no eligible claimant, introduce an unrelated adult aged 28 with an explicit model-only witnessed-authority claim. Existing candidate evaluator still checks age/availability/region/office; no parent edges or inherited memories. Never bypass a tie; Company-controlled seats are excluded. This is a hypothesis about future documented court appointments, **not** production generator or approval of Company settlement.

All strategies cap total ever-recorded cast at **64**, including dead identities; nothing is deleted to free space. 12%, 10%, ages 16/28/30, age-55 fertility boundary and cap 64 are sensitivity assumptions, not accepted defaults. There is no fabricated initial family tree for the original 23.

## Strategy and exposure results

Middle curve, after tick. Blocked = rejected drawn ruler exits / all drawn ruler exits. Counts per campaign unless stated; cast and turnover include p05–p95 ranges.

| Horizon | Exposure | Strategy | Any death | Any no-heir | Blocked | Turnover mean [p05–p95] | Cast mean [p05–p95] | Regencies mean | Widows mean | Ties total | Valid seats |
|---|---|---|---:|---:|---:|---|---|---:|---:|---:|---:|
| 1813 | rulers | none | 0.0% | 30.6% | 100.0% | 0.00 [0–0] | 23.00 [23–23] | 0.00 | 0.00 | 0 | 100.0% |
| 1813 | rulers | adoption | 8.1% | 24.2% | 76.4% | 0.09 [0–1] | 25.54 [24–28] | 0.04 | 0.00 | 0 | 100.0% |
| 1813 | rulers | births | 4.8% | 26.9% | 86.4% | 0.05 [0–0] | 32.76 [31–35] | 0.05 | 0.05 | 1 | 100.0% |
| 1813 | rulers | appointment | 20.1% | 12.7% | 38.3% | 0.22 [0–1] | 23.22 [23–24] | 0.00 | 0.00 | 0 | 100.0% |
| 1813 | families | none | 0.0% | 30.6% | 100.0% | 0.00 [0–0] | 23.00 [23–23] | 0.00 | 0.00 | 0 | 100.0% |
| 1813 | families | adoption | 8.0% | 24.3% | 76.7% | 0.08 [0–1] | 25.54 [24–28] | 0.04 | 0.00 | 0 | 100.0% |
| 1813 | families | births | 4.5% | 27.2% | 87.2% | 0.05 [0–0] | 32.75 [31–35] | 0.05 | 0.15 | 1 | 100.0% |
| 1813 | families | appointment | 20.1% | 12.7% | 38.3% | 0.22 [0–1] | 23.22 [23–24] | 0.00 | 0.00 | 0 | 100.0% |
| 1710 | rulers | none | 0.0% | 43.8% | 100.0% | 0.00 [0–0] | 23.00 [23–23] | 0.00 | 0.00 | 0 | 100.0% |
| 1710 | rulers | adoption | 16.7% | 31.7% | 67.4% | 0.18 [0–1] | 26.22 [24–28] | 0.06 | 0.00 | 0 | 100.0% |
| 1710 | rulers | births | 6.6% | 39.3% | 88.0% | 0.07 [0–1] | 33.10 [31–36] | 0.07 | 0.07 | 4 | 100.0% |
| 1710 | rulers | appointment | 43.8% | 0.0% | 0.0% | 0.55 [0–2] | 23.55 [23–25] | 0.00 | 0.00 | 0 | 100.0% |
| 1710 | families | none | 0.0% | 43.8% | 100.0% | 0.00 [0–0] | 23.00 [23–23] | 0.00 | 0.00 | 0 | 100.0% |
| 1710 | families | adoption | 16.6% | 31.8% | 67.6% | 0.18 [0–1] | 26.22 [24–28] | 0.06 | 0.00 | 0 | 100.0% |
| 1710 | families | births | 6.3% | 39.7% | 88.6% | 0.06 [0–1] | 33.09 [31–36] | 0.06 | 0.23 | 3 | 100.0% |
| 1710 | families | appointment | 43.8% | 0.0% | 0.0% | 0.55 [0–2] | 23.55 [23–25] | 0.00 | 0.00 | 0 | 100.0% |
| 1710-long | rulers | none | 0.0% | 80.8% | 100.0% | 0.00 [0–0] | 23.00 [23–23] | 0.00 | 0.00 | 0 | 100.0% |
| 1710-long | rulers | adoption | 53.8% | 55.6% | 53.8% | 0.74 [0–2] | 27.74 [25–30] | 0.13 | 0.00 | 0 | 100.0% |
| 1710-long | rulers | births | 20.6% | 74.5% | 86.0% | 0.23 [0–1] | 33.42 [31–36] | 0.20 | 0.23 | 20 | 100.0% |
| 1710-long | rulers | appointment | 80.8% | 0.0% | 0.0% | 1.50 [0–4] | 24.50 [23–27] | 0.00 | 0.00 | 0 | 100.0% |
| 1710-long | families | none | 0.0% | 80.8% | 100.0% | 0.00 [0–0] | 23.00 [23–23] | 0.00 | 0.00 | 0 | 100.0% |
| 1710-long | families | adoption | 52.8% | 56.5% | 54.9% | 0.72 [0–2] | 27.74 [25–30] | 0.12 | 0.00 | 0 | 100.0% |
| 1710-long | families | births | 19.7% | 75.1% | 86.5% | 0.22 [0–1] | 33.40 [31–36] | 0.20 | 0.55 | 19 | 100.0% |
| 1710-long | families | appointment | 80.8% | 0.0% | 0.0% | 1.50 [0–4] | 24.50 [23–27] | 0.00 | 0.00 | 0 | 100.0% |
| hypothetical-30 | rulers | none | 0.0% | 100.0% | 100.0% | 0.00 [0–0] | 23.00 [23–23] | 0.00 | 0.00 | 0 | 100.0% |
| hypothetical-30 | rulers | adoption | 100.0% | 100.0% | 68.1% | 7.76 [7–8] | 30.84 [30–31] | 0.73 | 0.00 | 0 | 100.0% |
| hypothetical-30 | rulers | births | 85.4% | 100.0% | 95.9% | 1.72 [0–4] | 33.42 [31–36] | 0.27 | 1.72 | 1873 | 100.0% |
| hypothetical-30 | rulers | appointment | 100.0% | 0.0% | 0.0% | 13.12 [10–16] | 36.12 [33–39] | 0.00 | 0.00 | 0 | 100.0% |
| hypothetical-30 | families | none | 0.0% | 100.0% | 100.0% | 0.00 [0–0] | 23.00 [23–23] | 0.00 | 0.00 | 0 | 100.0% |
| hypothetical-30 | families | adoption | 100.0% | 100.0% | 70.8% | 7.39 [6–8] | 30.84 [30–31] | 0.34 | 0.00 | 0 | 100.0% |
| hypothetical-30 | families | births | 87.7% | 100.0% | 95.7% | 1.81 [0–4] | 33.40 [31–36] | 0.26 | 7.96 | 1278 | 100.0% |
| hypothetical-30 | families | appointment | 100.0% | 0.0% | 0.0% | 13.12 [10–16] | 36.12 [33–39] | 0.00 | 0.00 | 0 | 100.0% |

“Widow opportunity” counts a recorded spouse surviving the partner’s modelled death; it does not mean an eligible succession claim, automatic marriage, regency or approved story. Ruler-only leaves spouses unexposed, so its opportunity rate is intentionally more optimistic than family exposure. Ties include candidate or regent ambiguity; an incumbent cannot act as regent after its own exit.

## Timing and tenure sensitivity

| Horizon | Curve | Before-tick drawn exit campaign | After-tick drawn exit campaign | Difference |
|---|---|---:|---:|---:|
| 1813 | restrained | 12.5% | 15.7% | 3.2 pp |
| 1813 | middle | 25.3% | 30.6% | 5.3 pp |
| 1813 | elevated | 43.3% | 49.5% | 6.2 pp |
| 1710 | restrained | 18.1% | 24.5% | 6.4 pp |
| 1710 | middle | 35.3% | 43.8% | 8.5 pp |
| 1710 | elevated | 55.6% | 65.6% | 10.0 pp |
| 1710-long | restrained | 44.3% | 56.0% | 11.7 pp |
| 1710-long | middle | 71.3% | 80.8% | 9.5 pp |
| 1710-long | elevated | 90.0% | 94.5% | 4.5 pp |
| hypothetical-30 | restrained | 100.0% | 100.0% | 0.0 pp |
| hypothetical-30 | middle | 100.0% | 100.0% | 0.0 pp |
| hypothetical-30 | elevated | 100.0% | 100.0% | 0.0 pp |

| Horizon | Strategy (middle/families/after) | Completed tenure mean / p05–p95 (ticks) | Surviving tenure median (right-censored) | Committed death age mean / p05–p95 | Retained originals mean / 8 |
|---|---|---|---:|---|---:|
| 1710 | adoption | 3.19 / 1–4 | 4 | 49.96 / 25–66 | 7.82 |
| 1710 | births | 2.70 / 1–4 | 4 | 44.24 / 33–58 | 7.94 |
| 1710 | appointment | 2.78 / 1–4 | 4 | 53.46 / 39–66 | 7.46 |
| 1710-long | adoption | 5.43 / 2–7 | 7 | 57.93 / 34–73 | 7.28 |
| 1710-long | births | 5.15 / 1–7 | 7 | 51.02 / 33–67 | 7.78 |
| 1710-long | appointment | 4.89 / 1–7 | 7 | 60.01 / 42–74 | 6.52 |
| hypothetical-30 | adoption | 13.93 / 6–24 | 17 | 82.27 / 56–110 | 0.61 |
| hypothetical-30 | births | 13.75 / 5–26 | 30 | 79.17 / 55–102 | 6.20 |
| hypothetical-30 | appointment | 12.82 / 4–20 | 8 | 77.90 / 55–99 | 0.00 |

**Tenure warning:** these are completed observed reign segments, not expected lifetime reigns. The initial ruler’s earlier tenure is unknown (left-truncated); reigns still active at horizon end are reported separately as right-censored, never treated as completed deaths. Death-age distribution here includes eligible relative deaths under family exposure as well as rulers. Blocked exits censor actual mortality and may leave very old rulers. For a 1,000-run probability estimate the worst-case approximate 95% Monte Carlo margin is ±3.1 percentage points; distribution tails and rare regencies have greater relative uncertainty. These descriptive runs are neither historical evidence nor an optimized statistical fit.

## Existing evaluator readiness: controlled fixtures

These use the actual M2B-1 selector, with pre-existing explicit M2A fixture provenance; they are not newly generated people in an ordinary save. Adopted claimant is explicitly made adult/recognised for that named controlled case.

| Fixture | Evaluator | Transaction ready | Reason / selected identity |
|---|---|---|---|
| legacy | none | false | no-qualified-candidate |
| adult | selected | true | {"characterId":"demo-son","claimId":"son-claim","regentId":null} |
| daughter | selected | true | {"characterId":"demo-daughter","claimId":"daughter-claim","regentId":null} |
| adopted | selected | true | {"characterId":"demo-adopted","claimId":"adopted-claim","regentId":null} |
| minor | selected | true | {"characterId":"demo-child","claimId":"child-claim","regentId":"demo-widow"} |
| minor-no-regent | none | false | no-qualified-candidate |
| tied | ambiguous | false | controlled-candidate-choice-required |
| elderly-sole | none | false | no-qualified-candidate |
| active-regency | ambiguous | false | M2B-1 active-regency transaction guard |

Candidate eligibility alone is insufficient: active regency can leave eligible alternatives while the atomic executor still refuses a new succession. The model reports that block. Claims are not inferred from legacy sibling category, a spouse, a house name or age.

## Readable synthetic histories

These are illustrative ledger events, not literary scenes, historic claims, production saves or evidence of live generation. Full traces and fixtures are in `character-engine-m2b2a-samples.json`.

### adoption, seed 90211

30 ticks, middle curve, family exposure, after-tick. 7 ruler deaths, 2 regencies, 14 blocked exits, final recorded cast 30.

Focus: **hyderabad** (chosen to show the first recorded regency).

- Tick 13: hypothetical-introduction; {"id":"model-hyderabad-6","region":"hyderabad","age":16,"kind":"prospective-adoption"}
- Tick 13: hypothetical-adoption; {"id":"model-hyderabad-6","region":"hyderabad","parent":"ruler-hyderabad"}
- Tick 13: hypothetical-succession; {"region":"hyderabad","from":"ruler-hyderabad","to":"model-hyderabad-6","age":90,"successorAge":16,"regent":"heir-hyderabad","claim":"claim-model-hyderabad-6"}
- Tick 14: hypothetical-regency-end; {"ruler":"model-hyderabad-6","regent":"heir-hyderabad"}
- Tick 15: hypothetical-relative-death; {"id":"heir-hyderabad","age":88}

### births, seed 90210

30 ticks, middle curve, family exposure, after-tick. 3 ruler deaths, 1 regencies, 46 blocked exits, final recorded cast 35.

Focus: **maratha** (chosen to show the first recorded regency).

- Tick 0: hypothetical-introduction; {"id":"model-maratha-5","region":"maratha","age":30,"kind":"synthetic-spouse"}
- Tick 6: hypothetical-introduction; {"id":"model-maratha-12","region":"maratha","age":0,"kind":"prospective-birth"}
- Tick 6: hypothetical-birth-and-recognition; {"id":"model-maratha-12","region":"maratha","parents":["ruler-maratha","model-maratha-5"]}
- Tick 11: hypothetical-succession; {"region":"maratha","from":"ruler-maratha","to":"model-maratha-12","age":68,"successorAge":15,"regent":"model-maratha-5","claim":"claim-model-maratha-12"}
- Tick 12: hypothetical-regency-end; {"ruler":"model-maratha-12","regent":"model-maratha-5"}
- Tick 22: hypothetical-relative-death; {"id":"heir-maratha","age":93}
- Tick 24: hypothetical-relative-death; {"id":"model-maratha-5","age":102}
- Tick 28: blocked-none; {"region":"maratha","id":"model-maratha-12","reason":"no-qualified-candidate"}
- Tick 30: blocked-none; {"region":"maratha","id":"model-maratha-12","reason":"no-qualified-candidate"}

### appointment, seed 90210

30 ticks, middle curve, family exposure, after-tick. 12 ruler deaths, 0 regencies, 0 blocked exits, final recorded cast 35.

Focus: **delhi**.

- Tick 14: hypothetical-introduction; {"id":"model-delhi-5","region":"delhi","age":28,"kind":"unrelated-court-appointee"}
- Tick 14: hypothetical-succession; {"region":"delhi","from":"ruler-delhi","to":"model-delhi-5","age":78,"successorAge":28,"regent":null,"claim":"claim-model-delhi-5"}
- Tick 17: hypothetical-relative-death; {"id":"heir-delhi","age":79}

## Candidate recommendation for review — not authorization

1. Keep **age-only, after the single +3 tick** as the simplest candidate boundary; do not add invented health. Compare the **restrained to middle** curves as a tuning window, retaining elevated as a stress test rather than a default. Decide an acceptable *campaign-level* death frequency first: eight simultaneous rulers compound even small individual risks. Numerical results above concern all eight seats, not one ruler.
2. Do not enable mortality against the current unclaimed starting roster: its zero succession readiness is structural. Births cannot mature in three/four short-game ticks; even seven ticks provide little time. Nonfatal explicit adoption/introduction can improve readiness without inventing ancestry, but needs authored identity/provenance policy. Court appointment is a separate culturally/institutionally sensitive fallback; its much better continuity result is conditional on assumptions, and excludes Company control.
3. Prefer ruler-only exposure for a first limited candidate, pending review of narrative burden and safe regent/relative-death handling. Broader household mortality consumes guardians and creates additional gaps; it should not be silently bundled with ruler mortality.
4. Keep tied claims unresolved until a culturally defensible approved contextual policy exists. Do not use lexical order, universal male preference or player heir-management controls. Require active-regency re-succession and regent loss to be designed before any live child-ruler rollout.
5. For long games, do not scale rare events up just to show them. The one-adoption policy and initial-couple-only births are intentionally limited: repeated continuity eventually needs separately approved introductions/marriage/appointee policy. Review cast **64** against lower caps and actual narrative usefulness; this is an experiment cap, not an approved live population limit.

## Limitations and next approval boundary

No battles, illnesses, gender-specific lifespans, physical game endings, hidden events, player officeholders, historic demography or personality-based fertility are simulated. No live RNG or resolver, pending roll, 81-scene catalogue, saves, UI, import/export or Undo/Redo implementation changed. Ledger transitions are **not** claimed to be valid application succession transactions: actual atomic transactions remain the existing M2B-1 controlled API and its regression suite. The reused selector assumes valid input; our hypothetical ledger records explicit source labels but is not a production save/provenance validator. No generated JSON can be imported as a campaign. Sampling refusal is reported rather than secretly resurrecting a deceased character; blocked deaths never commit in the model.

Readiness, adult age 18, regency adulthood, appointment policy, ties, population cap and mortality curves require further review before M2B-2b. No probability or fictional output is creatively approved by passing tests. **No live mortality, births, succession, new characters, dialogue or UI has been enabled.**
