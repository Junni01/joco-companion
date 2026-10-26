# Long-term narrative simulation vision — companion now, potentially standalone later

**26 October 2026 — user direction / architectural principle.** The project must preserve the rich, occasionally very rare narrative possibilities we've explored, even if an event happens roughly once in a hundred short board-game campaigns. These are worthwhile because a possible future *full game experience* will have more turns than John Company 2E, allowing relationships, lineage, claims and rare incidents to accumulate over time. This is a future design horizon, **not** authorization to expand Codex's current Milestone 2A implementation.

## Two distinct experiences, shared narrative foundation

1. **Physical John Company companion (current product):** the printed board-game resolver provides authoritative control, conflicts, events, armies and outcomes. Narrative is causally grounded in committed results, never secretly changes dice, legal actions or territorial control. Short scenarios may never trigger rare arcs, and should not artificially raise their frequency to show off the writing.
2. **Possible full standalone simulation (future):** a longer timeline with many more turns and potentially independent political/military/economic resolvers. That game could supply compatible authoritative incidents to the same persistent character, history and storytelling systems. Details, rules and scheduling of the standalone experience are **not** settled.

## Architectural direction

- **Save ideas without scope contamination.** Keep a forward-looking feature catalogue of rare/advanced arcs with status, prerequisites and original user decisions. An approved idea is not automatically permission to implement it now.
- **Event records precede prose.** A consequential narrative execution, exile, succession, marriage, betrayal, pardon, impostor claim or restoration should be represented with persistent actor IDs, affected people, region, turn, provenance and outcome; dialogue is selected from and refers to that record. Do not falsely imply physical casualties from a battle result.
- **Separation of concern:** board-game mechanics or a future standalone resolver supplies authoritative outcomes; narrative interprets them and models character-only consequences. Avoid hard-coding the character engine to John Company event-tile names if a stable domain incident category suffices, while preserving source provenance and strict game-rule boundaries.
- **Character stories should compound.** Long campaigns can sustain ageing, dynasties, inherited grievances, recurring pretenders, loyalty changes, restoring deposed rulers, and rare presumed-dead survivors. Preserve consistent identity across these arcs, with bounded storage and inspectable history.
- **Rarity is intentional.** A highly unusual arc occurring only in very few companion campaigns is acceptable. Evaluate probability and payoff over long simulated campaigns separately; don't increase short-game occurrence artificially.
- **No unnecessary player-management UI.** In the companion, families and narratives progress automatically at legitimate committed triggers; future independent game interactions can be considered on their own terms.
- **Modular delivery.** Keep approved Milestone 2A constrained to family links/claims. Follow with succession/regency, relationship-driven conquest settlement, Peace/Leader integration and advanced returns only after separate design/technical review.

## Candidate rare arcs to preserve

Presumed-dead ruler's genuine return; distinct recurring impostor claimant; blood-feud conquest leading to deposition, captivity, exile or exceptional execution; appointment of a murdered predecessor's sibling as resentful vassal; multi-generational inherited enmity; daughter inheriting with adult widow-regent; exiled house's eventual restoration; a formerly loyal vassal growing disillusioned after an imperial succession; imperial breakup releasing mutually opposed former subjects; rogue Company-dependent ruler reversing alliances only on a compatible actual political outcome.

## Non-decisions

This document does not establish the standalone game's rules, length, technology, simulation time scale, numerical occurrence rates, production release schedule or any UI. Neither the actual John Company game mechanics nor Codex's currently running M2A task should be altered on the strength of this longer-term vision.
