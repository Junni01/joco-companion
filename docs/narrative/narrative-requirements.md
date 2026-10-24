# John Company India Companion — Narrative Mode Requirements

**Status:** Approved incremental baseline — 24 October 2026. **The first playable slice is implemented; advanced requirements remain planned.** See [implemented scope and approved deferrals](first-playable-milestone.md).
**Scope:** Four supported scenarios: 1710, 1758, 1813, and Long 1710.
**Authority:** This document consolidates the user's approved decisions from the narrative requirements review. The 22 October `John_Company_Narrative_Mode_Review.docx` retains illustrative dialogue, historical references, and numerical proposals. Read both, plus `AGENTS.md`, `docs/current-status.md`, and current JS/tests, before implementation.

## 1. Non-negotiable boundaries

- **NR-001 Board authority:** The physical board game and existing app rules determine dice, strength, money, orders, unrest, territory, sovereignty, Elephant movement, events, laws, and loot. Narrative state and choices never modify mechanics, probabilities, or available game actions. Narrative may be hidden without affecting game results.
- **NR-002 Shared-device scope:** Touch-first companion to physical play, not a family/officeholder simulator. No player-family records, player officeholder identities, cash ledger, ship or Army inventories, or unreported trade outcomes. Ask for physical results only where the current app already does.
- **NR-003 Offline narrative:** Structured, authored templates bundled with the static app; no live AI service or online portrait generation required. Historical context is researched; invented campaign events and dialogue remain fiction, never attributed as historical quotations.
- **NR-004 Instruction priority:** Complete game resolution and present physical instructions before narrative commentary. Elephant movements keep dedicated instruction pages; the newly exposed event-stack region keeps its separate recap. A narrative scene cannot obscure those instructions.
- **NR-005 Activation:** Narrative mode is selected **only when a new campaign begins**. Narrative-enabled saves resume normally; legacy saves load with narrative disabled. No baseline mid-campaign activation.
- **NR-006 Provenance:** Separate authoritative recorded incidents, explicitly fictional pre-campaign background, and characters' interpretations. Do not invent a witnessed starting conquest, promise, death, payment, ship loss, or player motive.

## 2. Initial cast and continuing characters

