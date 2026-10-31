# M2B-2b-1 — succession-readiness simulation analysis

31 October 2026. **UNAPPROVED ILLUSTRATIVE ASSUMPTIONS**, not live mortality/court triggers, historical rates or accepted character naming. This extends the M2B-2a model; all proposals require review.

Master seed **90210**, **1000 campaigns per cell**, **240 cells** (240000 synthetic campaigns per complete run). Four actual scenario horizons (3/4/4/7 +3 ticks) plus 30-tick hypothetical stress. Two candidate mortality curves (restrained/middle), ruler-only and small-family exposure, 12 strategies, after-tick sampling. The earlier elevated and before-tick sensitivity remains in the [M2B-2a analysis](character-engine-m2b2a-analysis.md). Matched seeds/horizons are correlated, not independent historical evidence.

```sh
node scripts/simulate-readiness.mjs results.json 1000 90210
node scripts/report-readiness.mjs results.json docs/narrative/character-engine-m2b2b1-analysis.md
node scripts/demo-readiness.mjs demo.json
npm test
```

## Assumptions and strategy definitions

- **Recognition:** 8% chance per region/tick of a hypothetical compatible witnessed court event. Only Indian courts, only when no eligible claimant, and only one supported existing person may be recognised without a tie policy. An original sibling has a recorded legacy sibling edge; no parent is invented. A new explicit designation is recorded in the model, not inferred from a name/category. It does not change core traits, gratitude or political control.
- **Court:** separate 3% per-region/tick nonfatal witnessed court-introduction event. Introduce a 28-year-old minister with a witnessed-authority claim only if no supported existing person/eligible claimant or unresolved living claim blocks the plan. This does **not** automatically grant every region a new heir. Court-only therefore often correctly does nothing while a known sibling needs documentation.
- **Emergency (new combinations):** only after an independent hypothetical mortality draw. Prefer explicit recognition of one existing supported person; otherwise introduce an unrelated adult only when no living unresolved claimant remains. No Company appointments and no tie bypass. This differs deliberately from the old M2B-2a `appointment` comparator, which assumed immediate new unrelated appointees without the new reuse-first contract.
- **Existing comparators:** none, one prospective adoption per region (12%/tick when needed), initial explicitly synthetic spouses plus births/recognition (10%/eligible couple/tick), and old immediate appointment. Their original numerical assumptions are preserved. New combined policies can include recognition plus adoption or births; these are hypotheses, not claims that live event evidence or production naming already exists.
- **No hidden backfill:** no heir/claim is added at setup by recognition/court/emergency policies. Births comparator alone explicitly starts with eight synthetic spouses, counted in growth. No added person inherits old memories, quotations, parentage or a dynasty by proximity to the throne.
- **Shared constraints:** adulthood 18, introduced people not aged/sampled in their introduction tick, fixed +3, total recorded cast cap 64 including dead people. No health/illness state, no hard death cap. Protected gameplay is absent from this offline model. Active-regency death/regent-loss and ties remain counted blocks. Hypothetical adulthood closes regency in the ledger only; production still does not do so.

8%, 3%, 12%, 10%, ages 16/28/30, fertility window 18–55 and cap 64 are **candidate assumptions, not approved defaults**. Pure M2B-1 eligibility is reused. The offline ledger is not a validated application save; actual court/claim provenance and atomic transactions are separately exercised by the controlled fixture tests.

## Primary comparisons

Middle curve / small-family exposure / after tick. “Ready ticks” = fraction of region-end-of-tick states with a policy-selected candidate and no active regency, **not** the percentage of future deaths safely resolved. Mean [p05–p95] describes the campaign distribution. Original retained is mean / 8. No-heir campaign is any blocked exit for missing eligibility; active-tenure blocks and ties are separate totals in the JSON.

