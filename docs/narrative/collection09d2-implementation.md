# Collection 09D-2 — implementation report

26 October 2026. Pulled current `main` (`16538d6`) before editing; baseline **339 tests passed**. Implementation: **`2732214`**, quiet-display guard: **`450a8a2`**. This report and the linked review material are in the subsequent documentation commit (`git log -1 -- docs/narrative/collection09d2-implementation.md` gives its hash).

## Delivered behavior

Both modes keep the same factual result and physical instruction page. Deploy and Special Envoy have explicit outcome titles derived from authoritative resolver input/facts; other actions retain their factual existing titles. The actual mechanics, mandatory reports, officer-loss handling, lawful post-success Envoy revision and original physical instruction strings are unchanged. The redundant old Deploy summary heading is omitted; its essential numbers remain in the physical instructions.

The existing **Confirm & apply** is still the only authoritative commit. Once it succeeds, Narrative mode shows the exact saved scene in a **separate single scrollable page**, not beneath instructions and not sentence by sentence. Normal mode and the existing quiet setting finish without an empty story page. Story controls navigate or dismiss; they never ask for another confirmation or acknowledgement. View physical instructions replays separate Elephant pages and returns to the same exact scene without invoking gameplay/narrative selection or saving instruction progress again.

A small pure presentation selector prefers the exact saved 09D-1 response to an older generic reaction from the same speaker. Authored chronicler remarks remain eligible; mechanically composed fallback summaries stay in the archive when character reactions are available. There is no fixed speaker quota, new fact-coverage metadata or requirement that fiction repeat the title. Complete selected speaker turns appear together, with stable identity hooks for future optional artwork. No portrait assets, new cast or character-generation system were added.

All original scene lines, including omitted secondary reactions, remain saved verbatim in the existing dossier/chronicle. The map's last full scene is now collapsed behind its archive summary. The action-recorded toast remains a short status, not a dialogue replay.

## India events and anticipation

The existing narrative engine still gives every actual event type a scene opportunity. Turmoil/cascades, unrest, commercial changes and other sub-effects stay within the parent scene rather than spawning individual story pages. Five focused workflow tests exercise routine Turmoil, Windfall, Peace, sovereign Leader and Shuffle; existing suites retain Crisis/foreign attacks and their protected multi-stage reports.

Physical Elephant movements remain separate at their actual resolver positions, including movements before a later defence prompt. After the committed parent event scene, the **actual exposed-stack-region recap** remains its own page. It can then continue to a separate anticipation page showing exact already-saved 09B **private outlooks**, labelled as such, for the Elephant's from/to regions and visible stack region. These can differ. No private thought becomes public speech, an adviser memory, evidence another NPC heard it, or a forecast certifying the next event.

An additive `history[].narrative.anticipation` stores the private presentation snapshot (version, visibility, actual Elephant position, visible region, stable speaker IDs, exact template/text and attribution) in the **same transaction** as the real event. Validation checks identity, approved wording and event/position linkage. Reads use saved words; they do not generate new prose, consume RNG or inspect concealed fronts/order. The snapshot remains in the full chronological record and readable export after later outlook changes. No old event is backfilled. Existing current-schema saves without this optional field remain valid.

The India Phase recap lists committed parent events/affected regions and does not replay conversations. The top-stack back remains continuously visible in the existing workspace.

## Verification

- **350 tests passed, zero failures** (`npm test`; 339 baseline + 11 focused additions). Covers real dialog lifecycles, all Deploy outcomes, mode parity, exact selected words, read-only Back/revisit, five routine event types, protected progress, hidden-order equivalence, exact persistence, private-snapshot rejection, quiet/old saves, escaping, stable identity hooks and primary-versus-archived selection. Existing scenario, 09A/09B/09C/09D-1, narrative-off mechanics, RNG, protected dice, save/import/export and Undo/Redo regressions pass. The 08A baseline assertion excludes only new private presentation metadata while still comparing every existing scene field/word and the exact RNG.
- Dedicated `scripts/check-resolution-browser.cjs`, Chrome **156.0.8078.47**, **1440×900** and **1024×768**: regular/debug and Normal/Narrative Deploy success/failure/catastrophe; exact physical-page equality between modes; all selected words present together; instructions revisited without saved-byte changes; Envoy success with changed effect/failure; supported Governor Tax/failure; consecutive real Peace/Windfall draws; separate Elephant/stack/private anticipation; protected reload/resume; Undo/Redo; JSON export/import and collapsed archive. Also tests a real debug event and Normal event parity. No page errors or horizontal page/dialog overflow. Screenshots visually inspected.
- Existing advice, counsel, Operations, M2, outlook/actual-Shuffle and trade browser suites pass. Their helper dismisses **only the new read-only story/anticipation pages** so prior mechanical checks retain their scope; the dedicated suite explicitly inspects them. Additional existing-suite viewports: **1440×1000**, **390×844**. Existing snapshots and pre-09D current-schema campaigns remain covered. No hosted Site or personal campaign was touched.
- [Verification record](collection09d2-verification.json). [Small actual-browser comparison and consecutive-event demonstration](collection09d2-demo.md). Reproduce with the dedicated browser script and an isolated local HTTP server; its physical outcomes/personality setups are explicitly synthetic test inputs.

## Writing gaps and limits

| Category | Current delivery / unavailable material |
| --- | --- |
| Windfall, routine Shuffle, sovereign Leader | Existing factual chronicler fallback when no eligible authored character line exists. No new jokes, incidental Writer scenes or generic production filler were invented. |
| Turmoil, Peace, unrest, rebellion, conquest and military outcomes | Existing exact eligible approved dialogue, with its current evidence/cooldown guards. No expanded battle collection. |
| Public anticipation | No approved dedicated public anticipation collection. Reused private 09B thoughts remain explicitly private; no invented conversation or claim about the hidden next front. |
| Intermediate Elephant moves before an event is fully resolved | Every physical movement/prompt is retained. No speculative forecast is inserted mid-attack; the saved anticipation follows the committed event/public-stack recap. |
| Governor Regiment/Ship or alternative successful effects | Remain untracked and withheld as in accepted 09D-1; no outcomes invented. |
| Modal reload after a completed action | Exact text/history survives. As before, transient modal page/scroll position is not serialized; reload returns to the workspace/archive. Protected **unfinished mechanical** events/rolls/cursors still resume normally. |
| No eligible outlook or quiet mode | No empty anticipation page or forced filler. |

No rules/probabilities, gameplay RNG, hidden-info projection, actual China trade tracking, Revenue reporting, financial simulation, top-level phase workflow, Parliament scene, 09D-3 rivalry/callback, old-save migration or portrait system was introduced.

## Future engineering assessment

The separate [phase/Revenue/shareholder/failure/Parliament assessment](collection09d2-phase-assessment.md) identifies actual modules, existing tracked facts, minimal proposed contracts, insertion points, immediate Revenue failure versus India-phase/vote timing, missing Standing data and a reviewable development sequence. **Assessment only:** none of that future workflow is implemented here.

Exact existing approved prose is preserved. Final narrative quality, selected-scene composition and pacing remain for user/ChatGPT review; passing these tests is not creative acceptance.
