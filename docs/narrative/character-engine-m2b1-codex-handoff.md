# Codex handoff — Character Engine M2B-1: controlled succession and regency

**26 October 2026 · Scoped implementation authorization.** This handoff is the *next* engineering task after documented M2A. It **does not authorize live death, birth, marriage, deposition or succession triggers** in ordinary board-game play.

## Read first / baseline

- [M2A implementation](character-engine-m2a-implementation.md) and [M2A demo](character-engine-m2a-demo.md) — optional version-2 `familyLinks`, `dynasties`, `claimsV2`, `introduction`, `gender`, `successionContext`, save validators and 23-person unchanged cast. Reported 454 passing tests.
- [M1 implementation](character-engine-m1-implementation.md) — `condition`, `politicalRole`, `conditionHistory`, `politicalHistory`, active `seats` invariant, provenance and Undo/Redo.
- [M2 design](character-engine-m2-design.md) — future live succession, regency and relationship-driven conquest are *design context*. This handoff implements only controlled/test-only succession foundations.
- [Feature backlog](../PRODUCT-IDEAS-BACKLOG.md) — backlog ideas such as violent conquest, Company puppets, complex foreign clients, natural mortality and long-game arcs are **not current authorization**.

## Objective

Create a **pure, deterministic succession candidate evaluator** and an **atomic, provenance-backed transition** capable of installing an eligible successor, including a minor titular ruler with a distinct acting adult regent. Exercise it **only from explicitly constructed synthetic tests or an isolated test-only harness**. Normal campaigns must behave precisely as before.

The authoritative John Company resolver always determines `control`, `overlord`, `strength`, board flags, Orders, phase flow, combat, officer reports and legal targets. A succession changes *only fictional person/claim/tenure/regency/history records*, not those fields.

## Deliverable A — pure candidate and regency assessment

1. Build on M2A `successionContext` and current role/condition validators, not a second family database or ranking invented from names.
2. Return structured **eligible / ineligible plus explicit reason and evidence** for each candidate. Required presence/eligibility: existing identity, alive, not already seated incompatibly elsewhere, appropriate documented regional claim/recognition or an explicitly sourced extraordinary appointment, plausible regional political context. No automatic inference that an existing younger sibling is heir, nor that marrying the former ruler transfers the throne.
3. Handle designated/recognised adult heir, adult daughter/son, eligible adopted child, documented sibling or rival claimant, widow with **actual** claim, minor recognised heir needing an adult regent, and the absence of any qualified candidate. Historical/customary policies are **configurable narrative policy inputs to the test harness**, not universal male primogeniture, simple sorting by gender, or fictional proof of an unknown culture-specific rule.
4. In conflict/ambiguous cases return an explainable eligible set and explicit unresolved/controlled choice; no arbitrary live takeover. Do not consume gameplay RNG. If any test selector randomness is necessary, isolate it from production and demonstrate deterministic replay.
5. Use the conservative M2A adulthood threshold (18) as a **temporary editorial eligibility default**, document it, and do not change +3 ageing. Do not invent unrecorded parents, heirs, marriages, health or dynasties.

## Deliverable B — transactional succession executor

Given a deliberate **test fixture authorization** and a real or explicit synthetic canonical supporting incident/provenance:
1. Validate active incumbent, candidate, claim, regent if required, and actual current map-derived political kind before writing.
2. Support explicitly test-controlled exit cases (abdication and confirmed death are sufficient), without generating either from a real battle or New Turn.
3. Atomically update `n.seats[region]`, former and next ruler's political roles/history, incumbent condition/history *only if a death was explicitly supplied*, relevant claim status/statusHistory, optional acting-regent tenure, and a unique attributable succession record. A dead incumbent cannot remain in a seat or return; a defeated yet living incumbent may retain a future claim/appropriate former-ruler status.
4. **Regency:** young titular ruler remains the legal local narrative seat; distinct available adult regent is separately stored with clear role/tenure provenance. Regency must not cause an extra board-region seat or disguise an acting guardian as sovereign. Test transition from minor ruler to adult with ending regency at a **separately explicit committed synthetic event**, not silent read-time ageing or generic New Turn auto-activation. Document whether `actingRegentId` is placed in an optional `n.regencies` record or equivalent, and validate source and uniqueness.
5. Preserve political status derived from current region `control`/`overlord` (so succession in a Company region does not make it sovereign; a Delhi vassal remains a Delhi vassal). The regional ruler must remain distinct from the capital ruler, player Governor, Commander and adviser NPC.
6. Completely reject invalid/incomplete requests without partially changing narrative, gameplay or random state. Idempotent duplicate incident application must not duplicate history or reroll. Attempted removal/reindexing of supporting source must give clear deletion guards.
7. Preserve saved explicit persona text and all prior roles/relationships; do not silently rewrite old cast `role` or invent former personalities.

## Deliverable C — demonstration and visibility

- Test-only adult succession, child ruler + actual widow/guardian regent, disputed adult claim, successor in vassal and Company-dependent regions, absence of eligible candidate **failing safely**, irreversible dead-seated rejection, ineligible exiled/presumed-dead/imprisoned/missing candidates, and a separated regency-ending event.
- Dossiers, roster and readable export show *actually recorded* succession, former ruler, source evidence and, when present, child vs regent without misleading roles.
- Existing campaign starts with exactly 23 identities, 8 original seats, no new regency, no designated heirs, no mortalities or appointments, and unchanged cast RNG. Test fixtures are explicitly labelled in documentation and must not leak into production setup.
- No new player management controls, production fate editor, manual succession UI, new production literary text, portrait art, automatic reading confirmations or `Read scene` button. Synthetic demonstration text must be clearly labelled test output, not approved prose.

## Required safety and compatibility checks

- Preserve narrative **version 2** if optional extension can be added safely; if a version change is genuinely necessary, *stop and document why* instead of silently breaking old saves.
- Old current-version saves, exact history/words, JSON import/export, snapshots, Undo/Redo, regular/Debug separation, pending protected rolls and deterministic narrative story selection must survive.
- Preserve mechanical-on/off parity and all 81 verbatim automatic Collection 09E scenes; Normal mode must still work without a character engine.
- No board-state changes when succession is simulated; rejection of incomplete transition leaves all fields identical.
- Full `npm test` and regular/Debug browser checks at **1440×900** desktop and **1024×768** tablet, including standard/quiet/Normal; include additional existing suites as needed.
- Provide executable synthetic demo scenarios, focused regression tests, validation/provenance explanation and screenshots where useful; state counts, limitations, commit SHAs and remote HEAD.
- No hosted Site deployment.

## Explicit exclusions

No live natural death or mortality probabilities; no automatic death on New Turn; no marriage or child generation; no creation of unknown replacement NPCs in production; no implicit elder sibling inheritance; no relationship-driven Indian conquest depose/execute/puppet outcomes yet; no Company appointments yet; no emperor veto changing vassal status; no foreign invasion/French VIP logic; no exiled or presumed-dead returns; no impostors; no new historical prose; no runtime game-affecting choice of successors.

**After this delivery:** Review M2B-1 tests and sample candidate rankings/edge cases, then separately specify and approve M2B-2 real triggers, frequencies, fallback-new-ruler policy and exact narrative writing. The absence of an eligible heir is *not* license to invent a production ruler in this milestone.


## Delivery status — 26 October 2026

Controlled M2B-1 foundation is implemented: [contract and compatibility](character-engine-m2b1-implementation.md), [synthetic demonstrations](character-engine-m2b1-demo.md), [verification](character-engine-m2b1-verification.json). No live trigger or M2B-2 implementation is authorized by this status note.
