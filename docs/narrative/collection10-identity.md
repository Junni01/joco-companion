# Collection 10 — Character Identity and Historical Colour

**Status:** Approved design direction / pipeline backlog, **not authorized for implementation** (25 October 2026).  
**Motivation:** Current demonstration uses region-formula names such as “Jalal of Delhi” and “Madhav of Bombay.” This reads as a game label rather than an independent person; a ruler's name should survive political change. Company personnel likewise need distinctive personal identities and the potential to reference real history without being confused with actual player officeholders.

## 10A — Distinct fictional identities (proposed first delivery)

- Generate **fictional** but culturally, geographically and period-plausible **full personal names** for regional rulers and fictional Company advisers, officers and secretaries. No need to force a real historical ruler's personality/biography into the game's alternate history. Never use the same generic `X of Region` name constructor.
- Research naming **forms** and regional variation for scenario dates and political contexts rather than mechanically combining a stock given name, suffix and title. Persianate court titles, Maratha, Sikh, Mysore and other regional traditions should not be flattened into one template. Titles are not interchangeable, and examples require historical review.
- Persist distinct fields: **stable character ID, full personal name, optional alias/familiar name, house/family where established, political title/style, office/rank, associated region, and separate personal/political status**. The same person survives conquest, subordination, dismissal, exile and restoration. Office/rank is not part of their immutable personal name.
- For Company personnel, keep fictional institutional advisers separate from player-controlled Governors, Commanders, officeholders and actual historical figures. Preserve named advisers' ongoing personality and memories across relevant career changes.
- Maintain credible name variety without accidental duplicate identities or historically inappropriate combinations. Don't implicitly infer religion, loyalty, intelligence, disposition or morality from name or community.
- **Existing campaign safety:** Do not silently rename saved characters in ways that contradict their historical dialogue, identities, references or memories. Propose an explicit current-schema compatibility plan for review; prefer preserving existing characters and their exact spoken lines. If a current campaign can safely receive a non-destructive enhanced display name, it must remain stable and inspectable. No unsupported retrospective rewrite of past statements.
- Include dossiers, roster, selected-region panel, dialogue labels and chronicle/export in acceptance tests; authored event templates should use the appropriate supported title or short reference when natural, not repeat formal full names in every utterance.
- Keep narrative mechanics, public forecasts, save size, scenario starting facts, narrative RNG separation and Undo/Redo intact. No art or portrait requirement.

## 10B — Historically grounded fictional biographies and anecdotes (later writing/design delivery)

- Provide each **fictional** Company character a small, optional, stable background sufficient for human voice and career allusions (for example prior service, provincial postings, administrative interests or dubious boasts). Do not invent family/player officeholder histories.
- Real historical people and events may be named **only** when appropriate to the campaign's historical reference frame. Example inspiration: a fictional officer remembering the **Battle of Plassey (1757)** or comparing themselves to **Robert Clive**. This is not an approved verbatim dialogue line or automatically valid in every scenario.
- **Chronology and age:** An actual veteran claim requires a plausible birth/age/service trajectory and scenario date. A 1710-starting setting must not casually refer to Plassey as accomplished history. The app's three-years-per-turn narrative ageing is *not an exact calendar*, so establish a deliberate scenario/historical-reference eligibility policy before adding date-specific references.
- **Alternate history and provenance:** Real events outside the demonstrated campaign may be suitable as external historical background only when the chosen reference policy makes them possible and doesn't contradict recorded game history. Never silently assert that a game-unrecorded battle, player appointment, personal deed, award or payment happened in this campaign.
- **Unreliable narrators:** Officers may exaggerate or boast, while secretaries can cast doubt on a claim. Record whether a purported personal experience is a supported fictional biography fact, openly subjective opinion, or a specifically established lie/exaggeration. Another character must not magically know that a private boast is false; contradictory dialogue requires supported shared statements/knowledge.
- Temper anecdotes by competence, vanity, caution, ambition and experience. Some advisers are sober and capable; do not make everyone an absurd careerist. Use dry historical political satire and rare callback-worthy lines, not constant historical name-dropping.
- Historical research, editorial examples and approved wording are required **before** content integration. Do not treat this backlog as a mandate to fabricate full biographies, random real-historical acquaintances or new campaign facts.

## Recommended order / dependency

1. Complete **creative review of 09A/09B** thoughts (see `collection09-demo.md` and `collection09-implementation.md`). Engineering status: 261 tests reported passing; creative wording pending.
2. Implement **09C/09D** when separately authorized: pre-action counsel, contradictions, dialog location, committed advice and callbacks. Consider character naming contracts so the next work will not hard-code region-formula speaker identities.
3. Implement **10A** after a focused implementation authorization and research of naming forms. 10A may be advanced before 09C/09D if judged valuable, but avoid unreviewed broad restructuring.
4. Develop **10B** historical background policy, source examples and writing; integrate only after separate human creative approval.

## Definition of ready for 10A implementation

Research/approve region-appropriate name patterns, define stable-name fields and current-save policy, inspect actual cast generation, and establish UI/export/name collision tests. Keep first change focused. For 10B, research references and settle historical calendar versus alternate-history policy first.

**Not in scope now:** implementation, narrator rewrites, succession/fate expansion, real historical officers replacing fictional cast, automatic historical battle insertions, UI portraits or Site deployment.
