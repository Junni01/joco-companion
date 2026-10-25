# Collection 09B final evidence polish

Implemented 25 October 2026, adopting the exact [withheld-entry review](collection09-polish-withheld-review.md). All 60 approved texts and IDs remain verbatim. **56 entries are selectable: 55 without an extra road predicate, plus one conditional mercantile entry. Four remain withheld.** Acceptance of the integrated experience remains with the user and ChatGPT.

## Decisions applied

Enabled unchanged, retaining their political/personal families and voice preferences:

- `09B-strong-defender-dismissive`
- `09B-company-threat-resentful`
- `09B-occupation-wounded`
- `09B-subject-restless`
- `09B-capital-outraged`
- `09B-conquest-grievance-ceremonial`
- `09B-conquest-grievance-scornful`

These are private characterization or subjective political rhetoric. They create no court-order incident, named Governor, deployment/garrison, promise, protection outcome, receipt of revenue or other NPC's knowledge. Existing concern priorities, existing voice weights, mood/memory inputs, aptitude and deterministic error gate are retained; newly available voices receive matching preferences.

`09B-company-border-mercantile` is conditional on an actual printed cross-border route between the sovereign ruler's frontier region and its adjacent Company-controlled neighbour. Both **specific** order endpoints must be open and belong to the correct regions. A different open opportunity, a same-region connection, non-adjacent territory or an Indian-controlled neighbour cannot substitute. The narrow helper reads existing public region/order data and the printed `TRADE_ROUTES`/adjacency catalogue; it has no deck access. `publicKnowledge`, `forecastRegion`, public Shuffle-batch updates and event-stack code are unchanged and protected by existing source-fingerprint/information-leak tests.

The selected assessment saves exact endpoint proof. Committed observations are checked against the canonical board at their stable source incident; initial/debug setup observations use an explicitly saved public setup snapshot, separate from campaign history. This avoids relying on shifting history indexes. Closing a relevant Company endpoint triggers reconsideration even when the ruler-side aggregate totals in the unchanged 09A context remain identical.

New assessments use internal outlook version 3 / `09b-evidence-1`. Version-1 words and version-2 `09b-polish-1` choices remain valid, unchanged on reads and harmless commits; the earlier policy excludes these newly enabled entries during historical validation. No migration, retrospective rewrite or read-time selection was added. Current save/load, snapshots and Undo/Redo preserve exact words and proof. Concern ranking and the original variant-selection rules are not redesigned.

## Remaining limits

The model still lacks the required consequential evidence for:

| Withheld ID | Missing evidence |
| --- | --- |
| `09B-qualified-gratitude-conflicted` | Repeated preservation/rescue of this ruler personally. |
| `09B-qualified-gratitude-pragmatic` | Actual shared action/cooperation, rather than unilateral interventions. |
| `09B-commerce-anxious` | Prior completed commerce and its actual absence, not closed opportunities. |
| `09B-commerce-dismissive` | Actual absence of trade; ordinary adviser colour alone cannot establish it. |

The rhetorical interpretation decision does not relax these requirements. No wording was rewritten and no significant fact was manufactured.

## Verification and concise example

**275 automated tests passed, 0 failed** (`npm test`; previous baseline 270). Five new regressions cover the seven approvals under real political families, the four remaining exclusions, exact route/endpoint eligibility, actual route closure and historical proof, persisted Undo/Redo, forged proof rejection and preservation of version-2 selections. The existing exact 60-entry wording, hidden-information, current persistence, narrative-on/off gameplay/report equivalence, snapshot, source-code parity and version-1 tests still pass.

Chrome **156.0.8078.47**: dedicated **1440×1000 desktop / 1024×768 tablet** road-thought rendering, profile-read stability, actual manual Turmoil closure and persisted reload/Undo/Redo pass without overflow or page errors. Screenshots inspected. Existing actual Shuffle/Elephant/reveal/cancel/regular-debug and M2 regressions pass, including their 390px mobile check. Summary: `collection09-evidence-verification.json`.

The small synthetic road fixture uses actual resolvers: successful Special Envoy opens Delhi `d3`; conquest opens Company Bombay `bo3n`; their printed connection supports the exact mercantile thought. An explicitly **manual test Turmoil** then closes `bo3n`. Other Bombay orders stay open and the Delhi-side forecast totals stay unchanged, but the road thought becomes ineligible. Undo restores its exact words and proof; persisted Redo restores the closed state. No completed trade or military movement is inferred.

Reproduce with `npm test` and `node scripts/check-outlook-evidence-browser.cjs BASE OUTPUT` using external Playwright/Chrome paths. No bulk review package, dialogue rewrite, new gameplay tracking, 09C/09D, Collection 10 or hosted Site deployment is included.
