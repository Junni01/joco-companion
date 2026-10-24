# Milestone 2 — Persistent Political Memory

**Status:** User-approved requirements and implementation scope; **specification handoff only**. Application implementation requires a separate explicit go-ahead.
**Decision record:** M2-01–M2-25 approved in the requirements review, 24 October 2026.
**Repo scope:** John Company India Companion, all four scenarios and both regular/debug workspaces.
**Related authority:** [Narrative requirements](narrative-requirements.md) (NR-001–054), [first playable milestone](first-playable-milestone.md), [implementation review](implementation-review-2026-10-24.md) and repository `AGENTS.md`.

## Purpose and boundaries

Milestone 1 created a persistent fictional cast, structured incidents, saved scenes, dossiers, chronological history, chapters, and unified Undo/Redo. Milestone 2 makes those existing characters **remember**, change their relationships through actual experiences, and speak with grounded contextual callbacks.

The player should perceive a full sequence: conquest → remembered grievance → related later event → relevant non-repetitive callback and evolving relationship → inspectable evidence in the dossier. Deliver this complete but limited playable slice **before** broadening to advanced dynasties, elaborate arcs or every possible event.

Non-negotiable:

1. The physical board and gameplay resolvers determine all events, dice, strength, law, orders, loot, conquests and outcomes. Narrative never changes actions or randomness.
2. Canonical committed incidents remain authoritative. Memories and interpretations can be biased, mistaken, uncertain or self-serving, but must never silently become facts.
3. Separate generated fictional pre-campaign backgrounds, personally witnessed history, indirectly known events, family stories and recorded statements. Never invent prior campaign incidents.
4. Narratives are authored, local/offline, fact-guarded and saved verbatim. No live LLM or external portrait dependency. The shared silhouette remains sufficient; no mandatory ageing portrait sets.
5. Gameplay instructions, Elephant movement pages and event-stack recap retain UI priority. Scenes remain optional/expandable on the shared physical-play device.
6. All narrative changes are part of one saved transaction with game state and protected action progress. Preview, rendering, import/export and reopening must not resample narrative results.
7. Existing narrative-enabled saves and legacy narrative-disabled saves must remain readable. Activation remains new-campaign-only.

## Approved decision ledger

Each row records **the chosen approach** and **preserved deferred alternatives**. The approved design outlives this milestone's narrower first-release implementation.

