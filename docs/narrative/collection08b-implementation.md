# Collection 08B — thematic chapters: implementation and review handoff

Implemented locally on **25 October 2026**, under the user's explicit 08B authorization. This is a technical delivery and writing audit, **not narrative-quality acceptance**.

## Implemented scope

The former list of action titles is replaced with a saved, bounded thematic account. Ordinary chapters select at most **two threads and two paragraphs**; a full two-paragraph passage occupies that budget. Quiet/repetitive turns can have no substantial prose, while the complete chronological journal remains intact. Final-turn chapters use the same conservative budget in this first increment and do not advance an unplayed year.

Selection is deterministic and consumes **no RNG**. Priority favors an unresolved personal defeat, supported commercial reassessment, then supported governance; narrower territory/commercial facts are fallbacks. Exact repeated passages/thread keys are suppressed. Identical headings in two short regional threads are deduplicated. There is no compulsory personal conversation or extra New Turn interruption.

### Authored references and permitted omissions

| Passage | Implemented conditions / limitation |
| --- | --- |
| CH08-01, A Kingdom and Its Accounts | Current-turn military conquest → later Tax → later genuine unsuccessful administration; continuous Company control to closing. The named person must own the conquest memory, have a saved identity at the loss, retain a grievance and an adverse administration reason, and still have a sourced unfavorable political posture at closing. |
| CH08-01-FACTUAL | Uses the specification's expressly allowed omission of the unsupported personal sentence. Remaining approved wording is unchanged. |
| CH08-02, The Opening and Closing | The **same specific opportunity** undergoes two ordered disruption/restoration cycles this turn; the same secretary owns the restoration experience and actually saved hopeful then cautious announcements. The later restoration is the last relevant transition and the opportunity is available at the close. |
| CH08-04-FACTUAL, What Remained | Actual failed anti-Company rebellion, continuing Company authority and an owned surviving conquest grievance. The unsupported earlier-hope sentence is omitted exactly as permitted by the specification. A generic repelled invasion cannot qualify. |

Full CH08-01/02 are deliberately restricted to a complete current-turn episode, because their reference prose does not explicitly date older context. Earlier-turn context is instead dated in narrower complete factual templates. Fallbacks cover continued administration, restored/reclosed commercial opportunities and actual changes of Company control. They are neutral implementation wording supplied for review, not newly approved literary passages.

## Evidence, identity and transactions

New `narrative-chapters.js` reads structured incident facts, inputs and order-state transitions, character-owned memories, saved exact lines, relationship causes and the actual ending map. It never parses reports, action titles or instruction prose. Current development is bounded by the previous committed chapter boundary as well as the turn label; earlier events cannot simply be replayed as this turn's developments.

Each chapter stores composition/version ID, closing incident, turn, mode, exact title/text, selected thread templates/version, stable region/person/opportunity parameters, clause-level fact references, memory IDs, relationship reason references, saved-line IDs and closing-state references. Names come from the relevant saved person's lines; a former incumbent is described as the person who lost the region, not automatically as its current ruler.

Validation reconstructs the map and relevant personal memory state **at the saved boundary**, checks eligibility, event order, identities, endings and stored wording, then compares without replacing anything. Later territorial loss or reconciliation does not rewrite an earlier chapter. Rendering and export show stored prose with optional source inspection. Chapter sources/boundaries participate in existing deletion guards.

Chapter creation remains inside the existing New Turn/end-game narrative transaction. Current-version save/load and Undo/Redo preserve exact results; a different branch drops the abandoned boundary. The serializer and Undo/Redo implementation are unchanged. No old-save conversion, portraits, dynasty/career system, new permanent relationship attributes or runtime AI prose were added.

## Verification

