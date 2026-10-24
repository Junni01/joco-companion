# Collection 08B — approved fallback polish and final coda traces

Synthetic campaigns with actual gameplay resolvers, event-stack draws, phases, Parliament and committed chapter boundaries. Manual test events are explicitly labelled in the chronological journal and listed below. Every selected passage is shown beside its factual, personal and end-state evidence. This is material for human narrative review, not narrative-quality approval.

## possession-and-governance

Five actual turns: conquest → Tax → failed administration; explicitly dated continued government; failed anti-Company rebellion without an invented earlier hope; a quiet fourth turn; one final coda supported by the original ruler’s persistent hostile grievance. Narrative seed 808.

Manual test incidents: incident-20 / turn 3 / Manual event test · Leader.

### Turn 1 · A Kingdom and Its Accounts

Saved chapter:incident-10; substantial; ordinary end-of-turn account; 1 threads.

The Company had taken Bombay by force. Governing it proved a slower undertaking, although its demands for revenue arrived promptly.

Madhav of Bombay, who had lost the region to the Company, found little reason to revise his opinion after an unsuccessful attempt at administration. The Company still held Bombay. Its claim to understand the place was proving less secure.

#### CH08-01

Parameters: `{"regionId":"bombay","region":"Bombay","person":"Madhav of Bombay","characterId":"ruler-bombay"}`.

End state at `incident-10`: `{"region":"bombay","control":"company"}`.

**Evidence clause conquest-and-governance:** Military conquest was followed by a Tax demand and unsuccessful administration this turn.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-2/fact-0` · turn 1: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-3/fact-0` · turn 1: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- Closing state reference: `{"incidentId":"incident-10","region":"bombay","control":"company"}`.

**Evidence clause end-control:** The Company held the region at the close.
- `incident-3/fact-0` · turn 1: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- Closing state reference: `{"incidentId":"incident-10","region":"bombay","control":"company"}`.

**Evidence clause persistent-personal-judgment:** The same directly affected person retains a conquest grievance and an adverse administration assessment.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-2/fact-0` · turn 1: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-3/fact-0` · turn 1: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- Owned memory `memory:incident-1:fact-1:ruler-bombay:company-conquest`: Madhav of Bombay; direct; company-conquest; emotional importance at this close 100. Original opinion: I regard Company control in Bombay as a constraint on our court.
- Owned memory `memory:incident-3:fact-0:ruler-bombay:administration`: Madhav of Bombay; direct; administration; emotional importance at this close 35. Original opinion: I consider the recorded administration in Bombay personally significant.
- Personal relationship reason `cause:incident-3:ruler-bombay:institution:company:memory:incident-3:fact-0:ruler-bombay:administration`: deltas `{"hostility":5,"familiarity":3}`; administration in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Saved words `incident-1:line-1` by **Madhav of Bombay**: “A prudent ruler must distinguish between the battles he wishes to fight and those he may reasonably expect to win.”
- Closing state reference: `{"incidentId":"incident-10","region":"bombay","control":"company"}`.

### Turn 2 · Possession and Administration

Saved chapter:incident-19; substantial; ordinary end-of-turn account; 1 threads.

The Company had already taken Bombay. It could still demand revenue there; an attempt to administer the place was less successful. Its hold on the region survived the effort.

#### CH08-FACT-ADMIN-CONTINUED

Parameters: `{"regionId":"bombay","region":"Bombay","contextTurn":1}`.

End state at `incident-19`: `{"region":"bombay","control":"company"}`.

**Evidence clause ordered-governance:** Earlier conquest; this-turn Tax and failed administration; Company control at close.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-11/fact-0` · turn 2: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-12/fact-0` · turn 2: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- Closing state reference: `{"incidentId":"incident-19","region":"bombay","control":"company"}`.

### Turn 3 · What Remained

Saved chapter:incident-27; substantial; ordinary end-of-turn account; 1 threads.

The rebellion failed, and Company authority survived the turn. Madhav of Bombay's grievance survived it as well.

The chronicler could record the defeat; it could not, on that evidence alone, declare the old dispute settled.

#### CH08-04-FACTUAL

Parameters: `{"regionId":"bombay","region":"Bombay","person":"Madhav of Bombay","characterId":"ruler-bombay"}`.

End state at `incident-27`: `{"region":"bombay","control":"company"}`.

**Evidence clause actual-failed-rebellion:** An actual rebellion against Company rule failed this turn and Company authority survived to the close.
- `incident-20/fact-0` · turn 3: `{"factId":"fact-0","type":"battle","kind":"company-defence","region":"bombay","presidency":"bombay","base":0,"unrest":2,"strength":2,"defence":2,"won":true,"key":"leader","stage":"primary"}`.
- Closing state reference: `{"incidentId":"incident-27","region":"bombay","control":"company"}`.

**Evidence clause owned-unresolved-grievance:** This directly affected character retains a sourced conquest grievance.
- `incident-20/fact-0` · turn 3: `{"factId":"fact-0","type":"battle","kind":"company-defence","region":"bombay","presidency":"bombay","base":0,"unrest":2,"strength":2,"defence":2,"won":true,"key":"leader","stage":"primary"}`.
- Owned memory `memory:incident-20:fact-0:ruler-bombay:company-defence`: Madhav of Bombay; direct; company-defence; emotional importance at this close 43. Original opinion: I regard the Company's successful defence in Bombay with caution; its continued control does not settle our grievances.
- Owned memory `memory:incident-1:fact-1:ruler-bombay:company-conquest`: Madhav of Bombay; direct; company-conquest; emotional importance at this close 100. Original opinion: I regard Company control in Bombay as a constraint on our court.
- Closing state reference: `{"incidentId":"incident-27","region":"bombay","control":"company"}`.

### Turn 4 · Turn 4 closes

Saved chapter:incident-34; quiet; ordinary end-of-turn account; 0 threads.

