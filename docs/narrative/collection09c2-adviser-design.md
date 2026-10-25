# Collection 09C-2 — Persistent adviser identity and planning counsel

**Status:** Design proposal for creative review, 25 October 2026. **No implementation authorization or final dialogue approval yet.** 09C-1 is implemented (reported 292 tests). Read `collection09cd-counsel-dialogues.md`, `narrative-requirements.md`, `writing/style-guide.md`, and existing cast-generation source before implementing.

## Cast ownership and personality

There are five **functional adviser slots**: Bombay Army adjutant, Madras Army adjutant, Bengal Army adjutant, Director of Trade secretary, China affairs assistant. These are not necessarily five new character records. Existing M1 reportedly generates six Presidency/Army advisers plus a Governor General secretary; **audit and reuse/associate appropriate existing continuing characters first**. Do not duplicate their identities or rewrite saved biographies. If a functional slot genuinely lacks a person, introduce one using the established fictional cast generation, stable IDs and current-version save contract. An adviser belongs to the institution, not to a player-controlled Commander, Director or Governor. The China adviser may be interested in India supply before Superintendent office activation, but should not pretend that office exists.

**Stable office ≠ stable personality archetype.** Each Army's domain remains fixed (western/southern/eastern interests), while campaign-generated ambition, caution, pride, ruthlessness, loyalty, vindictiveness, competence, confidence, mood and experience determine voice. Do not hardcode 'Bombay = cautious, Madras = aggressive, Bengal = prudent'. Two advisers may disagree without one being always right. The same adviser must not change traits when UI panels are re-opened; recorded events may gradually affect outlook and relationships. Fictional adviser can keep their own identity when player Commander/Director changes. If later fictional career succession is implemented, replacement inherits institutional files, **not** predecessors' private memories or first-person boasts.

A stable identifier for person, distinct identifier for office and an optional office tenure link are preferred. Collection 10A will improve names and historical biographies; no new formula names or real-historical officer impersonation as part of 09C-2.

## Preview and legal knowledge

- Deploy dialog opens with Army fixed. Once a target is legally configured, derive **eligible recommendations** from already-known defender/attacker context, public political outlook, active Company control/unrest, supported recent campaigns, regional interests, and personal traits. No hidden event face/order, untracked Army troop inventory or invented cash cost.
- Give one brief primary adviser statement normally. An occasional independently eligible second speaker can dissent. It must refer to the same actual plan; avoid two arbitrary quips from unrelated templates.
- Show **recommendation/concern** rather than a strategy solver. Competent advisers may understand risk but still desire profit/prestige; foolish advisers may stumble into sensible advice. Caution/ambition/competence distinct. Standard mode should not saturate every routine action.
- Draft advice for Special Envoy separately: Director's Secretary for a specific Indian Order; China assistant for intended Superintendent establishment. The successful physical check **allows choosing/changing the effect afterward**; any changed final effect must update the displayed advice or explicitly have no valid advice, not retain a mismatching Indian-region recommendation.
- Preview may update when Army, target, chosen effect or substantive public state changes, not on every +/- of exhausted troops or on re-opening unchanged plan. Prefer stable deterministic eligibility and persistent **preview-session choice** separate from history. No narrative RNG changes before commitment.
- Cancel/Back before action commitment leaves **no historical quote, relationship change, prediction memory or claim that an expedition happened**. Committed results record only the exact advice visibly attached to the final actual chosen plan; maintain exact source and speaker identity.
- If users change action/effect **after rolling but before confirming**, align saved advice with the **final effect**; do not pretend an earlier preview warned about another decision. Avoid falsely presenting a line never seen as if delivered before the roll. Distinguish post-roll explanation from genuine pre-roll counsel.

## Concrete advice structure

A recommendation record should capture `speakerId`, `institutionId`, `actionKind`, `armyId` or target Order/China office effect, `targetId(s)`, `stance` (encourage / discourage / qualified / neutral), `renderedText`, `templateId`, `publicEvidenceIds`, `visibleAtCommit`, and the game incident ID if one is committed. The implementation must not use the dialogue to decide legal actions or mutate physical outcomes. This is a conceptual contract: fit current narrative schema, don't create duplicate logs.

**Follow-through:** 09D later displays actual instruction/results first and a compatible adviser response. Only a previously committed, actually visible recommendation may be quoted or callback-referenced. No retroactive prophecies. After the real outcome, an adviser may spin events while chronicler stays authoritative. Long-term claims such as 'you ignored my warnings' require an actual saved warning and incompatible player action, not inferred motive.

## Distinct recurring interests

- Bombay/Madras/Bengal: interpret respective legal military opportunities and past recorded deployments without rigid stereotypes.
- Director's Secretary: interest in access to closed/open Indian Orders and proper bureaucratic procedure, remembering only committed missions.
- China assistant: derive interest from controlled-region printed opium icons, `before`/`after` supply deltas and actual Superintendent activation. Opium is potential access, not traded cargo/profit. Board icon counts remain pending separate board-asset verification; no direct changes in 09C-2 until verified.
- Regional Governor secretaries stay embedded in region details. Governor General law replacement must not keep an active Director/old Governor fictional office in dialogue.

## Creative and technical acceptance gate

Before Codex implementation: human approval of exact lines and guards in `writing/collection09c-adviser-candidates.md`; factual board audit for opium quantities; inspection of existing cast and exact transaction binding. Then split implementation into minimal adviser identity/preview followed by committed advice/09D dialog relocation. Tests: campaigns/scenarios, repeat read, cancel, changed plan after success, Commander office change, old current-schema saved speaker IDs, debug separation, normal narrative-off parity, full 09A hidden-information tests, Undo/Redo. No Site deployment.
