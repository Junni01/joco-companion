# John Company India Companion

An unofficial touch-friendly companion to the physical John Company Second Edition game. Source modules live in `dist/`; there are no build dependencies. **Do not delete `dist/` as generated output.**

- `dist/model.js`: board catalogue, initial state, invariant checks and save serialisation.
- `dist/app.js`: map UI, action dialogs, history, autosave, snapshots and import/export.
- `docs/state-model.ts`: typed state contract and future deployment report.
- `dist/design-specification.md`: current implementation scope and consolidated narrative decisions.
- `tests/model.test.js`: meaningful state/persistence tests. Run `npm test` or `node --test tests/*.test.js`.

## Run locally

Requires a modern browser and Node.js for tests. There is no dependency installation or build step.

```sh
npm test
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173/` for regular play or `http://localhost:4173/debug.html` for the isolated debug workspace. Use HTTP rather than opening the HTML file directly.

## Current functionality

- Vector India map with orders, trade routes, towers, unrest, Company control, empires and legal Elephant positions.
- Four scenarios, turn progression, Deploy, Special Envoy, Governor and Governor General actions.
- Persistent randomized twenty-tile event stack, exposed-region display and staged event resolution including foreign invasions, rebellions, rout reporting and Elephant movement.
- Relevant Parliament laws/dilemmas, blackmail actions, China-office/opium reminders, cumulative region-loss instructions and end-game chronicle completion.
- Autosave, Undo/Redo, snapshots, JSON import/export and readable chronicle export.
- Separate debug board/deck editor, law/office controls and checkpoints using the same rules as regular play.

The first playable narrative slice is available from Saved games → New game → Narrative mode On. It adds persistent fictional rulers/families/advisers, saved scenes, a roster, turn chapters and printable history. Random deaths, natural succession and advanced political arcs remain deferred. See [milestone scope](docs/narrative/first-playable-milestone.md). Players still handle families, money, votes, ships, Army inventories and actual China trade outcomes on the physical table.

## Handoff documentation

- [AGENTS.md](AGENTS.md): instructions for future coding agents.
- [Current status](docs/current-status.md): decisions, implementation boundaries and transfer notes.
- [Debug guide](docs/debug-mode.md): setup editing and test flows.
- [Rules audit](docs/buried-giant-rules-audit.md): publisher rules comparison and corrections.
- [Official app comparison](docs/official-app-comparison.md): research, not authoritative rules.
- [Narrative review](docs/narrative/John_Company_Narrative_Mode_Review.docx): detailed agreements, proposals and unresolved matters.

The accumulated design specification contains some earlier descriptions. Current JavaScript and tests determine implemented behavior and save format; `docs/state-model.ts` is an older proposed contract.

## Milestone 2 political memory

New narrative campaigns now retain personal memories, directional relationship causes and contextual callbacks to supported incidents or exact saved statements. Character profiles expose defining memories, current concerns, source evidence and a complete personal memory journal. See [implementation and verification](docs/narrative/milestone-2-implementation.md) and [synthetic chronicles for joint review](docs/narrative/review/m2/README.md).

This experimental build uses development save version 2. It preserves current-version autosave, snapshots, JSON import/export, Undo/Redo and protected rolls/reveals, but does not migrate older development saves. Unsupported stored data is left untouched until an explicit replacement. Narrative-quality acceptance still requires joint review.

## Approved dialogue collections

The first dialogue integration selects 42 exact approved entries from Collections 01–04 using recorded facts, relevant memories, relationships and individual voices. It reuses M2 persistence and cooldowns; long exchanges and Collection 05 remain deferred. See the [technical report](docs/narrative/approved-dialogue-implementation.md), [entry-level deferrals](docs/narrative/approved-dialogue-deferred.md) and [campaign review package](docs/narrative/review/approved-dialogue/README.md). Narrative-quality review remains with the user and ChatGPT.

## Collection 07 polish

Collection 07 adds 19 exact fallback alternatives and derives political reactions from existing grievances and relationship evidence. Hostile rulers no longer automatically welcome Company suppression. See the [technical report and deferrals](docs/narrative/collection07-implementation.md) and [multi-turn narrative review package](docs/narrative/review/collection07/README.md).

## Collection 08A trade dialogue

Commercial reactions now use 20 exact approved entries, actual disruption/restoration evidence and personal experience instead of repeated reassurance. Gameplay order terminology is preserved. See the [technical report and deferrals](docs/narrative/collection08a-implementation.md) and [multi-turn review package](docs/narrative/review/collection08a/README.md). Chapter composition is covered separately by Collection 08B below.

## Collection 08B thematic chapters

End-of-turn chapters now select one or two evidence-backed threads instead of enumerating action labels. Exact conditional passages, narrower factual variants, saved source inspection and quiet turns preserve the separate full chronology. See the [implementation and writing audit](docs/narrative/collection08b-implementation.md) and [multi-turn chapter review](docs/narrative/review/collection08b/README.md). Narrative-quality acceptance remains with the user and ChatGPT. The [approved fallback polish and guarded final coda](docs/narrative/collection08b-fallback-polish-implementation.md) have a [new multi-turn review package](docs/narrative/review/collection08b-polish/README.md).

## Collection 09A/09B political outlooks

