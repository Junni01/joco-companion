# Collection 08A — trade dialogue and repetition

Implemented 24 October 2026 under explicit user authorization. **08B thematic chronicle improvements are not implemented.** Creative/narrative-quality acceptance remains with the user and ChatGPT.

## Delivered

Integrated **20 exact approved entries** covering disruption, Special Envoy restoration, military restoration, personal repetition, actual cascades and political attitudes toward commerce. Previously approved Collections 01–07 wording and previously saved dialogue are unchanged. Neutral fictional summaries now describe commercial opportunities/access rather than opened/closed order spaces. Component terminology remains in physical instructions, controls, action reports and source/rules explanations.

The selector distinguishes an actual order closure, successful Special Envoy opening and successful Company intervention with a genuine closed→open change. Conquest and clearing unrest alone do not qualify as military commercial restoration. Available opportunity never becomes proof of completed trade, a treaty, payment or prosperity.

The only resolver edit records existing cascade execution (`trade-cascade`) and the originating cascade on its actual connected closures (`cascadeFrom`). It does not add a cascade rule or change its effects. Pre-change instruction/report baselines and board outcomes match exactly for disruption, cascade, Special Envoy and military restoration.

## Personal experience and persistence

`narrative-trade.js` derives experience from the actual character's owned memories and surviving history. Counts are deduplicated by committed incident; institutional secretaries can learn across related regions, but another character's private experience is excluded. Existing owned intervention memories count only when their canonical source proves commercial reopening. This is a read-only current-version query, not save migration or historical backfill.

Restoration utterances have lifetime per-person limits alongside existing contextual/template cooldowns. A first hopeful line can be saved once; later caution needs the same person's earlier saved hope, and exasperated/resigned lines require repeated real experience and matching temperament. When no fresh eligible line remains, the secretary stays quiet. Commercial hopes are excluded from the older generic unrest-quotation loop, so a new approved line does not become another repeated refrain.

In the cautious review campaign, ten restorations produce four distinct saved secretary reactions (hopeful, cautious, exasperated and resigned), each once. The procedural persona does not invent a hopeful past. Confidence, mood and memory assessments evolve through actual disruptions/restorations; no automatic core-trait changes or new permanent relationship attributes are added. A ruler can remain hostile under continued taxation while benefiting from commercial access. Cooperation requires actual earlier beneficial experience and existing derived political posture.

New commercial memories use the existing M2 memory structure. Selected lines retain exact words, speaker, expression, current facts, earlier selection evidence and callback memories. `tradeRegion`/`tradeKind` identify scope; `experienceLineIds` link relevant earlier words by that same speaker. The first commercial hope records **no invented audience**. Dossiers/export show earlier words and sources on demand. Import validation checks method, exact text, source chronology, ownership and audience. Undo/Redo restores the saved state, PRNG and pacing; rendering never reselects speech.

Current development version remains 2. No serializer, Undo/Redo mechanism, portraits, dynasty/career system or migration pipeline was added. Standard presentation remains chronicler plus up to two visible reactions, with additional saved perspectives optional.

## Verification and review

- **218 automated tests passed, 0 failed** (`npm test`; baseline 200). New tests cover verbatim source parity, first/repeated disruption, diplomatic versus military methods, genuine cascade provenance, ten-restoration repetition, personality differences, owned hopes, identity isolation, cross-region learning without double counting, hostile benefit, current-version reload/Undo/Redo/branching, malformed sources/words/audiences, render purity and multi-turn narrative-on/off equivalence. Existing all-four-scenario gameplay, protected progress, snapshots, debug isolation and large-save regressions pass.
- Exact pre-change instructions, action reports and board outcomes remain equal. A source comparison confirms the chapter composition function is unchanged, explicitly protecting the **08B deferral**.
- Isolated Chrome **156.0.8078.47**: normal Commander and Special Envoy controls preserve order terminology and select the correct distinct trade method; a real manual Turmoil causes a cascade; repeated restorations select different words; persisted Undo/Redo restores exact experience. Dossiers show earlier personal words at **1440×1000 desktop** and **1024×768 tablet** with no horizontal overflow or page errors. Screenshots inspected. The existing full browser suite also passes, including 390px mobile, regular/debug isolation and saved reveals/rolls.

[Review index](review/collection08a/README.md) provides five synthetic campaigns spanning four/five real turns, HTML chronicles, current-version JSON, [exact traces](review/collection08a/dialogue-traces.md), [restoration log](review/collection08a/restoration-log.md), coverage and browser reports. They demonstrate **19 of the 20 integrated IDs**; the remaining first-diplomatic-secretary alternative has focused automated coverage. Manual events and supplied physical outcomes are labelled. Existing chapters retain their previous format.

Regenerate with `node scripts/export-trade-review.mjs`. Optional browser checks: `scripts/check-trade-browser.cjs` and `scripts/check-m2-browser.cjs`, using external Playwright/Chrome paths; the application remains dependency-free. Technical checks do not constitute narrative-quality approval.

## Deferred entries and prerequisites

| Entry / system | Reason |
| --- | --- |
| TR08-MIL-CH-01 | The second sentence risks implying actual continuing armed protection of merchants. The current record proves an intervention restored opportunities, not a merchant-guard arrangement. Held conservatively without rewriting the approved line. |
| TR08-MIL-RUL-02 | Reopening order spaces does not establish accessibility of every trade route. A narrower verified connection/scope contract or separately approved wording is needed. |
| TR08-REL-RUL-02 | No recorded prosperity/material deprivation or equivalent grounded mixed economic interpretation. Order changes alone cannot supply those facts. |
| Collection 08B, section 7 | Entire thematic chapter-writing increment deferred by request; no chapter templates or example passages activated. |
| Adviser succession/appointments | No production career/appointment system exists. Fresh-identity memory isolation is tested structurally; no fictional appointment is generated or narrated. |
| Completed trade, revenue or treaties | No new records of filled orders, commercial payments or negotiated agreements. Available opportunities cannot establish them. |

No additional approval is needed for the implemented scope. Hosting deployment is not included.
