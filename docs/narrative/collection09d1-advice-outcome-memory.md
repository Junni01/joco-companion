# Collection 09D-1 — Committed Counsel and Action-Outcome Memory

**Status:** Design and narrative metadata direction **approved by user**, 25 October 2026. Exact 09D-1 outcome dialogue also creatively approved. **No implementation authorization yet**; review 09C-2 results before a dedicated Codex 09D-1 task. 09C-2 planning previews are being implemented separately. This document specifies 09D-1 history only; moving scenes into resolution dialogs belongs to 09D-2 and adviser rivalries/reputation to 09D-3.

## Purpose

Make fictional advisers accountable for recommendations they **actually spoke during a genuine reported action**, and let their immediate interpretations follow the real outcome. Keep the physical game authoritative: advisers never change legality, probability, money, dice, troop counts, Order states, control or other gameplay.

The meaningful distinction is **a recorded recommendation versus a completed attempt**. A recommendation can have been offered and an attempt subsequently fail. A failed *check* does not grant a post-success choice; therefore failure cannot mean the Director or Governor "ignored" a preferred successful effect.

## Minimal transaction history

Use the existing structured game incident and narrative statement store. Avoid a parallel action log and duplicate personal relationship score. A conceptual `counselAtAction` payload comprises:

| Field | Purpose |
|---|---|
| `attemptIncidentId` | Stable id of the **actual committed action attempt** |
| `speakerId`, `institutionId` | Stable adviser/person and office; independent of transient player officeholder |
| `templateId`, `renderedText`, `stance` | Exact words heard, authored source ID and the advised course (encourage, discourage, conditional, prefer-effect, neutral) |
| `qualification`, `confidenceTone` | Supported risk/reservation expressed **in the actual wording** (if any) and its degree of certainty; authored metadata, not retroactive outcomes or numeric prediction accuracy |
| `utterancePhase` | `pre-check`, `pre-commit` or `post-check`; do not retroactively label one as another |
| `targetIds`, `armyId`, `recommendedEffect` | Specific supported plan, with explicit absence when not applicable |
| `publicEvidenceRef(s)` | Eligibility and player-visible facts at the actual time of speaking; no hidden deck order |
| `shownInAttempt` | Provenance that the line was actually rendered in the current legitimate attempt, not generated only at result time |
| `outcomeKind`, `selectedEffect` | From **real committed gameplay resolver**, including physical reported failure/success and resulting final legal effect |
| `interpretation` | The speaker's later biased understanding of events, separate from authoritative incident facts or evidence-based recommendation metadata |
| `followedStatus` | `followed`, `different-effect`, `proceeded-despite-warning`, `no-choice-on-failure`, or `not-applicable/unknown`; computed by action-specific rules |
| `visibility` | Whether the utterance was audible/public within participating Company personnel, privately expressed, or merely an editor preview; no magical sharing |
| `responseTemplateId`, `responseText` | Optional immediate committed outcome interpretation, independently fact-guarded and saved verbatim |

These are **conceptual fields**, not an instruction to change the current schema literally. Codex must inspect the current incident / preview / saving machinery and propose a minimal additive representation first. Important: storing advice *because it was visibly rendered* is not the same as manufacturing an adviser statement after the outcome.

## State machine and commitment boundaries

1. **No dialog:** No advice generated or logged.
2. **Planning:** A legal selected plan can show authored counsel. This is a **preview only**, held with session-local provenance; no durable political statements, cooldown, incident or RNG change.
3. **Meaningful plan change:** Previous advice may have been heard, but it cannot be attributed to a different target/effect. Keep distinct `pre-check` and any later `post-check` advice in the same eventual *attempt*, only if actually shown; never treat abandoned unrelated planning explorations as campaign history. If the player cancels, **nothing** is recorded.
4. **Real action attempt / committed result:** In the existing authoritative action transaction, bind the actually displayed, supported counsel to the **specific action attempt**, save the final effect (if one exists), and save any same-attempt eligible outcome line. If the app resolves and reports the attempt in multiple protected stages, the existing checkpoint/resumable state is authoritative: **do not lose saved dice/outcomes or write duplicate incidents**.
5. **Undo/Redo, reload, snapshots/import/export:** Restore exact statements, phases and action links, not fresh template selections. Repeated display never mutates or rerolls dialogue.
6. **Narrative off:** No new adviser memory; exact gameplay result parity.

### Special case: pre-check advice and changed effect

The Director's Secretary might recommend **opening a specific Indian Order**, then the physical Special Envoy check succeeds and the player chooses **establishing China instead**. If that original recommendation was actually shown before the physical roll within the *same committed attempt*, it is legitimate to record it as **pre-check Indian advice** and the later China decision as a different effect, optionally with a separate **post-check** reaction. **Do not rewrite the original sentence or claim it anticipated China.**

