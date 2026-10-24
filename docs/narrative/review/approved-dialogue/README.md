# Approved dialogue integration review

These are synthetic campaign fixtures for the user's narrative-quality review with ChatGPT. Passing technical checks is not narrative acceptance. No personal campaigns are included.

Start with [dialogue traces](dialogue-traces.md). Each line includes its catalogue ID, exact saved wording, current facts and any earlier callback source. Open an HTML chronicle for readable presentation, or import its current-version JSON into an isolated test campaign to inspect dossiers.

- [story-1710](story-1710.html) · [JSON](story-1710.json) — 5 incidents, 9 approved lines.
- [story-1758](story-1758.html) · [JSON](story-1758.json) — 5 incidents, 9 approved lines.
- [story-1813](story-1813.html) · [JSON](story-1813.json) — 5 incidents, 10 approved lines.
- [story-1710-long](story-1710-long.html) · [JSON](story-1710-long.json) — 5 incidents, 9 approved lines.
- [personality-proud](personality-proud.html) · [JSON](personality-proud.json) — 7 incidents, 14 approved lines.
- [personality-cautious](personality-cautious.html) · [JSON](personality-cautious.json) — 7 incidents, 15 approved lines.
- [personality-vindictive](personality-vindictive.html) · [JSON](personality-vindictive.json) — 7 incidents, 15 approved lines.
- [military-professional](military-professional.html) · [JSON](military-professional.json) — 5 incidents, 10 approved lines.
- [military-overconfident](military-overconfident.html) · [JSON](military-overconfident.json) — 5 incidents, 11 approved lines.
- [military-careerist](military-careerist.html) · [JSON](military-careerist.json) — 5 incidents, 11 approved lines.

[Coverage](coverage.json) lists demonstrated entries, not a guarantee that every integrated entry appears in these ten campaigns. Initial personality profiles are declared in the traces. All outcomes use actual resolvers; manual-test events are labelled.

Review continuity, individual voices, restraint, satire, and the remaining M2 fallback wording. Long exchanges, Collection 05 and unsupported prerequisites remain deferred: see [entry-level deferrals](../../approved-dialogue-deferred.md).

Regenerate with `node scripts/export-approved-dialogue-review.mjs`.
