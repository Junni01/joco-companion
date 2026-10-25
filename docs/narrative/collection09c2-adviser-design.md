# Collection 09C-2 — Persistent adviser identity and planning counsel

**Status:** **Creative wording approved** on 25 October 2026; **focused 09C-2 adviser identity and ephemeral planning counsel implementation authorized**. 09D callbacks, committed utterance follow-through, resolution-dialog relocation and opium-delta event commentary are deferred until separately scoped. 09C-1 is implemented (reported 292 tests). Read `collection09cd-counsel-dialogues.md`, `narrative-requirements.md`, `writing/style-guide.md`, and existing cast-generation source before implementing.

## Cast ownership and personality

There are five **functional adviser slots**: Bombay Army adjutant, Madras Army adjutant, Bengal Army adjutant, Director of Trade secretary, China affairs assistant. These are not necessarily five new character records. Existing M1 reportedly generates six Presidency/Army advisers plus a Governor General secretary; **audit and reuse/associate appropriate existing continuing characters first**. Do not duplicate their identities or rewrite saved biographies. If a functional slot genuinely lacks a person, introduce one using the established fictional cast generation, stable IDs and current-version save contract. An adviser belongs to the institution, not to a player-controlled Commander, Director or Governor. The China adviser may be interested in India supply before Superintendent office activation, but should not pretend that office exists.

**Stable office ≠ stable personality archetype.** Each Army's domain remains fixed (western/southern/eastern interests), while campaign-generated ambition, caution, pride, ruthlessness, loyalty, vindictiveness, competence, confidence, mood and experience determine voice. Do not hardcode 'Bombay = cautious, Madras = aggressive, Bengal = prudent'. Two advisers may disagree without one being always right. The same adviser must not change traits when UI panels are re-opened; recorded events may gradually affect outlook and relationships. Fictional adviser can keep their own identity when player Commander/Director changes. If later fictional career succession is implemented, replacement inherits institutional files, **not** predecessors' private memories or first-person boasts.

A stable identifier for person, distinct identifier for office and an optional office tenure link are preferred. Collection 10A will improve names and historical biographies; no new formula names or real-historical officer impersonation as part of 09C-2.


## Approved editorial refinements

The China assistant's institutional concern with opium access is fixed; greed, conscientious hesitation and bureaucratic accountability are **variable** personal positions. The campaign-generated identity must not lock them into the same comic archetype each time. Rare cross-institutional disagreements require a real evidence-based conflict of interests (for example Army versus China when a target's verified printed opium matters), not random paired opposite quotations. Ordinary actions may have no counsel; unchanged previews must not cycle. The creatively approved catalogue contains eight revised lines and additional conditional China voice candidates; gate any line that overstates supported board facts rather than inventing support.

## Preview and legal knowledge

- Deploy dialog opens with Army fixed. Once a target is legally configured, derive **eligible recommendations** from already-known defender/attacker context, public political outlook, active Company control/unrest, supported recent campaigns, regional interests, and personal traits. No hidden event face/order, untracked Army troop inventory or invented cash cost.
- Give one brief primary adviser statement normally. An occasional independently eligible second speaker can dissent. It must refer to the same actual plan; avoid two arbitrary quips from unrelated templates.
- Show **recommendation/concern** rather than a strategy solver. Competent advisers may understand risk but still desire profit/prestige; foolish advisers may stumble into sensible advice. Caution/ambition/competence distinct. Standard mode should not saturate every routine action.
- Draft advice for Special Envoy separately: Director's Secretary for a specific Indian Order; China assistant for intended Superintendent establishment. The successful physical check **allows choosing/changing the effect afterward**; any changed final effect must update the displayed advice or explicitly have no valid advice, not retain a mismatching Indian-region recommendation.
- Preview may update when Army, target, chosen effect or substantive public state changes, not on every +/- of exhausted troops or on re-opening unchanged plan. Prefer stable deterministic eligibility and persistent **preview-session choice** separate from history. No narrative RNG changes before commitment.
- Cancel/Back before action commitment leaves **no historical quote, relationship change, prediction memory or claim that an expedition happened**. Committed results record only the exact advice visibly attached to the final actual chosen plan; maintain exact source and speaker identity.
- If users change action/effect **after rolling but before confirming**, align saved advice with the **final effect**; do not pretend an earlier preview warned about another decision. Avoid falsely presenting a line never seen as if delivered before the roll. Distinguish post-roll explanation from genuine pre-roll counsel.

