# Approved dialogue — representative campaign traces

Synthetic campaigns using actual gameplay resolvers. No personal saves or historical quotations. Fixed seeds and supplied physical outcomes make these review fixtures reproducible. Exact approved wording is retained. Ordinary presentation is one chronicler and up to two reactions; this trace includes every saved voice. Existing M2 fallbacks remain labelled by their original template IDs.

## story-1710

Seed 1234. Normal reported conquest, Tax, administrative failure, intervention and renewed unrest. Existing exact assurance callbacks remain part of this sequence.

### incident-1 · Turn 1 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; company-conquest / bombay.

**Chronicler** · `CH-C01` · approved collection
The Company had arrived to conduct business. Unfortunately for the local rulers, it had developed an increasingly generous interpretation of the word.

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Govind of Bombay** · `RU-M04-05` · approved collection
“The Company has won today. I shall be interested to learn whether it has also acquired the wisdom to make use of its victory.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Thomas Avery** · `AD-M04-08` · approved collection
“I trust the directors will appreciate that fortune favours the bold. Particularly those bold enough to submit a detailed account of their own achievements.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

### incident-2 · Turn 1 · Bombay · Tax 1 this turn

Canonical facts: tax / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-2/fact-0.

**Govind of Bombay** · `CB-C-TAX-02` · approved collection
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-2/fact-0.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Govind of Bombay; direct; source incident-1/fact-1.

**Henry Hale** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-2/fact-0.

### incident-3 · Turn 1 · Bombay · Unsuccessful Administer

Canonical facts: unrest / bombay.

**Chronicler** · `CH-R03-01` · approved collection
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-3/fact-0.

**Govind of Bombay** · `RU-R03-01` · approved collection
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-3/fact-0.

**Henry Hale** · `AD-T02-03` · approved collection
“The policy was perfectly sound. Its implementation was regrettably entrusted to people who attempted to carry it out.”

Current evidence: incident-3/fact-0.

### incident-4 · Turn 1 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; intervention / bombay.

**Chronicler** · `chronicler-deploy-v1` · existing M2 fallback
The Company intervention in Bombay cleared its unrest.

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Henry Hale** · `m2-assurance-unrest` · existing M2 fallback
The unrest in Bombay has been cleared. I hope the improvement lasts.

Current evidence: incident-4/fact-1.

**Govind of Bombay** · `ruler-intervention-1` · existing M2 fallback
The intervention in Bombay is complete. Restoring order does not settle every grievance.

Current evidence: incident-4/fact-1.

### incident-5 · Turn 1 · Bombay · Tax 2 this turn

Canonical facts: tax / bombay; unrest / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 1 unrest added. A familiar demand has acquired a fresh entry.

Current evidence: incident-5/fact-0, incident-5/fact-1.

**Govind of Bombay** · `m2-quote-assurance` · existing M2 fallback
“The unrest in Bombay has been cleared. I hope the improvement lasts.” Henry Hale was hopeful about the earlier improvement. The new unrest in Bombay calls for a fresh assessment.

Current evidence: incident-5/fact-0.
Saved quotation: `statement:incident-4:line-1` — The unrest in Bombay has been cleared. I hope the improvement lasts.

**Henry Hale** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-5/fact-0, incident-5/fact-1.

## story-1758

Seed 1234. Normal reported conquest, Tax, administrative failure, intervention and renewed unrest. Existing exact assurance callbacks remain part of this sequence.

### incident-1 · Turn 3 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; company-conquest / bombay.

**Chronicler** · `CH-C01` · approved collection
The Company had arrived to conduct business. Unfortunately for the local rulers, it had developed an increasingly generous interpretation of the word.

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Govind of Bombay** · `RU-M04-05` · approved collection
“The Company has won today. I shall be interested to learn whether it has also acquired the wisdom to make use of its victory.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Thomas Avery** · `AD-M04-08` · approved collection
“I trust the directors will appreciate that fortune favours the bold. Particularly those bold enough to submit a detailed account of their own achievements.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

### incident-2 · Turn 3 · Bombay · Tax 1 this turn

Canonical facts: tax / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-2/fact-0.

**Govind of Bombay** · `CB-C-TAX-02` · approved collection
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-2/fact-0.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Govind of Bombay; direct; source incident-1/fact-1.

**Henry Hale** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-2/fact-0.

### incident-3 · Turn 3 · Bombay · Unsuccessful Administer

Canonical facts: unrest / bombay.

**Chronicler** · `CH-R03-01` · approved collection
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-3/fact-0.

**Govind of Bombay** · `RU-R03-01` · approved collection
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-3/fact-0.

**Henry Hale** · `AD-T02-03` · approved collection
“The policy was perfectly sound. Its implementation was regrettably entrusted to people who attempted to carry it out.”

Current evidence: incident-3/fact-0.

### incident-4 · Turn 3 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; intervention / bombay.

**Chronicler** · `chronicler-deploy-v1` · existing M2 fallback
The Company intervention in Bombay cleared its unrest.

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Henry Hale** · `m2-assurance-unrest` · existing M2 fallback
The unrest in Bombay has been cleared. I hope the improvement lasts.

Current evidence: incident-4/fact-1.

