# Collection 07 multi-turn review

Synthetic campaigns for narrative review by the user and ChatGPT. No personal saves. Start with [dialogue traces](dialogue-traces.md), which include exact words, stable IDs, prior political posture, evidence, relevant-incident clocks and thematic chapters.

- [proud-grievance](proud-grievance.html) · [JSON](proud-grievance.json) — 5 turns, 5 actual stack draws, final derived posture hostile.
- [cautious-resistance](cautious-resistance.html) · [JSON](cautious-resistance.json) — 5 turns, 5 actual stack draws, final derived posture hostile.
- [reconciliation](reconciliation.html) · [JSON](reconciliation.json) — 5 turns, 5 actual stack draws, final derived posture aligned.
- [late-company](late-company.html) · [JSON](late-company.json) — 4 turns, 4 actual stack draws, final derived posture hostile.
- [mid-company](mid-company.html) · [JSON](mid-company.json) — 5 turns, 5 actual stack draws, final derived posture hostile.

All campaigns reach their scenario's real final turn and scoring, using actual phase and Parliament resolvers. Initial personalities are declared, manual events explicitly labelled, and physical outcomes supplied as fixture inputs. The no-storm foreign-event result and phase storm face are controlled test inputs, not newly generated narrative outcomes. The reconciliation campaign tests an experience-based change; Company control or a core loyalty trait alone never means Company alignment.

[Coverage](coverage.json), [technical report and deferrals](../../collection07-implementation.md). A [pre-defence checkpoint](before-hostile-defence.json) supports isolated browser verification.

Review continuity across turns, differing political responses, callback gaps and repetition, chapter usefulness and remaining neutral/older lines. Passing tests does not grant narrative-quality acceptance. Regenerate with `node scripts/export-collection07-review.mjs`.