- **NR-010 Initial generation:** Each of the eight regions (Punjab, Delhi, Bengal, Bombay, Maratha, Hyderabad, Mysore, Madras) receives a continuing local political identity. Initial rulers are **fictional** with historically and regionally appropriate names. Generate plausible political backgrounds distinct from witnessed campaign history. Existing Delhi subordination of Punjab/Maratha, or other scenario starts, must not acquire fabricated conquest origins. Real historical invaders can be specially researched.
- **NR-011 Persistent model:** Stable IDs, names/aliases, age, origin and regional ties, dynasty or institution, personality, mood, current political position, personal condition, family ties, relations, claims, titles, incidents, and arcs. Condition (alive, dead, missing, imprisoned) differs from political standing (ruler, subordinate, deposed, claimant, exile). Preserve dead characters in history; never let them speak as living participants.
- **NR-012 Dynamic dynasties:** Begin with a small plausible heir/family/rival network; expand as events demand. Persist kinship, marriage if relevant, dynastic branches, claims and succession. A successor may be a child, sibling, cousin, adopted heir, officer, rival or appointee. A child ruler needs a regency. Never assert parentage absent from records.
- **NR-013 Personality:** Core dimensions: ambition, pride, caution, ruthlessness, loyalty tendency, vindictiveness. Core traits evolve slowly after significant experiences. Confidence, mood, insecurity and resentment shift faster, influenced by actual recorded successes and setbacks. Traits must not be assigned by nationality, ethnicity or gender. Hide numeric scores; show readable dominant traits and mood. Numerical proposals are not final.
- **NR-014 Relationships:** Directional and multidimensional (hostility, gratitude, respect, mistrust, loyalty, familiarity), with factual origin. Nemeses require serious, supported grievances and stay relatively stable. Dynastic feuds preserve knowledge of ancestral wrongs but do not transfer personal guilt. Reconciliation changes attitude, not the factual record.
- **NR-015 Interpretations:** Store one authoritative event history plus persistent, sometimes conflicting character perspectives. Save significant threats, boasts and promises verbatim with speaker and incident IDs; later callbacks may use only statements actually saved.
- **NR-016 Fates:** First commit the board result; then select a compatible fictional explanation and ruler fate. Military defeat, voluntary submission, negotiated allegiance, rebellion and restoration have different eligible paths. Fates may include retention, subordination, replacement, imprisonment, exile, disappearance, battle death or execution where supported. Use personality/context-weighted probabilities but no narrative roll can alter control. A willing negotiator must not receive an unrelated lethal-conquest draw. Preserve perpetrator/cause when known.
- **NR-017 Age and succession:** A deliberate New Turn adds exactly three years to living rulers, heirs and exiles once, before natural succession checks. Newly created characters cannot age a second time in that transition. The three-year narrative clock is not an exact historical calendar; royal context remains scenario-fixed unless later decided. Cancelled previews cannot reroll succession. No ageing after game end.
- **NR-018 Exile/restoration:** Persist claimant IDs, refuge, protectors, relationships, claims and earlier reigns. Imprisonment, disappearance, relocation and return require documented compatible fictional developments. Successful compatible rules outcomes may restore an existing claimant; failed rebellions cannot. Restoring Delhi's ruler does not automatically restore its empire or subjects.
- **NR-019 Regional and allegiance history:** Keep previous controllers, conquest/negotiation, grievances, treasure removal, restorations and individual allegiance episodes. Each episode records subject/capital, rulers, start, origin (battle/voluntary-or-negotiated/unknown), any actual promises and end. Rejoining the same empire creates a new episode. Capital falls release only the actual subjects; their replies may contrast willing and conquered origins. Unknown origins stay unknown.
- **NR-020 Company rule roles:** Separate the fictional local political ruler, the player's physical Governor/officeholder, and an invented office adviser. Company conquest can retain a local ruler, appoint a claimant/puppet or occasionally install a fictional English ruler. No appointment grants mechanical bonuses or changes a physical office.
- **NR-021 Advisers:** Named fictional institutional voices, including chronicler (anonymous narrator, not an office), Presidency/Governor/Governor General secretaries, Army adjutants, shipping/naval, military affairs, China, Chairman/accountant, MP and rare royal secretary/monarch. Advisers persist, develop relationships with rulers and careers with promotions/transfers/retirement/dismissal/death/succession. Replacements inherit institutional records, not personal memories. No player-officeholder biography.
- **NR-022 Foreign expeditions:** Ordinary Foreign Invasions have plausible historically grounded origin candidates; failed War Against France is French. Persistent expedition commander, client rulers/governors, rivalries and history may span regions. Foreign patronage differs from mechanical empire membership. Same-patron regions can fight; interpret the actual outcome with eligible client dispute, commander rivalry or restoration story. Do not force French appointees into every conquered territory.
- **NR-023 Narrative arcs:** Explicit persistent arc records for emergent exile/restoration, feud, bureaucratic decline, foreign influence, rare rogue Company political appointees, etc. Store participants, triggering facts, state, developments, and possible compatible endings. Arc cannot cause a game event and may remain unresolved. Suspicion of disloyalty is not proven betrayal; a rogue ruler gains independence only after a compatible rules-resolved change.
- **NR-024 Titles and treasures:** Official styles, earned epithets and insulting/ironic nicknames have documented causes; different characters can use competing names. At setup choose one researched treasure from three candidates per region (fallback permitted). It is narrative identity for the existing one-time regional loot. Only first Company conquest takes it; Indian conquest and Company reconquest do not. Persist symbolism and family grievance, not subsequent item ownership.

## 3. Dialogue engine and scene presentation