**Govind of Bombay** · `ruler-intervention-1` · existing M2 fallback
The intervention in Bombay is complete. Restoring order does not settle every grievance.

Current evidence: incident-4/fact-1.

### incident-5 · Turn 3 · Bombay · Tax 2 this turn

Canonical facts: tax / bombay; unrest / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 1 unrest added. A familiar demand has acquired a fresh entry.

Current evidence: incident-5/fact-0, incident-5/fact-1.

**Govind of Bombay** · `m2-quote-assurance` · existing M2 fallback
“The unrest in Bombay has been cleared. I hope the improvement lasts.” Henry Hale was hopeful about the earlier improvement. The new unrest in Bombay calls for a fresh assessment.

Current evidence: incident-5/fact-0.
Saved quotation: `statement:incident-4:line-1` — The unrest in Bombay has been cleared. I hope the improvement lasts.

**Henry Hale** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-5/fact-0, incident-5/fact-1.

## story-1813

Seed 1234. Normal reported conquest, Tax, administrative failure, intervention and renewed unrest. Existing exact assurance callbacks remain part of this sequence.

### incident-1 · Turn 5 · Army of Bombay → Hyderabad: success; 0 officer losses.

Canonical facts: deployment / hyderabad / success; company-conquest / hyderabad.

**Chronicler** · `CH-C01` · approved collection
The Company had arrived to conduct business. Unfortunately for the local rulers, it had developed an increasingly generous interpretation of the word.

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Yusuf of Hyderabad** · `RC-V02` · approved collection
“The Company believes this matter concluded. I admire its confidence.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Thomas Avery** · `AD-M04-08` · approved collection
“I trust the directors will appreciate that fortune favours the bold. Particularly those bold enough to submit a detailed account of their own achievements.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

### incident-2 · Turn 5 · Hyderabad · Governor General Tax

Canonical facts: tax / hyderabad; unrest / hyderabad.

**Chronicler** · `CH-R03-01` · approved collection
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-2/fact-0, incident-2/fact-1.

**Yusuf of Hyderabad** · `CB-T02-03` · approved collection
“First they took my kingdom. Now they demand that I contribute to its upkeep.”

Current evidence: incident-2/fact-0, incident-2/fact-1.
Callback: `memory:incident-1:fact-1:ruler-hyderabad:company-conquest`; owner Yusuf of Hyderabad; direct; source incident-1/fact-1.

**Arthur Pembroke** · `secretary-tax-1` · existing M2 fallback
The Tax has been recorded. The payment remains a matter for the physical table.

Current evidence: incident-2/fact-0.

### incident-3 · Turn 5 · Governor General · Govern check

Canonical facts: unrest / bengal; unrest / bombay; unrest / hyderabad; unrest / madras.

**Chronicler** · `chronicler-govern-v1` · existing M2 fallback
Bengal: Governor General failure recorded; 1 unrest added. Bombay: Governor General failure recorded; 1 unrest added. Hyderabad: Governor General failure recorded; 1 unrest added. Madras: Governor General failure recorded; 1 unrest added.

Current evidence: incident-3/fact-0, incident-3/fact-1, incident-3/fact-2, incident-3/fact-3.

**Yusuf of Hyderabad** · `RU-R03-02` · approved collection
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-3/fact-2.

**Nasir of Bengal** · `RU-R03-02` · approved collection
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-3/fact-0.

**Govind of Bombay** · `RU-R03-01` · approved collection
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-3/fact-1.

**Mansur of Madras** · `RU-R03-02` · approved collection
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-3/fact-3.

**Arthur Pembroke** · `secretary-admin-1` · existing M2 fallback
The recorded result has been circulated. We have retained room for the replies.

Current evidence: incident-3/fact-0.

### incident-4 · Turn 5 · Army of Bombay → Hyderabad: success; 0 officer losses.

Canonical facts: deployment / hyderabad / success; intervention / hyderabad.

**Chronicler** · `chronicler-deploy-v1` · existing M2 fallback
The Company intervention in Hyderabad cleared its unrest.

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Arthur Pembroke** · `m2-assurance-unrest` · existing M2 fallback
The unrest in Hyderabad has been cleared. I hope the improvement lasts.

Current evidence: incident-4/fact-1.

**Yusuf of Hyderabad** · `ruler-intervention-1` · existing M2 fallback
The intervention in Hyderabad is complete. Restoring order does not settle every grievance.

Current evidence: incident-4/fact-1.

### incident-5 · Turn 5 · Governor General · Govern check

Canonical facts: unrest / bengal; unrest / bombay; unrest / hyderabad; unrest / madras.

**Chronicler** · `chronicler-govern-v1` · existing M2 fallback
Bengal: Governor General failure recorded; 1 unrest added. Bombay: Governor General failure recorded; 1 unrest added. Hyderabad: Governor General failure recorded; 1 unrest added. Madras: Governor General failure recorded; 1 unrest added.

Current evidence: incident-5/fact-0, incident-5/fact-1, incident-5/fact-2, incident-5/fact-3.

**Yusuf of Hyderabad** · `m2-quote-assurance` · existing M2 fallback
“The unrest in Hyderabad has been cleared. I hope the improvement lasts.” Arthur Pembroke was hopeful about the earlier improvement. The new unrest in Hyderabad calls for a fresh assessment.