*No substantial chapter. The complete chronological journal remains available.*

### Turn 5 · Possession and Agreement

Saved chapter:incident-41; substantial; final closing account; 1 threads.

The campaign ended with the Company still holding Bombay. Madhav of Bombay’s grievance had outlived the conquest that made it. The chronicler could record possession. Agreement was another matter.

#### CH08-FINAL-GRIEVANCE

Parameters: `{"regionId":"bombay","region":"Bombay","person":"Madhav of Bombay","characterId":"ruler-bombay"}`.

End state at `incident-41`: `{"region":"bombay","control":"company"}`.

**Evidence clause earlier-personal-loss:** This named ruler held the relevant seat at an earlier-turn conquest, established by his own direct local memory and saved words.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- Owned memory `memory:incident-1:fact-1:ruler-bombay:company-conquest`: Madhav of Bombay; direct; company-conquest; emotional importance at this close 100. Original opinion: I regard Company control in Bombay as a constraint on our court.
- Personal relationship reason `cause:incident-1:ruler-bombay:institution:company:memory:incident-1:fact-1:ruler-bombay:company-conquest`: deltas `{"hostility":21,"mistrust":6,"familiarity":3}`; company conquest in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Saved words `incident-1:line-1` by **Madhav of Bombay**: “A prudent ruler must distinguish between the battles he wishes to fight and those he may reasonably expect to win.”
- Closing state reference: `{"incidentId":"incident-41","region":"bombay","control":"company"}`.

**Evidence clause unresolved-at-ending:** An active conquest grievance and sourced current hostile posture survive at game end; no unsupported current reassessment is interpreted.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- `incident-2/fact-0` · turn 1: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-3/fact-0` · turn 1: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- `incident-11/fact-0` · turn 2: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-12/fact-0` · turn 2: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- Owned memory `memory:incident-1:fact-1:ruler-bombay:company-conquest`: Madhav of Bombay; direct; company-conquest; emotional importance at this close 100. Original opinion: I regard Company control in Bombay as a constraint on our court.
- Personal relationship reason `cause:incident-1:ruler-bombay:institution:company:memory:incident-1:fact-1:ruler-bombay:company-conquest`: deltas `{"hostility":21,"mistrust":6,"familiarity":3}`; company conquest in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-2:ruler-bombay:institution:company:memory:incident-2:fact-0:ruler-bombay:tax`: deltas `{"hostility":3,"familiarity":3}`; tax in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-3:ruler-bombay:institution:company:memory:incident-3:fact-0:ruler-bombay:administration`: deltas `{"hostility":5,"familiarity":3}`; administration in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-11:ruler-bombay:institution:company:memory:incident-11:fact-0:ruler-bombay:tax`: deltas `{"hostility":3,"familiarity":3}`; tax in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-12:ruler-bombay:institution:company:memory:incident-12:fact-0:ruler-bombay:administration`: deltas `{"hostility":4,"familiarity":3}`; administration in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Closing state reference: `{"incidentId":"incident-41","region":"bombay","control":"company"}`.

**Evidence clause final-possession:** The Company controls this region at the committed game-end boundary.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- Closing state reference: `{"incidentId":"incident-41","region":"bombay","control":"company"}`.

**Final coda check:** {"companyControl":"company","originalRuler":"ruler-bombay","conquestTurn":1,"currentEmotionalImportance":100,"currentAssessment":null,"selected":true}

## commercial-memory

Five actual turns, narrative seed 808, cautious secretary and persistent taxation pressure. The same commercial opportunity and same person support the first full CH08-02; later developments use dated/narrower material or a quiet page rather than repeating its paragraph.

Manual test incidents: incident-5 / turn 1 / Manual event test · Turmoil; incident-7 / turn 1 / Manual event test · Turmoil; incident-19 / turn 2 / Manual event test · Turmoil; incident-21 / turn 2 / Manual event test · Turmoil; incident-33 / turn 3 / Manual event test · Turmoil; incident-35 / turn 3 / Manual event test · Turmoil; incident-47 / turn 4 / Manual event test · Turmoil; incident-49 / turn 4 / Manual event test · Turmoil; incident-61 / turn 5 / Manual event test · Turmoil; incident-63 / turn 5 / Manual event test · Turmoil.

### Turn 1 · The Opening and Closing of Bombay

Saved chapter:incident-15; substantial; ordinary end-of-turn account; 1 threads.

A trading opportunity in Bombay was disrupted and restored, then disrupted again. On each occasion the Company recovered access. On each occasion it found that access rather less permanent than its officials had hoped.

Edward Hale had initially greeted the restoration with confidence. By the turn's end, his announcements had grown more cautious. The commercial opportunity remained available; his faith in its staying that way had not survived the same sequence.

#### CH08-02

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n","person":"Edward Hale","characterId":"secretary-bombay"}`.

End state at `incident-15`: `{"region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause same-opportunity-cycles:** Two ordered disruption/restoration cycles concern this same opportunity this turn.
- `incident-5/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-6/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-7/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-8/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- Closing state reference: `{"incidentId":"incident-15","region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause personal-change:** The same secretary saved hopeful words and a later cautious reassessment.
- `incident-5/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-6/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-7/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-8/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- Owned memory `memory:incident-6:fact-1:secretary-bombay:intervention`: Edward Hale; indirect; intervention; emotional importance at this close 40. Original opinion: I welcome the recorded restoration of order in Bombay, without treating every earlier grievance as settled.
- Owned memory `memory:incident-8:fact-1:secretary-bombay:intervention`: Edward Hale; indirect; intervention; emotional importance at this close 28. Original opinion: I welcome the recorded restoration of order in Bombay, without treating every earlier grievance as settled.
- Saved words `incident-6:line-3` by **Edward Hale**: “Commerce has resumed. I sincerely hope this marks the beginning of a more stable arrangement.”
- Saved words `incident-8:line-2` by **Edward Hale**: “We have restored commercial access once more. I shall be rather more cautious in predicting how long it will last.”
- Closing state reference: `{"incidentId":"incident-15","region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause available-at-close:** The specific opportunity was available at the close.
- `incident-8/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- Closing state reference: `{"incidentId":"incident-15","region":"bombay","orderId":"bo3n","available":true}`.

