# Persistent Character Engine — Milestone 1 implementation

26 October 2026. Implemented **Milestone 1 only** of `character-engine-milestone-plan.md`, after pulling `main` at `60870bb`. The existing engine remains the foundation. No fate generator, succession, births, marriages, returns, impostors, new NPCs, player controls, portraits or new fictional production dialogue.

## Persistent contract

`condition` remains canonical: `alive`, `exiled`, `presumed-dead`, `dead`, `missing`, `imprisoned`. Public labels are **Alive**, **Exiled**, **Presumed dead**, **Confirmed dead**, **Missing**, **Imprisoned**. `dead` is confirmed final death. Presumed death contains no stored survival decision; no new hidden fate boolean exists. Known survivor exile and unresolved presumed death remain distinct. Neither label makes someone a current ruler.

The optional narrative-only extension is:

```js
politicalRole: {kind: 'company-dependent-ruler', region: 'bombay'},
conditionHistory: [],
politicalHistory: [{
  from: {kind: 'sovereign-ruler', region: 'bombay'},
  to: {kind: 'company-dependent-ruler', region: 'bombay'},
  turn: 1,
  source: {incidentId: 'incident-1', actionType: 'deploy'},
  reason: 'Recorded regional control or allegiance changed.'
}]
```

Life transitions use the same provenance/turn/reason shape with string `from`/`to` conditions. Normal sources refer to existing canonical incident IDs/action types. Debug setup sources use their existing canonical history index plus `actionType: 'correction'`; the UI labels them Debug setup. Removing/reindexing a supporting Debug entry is blocked, rather than retargeting its reference. Readers never generate records.

The political-kind vocabulary includes sovereign/vassal/Company-dependent ruler, regent, claimant, former ruler, family member, recognised heir, minister, court member, institutional secretary and Army adviser. It can be extended deliberately in later milestones. The existing `role`, `position`, `region`, `claims` and `n.seats` remain compatible; this milestone does not move seats or treat a political label as mechanical authority. The original generic younger sibling is **family-member**, not retroactively a recognised heir or child.

New campaigns initialize empty histories and the current role without changing any cast-generation RNG call. All **23 existing identities**, eight seats, names, regions, ages, family links, claims, traits, relationships, memories and exact saved words remain intact. Existing committed map-control/allegiance position changes now also record the same person's role change under that actual parent incident. No status/role record modifies the incident's mechanical facts or result. Base ruler transitions are checked against the source incident's actual before/after regional control. Preconfigured/stale empty metadata cannot make an unrelated later action appear to have caused a role change. Explicit future roles such as regent are not overwritten by ordinary strength/unrest changes. Debug edits retain setup provenance, without fabricated battles or fates. Repeated processing does not duplicate role records.

## Validation and presentation

Enums, known regions, source references/action/turn, chronological continuous transition chains and final current statuses are validated. Each transition history is limited to 1,000 entries; personal incident lists are bounded at 10,000, unique, and retain existing canonical-reference checks. Character IDs still must match their unique catalogue keys. Future family schemas/constraints are not introduced.

Only an existing alive character with a compatible ruling role can occupy an active seat. Confirmed-dead and otherwise unavailable seats are rejected; no automatic replacement is attempted. Confirmed death cannot transition to any other condition. A commit-boundary continuity guard also rejects resurrection if a caller removes the history array. Undo/Redo and restoring an earlier backup can restore the earlier timeline; they are not new in-story resurrection events.

Existing roster/search, regional summaries, dossiers and readable character appendix display the clear condition labels. Explicit claimant/former/regent roles can be displayed independently of legacy character categories. Dossiers and readable export show only actually recorded role/life transitions with expandable source provenance. Existing campaigns without transitions get no invented historical section. Reads, searches and dossier opening do not mutate state or consume RNG. No fate editor or new management controls.

## Compatibility / migration decision

**Narrative version remains 2; no migration and no backfill.** All three extension fields are optional. Missing histories mean no recorded transitions; missing political role is a pure view of the existing category, position and seat. Loading, validating, importing, displaying and re-exporting a valid old current-version save leave it unchanged, including quoted text and protected-progress fingerprints. Only a later actual role change records its new evidence. New game initialization does not invent earlier episodes.

Current autosaves, snapshots, JSON import/export, Undo/Redo and regular/Debug isolation use the existing transaction/storage machinery. Existing incompatible earlier development formats retain their prior rejection policy. A previously hand-edited save placing a dead/missing/imprisoned/exiled/presumed-dead character in an active seat now fails the explicit seat invariant, with a character-history error; the app does not revive the character or invent a successor. Production previously generated no such fate changes. Two old synthetic tests were updated to use an explicit test-only seated sibling or non-seated family member instead of an invalid dead/incapacitated active ruler.

## Verification

**418 automated tests pass, 0 fail** (400 baseline + 18 focused tests). Coverage includes all six public statuses, original 23-person cast, unchanged sibling semantics/RNG, old current-schema saves, saved exact words, real role-change provenance, invalid identity/enum/source/chain/seat/secret-fate rejection, irreversible death, +3 ageing once for every non-confirmed-dead condition, exact Undo/Redo, Debug idempotence, named deletion blockers and earlier-turn staging. Existing full-campaign gameplay parity and all 81 exact approved scenes/automatic presentation tests pass.

`scripts/check-character-engine-browser.cjs` passes Chrome **156.0.8078.47**, **1440×900** and **1024×768**, regular/Debug and standard/quiet, plus Normal without a cast: legacy roster integrity, all test-only status dossiers, source history, no future-return disclosure, state-inert reads, reload, actual JSON download/import, snapshot restore, real Army conquest, role-history display and exact Undo/Redo. Screenshots inspected; no page errors or horizontal overflow, and modal heights remain inside the viewport. Existing 09E, M2, counsel and resolution browser suites pass; M2 additionally covers **1440×1000** and **390×844** and protected roll/progress restoration.

The initial new browser runner tried to use Undo from the register, where the existing toolbar is hidden. The runner was corrected to return to the map; application navigation was not changed to accommodate it.

See the [small before/after and test-only status demonstration](character-engine-m1-demo.md) and [verification record](character-engine-m1-verification.json).

## Deferred

No gameplay generates new life statuses. Future fate writers must explicitly record truthful status transitions at a committed event and atomically reconcile any active seat; a lost battle is not a fate decision. Succession, richer family models, restoration probabilities, uncertain-survival reveals, impostors and later political-role systems need their own approved milestones. Existing **+3 ageing once per New Turn** remains unchanged, including presumed-dead/missing/exiled/imprisoned characters; that arithmetic is not a hidden survival verdict. Existing narrative selection, current saved dialogue and all 09E automatic scene flows are unchanged. No hosted Site deployment.
Implementation commit: `0b58dabee8989664a8a93fc2dc1b8272a75a1fa9`.
