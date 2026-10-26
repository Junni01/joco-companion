# Narrative mode — hidden dice, staged storms and foreign invasions

**Status:** User-directed design, 26 October 2026. Reviewable technical/creative specification; **not yet authorization to modify code or add production dialogue**. Current baseline: accepted 09D-2 technical delivery (350 Codex-reported passing tests). Applies to Narrative mode only; Normal mode retains existing dice animation and physical-manual storm option.

## Editorial principle

The game uses dice as chance mechanisms. In the fictional world, characters perceive weather, the movement of military forces, alarms and battlefield strength—not six-sided dice or roll animations. In Narrative mode **generate and preserve identical random outcomes in the code**, but show their historical-world significance rather than animations or literal dice. Exact rules-required numeric results may still appear in clearly marked physical instructions, never in fictional spoken lines.

## I. India Phase start: one storm roll, two distinct reveal stages

Today `dist/phase-dialog.js` rolls a face and shows `label · event count` simultaneously (and animates the die for app rolls); `dist/india-phase.js` maps the six faces to sea(s) and counts: East=2, West=2, South=3, All=1, No storms=4 on each of two identical no-storm faces. `phase-start` already commits a single face and `phase-ships` transitions to the event stage.

**Narrative-mode approved intended flow:**

1. At Start Events in India, obtain **one valid face**, using the existing random generator. Do not animate, draw, show or reference the die to the player. Persist the actual face once using the existing protected/atomic state.
2. **Storm stage — first reveal:** Show which sea(s) are affected (or that the seas are calm), all exact physical storm/ship rules and a dedicated narrative scene reflecting ocean conditions. A suitable existing acknowledgement that all ship outcomes have been resolved remains necessary. **Do not disclose the total number of India events anywhere in the regular narrative UI until storm effects are finished**, including headings, counters, disabled buttons, badges, toasts, archive previews or anticipatory dialogue. This is **presentation concealment** of the known face-derived count, not a game-rules secrecy claim or new random event.
3. **Event-count stage — second reveal:** Only after the actual saved storm-completion transition, show the number of forthcoming India events, with a distinct anticipatory chronicler/character scene in world-language. Counts 1–4 can influence tone; no invented probability manipulation or guaranteed event identities. This separate narrative reveal uses **the same saved face**, not a second roll.
4. Then proceed to the existing protected digital event stack/resolvers. If the phase is re-opened, resumed or Undo/Redo restores an earlier stage, show information appropriate to that saved stage without rerolling or prematurely leaking later information. For no storms, preserve the natural transition and the separate later event-count reveal (do not introduce an artificial ship-resolution task).
5. Physical storm rolls **for ships** remain player-managed as before; the app does not acquire ship inventories or fabricate ship casualties. Show exact required numeric die procedures only in the physical instructions, with no graphical dice animation in Narrative mode.

**Normal mode:** Keep current animated app storm-die path and existing **roll physical storm die, select result** path. Preserve their correct one-roll face/count distribution, identical actual storm/ship effects and phase flow. No need to split the animation/count presentation in Normal mode. Do not remove or hide manual storm entry there.

**UI design:** Keep physical instructions and story on the agreed separate scrollable dialog page(s) if practical, while preserving stage ordering; no line-by-line reveal, mandatory reading checkbox, duplicate acknowledgements or new unrelated player input. Use the existing 'storm effects resolved' commitment as the stage boundary. At the count reveal, the player may continue to the actual stack and optional map without an invented mechanical decision.

## II. Foreign Invasion and War Against France — announce theatre first, strength per target

Current `dist/action-dialogs.js` uses `rollStormFace()` for Foreign Invasion and failed War Against France, animates that storm result, and then shows an animated standard die (1–6) for each invasion strength. Each per-region result is already saved in protected `d.rolls` and a saved storm face exists in the action draft.

**Narrative-mode approved intended flow:**

