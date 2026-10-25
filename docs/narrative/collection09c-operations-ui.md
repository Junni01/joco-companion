# Collection 09C-1 — Company Operations interface

**Status:** Approved product direction, specification handoff for **UI-only first implementation** (25 October 2026). This document authorizes a focused UI refactor **only** after Codex reads current implementations/tests and preserves mechanics. 09C narrative advice and 09D resolution/callback engine require later authored-prose approval.

## Why change

The current region-first Deploy flow makes users choose a region, then Army, then target, even though there are exactly three permanent Presidency Armies. The Director of Trade's Special Envoy occurs before Presidency operations and must not hide behind region selection. Governor actions scale with Company territories and should stay in the selected-region details.

## Permanent Company Operations area

Place four compact **always accessible** institutional panels in a stable sidebar or comparably visible operations area:

1. **Director of Trade**, with **Special Envoy** entry point, before the Armies in visual order.
2. **Bombay Army** with **Deploy**.
3. **Madras Army** with **Deploy**.
4. **Bengal Army** with **Deploy**.

On desktop/tablet they must remain discoverable without selecting a region; touch-first, responsive. Do not add an individual panel for every Governor. Keep region detail/region editor for local control, unrest, Governor **Tax/Administer**, etc. Avoid duplicate competing Deploy/Special Envoy entry points after the new path is verified.

**Governor General caveat:** The Governor General law replaces the Director of Trade office and removes Governor offices (rules PDF printed p.26). The panel cannot misleadingly claim an active Director exists after replacement. Respect scenario/law state and current application's supported Governor General handling. Show an accurate replacement/disabled state for the trade-office panel as applicable; do not invent a Special Envoy power for Governor General. Preserve existing Governor General actions and law logic.

## Army Deploy behavior

Click Army panel → opens existing Deploy workflow with **originating army fixed** → player selects among **currently legal target regions** (possibly multiple regions where current engine allows), and reports existing physical commitments and results. Reuse existing legality, computed target strength, regional unrest, local alliances, one-time loot, rout/exhaustion outcomes, Army-home restriction, narrative-on/off parity, progress/reload and Undo/Redo. Do not implement a separate calculator or change physical game rules.

The selected region on the map is independent of opening the Army dialog; selection is optional for map highlight/inspection. Preserve legal-target explanations and current target multi-selection support. When choosing a target, it may be highlighted, but never mutate region selection/campaign state during an uncommitted preview. The Army cannot silently change when targets change.

## Special Envoy action-first reporting

Click Director panel → Special Envoy modal:

1. **Planning choice**: Open Order in India (choose a particular **closed** order in a **non-Company-controlled** region) **or** open trade with China (create Superintendent of Trade in China, if not already enabled). This choice is **provisional UI input**; it is not the legally irreversible effect selection.
2. Present relevant rule instruction: physical Special Envoy check; each £1 spent gives one die, **no penalty**, and action may be attempted repeatedly (PDF printed p.18). App does not roll physical dice, debit an untracked treasury or decide success.
3. Player reports **Success / Failure** after rolling.
4. On **success**, validate the planned choice again at commit and report its actual legal effect. On **failure**, neither an Order nor China office opens.
5. Display result/instructions, then let player dismiss. On cancel before commit, no action history or narrative advice memory.

**Important rules mismatch handled deliberately:** The official rules permit the player to decide which effect of a *successful* Special Envoy check to perform **after** seeing success. The user's app workflow chooses an intended effect **before** reporting the roll solely as a UI/reporting convenience; it must **not** reduce physical-game choice rights. Before confirming a reported success, users can change the planned effect/target (or use another legal effect). No mechanical effect from pre-roll selection. Do not assert the game formally requires advance declaration.

Open Order: Only a specific **closed** Order in a region India not controlled by the Company can be opened by Special Envoy (PDF p.18). Show/order spaces according to existing model, including multiple orders per region, if tracked. The sample p.18 explicitly forbids opening a second Bengal order because Bengal is Company-controlled.

China via Special Envoy: This **creates the Superintendent office**, not an immediate China trade check, shipment or opium gain. Office may also be created by the **Envoy to China** law. If already created, don't offer duplicate office creation. Respect existing model effects. Following Special Envoy the Director can make up to two writer/ship transfers under actual rules; these physical components remain untracked—show instructions, don't invent registry state.

## Separate Superintendent of Trade in China action

**Not the same button/effect as Special Envoy.** The Superintendent acts **after the Presidency of Bengal**. The actual Trade in China check uses one die for each ship in Superintendent treasury, at most once per action opportunity, and is impossible with **zero opium icons in Company-controlled regions** (PDF p.25). The project currently only tracks Superintendent activation and opium availability/potential proceeds; **actual China check outcome, ships and finance are not tracked**. In 09C-1 keep existing table instructions and present read-only opium information. Do not add a fake Success/Failure special-envoy result which purports to resolve China's separate action. New Superintendent-resolution reporting would require its own separately approved scope.

## Preview, saves, debugging, visual acceptance

- User actions are touch-friendly, with buttons and plain descriptions; avoid mandatory numeric typing and fragile dropdowns.
- Reuse the shared action logic in `dist/`; `dist/` is source, not build output.
- Uncommitted configuration, region highlights and cancellation must not consume RNG, save partial historical incidents or trigger adviser memories.
- Preserve current resumable behavior after genuine committed effects/reveals, undo/redo, save/import/export/snapshots and debug/regular isolation.
- Tests: for each Army check launch/fixed origin, legal and illegal targets, multi-target handling, target strength, success/failure, cancellation and reload; for Director verify India non-Company closed order, China activation only on success, failure changes nothing, success change-of-plan permitted, repeated attempts, no duplicate activation; Governor actions still available in region; Governor General law doesn't leave misleading active Director; desktop/tablet and narrow layout no obstruction.
- Preserve event/Shuffle, political outlooks, prior saved thoughts, narrative mechanics, 275-test reported baseline (rerun independently). No hosted Site deployment.

## Follow-on contracts, not authorized by this UI task

Dedicated Army adviser NPCs and a persistent Director's Secretary/China assistant are future 09C narrative; adviser history/voice in 09D. Do not invent biographies or approved quotations now. UI may include a stable, unobtrusive placeholder for future counsel but no unapproved production text.