| ID | Approved choice | Alternatives preserved, not discarded |
| --- | --- | --- |
| M2-01 | Selective, context-sensitive personal memories | A: every character remembers all major events; C: direct-experience-only memories |
| M2-02 | Dynamic memory importance; memories can fade, strengthen or resurface without losing recorded history | A: permanent importance; C: defining memories never fade |
| M2-03 | Evolving interpretations with preserved originals and evidence-backed revisions | A: fixed interpretations; C: broadly unreliable, self-serving reconstructions |
| M2-04 | Immediate awareness of relevant major political events with potentially imperfect information | A: immediate complete political awareness; C: delayed messenger/information network |
| M2-05 | Directional, multidimensional event-driven relationships with persistent reasons | A: primarily cumulative scores; C: primarily narrative relationship labels |
| M2-06 | Personality-weighted reactions with contextual exceptions | A: personality almost determines reactions; C: events dominate and traits largely affect expression |
| M2-07 | Natural dialogue with selective, traceable contextual callbacks; occasional longer major scenes | A: frequent explicit history explanations; C: predominantly dramatic speeches |
| M2-08 | Selective callbacks with narrative pacing and saved cooldowns | A: frequent callbacks; C: rare high-impact callbacks only |
| M2-09 | Significant saved statements (promises, threats, insults, assurances, gratitude) become memories | A: gameplay incidents only; C: full conversational memory |
| M2-10 | Personality- and relationship-dependent reassessment of challenged beliefs, distinct from emotion and forgiveness | A: new evidence corrects beliefs readily; C: indefinite contradictory beliefs |
| M2-11 | Descendants inherit stories but form independent interpretations, not inherited personal guilt | A: inherit memories and attitudes directly; C: only a narrow set of dynastic traditions |
| M2-12 | Observant, ironic yet factually reliable anonymous chronicler | A: strictly factual chronicler; C: dramatic literary chronicler |
| M2-13 | Curated defining memories in dossiers with expandable source evidence and a complete chronological memory journal | A: chronology-first dossier; C: prose-biography-first dossier |
| M2-14 | Persistent emergent narrative arcs grounded in incidents, participants and compatible possible resolutions | A: inferred implicit arcs only; C: curated dramatic plot structures |
| M2-15 | Dynamic arc prominence based on significance, recent developments, connections and pacing | A: equal attention; C: powerful-character-first attention |
| M2-16 | Contextual speaker prioritisation with direct participants favoured and diverse eligible perspectives expandable | A: fixed role order; C: prominent storyline participants dominate |
| M2-17 | Short contextual character exchanges; occasional longer scenes for exceptional developments | A: independent remarks only; C: full interactive dialogue trees |
| M2-18 | Persistent individual voice profiles distinct from core traits; modest natural variation | A: voice derived directly from traits; C: dramatically evolving voice styles |
| M2-19 | Authored contextual templates plus template/expression/callback repetition management | A: very large authored catalogue; C: generative AI dialogue |
| M2-20 | Experience-weighted, slow core trait evolution; faster mood/confidence/resentment response | A: direct incremental trait modifiers; C: rare dramatic transformations |
| M2-21 | Complete first vertical slice, then expansion | A: all approved features at once; C: infrastructure-first without visible experience |
| M2-22 | First slice covers political/military incidents plus selected administration | A: military/political only; C: all existing narrative triggers |
| M2-23 | Grounded facts with explicitly subjective, evidence-referenced beliefs and uncertainty | A: strict factual memories only; C: extra established fictional events beyond game incidents |
| M2-24 | Automated invariants plus representative narrative scenario tests | A: structural tests and informal review; C: large-scale generated simulation testing |
| M2-25 | Technical acceptance plus joint human review of representative exported campaign chronicles | A: developer sign-off only; C: multiple full physical-game playtests as mandatory acceptance |

## First-release implementation scope (approved)

### 1. Memory data and interpretation safety

Create structured memory records for selected characters and relevant canonical incidents. At minimum persist:

- Stable memory ID; owning character; incident ID(s); subject region(s) and any related character IDs.
- Memory origin: `direct`, `indirect`, `statement`, or `inherited` (the inherited type may be schema-ready but generation is deferred).
- Event category and factual references, distinct from authored subjective interpretation.
- Importance or salience; emotional valence/mood impact; a saved narrative relevance/cooldown marker.
- Whether the belief is a suspicion/opinion or supported fact, and supporting incident/statement IDs. Unknown motives remain unknown.
- Original interpretation if generated, plus room for future versioned revisions. **Full reinterpretation chains are deferred.**

The factual event itself is referenced, not duplicated as contradictory prose. Do not assert meetings, diplomatic negotiations, betrayal, mercy, deaths, secret bargains, deliberate sabotage or promises unless a saved incident or statement supports the assertion. If factual support is absent, use a clearly labelled suspicion, neutral reaction, or no line. Save any chosen wording exactly.

Memory selection: favour the character directly affected, connected rulers/advisers, close relations and relevant opponents; allow major events to become immediately known indirectly to interested characters. No travel-time simulation. Minor events need not create a memory for every character.

Importance evolves contextually: related new incidents can strengthen or revive relevant memories; quiet passage and changing context may reduce their present salience without deleting historical evidence. Exact weight tables are **implementation tuning proposals, not approved probabilities**; choose conservative deterministic/testable defaults and document them before treating them as locked design.

### 2. Relationships and basic gradual reactions

Continue using directional dimensions (respect, hostility, gratitude, mistrust, loyalty, familiarity). Add **recorded causes** referencing incident/memory IDs when significant dimensions change. Allow respect and hostility, or gratitude and mistrust, to coexist. Separate personal opinions of named advisers from broader feelings toward the Company.

Personality and current relationships **weight**, rather than dictate, fictional reactions. Use narrative-only RNG, saved once at commit. Treat core personality changes as rare/small and tied to accumulated strong experiences; mood and confidence may change faster. For this first slice, modest and verifiable trait changes are acceptable; an elaborate life-course transformation engine is deferred.