The selected region now shows a saved private ruler assessment grounded in public circumstances and personal experience. Known Shuffle batches inform outlooks without exposing hidden fronts or order. See [implementation and limits](docs/narrative/collection09-implementation.md) and the [small creative-review demonstration](docs/narrative/collection09-demo.md). The [approved writing polish](docs/narrative/collection09-polish-implementation.md) provides personality variants; the [final evidence review](docs/narrative/collection09-evidence-implementation.md) enables 56 of 60 entries, including one specific-road condition, with four consequential-fact deferrals; see the [small integration review](docs/narrative/collection09-polish-demo.md). Company planning counsel and committed outcome integration are described below; 09D-2 dialog delivery is described below.

## Saves and hosting

Campaigns live in browser storage, separately for regular and debug play. Source transfer does not move them: export JSON in the app and import it in the destination browser.

The existing Sites host serves `dist/` using `.openai/hosting.json`. Pushing to GitHub does not automatically deploy that host. Preserve its project identity and never commit hosting credentials.

Reference assets derived from supplied game materials retain their original owners' rights. This repository does not grant a license to those materials; no project-wide license has been selected. Keep repository visibility appropriate for the included materials.


## Collection 09C-1 Company Operations

The India page now has permanent Director of Trade and Bombay/Madras/Bengal Army panels. Army Deploy fixes its origin before choosing a legal target; Governor administration stays in the selected Company region. Special Envoy starts with a provisional intended effect, permits revision after success, and distinguishes establishing the China office from the later physical Trade in China check. Governor General replacement is reflected in the controls.

See the [implementation report and small UI demonstration](docs/narrative/collection09c1-implementation.md). This is a UI-only integration: adviser counsel, new memories and 09D dialogue movement remain deferred. No hosted Site deployment.

## Collection 09C-2 planning counsel

Narrative-enabled Army, Director/China and optional Governor planning now reuse continuing advisers for exact approved, fact-guarded counsel. Unchanged previews remain stable and create no saved incidents, quotations or memories. Existing cast IDs and current-version saves are preserved. The 09D-1 extension below adds history only when the real action commits; recurring callbacks remain deferred.

See the [implementation report](docs/narrative/collection09c2-implementation.md), [small creative-review demonstration](docs/narrative/collection09c2-demo.md) and [enabled/withheld dialogue IDs](docs/narrative/collection09c2-dialogue-status.md). Integrated voice selection/pacing remains for user/ChatGPT review. No hosted Site deployment.


## Collection 09D-1 committed advice

Exact displayed planning words and compatible immediate reactions now save with the actual committed action. Actual pre-result rendering records when the adviser offered counsel without adding a reading acknowledgement; cancellation leaves no history. Envoy success remains legally revisable, while failure creates no ignored-choice claim. Standard scenes stay brief, with expandable original advice and dossier/chronicle evidence.

See the [implementation and withheld-effect limits](docs/narrative/collection09d1-implementation.md), [small creative-review demonstration](docs/narrative/collection09d1-demo.md) and [verification](docs/narrative/collection09d1-verification.json). 09D-2 delivery is described below; 09D-3 recurring callbacks/rivalries remain deferred. No hosted Site deployment.


## Collection 09D-2 narrative action dialogs

Physical instructions retain their existing commit/report sequence. Narrative mode then shows one complete saved scene in the action dialog, with read-only navigation back to instructions. Normal/quiet mode adds no story step. India events retain separate Elephant/public-stack stages and private outlook anticipation; the complete record remains accessible without replaying the last scene on the map.

See the [implementation and writing gaps](docs/narrative/collection09d2-implementation.md), [small application demonstration](docs/narrative/collection09d2-demo.md) and [future-phase engineering assessment only](docs/narrative/collection09d2-phase-assessment.md). No new Revenue/shareholder/Parliament workflow, 09D-3, portraits or hosted Site deployment.


## Narrative weather and invasion presentation

Narrative mode now shows ocean conditions before the separately revealed India-event count and silently preserves invasion target/strength results. Normal mode keeps its dice graphics and initial manual storm option. Exact physical procedures, protected results and current saves remain unchanged. Collection 09E now integrates the 81 approved atmospheric scenes; integrated selection and pacing remain for review.

See the [implementation and writing gaps](docs/narrative/collection09d2-weather-implementation.md), [small demonstration](docs/narrative/collection09d2-weather-demo.md) and [verification](docs/narrative/collection09d2-weather-verification.json). No hosted Site deployment.


## Collection 09E dialogue

All 81 approved weather, tension and invasion scenes now use actual saved facts and stable saved wording. Weather/invasion scenes appear automatically before the existing physical instructions and report controls; tensions appear only at count reveal. Already presented scenes do not replay on resume. No new NPCs or gameplay changes. See the [implementation](docs/narrative/collection09e-implementation.md), [small demonstration](docs/narrative/collection09e-demo.md) and [verification](docs/narrative/collection09e-verification.json). No hosted Site deployment.


## Persistent character foundations — Milestone 1

The original 23 identities now support six public life statuses and separate optional political-role/history records. Existing committed role changes retain provenance; no new fates or succession are generated. Current-version saves load without migration/backfill. See the [implementation](docs/narrative/character-engine-m1-implementation.md) and [small demonstration](docs/narrative/character-engine-m1-demo.md). No hosted Site deployment.


## Character Engine Milestone 2A — Families and Claims

Optional typed family links, house affiliations and structured claims extend the existing engine. Dossiers show known relationships and claim provenance; existing sibling identities and saved games remain unchanged. No family generation or automatic succession. See the [implementation/compatibility report](docs/narrative/character-engine-m2a-implementation.md) and [small existing/synthetic family demonstration](docs/narrative/character-engine-m2a-demo.md). No hosted Site deployment.
