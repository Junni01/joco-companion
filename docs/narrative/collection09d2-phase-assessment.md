# Future phase workflow — engineering assessment only

26 October 2026. This assessment fulfils 09D-2 Part B. **None of these future workflow, Revenue, shareholder, failure-epilogue or Parliament-scene changes are implemented by 09D-2.** New writing requires creative approval; any additional player reporting needs its own implementation authorization.

## Current architecture

`app.js` has two different concepts of phase. `guidePhase` is a local, unsaved selection used by `turn-guide.js` and the nine printed-phase shortcuts; it defaults to London Season and does not constrain the active campaign. Actual enforced progress is `state.indiaPhase` (turn, storm face, required/completed events, ships/events/complete status), `parliamentFinishedTurn`, event-stack pending state and protected action progress. `administration.js` gates supported Company actions once Events begins. `india-phase.js` gates Parliament and New Turn. There is no durable Company Operation/Bonuses/Revenue/Upkeep stage controller.

`phase-dialog.js` owns storms, event count and phase closure. `action-dialogs.js` owns actual event reports, Parliament's relevant-card/result controls, end-game reports and New Turn. `transactions.js`, `action-progress.js` and the normal app commit store provide save/export/import/Undo/Redo and protected dice/instruction cursors. `game-end.js` distinguishes completed scenario and Company failure, but does not record **where in Revenue** failure happened. `canEndGame` permits failure outside an active India Phase; it does not derive failure from a tracked Standing marker.

The source rulebook was read directly from the supplied PDF (publisher-rulebook.pdf): printed pp.18, 24–29, 31, 34–35; existing publisher corrections in `buried-giant-rules-audit.md` retain precedence. Page 27 establishes Bonuses before Revenue, expenses → Expectations → optional dividends, and **immediate** Final Scoring if Standing reaches the leftmost space. Page 29 establishes completing Events in India before scoring a failure caused there. Page 34 establishes actual law/policy selection, read law/support, debate, then vote. These timings are different and must not share one generic failure transition.

## Proposed smallest workflow change

Add one turn-bound structured progress record (working name `turnWorkflow`) with stages `operations`, `bonuses-revenue`, `india`, `parliament`, `upkeep`. New Turn remains the existing action, not a sixth physical phase. Keep printed phases V and VI distinct inside the combined screen. Do not guide London Season, Family or Hiring, and do not add completion questions for them. The full rule reference may remain secondary Help; its local page selection must never advance campaign progress.

Create a small shared phase coordinator deriving existing India/Parliament state and providing the additional transitions. Reuse `phase-dialog.js` and existing action handlers rather than rewriting their rules. All transitions need ordinary canonical incident/transaction records, scenario-aware guards and Undo/Redo. Do not maintain an independent parallel phase counter. Existing pending events/app dice must take precedence over navigation; a presentation page cannot skip a mandatory report or instruction. Mid-campaign current-schema saves missing the new optional field need an explicit, conservative resume policy agreed before that task, without fabricating a completed Revenue report.

Likely module changes: `app.js` shortcuts/subtitle/launch routing; `turn-guide.js` separation of Help from active workflow; new shared stage coordinator and Bonuses/Revenue UI; narrow `administration.js`/`india-phase.js` gates; `actions.js` new canonical stage/report inputs; `model.js` additive validation; `game-end.js` phase-specific failure metadata; existing transactions/protected progress reused. No new financial simulation, officeholder database or separate debug engine.

## Revenue: tracked facts and minimal additional contract

Already available: turn/scenario and laws; Company-controlled territories and printed opium access; actual committed Deploy outcomes, reported officer losses, territorial changes and commercial disruptions/restorations; chronological incidents, personal memories and exact saved counsel; **instructions** for cumulative Standing loss, but no actual Standing balance. China office is tracked; completed China trade, receipts, shipments and player holdings are not. The guide describes Bonuses/Revenue but records neither completion nor financial performance.

For future Narrative-mode Revenue reporting, a minimal proposed record is:

- `turn`, source incident ID and exact Revenue step reached (`expenses`, `expectations` or `dividends-complete`).
- Reported emergency-loan count and reported actual Standing **position** at that reached step.
- Dividend count only when the dividend step was actually reached; `null`/absent if failure occurred earlier, **not zero**.
- Derived `companyFailed` from the actual reported leftmost track position; no second 'failed?' question.