1. The app rolls **the same hidden storm die once** for the specific Foreign Invasion or applicable War Against France result and saves it using existing action progress. No die image/animation or 'Rolling the storm die' dialog.
2. Announce **which regions are actually threatened**, respecting the exact invasion targeting rules (including the appropriate no-storm/exposed-stack fallback and Elephant redirect rules as implemented); show a short in-world announcement of a foreign expedition, landings or reports of invading forces. **Do not invent which foreign country, commander or faction invaded** when the game doesn't establish it. Distinguish the results of a failed War Against France using its actual rule-based context—avoid asserting additional undocumented engagements.
3. For **each individual target region**, have the app generate and save the required 1–6 invasion strength at its original legal resolution boundary. Do not show a die or die animation, or require a new 'roll' acknowledgement just to advance the code. Before the associated defence/conquest report, show the actual **numeric strength in the physical instructions** so players can resolve the attack. Show an accompanying in-world qualitative description of the invading force's scale, using guarded relative/absolute strength language consistent with the actual game result and target situation (e.g., formidable host vs small expedition). **Avoid saying 'a six was rolled'** or asserting an exact troop count from an abstract strength value. The description must not claim the full invasion strength before the result actually exists.
4. Treat each invasion sequentially and preserve prior results. No rerolls on Back, reload, revisiting instructions or repeated renders; correct protected pending action and physical officer/defence resolution remain authoritative.
5. A no-storm/no-target outcome should follow the actual specified fallback, not incorrectly claim peace or skip a target. A multi-region invasion retains its distinct targets and strength checks. Player still reports physical defence results when the app needs them; this change removes **graphical rolling steps**, not mechanically essential information.

**Normal mode:** Retain current animated invasion storm/strength dice behavior; **invasion dice remain automatic only** (no new manual-entry feature). Existing manual physical storm-die mode refers to the initial India Phase storm, not necessarily each invasion roll. Preserve tests and UI paths.

## Writing and fiction constraints

- Every narrative speaker inhabits a historical fictional world; no 'dice', 'Elephant' token, 'event count' as a game concept, 'stack', 'tower levels', mechanical values or future unseen event face in speech. User-visible factual titles and physical instructions may use accurate game terms for clarity.
- The weather and event-count pages are distinct **dramatic beats**; storm damage, sunk ships, named losses and specific trade damages may only be claimed if reported, which they are not in the current model. Describe severe weather, delays, apprehension, rumours—not invented verified sinkings.
- The scale of an invading force can be inferred from the actual saved numerical roll as **impressionistic fiction**, not as a certified troop headcount. If a number is needed to resolve a defense, display it separately as a rule instruction.
- Reuse approved prose if genuinely applicable. Newly authored atmospheric storm, rising-tension, foreign-invasion theatre and force-scale lines need user creative review before production. No generic mechanical fallback presented as literary narration merely to fill an empty scene.
- No hidden event-front leakage; an announcement may mention only actual invasion targets established from the committed result, not an unrevealed future event.

## Technical acceptance scenarios / reviewer checklist

- Each storm face is still equally likely, including two no-storm faces; mapping to event counts unchanged.
- Narrative start: sea(s) shown with storm instructions; no face illustration, dice animation **or event count** before ship-resolution completion; later count reveal reuses same saved face.
- Normal app-roll storm path still animated; physical storm result choice still available and functional.
- Foreign invasion and failed War Against France: no graphical storm or strength dice; real target(s) first, saved individual numerical strength before any physical defence; descriptive scale scene consistent with each strength.
- Multi-region, no-storm fallback, failed defense and protected resumable progress covered.
- Undo/Redo/reload and import/export reuse saved rolls; no RNG consumption for narrative previews, no repeated or missing mandatory effects.
- Narrative-off/normal mechanical parity, event-stack secrecy, dialog/back navigation and story archives intact.
- No new player-confirmation steps except those intrinsically needed to resolve storm shipping or report physical outcomes; avoid dismissible extra rolling screens.
- Browser verification on desktop/tablet and when app is in Debug mode with Narrative on/off.

## Current implementation entry points (reviewed 26 October 2026)

- `dist/phase-dialog.js`: storm-choice, initial storm animation, storm ship-resolution and event count share the same display; needs mode-aware split.
- `dist/india-phase.js`: `STORM_FACES`, `rollStormFace`, `shipInstructions`.
- `dist/dice-animation.js`: reusable graphical dice animations **stay for Normal mode**.
- `dist/action-dialogs.js`: Foreign/France hidden face rolls and per-target `invasion-roll` animation; preserve stored `d.stormFace`, `d.storm`, `d.rolls`, protected instruction cursor.
- `docs/narrative/component-to-fiction-glossary.md`: translation from mechanical components to fictional-world meaning.

**Implementation status:** Proposed design, not implemented. Integrate with approved 09D-2 mode-aware single scrollable story pages after creative lines are reviewed. Avoid scope creep into phase workflow, financial reporting, new portraits or 09D-3 relationships.
