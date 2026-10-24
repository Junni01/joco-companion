# Collection 08B fallback polish — implementation and review

Implemented under the user's authorization on **25 October 2026**. Authored source: [approved fallback voice and closing coda](writing/chapter-fallback-polish.md). Exact source wording is implemented; narrative-quality acceptance remains with the user and ChatGPT.

## Changes

The six corresponding fallback templates now use the complete approved passages: earlier conquest/later failed administration; same-turn commercial recovery; restoration of an earlier-turn interruption; restoration without a recorded interruption; reclosed recovery; and Company loss. The main CH08-01/02 and permitted CH08-01/04 omissions retain their exact wording. CH08-FACT-CONTROL is unchanged. No event dialogue, gameplay resolver, physical instruction, scene length, permanent relationship field or save migration was changed.

Selection still uses structured committed facts and actual boundary states. The earlier-turn fallbacks require a genuinely earlier **turn**, including in debug-staged histories. Display titles and report text provide no eligibility evidence. An available opportunity never establishes a sale or profit, and a lost region never establishes a character's fate or departure of troops.

CH08-FINAL-GRIEVANCE is eligible only at an actual committed End game boundary, with all of:

- A committed conquest of this region in an earlier turn and Company control at the ending.
- The original named ruler's own direct, local conquest memory pointing to that precise fact, plus the same ruler's actual saved words at the loss. Those existing engine records establish who held the seat; a successor's inherited or indirect knowledge cannot substitute.
- An owned conquest relationship cause toward the Company with positive hostility, an emotionally active conquest grievance, and the existing derived current hostile posture with positive net hostility.
- A living original character and no unclassified current reassessment of that conquest memory. Partial beneficial experience does not automatically erase a still-supported grievance, but a cooled grievance or unsupported reassessment cannot establish this ending.

The coda has priority within the existing two-thread/two-paragraph budget, occupies one paragraph, and excludes another thread about the same region. At most one coda is selected, even if several rulers qualify. Exact repetition suppression remains active; no eligible coda is required for a final page. Selection consumes no narrative or rules randomness.

Existing chapter transactions store exact text, stable identities, memories, relationship reasons, saved-line IDs and final-state references. Current-runtime save/load and persisted Undo/Redo reproduce these exact results. Older development chapter snapshots are not converted or silently rewritten; the original 08B review folder remains a historical artifact, with fresh current-runtime exports in the new folder.

## Verification

**247 tests passed, 0 failed** (`npm test`; previous baseline 238). Nine new tests cover all seven exact source passages; factual variants and ending reversals; original identity/current attitude/source rejection; correctly withheld codas; quiet endings; repeated grievance pacing; current-runtime save/load and persisted Undo/Redo; narrative-on/off mechanics, reports and instructions. Existing main-passage source parity and the full committed 08A ordinary-scene/narrative-RNG baseline still pass.

Chrome **156.0.8078.47**, isolated synthetic storage: desktop **1440×1000** and tablet **1024×768** pass actual New Turn and End game confirmation, inert preview, exact reload/Undo/Redo, fallback/coda rendering and optional evidence, quiet ending and script-free HTML chronicle checks. No page errors or horizontal overflow were found. Tablet coda and fallback screenshots were inspected. Existing regular/debug/protected-progress and 08A Commander/Envoy/cascade browser checks also pass, including the existing 390px mobile regression. Browser runners add no application dependency.

Reproduce with `node scripts/export-chapter-polish-review.mjs`, then `npm test` and `node scripts/check-chapter-polish-browser.cjs BASE OUTPUT` with external Playwright/Chrome environment paths. The [review folder](review/collection08b-polish/README.md) contains browser reports and a test summary.

## Review traces and writing audit

[Selected text beside its evidence](review/collection08b-polish/chapter-traces.md) contains six actual five-turn synthetic campaigns and an explicitly identified one-turn reversal checkpoint. [Rejections](review/collection08b-polish/rejected-passages.md) show the tempting alternatives withheld. Manual events, controlled physical commitments and reported outcomes are disclosed; no personal saves are included.

- **Possession and governance:** the new administration fallback follows the original conquest chapter, a failed rebellion leaves the grievance active, the fourth turn is quiet, and the final coda recalls the same ruler's unresolved loss. The ending is emitted once.
- **Commercial pressure:** repeated taxes and administration keep the grievance active despite beneficial interventions; the coda is still sourced, rather than inferred from conquest alone.
- **Useful partner:** repeated beneficial experiences cool the conquest memory to zero while the Company still holds the region. The final coda is correctly rejected and the final page remains quiet. A useful-partner utterance does not revive a grievance or establish protection/expected thanks.
- **Commercial fallbacks:** an initially closed opportunity is restored; a different opportunity's interruption is restored in a later turn; a later same-turn recovery receives its distinct passage. The fourth turn is quiet; final conquest followed by actual Company loss receives the exact loss passage, not an invented lasting grievance.
- **Ending possession lost:** the same multi-turn personal history no longer supports the coda once an actual successful rebellion removes Company control at the ending.
- **Diplomatic/restoration reversal:** exact Envoy facts and the same opportunity distinguish recovery from a later closure; “remained available” is withheld when false.

The new passages remove turn-number/Tax-label/report phrasing from fiction and retain commercial uncertainty. Exact paragraph repetition remains suppressed. The commercial variants intentionally share the image of an opening; whether adjacent variants still feel too similar is a question for human review, not permission to rewrite approved words. The final coda echoes the earlier failed-rebellion theme; the quiet fourth turn creates distance in the governance example, and the selector never stacks the two reflections about the same region at one boundary. Saved full names remain unchanged even where “of Bombay” repeats the region. Existing 08A useful-partner reactions can still repeat in the underlying journal; this polish does not edit them.

## Evidence limits and deferrals

All six requested fallback replacements and the final coda's exact prose are integrated. No missing fact was invented to enable them. The model has free-prose `currentAssessment` rather than a structured universal “grievance resolved” predicate. Its meaning is not guessed: if the conquest memory carries such a reassessment, the coda is conservatively withheld. Missing original-ruler words, indirect/successor memories, inactive grievances, unsupported current attitudes and non-living identities also withhold it rather than manufacturing identity or feelings. No new personal system was added to relax these limits.

Full CH08-03 and CH08-04's earlier-hope sentence remain deferred as before. Their missing personal evidence is unaffected by this polish. These tests and traces establish technical behavior and support factual review; they do not confer narrative-quality approval or constitute a complete physical-table playtest. The delivery includes a user-authorized GitHub push, not a hosting deployment.