- **NR-030 Chronicler:** Anonymous, factually reliable, normally dry/ironic; serious about tragedy and political catastrophe, more satirical about administrative absurdity. Avoid modern slang, cultural caricature, and making civilian suffering a punchline.
- **NR-031 Scene length:** Ordinary event: chronicler plus one or two prioritised relevant voices; major event: three or four may be shown. More eligible reactions in an expandable scene. Quiet/Standard/Full settings affect automatic display, not stored facts. One multi-region event should normally produce one coherent scene.
- **NR-032 Template selection:** Read a committed incident's actual before/after state, eligible living speakers, relationships, kinship, arcs, claims, allegiance history and saved quotations. Reject unsupported predicates; prefer meaningful callbacks, then specific event dialogue, then neutral fallbacks. Personality determines tone only within factual eligibility. Use independent narrative RNG. Persist template ID, rendered exact text, speaker ID, expression/emotion, incident ID and fictional effects. Reopening is stable.
- **NR-033 Knowledge guardrails:** Storms do not prove ships sank; opium icons and China office indicate potential income, not realised profit; rout removals do not prove officer death. Reported region losses do not reveal live Standing. Cascades do not prove deliberate sabotage. Characters may offer opinions but not establish unsupported guilt, player motives, promises or coordination.
- **NR-034 Source catalogue:** Templates have stable ID, trigger, speaker role, required conditions, grounded placeholders, tone/emotion, provenance and optional cooldown. Keep unknown-history neutral fallbacks. Research historical names and institutions before final content.

### Required trigger coverage

| Event family | Important factual distinctions and voices |
| --- | --- |
| Elephant / Envoy to Mughals | Movement instruction first; anticipation is not completed attack; ruler and relevant adviser |
| Company deployment | Victory, failure, catastrophe, actual officers lost, alliance participation, loot, retain/install ruler; Army and Presidency |
| Company defence and regional loss | Defence versus lost territory, actual unrest changes, reported per-region rout count; no invented death |
| Indian invasion / rebellion / Leader | Winner, loser, tower strengthening versus rebellion, actual sovereignty and empire change, claimant survival |
| Capital captured | Defeated ruler, victor and freed vassals using known allegiance origins |
| Tax / administration / Governor General | Actual unrest cause, first versus repeated tax, multiple affected regions, adviser/ruler contrast |
| Turmoil / Cascade / Peace / Windfall | Actual closed/open orders and unrest; avoid unproven blame or invented wealth |
| Envoy / China / opium | Reopening/rebuff/catastrophe, office creation, potential income only |
| Local Alliance | Independent representative speaks only when participating; no change to printed army, price or strength |
| Parliament | Six India-relevant laws and War Against France/Famine outcomes; no extra reporting for removed dilemmas |
| Storms and shipping | Affected seas only, no assumed ship loss |
| New Turn / ending | Connected arcs, ageing/succession, chapter and ending without unplayed turn |

## 4. Artwork, dossiers and chronicles

- **NR-040 First release imagery:** **No character artwork yet.** One generic silhouette reused in dialogue. Chronicler stays anonymous, perhaps represented by a book/quill icon. All dialog and dossier layouts must accommodate later character assets.
- **NR-041 Approved future portrait direction — revised Decision 27:** One visually consistent portrait identity per character with emotional expressions (initial candidates: neutral, angry, sad, triumphant, worried, amused; extensible), **not mandatory young/mature/elderly variants**. Age remains tracked numerically for mortality and dialogue. An expression is based on the speaker's interpretation, not simply win/loss. Portrait assets work offline.
- **NR-042 Dossiers:** Selecting a region gives a compact ruler summary; deeper profile shows political position versus personal condition, mood/traits, dynasty, claims, relationships, titles, incidents and arcs. Search/filter roster by region, faction, role, status and name. Preserve dead, missing, deposed, imprisoned and exiled people.
- **NR-043 Turn chronicles:** At New Turn, group recorded events into a few meaningful thematic threads. Preserve full chronological log independently. Long-term threads may span turns; a quiet turn should have a short account, not invented drama. Do not assert unrecorded conspiracies.
- **NR-044 Final history:** On the actual game end, locally export a printable illustrated-ready chronicle with thematic chapters, available portraits or silhouette placeholders, political/dynastic history, saved quotations, titles, treasures, character appendix, event chronology and unresolved threads. The current printable HTML-to-PDF route is a baseline. Do not age people into an unplayed turn.

## 5. Integration requirements confirmed against repository

The repository is a dependency-free static browser app. **`dist/` is editable source and deployment root**, not disposable build output. Read `AGENTS.md`, `docs/current-status.md`, current JS and tests before editing; `dist/design-specification.md` contains some obsolete descriptions and `docs/state-model.ts` is an older proposal.

