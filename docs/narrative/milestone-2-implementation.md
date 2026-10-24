# Milestone 2 first-release implementation and review handoff

Implemented locally on 24 October 2026 after the user's explicit implementation authorization. Authority: `AGENTS.md`, `milestone-2-political-memory.md`, and `milestone-2-codex-handoff.md`, including M2-26 and M2-27A–E. This report describes verified implementation, not a change to the approved decisions or their preserved alternatives.

## Outcome

The normal touch controls support a complete sequence: Company conquest → personal memory and institutional grievance → later Tax/administration → contextual callback → inspectable dossier evidence. A subsequent intervention can cool a grievance without deleting it, produce a named adviser's saved assurance, and allow that exact statement to be quoted after later unrest. A quote establishes what was said, not a promise of the physical game's outcome or evidence of intentional deception.

Memory handling also covers Company territory loss/defence, successful and failed Indian rebellions, Indian subordination, changed allegiance, actual subject release on capital collapse, failed/catastrophic Company deployment, ordinary/repeated/Governor General Tax, unsuccessful administration and intervention. Opposing rulers can remember the same outcome with different emotions and significance. Interested relatives and institutionally associated advisers can learn relevant outcomes indirectly; this does not establish eyewitness attendance or private knowledge.

## Reviewable local increments

- `a001f48` — first grounded memory/grievance/callback sequence, dossier evidence and current-version persistence.
- `68ea84a` — opposing political perspectives, timeline integrity, broader event coverage and reproducible review/browser tooling.
- `37ebc71` — additional current-version recovery checks and centralized experimental tuning.
- The documentation/review-package commit following these records the generated artifacts and final verification. No GitHub push, PR or hosting deployment was performed.

## Runtime contracts

- Canonical incidents stay in game history. Each emitted fact has a stable `factId`; defence keys are preserved separately. Primary/secondary Company battle stages are recorded without changing resolution order.
- Personal memories reference committed incident/fact IDs. Historical significance and current emotional importance are separate 0–100 values; emotion/valence is separate again. Original subjective interpretations are preserved.
- A current assessment can acknowledge a challenged assurance while leaving its original wording and interpretation intact. Reassessment varies with personality and the relationship to its author; it does not establish guilt or automatic forgiveness. Rich revision chains remain deferred.
- Relationships use distinct `character` and `institution` targets. Actual bounded deltas, source memories/statements and explanations remain recorded. A Company grievance is not transferred to a named adviser.
- Every scene line has an ID, template ID, exact text, speaker and expression, current factual references and any memory/statement callbacks. Statements retain their exact source line and explicit fictional audience when established.
- Voice profiles are persistent and separate from core traits. Memory, template/phrase and speaker pacing have distinct saved markers. Direct local relevance remains the primary speaker-selection consideration.
- Rendering, previews, profile inspection and export do not generate memories or consume narrative RNG. The commit processor is idempotent and uses only its saved independent PRNG; it does not consume gameplay crypto.

The implementation extends the existing commit boundary and narrative foundation. It does not replace the rule engine, add physical reporting tasks, simulate player officeholders, or generate deaths, new rulers, succession, exile/restoration, inherited accounts or full arcs.

## Selected trial tuning

All M2 experience, reaction and pacing tuning is centralized in `dist/narrative-policy.js` under `m2-trial-1`. These are experimental defaults within the approved ranges, not permanent balance decisions.

| Area | Current trial behavior |
| --- | --- |
| Memory | Conquest 85 historical / 80 emotional; subordination 70/65; successful rebellion 85/75; failed rebellion 65/65; ordinary Tax 25/25; repeated Tax 45/45. Context and political perspective alter the response. Indirect family/institutional awareness receives lower personal significance. |
| Context | Related incidents add 12 emotional importance; major reopening adds 20; helpful intervention can reduce an earlier grievance by 15. Historical significance remains recorded independently. |
| Fading | Ongoing occupation/subordination and actively unresolved administrative unrest suspend blind fading. Otherwise defining memories cool by 1 per committed New Turn and ordinary resolved memories by 2. Zero-importance memories remain in the journal. |
| Relationships | Conquest base hostility 20, ordinary Tax 3, repeated Tax 6, unsuccessful administration 4, intervention gratitude 9/respect 4/hostility −7. Personality can modestly weight hostile reactions. Positive changes diminish near a dimension's maximum. |
| Personal advisers | Small positive responses can follow an actual saved exchange; their causes cite the statement and do not credit the adviser with ordering an intervention. |
| Development | Confidence begins at 50 and responds faster to directly affecting experiences. Three distinct strong experiences can cause a small ±1–2 caution change, at most once per character per turn. This is a limited initial development path, not a full life-course engine. |
| Dialogue | A memory source normally waits 3 relevant incidents before explicit reuse; an overall 2-incident callback gap also restrains ordinary scenes. A new major outcome can override a memory cooldown with fresh supported wording. Templates/phrases use a 3-incident window; recent speaker appearance supplies a separate ranking penalty. Recent histories are bounded buffers. |

## Current development persistence

The JSON campaign wrapper is **version 2** and narrative state is **version 2**. The existing mechanical board contract remains unchanged. Both narrative-enabled and narrative-disabled current-version campaigns support autosave/reload, snapshots, JSON import/export, and persisted Undo/Redo.

There is no M1-to-M2 converter, historical backfill, old-frame migration or old-fingerprint conversion. Unsupported development files are rejected clearly. Startup leaves their stored campaign/progress bytes untouched and suspends automatic replacement; Saved games can download the unchanged stored copy. Starting a new campaign or importing a supported current-version campaign is an explicit user action.

