# Codex handoff — M2B-2b-1: succession readiness and credible court appointments

**31 October 2026 · Authorized next engineering task.** Build readiness foundations and controlled demonstrations; **do not enable automatic births, deaths, marriages, regency changes, court appointments or extra people during ordinary live gameplay yet**. The next phase, after editorial review, can enable narrowly targeted *nonfatal* court-development triggers. Mortality requires a still separate approval.

## Source of truth

Read:
- [M2B-2a simulation analysis](character-engine-m2b2a-analysis.md): 240,000 synthetic campaigns, 502 tests reported; the original 23 characters have no typed claimants; without a successor, all attempted natural deaths are blocked.
- [M2B-1 implementation](character-engine-m2b1-implementation.md): deterministic evidence-based candidate evaluator and atomic test-only succession, 18-year editorial threshold, optional claim/kinship data and separate regency.
- [M2A implementation](character-engine-m2a-implementation.md), [M1 implementation](character-engine-m1-implementation.md), [M2B-2 design](character-engine-m2b2-live-dynasties-design.md).
- [Master ideas backlog](../PRODUCT-IDEAS-BACKLOG.md), especially A01–A15, B01–B09, C01, D02. These future ideas do **not** all become current implementation scope.

## Why this milestone exists

The existing setup has eight rulers plus eight documented *younger siblings*, but none is a formally designated heir; age, siblinghood or legacy `heir` category alone cannot supply a recognised `claimsV2` claim. Births during a three/four-tick normal game rarely make eligible adults. We need lawful, attributable *recognition* and *introduction* pathways before any real mortal ruler can be safely removed.

**Do not solve missing data by inventing historical setup facts** or generating a compulsory heir per region at game start. No migration/backfill of original relationships or promises.

## Deliverable 1 — read-only readiness report

Develop a **pure** report for each regional seat, returning one or more statuses:
- `ready-adult`: eligible documented living adult claimant with unambiguous policy-selected succession.
- `ready-minor-with-regent`: eligible child titular claimant with a distinct eligible adult regent and valid tenure plan.
- `contested`: multiple equally eligible claimants requiring a future approved contextual tie policy.
- `needs-documentation`: there is a suitable existing character (e.g. documented younger sibling) but no recognised claim/appointment.
- `needs-candidate`: no eligible documented claim and no supported existing candidate.
- `blocked-regency`, `blocked-cross-region`, or other **explicit structural block** based on actual M2B-1 invariants.

These statuses must distinguish **eligible candidates** from **transaction actually ready**: a succession with an active regency may still be rejected. Include reason codes and exact provenance supporting any recommendation. Deterministic, no random numbers, no mutation or game-effect inference. Avoid ambiguous labels when multiple reasons apply; primary state plus blockers is acceptable. This must work on existing untouched version-2 saves.

## Deliverable 2 — controlled witnessed heir recognition

Provide a strictly controlled, test-authorized transaction to **recognize an already known person as an heir or explicitly designate one** for a specific region, using typed `claimsV2` and documented provenance:
- Real identity and existing valid age/status/region association; do not transform legacy siblings into biological descendants or automatically appoint one.
- A present coherent authority/source (existing ruler, court or an actual committed compatible event) and narrative **recognition**, not a retroactive 'always was heir' fact. A court can recognise a younger sibling without inventing the deceased parent's identity.
- The claim's basis, standing, status, source incident and claimant support must pass M2A validators. Use designation or witnessed authority as appropriate; do not mislabel as parentage/adoption without a real typed link.
- Record who made the designation and when, prior claim status if any and compatible legitimacy/grievance context only if genuinely recorded. An adult sister/daughter/adopted heir/minister could qualify given explicit support; do not infer gender or universal court law.
- No seat changes, birth, death, forced loyalty or military effects.
- Tests must prove old saves, existing characters, absent typed data, a repeated incident, conflicting recognition, source deletion guards and Undo/Redo integrity.

An applicable **sovereign-region Leader** event is a *possible future* live recognition trigger (the printed +1 strength remains authoritative), not authorization to automatically grant a claim on every such event in this task.

## Deliverable 3 — controlled introduction of an adult court candidate

