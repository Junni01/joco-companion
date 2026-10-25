# Collection 09 — Political Foresight, Outlooks and Counsel

**Design approved:** 25 October 2026, from user/ChatGPT discussions.  
**Implementation authorization:** 09A and 09B only. 09C and 09D are approved *direction*, explicitly deferred implementation and prose approval.  
**Status:** Specification; **not implemented by this document**.

Read `AGENTS.md`, `docs/current-status.md`, `docs/narrative/narrative-requirements.md`, current code/tests and [Collection 09 decisions](collection09-decisions.md). Read the [Collection 09 writing brief](writing/collection09-outlooks.md) and existing approved writing/style guide. Existing gameplay resolver and saved facts are authoritative.

## Purpose and experience

The map shows enduring political personalities, while action dialogs are where the story happens. Fictional rulers and Company officers **anticipate** instability from the Elephant, publicly observable event information and their personal experience. They may misjudge the future. Their expectations can be contradicted by real events and rarely revisited in later conversations. Characters never reference tabletop mechanisms.

- **09A — Public political outlook model:** derive credible near-term risks and opportunities from public state, with explicit uncertainty.
- **09B — Persistent private outlook:** show the selected region's ruler's one current internal thought/assessment; stable on rereads, updated at meaningful *committed* changes.
- **09C — Pre-action Company counsel:** one (occasionally two disagreeing) advisers in action planning; may be wise, incompetent, ambitious or opportunistic. *Not authorized for this implementation.*
- **09D — Follow-through and placement:** exact committed advice, post-outcome responses, memory/callbacks and event narrative integrated in resolution dialogs. *Not authorized for this implementation.*

The planned experience is **anticipation → action/outcome → interpretation → memory → renewed anticipation**. Do not build a new strategy game: characters' counsel never changes legal choices, dice, tower strength, unrest, trade orders, control, Elephant paths or event probabilities.

## 09A: exact public-information boundary

Build a **public-knowledge projection** for forecasting, separate from the full internal state/deck order. It may contain:

- Current region controllers, imperial capitals, actual subjects and allegiance origins (known/unknown); strengths, unrest and other publicly shown board conditions.
- Elephant's publicly visible `from/to` position and consequences *legally possible* from it under the existing rules, distinguishing sovereign-border threat, subject rebellion and threats involving Company territory. Never describe a threatened battle as already fought. A Peace event on a border can instead produce an actual negotiated-looking peaceful result when resolved; it is **not** advance proof of a treaty or paid ransom.
- Visible region on the **back** of the next event tile, not its secret face. Do not assume this region is automatically the event's target; event types differ in how they use it.
- Tile identities/types already publicly revealed and in discards; public counts of what remains *possible*, without inspecting the hidden face/order of undrawn tiles.
- Shuffle-specific known batch information from public discards and the already-revealed Shuffle event, subject to the precise resolver sequence.

**Shuffle:** Verify against the implemented resolver and official rules before coding. The Shuffle tile marches the Elephant, is shuffled into the still-unseen remaining pile, and the discarded events are shuffled and placed on top. Thus a returned set of three Crisis discards means that—absent another intervening deck-changing effect—the next three draws are Crisis in *unknown* order. This is strong short-term public evidence of danger, not a guaranteed conquest or a licence to name game events in a character's speech. Track the known top-batch **composition and remaining draw count** through legal draws, including save/reload/Undo, and drop/adjust it when exhausted or another real stack operation changes the knowledge boundary. Avoid storing hidden positions or exposing fronts.

**Critical information-security regression:** For two hidden deck permutations with identical publicly revealed top region, discard history, known returned batches and visible board conditions, the resulting **forecast eligibility** must be identical. No narrative text or template selection can reveal the next hidden face. The game can privately know the true draw order, but the forecast subsystem must never consult it for selection. If public information is insufficient to track a batch safely, withhold that inference rather than guess.

Possible topical assessments: imperial appetite at a sovereign border; audacious weak attacker; defensive sovereign anxiety; subject agitation; Company occupied province at risk (unrest and potential secondary rebellions); commercial disruption; diplomatic relief; court intrigue; foreign-threat rumours; short known run of dangerous returned events; uncertain ordinary stack. Distinguish primary from secondary threats. Risk should include relevant strength and unrest *where the rule permits*; do not invent army inventories, player Standing or unreported player motives.

Outlooks are provisional subjective views, not machine assertions that war, treachery, expedition, shipment, negotiation or payment happened. An adviser may sensibly warn of defence needs; a vain ruler may prefer opportunistic interpretations. A forecast must remain truthful about known versus inferred circumstances.

## 09B: persistent outlook selection and display