Narrative changes must not assign player-officeholder identities or imply the fictional adviser ordered a game action. The adviser may interpret an actual administrative incident without fabricating that individual's participation.

### 3. Contextual dialogue and pacing

Extend existing authored templates so a new event can call back to a *relevant earlier saved* incident or consequential utterance. A callback must store its source IDs and exact generated line. Explicit historical references should be relatively selective; memories may influence tone without being recited.

Choose chronicler and speakers based on current involvement first, then relevant relationships/memories, distinctive perspective and recent participation. Ordinary scenes should typically present chronicler plus one/two reactions; expanded perspectives remain optional. Short two/three-line exchanges may be implemented where participants actually have grounded shared history. No mandatory conversation branches or physical-play interruption.

Use saved cooldowns, recent-template/phrase history, and recent-callback history to reduce repetitiveness. If no meaningful character line is eligible, a concise, factual chronicler summary is preferable to repetition. Keep authoring offline and avoid cultural caricatures. Chronicler normally dry/ironic, serious about suffering and political catastrophe, sharper about administrative absurdities. Never turn unproven motives into the chronicler's facts.

Important saved fictional statements are quotable as statements, **not guaranteed truths**. Store exact line, speaker, relevant audience when established, linked scene/incident and narrative type. Reactions to a subsequently contradicted assurance must not automatically conclude intentional lying, especially when no motive is known. Avoid gratuitous promises that imply obligations on players or changes to board rules.

Voice profiles (formality, directness, restraint, humour and characteristic phrasing) may be introduced in a simple persistent form to aid template selection. Extensive voice evolution and a large authored voice catalogue are deferred.

### 4. Event coverage for the first slice

Use existing structured resolver incidents. Mandatory grounded memory/callback coverage:

- Company conquest of Indian-controlled territory and subsequent loss of Company territory.
- Successful and failed Indian-region rebellions.
- Indian conquest/territory subordination and changed allegiance episodes.
- Empire capital collapse and true release of subjects.
- Failed and catastrophic Company deployments.
- Ordinary and repeated taxation, including correct Governor General distinctions.
- Unsuccessful administration and Company intervention restoring order.
- Relevant local ruler and named Company adviser reactions where the existing event proves the association.

Other actions keep their current recorded facts, fallback scenes and mechanical consequences, without mandatory new memory handling. Keep a multi-target action coherent; distinguish primary battles, secondary reactions, territory outcomes and rout counts. Officer routs do not establish named-character death; storms do not establish ship losses; China opium symbols do not establish realised profits.

### 5. Dossiers and chronology

Keep compact map summaries. In a character profile show a curated handful of currently defining memories, short explanations of active relationship reasons and clickable/expandable source incidents. Provide a complete chronological personal memory journal without dropping low-salience memories. Clearly distinguish directly experienced, indirectly learned, fictional starting background and any future inherited accounts. Preserve the full authoritative game chronicle independently.

The first release need not implement extended multi-generation histories, full arc-management UI, illustrated portraits, advanced biographies or new campaign-ending exports beyond adapting the existing printable record.

### 6. Deferred from the first Milestone 2 release

These remain **approved design direction**, not abandoned:

- Multi-generation transmission, dynamic dynasty expansion, heir generation and natural succession.
- Exile/refuge/protector/restoration simulation, weighted ruler fates, additional historical/foreign careers.
- Rich belief-revision chains and nuanced contradictions over decades.
- Full persistent arcs, prominence competition and long-term resolution systems beyond limited schema hooks.
- Deep interpersonal conversations and extensive voice evolution.
- Full trigger catalogue, including trade, storms, Elephant, opium/China, laws and every minor event.
- Broad historical catalogues, titles, treasures and emotional portrait sets.
- AI-generated dialogue or a gameplay-changing standalone game.

Any preparatory schema hooks must be backward-compatible and not silently activate deferred generation.

## Acceptance criteria

**AC-M2-01 Historical truth:** Every memory/quote/callback refers to a committed surviving incident or actual saved utterance; fictional pre-campaign material is separately labelled. Non-observed assertions remain subjective. No stale reference survives an Undo or different Redo branch.

**AC-M2-02 Selective coherence:** Different characters remember the same event differently and with demonstrably different salience when involvement/context differs; relevant indirect awareness does not confer omniscience.