The Standing track's canonical positions, identifiers and scenario/law exceptions must be verified against the physical board before implementation. Do not invent a numerical track range. Loan count is not automatically a Debt total; expenses, current Company Balance, Expectations thresholds, player shares and all office treasuries remain physical. Dividends means number of dividend payouts, not total money received or family-specific profit. Normal mode needs concise physical instructions and a usable failure path without shareholder-only reporting.

Take the smallest report at the actual point it is available. Early Revenue failure must not force the player to report nonexistent later dividends or finish hypothetical later steps. The approved design does not justify extra confirmations; continue/complete existing physical stages using the reported actual state. Resolving publication-specific financial rules still belongs to the physical board unless a separately authorized minimal input supports enforcement.

## Shareholder knowledge window

Build a pure projection from committed structured incidents, phase/turn and incident order. Include current-turn **Company Operations completed before Revenue**, previous-turn **India Event-phase incidents**, reported current Revenue facts, and selected older significant history. Do not filter all India-related history to the previous turn: today's conquest/Envoy/Tax is already known. Exclude cancelled plans, untouched previews, future current-turn India events, private thoughts and unreported trade. The first turn can use current operations while having no previous India Phase. A partial/old current-schema history must be honestly incomplete rather than reconstructed.

Use approved incidental shareholder role labels without permanent character IDs, roster entries, biographies or generation. Persist selected exact text and source references on the real Revenue incident. An ordinary scene and final epilogue must be mutually exclusive for that outcome. No production shareholder prose exists in this implementation.

## Revenue-failure epilogue and scoring

Extend the existing failure outcome with source phase/step and a Standing observation. On actual Revenue failure: commit the reached-step report and failure atomically, select the approved **final** shareholder scene using only facts known at that instant, then show the rulebook's Final Scoring instructions. Normal mode skips the fictional page. No Events/Parliament transition follows; Undo restores the whole preceding valid state. Do not reuse the active-India-phase failure gate for this branch.

The existing generic End game form can already record Company failure outside Events, and existing scoring instructions can be reused. It cannot presently distinguish Revenue expenses failure from Expectations failure, derive Standing, or ensure an epilogue excludes unreached dividends. Those are explicit future additions, not facts available now. Review final-turn/scenario exceptions and legislated failure separately: a failure during Events completes that phase; a legislated failure completes the applicable vote. Do not introduce new failure votes or payout rules.

## Parliament insertion point

Current `parliamentChoices` selects relevant laws or Famine/War Against France and records their final physical outcome. Most law draws, policy selection, starting support, debate, actual votes and failure caused by untracked laws are not recorded. The UI is a **result recorder**, not a complete simulated Parliament procedure.

The natural future hook is the existing selected-card view **before** its final outcome is reported, matching the physical pre-vote debate window. Approved MPs can discuss public Company history there. A law-specific claim requires actual selected-law information; a policy-specific claim requires actual policy data, which the current app does not have. Avoid adding fake policy decisions/voting steps solely for story eligibility. A generic grievance scene can omit those unknowns. If exact law/policy-aware timing is required, settle the minimal physical-reporting contract first.

Reuse 09D-2's one scrollable identity-attributed scene and pure instruction navigation. MPs remain one-off fictional roles, not persistent roster additions. No generated production MP dialogue, new votes, family payments or persistent NPC system is required. Save exact prose under the relevant actual stage/selection so reload/back cannot regenerate it; result changes must not backdate a speech.

## Suggested future sequence and open prerequisites

1. Authorize the stage coordinator and settle current-schema partial-progress defaults; verify physical Standing positions/scenario exceptions.
2. Implement shared Normal/Narrative Bonuses → Revenue physical flow with actual failure timing, before shareholder writing integration.
3. Add the minimal optional Narrative Revenue report and a tested public-history projection; approve actual ordinary/final shareholder prose separately.
4. Integrate mutually exclusive shareholder/epilogue scenes and final-scoring branch.
5. Approve Parliament scene timing and writing; integrate only guards supported by the real selected-card/history data.

Regression coverage should include all scenarios, missing previous-turn records, current conquest plus borrowing, early failure before dividends, final-turn scoring, failures in three different phases, pending event precedence, optional narrative-off reports, hidden-deck permutations, late plan/result changes, cancellation, regular/debug separation and exact atomic restore paths. These are future tests, not claims about implemented Revenue functionality.
