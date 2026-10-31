# Character Engine M2B-2 — living dynasties design

**31 October 2026.** Staged direction agreed for further development. This is a design document, **not approval for live production mortality, births, marriages or ruler replacement**.

## Baseline
- M1 persistent life/political states and histories.
- M2A typed families, houses and claims; the original 23 characters' younger siblings are **not** automatically children or designated heirs.
- M2B-1 controlled/test-only succession, selection and regency; 488 tests reported; version 2, no migration.
- Source material: [M2B-1](character-engine-m2b1-implementation.md), [M2 design](character-engine-m2-design.md), [master backlog](../PRODUCT-IDEAS-BACKLOG.md).

## Core principle
A ruler's death and succession must be one coherent, source-linked **narrative** transaction. The physical board alone determines region control, overlord, strength, orders, armies, events, dice and game ending. No player chooses heirs. Reading a dossier never causes a life event.

## Development stages
1. **M2B-2a — modelling and simulation (next task):** inspect actual starting-age distributions and the +3-years-per-New-Turn clock. Model mortality and succession readiness through synthetic short and long campaigns and test introduction strategies. Compare candidate policies and outcomes. **No live fate/character generator, no production probability, no player controls, no new production dialogue.**
2. **M2B-2b — limited live succession (separate later authorization):** carefully selected and tuned natural ruler exits at one committed New Turn boundary, with eligible successor/regent or valid documented appointee planned before any death. Add approved authored scenes. Preserve game mechanics and source history.
3. **M2B-2c — political exits (separate later authorization):** Leader transitions and relationship-driven imperial/Company conquest settlements, including exceptional imprisonment, exile or execution after genuinely documented hatred. Real physical conquest must occur first. Do not infer human casualties from officer routs.

## Proposed mortality model for simulation only
- Age-dependent *relative* natural-mortality risk, with no hard death age. Consider health only when health is explicitly recorded; do not invent an unrecorded illness.
- Sample at most once per eligible, present character per committed New Turn. Avoid gratuitous mortality of secondary characters; estimate both ruler-only and wider-family variants.
- Distinguish **age just before** vs **after** the +3 tick. Compare and document rates per *turn*, not per calendar year. The John Company turn is an abstract time interval.
- Use a separate narrative RNG in a future live model; synthetic simulation should support deterministic seeds and reproduce results. Never consume the gameplay dice stream or hidden event order.
- Compare thousands of short hypothetical campaigns and longer campaigns (if feasible): ruler turnover, retained familiar rulers, ages at death, number of regencies, no-heir situations, cast growth and whether any region is left without a valid ruler. Frequency values are **candidates for review**, not approved rates.
- Long games have more turns; do not artificially increase the occurrence of extremely rare arcs merely because the physical board game is short.

## Succession continuity and missing heirs
Existing people first: eligible designated/recognised heirs, explicitly supported relatives or claimants, and minors with **distinct adult regents**. Marriage alone, being a sibling, or historical house text never grants a claim. The shipped M2B-1 engine intentionally returns ambiguous when equally supported candidates exist; a later production selector must resolve this using an approved contextual policy without soliciting player input.

If no qualified heir exists, a possible **witnessed court appointment of a new adult identity** can be considered in the same atomic transition, but policy, culturally appropriate creation, age/name/roles and provenance need approval. A new unrelated court appointee is safer than fabricating a parent. Until then, no production death should be committed without a viable successor.

**Regency limitation:** M2B-1 currently requires a regency to be explicitly ended before another regional succession; a later live system must handle a ruler dying or being deposed *during* regency without leaving a vacant throne. **Cross-region limit:** no automatic importation of claimants from another region until assignment/claim semantics are designed and validated.

## Proposed sources of future family growth
- Rare witnessed family/court introductions at eligible committed events; existing relatives preferred and no invented retroactive family biography.
- Explicit births may matter over a long campaign but cannot immediately solve an adult succession gap in a short campaign.
- Rare eligible neighbouring-house marriages at Peace, without changing territory or granting a spouse a throne automatically; these belong to later milestone M3.
- Cap live population by narrative usefulness and existing campaign duration; do not generate a full unrelated family tree at start.

## Story and political implications
- A death is a serious historical fact, not the punchline; characters' vanity and bureaucracy can provide humour around secondary reactions.
- Chronicle names predecessor, successor, claimant, regent and incident, preserving unresolved rivalries and previous private memories with their original owners.
- Existing imperial and Company allegiances remain unchanged through natural succession. Relationship-driven removal on conquest is a **distinct later trigger**, not an add-on to ordinary natural-mortality tests.
- Cross-regional political claims, historic allegiance episodes, funerals, child regents, widows and displaced former rulers should be future-proofed, but not activated without separate decisions.

## Decisions to resolve after modelling
1. Candidate **per-turn mortality curves** and the acceptable short-game chance of any natural ruler death.
2. Whether health must exist before first mortality launch or age-only is sufficient.
3. How to settle equally strong recognised claims automatically, accounting for local court practice without universal gender preference.
4. How to appoint an eligible successor if none is known.
5. How to handle consecutive successions while a regency is active.
6. Real narrative-prose examples and initial supported characters/speakers.
7. Compatibility strategy and long-campaign cap for new identities.
8. Whether any event other than New Turn should trigger natural death in the initial live delivery (proposed: no).

## Non-negotiable compatibility
No version bump, backfill or rewrite of historic dialogue without explicit separate review; preserve all 81 verbatim 09E scenes, protected events, Undo/Redo, snapshots, regular/Debug, Normal/quiet, and mechanical parity. No hosted Site deployment.

**Status:** M2B-2a simulation/readiness task may proceed separately. M2B-2b/c *cannot* be inferred from approval of this design.