**AC-M2-03 Personal development:** At least one repeated, meaningful sequence changes importance and directional relationship dimensions while preserving reasons; personality/mood effects are bounded, narrative-only and stable after reload.

**AC-M2-04 Contextual callback:** A later eligible incident triggers an understandable callback to a specific earlier conquest, grievance or statement. No callback may use an unsupported event, fabricated quotation or future incident.

**AC-M2-05 Restraint:** Repeated taxes/administrative failures vary response or produce silence; ordinary scenes remain brief, with optional expansion. Direct local participants are not routinely displaced by distant arc participants.

**AC-M2-06 Transaction integrity:** Old saves, new saves, snapshots, import/export, Undo, Redo, cancelled actions, locked/revealed events and saved dice/instruction progress preserve exact memory, chosen words, RNG and cooldown state. A new branch clears Redo coherently.

**AC-M2-07 Mechanical equivalence:** The same reported physical outcomes produce identical canonical board state, incident facts, lawful actions and gameplay RNG with narrative enabled or disabled in all four scenarios.

**AC-M2-08 User inspection:** Dossiers expose significant memories, supporting incidents, relationship causes and chronological journal; no unsupported claims are presented as authoritative history.

**AC-M2-09 Storage/security:** Validate malformed or dangling IDs; escape user-visible text/HTML; respect existing ~6 MB export limit and browser-storage warning behaviour; test long history/Undo growth. Preserve chronology and protected current progress when pruning reversible frames.

**AC-M2-10 Quality gate:** Deliver representative deterministic story fixtures plus readable exported chronicles for **joint human review**. Passing automated tests is necessary but not sufficient for narrative-quality acceptance.

## Required verification scenarios

1. **Conquest → grievance → callback:** A local ruler loses control, stores a grounded memory and later alludes to it after a related event.
2. **Repeated taxes:** First/repeat and Governor General variants are distinguished; grievance grows but template/callback repetition is controlled.
3. **Rivalry and partial reconciliation:** Respect and hostility can coexist; one event modifies attitudes without erasing its historical cause. Use only recorded eligible incidents; do not fabricate a negotiation.
4. **Saved words:** A consequential line stored in an actual scene can be cited later; no fictional quotation appears when no such line exists.
5. **Capital collapse:** Each real released subject gets accurate allegiance history; unrelated rulers do not invent personal witness of the original conquest.
6. **Failed rebellion and officer rout:** No unsupported sovereignty, death, betrayal or restored claimant is asserted.
7. **Undo/Redo alternate timeline:** Undo drops memories and statements from removed incidents; Redo restores exact text and identities; a different new action cannot remember the abandoned branch.
8. **All-scenarios regression:** Four scenario starts, full existing event-stack/ending workflow, old saves, debug isolation, snapshots, pending roll/reveal state, export limits and narrative-on/off board equivalence.
9. **UI review:** Check ordinary and multi-region scenes, roster/dossiers, quiet/standard/full, reload, expandable evidence, regular/debug entry points and readability on the intended shared tablet/laptop layout.

For each scenario, retain machine-verifiable assertions and a short readable narrative trace. Avoid tests that compare only a hard-coded line without checking its required incident facts. Use seeded narrative RNG for reproducible fixtures.

## Approval and agent workflow

- **Approved now:** M2-01–25 choices, preserved alternatives, the smaller Milestone 2 scope above, and this written specification.
- **Not yet authorised:** Editing gameplay/narrative application modules to implement M2; broad refactors; new fictional mechanical rules; adding uploaded publisher PDFs to the repository.
- **On implementation authorisation:** Codex should inspect `AGENTS.md`, this spec, NR requirements, first milestone scope, current code and existing tests; work in reviewable increments. If a meaningful design/tuning decision is unspecified, propose it instead of treating an example as an approved default.
- **On delivery:** Report commit/PR, implemented AC IDs, tests actually run, browser checks, representative chronicles, storage measurements, and any deferred/partially met requirements. Update current-status only with verified behaviour.
- **On acceptance:** The user and review agent examine both automated evidence and story quality; targeted corrections become tracked findings in git, with the requirements decision ledger retained.

All alternatives above are deferred design options unless the user explicitly reopens a decision.