Current evidence: incident-5/fact-2.
Saved quotation: `statement:incident-4:line-1` — The unrest in Hyderabad has been cleared. I hope the improvement lasts.

**Nasir of Bengal** · `ruler-admin-1` · existing M2 fallback
The administration in Bengal has produced another matter for the court to consider.

Current evidence: incident-5/fact-0.

**Govind of Bombay** · `RU-R03-02` · approved collection
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-5/fact-1.

**Mansur of Madras** · `ruler-admin-1` · existing M2 fallback
The administration in Madras has produced another matter for the court to consider.

Current evidence: incident-5/fact-3.

**Arthur Pembroke** · `m2-secretary-admin-2` · existing M2 fallback
The result in Bengal is recorded. The instructions and the explanation remain separate matters.

Current evidence: incident-5/fact-0.

## story-1710-long

Seed 1234. Normal reported conquest, Tax, administrative failure, intervention and renewed unrest. Existing exact assurance callbacks remain part of this sequence.

### incident-1 · Turn 1 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; company-conquest / bombay.

**Chronicler** · `CH-C01` · approved collection
The Company had arrived to conduct business. Unfortunately for the local rulers, it had developed an increasingly generous interpretation of the word.

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Govind of Bombay** · `RU-M04-05` · approved collection
“The Company has won today. I shall be interested to learn whether it has also acquired the wisdom to make use of its victory.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Thomas Avery** · `AD-M04-08` · approved collection
“I trust the directors will appreciate that fortune favours the bold. Particularly those bold enough to submit a detailed account of their own achievements.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

### incident-2 · Turn 1 · Bombay · Tax 1 this turn

Canonical facts: tax / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-2/fact-0.

**Govind of Bombay** · `CB-C-TAX-02` · approved collection
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-2/fact-0.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Govind of Bombay; direct; source incident-1/fact-1.

**Henry Hale** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-2/fact-0.

### incident-3 · Turn 1 · Bombay · Unsuccessful Administer

Canonical facts: unrest / bombay.

**Chronicler** · `CH-R03-01` · approved collection
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-3/fact-0.

**Govind of Bombay** · `RU-R03-01` · approved collection
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-3/fact-0.

**Henry Hale** · `AD-T02-03` · approved collection
“The policy was perfectly sound. Its implementation was regrettably entrusted to people who attempted to carry it out.”

Current evidence: incident-3/fact-0.

### incident-4 · Turn 1 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; intervention / bombay.

**Chronicler** · `chronicler-deploy-v1` · existing M2 fallback
The Company intervention in Bombay cleared its unrest.

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Henry Hale** · `m2-assurance-unrest` · existing M2 fallback
The unrest in Bombay has been cleared. I hope the improvement lasts.

Current evidence: incident-4/fact-1.

**Govind of Bombay** · `ruler-intervention-1` · existing M2 fallback
The intervention in Bombay is complete. Restoring order does not settle every grievance.

Current evidence: incident-4/fact-1.

### incident-5 · Turn 1 · Bombay · Tax 2 this turn

Canonical facts: tax / bombay; unrest / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 1 unrest added. A familiar demand has acquired a fresh entry.

Current evidence: incident-5/fact-0, incident-5/fact-1.

**Govind of Bombay** · `m2-quote-assurance` · existing M2 fallback
“The unrest in Bombay has been cleared. I hope the improvement lasts.” Henry Hale was hopeful about the earlier improvement. The new unrest in Bombay calls for a fresh assessment.

Current evidence: incident-5/fact-0.
Saved quotation: `statement:incident-4:line-1` — The unrest in Bombay has been cleared. I hope the improvement lasts.

**Henry Hale** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-5/fact-0, incident-5/fact-1.

## personality-proud

Seed 4321. Initial fictional proud ruler profile (pride=90; other core traits=20), a cautious professional Army adviser and vain secretary are explicitly selected test personas. No campaign history is injected. Conquest → two Taxes → genuinely suppressed rebellion → actual unsuccessful administration → genuine Company loss to rebellion → failed attempt to reconquer. Leader events are explicitly manual-test event resolution with supplied defence outcomes, never inferred from unrest.

### incident-1 · Turn 1 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; company-conquest / bombay.

**Chronicler** · `CH-C03` · approved collection
The dispute had been settled by force of arms, a method of negotiation in which the Company had recently acquired considerable confidence.

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Madhav of Bombay** · `RU-M04-05` · approved collection
“The Company has won today. I shall be interested to learn whether it has also acquired the wisdom to make use of its victory.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Thomas Finch** · `AC-C04` · approved collection
“The territory is taken. Keeping it may prove less straightforward.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

### incident-2 · Turn 1 · Bombay · Tax 1 this turn

Canonical facts: tax / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-2/fact-0.

**Madhav of Bombay** · `CB-C-TAX-02` · approved collection
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-2/fact-0.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Madhav of Bombay; direct; source incident-1/fact-1.

**Edward Avery** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-2/fact-0.

### incident-3 · Turn 1 · Bombay · Tax 2 this turn

Canonical facts: tax / bombay; unrest / bombay.

