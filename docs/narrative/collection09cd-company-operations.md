# Collection 09C/09D — Company operations, counsel, and contextual resolution

**Status:** Approved *design direction*, consolidated 25 October 2026. UI-only 09C-1 is ready for focused Codex implementation after a code audit. **09C narrative text and 09D dialogue require separate creative approval**. No changes to the app are made by this document.

## Authorities and terminology

Follow `AGENTS.md`, `docs/current-status.md`, `docs/narrative/collection09-spec.md`, existing rules audit, the rulebook and current implementation. The physical game remains authoritative; this app reports actions rather than rolling the Director's checks. Verify exact action screens and flags in `dist/` before editing.

**Rulebook source:** `John_Company_Rules_(BGG)_Final.pdf`, printed p.18 (“Director of Trade”, “Special Envoy”), and printed p.25 (“Superintendent of Trade in China”; PDF printed pagination may differ), plus the Governor General section following the China office. The text says:
- Director of Trade may attempt **Special Envoy multiple times**, with a check, £1 spent per die and no penalty. **Only on a successful check** choose to either *create/open trade with China* (Superintendent office, hired immediately) or *open one closed Order in a region not Company-controlled*. Director then may make up to two writer/ship transfers, which remain physical/table-only unless existing code tracks them.
- The *user-preferred app report sequence* is **choose a provisional intended branch first, then report success/failure of the physical check**. This is a UI ordering convenience, **not a rule change**: final authorized branch must be the actual choice made on success. If the player changes their mind after successful check, permit correction/selection before commit. On failure apply no branch result; physical spending remains physical.
- China Superintendent is a **distinct office created** by successful envoy or the Envoy to China law, hired immediately. It **acts after Bengal**, separately from Director. Its Trade in China check uses one die per ship in its office treasury, is at most once per office action, and **cannot be attempted with zero opium icons in Company-controlled regions**. On success Company Balance increases **£4 per icon** and acting player receives **£1 per icon** from bank. Failures must not be narrated as sales. Office treasury ships, money and checks are physical/not tracked in this app.
- With the Governor General law, the **Governor General replaces Director of Trade** and occupies that operation-phase position. Existing separate GG rules/UI remain authoritative: **do not leave active Director of Trade Special Envoy controls in a scenario/state where the Director is replaced**. This is not simply a cosmetic rename; preserve existing GG action behaviour and instruction.

## 09C-1 — UI-only Company Operations (first authorized engineering task)

**Primary goal:** Clear access by responsible institution, not by selected map region. Avoid changing any resolver or introducing advisers/memories prematurely.

- Permanent compact **Company Operations** area, displayed once rather than one box per conquered region, touch first and tablet/desktop usable.
- **Active Director of Trade** panel placed before three Armies in logical phase order. It provides **Special Envoy** entry point. When Governor General replaces Director, present appropriate Governor General access/status instead and preserve its existing rule-defined actions; no invalid Envoy.
- Three fixed boxes for **Bombay Army**, **Madras Army**, **Bengal Army** with **Deploy** entry buttons. Clicking an Army supplies its identity directly to the existing deployment dialog; **select target next**, based solely on the current legal-target machinery. Do not require selecting a region first or choosing Army a second time. Retain multi-region targeting where mechanically allowed, and all current strength, exhaustion, officer, local alliance, loot, result and casualty reporting. No change to board pieces: the app doesn't track Army inventory.
- The selected-region UI retains **Governor/administration** actions, unrest, local ruler and regional investigation. It does **not** gain one permanent Governor box per Company territory. Remove/retire duplicate region-based Deploy entry once new flow works.
- **Special Envoy** begins from permanent Director panel. Step A: provisional intended branch, either India closed Order (choose an actually eligible Order and region not under Company control) or establish China office **only if it does not already exist and rule permits**. Step B: report check success/failure; show result preview; **explicit confirm** commits existing resolver action; cancel leaves state unchanged. Check current app's Special Envoy support and match it; if there is no verified support for some result, do not manufacture it. Avoid implying China *trading* is the Envoy action.
- **Superintendent Trade in China** should get a discoverable contextual panel/action **when active**, separate from Special Envoy and correctly ordered after Bengal in player instructions. Its mechanical trade result and finances remain physical instructions, not a fabricated simulator or automated ledger. The 09C-1 UI may expose existing status/guide if supported; a new transactional Trade reporting mechanic is **deferred pending explicit scope review**. For narrative later, a player-reported success/fail may be introduced without tracking detailed payments, but this needs explicit implementation contract.
- Permanently accessible actions need disabled-state reasons and appropriate office availability. Respect scenarios, laws and phase semantics. The board game can perform Special Envoy repeatedly; do not impose a one-action-per-turn lock.
- Selected regions may still be used to highlight eligible targets and inspect consequences without modifying draft plans. Tactical target highlights must not obscure map-selected-region outline.

## 09C-2 — Adviser planning (design only; separate prose approval)