If the user simply changed an exploratory field before any physical attempt, never claim the Director ignored an adviser. If the user did not actually see the advice at the relevant stage, no invented quotation. If the check **fails**, neither successful effect is selected and `followedStatus` is `no-choice-on-failure`, not `different-effect`.

### Deploy

Unlike the flexible post-check actions, the attempted Army/target is fixed before resolution. Supporting the expedition and then seeing victory/failure can be acknowledged. A discouraging adviser whose counsel was visibly given before the player committed the deployment can note it was pursued despite caution. The result does **not** establish that the adviser would have won by doing something else. Avoid interpreting numeric strength as literal available Company troop inventory.

### Governor Administer and Governor General

Governor **Administer** rolls first and selects a rule-legal benefit only **after success**. Allow advice about a *possible* benefit without making it binding. If the check fails, there is no post-success choice to follow or override. A successful Tax versus recommended Regiment is a supported different effect, subject to the existing legal choices and genuine pre-check visibility.

Governor General law removes the regional Governor offices and replaces the Director's office. Never persist counsel with an impossible active Governor/Director identity after replacement. General actions use their actual implemented rules and matching legitimate adviser only, with separate future creative scope.

### Special Envoy and Trade in China

Special Envoy establishes Superintendent office or opens a specific legal Indian Order on reported **successful** check; its rule permits choice **after** success despite the app's provisional up-front intention. Reported failed check produces neither effect. Superintendent **Trade in China** is a later separate action; actual shipments, trade success, income or cargo remain **untracked**. No callback may imply a China sale simply because the office opened or Company territory holds opium symbols.

## Memory strength and callbacks boundary

**Never compute a simplistic right/wrong prediction score.** An adviser who encouraged proceeding yet explicitly acknowledged danger did not promise an easy victory. Their recommendation must not be caricatured into one; a later precise warning callback requires the specific risk to have been spoken and saved. Preserve the actual quote even when their retrospective interpretation is self-serving. An eligible two-speaker public debate should save **both** actually shown statements and speaker identities under the same committed incident, even if neither makes an immediate response. A cancelled dialog saves neither.

09D-1 saves a *reliable source* for future memories but does not yet implement long-term adviser rivalries, selective self-serving summaries or recurring callbacks. Normal attempts create at most small linked evidence; no automatically stacking hostility scores. A substantial failed expedition, a catastrophic failure, or a meaningful overridden recommendation may qualify as notable *future* 09D-3 memory, but no fictional vindication is mechanically proved. A single disagreement never creates enmity.

Exactly one record for one speaker's actually delivered recommendation per materially distinct utterance/phase; separate two-speaker exchanges retain both identifiable speakers and joint unit ID. Old pre-09D saves should not be backfilled with advice that was not historically displayed.

## Factual and expressive guardrails

- In-character subjective spin is welcome; the reliable chronicler sticks to reported events. General fictional courtly background and rhetorical political interpretation do not certify payments, negotiations or troop deployment.
- A failed envoy check does not certify refusal by an Indian court or failure to reach a real court.
- A Governor's successful check with a different effect permits wounded pride; failure does not.
- Predictions are not retroactive; prior personal thoughts are not other advisers' public knowledge.
- No dialogues about unreported deaths, lost Company troops, realized China trade, historical promises or player families.
- Existing authored outcome lines in `writing/collection09c-adviser-candidates.md` are creatively approved **as writing** but 09D implementation is deferred. The 18 exact outcome lines in `writing/collection09d1-outcome-candidates.md` are now **creatively approved**, including four editorial replacements. That is **writing approval only**, not permission to implement 09D-1 in code or to begin 09D-2/09D-3.

## Acceptance scenarios for eventual Codex delivery

- One Army attempt: visible, discouraging pre-action counsel → committed success, reported failure, catastrophic failure; suitable outcome interpretation and preserved exact quote.
- One Deploy canceled, target changed twice and dialog reopened: no historical record until a real attempt; saved final supported advice matches the actual attempted target.
- Director: India preliminary preference → successful check → China chosen; preserve true utterance phase, optionally log an actual post-check reaction. Repeat with failed check: no implied rejected preference.
- Governor: Tax recommended → successful Administer → regiment chosen, versus failed check with no effect; prevent spurious "ignored".
- Two contrasting advisers genuinely seen in one exchange: both speaker IDs, individual words, shared unit, one incident; no unrelated randomly inserted quotation.
- Same state under a different hidden event order: advice eligibility unchanged; no hidden-info leak.
- Prior current-schema save and narrative-off save remain valid; strict full save/Undo/Redo/reload/import/export and debug isolation.
- Renderer eventually shows physical instructions first and narrative afterward (09D-2); **do not conflate this UI work with 09D-1**.

## Next review

The catalogue's human creative review is complete. Next resolve one precise engineering question: for physical checks, which existing UI transition can reliably prove that the player saw advice **before** reporting the roll? If that cannot be established in 09C-2, store only truly visible, correctly phased utterances and suppress "overruled" callbacks until the proper evidence exists. Do not silently fake chronology.