**Chronicler** · `CH-R03-01` · approved collection
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-3/fact-0, incident-3/fact-1.

**Madhav of Bombay** · `ruler-tax-repeat-1` · existing M2 fallback
Another Tax in Bombay. The demand is familiar; familiarity has not made it welcome.

Current evidence: incident-3/fact-0.

**Edward Avery** · `secretary-tax-1` · existing M2 fallback
The Tax has been recorded. The payment remains a matter for the physical table.

Current evidence: incident-3/fact-0.

### incident-4 · Turn 1 · Manual event test · Leader

Canonical facts: battle / bombay / company-defence; unrest-cleared / bombay.

**Chronicler** · `CH-R03-03` · approved collection
The rebellion had failed. Its causes, being considerably more difficult to defeat than its participants, remained.

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Madhav of Bombay** · `ruler-defence-1` · existing M2 fallback
The attack on Bombay has been repelled. For the moment, our arrangements remain.

Current evidence: incident-4/fact-0.

**Thomas Finch** · `AD-R03-05` · approved collection
“We have suppressed the rebellion. That does not mean we have settled the matter.”

Current evidence: incident-4/fact-0, incident-4/fact-1.

### incident-5 · Turn 1 · Bombay · Unsuccessful Administer

Canonical facts: unrest / bombay.

**Chronicler** · `CH-T02-03` · approved collection
The Company's latest initiative had failed. Fortunately, its administrative structure ensured that responsibility could be distributed so widely that nobody was required to accept any.

Current evidence: incident-5/fact-0.

**Madhav of Bombay** · `m2-callback-company-conquest-administration` · existing M2 fallback
The Company took control of Bombay. This administrative setback gives our court another reason to remember.

Current evidence: incident-5/fact-0.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Madhav of Bombay; direct; source incident-1/fact-1.

**Edward Avery** · `AD-T02-03` · approved collection
“The policy was perfectly sound. Its implementation was regrettably entrusted to people who attempted to carry it out.”

Current evidence: incident-5/fact-0.

### incident-6 · Turn 1 · Manual event test · Leader

Canonical facts: battle / bombay / company-defence; company-loss / bombay; unrest-cleared / bombay; order-closed / bombay; order-closed / bombay; order-closed / bombay.

**Chronicler** · `CH-R03-02` · approved collection
The Company had lost control of the territory. Its officials were expected to describe the development as temporary, although the inhabitants appeared determined to make it permanent.

Current evidence: incident-6/fact-0, incident-6/fact-1, incident-6/fact-2, incident-6/fact-3, incident-6/fact-4, incident-6/fact-5.

**Madhav of Bombay** · `CB-R03-01` · approved collection
“The Company was very eager to explain why my kingdom no longer belonged to me. I look forward to hearing its explanation of why it no longer belongs to them.”

Current evidence: incident-6/fact-0, incident-6/fact-1, incident-6/fact-2, incident-6/fact-3, incident-6/fact-4, incident-6/fact-5.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Madhav of Bombay; direct; source incident-1/fact-1.

**Thomas Finch** · `army-loss-1` · existing M2 fallback
Bombay has been lost. The physical reports record the Army consequences; they do not tell us the fate of every person.

Current evidence: incident-6/fact-1.

### incident-7 · Turn 1 · Army of Bombay → Bombay: failure; 0 officer losses.

Canonical facts: deployment / bombay / failure.

**Chronicler** · `CH-M04-01` · approved collection
The expedition had been undertaken with every expectation of success. The Company's expectations, unfortunately, had not been consulted by the enemy.

Current evidence: incident-7/fact-0.

**Madhav of Bombay** · `ruler-deploy-failure-1` · existing M2 fallback
The expedition has failed to change the position in Bombay. We shall not mistake that for a permanent settlement.

Current evidence: incident-7/fact-0.

**Thomas Finch** · `AD-M04-03` · approved collection
“We failed. I suggest we begin with that fact, however unpleasant the gentlemen in London may find it.”

Current evidence: incident-7/fact-0.

## personality-cautious

Seed 4321. Initial fictional cautious ruler profile (caution=90; other core traits=20), a cautious professional Army adviser and vain secretary are explicitly selected test personas. No campaign history is injected. Conquest → two Taxes → genuinely suppressed rebellion → actual unsuccessful administration → genuine Company loss to rebellion → failed attempt to reconquer. Leader events are explicitly manual-test event resolution with supplied defence outcomes, never inferred from unrest.

### incident-1 · Turn 1 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; company-conquest / bombay.

**Chronicler** · `CH-C03` · approved collection
The dispute had been settled by force of arms, a method of negotiation in which the Company had recently acquired considerable confidence.

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Madhav of Bombay** · `RC-D02` · approved collection
“A prudent ruler must distinguish between the battles he wishes to fight and those he may reasonably expect to win.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Thomas Finch** · `AC-C04` · approved collection
“The territory is taken. Keeping it may prove less straightforward.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

### incident-2 · Turn 1 · Bombay · Tax 1 this turn

Canonical facts: tax / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-2/fact-0.

**Madhav of Bombay** · `CB-C-TAX-03` · approved collection
“Their demands are becoming easier to predict. I wish I could say the same of their intentions.”