### Turn 2 · Possession and Administration

Saved chapter:incident-29; substantial; ordinary end-of-turn account; 1 threads.

The Company had already taken Bombay. It could still demand revenue there; an attempt to administer the place was less successful. Its hold on the region survived the effort.

#### CH08-FACT-ADMIN-CONTINUED

Parameters: `{"regionId":"bombay","region":"Bombay","contextTurn":1}`.

End state at `incident-29`: `{"region":"bombay","control":"company"}`.

**Evidence clause ordered-governance:** Earlier conquest; this-turn Tax and failed administration; Company control at close.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-16/fact-0` · turn 2: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-18/fact-0` · turn 2: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- Closing state reference: `{"incidentId":"incident-29","region":"bombay","control":"company"}`.

### Turn 3 · Commercial Access

Saved chapter:incident-43; substantial; ordinary end-of-turn account; 1 threads.

A trading opportunity in Bombay was interrupted, then restored. The Company had regained an opening. What might pass through it remained a separate question.

#### CH08-FACT-TRADE-OPEN

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n","contextTurn":3}`.

End state at `incident-43`: `{"region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause commercial-ending:** This turn restored a specific commercial opportunity; it was available at the close.
- `incident-35/fact-0` · turn 3: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-36/fact-1` · turn 3: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- Closing state reference: `{"incidentId":"incident-43","region":"bombay","orderId":"bo3n","available":true}`.

### Turn 4 · An Interrupted Recovery

Saved chapter:incident-57; substantial; ordinary end-of-turn account; 1 threads.

The Company regained a commercial opening in Bombay, only to see it disrupted again. The recovery was real; its duration less impressive.

#### CH08-FACT-TRADE-RECLOSED

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n"}`.

End state at `incident-57`: `{"region":"bombay","orderId":"bo3n","available":false}`.

