# India debug workspace

Enter through **Saved games → New game → Debug mode**, choose a scenario and start. **Saved games → Open / resume debug workspace** reopens an existing test position without resetting it. The page is `debug.html`, with a distinct gold banner and heading.

## Separate games and saves

Regular and debug workspaces use different browser keys for autosave, snapshots and pending action progress. Debug saves carry a `debugMode` marker and cannot be imported into regular play. A regular save can be imported or its current map copied into debug without changing the regular campaign. Checkpoints are debug-only.

Return to regular game resumes that campaign. Starting a new regular game from the debug New game dialog is a separate explicit choice; it replaces the regular campaign and retains its previous position for Undo.

## Map setup

Select a region, then use Edit region setup in its dossier or the test bench's Edit button. The editor also has a region selector. Edit sovereign/subject/Company control, capital or Presidency, towers, Company unrest, individual orders and unclaimed Indian loot tokens. Number inputs use touch increase/decrease controls.

Setup edits become correction records titled Debug setup; they do not pretend a conquest happened. Actual actions use normal incident records. Validation rejects wrong-Presidency Company home regions, invalid or chained overlords, more than three empires, more than twenty tower levels, more than thirty unrest cubes, unclaimed Company loot, and illegal Elephant placement. These checks cover tracked board pieces; untracked fatigue, officeholders and available Army pieces remain reported as in regular play.

Converting a capital to Company control or subject status releases its former subjects. Setup edits derive capital flags from subjects and adjust an invalidated Elephant placement to a legal position. Place Elephant lists valid positions for the current map.

Scenario reset offers all four starting positions. Presets give the three Company home regions two unrest each, or open/close all scenario orders. Reset creates a fresh deck and clears test history. Undo restores the prior setup.

## Events and deck

Choose event test selects an actual tile and the region to expose behind it. Staging moves those tiles into the debug deck, opens an Events boundary, and calls the regular draw/reserve/resolve/finish flow. This consumes the tile, resolves follow-up attacks, changes the map, displays each Elephant movement and shows the exposed region. Shuffle actually shuffles the deck. Draw next tile tests the existing order without choosing a front.

The deck editor shows all fronts, the draw pile next-first, and discards oldest-first. Move a tile to either pile and any valid position. Shuffle the draw pile, or collect and shuffle all twenty tiles. Each tile must appear exactly once. Shuffle must remain in the draw pile, and an editable draw pile cannot be empty. Complete or restore a pending test before editing the deck.

Foreign Invasion tests can override the storm face and use a fixed invasion d6. Overrides are saved inputs to the shared engine and are absent from regular-mode controls. Defence, routs, Standing instructions, Cascades and aftermath still resolve normally. Without overrides, use normal app rolls and animation.

## Laws, offices, actions and timing

Test buttons open the existing Deploy, Special Envoy, Governor, Governor General, Parliament and Blackmail dialogs. They stage the required Operations or Parliament boundary without changing the map. Normal eligibility, laws, follow-ups, reported Army availability and current-turn limits apply.

Laws & offices toggles every law flag already present in the save model, plus China-office creation. Envoy to China implies an existing China office. Governor General replaces the regional Governors and Director of Trade; enable its law before testing Govern. Table-only law flags remain table-only. Dilemmas are event effects, not permanent toggles: test Passed/Failed through Parliament. No new office-vacancy or troop-inventory model is introduced.

Phase & turn stages Operations, Events, Parliament or Refresh at a supported scenario turn, preserving map and history. It explicitly skips prior physical phases. Clear turn reports / limits removes the current turn's reports, including Tax counts, Govern success, catastrophes and region-loss counts, while keeping the board. This is an optional setup edit, not normal gameplay.

## Repeatable tests

Save checkpoint preserves the full payload, including pending progress. Restore checkpoint replaces the debug game with it. Toolbar tests also capture an automatic starting point; Restore last test start cancels a pending test and returns to the position before it began. Existing Undo, snapshots, JSON backups and readable chronicle export are available. Setup editing is locked while a revealed event or saved roll is unresolved.

## Shared implementation and verification

`debug-entry.js` loads the current regular `index.html`, inserts the test panel and imports the same `app.js`. Map rendering, dossiers, rules, deck, dialogs, dice, law effects and save format are shared. `debug-state.js` contains setup transformations; `debug-tools.js` contains only test controls. Future rule changes belong in shared modules. Future narrative state in the campaign object travels with clones and checkpoints; corrections remain distinguishable from gameplay.

Tests cover legal setups, normalization, deck invariants, actual tile completion including Shuffle and March, shared action effects, storage isolation, checkpoints, report clearing and rejection of debug imports in regular mode. Browser checks cover entry/resume, touch editing, disabled wrong-Presidency choices, deck editing, full Peace resolution, Governor General effects and return to an unchanged regular campaign.