Current evidence: incident-2/fact-0.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Madhav of Bombay; direct; source incident-1/fact-1.

**Edward Avery** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-2/fact-0.

### incident-3 · Turn 1 · Bombay · Tax 2 this turn

Canonical facts: tax / bombay; unrest / bombay.

**Chronicler** · `CH-R03-01` · approved collection
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-3/fact-0, incident-3/fact-1.

**Madhav of Bombay** · `RU-R03-02` · approved collection
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-3/fact-0, incident-3/fact-1.

**Edward Avery** · `secretary-tax-1` · existing M2 fallback
The Tax has been recorded. The payment remains a matter for the physical table.

Current evidence: incident-3/fact-0.

### incident-4 · Turn 1 · Manual event test · Leader

Canonical facts: battle / bombay / company-defence; unrest-cleared / bombay.

**Chronicler** · `CH-R03-03` · approved collection
The rebellion had failed. Its causes, being considerably more difficult to defeat than its participants, remained.

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Madhav of Bombay** · `ruler-defence-1` · existing M2 fallback
The attack on Bombay has been repelled. For the moment, our arrangements remain.

Current evidence: incident-4/fact-0.

**Thomas Finch** · `AD-R03-05` · approved collection
“We have suppressed the rebellion. That does not mean we have settled the matter.”

Current evidence: incident-4/fact-0, incident-4/fact-1.

### incident-5 · Turn 1 · Bombay · Unsuccessful Administer

Canonical facts: unrest / bombay.

**Chronicler** · `CH-T02-03` · approved collection
The Company's latest initiative had failed. Fortunately, its administrative structure ensured that responsibility could be distributed so widely that nobody was required to accept any.

Current evidence: incident-5/fact-0.

**Madhav of Bombay** · `m2-callback-company-conquest-administration` · existing M2 fallback
The Company took control of Bombay. This administrative setback gives our court another reason to remember.

Current evidence: incident-5/fact-0.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Madhav of Bombay; direct; source incident-1/fact-1.

**Edward Avery** · `AD-T02-03` · approved collection
“The policy was perfectly sound. Its implementation was regrettably entrusted to people who attempted to carry it out.”

Current evidence: incident-5/fact-0.

### incident-6 · Turn 1 · Manual event test · Leader

Canonical facts: battle / bombay / company-defence; company-loss / bombay; unrest-cleared / bombay; order-closed / bombay; order-closed / bombay; order-closed / bombay.

**Chronicler** · `CH-R03-02` · approved collection
The Company had lost control of the territory. Its officials were expected to describe the development as temporary, although the inhabitants appeared determined to make it permanent.

Current evidence: incident-6/fact-0, incident-6/fact-1, incident-6/fact-2, incident-6/fact-3, incident-6/fact-4, incident-6/fact-5.

**Madhav of Bombay** · `CB-C-REB-03` · approved collection
“Independence has been recovered. I suggest we resist the temptation to mistake it for permanence.”

Current evidence: incident-6/fact-0, incident-6/fact-1, incident-6/fact-2, incident-6/fact-3, incident-6/fact-4, incident-6/fact-5.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Madhav of Bombay; direct; source incident-1/fact-1.

**Thomas Finch** · `army-loss-1` · existing M2 fallback
Bombay has been lost. The physical reports record the Army consequences; they do not tell us the fate of every person.

Current evidence: incident-6/fact-1.

### incident-7 · Turn 1 · Army of Bombay → Bombay: failure; 0 officer losses.

Canonical facts: deployment / bombay / failure.

**Chronicler** · `CH-M04-01` · approved collection
The expedition had been undertaken with every expectation of success. The Company's expectations, unfortunately, had not been consulted by the enemy.

Current evidence: incident-7/fact-0.

**Madhav of Bombay** · `ruler-deploy-failure-1` · existing M2 fallback
The expedition has failed to change the position in Bombay. We shall not mistake that for a permanent settlement.

Current evidence: incident-7/fact-0.

**Thomas Finch** · `AD-M04-03` · approved collection
“We failed. I suggest we begin with that fact, however unpleasant the gentlemen in London may find it.”

Current evidence: incident-7/fact-0.

## personality-vindictive

Seed 4321. Initial fictional vindictive ruler profile (vindictiveness=90; other core traits=20), a cautious professional Army adviser and vain secretary are explicitly selected test personas. No campaign history is injected. Conquest → two Taxes → genuinely suppressed rebellion → actual unsuccessful administration → genuine Company loss to rebellion → failed attempt to reconquer. Leader events are explicitly manual-test event resolution with supplied defence outcomes, never inferred from unrest.

### incident-1 · Turn 1 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; company-conquest / bombay.

**Chronicler** · `CH-C03` · approved collection
The dispute had been settled by force of arms, a method of negotiation in which the Company had recently acquired considerable confidence.

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Madhav of Bombay** · `RC-V02` · approved collection
“The Company believes this matter concluded. I admire its confidence.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Thomas Finch** · `AC-C04` · approved collection
“The territory is taken. Keeping it may prove less straightforward.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

### incident-2 · Turn 1 · Bombay · Tax 1 this turn

Canonical facts: tax / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-2/fact-0.

