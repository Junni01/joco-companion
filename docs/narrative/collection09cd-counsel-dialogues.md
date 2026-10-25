# Collection 09C-2 / 09D — Company advisers, action-dialog narrative and China outlook

**Status:** Approved **design direction**, not authorization to integrate new authored speech. Prepare a separate dialogue collection for human approval before coding. Read [09C-1 UI](collection09c-operations-ui.md) and [verified rules boundaries](collection09cd-rules-check.md).

## Permanent advisers and ownership

- **Three persistent military advisers**, one each for Bombay, Madras and Bengal Presidency Army. Adviser belongs to institutional Army, not to a player-family Commander. Changing a player Commander doesn't destroy the fictional adviser or their history.
- **Director's Secretary**: distinct persistent adviser focused on Indian Orders, diplomacy, opening/closing commercial opportunities and institutional politics.
- **Assistant for China Affairs**: distinct persistent NPC focused on **currently available opium icons**, gains and losses from control, and China-related opportunities. Doesn't conflate available icons with actually transported/traded opium.
- **Regional administrative assistants**: Governor-related dialogue remains associated with selected Company region, not permanent boxes for each Governor. Player Governor family identities are not tracked. After Governor General law, don't imply active regional Governor offices continue; respect existing administration rules.
- Other regional rulers may speak on opening/closing their region's Order, conquest and broader trade cascades; all speakers may disagree when facts warrant.
- Names, status and memory must persist with stable institution/person identity. Collection 10A full fictional names will be specified separately; don't tie storage keys to a mutable rendered name. Draft names and sample lines are not production-approved.

## Action-first counsel and transaction boundaries

**Deploy**: Army panel fixes the Army; once a meaningful legal target/plan is configured, show concise pre-action counsel. One primary adviser ordinarily; sometimes a relevant second speaker respectfully contradicts. No game-stat reference in character speech. Target and Army-specific facts, public outlook and sourced adviser memories determine eligibility, never hidden event faces.

**Special Envoy**: Director panel provides action choice (Indian Order versus establishing China office), target order when applicable, then player-reported roll result. Director's Secretary or China assistant offers relevant context. Rule's post-success freedom of choice remains intact; on success allow choosing/change of legal effect at confirmation.

**China**: Opening China office and performing Superintendent **Trade in China** are different events. The assistant can react to China-office activation, opium accessibility, supply shifts and reported outcome only where the app actually records it. Current project explicitly does **not** track Trade in China outcome. Therefore do not fabricate "successful trade", paid bonuses, shipments or lost cargo. If actual China-trade success/failure reporting is later added, implement as a separate authorized workflow rather than silently folding it into Special Envoy.

**Advice preview is ephemeral**: re-evaluate a preview only when Army/target/major plan or relevant public facts materially change. Do not rotate on every +/- click, map hover or panel read. Opening, changing target and cancelling must not append a saved incident, mutate personality or consume narrative/game RNG.

**Commit atomicity**: When a real attempt is committed, save exactly what recommendation was actually visible at commitment, adviser identity, action intent/final selected effects, public evidence, and player-reported outcome only if known. A changed target/effect invalidates the prior preview, requiring accurate replacement counsel or explicitly no counsel. Never credit the adviser with statements displayed only in cancelled planning. If the app has a multi-stage durable attempt, preserve the single transaction boundary and reload-safe draft without creating historical speech before commitment.

**Action dialog placement (09D)**: Show gameplay result and physical instructions clearly first, then relevant chronicler/Indian ruler/Company adviser reactions in the still-visible resolution dialog; preserve independent Elephant instruction page and exposed stack recap. Avoid toast-only important speech. Chronicle continues to store exact utterances and supported provenance. Don't duplicate all speech on map.

**Callbacks**: Later remarks may be based on a previously **committed** saved recommendation and later real consequences. An adviser may claim vindication or blame as a biased opinion, but narration cannot assert an unrecorded causal link. Accurate quote/ref to prior advice, no retroactive prescience. A real failure doesn't prove a prudent strategy would have succeeded.

## Opium-aware assistant

Use canonical map metadata for each region's **printed opium icon count**; total is sum across actual Company-controlled regions, not from opened Orders, army movements, generic prosperity or successful Special Envoy. Check current stored opium/icon map values against physical board before any changed count logic.

Maintain derived `before`, `after`, signed `delta` and affected region(s) when a **committed actual change in control** makes symbols available/unavailable. Don't write an independent editable opium counter. Do not turn a transient UI choice into gains/losses. An unrelated control event with zero-opium region should not produce a fabricated supply change. Handle repeated loss, reconquest, Undo/Redo and save snapshots accurately.

The assistant's priorities can diverge sharply from military advisers: a tactically impressive conquest with no new opium is a commercial non-event; a small loss of access can elicit real anxiety. The character may be ruthless, bureaucratic or obsessive but not a mechanical oracle. Give distinct voices for zero/low/high available totals and change events **relative to actual map counts**; avoid unverified thresholds. If Superintendent is not yet created, use interest/hopeful planning instead of implying office already operates. After office activation, report potential proceeds as *potential* only, not recorded money. No illicit narrative fact enters other NPC knowledge.

## Writing acceptance before implementation

Author and approve separate exact, guarded dialogue collections for: three Army advisers' cautious/ambitious/incompetent contrasted plans, Director's Secretary on opening/closing Orders, Assistant for China Affairs on control-derived +/− opium access, failed and successful Special Envoy reported attempts, regional ruler responses and at least one real prior-advice callback. Carefully distinguish quotation preview, recorded counsel, unrecorded future and outcome statement; avoid generic repetitive caution. Creative examples in ChatGPT conversation are inspirations **not automatically approved text**.

## Integration and tests (future, not UI task)

Narrative-off gameplay equivalence; unchanged public forecasts/hidden information; adviser identity stable when Commander office changes; no memory from abandoned previews; history and exact texts survive import/export, reload, snapshots, Undo/Redo; event-dialog narrative visible alongside rules and no duplicates; deterministic outcomes/read stability; control/opium updates no impossible gains; China outcome not fabricated. Do not add 09C adviser speech or 09D callback system during 09C-1.