| Horizon | Strategy | Ready ticks | No-heir campaign | No-heir blocks mean | Turnover mean [p05–p95] | Regencies mean [p05–p95] | Cast mean [p05–p95] | Original retained |
|---|---|---:|---:|---:|---|---|---|---:|
| 1813 | none | 0.0% | 30.6% | 0.36 | 0.00 [0–0] | 0.00 [0–0] | 23.00 [23–23] | 8.00 |
| 1813 | recognition | 9.1% | 28.1% | 0.32 | 0.04 [0–0] | 0.00 [0–0] | 23.00 [23–23] | 7.96 |
| 1813 | court | 0.0% | 30.6% | 0.36 | 0.00 [0–0] | 0.00 [0–0] | 23.00 [23–23] | 8.00 |
| 1813 | recognition-court | 9.1% | 28.1% | 0.32 | 0.04 [0–0] | 0.00 [0–0] | 23.00 [23–23] | 7.96 |
| 1813 | recognition-adoption | 27.8% | 22.4% | 0.25 | 0.11 [0–1] | 0.04 [0–0] | 25.31 [23–27] | 7.89 |
| 1813 | recognition-births | 13.3% | 27.1% | 0.31 | 0.05 [0–0] | 0.05 [0–0] | 32.75 [31–35] | 7.95 |
| 1813 | appointment | 0.0% | 12.7% | 0.14 | 0.22 [0–1] | 0.00 [0–0] | 23.22 [23–24] | 7.78 |
| 1813 | recognition-emergency | 9.0% | 12.7% | 0.14 | 0.22 [0–1] | 0.00 [0–0] | 23.01 [23–23] | 7.78 |
| 1813 | court-emergency | 0.1% | 12.7% | 0.14 | 0.22 [0–1] | 0.00 [0–0] | 23.02 [23–23] | 7.78 |
| 1813 | recognition-court-emergency | 9.1% | 12.7% | 0.14 | 0.22 [0–1] | 0.00 [0–0] | 23.02 [23–23] | 7.78 |
| 1710 | none | 0.0% | 43.8% | 0.56 | 0.00 [0–0] | 0.00 [0–0] | 23.00 [23–23] | 8.00 |
| 1710 | recognition | 17.5% | 36.1% | 0.44 | 0.12 [0–1] | 0.00 [0–0] | 23.00 [23–23] | 7.88 |
| 1710 | court | 0.0% | 43.8% | 0.56 | 0.00 [0–0] | 0.00 [0–0] | 23.01 [23–23] | 8.00 |
| 1710 | recognition-court | 17.6% | 36.1% | 0.44 | 0.12 [0–1] | 0.00 [0–0] | 23.01 [23–23] | 7.88 |
| 1710 | recognition-adoption | 37.2% | 26.5% | 0.31 | 0.25 [0–1] | 0.04 [0–0] | 25.68 [24–28] | 7.75 |
| 1710 | recognition-births | 14.8% | 39.5% | 0.49 | 0.07 [0–1] | 0.06 [0–1] | 33.09 [31–36] | 7.93 |
| 1710 | appointment | 0.0% | 0.0% | 0.00 | 0.55 [0–2] | 0.00 [0–0] | 23.55 [23–25] | 7.46 |
| 1710 | recognition-emergency | 17.3% | 0.0% | 0.00 | 0.55 [0–2] | 0.00 [0–0] | 23.02 [23–23] | 7.46 |
| 1710 | court-emergency | 0.2% | 0.0% | 0.00 | 0.55 [0–2] | 0.00 [0–0] | 23.05 [23–23] | 7.46 |
| 1710 | recognition-court-emergency | 17.5% | 0.0% | 0.00 | 0.55 [0–2] | 0.00 [0–0] | 23.05 [23–23] | 7.46 |
| 1710-long | none | 0.0% | 80.8% | 1.65 | 0.00 [0–0] | 0.00 [0–0] | 23.00 [23–23] | 8.00 |
| 1710-long | recognition | 24.2% | 67.8% | 1.16 | 0.47 [0–2] | 0.00 [0–0] | 23.00 [23–23] | 7.53 |
| 1710-long | court | 0.2% | 80.8% | 1.65 | 0.00 [0–0] | 0.00 [0–0] | 23.05 [23–23] | 8.00 |
| 1710-long | recognition-court | 24.5% | 67.8% | 1.15 | 0.47 [0–2] | 0.00 [0–0] | 23.07 [23–24] | 7.53 |
| 1710-long | recognition-adoption | 47.6% | 45.8% | 0.64 | 0.94 [0–3] | 0.08 [0–1] | 26.67 [24–29] | 7.06 |
| 1710-long | recognition-births | 16.9% | 74.8% | 1.37 | 0.24 [0–1] | 0.20 [0–1] | 33.40 [31–36] | 7.76 |
| 1710-long | appointment | 0.0% | 0.0% | 0.00 | 1.50 [0–4] | 0.00 [0–0] | 24.50 [23–27] | 6.52 |
| 1710-long | recognition-emergency | 23.6% | 0.0% | 0.00 | 1.56 [0–4] | 0.00 [0–0] | 23.17 [23–24] | 6.52 |
| 1710-long | court-emergency | 0.7% | 0.0% | 0.00 | 1.56 [0–4] | 0.00 [0–0] | 23.32 [23–24] | 6.52 |
| 1710-long | recognition-court-emergency | 24.2% | 0.0% | 0.00 | 1.56 [0–4] | 0.00 [0–0] | 23.32 [23–24] | 6.52 |
| hypothetical-30 | none | 0.0% | 100.0% | 48.90 | 0.00 [0–0] | 0.00 [0–0] | 23.00 [23–23] | 8.00 |
| hypothetical-30 | recognition | 12.6% | 100.0% | 44.31 | 3.29 [1–5] | 0.00 [0–0] | 23.00 [23–23] | 4.71 |
| hypothetical-30 | court | 3.9% | 100.0% | 40.99 | 2.66 [0–5] | 0.00 [0–0] | 26.49 [24–30] | 5.47 |
| hypothetical-30 | recognition-court | 17.3% | 100.0% | 34.73 | 6.33 [3–10] | 0.00 [0–0] | 26.95 [24–30] | 3.04 |
| hypothetical-30 | recognition-adoption | 27.6% | 100.0% | 18.01 | 9.15 [7–11] | 0.17 [0–1] | 30.64 [30–31] | 0.49 |
| hypothetical-30 | recognition-births | 10.0% | 100.0% | 37.32 | 3.00 [1–5] | 0.26 [0–1] | 33.40 [31–36] | 5.03 |
| hypothetical-30 | appointment | 0.0% | 0.0% | 0.00 | 13.12 [10–16] | 0.00 [0–0] | 36.12 [33–39] | 0.00 |
| hypothetical-30 | recognition-emergency | 11.6% | 0.0% | 0.00 | 15.93 [13–19] | 0.00 [0–0] | 33.81 [32–36] | 0.00 |
| hypothetical-30 | court-emergency | 10.1% | 0.0% | 0.00 | 16.29 [13–19] | 0.00 [0–0] | 36.22 [34–39] | 0.00 |
| hypothetical-30 | recognition-court-emergency | 21.7% | 0.0% | 0.00 | 16.29 [13–19] | 0.00 [0–0] | 36.22 [34–39] | 0.00 |