- **238 tests passed, 0 failed** (`npm test`; baseline 218). New coverage includes approved-source parity and explicit omissions; evidence rejection; current judgment versus old grievance; event ordering and genuine reversals; same character/same opportunity; historical closing-state reconstruction; repetitions/quiet turns; two-thread/paragraph bounds; malformed parameters/versions/sources; safe rendering; current-version persistence and Undo/Redo; branch replacement; gameplay equivalence and age progression.
- A seeded full multi-turn comparison proves that **ordinary 08A event scenes and narrative RNG results remain exactly equal to the committed 08A review baseline**. Pre-change physical instruction/action-report/board baselines and all-four-scenario gameplay regressions still pass. The earlier test freezing the old chapter function was replaced under this explicit 08B authorization; physical baselines remain mandatory.
- Chrome **156.0.8078.47**, isolated synthetic campaigns: actual New Turn controls commit the chapter, preview stays uncommitted, saved words/evidence survive persisted Undo/Redo, and optional sources/quiet turns render correctly at **1440×1000 desktop** and **1024×768 tablet**, without horizontal overflow or page errors. HTML chronicle output is script-free. Screenshots inspected. Existing regular/debug/protected-progress and 08A Commander/Envoy/cascade browser suites also pass, including their 390px mobile regression.

Optional browser runner: `node scripts/check-chapter-browser.cjs BASE OUTPUT`, using external Playwright/Chrome paths. The application remains dependency-free.

## Review material and writing audit

[Review index](review/collection08b/README.md) contains **four actual five-turn synthetic campaigns**, plus an explicitly labelled one-turn reversal checkpoint, HTML chronicles, current-version JSON, [selected prose beside clause-level evidence](review/collection08b/chapter-traces.md), [attractive references correctly withheld](review/collection08b/rejected-passages.md), coverage and browser results. All use actual resolvers; manual events and controlled physical outcomes are disclosed. No personal campaign exports are included. Regenerate with `node scripts/export-chapter-review.mjs`.

I reviewed the output for unsupported claims and repetition, with these technical/editorial findings:

- An old adverse administration reason was insufficient after later cooperation. Selection now checks the **current sourced posture**, otherwise omitting the personal sentence. This has regression coverage.
- A restored opportunity that closes again cannot receive the “remained available” ending. The reversal checkpoint selects a factual interrupted-recovery paragraph instead.
- CH08-03 is correctly rejected even in the beneficial-cooperation campaign. Madhav's actual saved `TR08-REL-RUL-03` line at `incident-25:line-1` says the Company is a useful partner and partnership is not obedience. That does **not** establish the stronger claim that he values its protection, nor a Company demand for thanks.
- The failed-rebellion chapter does not borrow a secretary's hope or invent the ruler's earlier optimism. It retains the approved sober passage with the hope sentence omitted.
- Repeated identical paragraphs give way to a narrower continuation or quiet page, rather than rebranding old events as new. This can make later turns terse; review whether future separately authored continuation variants would help.
- Full saved names can sound geographically repetitive (for example, “Madhav of Bombay” alongside “Bombay”). No unapproved name-shortening convention was invented.
- The underlying 08A useful-partner line appears three times in its existing cooperation campaign. This milestone leaves that event dialogue unchanged; chapters do not automatically quote it or manufacture a new personal transformation from its repetition.

These checks identify factual and repetition risks, but do not establish literary approval or replace the user's review with ChatGPT. Physical-table Army availability and untracked financial results are supplied assumptions in fixtures, not a new inventory/ledger or a claim of complete table playtesting.

## Remaining deferrals

- **Full CH08-03:** no sufficiently explicit saved current protection-valuing judgment plus preserved objections/Company attitude about thanks. Reopened access and generic gratitude/partnership are insufficient. The first-intervention/protection variants need further authored support.
- **Full CH08-04:** no eligible earlier personal hope for a different rebellion outcome in the existing authored/saved chain. Only the expressly permitted factual omission is active.
- **Cross-turn literary variants of CH08-01/02:** older context uses explicit factual dating; the reference paragraphs are not silently rewritten to imply new current events.
- Broader patterns, more continuation prose and richer final-history synthesis remain future authoring/integration work. No new promises, causal motives, payments, completed commerce, troop withdrawal or personal fates are created to enable them.

The implementation is committed locally in reviewable increments. No GitHub push or hosting deployment is included in this 08B task.