Implement reusable **test-controlled** introduction/appointment planning and one valid atomic provenance transaction when an eligible court candidate is genuinely needed:
- Prefer reusing an eligible documented existing person. Generate a **new identity only in an explicitly test-authorized transaction** and record introduction type `introduced`, age, source, region affiliation, office/court role, political claim, origin and exact purpose. Never insert a person retrospectively into a past event.
- For baseline demonstrations use explicitly labelled *synthetic fictional* names/roles, not a culture-specific naming claim. **Production names and biographies must await C01 editorial research.**
- Introduce as a minister/recognised court figure (not king immediately), or as a **contingent appointee within a single deliberate synthetic succession transaction**, provided all seat/role/claim validators and source requirements succeed atomically.
- If the next ruler must be created because the existing one has already died in a *future* live system, the death and successor introduction must belong to **one atomic authorized boundary**; there must never be a 'dead incumbent with vacant seat' intermediate save.
- Support Indian sovereign/vassal narrative status without changing control or overlord. **Company-dependent regional appointments are an explicit later separate policy**, as is Indian imperial relationship-driven conquest settlement. Do not silently generalise a sovereign court-appointment power to all authorities.
- New characters do not inherit previous ruler private memory, first-person quotations, old parentage, biological family, dynasty membership or elected parliamentary interests.
- If validating a plausible adult candidate requires unfamiliar source evidence, offer an explainable rejection rather than fictionally fabricating it.

## Deliverable 4 — future policy simulation and demo

Extend the M2B-2a offline model with **illustrative** alternatives:
1. Recognise an original documented younger sibling at an eligible witnessed court event, *without claiming parentage or giving every sibling an automatic heir status*.
2. Rarely introduce a new adult court figure through a separately committed event.
3. Emergency adult appointment **only at a future independently warranted death**.
4. Combinations with existing adoption/birth/appointment strategies.

Measure short 1813 (3 ticks), normal 1710/1758 (4), long 1710 (7), and hypothetical 30-tick stress: no-heir blocks, contested claims, regencies, mean/p05/p95 cast, average incumbent turnover, and proportion of original eight retained. Analyse potential 'indefinitely immortal for lack of documented heir' bias. All simulation frequencies are **candidate assumptions not approved defaults**. Repeat same seed and confirm byte-identical outputs.

## Deliverable 5 — the exceptional cases

Propose and **test controlled transitions** (or report a precisely justified blocking contract where implementation would exceed this scope):
- Ruler dies/is deposed while another adult is acting regent; safely close old regency and establish new seat/regency under one synthetic transaction.
- Regent becomes unavailable; a documented second eligible regent may replace them, or explicit transaction rejects with no corruption.
- Applicant associated with a *different region* has a legitimate known claim here; current M2B-1 forbids cross-region seat transfer. **Do not loosen that rule by accident**; present a well-defined future design or isolated test-only extension with validation.
- Tie among several recognised adult claimants; report claims with source and competing eligibility, never choose by name, gender or undocumented custom. Provide future policy options for review.
- If none are legally suitable, fail a test-only transaction without changing the actual board or original people.

## UI and editorial limits

A **read-only technical readiness diagnostic** may be exposed in Debug/test fixtures, provided it does not add player-family controls or act on game state. No new prompt or mandatory UI step. No approved literary scene text is being supplied by this milestone; use neutral clearly synthetic demonstrations only. Existing automatically presented 81 approved Collection 09E scenes stay exact. Do not modify physical John Company events, rolls, loot, India map, Company appointment semantics or political policy.

Keep narrative schema **version 2** with optional fields if feasible; if not, document why before making a breaking change. Preserve original 23 identities/eight seats, legacy save import/export, protected live pending events, precise Undo/Redo and history, private outlook ownership, distinct Normal/quiet/Debug behavior and no extra gameplay RNG draws.

## Verification and delivery

- Focused automated tests for every pure assessment and controlled transaction, invalid references, replay, duplicate sources, claim conflicts, legitimate age/status/roles, synthetic regencies, and exact import/export/Undo/Redo.
- Full `npm test`, regular and Debug browser checks at **1440×900** and **1024×768**, plus existing suites protecting 09E and gameplay invariants.
- Demonstration at least: original untouched cast flagged `needs-documentation` not assigned heirs; committed explicit sibling designation; minister introduction as nonruler; no-heir synthetic succession receiving a newly introduced adult as atomic fallback; minor + known regent; contested candidates; Company region correctly refused future appointment until its own policy; active-regency and cross-region limitations visible.
- Write `docs/narrative/character-engine-m2b2b1-implementation.md`, `...-demo.md` and verification record, noting which contracts remain unimplemented.
- Commit and push to `main`, report commit hashes and remote HEAD. **Do not deploy the hosted Site.**

## Separate subsequent authorization

**M2B-2b-2** may wire *rare nonfatal* heir recognition/introduction to an explicitly compatible real committed event after user approval of its triggering frequency, historically plausible names and original prose. **M2B-2b-3** may then permit live age-based mortality once appointment fallbacks, tied-claim policy, active-regency handling, and campaign-level death frequency are independently accepted. Later conquest/political exits are not part of these steps.

**Important:** These staged labels describe safety boundaries, not promises that all later features are approved.
