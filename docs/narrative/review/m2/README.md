# Milestone 2 review package

Synthetic deterministic output for joint human review. Seed 1234 is used for the four core story loops; other seeds are documented in the generator.

- [story-1710](./story-1710.html) · [current-version JSON](./story-1710.json) · 13 memories, 1 statements, 2 contextual callbacks.
- [story-1758](./story-1758.html) · [current-version JSON](./story-1758.json) · 13 memories, 1 statements, 2 contextual callbacks.
- [story-1813](./story-1813.html) · [current-version JSON](./story-1813.json) · 25 memories, 1 statements, 2 contextual callbacks.
- [story-1710-long](./story-1710-long.html) · [current-version JSON](./story-1710-long.json) · 13 memories, 1 statements, 2 contextual callbacks.
- [capital-and-rebellion](./capital-and-rebellion.html) · [current-version JSON](./capital-and-rebellion.json) · 15 memories, 0 statements, 1 contextual callbacks.
- [setbacks-and-routs](./setbacks-and-routs.html) · [current-version JSON](./setbacks-and-routs.json) · 12 memories, 0 statements, 0 contextual callbacks.

Read [the narrative traces](./narrative-traces.md) for exact saved words and callback source IDs. See [storage measurements](./storage-measurements.json) for UTF-8 save sizes and the 120-Tax stress case.

Review the sense of continuity, different political perspectives, restraint of callbacks, absence of unsupported motives/deaths, and the separation of original and current interpretations. Passing technical tests does not constitute human narrative-quality acceptance.

Regenerate with `node scripts/export-m2-review.mjs`. No network, AI service, portrait generation or save migration is used.
