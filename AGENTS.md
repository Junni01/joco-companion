# Agent instructions

Read README.md, docs/current-status.md and relevant tests before editing. For debug work read docs/debug-mode.md; for rules read docs/buried-giant-rules-audit.md and verify the actual source. Do not depend on chat memory.

## Architecture

Dependency-free static browser ES modules. `dist/` is source and deployment root, not disposable build output. No build step. Run `npm test`; serve `dist/` over HTTP for UI checks. Keep state validation and rules in shared modules (`model.js`, `actions.js` and related modules), used by regular and debug mode. Do not create a parallel debug rules engine.

## Product decisions

- Physical-game assistant: no player-family database, officeholder identities, financial ledger or Army/ship inventory. Ask players for untracked results.
- Regular actions follow game logic; arbitrary board editing belongs only in debug mode.
- Touch first: use selectable buttons, numeric increase/decrease controls and explanations for disabled choices. Avoid dropdowns and mandatory numeric typing.
- Closing an untouched dialog forgets it. Preserve resumable progress after a reveal, roll or consequence that must survive reload. Never reroll saved results.
- Every Elephant movement has a separate instruction page. Show the newly exposed stack region after an event.
- The **first playable narrative slice is implemented**, but full narrative mode is still incremental. Do not expand it during unrelated functional changes. Narrative cannot change board rules or consume rules randomness.
- For narrative work read `docs/narrative/narrative-requirements.md` (approved NR decisions), `docs/narrative/first-playable-milestone.md` (implemented scope), and `docs/narrative/implementation-review-2026-10-24.md` (review findings and proposed work). Review suggestions are **not** automatic authorization to implement deferred features. Preserve the alternatives in the requirements ledger.

## Rules and persistence

- Publisher rules and explicit corrections outrank the alpha official app. WIP omissions alone do not repeal PDF rules; see the audit.
- Maratha loot is £3 (user-confirmed board correction). Loot is consumed only on first Company conquest; Indian conquest does not consume it.
- Foreign invasion resolves all primary attacks before one secondary unrest rebellion sequence. Avoid duplicate regional checks per event and do not refresh physical Army pieces between battles.
- New invasion tower strength is half the raw invasion d6 rounded down, excluding unrest/Sepoy modifiers.
- Preserve scenario-specific starts, turn ranges and office activation. Standing is not a tracked balance: derive losses and show cumulative penalty instructions.
- Preserve old saves, Undo, snapshots, history and pending progress through migrations/defaults.
- Regular/debug storage is separate; regular imports reject debug saves. Copying into debug leaves regular storage untouched.
- Hosting may rewrite debug URLs to `/`. Honor `document.documentElement.dataset.workspaceMode`, not just pathname. Preserve explicit-path precedence for cross-workspace copying and debug initialization regression tests.
- Preserve all twenty event tiles, exposed region and saved rolls across draw/discard operations.

## Verification and delivery

Run `npm test` after code edits; add meaningful regression coverage for rules/persistence bugs. UI changes need regular/debug entry checks and relevant complete action, cancel and reload flows. Report unavailable browser verification honestly.

Update documentation when behavior changes and distinguish implementation from proposals. Never commit credentials or personal campaign exports. Never force-push or replace existing remote history in routine work. Verify pushes/deployments before claiming success.