- Show one compact **private thought** for the currently selected region's active local ruler, alongside established name, role/mood and dossier access. A thought can be inner speech, judgment or private assessment, **not** a public quotation.
- Choose from authored, fact-guarded content. Eligibility first, then character personality/confidence/experiences/relationships and restrained pacing. Source both observable situation and personal interpretation. Competing priorities include immediate crisis, enduring grievance, ambition, fear and pragmatic gratitude.
- Reading/selecting a region, clicking a profile, changing tabs, exporting and rendering must not mutate or sample narrative randomness. Render the already saved thought.
- A committed Elephant move, visible stack transition, Shuffle, conquest, rebellion, Peace or significant personally meaningful act may trigger reconsideration, but **do not rotate text automatically after every trivial change**. Unchanged thought is legitimate.
- Store exactly the selected text/template and evidence/context necessary to keep it stable through current-version save/import/export, autosave, reload, snapshots, Undo/Redo and branches. Preserve previous mood-related memories; do not create duplicate permanent relationship scores. Handle narrative-off campaigns without adding state.
- Private thoughts are not audible to NPCs, cannot become recorded public promises, and cannot themselves prove off-screen facts. A rare *significant prediction* may be recorded as a private belief and later revisited on supported contradictory/confirming events, but large prediction-arc generation can be deferred unless safe within scope.
- Existing scenario/character persistence and total save-size limits remain authoritative. Do not add a network service or image-generation dependency.

## Presentation direction and future 09C/09D contracts (do NOT implement now)

**Action dialogs, not map, should ultimately host event speech.** Resolve and prominently show physical rules/instructions first; preserve dedicated Elephant movement page and exposed-top-region recap; then show chronicler and priority speakers in the relevant action-resolution dialog. Chronicle retains every saved incident/line and thematic chapters. Standard mode stays concise and skip-friendly.

**Pre-action counsel** is intended to appear directly when player opens a Deploy planning dialog and may adapt to intended army/target/commitment using *only known tracked facts*. One short recommended course of action is normal, a second contradictory adviser occasionally useful; sometimes silence. Competence is distinct from caution and ambition: a competent glory-seeker can correctly understand danger yet seek loot, an incompetent clerk may miss it, a cynical secretary may expect to be ignored. Avoid a fixed good-adviser/bad-adviser morality system. Other action dialogs may gain counsel later.

**Provisional versus committed:** Opening/configuring/cancelling must not change historical state, cooldowns, stored relationships, RNG or memories. If an action commits, preserve *exactly* the advice the user was actually shown—no post-outcome reroll or retroactively prophetic recommendation—together with any eligibility/source references. Post-outcome commentary may gently acknowledge warning, disagreement, vindication or error without claiming an untracked troop balance or player's secret motive. Advice has no mechanical consequence. Specific persistence/transaction design to be reviewed during 09C implementation; do not pre-empt it in 09A/09B.

## 09A/09B acceptance

1. Empire capital Elephant threatening sovereign neighbour creates supported ambition and defensive apprehension, with different voices.
2. Actual weak versus powerful political position yields different eligible interpretations, not fabricated certainty.
3. Subject/capital rebellion risk distinguished from sovereign attack; Company internal unrest and secondary risk distinguished from border invasions.
4. Next visible tile region is used only as publicly exposed context, never as foreknowledge of its face/outcome.
5. Simulated shuffled returned batch of three Crisis events gives strong *event-type-level* military-climate warning but does not disclose order or suggest three certain victories.
6. Mixed Crisis/Peace batch and normal uncertain stack yield appropriately less definite outlooks.
7. Known-batch consumption, reshuffle, exhaustion, undo/reload preserve correct public projection.
8. Different hidden permutations with identical public information give identical forecast eligibility and no hidden-face leakage.
9. Selected-region thought is stable on repeated selections, profile opens, reload and rendering; material commits may update it, trivial changes may leave it unchanged.
10. Save/import/export/Undo/Redo current-schema consistency and narrative-on/off exact mechanical equivalence.
11. No public knowledge of private thoughts or unjustified promises, deaths, actual loot transfers or predictions presented as facts.
12. Approved integrated prose contains no game-component terminology in in-world speech (writing brief).
13. UI checks on regular and debug entries, including a representative Elephant/Shuffle/region-selection sequence and cancellation unaffected.
14. `npm test` and applicable browser smoke checks; no unverified claims.

## Review and delivery

Produce a concise code/design report and **small** human-readable demonstration: contrasting ruler outlooks, Elephant threat, threatening Shuffle, repeated selection, actual event resolution and revised/unchanged outlook, with public-evidence explanation. Avoid generating another bulk repository of chronicles. Give exact test results, limitations, updated `docs/current-status.md`, and commit/hash. Implement 09A/09B only; no speculative system for untracked player motives and no new portraits, foreign expeditions, succession, 09C/09D, repository cleanup or hosting deployment. Human creative review of final authored text is separate from technical passing tests.