**Madhav of Bombay** · `CB-C-TAX-01` · approved collection
“They took the kingdom. Now they send the bill.”

Current evidence: incident-2/fact-0.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Madhav of Bombay; direct; source incident-1/fact-1.

**Edward Avery** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-2/fact-0.

### incident-3 · Turn 1 · Bombay · Tax 2 this turn

Canonical facts: tax / bombay; unrest / bombay.

**Chronicler** · `CH-R03-01` · approved collection
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-3/fact-0, incident-3/fact-1.

**Madhav of Bombay** · `ruler-tax-repeat-1` · existing M2 fallback
Another Tax in Bombay. The demand is familiar; familiarity has not made it welcome.

Current evidence: incident-3/fact-0.

**Edward Avery** · `secretary-tax-1` · existing M2 fallback
The Tax has been recorded. The payment remains a matter for the physical table.

Current evidence: incident-3/fact-0.

### incident-4 · Turn 1 · Manual event test · Leader

Canonical facts: battle / bombay / company-defence; unrest-cleared / bombay.

**Chronicler** · `CH-R03-03` · approved collection
The rebellion had failed. Its causes, being considerably more difficult to defeat than its participants, remained.

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Madhav of Bombay** · `ruler-defence-1` · existing M2 fallback
The attack on Bombay has been repelled. For the moment, our arrangements remain.

Current evidence: incident-4/fact-0.

**Thomas Finch** · `AD-R03-05` · approved collection
“We have suppressed the rebellion. That does not mean we have settled the matter.”

Current evidence: incident-4/fact-0, incident-4/fact-1.

### incident-5 · Turn 1 · Bombay · Unsuccessful Administer

Canonical facts: unrest / bombay.

**Chronicler** · `CH-T02-03` · approved collection
The Company's latest initiative had failed. Fortunately, its administrative structure ensured that responsibility could be distributed so widely that nobody was required to accept any.

Current evidence: incident-5/fact-0.

**Madhav of Bombay** · `m2-callback-company-conquest-administration` · existing M2 fallback
The Company took control of Bombay. This administrative setback gives our court another reason to remember.

Current evidence: incident-5/fact-0.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Madhav of Bombay; direct; source incident-1/fact-1.

**Edward Avery** · `AD-T02-03` · approved collection
“The policy was perfectly sound. Its implementation was regrettably entrusted to people who attempted to carry it out.”

Current evidence: incident-5/fact-0.

### incident-6 · Turn 1 · Manual event test · Leader

Canonical facts: battle / bombay / company-defence; company-loss / bombay; unrest-cleared / bombay; order-closed / bombay; order-closed / bombay; order-closed / bombay.

**Chronicler** · `CH-R03-02` · approved collection
The Company had lost control of the territory. Its officials were expected to describe the development as temporary, although the inhabitants appeared determined to make it permanent.

Current evidence: incident-6/fact-0, incident-6/fact-1, incident-6/fact-2, incident-6/fact-3, incident-6/fact-4, incident-6/fact-5.

**Madhav of Bombay** · `CB-R03-01` · approved collection
“The Company was very eager to explain why my kingdom no longer belonged to me. I look forward to hearing its explanation of why it no longer belongs to them.”

Current evidence: incident-6/fact-0, incident-6/fact-1, incident-6/fact-2, incident-6/fact-3, incident-6/fact-4, incident-6/fact-5.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Madhav of Bombay; direct; source incident-1/fact-1.

**Thomas Finch** · `army-loss-1` · existing M2 fallback
Bombay has been lost. The physical reports record the Army consequences; they do not tell us the fate of every person.

Current evidence: incident-6/fact-1.

### incident-7 · Turn 1 · Army of Bombay → Bombay: failure; 0 officer losses.

Canonical facts: deployment / bombay / failure.

**Chronicler** · `CH-M04-01` · approved collection
The expedition had been undertaken with every expectation of success. The Company's expectations, unfortunately, had not been consulted by the enemy.

Current evidence: incident-7/fact-0.

**Madhav of Bombay** · `CB-C-FAIL-02` · approved collection
“Their previous success appears to have encouraged certain unfortunate assumptions.”

Current evidence: incident-7/fact-0.
Callback: `memory:incident-1:fact-1:ruler-bombay:company-conquest`; owner Madhav of Bombay; direct; source incident-1/fact-1.

**Thomas Finch** · `AD-M04-03` · approved collection
“We failed. I suggest we begin with that fact, however unpleasant the gentlemen in London may find it.”

Current evidence: incident-7/fact-0.

## military-professional

Seed 2468. Initial fictional professional Army adviser profile (caution=90; other core traits=20). Actual failed attack → actual successful conquest → Tax callback → repeat Tax/unrest → explicitly reported catastrophic intervention with one officer loss (no named death). No further deployment is attempted after catastrophe. No command, weather, retreat or casualty circumstances are invented.

### incident-1 · Turn 1 · Army of Bombay → Bombay: failure; 0 officer losses.

Canonical facts: deployment / bombay / failure.

**Chronicler** · `CH-M04-01` · approved collection
The expedition had been undertaken with every expectation of success. The Company's expectations, unfortunately, had not been consulted by the enemy.

Current evidence: incident-1/fact-0.