**Evidence clause reversed-recovery:** A this-turn restoration was followed by renewed disruption of this opportunity.
- `incident-50/fact-1` · turn 4: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-54/fact-4` · turn 4: `{"factId":"fact-4","type":"order-closed","region":"bombay","order":"bo3n","cascadeFrom":"punjab"}`.
- Closing state reference: `{"incidentId":"incident-57","region":"bombay","orderId":"bo3n","available":false}`.

### Turn 5 · Possession and Agreement

Saved chapter:incident-71; substantial; final closing account; 1 threads.

The campaign ended with the Company still holding Bombay. Madhav of Bombay’s grievance had outlived the conquest that made it. The chronicler could record possession. Agreement was another matter.

#### CH08-FINAL-GRIEVANCE

Parameters: `{"regionId":"bombay","region":"Bombay","person":"Madhav of Bombay","characterId":"ruler-bombay"}`.

End state at `incident-71`: `{"region":"bombay","control":"company"}`.

**Evidence clause earlier-personal-loss:** This named ruler held the relevant seat at an earlier-turn conquest, established by his own direct local memory and saved words.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- Owned memory `memory:incident-1:fact-1:ruler-bombay:company-conquest`: Madhav of Bombay; direct; company-conquest; emotional importance at this close 70. Original opinion: I regard Company control in Bombay as a constraint on our court.
- Personal relationship reason `cause:incident-1:ruler-bombay:institution:company:memory:incident-1:fact-1:ruler-bombay:company-conquest`: deltas `{"hostility":21,"mistrust":6,"familiarity":3}`; company conquest in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Saved words `incident-1:line-1` by **Madhav of Bombay**: “The Company has won today. I shall be interested to learn whether it has also acquired the wisdom to make use of its victory.”
- Closing state reference: `{"incidentId":"incident-71","region":"bombay","control":"company"}`.

**Evidence clause unresolved-at-ending:** An active conquest grievance and sourced current hostile posture survive at game end; no unsupported current reassessment is interpreted.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- `incident-2/fact-0` · turn 1: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-3/fact-0` · turn 1: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":2,"unrest":1}`.
- `incident-3/fact-1` · turn 1: `{"factId":"fact-1","type":"unrest","region":"bombay","amount":1,"cause":"tax","reason":null}`.
- `incident-4/fact-0` · turn 1: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- `incident-6/fact-0` · turn 1: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-6/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-8/fact-0` · turn 1: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-8/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-16/fact-0` · turn 2: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-17/fact-0` · turn 2: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":2,"unrest":1}`.
- `incident-17/fact-1` · turn 2: `{"factId":"fact-1","type":"unrest","region":"bombay","amount":1,"cause":"tax","reason":null}`.
- `incident-18/fact-0` · turn 2: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- `incident-20/fact-0` · turn 2: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-20/fact-1` · turn 2: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-22/fact-0` · turn 2: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-22/fact-1` · turn 2: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-30/fact-0` · turn 3: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-31/fact-0` · turn 3: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":2,"unrest":1}`.
- `incident-31/fact-1` · turn 3: `{"factId":"fact-1","type":"unrest","region":"bombay","amount":1,"cause":"tax","reason":null}`.
- `incident-32/fact-0` · turn 3: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- `incident-34/fact-0` · turn 3: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-34/fact-1` · turn 3: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-36/fact-0` · turn 3: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-36/fact-1` · turn 3: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-44/fact-0` · turn 4: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-45/fact-0` · turn 4: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":2,"unrest":1}`.
- `incident-45/fact-1` · turn 4: `{"factId":"fact-1","type":"unrest","region":"bombay","amount":1,"cause":"tax","reason":null}`.
- `incident-46/fact-0` · turn 4: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- `incident-48/fact-0` · turn 4: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-48/fact-1` · turn 4: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-50/fact-0` · turn 4: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-50/fact-1` · turn 4: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-58/fact-0` · turn 5: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-59/fact-0` · turn 5: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":2,"unrest":1}`.
- `incident-59/fact-1` · turn 5: `{"factId":"fact-1","type":"unrest","region":"bombay","amount":1,"cause":"tax","reason":null}`.
- `incident-60/fact-0` · turn 5: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- `incident-62/fact-0` · turn 5: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-62/fact-1` · turn 5: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-64/fact-0` · turn 5: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-64/fact-1` · turn 5: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- Owned memory `memory:incident-1:fact-1:ruler-bombay:company-conquest`: Madhav of Bombay; direct; company-conquest; emotional importance at this close 70. Original opinion: I regard Company control in Bombay as a constraint on our court.
- Personal relationship reason `cause:incident-1:ruler-bombay:institution:company:memory:incident-1:fact-1:ruler-bombay:company-conquest`: deltas `{"hostility":21,"mistrust":6,"familiarity":3}`; company conquest in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-2:ruler-bombay:institution:company:memory:incident-2:fact-0:ruler-bombay:tax`: deltas `{"hostility":3,"familiarity":3}`; tax in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-3:ruler-bombay:institution:company:memory:incident-3:fact-0:ruler-bombay:tax-repeat`: deltas `{"hostility":6,"mistrust":2,"familiarity":3}`; tax repeat in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-4:ruler-bombay:institution:company:memory:incident-4:fact-0:ruler-bombay:administration`: deltas `{"hostility":5,"familiarity":3}`; administration in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-6:ruler-bombay:institution:company:memory:incident-6:fact-1:ruler-bombay:intervention`: deltas `{"hostility":-6,"respect":4,"gratitude":9,"familiarity":3}`; intervention in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-8:ruler-bombay:institution:company:memory:incident-8:fact-1:ruler-bombay:intervention`: deltas `{"hostility":-7,"respect":4,"gratitude":8,"familiarity":3}`; intervention in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-16:ruler-bombay:institution:company:memory:incident-16:fact-0:ruler-bombay:tax`: deltas `{"hostility":3,"familiarity":3}`; tax in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-17:ruler-bombay:institution:company:memory:incident-17:fact-0:ruler-bombay:tax-repeat`: deltas `{"hostility":6,"mistrust":2,"familiarity":2}`; tax repeat in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-18:ruler-bombay:institution:company:memory:incident-18:fact-0:ruler-bombay:administration`: deltas `{"hostility":5,"familiarity":2}`; administration in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-20:ruler-bombay:institution:company:memory:incident-20:fact-1:ruler-bombay:intervention`: deltas `{"hostility":-7,"respect":4,"gratitude":8,"familiarity":2}`; intervention in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-22:ruler-bombay:institution:company:memory:incident-22:fact-1:ruler-bombay:intervention`: deltas `{"hostility":-6,"respect":4,"gratitude":7,"familiarity":2}`; intervention in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-30:ruler-bombay:institution:company:memory:incident-30:fact-0:ruler-bombay:tax`: deltas `{"hostility":3,"familiarity":2}`; tax in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-31:ruler-bombay:institution:company:memory:incident-31:fact-0:ruler-bombay:tax-repeat`: deltas `{"hostility":6,"mistrust":2,"familiarity":2}`; tax repeat in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-32:ruler-bombay:institution:company:memory:incident-32:fact-0:ruler-bombay:administration`: deltas `{"hostility":4,"familiarity":2}`; administration in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-34:ruler-bombay:institution:company:memory:incident-34:fact-1:ruler-bombay:intervention`: deltas `{"hostility":-7,"respect":3,"gratitude":7,"familiarity":2}`; intervention in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-36:ruler-bombay:institution:company:memory:incident-36:fact-1:ruler-bombay:intervention`: deltas `{"hostility":-6,"respect":3,"gratitude":6,"familiarity":2}`; intervention in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-44:ruler-bombay:institution:company:memory:incident-44:fact-0:ruler-bombay:tax`: deltas `{"hostility":3,"familiarity":2}`; tax in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-45:ruler-bombay:institution:company:memory:incident-45:fact-0:ruler-bombay:tax-repeat`: deltas `{"hostility":6,"mistrust":2,"familiarity":2}`; tax repeat in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-46:ruler-bombay:institution:company:memory:incident-46:fact-0:ruler-bombay:administration`: deltas `{"hostility":4,"familiarity":2}`; administration in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-48:ruler-bombay:institution:company:memory:incident-48:fact-1:ruler-bombay:intervention`: deltas `{"hostility":-6,"respect":3,"gratitude":6,"familiarity":2}`; intervention in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-50:ruler-bombay:institution:company:memory:incident-50:fact-1:ruler-bombay:intervention`: deltas `{"hostility":-6,"respect":3,"gratitude":5,"familiarity":2}`; intervention in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-58:ruler-bombay:institution:company:memory:incident-58:fact-0:ruler-bombay:tax`: deltas `{"hostility":4,"familiarity":2}`; tax in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-59:ruler-bombay:institution:company:memory:incident-59:fact-0:ruler-bombay:tax-repeat`: deltas `{"hostility":6,"mistrust":2,"familiarity":2}`; tax repeat in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-60:ruler-bombay:institution:company:memory:incident-60:fact-0:ruler-bombay:administration`: deltas `{"hostility":4,"familiarity":2}`; administration in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-62:ruler-bombay:institution:company:memory:incident-62:fact-1:ruler-bombay:intervention`: deltas `{"hostility":-7,"respect":3,"gratitude":5,"familiarity":2}`; intervention in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Personal relationship reason `cause:incident-64:ruler-bombay:institution:company:memory:incident-64:fact-1:ruler-bombay:intervention`: deltas `{"hostility":-6,"respect":3,"gratitude":5,"familiarity":2}`; intervention in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Closing state reference: `{"incidentId":"incident-71","region":"bombay","control":"company"}`.

**Evidence clause final-possession:** The Company controls this region at the committed game-end boundary.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- Closing state reference: `{"incidentId":"incident-71","region":"bombay","control":"company"}`.

**Final coda check:** {"companyControl":"company","originalRuler":"ruler-bombay","conquestTurn":1,"currentEmotionalImportance":70,"currentAssessment":null,"selected":true}

## useful-partner-is-not-protection-proof

Five actual turns, narrative seed 808, repeated beneficial interventions without repeated Tax pressure. The tempting CH08-03 is correctly withheld: an actually useful partner is not automatically evidence of valuing protection or an expectation of thanks.

Manual test incidents: incident-2 / turn 1 / Manual event test · Turmoil; incident-4 / turn 1 / Manual event test · Turmoil; incident-13 / turn 2 / Manual event test · Turmoil; incident-15 / turn 2 / Manual event test · Turmoil; incident-24 / turn 3 / Manual event test · Turmoil; incident-26 / turn 3 / Manual event test · Turmoil; incident-35 / turn 4 / Manual event test · Turmoil; incident-37 / turn 4 / Manual event test · Turmoil; incident-46 / turn 5 / Manual event test · Turmoil; incident-48 / turn 5 / Manual event test · Turmoil.

### Turn 1 · The Opening and Closing of Bombay

Saved chapter:incident-12; substantial; ordinary end-of-turn account; 1 threads.

A trading opportunity in Bombay was disrupted and restored, then disrupted again. On each occasion the Company recovered access. On each occasion it found that access rather less permanent than its officials had hoped.

Edward Hale had initially greeted the restoration with confidence. By the turn's end, his announcements had grown more cautious. The commercial opportunity remained available; his faith in its staying that way had not survived the same sequence.

#### CH08-02

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n","person":"Edward Hale","characterId":"secretary-bombay"}`.