1758 has the same four-tick age horizon as 1710 but starts with Company Bengal. Full results for it remain in the JSON; Company-policy exclusions can therefore produce different rates despite identical starting ages.

## Curve and household-exposure sensitivity

| Horizon | Curve | Exposure | Strategy | Any committed ruler death | Original retained | Cast mean | Contested blocks total |
|---|---|---|---|---:|---:|---:|---:|
| 3 ticks | restrained | rulers | recognition-court | 1.9% | 7.98 | 23.00 | 0 |
| 3 ticks | restrained | rulers | recognition-court-emergency | 9.8% | 7.90 | 23.00 | 0 |
| 3 ticks | restrained | families | recognition-court | 1.8% | 7.98 | 23.00 | 0 |
| 3 ticks | restrained | families | recognition-court-emergency | 9.8% | 7.90 | 23.00 | 0 |
| 3 ticks | middle | rulers | recognition-court | 3.6% | 7.96 | 23.00 | 0 |
| 3 ticks | middle | rulers | recognition-court-emergency | 20.1% | 7.78 | 23.01 | 0 |
| 3 ticks | middle | families | recognition-court | 3.6% | 7.96 | 23.00 | 0 |
| 3 ticks | middle | families | recognition-court-emergency | 20.1% | 7.78 | 23.02 | 0 |
| 4 ticks | restrained | rulers | recognition-court | 7.1% | 7.93 | 23.00 | 0 |
| 4 ticks | restrained | rulers | recognition-court-emergency | 24.5% | 7.72 | 23.01 | 0 |
| 4 ticks | restrained | families | recognition-court | 7.0% | 7.93 | 23.00 | 0 |
| 4 ticks | restrained | families | recognition-court-emergency | 24.5% | 7.72 | 23.02 | 0 |
| 4 ticks | middle | rulers | recognition-court | 11.9% | 7.88 | 23.00 | 0 |
| 4 ticks | middle | rulers | recognition-court-emergency | 43.8% | 7.46 | 23.04 | 0 |
| 4 ticks | middle | families | recognition-court | 11.7% | 7.88 | 23.01 | 0 |
| 4 ticks | middle | families | recognition-court-emergency | 43.8% | 7.46 | 23.05 | 0 |
| 7 ticks | restrained | rulers | recognition-court | 26.3% | 7.71 | 23.01 | 0 |
| 7 ticks | restrained | rulers | recognition-court-emergency | 56.0% | 7.24 | 23.06 | 0 |
| 7 ticks | restrained | families | recognition-court | 25.4% | 7.72 | 23.04 | 0 |
| 7 ticks | restrained | families | recognition-court-emergency | 56.0% | 7.24 | 23.11 | 0 |
| 7 ticks | middle | rulers | recognition-court | 42.2% | 7.48 | 23.03 | 0 |
| 7 ticks | middle | rulers | recognition-court-emergency | 80.8% | 6.52 | 23.18 | 0 |
| 7 ticks | middle | families | recognition-court | 39.4% | 7.53 | 23.07 | 0 |
| 7 ticks | middle | families | recognition-court-emergency | 80.8% | 6.52 | 23.32 | 0 |
| 30 ticks | restrained | rulers | recognition-court | 100.0% | 1.10 | 25.44 | 0 |
| 30 ticks | restrained | rulers | recognition-court-emergency | 100.0% | 0.16 | 32.64 | 0 |
| 30 ticks | restrained | families | recognition-court | 99.9% | 3.34 | 26.37 | 0 |
| 30 ticks | restrained | families | recognition-court-emergency | 100.0% | 0.16 | 33.70 | 0 |
| 30 ticks | middle | rulers | recognition-court | 100.0% | 0.79 | 25.93 | 0 |
| 30 ticks | middle | rulers | recognition-court-emergency | 100.0% | 0.00 | 35.29 | 0 |
| 30 ticks | middle | families | recognition-court | 100.0% | 3.04 | 26.95 | 0 |
| 30 ticks | middle | families | recognition-court-emergency | 100.0% | 0.00 | 36.22 | 0 |

