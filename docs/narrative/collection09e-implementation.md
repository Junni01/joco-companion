# Collection 09E implementation — 26 October 2026

Implemented on `main` after pulling approved baseline `5cf165c`. **All 81 approved scenes integrated unchanged:** 25 weather, 20 tensions, 12 generic invasion announcements, 8 France announcements, 15 force descriptions and N-01. Exact speaker labels, punctuation and wording are tested against both source Markdown files. Only canonical region placeholders are interpolated. No catalogue entry is globally deferred.

## Selection and evidence

`narrative-staged-content.js` is the static approved catalogue; `narrative-staged.js` adds a small context selector to the existing saved-incident pipeline. It reuses history, cast seats, saved narrative seed and the complete-scene renderer rather than creating another character/memory engine. A deterministic hash breaks eligible ties without advancing narrative or gameplay RNG. Previous eligible templates, adjacent editorial themes and single/multi-speaker rhythm are penalized in that order. N-01 has no alternative, so cannot promise non-repetition.

Weather uses only the actual saved face. Tensions use its visible event count and are not selected before the existing weather-resolution boundary. Invasion uses the actual generic/France source and shared legal targets in order. A target appraisal is selected only after its own raw strength is saved; the three ranges are editorial and never added as game rules. Hidden tile order, concealed event faces, future outcomes and private outlooks are not selection inputs.

F-09 requires Company control of every target and no Governor General law; no player officeholder/incumbency claim is made. F-03 and H-03 require an existing living regional ruler. These are contextual exclusions, not permanently withheld entries. Anonymous merchants, clerks and courtiers retain approved role labels and create no NPCs. No actual casualties, completed commerce or new biographies are inferred.

## Presentation and persistence

Weather and invasion scenes use optional **Read scene** buttons at the corresponding existing physical stage, opening one complete scrollable scene with **Return to physical instructions**. This preserves mandatory ship/defence reports and avoids another compulsory reading step. First-target invasion reading includes the announcement; later targets show only their current appraisal. The action review offers all selected invasion scenes, including Indian targets without a player defence prompt and France with no invasion. Tensions appear directly on the existing count-reveal page. Normal/quiet modes add no fictional pages; physical numbers and instructions retain their wording.

Phase scenes save under the existing phase-start history record through the existing presentation-only persistence callback; no extra incident, Undo frame or RNG step. Invasion selections save in protected `progress.ui.stagedScenes`, then transfer atomically to the actual committed parent incident. Keys, catalogue wording, target order, saved raw results and historical political evidence are validated. Exact words survive reload, import/export, snapshots and Undo/Redo. Chronicle and readable export retain all selected stage scenes, with the existing concealed-count mask before the weather boundary.

These records mean **selected presentation**, not proof that the player read the optional page, not public speech by a persistent character, and not committed planning advice. They do not create statements, memories or callback knowledge. Older current-schema saves without these optional records remain valid; no migration/backfill. Previously completed stages of an old pending attack do not acquire a retrospective announcement. Current unreported force can receive its appraisal.

`invasion-targets.js` extracts the existing `foreignTargets` expression unchanged so actions and evidence validation share it without an initialization cycle. No rule, physical outcome, probability or existing event dialogue changed.

## Verification

**391 tests pass, 0 fail** (367 baseline + 24 focused). Coverage includes exact/reachable 81 entries, all six weather faces and four counts, all raw strengths, actual source/target/court/Governor guards, no hidden information, no RNG consumption, repetition across actual turns, tampering rejection, current-schema persistence and committed narrative/mechanical parity.

New browser runner: `scripts/check-09e-browser.cjs`, isolated local server `http://127.0.0.1:4174/dist/`. Chrome **156.0.8078.47**, **1440×900** and **1024×768**, regular and Debug, Narrative and Normal. All six faces, calm/ship boundary, exact scene text, count masking, sequential Foreign/France strengths, N-01, protected reload/export/import/snapshots, committed Undo/Redo and cast identity pass with no page errors. Screenshots inspected for readable unclipped scene content and controls. Existing resolution, M2, outlook, advice, counsel, Operations and trade checks pass; M2 also covers **1440×1000** and **390×844**. One combined-run counsel selector timed out; its complete independent desktop/tablet rerun passed. No application change was made to hide that timeout.

## Limits and review

No dialogue wording changed or globally withheld. Governor/court guards can reduce the local pool. Optional reading is not mandatory automatic playback. Cooldowns are editorial selection preferences, not guarantees against every repeated motif. Persistent invader identities, 09D-3 callbacks, Peace/dynastic/Leader/Shuffle extensions, new phase workflows, portraits and old-save migrations remain outside scope. Existing completed-action modal position remains transient; exact scenes stay archived.

See [small demonstration](collection09e-demo.md), [machine-readable verification](collection09e-verification.json) and [saved selected scenes/evidence](review/collection09e/selected-scenes.json). The source scenes are creatively approved; **integrated selection and pacing still require user/ChatGPT review**. No hosted Site deployment.

Implementation commit: `ba08a97735e47903eba6796d3844d9c0b157f066`. Documentation is delivered in the following commit.

## UX correction — automatic scenes in Narrative mode (26 October 2026)

**User rejected the optional “Read scene” interaction.** The 09E integration is technically valid but its weather and invasion presentation is **not approved UX**. Narrative mode exists for automatic storytelling, not for optional supplementary reading. Adjust presentation only, preserving all 81 verbatim scenes, selector evidence, saved wording, protected state and gameplay mechanics.

- **Narrative mode:** automatically open the saved complete scrollable scene when its stage becomes available. Weather scene first, then physical storm/ship instructions; after their actual completion, the event-count/tensions scene appears automatically. On invasions, show actual region-threat announcement at its legal point and each target's force appraisal only after that target's saved raw strength is known, before the applicable physical defence decision. For scenarios with no player defence input, make sure an eligible scene is still presented without a gratuitous click.
- **Normal/quiet:** retain their existing functional / suppressed-fiction behaviour; no animation or rule change.
- **Navigation:** preserve a clear route between the automatically displayed scene and exact physical instructions, with **no extra read/acknowledgement button or redundant story-only confirmation**. The existing necessary physical completion/report input remains mandatory. Do not force story replay on reentry, reload, Back/Undo/Redo or returning from physical instructions: remember the local stage viewing state independently from the underlying selected scene, without altering the gameplay outcome or adding gameplay Undo frames.
- **Pacing:** preserve one complete multi-speaker scene, not line-by-line popups. At the initial multi-target invasion beat, the announcement should not disappear behind the first target's strength reaction. Avoid two successive, unnecessary modal steps if existing one-page scene can combine the immediate announcement and current appraisal.
- **Acceptance:** browser-test Narrative mode's automatic weather → ship instructions → tension reveal, calm-weather path, single/multi-target Foreign/France, no-target France, and saved-stage resume. Confirm Normal unchanged and no new click obligation. The correction is a focused UX task, not a rewrite of the already approved prose or authorization for character system work.
