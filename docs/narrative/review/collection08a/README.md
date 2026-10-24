# Collection 08A narrative review

Synthetic campaigns for the user and ChatGPT's narrative-quality review. Start with the [restoration log](restoration-log.md) to inspect the repeated-secretary issue, then [dialogue traces](dialogue-traces.md) for exact saved words, memory/evidence and changing interpretation.

- [hostile-military](hostile-military.html) · [JSON](hostile-military.json) — 5 turns, 10 restorations.
- [procedural-military](procedural-military.html) · [JSON](procedural-military.json) — 5 turns, 10 restorations.
- [diplomatic-access](diplomatic-access.html) · [JSON](diplomatic-access.json) — 5 turns, 10 restorations.
- [cooperative-commerce](cooperative-commerce.html) · [JSON](cooperative-commerce.json) — 5 turns, 10 restorations.
- [connected-cascades](connected-cascades.html) · [JSON](connected-cascades.json) — 4 turns, 8 restorations.

All games use actual actions, real event-stack/phase/Parliament progression and final scoring. Manual test events are labelled. Opening an order establishes an available opportunity, never a sale, treaty or material prosperity. Repetition experience stays with the actual character. New appointee generation is deferred; identity isolation is tested separately.

[Technical report and deferrals](../../collection08a-implementation.md), [coverage](coverage.json). Thematic chapters intentionally retain their existing format: **08B is not implemented**. Pre-action JSON checkpoints support isolated browser testing.

Regenerate with `node scripts/export-trade-review.mjs`. Passing technical tests does not grant creative acceptance.
