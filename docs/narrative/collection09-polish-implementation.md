# Collection 09B approved writing polish — implementation review

Implemented 25 October 2026 after pulling current `main`. The [60-entry authored catalogue](writing/collection09-outlook-polish.md) is creatively approved; **acceptance of its integrated selection and pacing remains with the user and ChatGPT**.

## Delivery

All **60 stable IDs and complete passages** are copied verbatim into the existing content module. **48 are selectable; 12 are explicitly blocked** pending adequate evidence. No passage was rewritten, paraphrased, spliced or invented to make it eligible. The original 22 strings remain intact for existing saved thoughts and the existing neutral watch/attention fallback. Blocked entries cannot be newly selected or imported as an eligible new thought.

09A's public projection, regional assessment, public batch-update function and event-stack module are unchanged; source-fingerprint regressions enforce this alongside the existing hidden-information tests. There is no new public/hidden data channel. No gameplay resolver, physical instructions, portraits, naming/background generation, counsel, speech relocation, post-action callbacks or hosted Site deployment was added.

## Selection and persistence

Selection now ranks **concern before voice**: immediate Company primary/secondary exposure, actual local unrest, threatened frontiers and sourced grievances/qualified gratitude precede general military atmosphere. Subject/capital concerns remain distinct. All eligible authored expressions of the winning concern then compete using ambition, caution, pride, confidence, ruthlessness, loyalty, vindictiveness, independent aptitude, current mood and a recent directly owned memory category. Existing memory and relationship machinery supplies personal sources; the selector changes no core trait or relationship score.

A deterministic gate based on character identity, concern and **public** circumstances permits occasional confident denial/complacency. It consumes no RNG and cannot reroll on reads. Low aptitude does not force error whenever danger exists: the gate is sometimes closed and personality can favor a sensible response. High aptitude does not immunize an arrogant or aggressively ambitious character against poor judgment. These are voice preferences inside factual guards, never permission to fabricate a past action or unknown Company Army strength.

New thoughts save internal outlook version **2**, policy `09b-polish-1`, exact text/ID, public context, original identity, selected traits/confidence/mood/aptitude and owned evidence including the recent memory ID/category. Already-saved version-1 words retain their original validation policy and exact text. That frozen function is used only to validate existing words, not as a second runtime generator. No save conversion or rewriting occurs. If public and relevant personal context are unchanged, a routine commit retains the saved thought object even when it came from the earlier catalogue. A meaningful new transition can naturally select a new approved thought; Undo/Redo restores the original version/text/evidence exactly. The outer current save schema and transaction machinery are unchanged.

Private thoughts remain outside public statements, promises, dialogue and NPC knowledge. Repeated region selection, dossiers, export, reload and cancelling Deploy do not select new text. Same words can also legitimately survive a real event while their public evidence advances.

## Blocked entries and factual reasons

These are implementation evidence limits, not proposed creative rewrites:

| ID | Missing safe prerequisite |
| --- | --- |
| `09B-strong-defender-dismissive` | A court request for preparations and the ruler's actual grant of permission are not recorded. |
| `09B-company-border-mercantile` | Regional opportunity totals in the unchanged 09A projection do not prove a particular open cross-border road. |
| `09B-company-threat-resentful` | Saved assurances do not encode increasing firmness correlated with worsening Company circumstances. |
| `09B-occupation-wounded` | Company control does not establish a present garrison or a particular occupied Governor office. |
| `09B-subject-restless` | Subordination does not establish repeated personal ceremonial bowing. |
| `09B-capital-outraged` | Allegiance/potential rebellion alone establish neither earlier protection nor a recorded challenge to authority. |
| `09B-conquest-grievance-ceremonial` | No evidence of repeated personal reception of Company officials with courtesy. |
| `09B-conquest-grievance-scornful` | A Tax demand is not receipt of revenues; payments remain untracked. |
| `09B-qualified-gratitude-conflicted` | Regional interventions and gratitude do not establish repeated preservation of this ruler's personal position. |
| `09B-qualified-gratitude-pragmatic` | Beneficial Company actions do not establish joint action by the ruler. |
| `09B-commerce-anxious` | Disrupted opportunities do not establish prior completed commerce or subsequent actual absence of trade. |
| `09B-commerce-dismissive` | Neither an actual adviser discussion nor actual trade absence is recorded. |

General private judgments, conditional maxims and speculative attributions in eligible entries remain subjective; they do not create canonical court conversations or off-screen events. Specific first-person acts, receipts and other factual implications above are withheld. All fifteen authored families retain at least two selectable variants; extra architecture or new tracking was not added to enable a blocked line.

## Verification and small review handoff

**270 automated tests passed, 0 failed** (`npm test`; baseline 261). Nine focused regressions cover exact parity for all 60 IDs/texts, blocked/factual family eligibility, unchanged 09A/stack code, local/personal priorities, proud/cautious variants, occasional sensible low-aptitude judgment and arrogant high-aptitude error, mood/recent experience, earlier version-1 preservation, and exact version-2 persistence/validation. Existing hidden-face/order invariance, actual Shuffle consumption, narrative-on/off gameplay/report equivalence, current persistence, snapshots and protected Undo/Redo tests remain green.

Chrome **156.0.8078.47** passes dedicated desktop **1440×1000** and tablet **1024×768** checks: three actual saved personality variants from one known Shuffle; proud/cautious frontier wording; grievance prominence; version-1 import/read/reload; exact version-2 persisted Undo/Redo. Screenshots inspected; no horizontal overflow or page errors. Existing actual Shuffle/Elephant/recap/reveal/cancel/regular-debug checks and M2 browser regressions also pass, including the existing 390px mobile check. Summary: `collection09-polish-verification.json`.

[Small demonstration](collection09-polish-demo.md) shows the requested five cases using actual resolvers with explicitly staged public discards and controlled fictional **initial** profiles. The two Bombay profiles are alternate initial fixtures, not an arbitrary personality change. The confident low-aptitude ruler's error is one contextual result, not an invariant assigned to that character. A real subsequent Crisis leaves the cautious ruler's exact words unchanged.

Reproduce with `node scripts/export-outlook-polish-demo.mjs`; browser runners are `scripts/check-outlook-polish-browser.cjs` and the unchanged `scripts/check-outlook-browser.cjs`, using external Playwright/Chrome paths. No bulk campaign package or application dependency was added. Review whether the voices and relative priorities feel right; passing these tests does not grant final creative acceptance of the integrated experience.
