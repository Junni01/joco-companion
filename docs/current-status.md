# Project handoff — 24 October 2026

## Baseline

The working app exists as code. Before this handoff the checkout held 33 commits ending at `0c56a2a2f41e68c0cf67733931932177d5dea516` (Update Site source). Preserve that history. The narrative milestone verification has 145 passing tests; rerun `npm test` for the current result.

This is a shared-device India companion to the physical game. Players manage money, families, votes, ships, Army pieces and officeholders. Reported officer rout counts support the chronicle without identifying family members.

## Current behavior

Eight regions: Punjab, Delhi, Bengal, Bombay, Maratha, Hyderabad, Mysore and Madras. Vector map, orders and trade-route graph, centered names, tower/unrest markers, visible Company control/empires, selected outline on top, legal Elephant positions and contextual dossier actions.

Four scenarios: 1710 (turns 1–5), 1758 (3–7), 1813 (5–8), long 1710 (1–8). Twenty event tiles are saved across draw/discard piles. Draw one at a time; expose the next region and allow map inspection between events. Preserve manual event testing.

The initial Events in India storm can be automatic or a confirmed physical face. Invasion and failed War Against France storm rolls are automatic; all saved rolls occur once. Dice animation uses supplied storm faces. Ship rolls/consequences remain table instructions. All primary foreign attacks finish before the single secondary unrest rebellion sequence. See rules audit/tests for cascade guards and ordering.

Deploy derives eligible armies/targets, shows combined defending region strengths, enforces local alliances, automatically includes available one-time loot, and handles control, orders, unrest and Elephant consequences. Players report physical commitments and outcomes. Required defensive officer routs are recorded.

Governor actions contain Tax and Unsuccessful Administer. Ordinary first Tax per region/turn adds no unrest, later Taxes do. Governor General has separate company-wide checks/sixes and Tax limits. Zamindar Taxes modifies appropriate unsuccessful administration effects, not every unrest source. Sepoy Recruitment changes relevant unrest strength from +1 to +2.

Parliament has one view for relevant laws and dilemmas. Laws record Passed. War Against France and Famine record Passed/Failed with a separate confirmation. End Parliament works with none applicable and prints Upkeep/Refresh instructions before New Turn. Some existing model law flags are table-only, not full automation.

China-office activation gates opium icons/potential income, modified by Envoy to China. Actual trade outcomes are not tracked. Players settle blackmail cancellations before using an app card action. End Game is available before/after Events in India, not during its pending sequence.

Regions lost this turn remain visible; recapture does not erase losses and another loss counts again. Show Standing penalty instructions rather than a guessed live Standing balance. Chronicle, JSON saves, pending progress, Undo and snapshots persist independently of source control.

## Debug and latest regression

Separate debug entry, storage, checkpoints and legal map/deck editing; normal action and event resolvers are shared. See debug-mode.md for every control. The latest fix addresses the empty debug panel under URL rewriting: entry documents carry explicit workspace markers, debug-entry inserts the panel before loading shared app code, and storage detection honors the marker even at `/`. Preserve those tests.

## Narrative first playable slice

The 22 October detailed narrative review is preserved in `docs/narrative/John_Company_Narrative_Mode_Review.docx`. It distinguishes agreements, proposals and open matters. The approved first playable slice is now implemented locally: new-game activation in all four scenarios, a persistent fictional cast with compact families, core traits/moods/relationships, structured incidents, major-event reactions, shared silhouettes, dossiers/roster, thematic chapters, printable history, independent narrative RNG and unified Undo/Redo. See `docs/narrative/first-playable-milestone.md` for the precise scope. Random deaths, natural succession, weighted replacements and advanced arcs remain deferred as approved.

Agreed direction includes a chronicler plus ruler and adviser reactions, potentially several lines per incident. Fictional Company advisers are distinct from player officeholders and appointed regional rulers. Historical local alliances act independently. Deposed surviving rulers remain as claimants; statuses include exile, prison, missing and dead. Record alliance-versus-conquest origins for independence reactions. Historical regional treasure is selected once, tied to the first Company conquest loot token. Narrative must never alter game rules; eventual narrative choices belong in save/Undo and use separate randomness.

French patronage/client rulers, foreign leadership replacement, titles, detailed statistics, probabilities and exact roster/dialogue decisions require the review's proposed/open distinctions. Examples are not automatic implementation instructions. Finish rules first.

The accumulated `dist/design-specification.md` includes earlier descriptions, including single-scenario scope and old administration/atomic-action wording. Read it alongside current code/tests and this document to avoid reintroducing superseded behavior. The TypeScript state contract is also an older proposal.

## Narrative verification

All 145 automated tests pass, including complete real event-stack campaigns through final scoring in all four scenarios with narrative-on/off mechanical equivalence. New regressions cover legacy saves, preview cancellation, exact Undo/Redo and reload, capital subject release, repeated allegiance, failed rebellion, foreign targets/routs, Tax wording, living/dead conditions, debug clock staging, export escaping and large-save pruning. Isolated headless Chrome over HTTP verified regular/debug entries, all scenario starts, cancelled setup, full deployment, Undo/Redo/reload, quiet display, profile/roster filtering, snapshots and unchanged regular storage across debug navigation. Desktop and 390px mobile screenshots were inspected; no horizontal page overflow was found. No GitHub push or hosting deployment was performed.

## Transfer and deployment

Destination: https://github.com/Junni01/joco-companion. Preserve main history and verify destination refs before declaring transfer complete. GitHub does not automatically deploy the existing Sites host. Retain `.openai/hosting.json` project identity; never commit access credentials.

Browser campaign state is separate: export/import JSON to move it. Original uploaded rule/board/event PDFs are not all in this checkout. Existing tracked reference assets, citations, rules audit and narrative review are preserved; do not claim every historical chat attachment is included.