Permanent NPC attachments (not player officeholders): one recurring military adviser per Army; one Director's Secretary; one distinct Assistant for China Affairs. Governors' assistants remain **region-local** and potentially persist across replacement of player Governor. Whether the Director's Secretary persists through Governor General replacement requires an explicit compatible office/role policy at implementation time. Prefer stable independent NPC IDs and retain their histories.

Adviser counsel is **brief**, usually one relevant suggestion and occasionally a second contradictory voice; silence acceptable. Adviser selection depends on known public game context, personal memory, aptitude, caution, ambition, pride and institutional interests. No hidden deck order or untracked Army/ship/inventory values. Distinct competence from caution; personalities are not static jokes. Target changes may produce a new *preview* without RNG/memory mutation, but repeated +/- inputs must not chatter. No gameplay influence.

Draft previews are **ephemeral** until a real action is committed. Cancel / changing target does not produce canonical advice memory, cooldown, opinions or RNG. At commit, bind **exact advice the player last saw** to action ID, speaker ID, selected plan/target, eligible source facts and stable text. Persist through save/Undo/Redo. Do not reconstruct pre-outcome advice after knowing result. After committed success/failure, allow grounded narrative reactions. Later callbacks can reference only committed advice, may be vainly self-serving, and must not invent causal links between separate events.

## 09D — Resolution dialog placement (design only; separate writing review)

Gameplay instructions (physical actions and result confirmation) take precedence. Once a real action resolves, keep the dialog open on a clear resolution page and show selected **saved in-universe speakers**: relevant Army adviser and Indian ruler for deployment, Director Secretary and target ruler/adviser for Orders, China assistant for China-related resolutions, appropriate region adviser/ruler for Governor/Turmoil. Chronicle retains exact structured incident/lines. Don't relocate all event narrative to one giant side panel; maintain dedicated Elephant step and visible next stack-back region. Use existing source/evidence guards; no spoken rule terminology.

## China assistant — opium-aware design, not trade ledger

- A separate persistent China Affairs NPC has an ongoing institutional fixation on available **opium icons in Company-controlled regions**; the count must be calculated from the rule-defined *printed board icons* and current Company control, not guessed from region names. Audit `dist/` data and board map or rulebook imagery for exact counts before integrating any number. **No approved numeric mapping is asserted here.**
- At committed control changes, calculate **before/after availability**; record grounded deltas (gain/loss, affected region, actual prior/current icons) with the existing incident/transaction mechanism. Recompute from canonical region data, not a second manual counter. No claims that a territory without symbols causes supply change.
- This is **potential available trade amount**, not actual opium shipped, sold, consumed, produced, profit received or transaction success. The assistant may react to rising/falling/zero/abundant *potential*; no invented completed transaction. Distinguish the optional Superintendent office's existence, whether a Trade in China action was even **eligible**, and the outcome if later explicitly reported.
- The Superintendent action is **not synonymous with Special Envoy to China**. Never show China trading as one of the two Special Envoy success branches.
- Narrative prose should remain period-aware, darkly satirical and human, but user+ChatGPT must approve exact new lines before content integration.

## Delivery boundaries

09C-1 **only** is authorized for first implementation, after reviewing current code and rules audit. No additional tracking of officeholders, ships, money, dice, actual China transactions; no counsel/memory/09D relocation in UI phase. No Collection 10 names, portrait/succession, new gameplay outcomes, unrelated cleanup or hosted Site deployment. Keep `dist/` as source, static frontend, no new build.

## Acceptance checks for 09C-1

1. All three Army Deploy buttons work without a map selection; source Army is fixed and current legal target/multitarget constraints remain. Existing deploy bonus/strength/officer inputs and results stay intact.
2. Selected-region Governor actions still work with many Company territories; no proliferation of boxes.
3. Special Envoy is readily accessible in its proper office context and repeated checks allowed. Provisional intent -> reported roll -> confirmed outcome; cancellation at every precommit stage cleanly leaves no action.
4. India Order branch rejects Company-controlled region, already-open Order and other illegal choices through existing rules. China branch creates office only on **successful** envoy; no Office created on failed attempt. Allow branch re-selection after success if needed to preserve physical-game sequencing.
5. Existing activated Superintendent office and Governor General replacement states never expose the wrong office action. China Trade is not mislabeled Envoy and retains proper eligibility/physical instructions.
6. Regular/debug parity, small/tablet/desktop UI, selected map region and target display, scenario gating, save/reload/Undo/Redo and narrative-on/off gameplay equivalence.
7. Full `npm test` and browser action/cancel smoke checks; provide current counts and limitations. Don't assert tests not run.

## Authoring / follow-on deliverables

**Before 09C-2**: create and creatively approve small authored adviser previews for Army, Director Secretary, China Assistant, plus speaker IDs, factual guards, and personality-specific reaction variants. **Before 09D**: approve resolution/callback lines and precise transactional report semantics. Avoid Codex inventing dialogue to fill gaps.
