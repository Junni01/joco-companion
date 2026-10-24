# Narrative implementation review and agent handoff — 24 October 2026

**Status:** Review findings and proposed follow-up, **not** approval to implement everything below.
**Reviewed repository:** `Junni01/joco-companion`, first playable narrative milestone merged on 24 October 2026.
**Primary authority:** [Narrative requirements](narrative-requirements.md) (NR IDs) and [first playable milestone](first-playable-milestone.md). This page does not supersede either.
**Review method:** Static source/test inspection. The handoff reports 145 passing automated tests and browser checks, but this review did not independently execute them.

## Assessment

The first playable milestone substantially meets its *limited* agreed scope. Keep its foundation; do not rewrite it. Present functionality includes new-campaign-only activation; fictional, persistent rulers/advisers; clearly identified fictional pre-campaign backgrounds; committed structured incidents and saved scenes; independent narrative RNG; narrative-on/off rules separation; a generic silhouette; basic roster/dossiers; chronological history and thematic chapters; and shared save/Undo/Redo.

**Do not conflate milestone acceptance with completion of the full narrative vision.** Advanced features explicitly deferred in `first-playable-milestone.md` are planned work, not first-milestone defects.

## Specific review findings

| ID | Finding | Evidence | Requirement | Status |
| --- | --- | --- | --- | --- |
| REVIEW-01 | Exile is not modelled as a structured political standing with refuge/protector/claim links yet. **Per NR-011, exile should be a political standing, not necessarily an additional personal condition**; existing personal conditions are correctly distinct. | `dist/narrative.js` `validateNarrative`, character condition check | NR-011, NR-018, NR-042 | **Proposed compatibility improvement** |
| REVIEW-02 | Traits are assigned initially and used to select a few lines, but committed experiences do not gradually change core traits or confidence. Mood changes with spoken lines only. | `dist/narrative.js` `createNarrative`, `choose`, `commitNarrative` | NR-013 | **Planned phase**, not initial-slice regression |
| REVIEW-03 | Relationships have persistent dimensions but current updates mostly add fixed hostility/familiarity. Advisers and rulers have no substantial evolving mutual history; dynastic grievances and reconciliations are absent. | `dist/narrative.js` `relate` and incident handlers | NR-014, NR-021 | **Planned phase** |
| REVIEW-04 | Template selection largely considers the current event and a trait threshold; it does not consult earlier incidents, saved statements, relationship origins, claims or ongoing arcs for callbacks. | `dist/narrative.js` `choose` and reaction loop; `dist/narrative-content.js` | NR-015, NR-023, NR-032 | **Recommended next narrative milestone** |
| REVIEW-05 | Rulers/siblings/advisers persist, but no generated succession, expanding dynasty, adviser career, weighted fate, exile/return or foreign expedition leader is active. The milestone document already declares these deferrals. | `docs/narrative/first-playable-milestone.md`; `dist/narrative.js` | NR-012, NR-016–018, NR-021–023 | **Explicitly deferred** |
| REVIEW-06 | Chronicler text is currently mostly factual; little adaptive dry irony, tragedy-sensitive seriousness or administrative satire. | `dist/narrative.js` summaries; `dist/narrative-content.js` | NR-030, NR-034 | **Content refinement**, after grounded memories |
| REVIEW-07 | User-selected character art direction is one stable character identity with expressive emotions, **not** mandatory young/mature/elderly portrait sets. A single shared silhouette remains correct for this milestone. | `dist/narrative-ui.js`; NR-040–041 | NR-040, NR-041 | **Correct as implemented; preserve** |

### Recommended next milestone: Persistent Political Memory

This is a **proposal for user approval**, not a blanket implementation instruction.