- **NR-050 Structured incidents:** Current `dist/actions.js` and `dist/model.js` already produce action/history records, reported officer routs, region losses and Elephant movements; some important facts are still in English instructions. Extend committed results with stable incident IDs, types, turn/scenario, actual before/after board changes, affected regions/actors, alliance and allegiance changes, loot, law/phase context and reported outcomes. **Do not parse `report` text** to create history.
- **NR-051 Unified transactions:** Gameplay resolver commits the authoritative result. A separate narrative processor consumes it and computes fiction. Save gameplay and narrative changes as **one logical transition**; do not mutate mechanical state from narrative. Respect pending revealed tiles, saved rolls and acknowledgement cursors. Closing untouched dialogs must commit nothing.
- **NR-052 Repeatability:** Independent narrative RNG, idempotent incident handling, exact saved text/fates, consistent save/load, Undo and eventual Redo. Undo must remove newly generated successors, promises, relationships and arc transitions. A general Redo is **not currently evident in `dist/app.js`**, so approved Redo support needs design/implementation; it must restore original results, not reroll.
- **NR-053 Compatibility:** Retain four scenario setup logic, old saves with narrative disabled, regular/debug separate storage and shared rules, snapshots, imports/exports, history and pending progress. The present JSON format caps saves at 6 MB, keeps up to 20 Undo frames and limits history to 10,000 records; assess narrative data growth. Save portrait asset references, not image blobs.
- **NR-054 Validation:** Test invariant gameplay results with narrative on/off; old-save migration; scenario starts; deterministic scene reopening; conquest/Undo; capital and subject release; failed rebellion; claimant restoration; multiple foreign targets, officer routs; cancelled New Turn; pending roll/reveal reload; snapshot and debug isolation. Run `npm test` after changes and inspect regular/debug UI flows over HTTP. Do not claim tests not run.

## 6. Incremental playable milestones

1. **First playable narrative slice:** New-game activation; stable eight-region cast and compact families; core traits/backgrounds; basic status, incident records and relationships; essential chronicler/ruler/adviser dialogue for selected major events; shared silhouettes; simple dossier/roster and turn chapter; independent narrative randomness; unified persistence/Undo; regression tests. Must be playable throughout a game, with unimplemented advanced triggers explicitly marked.
2. **Political continuity:** Broad event coverage, allegiance origins, conquest aftermath, succession, exiles and restorations, relational memories and callbacks, mature incident contract and migration.
3. **Long-lived arcs:** Dynamic dynasties, nemeses, adviser careers, foreign expedition clients, rogue appointees, arc tracking, independent local alliance voices, titles and treasure histories; tune probabilities through playtesting.
4. **Full history and presentation:** Deep searchable dossiers, richer chapters and final printable illustrated-ready chronicle; optional future expression-portrait art as a separate phase. Maintain offline functionality.

### Minimum acceptance checks

- New narrative campaign starts correctly in each scenario; legacy non-narrative save loads unchanged.
- Ruler IDs persist across save/load; restored exile reuses an existing identity.
- Reopening an incident displays the original speaker, text, emotional expression and fate.
- Undo and Redo where supported preserve both game and narrative outcomes, including RNG choices.
- A capital collapse uses the true freed-subject list and known/unknown allegiance origins.
- Reported officer rout removal does not automatically kill a fictional named person.
- A cancelled New Turn preview does not age or kill anyone; committed New Turn ages once by three years.
- Failed rebellion does not install its claimant.
- Quiet mode never changes game results or deletes history.
- Game end produces an accurate chronicle without advancing an unplayed turn.

## 7. Approved decisions ledger