Current-version saved rolls, revealed tiles, officer reports and instruction cursors remain paired with exact campaign state. Renaming is metadata-only and can preserve/rebind current protected progress even with a revealed tile; gameplay remains locked. An explicit URL-based new-game reset clears the unsupported-save gate. Invalid current-version references are rejected before replacing play.

Referenced individual debug history cannot be deleted. The message lists blocking memories, statements, relationship causes, saved lines, personal journals or chapters. Normal atomic Undo/Redo, checkpoint restoration and whole-campaign reset remain allowed. Detached evidence archives and cascade repair are not implemented.

## Verification actually performed

**Automated:** `npm test` — **171 passed, 0 failed**. This retains the existing rules/phase/deck suites and full real event-stack/ending workflows for all four scenarios, comparing narrative-on/off mechanical outcomes and canonical facts. Additional regressions cover the visible story loop, selective awareness, opposing rulers, partial reconciliation, exact quotations, malformed/dangling/future evidence, core development, context-sensitive fading, independent RNG, alternate branches and protected progress.

App-control integration tests cover unchanged unsupported save/progress bytes, current-version import, named snapshots, reload, a revealed tile, metadata rename, exact Undo/Redo, rejected imports and explicit reset recovery. A separate saved invasion-die/officer-report/instruction-cursor test uses a campaign that already contains political memories and a quoted assurance.

**Browser:** isolated headless Chrome 156.0.8078.47 over local HTTP, using fresh browser contexts rather than the user's saves. Verified the normal-control conquest/Tax/intervention/quote sequence, inert previews, profile evidence, quiet/full display, snapshot/export, exact Undo/Redo across reload, protected reveal/rename, four scenario starts, regular/debug isolation, named deletion blockers, incompatible-save preservation and explicit new-game recovery. Checked 1440×1000 desktop, 1024×768 tablet and 390×844 mobile layouts with no horizontal overflow in the checked map/dossier/error views. No page errors were recorded. Desktop/mobile dossier, live scene, debug and printable HTML screenshots were inspected. Full physical-game playtesting and printed-page pagination were not performed.

Reproduction tools:

- `node scripts/export-m2-review.mjs` regenerates the six seeded synthetic chronicles and measurements.
- `scripts/check-m2-browser.cjs` is an optional Playwright check against a running local HTTP server. Supply `JOCO_PLAYWRIGHT`/`JOCO_BROWSER_EXECUTABLE` when using an external bundled runtime, then pass the `/dist/` base URL and screenshot-output directory. Playwright is not a required application or `npm test` dependency.

See [browser results](review/m2/browser-checks.json), [storage measurements](review/m2/storage-measurements.json), and [review package index](review/m2/README.md).

## Storage measurements

The four five-incident story fixtures are approximately 96–132 KB of UTF-8 JSON. A synthetic stress case with 120 Tax reports retains all **121 incidents and 243 memories**. Its current campaign is **1,513,662 bytes**. A backup requested with 20 Undo and 20 Redo frames fits at **5,762,405 bytes**, retaining 3 Undo frames and no Redo frames; current history, memories and protected current state are not pruned. Encoding was approximately 0.65–0.70 seconds on this machine. Browser quotas can be lower than the 6 MB export cap; existing storage warnings remain.

Saturated importance scores do not append redundant no-change reinforcement records. Actual historical memories, relationship causes and meaningful assessment changes are retained.

## Acceptance mapping and remaining review

| Criterion | Evidence/status |
| --- | --- |
| AC-M2-01 | Referential/temporal checks, exact statement identity, source-backed memories/callbacks and alternate-branch tests. Implemented and technically verified. |
| AC-M2-02 | Different direct, indirect, family, institution and opposing-sovereign interpretations/significance. Implemented and technically verified. |
| AC-M2-03 | Reinforcement/cooling, directional causes, coexisting attitudes, bounded confidence and supported caution changes. Implemented and technically verified. |
| AC-M2-04 | Conquest callback and later exact saved-assurance quotation in normal controls and fixtures. Implemented and technically verified. |
| AC-M2-05 | Saved memory/template/speaker pacing, variation or silence, local relevance and expandable scenes. Implemented; editorial frequency remains open to joint review. |
| AC-M2-06 | Current-version autosave/snapshot/import/export, exact Undo/Redo and paired protected progress. Implemented and technically verified. No old-version compatibility claim. |
| AC-M2-07 | Four-scenario full workflows, unchanged rule suites and explicit no-gameplay-crypto consumption test. Technically verified; no rule mechanic was intentionally changed. |
| AC-M2-08 | Defining memories, current concerns, original/current interpretations, relationship causes, source expansions and full personal journal. Implemented and browser checked. |
| AC-M2-09 | Reference validation, escaped UI/export, invalid-file preservation, frame checks and UTF-8 size pruning. Implemented and tested. |
| AC-M2-10 | Six deterministic HTML/JSON fixtures and readable source-linked traces delivered. **Joint user/review-agent narrative-quality acceptance remains pending.** |

Start joint review with `story-1710.html`, then `story-1813.html`, `capital-and-rebellion.html` and `setbacks-and-routs.html`. Inspect whether the continuity feels earned, reactions stay distinct, the quote feels natural, and grief/reconciliation remain appropriately restrained. Record corrections as dated findings tied to the relevant AC/M2 IDs.

Inherited stories, dynamic dynasties, succession, ruler fates, exile/restoration, adviser/foreign careers, full arcs, rich reinterpretation chains, broad new trigger coverage, historical catalogues and portrait sets remain deferred according to the approved specification. Existing artwork and rules stay in place. The original decision ledger and its alternatives have not been rewritten.