End state at `incident-12`: `{"region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause same-opportunity-cycles:** Two ordered disruption/restoration cycles concern this same opportunity this turn.
- `incident-2/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-3/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-4/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-5/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- Closing state reference: `{"incidentId":"incident-12","region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause personal-change:** The same secretary saved hopeful words and a later cautious reassessment.
- `incident-2/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-3/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-4/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-5/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- Owned memory `memory:incident-3:fact-1:secretary-bombay:intervention`: Edward Hale; indirect; intervention; emotional importance at this close 40. Original opinion: I welcome the recorded restoration of order in Bombay, without treating every earlier grievance as settled.
- Owned memory `memory:incident-5:fact-1:secretary-bombay:intervention`: Edward Hale; indirect; intervention; emotional importance at this close 28. Original opinion: I welcome the recorded restoration of order in Bombay, without treating every earlier grievance as settled.
- Saved words `incident-3:line-3` by **Edward Hale**: “Commerce has resumed. I sincerely hope this marks the beginning of a more stable arrangement.”
- Saved words `incident-5:line-2` by **Edward Hale**: “We have restored commercial access once more. I shall be rather more cautious in predicting how long it will last.”
- Closing state reference: `{"incidentId":"incident-12","region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause available-at-close:** The specific opportunity was available at the close.
- `incident-5/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- Closing state reference: `{"incidentId":"incident-12","region":"bombay","orderId":"bo3n","available":true}`.

### Turn 2 · Commercial Access

Saved chapter:incident-23; substantial; ordinary end-of-turn account; 1 threads.

A trading opportunity in Bombay was interrupted, then restored. The Company had regained an opening. What might pass through it remained a separate question.

#### CH08-FACT-TRADE-OPEN

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n","contextTurn":2}`.

End state at `incident-23`: `{"region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause commercial-ending:** This turn restored a specific commercial opportunity; it was available at the close.
- `incident-15/fact-0` · turn 2: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-16/fact-1` · turn 2: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- Closing state reference: `{"incidentId":"incident-23","region":"bombay","orderId":"bo3n","available":true}`.

### Turn 3 · Turn 3 closes

Saved chapter:incident-34; quiet; ordinary end-of-turn account; 0 threads.

*No substantial chapter. The complete chronological journal remains available.*

### Turn 4 · An Interrupted Recovery

Saved chapter:incident-45; substantial; ordinary end-of-turn account; 1 threads.

The Company regained a commercial opening in Bombay, only to see it disrupted again. The recovery was real; its duration less impressive.

#### CH08-FACT-TRADE-RECLOSED

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n"}`.

End state at `incident-45`: `{"region":"bombay","orderId":"bo3n","available":false}`.

**Evidence clause reversed-recovery:** A this-turn restoration was followed by renewed disruption of this opportunity.
- `incident-38/fact-1` · turn 4: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-42/fact-4` · turn 4: `{"factId":"fact-4","type":"order-closed","region":"bombay","order":"bo3n","cascadeFrom":"punjab"}`.
- Closing state reference: `{"incidentId":"incident-45","region":"bombay","orderId":"bo3n","available":false}`.

### Turn 5 · Turn 5 closes

Saved chapter:incident-56; quiet; final closing account; 0 threads.

*No substantial chapter. The complete chronological journal remains available.*

**Final coda check:** {"companyControl":"company","originalRuler":"ruler-bombay","conquestTurn":1,"currentEmotionalImportance":0,"currentAssessment":null,"selected":false}

## commercial-fallbacks

Five actual turns: baseline-closed opportunity restored by Envoy; an interruption restored in a later turn; a new same-turn interruption/restoration; quiet fourth turn; final-turn conquest followed by a real failed Company defence and loss. The final coda is correctly withheld: no earlier-turn conquest and no ending possession.

Manual test incidents: incident-2 / turn 1 / Manual event test · Turmoil; incident-18 / turn 3 / Manual event test · Turmoil; incident-36 / turn 5 / Manual event test · Leader.

### Turn 1 · Commercial Access

Saved chapter:incident-9; substantial; ordinary end-of-turn account; 1 threads.

A trading opportunity in Bombay became available once more. The Company had an opening; the outcome of any venture through it was another matter.

#### CH08-FACT-RESTORED

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3s"}`.