| Decision | Approved outcome |
| --- | --- |
| 1–6 | Keep baseline: standard intensity; automatic fictional fate selection; conservative configurable mortality; principal expedition with clients; readable traits rather than scores; scenario-fixed royal context |
| 7 | Narrative only from a new campaign |
| 8 | Research priority: initial regional identity, advisers and alliance catalogue |
| 9 | Generated political starting backgrounds |
| 10 | Fictional rulers, regionally appropriate names |
| 11 | Small, expanding dynamic dynasties |
| 12 | Personality/context-weighted fictional fates |
| 13 | Exile refuge, protectors, relationships and possible restoration |
| 14 | Personal rivalries and contextual dynastic feuds |
| 15 | Gradual core trait development, faster mood/confidence |
| 16 | Factual history plus personal interpretation |
| 17 | Adaptive dry/ironic chronicler |
| 18 | Persistent advisers with evolving careers |
| 19 | Adviser–ruler personal relationships |
| 20 | Prioritised, expandable scenes |
| 21 | Thematic turn chapters and full chronological archive |
| 22 | Emergent stories with tracked persistent arcs |
| 23 | Rare rogue Company political appointees |
| 24 | Persistent foreign expeditions and distinct clients |
| 25 | Persistent symbolic treasures, no later ownership ledger |
| 26 | Contextual titles, official styles and competing reputations |
| 27 (revised) | Shared silhouette now; future expressive character portraits, no required ageing variants; anonymous chronicler |
| 28 | Layered dossiers and searchable roster |
| 29 | Illustrated-ready printable final chronicle |
| 30 | Unified game/narrative state transitions, including Undo/Redo requirement |
| 31 | Incremental playable releases |

## 8. Deferred alternatives and unresolved tuning

**Preserve, do not implement by default:** Mid-campaign narrative activation with unknown or invented background; minimal/rich biographies; historical or hybrid starting rulers; simple or extensive dynasty system; deterministic or mostly random fates; simple exile flag or elaborate courts in exile; strictly personal or hereditary feuds; fixed or dramatically shifting personalities; simple memories or unreliable narrators; historical-only or broadly satirical chronicler; fixed advisers or extensive office faction politics; event-only relationships or clandestine intrigue; fixed short or full ensemble scenes; chronological-only or character-centred chapters; untracked emergent patterns or multi-stage scripted storylines; no or frequent rogue appointees; regional-only or elaborate multi-faction foreign influence; named-only treasures or item ownership simulation; simple epithets or expansive reputation networks; static, ageing or radically dynamic portrait systems; compact-only dossier or full encyclopedia; text-only or elaborate history book; derived event replay or separate synchronised narrative architecture; foundation-first or all-at-once implementation.

**Explicitly excluded from baseline:** Nemesis-directed Elephant movement, a previously suggested optional rules variant. Personalities and stories never influence the board game.

**Proposed numerical tuning only:** Trait scales (0–100), momentum and insecurity decay; relationship/nemesis thresholds; starting ages; natural mortality suggestions (under 55: 0%; 55–64: 5%; 65–74: 15%; 75–84: 35%; 85–94: 65%; 95+: mandatory); candidate conquest fate weights (45/15/20/20), foreign Company appointee weight, rogue arc likelihood/thresholds, incident adjustments and inheritance factors from Appendix A of the narrative review. These are fictional pacing experiments, not approved or historically measured rates.

**Research and technical questions to settle before implementing affected areas:** Historically appropriate name/culture pools, specific Orissa alliance representation, three treasures per region, invader/expedition candidates, exact portrait generation pipeline, visible trait label choices, precise fate/relationship/dialogue weights and cooldowns, fictional-only player choice policy, storage size/migration, incident identity and transaction boundary, debug-editor narrative provenance, and Redo architecture.

## 9. Sources and approval gate

- [Repository instructions](https://github.com/Junni01/joco-companion/blob/main/AGENTS.md)
- [24 October status](https://github.com/Junni01/joco-companion/blob/main/docs/current-status.md)
- [Design specification](https://github.com/Junni01/joco-companion/blob/main/dist/design-specification.md) — includes superseded sections
- [Detailed narrative review](https://github.com/Junni01/joco-companion/blob/main/docs/narrative/John_Company_Narrative_Mode_Review.docx)
- [Game model](https://github.com/Junni01/joco-companion/blob/main/dist/model.js), [actions](https://github.com/Junni01/joco-companion/blob/main/dist/actions.js), [app state](https://github.com/Junni01/joco-companion/blob/main/dist/app.js), [chronicle](https://github.com/Junni01/joco-companion/blob/main/dist/chronicle.js)
- User-approved decisions during this review, including the revised expressive-portrait approach.

**Approval gate:** This is a reviewable design artifact, not implementation authorization. Do not edit application code until the user approves the specification and the first milestone.
