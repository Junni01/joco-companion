# Narrative Polish — Natural Fallback Dialogue (Collection 07)

**Status:** User-approved creative draft, 24 October 2026.  
**Purpose:** Replace the worst legacy M2 narrator/character fallbacks with natural, contextual speech.  
**Scope:** Writing and selection guidance only. Technical integration is separate.  
**Related:** [Style guide](style-guide.md), [Companion pacing](relationship-scenes-pacing.md), [Implementation report](../approved-dialogue-implementation.md).

## Guiding decisions

1. **Not every fallback needs a joke. Every fallback must sound like a person.** Game instructions, numeric reports, transaction details and technical warnings remain outside character dialogue.
2. For routine events, prefer concise observations and at most one or two reactions. Strong satire punches up at Company hypocrisy and bureaucracy. Rulers may be proud, cautious, anxious, exhausted, hopeful or angry, not universally sarcastic.
3. Personality, political allegiance, relationship reasons, memory and recorded event outcomes are used as eligibility, not merely randomness. In particular, a ruler hostile to Company control must not automatically express relief that a rebellion against the Company was suppressed.
4. Earlier promises, payment, return journeys, committees, threats, deaths, participants and personal command are not inferred from bare mechanical results. Missing prerequisites exclude a line; neutral fallback is acceptable.
5. Do not alter any already approved Collections 01–05 wording without further creative approval. These new alternatives are a distinct collection.

## 1. Taxation

### FB07-TAX-SEC-01 — Ordinary Tax, bureaucratic secretary

- **Replace:** `secretary-tax-1` (“The Tax has been recorded. The payment remains a matter for the physical table.”)
- **Event:** Actual committed Tax; secretary associated with the relevant office/region.
- **Voice:** Procedural, dry or institutionally self-justifying.
- **Expression:** Composed, smug.
- **Exact text:** “The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”
- **Guard:** Spoken irony; does not prove the payment was actually made. This is a character's expectation, not the game's instruction for completing Tax.

### FB07-TAX-SEC-02 — Cynical secretary alternative

- **Event:** Tax; secretary with documented cynicism/self-interest and established procedural manipulation; not ordinary principled or anxious clerk.
- **Expression:** Smug.
- **Exact text:** “The accounts are most satisfactory. I find they improve considerably when one begins with the amount one wishes to receive.”
- **Guard:** Character's cynical rhetorical opinion. Do not invent fraudulent accounts or actual changed revenues.

### FB07-TAX-RUL-01 — First Tax

- **Replace:** `ruler-tax-first-1` (“A Tax has been reported in {region}. The first demand is seldom the last subject of discussion.”)
- **Event:** First committed Tax relevant to the ruler/region.
- **Voice:** Proud or reserved affected ruler.
- **Expression:** Guarded.
- **Exact text:** “The Company has presented its demands. I shall reserve my gratitude until I discover what remains afterward.”
- **Guard:** Avoid assuming that cash was already paid, or that impoverishment has occurred.

### FB07-TAX-RUL-02 — Repeated Tax, sharp

- **Replace:** `ruler-tax-repeat-1` where voice matches.
- **Event:** Later committed Tax within same region, with prior actual Tax.
- **Voice:** Proud, sardonic or bitter ruler.
- **Expression:** Exasperated.
- **Exact text:** “Again? I had assumed the Company's appetite might occasionally be satisfied. Evidently, I have misunderstood its constitution.”

### FB07-TAX-RUL-03 — Repeated Tax, cautious

- **Event:** Later committed Tax within same region, with prior actual Tax.
- **Voice:** Cautious or worried ruler.
- **Expression:** Concerned.
- **Exact text:** “Another demand. I begin to wonder whether their expectations have any natural limit.”

## 2. Administrative failure

### FB07-ADM-RUL-01 — Dispossessed ruler's dry satisfaction

- **Replace:** `m2-callback-company-conquest-administration` (“The Company took control of Bombay. This administrative setback gives our court another reason to remember.”)
- **Event:** Real failed administrative action; earlier committed Company conquest directly affected this same ruler/region.
- **Voice:** Proud, sardonic or bitter ruler.
- **Expression:** Sardonic.
- **Exact text:** “They were most confident when they took the kingdom. I confess I find their present difficulties rather educational.”
- **Guard:** Prior conquest must be saved and linked. The confidence is the ruler's present opinion, not an attributed earlier Company quotation.

### FB07-ADM-RUL-02 — Earlier assurance exposed

- **Event:** Actual administrative failure; an actual *saved attributed assurance* that governing would be simple and the ruler has justified knowledge of it.
- **Voice:** Bitter or mocking ruler.
- **Expression:** Cutting.
- **Exact text:** “They assured everyone that governing would be simple. I should dearly like to know whether they have revised that opinion.”
- **Guard:** **Defer** without the saved assurance and eligible audience/knowledge. Never invent an earlier guarantee.

