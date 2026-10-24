# Approved dialogue integration — first playable release

Implemented locally on 24 October 2026 under the user's explicit authorization. This is a technical integration report; narrative-quality acceptance remains with the user and ChatGPT.

## Delivered behavior

The existing M2 story loop now selects exact approved writing: conquest → persistent personal grievance → later regional Tax/unrest → contextual callback → dossier source evidence. A representative **42 entries** from Collections 01–04 (including conquest callbacks, 01B) cover conquest, taxation, actual administrative failure, unrest, resolved rebellions, failed expeditions, catastrophes and conquest victories. The original writing documents are unchanged.

Short reactions are the integration unit. Standard presentation remains the chronicler plus up to two relevant reactions; further perspectives are expandable. No long exchange or personal conversation is activated. Quiet/Full controls, chapters, shared silhouette, regular/debug workspaces and gameplay instruction priority are preserved. The current M2 assurance/quotation sequence remains available alongside these approved lines. Existing fallbacks remain for uncovered personalities/events and during cooldowns; this does not replace every older M2 line with approved prose.

## Technical changes and reused contracts

- `narrative-approved-content.js`: 42 stable IDs, source collection, exact text and expressions copied verbatim from approved tables. A source-parity test checks every word and expression against the repository documents.
- `narrative-approved.js`: pure candidate eligibility before voice weighting, followed by saved independent narrative RNG tie-breaking. High traits, restrained/dry/formal voices, institution hostility and personal memory salience shape selection. Ruler identity, living eligibility, region, Army/Presidency association, actual outcome and current-branch sources are required. No model, network request or new gameplay fact is introduced.
- `narrative-policy.js`: centralized trial selection thresholds. High trait 60, professional caution 50, institutional bitterness 20, restraint/formality 2, humour 1, defining significance 75; eligible memory callbacks receive priority, then matching trait and salience weights. Existing M2 source/template/speaker cooldowns remain in use. These values affect fiction only.
- `narrative-dialogue.js`: invokes the approved selector inside the existing commit boundary. A single-region authored chronicler observation can replace the factual summary; multi-region summaries retain their factual coverage. Existing supported quotation callbacks take priority. Remaining eligible reactions/fallbacks use the current M2 selection flow.
- `narrative-state.js`: additionally validates approved text/expressions, current incident evidence, role/association and required earlier direct conquest. Historical validation uses the region's state at that incident, rather than later control or changed personality, and never reselects the scene.
- Dossiers and exported character evidence now include **Saved words and their evidence**: exact stored words, catalogue/line IDs, current source facts and earlier callback sources behind expansion controls. Rendering never selects dialogue or consumes RNG.

No changes were made to `model.js`, `actions.js`, gameplay resolvers, character portraits, save serialization or transaction mechanics. Existing resolver-owned facts, personal memories, directional relationships, saved pacing, scene line fields, source indexing and Undo/Redo frames were reused. There are no new permanent relationship axes, genealogy systems or event types.

### Evidence distinctions

An ordinary Tax does not establish reform, paid personal revenue or oppression. An unrest cube is not a resolved rebellion. Failed military deployment and catastrophe remain distinct, and a failed intervention is not a failed conquest. Company rebellions are recognized from the existing defence facts' exact Leader/Crisis keys or secondary rebellion stage; unrelated primary invasions do not qualify. Indian-subject rebellion outcomes use actual battle and independence facts. Restored sovereignty never establishes physical troop withdrawal or a named character's restoration/death.

All newly integrated callbacks require an earlier **directly affected** memory owned by the actual speaking ruler in the same region. This does not imply eyewitness attendance. No standalone statement is silently converted into a conversation with an invented audience. Existing M2 assurances keep their explicit saved speaker/audience and exact quotation behavior. Approved utterance-dependent callbacks whose prerequisites are absent stay deferred.

### Persistence and scope

Selected lines reuse the existing `templateId`, saved full text, speaker identity, expression, current fact references and `callbackMemoryIds`. The same commit saves memories, relationship causes, PRNG and cooldowns. Current-version reload, JSON/snapshots and Undo/Redo restore those stored results. Alternate branches have no abandoned dialogue. Development save version 2 remains current; no migration, backfill or compatibility work was added.

[Entry-level deferrals](approved-dialogue-deferred.md) distinguish **missing facts/utterances/identity contracts** from entries merely held outside this representative selection. Collection 05, longer personal conversations, full exchanges, new careers, causal weather, named casualties and portraits remain deferred. No additional technical approval is required for the delivered scope.

## Verification

- Baseline: 171 passing tests. Final: **184 passed, 0 failed** with `npm test`.
- New automated coverage: verbatim approved-source parity; personality selection; relationship-sensitive bitterness/reconciliation; genuine conquest callback sources/dossier inspection; no invented setup conquest; Tax/admin/unrest/failure/catastrophe distinctions; Company rebellion versus invasion; source cooldowns; exact saved Undo/Redo/branching; all-four-scenario on/off mechanics equivalence; malformed words/triggers/evidence rejection; render purity and deferred prerequisites.
- Existing gameplay, full event-stack/end-game, saved roll/reveal, isolated debug, snapshot, current-version recovery and large-save pruning tests still pass. The large-save regression now creates 120 real committed Tax actions instead of cloning fictitious conquest records, so every approved line has its own valid evidence.
- Isolated Chrome 156.0.8078.47 over HTTP: actual touch controls for conquest/Tax; exact approved callback; dossier evidence expansion; preview cancellation; intervention/quotation; reload and Undo/Redo; snapshot/export; all four starts; regular/debug isolation; referenced-incident deletion rejection; protected tile progress; unsupported-save preservation and explicit reset recovery. No page errors. Checked 1440×1000, 1024×768 and 390×844; dossier and page overflow assertions passed. Screenshots inspected for layout. This is technical browser verification, not full physical-table playtesting or narrative acceptance.

Reproduce browser checks with the optional external Playwright runtime: `JOCO_PLAYWRIGHT=... JOCO_BROWSER_EXECUTABLE=... node scripts/check-m2-browser.cjs http://127.0.0.1:4174/dist/ output-directory`. No runtime dependency or build step was added to the application.

## Narrative review handoff

[Review package index](review/approved-dialogue/README.md) contains ten seeded synthetic campaign chronicles, current-version JSON, exact dialogue traces with source IDs, coverage and browser results. The traces demonstrate **34 of the 42 integrated IDs** across normal loops in all four scenarios, declared proud/cautious/vindictive personas, successful/suppressed rebellions, reconquest failure and professional/overconfident/careerist military reactions. The examples use actual resolvers and valid reported outcomes; manually triggered event fixtures are explicitly labelled. No personal campaigns are committed.

Generate with `node scripts/export-approved-dialogue-review.mjs`. Do not infer a missing audience, promise, retreat, battle death or administrative reform from a joke. Review the continuity and individual voices, the frequency of satire/callbacks, the remaining M2 fallback wording and any abrupt emotional transitions. Technical tests and these fixtures provide material for that review; they do not approve the writing's effect in play.

## Local increments

`0aaae47` records the first playable catalogue/selector integration, dossier evidence and its core regressions. The following verification/documentation increment centralizes the selection thresholds, extends browser checks and supplies reproducible review material and explicit deferrals. No GitHub push or deployment is part of this delivery.