End state at `incident-9`: `{"region":"bombay","orderId":"bo3s","available":true}`.

**Evidence clause commercial-ending:** This turn restored a specific commercial opportunity; it was available at the close.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"order-opened","region":"bombay","order":"bo3s"}`.
- Closing state reference: `{"incidentId":"incident-9","region":"bombay","orderId":"bo3s","available":true}`.

### Turn 2 · Commercial Access

Saved chapter:incident-17; substantial; ordinary end-of-turn account; 1 threads.

The earlier interruption of a trading opportunity in Bombay was reversed. The opening remained available; the Company would have to make its own use of it.

#### CH08-FACT-TRADE-CONTINUED

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n","contextTurn":1}`.

End state at `incident-17`: `{"region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause commercial-ending:** This turn restored a specific commercial opportunity; it was available at the close.
- `incident-2/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-10/fact-0` · turn 2: `{"factId":"fact-0","type":"order-opened","region":"bombay","order":"bo3n"}`.
- Closing state reference: `{"incidentId":"incident-17","region":"bombay","orderId":"bo3n","available":true}`.

### Turn 3 · Commercial Access

Saved chapter:incident-26; substantial; ordinary end-of-turn account; 1 threads.

A trading opportunity in Bombay was interrupted, then restored. The Company had regained an opening. What might pass through it remained a separate question.

#### CH08-FACT-TRADE-OPEN

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n","contextTurn":3}`.

End state at `incident-26`: `{"region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause commercial-ending:** This turn restored a specific commercial opportunity; it was available at the close.
- `incident-18/fact-0` · turn 3: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-19/fact-0` · turn 3: `{"factId":"fact-0","type":"order-opened","region":"bombay","order":"bo3n"}`.
- Closing state reference: `{"incidentId":"incident-26","region":"bombay","orderId":"bo3n","available":true}`.

### Turn 4 · Turn 4 closes

Saved chapter:incident-33; quiet; ordinary end-of-turn account; 0 threads.

*No substantial chapter. The complete chronological journal remains available.*

### Turn 5 · Changing Authority

Saved chapter:incident-43; substantial; final closing account; 1 threads.

The Company lost Bombay and had not recovered it by the close. The account of its authority there could no longer be written in the present tense.

#### CH08-FACT-LOSS

Parameters: `{"regionId":"bombay","region":"Bombay"}`.

End state at `incident-43`: `{"region":"bombay","control":"indian"}`.

**Evidence clause current-loss:** Company control was lost this turn and had not returned at the close.
- `incident-36/fact-1` · turn 5: `{"factId":"fact-1","type":"company-loss","region":"bombay","presidency":"bombay","removed":0}`.
- Closing state reference: `{"incidentId":"incident-43","region":"bombay","control":"indian"}`.

**Final coda check:** {"companyControl":"indian","originalRuler":"ruler-bombay","conquestTurn":5,"currentEmotionalImportance":100,"currentAssessment":null,"selected":false}

## ending-possession-lost

Five actual turns sharing the governance chain, but legal failed administration and a manually triggered successful rebellion occur during the last turn. The original grievance survives, but ending Company possession does not. The coda must be withheld.

Manual test incidents: incident-20 / turn 3 / Manual event test · Leader; incident-36 / turn 5 / Manual event test · Leader.

### Turn 1 · A Kingdom and Its Accounts

Saved chapter:incident-10; substantial; ordinary end-of-turn account; 1 threads.

The Company had taken Bombay by force. Governing it proved a slower undertaking, although its demands for revenue arrived promptly.

Madhav of Bombay, who had lost the region to the Company, found little reason to revise his opinion after an unsuccessful attempt at administration. The Company still held Bombay. Its claim to understand the place was proving less secure.

#### CH08-01

Parameters: `{"regionId":"bombay","region":"Bombay","person":"Madhav of Bombay","characterId":"ruler-bombay"}`.

End state at `incident-10`: `{"region":"bombay","control":"company"}`.

**Evidence clause conquest-and-governance:** Military conquest was followed by a Tax demand and unsuccessful administration this turn.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-2/fact-0` · turn 1: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-3/fact-0` · turn 1: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- Closing state reference: `{"incidentId":"incident-10","region":"bombay","control":"company"}`.

**Evidence clause end-control:** The Company held the region at the close.
- `incident-3/fact-0` · turn 1: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- Closing state reference: `{"incidentId":"incident-10","region":"bombay","control":"company"}`.

**Evidence clause persistent-personal-judgment:** The same directly affected person retains a conquest grievance and an adverse administration assessment.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-2/fact-0` · turn 1: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-3/fact-0` · turn 1: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- Owned memory `memory:incident-1:fact-1:ruler-bombay:company-conquest`: Madhav of Bombay; direct; company-conquest; emotional importance at this close 100. Original opinion: I regard Company control in Bombay as a constraint on our court.
- Owned memory `memory:incident-3:fact-0:ruler-bombay:administration`: Madhav of Bombay; direct; administration; emotional importance at this close 35. Original opinion: I consider the recorded administration in Bombay personally significant.
- Personal relationship reason `cause:incident-3:ruler-bombay:institution:company:memory:incident-3:fact-0:ruler-bombay:administration`: deltas `{"hostility":5,"familiarity":3}`; administration in Bombay; this is Madhav of Bombay's assessment, not a claim about hidden orders.
- Saved words `incident-1:line-1` by **Madhav of Bombay**: “A prudent ruler must distinguish between the battles he wishes to fight and those he may reasonably expect to win.”
- Closing state reference: `{"incidentId":"incident-10","region":"bombay","control":"company"}`.

