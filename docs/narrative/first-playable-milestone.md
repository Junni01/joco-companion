# First playable narrative milestone

Implemented locally on 24 October 2026 after approval of the incremental plan. This document describes the first slice, not completion of every narrative requirement.

## Start and play

Saved games → New game offers Narrative mode On or Off alongside all four scenarios. Off is the default. Closing setup does nothing. Narrative cannot be enabled on an existing campaign. Legacy saves remain without narrative data. New regular and debug games support the same setting; workspaces retain separate storage.

On creates eight fictional local rulers, one adult sibling per ruler, six Presidency/Army advisers and a Governor General secretary. Company local rulers are distinct from physical Governors and advisers. Starting backgrounds are clearly fictional; existing scenario allegiance origins stay unknown. Characters have stable IDs, ages, traits, moods, family ties, claims, directional relationships and incident references. Names and institutions use a small provisional catalogue documented in content-sources.md.

After committing an action, Campaign voices on the map shows its saved scene. Required physical instructions, separate Elephant pages and the exposed-stack-region recap retain priority. Quiet collapses scenes; Standard shows the chronicler and up to two voices; Full expands all eligible voices. Every mode retains the same saved scenes and board outcome. Mode changes preserve pending progress and are reversible.

Region dossiers have a compact local ruler summary and profile. Campaign record includes a searchable roster with region/role filters, character profiles and thematic turn chapters. Search also matches condition, institution and dynasty. Printable HTML chronicle export includes saved scenes, chapters, silhouette placeholders, characters and allegiance episodes. Its physical chronology remains complete independently of narrative presentation.

## Covered political events

Specific reactions cover Company conquest, failed/catastrophic deployment, intervention, Company defence/loss, successful/failed rebellion, subordination, freed subjects and taxation/administration. Multi-region incidents produce one saved scene with expandable voices. Other events receive a factual summary marked as awaiting richer reactions. No extra table reporting is introduced.

Resolver-owned facts include ordered battles, loss/rout reports, subject releases, joining an empire, foreign settlement, deployment commitments and alliance participation, order changes and unrest. Each action also retains actual regional before/after changes, Elephant and law context. Scene processing reads these facts, not English reports. Incident IDs use a saved monotonic sequence; debug history clearing does not reuse IDs.

The deliberately conservative first slice retains local incumbents across control changes. It preserves compatible allegiance episodes and updates political positions, without inventing a prior conquest at setup. Rejoining creates a new episode. No random deaths, natural succession, weighted replacement, exile/restoration generation, foreign client careers, dynamic dynasty expansion, titles, treasure stories or advanced arcs are implemented. Claimant identities are represented by records but no restoration branch is generated yet. Existing dead/missing/imprisoned character conditions can be retained and ineligible speakers do not receive new lines.

Only a committed New Turn ages living characters by three years. Previews do not sample narrative randomness or age anybody. End game closes the current chapter without adding unplayed years. Heir/successor generation and mortality remain deferred as approved.

## Persistence and transactions

The campaign's optional `narrative` section is independently versioned. Narrative processing occurs only in the application commit boundary, after the gameplay resolver has produced a result. It works on a clone, never mutates the physical-game state and uses a saved independent PRNG. Selected words, template ID, speaker identity, expression and incident references are saved. Reopening and exporting do not regenerate them.

Undo frames retain whole campaign state and protected action progress. Redo restores the exact saved state/progress, rather than rerunning a resolver. Redo is included in autosave, snapshots and JSON exports. A new committed branch clears it. Existing protection for revealed tiles, rolls and instruction cursors remains. Display changes and renaming carry/rebase pending progress rather than losing it.

The JSON wrapper stays version one with additive optional fields. Legacy files without narrative, Redo or incident sequences remain readable. Current state, narrative and pending progress are preserved when fitting the 6 MB UTF-8 backup cap; optional Redo frames are pruned first, then oldest Undo frames. Each frame is serialized once to avoid repeated large stringification. An oversized current campaign is rejected with the existing backup guidance. Browser storage may have a lower quota; the existing Not saved warning still applies.

Debug setup corrections update current political descriptions and unknown allegiance provenance. They create no conquest scenes, deaths, grievances or promises. Debug reset starts a new setup; regular storage stays untouched. Debug save imports remain rejected in regular play.

## Verification

Run `npm test`. Narrative regressions cover all scenarios, legacy round-trips, previews, exact scene persistence, mechanical equivalence, conquest/Undo/Redo, capital release, allegiance episodes, failed rebellion, multi-target foreign attacks/routs, once-only ageing, ending, quiet presentation, safe export, malformed saves and larger histories. App-control tests cover setup cancellation, narrative activation, deployment, profile/roster, mode changes, reload, Redo and branching. Browser verification results are recorded in the current-status handoff after execution.
