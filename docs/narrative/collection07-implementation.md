# Collection 07 — implementation and review handoff

Implemented 24 October 2026 under the user's explicit authorization. Narrative-quality acceptance remains with the user and ChatGPT.

## Delivered

Integrated **19 exact Collection 07 entries**, retaining all previously approved Collections 01–04 text unchanged. Source-parity tests check every new line and expression. Four entries remain deferred below.

Tax, administration, military failure/loss and defence reactions now use the approved replacements when their facts and voices qualify. Retired legacy IDs remain in the source catalogue/history but are excluded from new selection: physical-table/report dialogue, data-narration variants and unconditional ruler relief after Company defence. Administrative/Tax data-recap callbacks are likewise retired. During cooldowns or missing prerequisites, other eligible approved lines, a neutral factual chronicler or silence remain valid. Existing exact saved-assurance callbacks are preserved. No new dialogue is generated on dossier opening or reload.

Standard presentation remains chronicler plus at most two visible reactions, with further saved perspectives expandable. No long conversations or New Turn personal scenes were added. New Turn retains the thematic chapter and omits the legacy development-status sentence from fictional narration. Age progression and physical instructions are unchanged.

## Political attitudes and evidence

`narrative-posture.js` derives **hostile / aligned / ambiguous** at the incident boundary using existing Company relationship causes and personally grounded memories. It adds no permanent alignment field or relationship dimension. Respect for an enemy, a core loyalty trait and scenario-starting Company control do not establish Company alignment.

Central trial thresholds in `POLISH_POLICY`: grievance importance 40; hostility 20; aligned gratitude/relationship loyalty at least 30, exceeding hostility/mistrust by 15, supported by at least two beneficial intervention/defence causes, with no active personal grievance. These are narrative selection defaults, not gameplay rules. Repeated real interventions can cool a grievance without deleting its source and eventually support an aligned reaction.

Company defence no longer gives every ruler automatic gratitude/relief. Hostile rulers remember it with resentment; ambiguous rulers with uncertainty. Already aligned rulers can retain relief/gratitude. Dialogue distinguishes genuine suppression, generic repelled invasion, unrest-clearing intervention and loss of sovereignty. “Again”/“another” requires an actual earlier personal defeat; pragmatic reassessment is excluded for an aligned ruler after Company suppression. Surprise after loss requires the same adviser's earlier selected overconfident conquest line, not just a proud trait assigned later.

Selected words reuse M2 line IDs, current facts, callback memories, RNG and cooldowns. An optional line-level `selectionEvidence` contains prior political/expectation facts, visible in dossier/export inspection and covered by deletion guards. Import validation reconstructs earlier relationships from cause deltas and earlier grievance importance from saved updates, so later reconciliation cannot rewrite an earlier hostile response. Personality weighting is not rerun on historical lines.

No gameplay resolver, action legality, board mechanics, save serializer, Undo/Redo implementation, dynasty system or portrait asset changed. Current development version remains 2. No old-save migration or backfill was added.

## Verification

- **200 automated tests passed, 0 failed** (`npm test`; baseline 184). New coverage includes exact wording, hostile/aligned/ambiguous/cautious selection, changing attitudes, invasion/intervention exclusions, prerequisite defeats/boasts, routine-versus-major administration, source rejection, multi-turn cooldowns, chapter/age progression, gameplay equivalence and persisted Undo/Redo.
- Existing all-four-scenario full-stack/end-game equivalence, protected rolls/reveals, snapshots, isolated debug and long-history save-pruning tests pass.
- Chrome **156.0.8078.47**, isolated synthetic campaigns: actual manual Leader controls suppress a rebellion while retaining the ruler's hostile response; persisted Undo/Redo restores exact words/evidence. Imported five-turn reconciliation campaign exposes the changed attitude and source chain in dossiers at **1440×1000 desktop** and **1024×768 tablet**, with no horizontal overflow or page errors. Screenshots inspected. Existing full browser regressions also pass, including 390px mobile, regular/debug isolation, preview cancellation, snapshots, pending progress and unsupported-save preservation.

Optional browser commands: `node scripts/check-m2-browser.cjs BASE OUTPUT` and `node scripts/check-collection07-browser.cjs BASE OUTPUT`, with external `JOCO_PLAYWRIGHT` and `JOCO_BROWSER_EXECUTABLE` paths. No browser dependency was added to the application.

## Review package

[Review index](review/collection07/README.md): five seeded campaigns spanning **four or five real turns**, actual event-stack draws, Events in India, Parliament, New Turn and final scoring. Proud/cautious rulers retain grievances; a separate vindictive ruler can change through repeated beneficial experience. Both successful and failed Company rebellions, conquest/reconquest, Tax, recurring callbacks, cooldown clocks and thematic chapters are represented. Initial profiles and manually triggered events are explicitly declared. Physical defence/rout/die outcomes are supplied fixture inputs; no phase flags, prior history or political facts are injected.

The traces demonstrate **12 of the 19 integrated IDs**. Other eligible alternatives are covered by focused tests; these five campaigns are not exhaustive. Regenerate with `node scripts/export-collection07-review.mjs`. JSON fixtures round-trip through current-version validation. Review documents include browser evidence; all campaigns are synthetic, never personal exports.

## Deferred entries

| Entry | Reason |
| --- | --- |
| FB07-TAX-SEC-02 | No represented, evidence-backed procedural manipulation/cynicism contract. Ambition or a dry voice alone cannot invent it. |
| FB07-ADM-RUL-02 | No saved attributed assurance that governing would be simple, with this ruler's justified knowledge. Existing hopes of lasting improvement do not qualify. |
| FB07-MIL-RUL-02 | No actual return/withdrawal journey. Failed deployment alone proves neither. |
| FB07-REB-RUL-03 | No selected earlier ruler hope/ambition explicitly tied to this rebellion's success. Generic resentment/mood or an adviser's hope does not qualify. |

Previous collections' deferrals remain in [the earlier inventory](approved-dialogue-deferred.md). No further technical approval is needed for this delivered scope; creative review remains pending. No hosting deployment is included.