**Narayan of Bombay** · `ruler-deploy-failure-1` · existing M2 fallback
The expedition has failed to change the position in Bombay. We shall not mistake that for a permanent settlement.

Current evidence: incident-1/fact-0.

**Thomas Reed** · `AD-M04-03` · approved collection
“We failed. I suggest we begin with that fact, however unpleasant the gentlemen in London may find it.”

Current evidence: incident-1/fact-0.

### incident-2 · Turn 1 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; company-conquest / bombay.

**Chronicler** · `CH-C04` · approved collection
The Company had taken possession of the territory. Explaining why this was necessary would occupy considerably more time than the conquest itself.

Current evidence: incident-2/fact-0, incident-2/fact-1.

**Narayan of Bombay** · `RC-V02` · approved collection
“The Company believes this matter concluded. I admire its confidence.”

Current evidence: incident-2/fact-0, incident-2/fact-1.

**Thomas Reed** · `AC-C04` · approved collection
“The territory is taken. Keeping it may prove less straightforward.”

Current evidence: incident-2/fact-0, incident-2/fact-1.

### incident-3 · Turn 1 · Bombay · Tax 1 this turn

Canonical facts: tax / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-3/fact-0.

**Narayan of Bombay** · `RU-T02-02` · approved collection
“Your directors are welcome to my treasury. I only ask that they leave enough for me to purchase it back.”

Current evidence: incident-3/fact-0.
Callback: `memory:incident-2:fact-1:ruler-bombay:company-conquest`; owner Narayan of Bombay; direct; source incident-2/fact-1.

**Thomas Avery** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-3/fact-0.

### incident-4 · Turn 1 · Bombay · Tax 2 this turn

Canonical facts: tax / bombay; unrest / bombay.

**Chronicler** · `CH-R03-01` · approved collection
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Narayan of Bombay** · `RU-R03-01` · approved collection
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Thomas Avery** · `secretary-tax-1` · existing M2 fallback
The Tax has been recorded. The payment remains a matter for the physical table.

Current evidence: incident-4/fact-0.

### incident-5 · Turn 1 · Army of Bombay → Bombay: catastrophic failure; 1 officer losses.

Canonical facts: deployment / bombay / catastrophe.

**Chronicler** · `CH-M04-02` · approved collection
The expedition had ended disastrously. Its architects were already preparing explanations, an undertaking for which they appeared considerably better equipped.

Current evidence: incident-5/fact-0.

**Narayan of Bombay** · `ruler-deploy-failure-1` · existing M2 fallback
The expedition has failed to change the position in Bombay. We shall not mistake that for a permanent settlement.

Current evidence: incident-5/fact-0.

**Thomas Reed** · `army-deploy-failure-1` · existing M2 fallback
The expedition has failed. A shorter report would not improve its outcome.

Current evidence: incident-5/fact-0.

## military-overconfident

Seed 2468. Initial fictional overconfident Army adviser profile (pride=90; other core traits=20). Actual failed attack → actual successful conquest → Tax callback → repeat Tax/unrest → explicitly reported catastrophic intervention with one officer loss (no named death). No further deployment is attempted after catastrophe. No command, weather, retreat or casualty circumstances are invented.

### incident-1 · Turn 1 · Army of Bombay → Bombay: failure; 0 officer losses.

Canonical facts: deployment / bombay / failure.

**Chronicler** · `CH-M04-01` · approved collection
The expedition had been undertaken with every expectation of success. The Company's expectations, unfortunately, had not been consulted by the enemy.

Current evidence: incident-1/fact-0.

**Narayan of Bombay** · `ruler-deploy-failure-1` · existing M2 fallback
The expedition has failed to change the position in Bombay. We shall not mistake that for a permanent settlement.

Current evidence: incident-1/fact-0.

**Thomas Reed** · `AD-M04-01` · approved collection
“Our strategy was flawless. The enemy's refusal to behave as anticipated was both unsporting and militarily irregular.”

Current evidence: incident-1/fact-0.

### incident-2 · Turn 1 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; company-conquest / bombay.

**Chronicler** · `CH-C04` · approved collection
The Company had taken possession of the territory. Explaining why this was necessary would occupy considerably more time than the conquest itself.

Current evidence: incident-2/fact-0, incident-2/fact-1.

**Narayan of Bombay** · `RC-V02` · approved collection
“The Company believes this matter concluded. I admire its confidence.”

Current evidence: incident-2/fact-0, incident-2/fact-1.

**Thomas Reed** · `AC-C03` · approved collection
“An excellent result. I had anticipated a far more difficult victory, which only serves to demonstrate the quality of my preparations.”

Current evidence: incident-2/fact-0, incident-2/fact-1.

### incident-3 · Turn 1 · Bombay · Tax 1 this turn

Canonical facts: tax / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-3/fact-0.

**Narayan of Bombay** · `RU-T02-02` · approved collection
“Your directors are welcome to my treasury. I only ask that they leave enough for me to purchase it back.”

Current evidence: incident-3/fact-0.
Callback: `memory:incident-2:fact-1:ruler-bombay:company-conquest`; owner Narayan of Bombay; direct; source incident-2/fact-1.

