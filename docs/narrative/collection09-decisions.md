# Collection 09 — Decisions, authority, deferrals

**Record date:** 25 October 2026. **Authority:** User's decisions in design conversation; technical implementation remains subject to source rules and current architecture.

## Approved design commitments

- 09A forecast uses Elephant position, control/allegiance/unrest/strength, top *visible back* region, publicly revealed discards and Shuffle batches. Do not use hidden face/order. Sensible strategic assessment first; personality and competence may distort interpretation.
- 09B selected-ruler portrait thought is a **private internal monologue/assessment**, not necessarily spoken dialogue. Persistent across selections, updated only on meaningful committed developments. It may represent enduring grievance or immediate threat. It cannot become another person's knowledge automatically.
- Shuffle reintroduces known discarded event types on top in unknown order, so the next known batch creates credible anticipation. A known batch of only military crises can make advisers fear danger and ambitious rulers see opportunity. No one in narrative prose says "three crises" or names the discard mechanic.
- In-character lines and chronicler narration must be fully **in-universe**. Game terminology is for explicit player instructions, never NPC perception.
- Different fictional Company personnel can disagree; an informed cautious secretary may recommend defence while an ambitious Army officer recommends expansion/loot. Competence, experience, temperament, vanity and self-interest are independent dimensions.
- 09C planned: advice appears when opening/configuring Deploy, before resolution; cancel freely. 09D planned: physical instructions and actual event scene in resolution dialog; show reactions linked to original advice; save exact advice only when the associated action commits. Map shows persistent outlook; chronicle retains past incidents, speeches and chapters.
- Narrative cannot influence actual John Company rules, control, or a player's decision. Do not invent player motives (even if failure is advantageous to an individual player).

## Approved for *implementation now*

**09A + 09B only**, including small representative authored outlook catalogue, public-information boundary, proof against hidden deck leakage, persistence and map-region-panel display. Implementation does not imply creative acceptance of all wording. Existing dialogues elsewhere may stay where they are until dialog-placement integration.

## Explicitly deferred implementation

**09C:** Pre-action advisory UI, adviser disagreement, competence development, preview/cancel semantics, context-sensitive target counsel.

**09D:** Move existing event speeches to correct post-instruction resolution dialog; link saved pre-action advice to later action outcomes and long-term callbacks, avoid post-outcome rewriting or public/private knowledge confusion.

Other deferred features: portraits, full succession, broad new arc simulation, exhaustive predictive quips, repository cleanup, deployment, player inventory/finance/officeholder tracking.

## Open technical decisions for Codex to report, not silently override

1. How to represent the publicly known top-batch when the full deck and persistent game state already exist; ensure honest treatment across preview, Shuffle, draw, Undo and import.
2. How to persist exact outlook text and its grounded source(s) without duplicating mood/relationship data or breaking development-version saves.
3. How to handle unknown disclosure history for older *current-schema* saves: conservative fallback, never reconstruct hidden knowledge from actual deck order.
4. How to avoid churn from frequent draws without suppressing consequential changed outlooks.
5. Future 09C provisional advice selection: decide a transactional, deterministic or non-mutating plan so cancellation does not change narrative RNG, memory or cooldowns. No implementation yet.

## Definition of complete

Engineering acceptance requires regression tests and a concise demonstration; writing acceptance requires separate user+ChatGPT review. The code/prompt must distinguish designed, implemented and reviewed. No upload or deploy implied by this specification.