### Turn 2 · Possession and Administration

Saved chapter:incident-19; substantial; ordinary end-of-turn account; 1 threads.

The Company had already taken Bombay. It could still demand revenue there; an attempt to administer the place was less successful. Its hold on the region survived the effort.

#### CH08-FACT-ADMIN-CONTINUED

Parameters: `{"regionId":"bombay","region":"Bombay","contextTurn":1}`.

End state at `incident-19`: `{"region":"bombay","control":"company"}`.

**Evidence clause ordered-governance:** Earlier conquest; this-turn Tax and failed administration; Company control at close.
- `incident-1/fact-1` · turn 1: `{"factId":"fact-1","type":"company-conquest","region":"bombay","army":"bombay","lootConsumed":true}`.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"deployment","region":"bombay","army":"bombay","outcome":"success","officers":2,"regiments":12,"losses":0,"alliances":[]}`.
- `incident-11/fact-0` · turn 2: `{"factId":"fact-0","type":"tax","region":"bombay","mode":"governor","ordinal":1,"unrest":0}`.
- `incident-12/fact-0` · turn 2: `{"factId":"fact-0","type":"unrest","region":"bombay","amount":1,"cause":"unrest","reason":"failure"}`.
- Closing state reference: `{"incidentId":"incident-19","region":"bombay","control":"company"}`.

### Turn 3 · What Remained

Saved chapter:incident-27; substantial; ordinary end-of-turn account; 1 threads.

The rebellion failed, and Company authority survived the turn. Madhav of Bombay's grievance survived it as well.

The chronicler could record the defeat; it could not, on that evidence alone, declare the old dispute settled.

#### CH08-04-FACTUAL

Parameters: `{"regionId":"bombay","region":"Bombay","person":"Madhav of Bombay","characterId":"ruler-bombay"}`.

End state at `incident-27`: `{"region":"bombay","control":"company"}`.

**Evidence clause actual-failed-rebellion:** An actual rebellion against Company rule failed this turn and Company authority survived to the close.
- `incident-20/fact-0` · turn 3: `{"factId":"fact-0","type":"battle","kind":"company-defence","region":"bombay","presidency":"bombay","base":0,"unrest":2,"strength":2,"defence":2,"won":true,"key":"leader","stage":"primary"}`.
- Closing state reference: `{"incidentId":"incident-27","region":"bombay","control":"company"}`.

**Evidence clause owned-unresolved-grievance:** This directly affected character retains a sourced conquest grievance.
- `incident-20/fact-0` · turn 3: `{"factId":"fact-0","type":"battle","kind":"company-defence","region":"bombay","presidency":"bombay","base":0,"unrest":2,"strength":2,"defence":2,"won":true,"key":"leader","stage":"primary"}`.
- Owned memory `memory:incident-20:fact-0:ruler-bombay:company-defence`: Madhav of Bombay; direct; company-defence; emotional importance at this close 43. Original opinion: I regard the Company's successful defence in Bombay with caution; its continued control does not settle our grievances.
- Owned memory `memory:incident-1:fact-1:ruler-bombay:company-conquest`: Madhav of Bombay; direct; company-conquest; emotional importance at this close 100. Original opinion: I regard Company control in Bombay as a constraint on our court.
- Closing state reference: `{"incidentId":"incident-27","region":"bombay","control":"company"}`.

### Turn 4 · Turn 4 closes

Saved chapter:incident-34; quiet; ordinary end-of-turn account; 0 threads.

*No substantial chapter. The complete chronological journal remains available.*

### Turn 5 · Changing Authority

Saved chapter:incident-43; substantial; final closing account; 1 threads.

The Company lost Bombay and had not recovered it by the close. The account of its authority there could no longer be written in the present tense.

#### CH08-FACT-LOSS

Parameters: `{"regionId":"bombay","region":"Bombay"}`.

End state at `incident-43`: `{"region":"bombay","control":"indian"}`.

**Evidence clause current-loss:** Company control was lost this turn and had not returned at the close.
- `incident-36/fact-1` · turn 5: `{"factId":"fact-1","type":"company-loss","region":"bombay","presidency":"bombay","removed":0}`.
- Closing state reference: `{"incidentId":"incident-43","region":"bombay","control":"indian"}`.

**Final coda check:** {"companyControl":"indian","originalRuler":"ruler-bombay","conquestTurn":1,"currentEmotionalImportance":100,"currentAssessment":null,"selected":false}

## diplomatic-memory

Five actual turns outside Company control, with real Special Envoy openings. No conquest, completed sale or military protection is invented for the commercial passage.

Manual test incidents: incident-1 / turn 1 / Manual event test · Turmoil; incident-3 / turn 1 / Manual event test · Turmoil; incident-12 / turn 2 / Manual event test · Turmoil; incident-14 / turn 2 / Manual event test · Turmoil; incident-23 / turn 3 / Manual event test · Turmoil; incident-25 / turn 3 / Manual event test · Turmoil; incident-34 / turn 4 / Manual event test · Turmoil; incident-36 / turn 4 / Manual event test · Turmoil; incident-45 / turn 5 / Manual event test · Turmoil; incident-47 / turn 5 / Manual event test · Turmoil.

### Turn 1 · The Opening and Closing of Bombay

Saved chapter:incident-11; substantial; ordinary end-of-turn account; 1 threads.

A trading opportunity in Bombay was disrupted and restored, then disrupted again. On each occasion the Company recovered access. On each occasion it found that access rather less permanent than its officials had hoped.

Edward Hale had initially greeted the restoration with confidence. By the turn's end, his announcements had grown more cautious. The commercial opportunity remained available; his faith in its staying that way had not survived the same sequence.

#### CH08-02

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n","person":"Edward Hale","characterId":"secretary-bombay"}`.