**Thomas Avery** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-3/fact-0.

### incident-4 · Turn 1 · Bombay · Tax 2 this turn

Canonical facts: tax / bombay; unrest / bombay.

**Chronicler** · `CH-R03-01` · approved collection
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Narayan of Bombay** · `RU-R03-01` · approved collection
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Thomas Avery** · `secretary-tax-1` · existing M2 fallback
The Tax has been recorded. The payment remains a matter for the physical table.

Current evidence: incident-4/fact-0.

### incident-5 · Turn 1 · Army of Bombay → Bombay: catastrophic failure; 1 officer losses.

Canonical facts: deployment / bombay / catastrophe.

**Chronicler** · `CH-M04-02` · approved collection
The expedition had ended disastrously. Its architects were already preparing explanations, an undertaking for which they appeared considerably better equipped.

Current evidence: incident-5/fact-0.

**Narayan of Bombay** · `ruler-deploy-failure-1` · existing M2 fallback
The expedition has failed to change the position in Bombay. We shall not mistake that for a permanent settlement.

Current evidence: incident-5/fact-0.

**Thomas Reed** · `AD-M04-05` · approved collection
“The campaign has not failed. It has merely entered a phase in which success would be difficult to distinguish from its opposite.”

Current evidence: incident-5/fact-0.

## military-careerist

Seed 2468. Initial fictional careerist Army adviser profile (ambition=90; other core traits=20). Actual failed attack → actual successful conquest → Tax callback → repeat Tax/unrest → explicitly reported catastrophic intervention with one officer loss (no named death). No further deployment is attempted after catastrophe. No command, weather, retreat or casualty circumstances are invented.

### incident-1 · Turn 1 · Army of Bombay → Bombay: failure; 0 officer losses.

Canonical facts: deployment / bombay / failure.

**Chronicler** · `CH-M04-01` · approved collection
The expedition had been undertaken with every expectation of success. The Company's expectations, unfortunately, had not been consulted by the enemy.

Current evidence: incident-1/fact-0.

**Narayan of Bombay** · `ruler-deploy-failure-1` · existing M2 fallback
The expedition has failed to change the position in Bombay. We shall not mistake that for a permanent settlement.

Current evidence: incident-1/fact-0.

**Thomas Reed** · `AD-M04-02` · approved collection
“I should hesitate to call this a defeat. Several important objectives were achieved, including the discovery of objectives that we ought not to have attempted.”

Current evidence: incident-1/fact-0.

### incident-2 · Turn 1 · Army of Bombay → Bombay: success; 0 officer losses.

Canonical facts: deployment / bombay / success; company-conquest / bombay.

**Chronicler** · `CH-C04` · approved collection
The Company had taken possession of the territory. Explaining why this was necessary would occupy considerably more time than the conquest itself.

Current evidence: incident-2/fact-0, incident-2/fact-1.

**Narayan of Bombay** · `RC-V02` · approved collection
“The Company believes this matter concluded. I admire its confidence.”

Current evidence: incident-2/fact-0, incident-2/fact-1.

**Thomas Reed** · `AC-C01` · approved collection
“An excellent victory. I recommend informing London immediately, preferably before anyone begins asking what the expedition cost.”

Current evidence: incident-2/fact-0, incident-2/fact-1.

### incident-3 · Turn 1 · Bombay · Tax 1 this turn

Canonical facts: tax / bombay.

**Chronicler** · `chronicler-tax-v1` · existing M2 fallback
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-3/fact-0.

**Narayan of Bombay** · `RU-T02-02` · approved collection
“Your directors are welcome to my treasury. I only ask that they leave enough for me to purchase it back.”

Current evidence: incident-3/fact-0.
Callback: `memory:incident-2:fact-1:ruler-bombay:company-conquest`; owner Narayan of Bombay; direct; source incident-2/fact-1.

**Thomas Avery** · `AD-T02-01` · approved collection
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-3/fact-0.

### incident-4 · Turn 1 · Bombay · Tax 2 this turn

Canonical facts: tax / bombay; unrest / bombay.

**Chronicler** · `CH-R03-01` · approved collection
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Narayan of Bombay** · `RU-R03-01` · approved collection
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-4/fact-0, incident-4/fact-1.

**Thomas Avery** · `secretary-tax-1` · existing M2 fallback
The Tax has been recorded. The payment remains a matter for the physical table.

Current evidence: incident-4/fact-0.

### incident-5 · Turn 1 · Army of Bombay → Bombay: catastrophic failure; 1 officer losses.

Canonical facts: deployment / bombay / catastrophe.

**Chronicler** · `CH-M04-02` · approved collection
The expedition had ended disastrously. Its architects were already preparing explanations, an undertaking for which they appeared considerably better equipped.

Current evidence: incident-5/fact-0.

**Narayan of Bombay** · `ruler-deploy-failure-1` · existing M2 fallback
The expedition has failed to change the position in Bombay. We shall not mistake that for a permanent settlement.

Current evidence: incident-5/fact-0.

**Thomas Reed** · `AD-M04-04` · approved collection
“It is essential that London understands the true nature of this affair. I recommend that we describe it as an unexpectedly comprehensive reconnaissance.”

Current evidence: incident-5/fact-0.