### FB07-ADM-SEC-01 — Committee upon committee

- **Replace:** `secretary-admin-1` or another weak administrative-failure secretary fallback, subject to event.
- **Event:** Confirmed failed administrative action.
- **Voice:** Bureaucratic, self-important and procedurally minded.
- **Expression:** Earnest or smug.
- **Exact text:** “An unfortunate outcome. I shall recommend a committee to determine which committee ought to have prevented it.”
- **Guard:** This line announces an *intention* to recommend; it does not create an actual committee or record an earlier one.

### FB07-ADM-SEC-02 — Restrained bureaucratic alternative

- **Event:** Confirmed failed administrative action.
- **Voice:** Formal or defensive Company secretary.
- **Expression:** Anxious.
- **Exact text:** “There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”
- **Guard:** Fictional procedural phrasing. No specific order or outside actor is invented as canonical fact.

## 3. Failed Company expedition

### FB07-MIL-RUL-01 — Proud ruler, safe general response

- **Replace:** `ruler-deploy-failure-1` when appropriate.
- **Event:** Actual failed Company expedition/attack affecting ruler's region, with relevant ruler alive and eligible.
- **Voice:** Proud, contemptuous or strategically amused.
- **Expression:** Smug.
- **Exact text:** “The Company has discovered that confidence is not, by itself, a military advantage.”

### FB07-MIL-RUL-02 — An instructive journey

- **Event:** Failed Company expedition **plus actually supported return/withdrawal journey**, or a separately authored fictional statement that does not misstate the mechanics.
- **Voice:** Proud ruler.
- **Expression:** Mocking.
- **Exact text:** “They came expecting victory. I trust they will find the journey home equally instructive.”
- **Guard:** **Defer** without actual departure/return support. A failed deployment does not, by itself, establish a literal journey home.

### FB07-MIL-ARM-01 — Professional officer

- **Replace:** `army-deploy-failure-1` where officer is relevant and professional.
- **Event:** Real committed failed Company expedition.
- **Voice:** Professional, cautious or blunt.
- **Expression:** Sober.
- **Exact text:** “We were beaten. I would prefer to understand why before someone explains why we were not.”
- **Guard:** In-fiction collective “we” refers to Company interests; do not imply that this NPC personally commanded the expedition unless independently recorded.

### FB07-MIL-ARM-02 — Careerist officer

- **Event:** Real committed failed Company expedition.
- **Voice:** Ambitious, self-exculpating officer.
- **Expression:** Defensive.
- **Exact text:** “The result is regrettable. Fortunately, I have already identified several circumstances for which I cannot reasonably be held responsible.”
- **Guard:** Fictional claim of having identified circumstances; not objective evidence that specific causes or exoneration exist.

## 4. Company suppresses rebellion or repels attack

**Technical selection warning:** A genuine Company defence of its region, suppressed rebellion and a generic intervention are *not* automatically identical. These alternatives require a committed relevant defence outcome. Do not use them merely because unrest was cleared.

### FB07-DEF-RUL-01 — Hostile local ruler

- **Replace:** `ruler-defence-1` for a ruler with supported substantial hostility/grievance against Company control.
- **Event:** Company successfully suppresses genuine rebellion or repels supported opposition in their region.
- **Expression:** Bitter, guarded.
- **Exact text:** “The Company has defeated its enemies. Unfortunately, it has done very little to reduce their number.”
- **Guard:** Political assessment, not proof of quantified enemies or imminent future battle.

### FB07-DEF-RUL-02 — Pragmatic local ruler

- **Event:** Same as above; pragmatic ruler who has reason to fear repeated defeat/unstable resistance.
- **Expression:** Weary.
- **Exact text:** “The rebellion has failed. Whatever I think of the Company, I cannot pretend another defeat has improved our position.”
- **Guard:** **Rebellion** must truly have failed, and “another” requires an earlier defeat. Not suitable for a generic repelled invasion.

### FB07-DEF-RUL-03 — Company-aligned local ruler

- **Event:** Genuine Company defence/suppression, and actual political alignment or dependent relationship with Company.
- **Expression:** Relieved but dry.
- **Exact text:** “The danger has passed for now. I suspect our protectors will expect us to express considerably more enthusiasm than relief.”
- **Guard:** Subjective expectation, not a recorded demand by Company advisers. Do not assign to a hostile ruler without grounds.

**Neutral alternative:** If the local ruler's allegiance is ambiguous, a restrained noncommittal reaction or silence is better than false gratitude.

## 5. Company loses a region

### FB07-LOSS-ARM-01 — Professional officer

