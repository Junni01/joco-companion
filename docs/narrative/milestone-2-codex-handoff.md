# Milestone 2 — Codex implementation-plan amendment: development-only persistence

**Decision date:** 24 October 2026. **User-approved scope change.**
**Applies to:** [Approved Milestone 2 specification](milestone-2-political-memory.md) and the proposed `John-Company-Milestone-2-Implementation-Plan.md` supplied for review.
**Status:** Authoritative implementation-planning correction, **not** a go-ahead to edit application code.

## Decision

We are iterating an experimental companion, not maintaining a stable production save format. **Stop spending Milestone 2 development time migrating old campaign files.**

Keep simple **same-version** autosave, named snapshots, JSON export/import, current-version reload and full in-memory/persisted Undo/Redo. Preserve a revealed tile, committed die roll and instruction progress in the **current** version so play/testing is not disrupted. Do **not** guarantee that files or snapshots written by M1 or another development schema load under the new M2 schema. Reject incompatible files with clear messaging; avoid deleting or overwriting them automatically.

The long-term requirements for safe stable-version upgrades remain deferred rather than cancelled. Narrative/game-state transactional consistency and authoritative historical truth **remain mandatory**.

## Required changes to Codex's proposed plan

| Original plan element | Revised instruction |
| --- | --- |
| §1 `narrative-state.js` “pure migrations” | Build current-version schema validation/reference integrity; **no cross-version migration module**. |
| §1 `app.js`, `action-progress.js`, `transactions.js`, `save-frames.js` “integrate migration” | Integrate only current-version state/progress and Undo/Redo, simple version rejection and existing autosave/import/export if retained. |
| §5 “Migration and compatibility strategy” | **Replace entirely** with development-only persistence; no preservation or backfill of M1 characters/scenes, old fingerprints, old frames or stale historical references. |
| §6 Step 2 “Compatibility foundation” | **Remove** migration-first dependency. Implement M2 memory/evidence contracts and a visible playable vertical slice early. |
| §7 “Migration” test row | Replace with current-schema save/reload/Undo/Redo/snapshot/export tests and one clear **incompatible-old-save rejection** test. |
| §8 “Historical memory backfill” decision | **Closed for M2:** No backfill, because old-format migration is out of scope. |
| §8 “Debug history deletion” | Still a live current-version evidence-integrity question. Prefer blocking deletion of referenced current-version incidents or safe equivalent, without building legacy-repair logic. |
| §8 “Initial tuning” | Still a design/tuning proposal requiring explicit review before locking numeric defaults. |
| §8 “Meaning of direct” | Maintain prior proposal: directly affected by the political outcome, **not eyewitness attendance**. |

## Revised delivery order

1. Confirm the current-version memory, fact-reference, relationship and statement contracts, plus facts/guardrails.
2. Deliver the first visible story loop: conquest → memory/grievance → relevant tax/intervention → grounded callback → dossier evidence.
3. Test exact current-version Undo/Redo, autosave/reload and committed-progress recovery for that loop.
4. Expand the mandatory military, political and administrative event families.
5. Expand personalities, salience, reasons, statements, pacing and short exchanges.
6. Complete dossiers/printable traces; test all four scenarios and examine representative story output with the user.

This does **not** relax gameplay/narrative equivalence, saved-word determinism, undo branch integrity, dialogue fact checking, input validation or escaped UI output.

## Communication to Codex

> The user approved **development-only persistence**. Please revise your implementation plan to remove old-save migration, old Undo/Redo-frame migration, old fingerprint rebasing and historical backfill. Keep current-schema autosave, snapshots, JSON import/export, Undo/Redo and protected roll/reveal progress. An incompatible older save may be rejected with a clear message and left untouched. Replace the migration-first phase with the earliest useful narrative vertical slice. Maintain current-version validation, evidence integrity and gameplay equivalence. **Do not edit application code until separate implementation approval.**

Approval of the technical plan and authorization to implement are separate decisions.