End state at `incident-11`: `{"region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause same-opportunity-cycles:** Two ordered disruption/restoration cycles concern this same opportunity this turn.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-2/fact-0` · turn 1: `{"factId":"fact-0","type":"order-opened","region":"bombay","order":"bo3n"}`.
- `incident-3/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-4/fact-0` · turn 1: `{"factId":"fact-0","type":"order-opened","region":"bombay","order":"bo3n"}`.
- Closing state reference: `{"incidentId":"incident-11","region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause personal-change:** The same secretary saved hopeful words and a later cautious reassessment.
- `incident-1/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-2/fact-0` · turn 1: `{"factId":"fact-0","type":"order-opened","region":"bombay","order":"bo3n"}`.
- `incident-3/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-4/fact-0` · turn 1: `{"factId":"fact-0","type":"order-opened","region":"bombay","order":"bo3n"}`.
- Owned memory `memory:incident-2:fact-0:secretary-bombay:trade-diplomacy`: Edward Hale; indirect; trade-diplomacy; emotional importance at this close 25. Original supported-observation: Commercial access in Bombay improved. This does not establish a completed sale, payment or political agreement.
- Owned memory `memory:incident-4:fact-0:secretary-bombay:trade-diplomacy`: Edward Hale; indirect; trade-diplomacy; emotional importance at this close 13. Original supported-observation: Commercial access in Bombay improved. This does not establish a completed sale, payment or political agreement.
- Saved words `incident-2:line-2` by **Edward Hale**: “Commerce has resumed. I sincerely hope this marks the beginning of a more stable arrangement.”
- Saved words `incident-4:line-2` by **Edward Hale**: “We have restored commercial access once more. I shall be rather more cautious in predicting how long it will last.”
- Closing state reference: `{"incidentId":"incident-11","region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause available-at-close:** The specific opportunity was available at the close.
- `incident-4/fact-0` · turn 1: `{"factId":"fact-0","type":"order-opened","region":"bombay","order":"bo3n"}`.
- Closing state reference: `{"incidentId":"incident-11","region":"bombay","orderId":"bo3n","available":true}`.

### Turn 2 · Commercial Access

Saved chapter:incident-22; substantial; ordinary end-of-turn account; 1 threads.

A trading opportunity in Bombay was interrupted, then restored. The Company had regained an opening. What might pass through it remained a separate question.

#### CH08-FACT-TRADE-OPEN

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n","contextTurn":2}`.

End state at `incident-22`: `{"region":"bombay","orderId":"bo3n","available":true}`.

**Evidence clause commercial-ending:** This turn restored a specific commercial opportunity; it was available at the close.
- `incident-14/fact-0` · turn 2: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- `incident-15/fact-0` · turn 2: `{"factId":"fact-0","type":"order-opened","region":"bombay","order":"bo3n"}`.
- Closing state reference: `{"incidentId":"incident-22","region":"bombay","orderId":"bo3n","available":true}`.

### Turn 3 · Turn 3 closes

Saved chapter:incident-33; quiet; ordinary end-of-turn account; 0 threads.

*No substantial chapter. The complete chronological journal remains available.*

### Turn 4 · An Interrupted Recovery

Saved chapter:incident-44; substantial; ordinary end-of-turn account; 1 threads.

The Company regained a commercial opening in Bombay, only to see it disrupted again. The recovery was real; its duration less impressive.

#### CH08-FACT-TRADE-RECLOSED

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n"}`.

End state at `incident-44`: `{"region":"bombay","orderId":"bo3n","available":false}`.

**Evidence clause reversed-recovery:** A this-turn restoration was followed by renewed disruption of this opportunity.
- `incident-37/fact-0` · turn 4: `{"factId":"fact-0","type":"order-opened","region":"bombay","order":"bo3n"}`.
- `incident-41/fact-4` · turn 4: `{"factId":"fact-4","type":"order-closed","region":"bombay","order":"bo3n","cascadeFrom":"punjab"}`.
- Closing state reference: `{"incidentId":"incident-44","region":"bombay","orderId":"bo3n","available":false}`.

### Turn 5 · Turn 5 closes

Saved chapter:incident-55; quiet; final closing account; 0 threads.

*No substantial chapter. The complete chronological journal remains available.*

**Final coda check:** {"companyControl":"indian","currentAssessment":null,"selected":false}

## reclosed-before-the-chapter

One completed turn, not a finished campaign: additional explicitly manual Turmoil reverses the restored opportunity before closing. The attractive available-at-close CH08-02 must be rejected.

Manual test incidents: incident-2 / turn 1 / Manual event test · Turmoil; incident-4 / turn 1 / Manual event test · Turmoil; incident-12 / turn 1 / Manual event test · Turmoil.

### Turn 1 · An Interrupted Recovery

Saved chapter:incident-13; substantial; ordinary end-of-turn account; 1 threads.

The Company regained a commercial opening in Bombay, only to see it disrupted again. The recovery was real; its duration less impressive.

#### CH08-FACT-TRADE-RECLOSED

Parameters: `{"regionId":"bombay","region":"Bombay","orderId":"bo3n"}`.

End state at `incident-13`: `{"region":"bombay","orderId":"bo3n","available":false}`.

**Evidence clause reversed-recovery:** A this-turn restoration was followed by renewed disruption of this opportunity.
- `incident-5/fact-1` · turn 1: `{"factId":"fact-1","type":"intervention","region":"bombay","army":"bombay"}`.
- `incident-12/fact-0` · turn 1: `{"factId":"fact-0","type":"order-closed","region":"bombay","order":"bo3n"}`.
- Closing state reference: `{"incidentId":"incident-13","region":"bombay","orderId":"bo3n","available":false}`.
