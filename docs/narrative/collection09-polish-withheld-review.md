# Collection 09B — Review of 12 withheld entries

**Decision:** User-requested ChatGPT editorial/evidence review, 25 October 2026. **Status:** Specific recommendation for Codex integration, subject to user's adoption through the supplied Codex task. This file does not implement changes. The approved original wording remains in [the writing catalogue](writing/collection09-outlook-polish.md).

## Interpretation standard

Interpret a fictional **private thought** as in-universe character voice rather than an omniscient historical assertion. Three kinds of language:

1. **Hard consequential facts:** An actual military deployment/garrison at a specified place, resolved battle, treaty, payment collected, troop casualties, personal service/participation, successful protection, joint action or completed trade must have supporting game/narrative facts. Never manufacture these from atmosphere.
2. **Ordinary courtly/social background:** General references to attendants, ministers, ceremonial bowing, receiving officials, correspondence, courtly discussions, or rhetorical permission to be frightened are allowable as harmless characterization when they don't purport to establish a consequential game event or a callback-worthy historical statement by another named person. Do not create canonical incidents or quoted statements from such background.
3. **Subjective political interpretation/rhetoric:** Self-serving notions of imperial protection, Company's asserted authority over revenues, and exaggerated bureaucratic assurances can be said by a biased ruler, without certifying a specific payment, guarantee, treaty, particular troop location or event. Keep them private and retain the already-required political context.

**No blanket relaxation of evidence checking.** Other characters cannot use private thoughts as testimony; factual chronicler and game instructions remain strictly grounded. Existing forecast projection and hidden-event protections remain unchanged.

## Entry-by-entry decisions

| Exact approved ID | Decision | Narrow justification / guard |
|---|---|---|
| `09B-strong-defender-dismissive` | **ALLOW unchanged** | “My court urges preparations. I have granted them permission to be frightened on my behalf.” Comic characterization of a dismissive ruler's court; does **not** record a real order, Army deployment or named adviser's saved statement. Requires actual strong-defender eligible context. |
| `09B-company-border-mercantile` | **CONDITIONAL** | “An open road into Company territory can carry either merchants or soldiers. I would strongly prefer to choose which.” Requires demonstrably **open real cross-border trade connection** with Company territory, using existing public order/adjacency data if available without modifying 09A projection or introducing unsupported hidden info. An open order *somewhere in a region* is insufficient; if linkage cannot be proven without scope expansion, keep blocked. |
| `09B-company-threat-resentful` | **ALLOW unchanged** | “The Company's assurances grow firmer whenever its position grows less certain.” A sarcastic generalized *assessment* of Company rhetoric, not a logged series of official promises. Retain actual Company-primary threat and suitable resentful voice; do not create any saved assurance or fact. |
| `09B-occupation-wounded` | **ALLOW unchanged** | “They have soldiers, laws and a governor. Yet they cannot command affection. I take a modest pleasure in that.” General institutional imagery, **not** a claim that particular Army pieces are deployed or an incumbent player's officeholder identity is tracked. Require real Company control and local unrest; do not report an actual garrison. |
| `09B-subject-restless` | **ALLOW unchanged** | “I have bowed often enough to remember the shape of the floor. I should like to see the view from standing.” Figurative personal experience of subordination, not evidence of recorded ceremonial audiences. Require actual subject allegiance and appropriate resentful/ambitious voice. |
| `09B-capital-outraged` | **ALLOW unchanged** | “They have enjoyed the protection of my throne and now question its authority. An unfortunate understanding of gratitude.” Ruler's self-serving claim of political protection, not proof of a saved promise, intervention, or actual protected service. Require a current actual imperial-capital/subject-threat context. |
| `09B-conquest-grievance-ceremonial` | **ALLOW unchanged** | “I receive their officials with every courtesy. Courtesy, I am pleased to say, requires no affection.” Plausible ordinary ceremonial background; not a recorded specific meeting, visitor or relationship change. Require sourced owned conquest grievance and Company control. |
| `09B-conquest-grievance-scornful` | **ALLOW unchanged** | “The Company has taken the revenues. It appears to expect gratitude as an additional tax.” Bitter political shorthand for the Company's claim to revenue rights after **actual conquest/control**; it does **not** establish collected cash, a player's income, or a resolved Tax action. Require sourced Company conquest/grievance and continued Company control. |
| `09B-qualified-gratitude-conflicted` | **KEEP WITHHELD** | “The Company has helped preserve my position more than once.” Existing generic intervention/gratitude records do not establish that those interventions **preserved this ruler personally** on two occasions. Can revisit if explicit eligible personal-rescue/preservation evidence becomes available; do not relax or rewrite. |
| `09B-qualified-gratitude-pragmatic` | **KEEP WITHHELD** | “We have learned to accomplish certain things together.” This asserts personal/organizational cooperation, which beneficial but unilateral Company interventions do not prove. Require actual shared action evidence or separately approved prose change. |
| `09B-commerce-anxious` | **KEEP WITHHELD** | “I should prefer that trade continued without requiring so many explanations for its absence.” Closed opportunities do not demonstrate the total absence of trade or even completed prior commerce. Only enable with evidence supporting those claims or separately approved rewrite. |
| `09B-commerce-dismissive` | **KEEP WITHHELD** | “My advisers are troubled by the absence of trade.” Even though generic advisers discussing commerce can be colour, actual **absence of trade** remains unproven. Without that substantive claim safely gated, keep blocked; do not silently edit. |

**Projected availability:** The existing 48 enabled entries plus up to 7 unchanged approvals = **55** selectable; potentially **56** if the precise real open-road predicate is established; **4** remain blocked. These are targets, not a claim of implemented results.

## Integration constraints and acceptance

- Use **exact existing IDs/text**; do not change the creatively approved source catalogue or rewrite old saved words.
- Retain original event/political/memory/trait guards. This review relaxes only *interpretation of harmless in-character language*, not the required mechanical predicates.
- Do not create narrative events from general rhetorical claims. In particular, no fabricated treasure transfer, Company-tax collection, real regional garrison, named Governor, peace agreement, past battles, military assistance or mutual cooperation.
- If the mercantile route cannot be justified with currently legitimate public state, keep it blocked and report the limit. Do not broaden `publicKnowledge` or hidden deck access just to activate it.
- Preserve exact private-thought persistence and initial/versioned save handling, Undo/Redo, no reroll on reads, narrative-on/off gameplay equivalence.
- Run focused blocked-ID eligibility tests, 09A hidden-information tests and `npm test` plus relevant browser checks. Provide a short clear implementation report and list final enabled/withheld counts.
- No 09C/09D adviser system, full naming Collection 10, narrative redesign, bulk review artifacts or hosted Site deployment in this task.

## Human review and future rule

This decision draws a firm distinction between *fictional lived texture* and *asserted causal campaign history*. A private fictional ruler can think that he receives visitors or that his overlord is hypocritical without creating an event record; but he cannot turn a threatened conflict into a victory, political control into a completed payment, or an incidental intervention into proof of his personal rescue. Future writing reviews should enforce that distinction before Codex engineering handoff.
