# Buried Giant rules comparison

Reviewed 22 October 2026 against the supplied `John_Company_Rules_(BGG)_Final.pdf`, the companion source, and the publisher's live English Rules Library:
https://rules.buriedgiant.com/?product=johncompany&locale=en-US&printing=p1

## Authority and method

The live page displays **4th Printing (Work in Progress)**. Its `p1` URL parameter is an internal identifier; it does not mean that the displayed text is the physical first printing. The settings panel displayed three errata entries and zero FAQ entries. All three errata were enabled and read. The site's complete John Company rule data was retrieved from its published application assets and its numbered text was compared with text extracted from the supplied PDF. Examples, diagrams, layout, renamed headings and OCR differences were reviewed separately from mechanical changes. The app's India rules and relevant reminders were then checked against the findings.

Use explicit publisher corrections as the authority over conflicting PDF wording. Continue to retain printed passages and earlier official errata where the WIP transcription simply omits them. This is a comparison of the main rulebook, not a fresh authentication of every scenario card, blackmail card, law, component manifest or Crown Handbook entry. Previously supplied component facts and the user's Maratha loot correction remain unchanged.

## Findings and app disposition

| Rule | Difference or clarification | App disposition |
| --- | --- | --- |
| 13.9 Foreign Invasion | The publisher explicitly places one set of extra unrest rebellions after all foreign invasions. The older PDF does not explain this multi-target timing. | Fixed. Every primary target is resolved before checking for additional rebellions. Applies to ordinary Foreign Invasion and failed War Against France. |
| 13.9 New tower | The publisher specifies half the invasion die roll, rounded down, rather than the potentially ambiguous invasion strength. | Already correct: unrest and Sepoy additions do not increase the new tower. Added regression coverage. |
| 5 Final Scoring | Explicitly identifies the highest-VP player as winner. The window-icon and Prime Minister-order tiebreaks already appear in the PDF. | End-game instructions now state the complete winner/tiebreak reminder; scores remain physical. |
| 10.8.2 Target selection | Adds the prohibition on deploying into a Company region belonging to another Presidency. | Already implemented from earlier official errata, in both eligibility and validation. |
| 13.4.4 Region Loss | Clarifies loss of Presidency association and avoids a second order-closing operation when Foreign Invasion or Rebellion already closes orders. | Already implemented: Presidency is cleared and each loss closes orders once. Cascades remain limited per event. |
| 13.5.2 Elephant position | Uses the acting region at the Elephant's tail for skipping its own subjects. The PDF refers to the top draw-stack region, which can differ under Imperial Ambitions. | Existing March code already uses its actual destination/acting region. No change needed. |
| 16.5.1 Forming a firm | Explicitly preserves the opportunity marker's action when the family board is flipped. | Added to the Deregulation reminder. No firm inventory or player data added. |
| 8.1.3 No family action | Includes the exceptional case in which a player cannot perform any family action. | Already covered in the guide from earlier official errata. |

The first three entries correspond to the live site's three explicitly labelled fourth-printing errata. The other rows are textual clarifications or differences found while comparing the body text; they are not claimed to be newly issued fourth-printing changes.

## Foreign Invasion implementation

Primary targets use the saved storm face and saved individual invasion dice. Each primary completes defence, any officer rout, Region Loss and foreign aftermath before the next primary. Additional rebellions are deferred until the primary loop finishes. They are triggered only if a primary attacked Company territory, and use the remaining Company regions with unrest at that point. Primary regions have either defended and cleared unrest, or been lost and ceased to be Company regions.

The additional rebellions follow Presidency order: Bombay, Madras, Bengal. A Commander selects the order within their Presidency when more than one region qualifies. Available forces are reported from the physical board and do not refresh between battles. Loss counters, Standing instructions, one-time loot status and per-event Cascade limits continue across the entire event.

Tests cover three Company primary targets plus two additional unrest regions, primary unrest contributions, Sepoy modifiers, five losses and individual rout reports, both Foreign Invasion and War Against France, and the absence of secondary rebellions when only Indian regions were invaded. Existing saved-die, event-stack, Elephant-page and portable-save tests remain in the full suite.

## WIP omissions requiring caution

The online transcription lacks passages that the supplied PDF contains, including:

- Loot calculation/distribution within successful Deploy.
- The successful Administer personal-income paragraph.
- Successful China trade payouts.
- Foreign Invasion's Elephant Redirect paragraph.
- The empty-Court Chairman sidebar and some other explanatory sidebars/examples.

These absences are not accompanied by corresponding repeal notes in the site's three-entry errata panel. They should not be interpreted as proof that those rules were removed. Preserve the PDF rules and earlier explicit errata until the publisher provides a clear replacement. In particular, preserve automatic loot, China potential-income calculations and the printed Foreign Invasion Elephant redirect.

## Boundaries

No player identities, family assets, scores, troop inventories, trade outcomes or additional Parliament cards were introduced. Automatic invasion storm rolls and the optional physical phase-opening storm roll remain unchanged. The audit does not claim that a WIP transcription is complete or that absence from its FAQ panel invalidates earlier official FAQ rulings.
