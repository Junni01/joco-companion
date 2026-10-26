# Staged weather and silent invasions — implementation report

26 October 2026. Started from pulled `main` **`91c9acb`**, on accepted 09D-2. Implementation commit: **`e177f80f9766ec54be8d9a767496bc6ea8d5d262`**. The following documentation commit contains this report and the demonstration; retrieve it with `git log -1 -- docs/narrative/collection09d2-weather-implementation.md`.

## Implemented

**Narrative mode:** Begin Events in India generates and commits one face through the existing `rollStormFace()`. No die artwork/animation or manual phase-face selector appears. The first page shows only actual affected seas and the existing exact physical ship procedure. All ship rolls resolved is the unchanged authoritative `phase-ships` boundary. The next page separately reveals the actual event count from that same saved face. Calm faces show calm seas, no ship task/acknowledgement, then a navigation-only Continue reveals the count. Event identities are never predicted.

The workspace button/counter, latest-scene preview, chronicle previews and readable export conceal the current count until the weather boundary. Hidden values are not briefly written into the workspace heading. Stored history, reports and quotations are not rewritten. Raw JSON backups intentionally retain the authoritative face/count: this is presentation staging, **not rules secrecy or encrypted information**.

`narrative.weather` is optional turn-bound presentation metadata: source phase-start incident, whether the weather stage completed and whether the count was presented. It adds no gameplay phase, physical input, inventory, narrative memory or relationship attribute. Presentation changes autosave without creating extra gameplay Undo frames or incidents. Completed events take precedence over an earlier UI marker. Old current-schema saves without the marker load unchanged; already-progressed events retain their known information. Explicit Debug phase setup clears this UI marker; deletion protection names its actual source incident. New Turn clears it.

Undo of the initial phase preserves the original face in protected progress. Narrative resume reuses that face and restores the weather display; it never calls RNG again. Reload, import/export, snapshots and ordinary Undo/Redo retain the same actual phase and rolls.

**Foreign Invasion / failed War Against France:** Their separate target-selection face is still generated once and saved immediately. Narrative mode skips the graphical storm and per-target rolling screens. An announcement names only the actual threatened regions, in the legal resolution order. A small shared `foreignTargets()` exposes the resolver's **unchanged** target expression to the UI: all seas → Bombay/Madras/Bengal, individual seas → their actual Presidency, no storms → exposed-region fallback for Foreign Invasion and no targets for France. No country/commander is invented for a generic invasion.

Each strength is silently generated only when the existing resolver requests that region's `invasion-roll`. It uses the original rejection-sampled d6 calculation, saves in protected `d.rolls`, then resumes the same resolver. Future regions have no premature strength values. Saved invasion base strengths are labelled as **physical values**, separately from the full attack calculation including unrest/Sepoy modifiers. Mandatory defence, officer routs, separate Elephant movements, primary-before-secondary order, territorial effects and half-raw-d6 settlement strength remain unchanged. Original physical reports still contain exact rules terminology.

**Normal mode:** Existing initial app dice animation, initial physical/manual storm selection, storm instructions and simultaneous count display remain. Foreign/France storm and automatic per-region strength animations/controls remain. No manual invasion-value entry was added. Narrative mode includes quiet intensity for silent rolling; quiet still suppresses optional literary scenes as before.

## Missing creative writing — intentionally not fabricated

No new production dialogue entries were enabled or rewritten. Existing eligible committed result scenes still use 09D-2's separate scrollable page. The new weather/count/threat stages use concise **factual UI**, never mechanical fallback masquerading as character speech and never an empty story page.

| Writing family needing approval | Established inputs / limits |
| --- | --- |
| Ocean weather / calm-seas passages | Actual saved affected seas; no ship inventories, named ship losses, cargo or casualties are reported |
| Rising tension after weather | Actual 1–4 count, revealed only after weather completion; no guaranteed identities or hidden fronts |
| Invasion theatre announcement | Actual threatened regions/order and existing France context; no invented nation, commander or movement |
| Per-target apparent force scale | Actual saved raw force and target circumstances; no literal troop count, new mechanical scale classes or unapproved 'overwhelming' claims |

