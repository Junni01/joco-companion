# Codex handoff — M2B-2a: mortality and succession-readiness modelling

**Scope: simulation-only, documentation and test fixtures.** No live narrative mortality or production succession trigger.

## Read first
- [Live dynasties staged design](character-engine-m2b2-live-dynasties-design.md)
- [M2B-1 implementation](character-engine-m2b1-implementation.md)
- [M2A implementation](character-engine-m2a-implementation.md)
- [M1 implementation](character-engine-m1-implementation.md)

## Objective
Establish evidence-based candidate mortality and family/succession policies for a short John Company campaign and a longer future game, **without modifying live game behaviour**. Preserve the existing 23-person setup and character RNG.

## Work
1. Inspect actual scenario ages, age distributions, present New Turn +3 rule and current eligibility / regency limits. Report differences among scenarios and the implications of short versus long campaign length.
2. Write a reproducible command-line simulation (e.g. `scripts/simulate-dynasties.mjs`) using synthetic copies of documented initial/synthetic characters. Include deterministic seed and clear config choices. Do not hook it into `dist/app.js`, live action/phase resolvers, production story selection or actual player saves.
3. Compare several **explicitly illustrative** age-based mortality curves, with ruler-only versus small-families models. Distinguish per-turn chance from annual mortality, before/after age tick, exceptional ages, and no hard cap. No invented production health state.
4. Test successor availability using M2B-1 candidate evaluator and controlled fixtures, including old setup with no typed claims, designated adult, daughter/adopted heir, minor with adult guardian, no regent, tied claims, elderly sole ruler and already active regency. Where no claimant is supported, report the shortfall; **don't silently manufacture an heir**.
5. Model alternatives for nonfatal relative introductions / later safe court appointment as **hypothetical strategies**, not live generator code. Quantify cast growth, no-heir frequency, average ruler tenure, death frequency, widow/regency opportunity, unresolved ties, and valid-seat rate across many seeded runs.
6. Provide a clear short-campaign and long-campaign comparison, ranges or distributions (not just averages), sample readable synthetic timelines and a recommended *candidate* tuning window. Explicitly label all numbers **unapproved proposals**.
7. Include automated tests verifying seed reproduction, input purity, no production RNG consumption, no changes to game resolver/normal player flow, and no fabricated lineage; run full `npm test`, plus relevant existing browser suites where a code change could affect them.

## Deliverables
- CLI simulator and test fixtures under scripts/tests only (plus pure helpers if genuinely necessary and not imported into production).
- `docs/narrative/character-engine-m2b2a-analysis.md` with candidate configurations, results, assumptions, sample histories, limitations and recommendation **for later user review**.
- Verification report with test count, commit SHAs and remote HEAD.
- Commit and push to `main`. **Do not deploy hosted Site.**

## Exclusions
No runtime character births, marriages, mortality, death, heir recognition, claim creation, court appointment, regency ending, Company settlement, imperial blood-feud outcome or on-screen writing. Do not adjust New Turn or player UI. No default probabilities are approved by this handoff. M2B-2b live succession is a **separate approval**.