1. **Grounded memories.** Save structured personal interpretations of selected actual incidents, distinguishing a canonical event from a character's viewpoint. Memory entries reference stable incident and speaker IDs. Do not invent observed facts.
2. **Meaningful relationships.** Update directional respect, hostility, gratitude, mistrust and familiarity from supported incidents; introduce careful adviser–ruler interactions. Include reasons and retain asymmetry.
3. **Contextual dialogue.** Select occasional previously saved, relevant memories and quotations when authoring new lines. Respect who could know what. Prioritise grounded callbacks over generic templates while retaining neutral fallbacks.
4. **Gradual development.** Change core traits modestly only on significant experiences; vary mood/confidence more responsively. Never change board rules, dice or event choices.
5. **Chronicler refinements.** Add restrained ironic and administrative commentary with serious treatment of tragedies. Keep the chronicler factually reliable and anonymous.
6. **Validation and tests.** Verify exact replay across save/load/Undo/Redo, idempotency, long campaign sizes, no narrative RNG draw on previews, mechanical equivalence for all four scenarios, and that callbacks cannot cite undone or future incidents.

**Illustrative fictional example, not a required literal line:**
- First loss: “The Company has taken control of Bombay. We shall discover what remains of our authority.”
- After *three actually recorded* failed attempts to reverse the loss: “This is the third occasion on which the Company has assured us the matter is settled.”

The second line must be ineligible unless the supporting events exist in the saved authoritative record. A character's *interpretation* can be partisan while the chronicler's *facts* remain correct.

### Suggested small preparatory change

Review a structured **political exile status** now (separate from personal conditions such as alive/dead/imprisoned), with optional refuge, protector and claim references, validation, roster display, ageing semantics and legacy-save compatibility. **Do not** generate exile, death or succession until the corresponding planned milestone is approved. A living exile may speak when narratively appropriate; a dead or imprisoned character must not inadvertently be treated as a free active ruler.

## Preserve the already approved decisions and deferred alternatives

The requirements ledger remains authoritative, including the choices about activation, regional fictional naming, dynamic dynasties, weighted fates, political exile, inherited-but-not-identical feuds, adaptive chronicler, persistent advisers/foreign expeditions, expandable dialogue, thematic chapters, stories/arcs, treasures, titles, dossiers, printable final chronicle, and unified transactions. **Do not discard their recorded alternatives.** Future portraits should prioritise expressive variants over age variants. The anonymous chronicler needs no portrait.

Never change the physical John Company rules to satisfy a narrative desire. No player-family/officeholder database, finance ledger or Army inventory; no fabricated historical quotes, motives, officer deaths, realised China trade, ship sinkings or witnessed campaign events.

## Agent-to-agent handoff protocol

Use repository files as durable project memory instead of assuming that ChatGPT, Codex and future agents share a conversation.

1. **Decisions:** Modify `docs/narrative/narrative-requirements.md` only for user-approved changes. Keep NR identifiers stable; record accepted choice, reason and deferred alternatives. Do not silently turn suggestions into decisions.
2. **Implementation facts:** Update `docs/narrative/first-playable-milestone.md` and `docs/current-status.md` only when the code and verification support the statement.
3. **Review findings/backlog:** Record new feedback here or in dated follow-up documents with IDs, status (`proposed`, `approved`, `implemented`, `deferred`), evidence, acceptance criteria and related NR IDs.
4. **Work packets:** Give Codex a precise set of approved review IDs/NR IDs. Before coding, inspect `AGENTS.md`, requirements, current code and tests. Keep change scope small and add regression coverage. Report commit SHA, what was implemented, verification results and remaining differences.
5. **Review loop:** A second agent checks the resulting commit against the same requirements and tests. Corrections become new review findings, not undocumented chat-only agreements. Prefer PRs for substantial changes; do not overwrite unrelated repository work.
6. **Source material:** Publisher rules and card material are references for mechanics; use the repo's rules audit and approved corrections. The separately provided PDF attachments are **not** being copied into git by this handoff.

**Proposed execution order:** (a) validate current tests/UI in a clean checkout; (b) decide whether to approve REVIEW-01 preparation; (c) approve and implement a small grounded-memory slice (REVIEW-03/04); (d) incrementally expand personality/chronicler/content; (e) return to postponed dynasty, exile/restoration and foreign arcs. Each phase must remain playable.