## Readiness bias, limits and recommended candidates for review

1. **Missing documentation is not mortality immunity.** The safe model retains rulers when no successor can be installed; those are explicitly blocked exits. Its 100% valid-seat rate is a guard invariant, not proof that a policy is ready. Compare drawn exits, actual turnover, retained originals and no-heir blocks together. Never report blocked rulers as naturally surviving an independently committed death.
2. **Recognition first is a useful nonfatal candidate**, because it can reuse the known sibling without cast growth or invented ancestry. At an illustrative 8% court-event rate, short games still leave substantial readiness gaps: this is intentionally rare, not a guaranteed heir pipeline. Selecting exact real triggers, frequencies, names and prose belongs to separately approved M2B-2b-2.
3. **New court figures are conditional, not universal.** Refusing to generate an outsider while a suitable known person awaits recognition is desirable. Nonfatal court-only strategy can therefore look ineffective; the relevant combined policy is recognition + court, with unresolved-claim protection intact.
4. **Emergency fallback reduces no-heir bias conditionally**, but requires a separately warranted exit and real atomic evidence. It cannot solve Company appointment policy, tied claims or active-regency handling. No live mortality should launch on the assumption that every draw can simply generate an appointee.
5. **Long games expose exhausted one-generation policies.** Record all people, including deceased holders; cap 64 is only an experiment assumption. Repeated family/marriage growth and cross-region histories remain future design. No deletion of inconvenient dead people or automatic regent to ruler promotion is used.
6. Keep the restrained-to-middle, age-only, post-+3, ruler-only window from M2B-2a as **candidates for later review**, not new defaults. Family exposure increases lost-heir/guardian gaps. A death is never inferred from battle, officer loss, tax, old age or a read of the dossier.

For 1,000 seeded replicates, a probability near 50% has an approximate worst-case ±3.1 percentage-point Monte Carlo margin. Rare-event tails have much larger relative uncertainty. These keyed deterministic draws are illustrative sensitivity experiments, not historical demography or a fit to observational data. Initial reigns have unknown pre-campaign tenure (left truncation); surviving segments are right-censored. Both completed and censored tenure distributions are retained in the JSON; do not average survivors as completed reigns.

The pure readiness and controlled transaction demonstrations are in [the small demo](character-engine-m2b2b1-demo.md). Exceptional-regency and cross-region contracts remain blocked for the exact reasons documented in [implementation](character-engine-m2b2b1-implementation.md). No live deaths, births, marriages, regency changes, recognition, court appointments or new identities are enabled. No Site deployment.