## Post-check effect choice: Special Envoy and Governor Administer

**A recommendation is not a compulsory declaration of the effect.** Both Special Envoy and Governor Administer are checks whose legal benefit is chosen *after success*. UI action-first preference is provisional. Players can still change their mind after the check succeeds. Deploy is different: its target/attempt is configured before physical resolution.

For Special Envoy distinguish original visible adviser preference, actual reported check result, revised preference/final chosen effect, and outcome commentary. If the user changes the effect after success, any newly displayed comment is **post-roll counsel/reaction**, not a falsified pre-roll warning. Save only lines truly displayed and associate their temporal role (pre-check or post-check). A failed check has no elected successful effect to remember.

For Governor Administer, keep the selected-region entry point. Before the physical check, the appropriate regional administrative assistant can recommend an eligible use of potential success (Tax / Commission Regiment / Build Company Ship according to actual current rules). After reported success, the player selects whichever legally permitted action they prefer; only then may the adviser react to being followed or disregarded. Failed checks have no resulting choice and cannot imply deliberate disagreement. Governor General replacement must use accurate office/assistant identity and its own legal actions.

This feature **does not require tracking a player's identity, family, motive or treasury**. Advice is merely fictional commentary on options the game actually grants. A later callback can express personal irritation only if the original recommendation and chosen different effect were recorded in a committed action.

## Concrete advice structure

A recommendation record should capture `speakerId`, `institutionId`, `actionKind`, `armyId` or target Order/China office effect, `targetId(s)`, `stance` (encourage / discourage / qualified / neutral), `renderedText`, `templateId`, `publicEvidenceIds`, `visibleAtCommit`, and the game incident ID if one is committed. The implementation must not use the dialogue to decide legal actions or mutate physical outcomes. This is a conceptual contract: fit current narrative schema, don't create duplicate logs.

**Follow-through:** 09D later displays actual instruction/results first and a compatible adviser response. Only a previously committed, actually visible recommendation may be quoted or callback-referenced. No retroactive prophecies. After the real outcome, an adviser may spin events while chronicler stays authoritative. Long-term claims such as 'you ignored my warnings' require an actual saved warning and incompatible player action, not inferred motive.

## Distinct recurring interests

- Bombay/Madras/Bengal: interpret respective legal military opportunities and past recorded deployments without rigid stereotypes.
- Director's Secretary: interest in access to closed/open Indian Orders and proper bureaucratic procedure, remembering only committed missions.
- China assistant: derive interest from controlled-region printed opium icons, `before`/`after` supply deltas and actual Superintendent activation. Opium is potential access, not traded cargo/profit. Board icon counts remain pending separate board-asset verification; no direct changes in 09C-2 until verified.
- Regional Governor secretaries stay embedded in region details. Governor General law replacement must not keep an active Director/old Governor fictional office in dialogue.

## Sequence and persistence refinement

Capture preview-visible candidate ID/text and its logical timestamp **inside the current dialog session**, without committing narrative history. On final confirmation, record which utterances were genuinely displayed as pre-check advice, any distinct post-check switch reaction, final legal effect and incident ID; do not change narrative history on a cancelled plan. If the player reports failure, omit all claims that they freely declined the preferred effect. If the app has no method to evidence that the preferred advice was seen before the physical roll, suppress claims of ignored advice rather than infer them.

Create callbacks only after committed results and guard against unsupported specific explanations for a failed Special Envoy check (the court's refusal is not established).

## Creative and technical acceptance gate

Before Codex implementation: creative approval of the exact lines and guards in `writing/collection09c-adviser-candidates.md` is **complete**. Codex must still inspect existing cast generation and transaction binding; verified opium icon counts are a **prerequisite to enabling icon-dependent preview lines**. Implement **minimal reused adviser identity and ephemeral planning previews** now. Do **not** implement 09D committed-advice history/callbacks or resolution-dialog relocation as part of this pass. Tests: campaigns/scenarios, repeat read, cancel, changed plan after success, Commander office change, old current-schema saved speaker IDs, debug separation, normal narrative-off parity, full 09A hidden-information tests, Undo/Redo. No Site deployment.