- **Replace:** `army-loss-1` (“{region} has been lost. The physical reports record the Army consequences; they do not tell us the fate of every person.”)
- **Event:** Real Company loss of region and eligible associated Army adviser.
- **Voice:** Professional.
- **Expression:** Grim.
- **Exact text:** “We have lost the territory. I suggest we concern ourselves with what can still be defended.”

### FB07-LOSS-ARM-02 — Careerist officer

- **Event:** Real Company regional loss.
- **Voice:** Careerist, ambitious, responsibility-shifting.
- **Expression:** Defensive.
- **Exact text:** “A regrettable development. I should like to establish, before the correspondence begins, exactly whose responsibility this was.”
- **Guard:** Expresses intention, not a recorded letter or bureaucratic inquiry.

### FB07-LOSS-ARM-03 — Stunned officer

- **Event:** Company unexpectedly loses control of a region; adviser has prior experience/expectation of ongoing Company control.
- **Voice:** Previously overconfident adviser, shaken.
- **Expression:** Stunned.
- **Exact text:** “I had not expected to see the Company driven out. I find the experience has left me unusually short of advice.”
- **Guard:** The character's *surprise* is subjective; “driven out” refers to political loss, not proof that every soldier physically departed. With strict physical literalness, defer for review.

## 6. Failed rebellion

### FB07-REB-RUL-01 — Bitter defiance

- **Replace:** `ruler-rebellion-fail-1` when speaker is a ruler opposed to Company rule and actual rebellion failed.
- **Event:** Genuine failed rebellion; ruler's personal relationship supports hostility to Company.
- **Expression:** Bitter.
- **Exact text:** “They have won again. I wonder how many victories it will take before they understand why we keep fighting.”
- **Guard:** “Again” requires prior relevant Company success; “we” is rhetorical political alignment, not proof of personal command/participation.

### FB07-REB-RUL-02 — Cautious reassessment

- **Event:** Actual failed rebellion affecting ruler with meaningful concern about restoration/independence.
- **Expression:** Reflective.
- **Exact text:** “Another defeat. We must decide whether the cause is hopeless or merely our methods.”
- **Guard:** “Another” requires a real earlier defeat. No automatic formal strategy meeting is created.

### FB07-REB-RUL-03 — Exhausted hope

- **Event:** Actual failed rebellion; the character has an existing saved hope or ambition tied to its success.
- **Voice:** Worn or disillusioned ruler.
- **Expression:** Sad.
- **Exact text:** “I had almost allowed myself to hope.”
- **Guard:** The line is an authored new utterance of regret. Prefer an actual earlier saved expression of hope, not a generic assignment of emotion.

## 7. Short-form chronicler variant

### FB07-CH-ADM-01 — A shorter administrative satire

- **Event:** Actual failed Company administration; routine/low-impact incident, *not* severe civilian suffering or a major crisis.
- **Role:** Chronicler.
- **Expression:** Dry.
- **Exact text:** The initiative had failed. Responsibility was promptly referred to another department.
- **Guard:** The second sentence is ironic authorial framing, not proof that a real responsibility transfer/departmental meeting occurred. This is an alternative to, **not a silent rewrite of**, approved `CH-T02-03`.

## 8. Editorial length and pacing targets

| Element | Typical words |
| --- | --- |
| Routine chronicler observation | 10–25 |
| Routine character reaction | 8–25 |
| Major event observation | 20–45 |
| Important personal callback | 10–35 |
| Exceptional scene | Longer, when justified |

These are soft editorial preferences, not truncation rules. Do not cut an approved line mid-sentence to reach a word target. Use short-form alternatives when appropriate.

The narrative UI normally shows an authoritative game instruction separately, then a short chronicler observation and one or two relevant reactions. If a line is ineligible or would repeat too quickly, choose a better-supported candidate or remain quiet.

## Codex handoff

- Add stable IDs and source-parity tests for Collection 07. Preserve exact approved wording and the additional guarded prerequisites.
- Identify original fallbacks in `dist/narrative-content.js`, `dist/narrative-dialogue.js` and generated story traces. Replace **the worst recurring lines** in ordinary scenes, without deleting the source evidence or changing gameplay resolvers.
- Use relevant character relations and political posture to avoid incongruous reactions to Company-suppressed rebellions. Maintain separate situations for suppressed rebellion, generic defence, Company loss and successful independence.
- Preserve current-version saves, branch-safe Undo/Redo, saved exact chosen words, character identity and evidence. Do not reselect on render.
- Keep the approved authored Collections 01–05 untouched and do not activate longer personal scenes or unimplemented dynasty/career mechanics as part of fallback polish.
- Generate **genuine multi-turn** fixtures with enough meaningful incidents for cooldowns, developing political relations and thematic chapters. Label any manually injected test outcomes.
- Check narrative voice, repetition, long descriptions during routine play and portraits' future expression metadata.
- This document commits **creative approval only**. Technical integration still requires the user's implementation go-ahead.