In particular, the strength-six demonstration shows its actual numerical threat clearly but **does not call it an “overwhelming army”** without approved context-sensitive prose. This is a documented creative limitation, not a claim that a full literary force-scale collection was integrated. Existing mechanically phrased old chronicler fallbacks flagged by the glossary remain a separate writing-review gap; saved accepted words were not silently changed.

## Changed files

- `dist/weather-presentation.js`: mode/stage predicates, metadata validation/lifecycle and read-only archive masking.
- `dist/phase-dialog.js`: silent Narrative start, seas/ships first, separate count reveal; original Normal branches retained.
- `dist/app.js`: stage-aware workspace counters/routing, no-Undo presentation autosave, protected initial-face resume.
- `dist/action-dialogs.js`: silent target/strength rolls, actual-target announcement and physical base-strength display; Normal animations retained.
- `dist/actions.js`: exports the exact existing target mapping and reuses it internally; no outcome/rules change.
- `dist/narrative.js`, `dist/narrative-ui.js`, `dist/chronicle.js`, `dist/narrative-evidence.js`: optional metadata lifecycle/validation, staged readable surfaces and source deletion guard.
- `dist/debug-state.js`: clear presentation marker on explicit Debug phase setup.
- `tests/weather-presentation.test.js`: 17 focused regression cases; `tests/narrative-app.test.js`, `tests/m2-persistence-ui.test.js`: existing Narrative UI checks now use an explicit test RNG fixture instead of the removed manual selector.
- `scripts/check-weather-browser.cjs`: dedicated actual-application checks and screenshots. `scripts/browser-narrative.cjs`, `scripts/check-m2-browser.cjs`, `scripts/check-outlook-browser.cjs`, `scripts/check-resolution-browser.cjs`: adapt older regressions to the newly authorized calm-weather navigation, without skipping shipping or defence.
- Documentation: this report, the small demonstration/verification record and four review screenshots, README and `docs/current-status.md`.

## Verification

**367 automated tests pass, 0 fail** (`npm test`; accepted baseline 350 + 17 focused tests). Covers all six faces/duplicate calm probability, delayed disclosure, calm/ship stages, exact phase parity, Normal graphical controls, both multiple-target procedures, differing no-storm fallbacks, legal per-region timing, rejection sampling, reload reuse, actual failed defence/rout/redirect and raw-force settlement, optional old metadata, Debug setup and actual-event precedence. Existing scenarios, hidden-stack, protected events, saved rolls, snapshots, current-version persistence, exact saved dialogue, narrative RNG and on/off rules regressions remain green.

Dedicated actual-browser verification: Chrome **156.0.8078.47**, **1440×900** and **1024×768**, regular and Debug with both modes. All six Narrative weather faces; count withheld in workspace/archive across reload; calm/no fake ship task; Normal animation/manual selector; large and sequential Foreign/France forces; no graphical dice in Narrative; no extra per-strength acknowledgement; pending invasion JSON export/import **and actual snapshot restore**; exact saved inputs across reload and Undo/Redo. Screenshots visually inspected; no page errors or horizontal page/dialog overflow.

Existing advice, counsel, Operations, M2, outlook/actual-Shuffle, trade and 09D-2 resolution browser suites pass. Additional existing-suite viewports **1440×1000** and **390×844**. Test-controlled random values and campaign setups are explicitly synthetic; no personal campaign or hosted Site was accessed.

[Small four-part demonstration](collection09d2-weather-demo.md) · [verification record](collection09d2-weather-verification.json). Reproduce the new browser check with `node scripts/check-weather-browser.cjs` against the local HTTP server and the documented Playwright/Chrome environment.

No Revenue/Parliament workflow, five-stage navigation, 09D-3, portraits, new fictional cast, financial tracking, old-save migrations or Site deployment. War Against France changes are limited to its already implemented invasion presentation. Creative writing and integrated pacing remain for user/ChatGPT review.
