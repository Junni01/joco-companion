# Collection 08A — multi-turn commercial dialogue traces

Synthetic campaigns using actual resolvers, event-stack draws, phase resolution, Parliament and final scoring. Initial fictional voices are declared. Manually triggered Turmoil events are explicitly labelled. Supplied dice, defence and officer-rout answers are test inputs, not inferred narrative outcomes. No personal save or historical quotation is included. Section 7/thematic chapter work (08B) remains deferred; archived chapters retain the previous implementation.

## hostile-military

Scenario 1710; seed 808; 5 turns. Initial cautious secretary: formality 3, humour 1, caution 85 / pride 30. Repeated Tax/administrative pressure keeps conquest grievances salient despite useful restored commerce.

### Turn 1

#### incident-1 · Army of Bombay → Bombay: success; 0 officer losses.

**Chronicler** · `CH-C01` · Dry commercial irony
The Company had arrived to conduct business. Unfortunately for the local rulers, it had developed an increasingly generous interpretation of the word.

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Madhav of Bombay** · `RU-M04-05` · Defiant
“The Company has won today. I shall be interested to learn whether it has also acquired the wisdom to make use of its victory.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Thomas Bell** · `AD-M04-07` · Smug
“A magnificent victory. I must admit I had not expected such a decisive result, though naturally I had planned for it.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

#### incident-2 · Bombay · Tax 1 this turn

**Chronicler** · `chronicler-tax-v1` · neutral
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-2/fact-0.

**Madhav of Bombay** · `RU-T02-02` · Cutting
“Your directors are welcome to my treasury. I only ask that they leave enough for me to purchase it back.”

Current evidence: incident-2/fact-0.
Owned callback memories: `memory:incident-1:fact-1:ruler-bombay:company-conquest`.

**Edward Hale** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-2/fact-0.

#### incident-3 · Bombay · Tax 2 this turn

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-3/fact-0, incident-3/fact-1.

**Madhav of Bombay** · `FB07-TAX-RUL-03` · Concerned
“Another demand. I begin to wonder whether their expectations have any natural limit.”

Current evidence: incident-3/fact-0, incident-3/fact-1.

#### incident-4 · Bombay · Unsuccessful Administer

**Chronicler** · `FB07-CH-ADM-01` · Dry
The initiative had failed. Responsibility was promptly referred to another department.

Current evidence: incident-4/fact-0.

**Madhav of Bombay** · `RU-R03-02` · Restrained
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-4/fact-0.

**Edward Hale** · `FB07-ADM-SEC-02` · Anxious
“There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”

Current evidence: incident-4/fact-0.

#### incident-5 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 48; mood: irritated; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-5/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-5/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-5/fact-0.

#### incident-6 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 49; mood: hopeful; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-6/fact-0, incident-6/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-6/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-6/fact-1.

**Edward Hale** · `TR08-REST-SEC-01` · hopeful
“Commerce has resumed. I sincerely hope this marks the beginning of a more stable arrangement.”

Current evidence: incident-6/fact-1.

#### incident-7 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 47; mood: irritation; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-7/fact-0.
Earlier experience/attitude evidence: incident-5/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-7/fact-0.

#### incident-8 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 47; mood: cautious; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-8/fact-0, incident-8/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-01` · hostile
“The Company calls it free trade. I notice that freedom seems to belong almost exclusively to the Company.”

Current evidence: incident-8/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1.

**Edward Hale** · `TR08-REST-SEC-02` · cautious
“We have restored commercial access once more. I shall be rather more cautious in predicting how long it will last.”

Current evidence: incident-8/fact-1.
Earlier experience/attitude evidence: incident-5/fact-0, incident-6/fact-1, incident-7/fact-0.
Owned callback memories: `memory:incident-6:fact-1:secretary-bombay:trade-military`.
Earlier words by this same character: `incident-6:line-3` — “Commerce has resumed. I sincerely hope this marks the beginning of a more stable arrangement.”

#### incident-9 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-10 · Events in India · storms resolved

#### incident-11 · India stack · tile revealed

#### incident-12 · India event · Windfall

**Chronicler** · `chronicler-event-v1` · neutral
India event · Windfall.


#### incident-13 · Events in India · phase complete

#### incident-14 · Parliament complete

#### incident-15 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Changing authority: Army of Bombay → Bombay: success; 0 officer losses..

Administration and its replies: Bombay · Tax 1 this turn; Bombay · Tax 2 this turn; Bombay · Unsuccessful Administer.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Windfall.


### Turn 2

#### incident-16 · Bombay · Tax 1 this turn

**Chronicler** · `chronicler-tax-v1` · neutral
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-16/fact-0.

**Madhav of Bombay** · `FB07-TAX-RUL-03` · Concerned
“Another demand. I begin to wonder whether their expectations have any natural limit.”

Current evidence: incident-16/fact-0.

**Edward Hale** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-16/fact-0.

#### incident-17 · Bombay · Tax 2 this turn

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-17/fact-0, incident-17/fact-1.

**Madhav of Bombay** · `CB-C-TAX-02` · Proud, sarcastic ruler
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-17/fact-0, incident-17/fact-1.
Owned callback memories: `memory:incident-1:fact-1:ruler-bombay:company-conquest`.

#### incident-18 · Bombay · Unsuccessful Administer

**Chronicler** · `FB07-CH-ADM-01` · Dry
The initiative had failed. Responsibility was promptly referred to another department.

Current evidence: incident-18/fact-0.

**Madhav of Bombay** · `RU-R03-02` · Restrained
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-18/fact-0.

**Edward Hale** · `FB07-ADM-SEC-02` · Anxious
“There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”

Current evidence: incident-18/fact-0.

#### incident-19 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 45; mood: irritated; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-19/fact-0.
Earlier experience/attitude evidence: incident-5/fact-0, incident-7/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-19/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-19/fact-0.

#### incident-20 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 45; mood: caution; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-20/fact-0, incident-20/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-20/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-20/fact-1.

#### incident-21 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 43; mood: irritation; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-21/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-21/fact-0.

#### incident-22 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 43; mood: exasperated; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-22/fact-0, incident-22/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-01` · hostile
“The Company calls it free trade. I notice that freedom seems to belong almost exclusively to the Company.”

Current evidence: incident-22/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1.

**Edward Hale** · `TR08-REST-SEC-03` · exasperated
“I have prepared the usual proclamation announcing the restoration of trade. Perhaps we might dispense with the ceremony this time.”

Current evidence: incident-22/fact-1.
Earlier experience/attitude evidence: incident-5/fact-0, incident-6/fact-1, incident-7/fact-0, incident-8/fact-1, incident-19/fact-0, incident-20/fact-1, incident-21/fact-0.
Owned callback memories: `memory:incident-20:fact-1:secretary-bombay:trade-military`.

#### incident-23 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-24 · Events in India · storms resolved

#### incident-25 · India stack · tile revealed

#### incident-26 · India event · Peace

**Chronicler** · `chronicler-event-v1` · neutral
India event · Peace. Delhi: 2 tower levels, 0 unrest; 1 disrupted commercial opportunities. Maratha: 3 tower levels, 0 unrest; 1 disrupted commercial opportunities.

Current evidence: incident-26/fact-0.

#### incident-27 · Events in India · phase complete

#### incident-28 · Parliament complete

#### incident-29 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Administration and its replies: Bombay · Tax 1 this turn; Bombay · Tax 2 this turn; Bombay · Unsuccessful Administer.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Peace.


### Turn 3

#### incident-30 · Bombay · Tax 1 this turn

**Chronicler** · `chronicler-tax-v1` · neutral
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-30/fact-0.

**Madhav of Bombay** · `FB07-TAX-RUL-03` · Concerned
“Another demand. I begin to wonder whether their expectations have any natural limit.”

Current evidence: incident-30/fact-0.

**Edward Hale** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-30/fact-0.

#### incident-31 · Bombay · Tax 2 this turn

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-31/fact-0, incident-31/fact-1.

**Madhav of Bombay** · `CB-C-TAX-02` · Proud, sarcastic ruler
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-31/fact-0, incident-31/fact-1.
Owned callback memories: `memory:incident-1:fact-1:ruler-bombay:company-conquest`.

#### incident-32 · Bombay · Unsuccessful Administer

**Chronicler** · `FB07-CH-ADM-01` · Dry
The initiative had failed. Responsibility was promptly referred to another department.

Current evidence: incident-32/fact-0.

**Madhav of Bombay** · `RU-R03-02` · Restrained
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-32/fact-0.

**Edward Hale** · `FB07-ADM-SEC-02` · Anxious
“There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”

Current evidence: incident-32/fact-0.

#### incident-33 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 41; mood: irritated; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-33/fact-0.
Earlier experience/attitude evidence: incident-5/fact-0, incident-7/fact-0, incident-19/fact-0, incident-21/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-33/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-33/fact-0.

#### incident-34 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 41; mood: resigned; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-34/fact-0, incident-34/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-34/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-34/fact-1.

**Edward Hale** · `TR08-REST-SEC-04` · resigned
“I am beginning to suspect that maintaining our commercial privileges requires considerably more effort than obtaining them.”

Current evidence: incident-34/fact-1.
Earlier experience/attitude evidence: incident-5/fact-0, incident-6/fact-1, incident-7/fact-0, incident-8/fact-1, incident-19/fact-0, incident-20/fact-1, incident-21/fact-0, incident-22/fact-1, incident-33/fact-0.
Owned callback memories: `memory:incident-22:fact-1:secretary-bombay:trade-military`.

#### incident-35 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 39; mood: irritation; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-35/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-35/fact-0.

#### incident-36 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 39; mood: weariness; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-36/fact-0, incident-36/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-01` · hostile
“The Company calls it free trade. I notice that freedom seems to belong almost exclusively to the Company.”

Current evidence: incident-36/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0, incident-34/fact-0, incident-34/fact-1.

#### incident-37 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-38 · Events in India · storms resolved

#### incident-39 · India stack · tile revealed

#### incident-40 · India event · Turmoil

Secretary confidence after incident: 39; mood: weariness; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-CASC-CH-01` · dry
The disruption spread along the trading network. Commerce, it appeared, possessed a remarkable talent for sharing misfortune.

Current evidence: incident-40/fact-0, incident-40/fact-1, incident-40/fact-2, incident-40/fact-3.

**Mansur of Madras** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-40/fact-0, incident-40/fact-1, incident-40/fact-2, incident-40/fact-3.

**Edward Mercer** · `TR08-CASC-SEC-01` · alarmed
“The difficulties have spread to neighbouring markets. I had understood that commercial enterprise was supposed to encourage cooperation.”

Current evidence: incident-40/fact-0, incident-40/fact-1, incident-40/fact-2, incident-40/fact-3.

#### incident-41 · Events in India · phase complete

#### incident-42 · Parliament complete

#### incident-43 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Administration and its replies: Bombay · Tax 1 this turn; Bombay · Tax 2 this turn; Bombay · Unsuccessful Administer.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Turmoil.


### Turn 4

#### incident-44 · Bombay · Tax 1 this turn

**Chronicler** · `chronicler-tax-v1` · neutral
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-44/fact-0.

**Madhav of Bombay** · `FB07-TAX-RUL-03` · Concerned
“Another demand. I begin to wonder whether their expectations have any natural limit.”

Current evidence: incident-44/fact-0.

**Edward Hale** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-44/fact-0.

#### incident-45 · Bombay · Tax 2 this turn

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-45/fact-0, incident-45/fact-1.

**Madhav of Bombay** · `CB-C-TAX-02` · Proud, sarcastic ruler
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-45/fact-0, incident-45/fact-1.
Owned callback memories: `memory:incident-1:fact-1:ruler-bombay:company-conquest`.

#### incident-46 · Bombay · Unsuccessful Administer

**Chronicler** · `FB07-CH-ADM-01` · Dry
The initiative had failed. Responsibility was promptly referred to another department.

Current evidence: incident-46/fact-0.

**Madhav of Bombay** · `RU-R03-02` · Restrained
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-46/fact-0.

**Edward Hale** · `FB07-ADM-SEC-02` · Anxious
“There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”

Current evidence: incident-46/fact-0.

#### incident-47 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 37; mood: irritated; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-47/fact-0.
Earlier experience/attitude evidence: incident-5/fact-0, incident-7/fact-0, incident-19/fact-0, incident-21/fact-0, incident-33/fact-0, incident-35/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-47/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-47/fact-0.

#### incident-48 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 37; mood: weariness; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-48/fact-0, incident-48/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-48/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0, incident-34/fact-0, incident-34/fact-1, incident-36/fact-0, incident-36/fact-1, incident-44/fact-0, incident-45/fact-0, incident-45/fact-1, incident-46/fact-0.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-48/fact-1.

#### incident-49 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 35; mood: irritation; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-49/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-49/fact-0.

#### incident-50 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 35; mood: weariness; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-50/fact-0, incident-50/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-01` · hostile
“The Company calls it free trade. I notice that freedom seems to belong almost exclusively to the Company.”

Current evidence: incident-50/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0, incident-34/fact-0, incident-34/fact-1, incident-36/fact-0, incident-36/fact-1, incident-44/fact-0, incident-45/fact-0, incident-45/fact-1, incident-46/fact-0, incident-48/fact-0, incident-48/fact-1.

#### incident-51 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-52 · Events in India · storms resolved

#### incident-53 · India stack · tile revealed

#### incident-54 · India event · Leader

Secretary confidence after incident: 33; mood: alarmed; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
The rebellion in Punjab succeeded.

Current evidence: incident-54/fact-0, incident-54/fact-1, incident-54/fact-2, incident-54/fact-3, incident-54/fact-4.

**Salim of Punjab** · `RU-R03-06` · Clear-eyed
“Today we are free. Tomorrow we must discover whether we are capable of remaining so.”

Current evidence: incident-54/fact-0, incident-54/fact-1, incident-54/fact-2.

**Jalal of Delhi** · `m2-sovereign-rebellion-won` · worried
The rebellion in Punjab has succeeded. We cannot write its independence out of the record.

Current evidence: incident-54/fact-0.

**Madhav of Bombay** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-54/fact-2, incident-54/fact-3, incident-54/fact-4.

**Edward Hale** · `TR08-CASC-SEC-01` · alarmed
“The difficulties have spread to neighbouring markets. I had understood that commercial enterprise was supposed to encourage cooperation.”

Current evidence: incident-54/fact-2, incident-54/fact-3, incident-54/fact-4.

**Thomas Bell** · `TR08-CASC-OFF-01` · outraged
“This is intolerable! We have invested considerable effort in establishing these commercial connections, and now they are being used to spread dissatisfaction!”

Current evidence: incident-54/fact-2, incident-54/fact-3, incident-54/fact-4.

#### incident-55 · Events in India · phase complete

#### incident-56 · Parliament complete

#### incident-57 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Changing authority: India event · Leader.

Administration and its replies: Bombay · Tax 1 this turn; Bombay · Tax 2 this turn; Bombay · Unsuccessful Administer.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins.


### Turn 5

#### incident-58 · Bombay · Tax 1 this turn

**Chronicler** · `chronicler-tax-v1` · neutral
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-58/fact-0.

**Madhav of Bombay** · `FB07-TAX-RUL-03` · Concerned
“Another demand. I begin to wonder whether their expectations have any natural limit.”

Current evidence: incident-58/fact-0.

**Edward Hale** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-58/fact-0.

#### incident-59 · Bombay · Tax 2 this turn

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-59/fact-0, incident-59/fact-1.

**Madhav of Bombay** · `CB-C-TAX-02` · Proud, sarcastic ruler
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-59/fact-0, incident-59/fact-1.
Owned callback memories: `memory:incident-1:fact-1:ruler-bombay:company-conquest`.

#### incident-60 · Bombay · Unsuccessful Administer

**Chronicler** · `FB07-CH-ADM-01` · Dry
The initiative had failed. Responsibility was promptly referred to another department.

Current evidence: incident-60/fact-0.

**Madhav of Bombay** · `RU-R03-02` · Restrained
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-60/fact-0.

**Edward Hale** · `FB07-ADM-SEC-02` · Anxious
“There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”

Current evidence: incident-60/fact-0.

#### incident-61 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 31; mood: irritated; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-61/fact-0.
Earlier experience/attitude evidence: incident-5/fact-0, incident-7/fact-0, incident-19/fact-0, incident-21/fact-0, incident-33/fact-0, incident-35/fact-0, incident-47/fact-0, incident-49/fact-0, incident-54/fact-4.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-61/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-61/fact-0.

#### incident-62 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 31; mood: weariness; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-62/fact-0, incident-62/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-62/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0, incident-34/fact-0, incident-34/fact-1, incident-36/fact-0, incident-36/fact-1, incident-44/fact-0, incident-45/fact-0, incident-45/fact-1, incident-46/fact-0, incident-48/fact-0, incident-48/fact-1, incident-50/fact-0, incident-50/fact-1, incident-58/fact-0, incident-59/fact-0, incident-59/fact-1, incident-60/fact-0.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-62/fact-1.

#### incident-63 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 29; mood: irritation; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-63/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-63/fact-0.

#### incident-64 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 29; mood: weariness; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-64/fact-0, incident-64/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-01` · hostile
“The Company calls it free trade. I notice that freedom seems to belong almost exclusively to the Company.”

Current evidence: incident-64/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0, incident-34/fact-0, incident-34/fact-1, incident-36/fact-0, incident-36/fact-1, incident-44/fact-0, incident-45/fact-0, incident-45/fact-1, incident-46/fact-0, incident-48/fact-0, incident-48/fact-1, incident-50/fact-0, incident-50/fact-1, incident-58/fact-0, incident-59/fact-0, incident-59/fact-1, incident-60/fact-0, incident-62/fact-0, incident-62/fact-1.

#### incident-65 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-66 · Events in India · storms resolved

#### incident-67 · India stack · tile revealed

#### incident-68 · India event · Leader

**Chronicler** · `chronicler-event-v1` · neutral
India event · Leader. Hyderabad: 2 tower levels, 0 unrest; 1 disrupted commercial opportunities.


#### incident-69 · Events in India · phase complete

#### incident-70 · Parliament complete

#### incident-71 · Game ended · Final turn completed

**Chronicler** · `chronicler-end-game-v1` · neutral
Administration and its replies: Bombay · Tax 1 this turn; Bombay · Tax 2 this turn; Bombay · Unsuccessful Administer.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Leader. The campaign has ended. No further years are added.


## procedural-military

Scenario 1710; seed 808; 5 turns. Initial procedural secretary: formality 3, humour 1, caution 30 / pride 85. Repeated Tax/administrative pressure keeps conquest grievances salient despite useful restored commerce.

### Turn 1

#### incident-1 · Army of Bombay → Bombay: success; 0 officer losses.

**Chronicler** · `CH-C01` · Dry commercial irony
The Company had arrived to conduct business. Unfortunately for the local rulers, it had developed an increasingly generous interpretation of the word.

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Madhav of Bombay** · `RU-M04-05` · Defiant
“The Company has won today. I shall be interested to learn whether it has also acquired the wisdom to make use of its victory.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Thomas Bell** · `AD-M04-07` · Smug
“A magnificent victory. I must admit I had not expected such a decisive result, though naturally I had planned for it.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

#### incident-2 · Bombay · Tax 1 this turn

**Chronicler** · `chronicler-tax-v1` · neutral
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-2/fact-0.

**Madhav of Bombay** · `RU-T02-02` · Cutting
“Your directors are welcome to my treasury. I only ask that they leave enough for me to purchase it back.”

Current evidence: incident-2/fact-0.
Owned callback memories: `memory:incident-1:fact-1:ruler-bombay:company-conquest`.

**Edward Hale** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-2/fact-0.

#### incident-3 · Bombay · Tax 2 this turn

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-3/fact-0, incident-3/fact-1.

**Madhav of Bombay** · `FB07-TAX-RUL-02` · Exasperated
“Again? I had assumed the Company's appetite might occasionally be satisfied. Evidently, I have misunderstood its constitution.”

Current evidence: incident-3/fact-0, incident-3/fact-1.

**Edward Hale** · `AD-T02-01` · Smug
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-3/fact-0, incident-3/fact-1.

#### incident-4 · Bombay · Unsuccessful Administer

**Chronicler** · `FB07-CH-ADM-01` · Dry
The initiative had failed. Responsibility was promptly referred to another department.

Current evidence: incident-4/fact-0.

**Madhav of Bombay** · `RU-R03-01` · Calculating
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-4/fact-0.

**Edward Hale** · `FB07-ADM-SEC-02` · Anxious
“There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”

Current evidence: incident-4/fact-0.

#### incident-5 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 48; mood: irritated; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-5/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-5/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-5/fact-0.

#### incident-6 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 49; mood: hope; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-6/fact-0, incident-6/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-6/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-6/fact-1.

#### incident-7 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 47; mood: irritation; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-7/fact-0.
Earlier experience/attitude evidence: incident-5/fact-0.

#### incident-8 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 47; mood: caution; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-8/fact-0, incident-8/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-01` · hostile
“The Company calls it free trade. I notice that freedom seems to belong almost exclusively to the Company.”

Current evidence: incident-8/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1.

#### incident-9 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-10 · Events in India · storms resolved

#### incident-11 · India stack · tile revealed

#### incident-12 · India event · Windfall

**Chronicler** · `chronicler-event-v1` · neutral
India event · Windfall.


#### incident-13 · Events in India · phase complete

#### incident-14 · Parliament complete

#### incident-15 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Changing authority: Army of Bombay → Bombay: success; 0 officer losses..

Administration and its replies: Bombay · Tax 1 this turn; Bombay · Tax 2 this turn; Bombay · Unsuccessful Administer.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Windfall.


### Turn 2

#### incident-16 · Bombay · Tax 1 this turn

**Chronicler** · `chronicler-tax-v1` · neutral
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-16/fact-0.

**Madhav of Bombay** · `CB-C-TAX-02` · Proud, sarcastic ruler
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-16/fact-0.
Owned callback memories: `memory:incident-1:fact-1:ruler-bombay:company-conquest`.

**Edward Hale** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-16/fact-0.

#### incident-17 · Bombay · Tax 2 this turn

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-17/fact-0, incident-17/fact-1.

**Madhav of Bombay** · `FB07-TAX-RUL-02` · Exasperated
“Again? I had assumed the Company's appetite might occasionally be satisfied. Evidently, I have misunderstood its constitution.”

Current evidence: incident-17/fact-0, incident-17/fact-1.

**Edward Hale** · `AD-T02-01` · Smug
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-17/fact-0, incident-17/fact-1.

#### incident-18 · Bombay · Unsuccessful Administer

**Chronicler** · `FB07-CH-ADM-01` · Dry
The initiative had failed. Responsibility was promptly referred to another department.

Current evidence: incident-18/fact-0.

**Madhav of Bombay** · `RU-R03-01` · Calculating
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-18/fact-0.

**Edward Hale** · `FB07-ADM-SEC-01` · Earnest or smug
“An unfortunate outcome. I shall recommend a committee to determine which committee ought to have prevented it.”

Current evidence: incident-18/fact-0.

#### incident-19 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 45; mood: irritated; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-19/fact-0.
Earlier experience/attitude evidence: incident-5/fact-0, incident-7/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-19/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-19/fact-0.

#### incident-20 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 45; mood: caution; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-20/fact-0, incident-20/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-20/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-20/fact-1.

#### incident-21 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 43; mood: irritation; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-21/fact-0.

#### incident-22 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 43; mood: resigned; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-22/fact-0, incident-22/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-01` · hostile
“The Company calls it free trade. I notice that freedom seems to belong almost exclusively to the Company.”

Current evidence: incident-22/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1.

**Edward Hale** · `TR08-REST-SEC-04` · resigned
“I am beginning to suspect that maintaining our commercial privileges requires considerably more effort than obtaining them.”

Current evidence: incident-22/fact-1.
Earlier experience/attitude evidence: incident-5/fact-0, incident-6/fact-1, incident-7/fact-0, incident-8/fact-1, incident-19/fact-0, incident-20/fact-1, incident-21/fact-0.
Owned callback memories: `memory:incident-20:fact-1:secretary-bombay:trade-military`.

#### incident-23 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-24 · Events in India · storms resolved

#### incident-25 · India stack · tile revealed

#### incident-26 · India event · Peace

**Chronicler** · `chronicler-event-v1` · neutral
India event · Peace. Delhi: 2 tower levels, 0 unrest; 1 disrupted commercial opportunities. Maratha: 3 tower levels, 0 unrest; 1 disrupted commercial opportunities.

Current evidence: incident-26/fact-0.

#### incident-27 · Events in India · phase complete

#### incident-28 · Parliament complete

#### incident-29 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Administration and its replies: Bombay · Tax 1 this turn; Bombay · Tax 2 this turn; Bombay · Unsuccessful Administer.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Peace.


### Turn 3

#### incident-30 · Bombay · Tax 1 this turn

**Chronicler** · `chronicler-tax-v1` · neutral
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-30/fact-0.

**Madhav of Bombay** · `CB-C-TAX-02` · Proud, sarcastic ruler
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-30/fact-0.
Owned callback memories: `memory:incident-1:fact-1:ruler-bombay:company-conquest`.

**Edward Hale** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-30/fact-0.

#### incident-31 · Bombay · Tax 2 this turn

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-31/fact-0, incident-31/fact-1.

**Madhav of Bombay** · `FB07-TAX-RUL-02` · Exasperated
“Again? I had assumed the Company's appetite might occasionally be satisfied. Evidently, I have misunderstood its constitution.”

Current evidence: incident-31/fact-0, incident-31/fact-1.

**Edward Hale** · `AD-T02-01` · Smug
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-31/fact-0, incident-31/fact-1.

#### incident-32 · Bombay · Unsuccessful Administer

**Chronicler** · `FB07-CH-ADM-01` · Dry
The initiative had failed. Responsibility was promptly referred to another department.

Current evidence: incident-32/fact-0.

**Madhav of Bombay** · `RU-R03-01` · Calculating
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-32/fact-0.

**Edward Hale** · `FB07-ADM-SEC-02` · Anxious
“There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”

Current evidence: incident-32/fact-0.

#### incident-33 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 41; mood: irritated; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-33/fact-0.
Earlier experience/attitude evidence: incident-5/fact-0, incident-7/fact-0, incident-19/fact-0, incident-21/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-33/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-33/fact-0.

#### incident-34 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 41; mood: exasperated; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-34/fact-0, incident-34/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-34/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-34/fact-1.

**Edward Hale** · `TR08-REST-SEC-03` · exasperated
“I have prepared the usual proclamation announcing the restoration of trade. Perhaps we might dispense with the ceremony this time.”

Current evidence: incident-34/fact-1.
Earlier experience/attitude evidence: incident-5/fact-0, incident-6/fact-1, incident-7/fact-0, incident-8/fact-1, incident-19/fact-0, incident-20/fact-1, incident-21/fact-0, incident-22/fact-1, incident-33/fact-0.
Owned callback memories: `memory:incident-22:fact-1:secretary-bombay:trade-military`.

#### incident-35 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 39; mood: irritation; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-35/fact-0.

#### incident-36 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 39; mood: weariness; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-36/fact-0, incident-36/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-01` · hostile
“The Company calls it free trade. I notice that freedom seems to belong almost exclusively to the Company.”

Current evidence: incident-36/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0, incident-34/fact-0, incident-34/fact-1.

#### incident-37 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-38 · Events in India · storms resolved

#### incident-39 · India stack · tile revealed

#### incident-40 · India event · Turmoil

Secretary confidence after incident: 39; mood: weariness; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-CASC-CH-01` · dry
The disruption spread along the trading network. Commerce, it appeared, possessed a remarkable talent for sharing misfortune.

Current evidence: incident-40/fact-0, incident-40/fact-1, incident-40/fact-2, incident-40/fact-3.

**Mansur of Madras** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-40/fact-0, incident-40/fact-1, incident-40/fact-2, incident-40/fact-3.

**Edward Mercer** · `TR08-CASC-SEC-01` · alarmed
“The difficulties have spread to neighbouring markets. I had understood that commercial enterprise was supposed to encourage cooperation.”

Current evidence: incident-40/fact-0, incident-40/fact-1, incident-40/fact-2, incident-40/fact-3.

#### incident-41 · Events in India · phase complete

#### incident-42 · Parliament complete

#### incident-43 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Administration and its replies: Bombay · Tax 1 this turn; Bombay · Tax 2 this turn; Bombay · Unsuccessful Administer.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Turmoil.


### Turn 4

#### incident-44 · Bombay · Tax 1 this turn

**Chronicler** · `chronicler-tax-v1` · neutral
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-44/fact-0.

**Madhav of Bombay** · `CB-C-TAX-02` · Proud, sarcastic ruler
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-44/fact-0.
Owned callback memories: `memory:incident-1:fact-1:ruler-bombay:company-conquest`.

**Edward Hale** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-44/fact-0.

#### incident-45 · Bombay · Tax 2 this turn

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-45/fact-0, incident-45/fact-1.

**Madhav of Bombay** · `FB07-TAX-RUL-02` · Exasperated
“Again? I had assumed the Company's appetite might occasionally be satisfied. Evidently, I have misunderstood its constitution.”

Current evidence: incident-45/fact-0, incident-45/fact-1.

**Edward Hale** · `AD-T02-01` · Smug
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-45/fact-0, incident-45/fact-1.

#### incident-46 · Bombay · Unsuccessful Administer

**Chronicler** · `FB07-CH-ADM-01` · Dry
The initiative had failed. Responsibility was promptly referred to another department.

Current evidence: incident-46/fact-0.

**Madhav of Bombay** · `RU-R03-01` · Calculating
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-46/fact-0.

**Edward Hale** · `FB07-ADM-SEC-01` · Earnest or smug
“An unfortunate outcome. I shall recommend a committee to determine which committee ought to have prevented it.”

Current evidence: incident-46/fact-0.

#### incident-47 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 37; mood: irritated; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-47/fact-0.
Earlier experience/attitude evidence: incident-5/fact-0, incident-7/fact-0, incident-19/fact-0, incident-21/fact-0, incident-33/fact-0, incident-35/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-47/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-47/fact-0.

#### incident-48 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 37; mood: weariness; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-48/fact-0, incident-48/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-48/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0, incident-34/fact-0, incident-34/fact-1, incident-36/fact-0, incident-36/fact-1, incident-44/fact-0, incident-45/fact-0, incident-45/fact-1, incident-46/fact-0.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-48/fact-1.

#### incident-49 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 35; mood: irritation; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-49/fact-0.

#### incident-50 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 35; mood: weariness; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-50/fact-0, incident-50/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-01` · hostile
“The Company calls it free trade. I notice that freedom seems to belong almost exclusively to the Company.”

Current evidence: incident-50/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0, incident-34/fact-0, incident-34/fact-1, incident-36/fact-0, incident-36/fact-1, incident-44/fact-0, incident-45/fact-0, incident-45/fact-1, incident-46/fact-0, incident-48/fact-0, incident-48/fact-1.

#### incident-51 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-52 · Events in India · storms resolved

#### incident-53 · India stack · tile revealed

#### incident-54 · India event · Leader

Secretary confidence after incident: 33; mood: alarmed; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
The rebellion in Punjab succeeded.

Current evidence: incident-54/fact-0, incident-54/fact-1, incident-54/fact-2, incident-54/fact-3, incident-54/fact-4.

**Salim of Punjab** · `RU-R03-06` · Clear-eyed
“Today we are free. Tomorrow we must discover whether we are capable of remaining so.”

Current evidence: incident-54/fact-0, incident-54/fact-1, incident-54/fact-2.

**Jalal of Delhi** · `m2-sovereign-rebellion-won` · worried
The rebellion in Punjab has succeeded. We cannot write its independence out of the record.

Current evidence: incident-54/fact-0.

**Madhav of Bombay** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-54/fact-2, incident-54/fact-3, incident-54/fact-4.

**Edward Hale** · `TR08-CASC-SEC-01` · alarmed
“The difficulties have spread to neighbouring markets. I had understood that commercial enterprise was supposed to encourage cooperation.”

Current evidence: incident-54/fact-2, incident-54/fact-3, incident-54/fact-4.

**Thomas Bell** · `TR08-CASC-OFF-01` · outraged
“This is intolerable! We have invested considerable effort in establishing these commercial connections, and now they are being used to spread dissatisfaction!”

Current evidence: incident-54/fact-2, incident-54/fact-3, incident-54/fact-4.

#### incident-55 · Events in India · phase complete

#### incident-56 · Parliament complete

#### incident-57 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Changing authority: India event · Leader.

Administration and its replies: Bombay · Tax 1 this turn; Bombay · Tax 2 this turn; Bombay · Unsuccessful Administer.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins.


### Turn 5

#### incident-58 · Bombay · Tax 1 this turn

**Chronicler** · `chronicler-tax-v1` · neutral
Bombay: Tax recorded; 0 unrest added.

Current evidence: incident-58/fact-0.

**Madhav of Bombay** · `CB-C-TAX-02` · Proud, sarcastic ruler
“I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.”

Current evidence: incident-58/fact-0.
Owned callback memories: `memory:incident-1:fact-1:ruler-bombay:company-conquest`.

**Edward Hale** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-58/fact-0.

#### incident-59 · Bombay · Tax 2 this turn

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-59/fact-0, incident-59/fact-1.

**Madhav of Bombay** · `FB07-TAX-RUL-02` · Exasperated
“Again? I had assumed the Company's appetite might occasionally be satisfied. Evidently, I have misunderstood its constitution.”

Current evidence: incident-59/fact-0, incident-59/fact-1.

**Edward Hale** · `AD-T02-01` · Smug
“A most encouraging result. The natives have demonstrated a remarkable willingness to contribute to their own improvement.”

Current evidence: incident-59/fact-0, incident-59/fact-1.

#### incident-60 · Bombay · Unsuccessful Administer

**Chronicler** · `FB07-CH-ADM-01` · Dry
The initiative had failed. Responsibility was promptly referred to another department.

Current evidence: incident-60/fact-0.

**Madhav of Bombay** · `RU-R03-01` · Calculating
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-60/fact-0.

**Edward Hale** · `FB07-ADM-SEC-01` · Earnest or smug
“An unfortunate outcome. I shall recommend a committee to determine which committee ought to have prevented it.”

Current evidence: incident-60/fact-0.

#### incident-61 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 31; mood: irritated; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-61/fact-0.
Earlier experience/attitude evidence: incident-5/fact-0, incident-7/fact-0, incident-19/fact-0, incident-21/fact-0, incident-33/fact-0, incident-35/fact-0, incident-47/fact-0, incident-49/fact-0, incident-54/fact-4.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-61/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-61/fact-0.

#### incident-62 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 31; mood: weariness; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-62/fact-0, incident-62/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-62/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0, incident-34/fact-0, incident-34/fact-1, incident-36/fact-0, incident-36/fact-1, incident-44/fact-0, incident-45/fact-0, incident-45/fact-1, incident-46/fact-0, incident-48/fact-0, incident-48/fact-1, incident-50/fact-0, incident-50/fact-1, incident-58/fact-0, incident-59/fact-0, incident-59/fact-1, incident-60/fact-0.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-62/fact-1.

#### incident-63 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 29; mood: irritation; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-63/fact-0.

#### incident-64 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 29; mood: weariness; core caution: 30. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-64/fact-0, incident-64/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-01` · hostile
“The Company calls it free trade. I notice that freedom seems to belong almost exclusively to the Company.”

Current evidence: incident-64/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-0, incident-3/fact-0, incident-3/fact-1, incident-4/fact-0, incident-6/fact-0, incident-6/fact-1, incident-8/fact-0, incident-8/fact-1, incident-16/fact-0, incident-17/fact-0, incident-17/fact-1, incident-18/fact-0, incident-20/fact-0, incident-20/fact-1, incident-22/fact-0, incident-22/fact-1, incident-30/fact-0, incident-31/fact-0, incident-31/fact-1, incident-32/fact-0, incident-34/fact-0, incident-34/fact-1, incident-36/fact-0, incident-36/fact-1, incident-44/fact-0, incident-45/fact-0, incident-45/fact-1, incident-46/fact-0, incident-48/fact-0, incident-48/fact-1, incident-50/fact-0, incident-50/fact-1, incident-58/fact-0, incident-59/fact-0, incident-59/fact-1, incident-60/fact-0, incident-62/fact-0, incident-62/fact-1.

#### incident-65 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-66 · Events in India · storms resolved

#### incident-67 · India stack · tile revealed

#### incident-68 · India event · Leader

**Chronicler** · `chronicler-event-v1` · neutral
India event · Leader. Hyderabad: 2 tower levels, 0 unrest; 1 disrupted commercial opportunities.


#### incident-69 · Events in India · phase complete

#### incident-70 · Parliament complete

#### incident-71 · Game ended · Final turn completed

**Chronicler** · `chronicler-end-game-v1` · neutral
Administration and its replies: Bombay · Tax 1 this turn; Bombay · Tax 2 this turn; Bombay · Unsuccessful Administer.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Leader. The campaign has ended. No further years are added.


## diplomatic-access

Scenario 1710; seed 808; 5 turns. Initial cautious secretary: formality 3, humour 1, caution 85 / pride 30. No Company conquest; Special Envoy restores actual closed opportunities.

### Turn 1

#### incident-1 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 48; mood: irritated; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-1/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-1/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-1/fact-0.

#### incident-2 · Special Envoy

Secretary confidence after incident: 49; mood: hopeful; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DIPL-CH-01` · dry
Diplomatic efforts had restored access to a commercial opportunity. The Company was delighted to discover that conversation could occasionally achieve what threats could not.

Current evidence: incident-2/fact-0.

**Madhav of Bombay** · `TR08-DIPL-RUL-02` · sardonic
“How extraordinary. The Company has obtained something it wanted without conquering anyone.”

Current evidence: incident-2/fact-0.

**Edward Hale** · `TR08-REST-SEC-01` · hopeful
“Commerce has resumed. I sincerely hope this marks the beginning of a more stable arrangement.”

Current evidence: incident-2/fact-0.

#### incident-3 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 47; mood: irritation; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-3/fact-0.
Earlier experience/attitude evidence: incident-1/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-3/fact-0.

#### incident-4 · Special Envoy

Secretary confidence after incident: 47; mood: cautious; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-envoy-v1` · neutral
Bombay: diplomacy restored a commercial opportunity.

Current evidence: incident-4/fact-0.

**Madhav of Bombay** · `TR08-DIPL-RUL-01` · guarded
“The merchants may return to business. Whether this improves our relations with the Company remains to be seen.”

Current evidence: incident-4/fact-0.

**Edward Hale** · `TR08-REST-SEC-02` · cautious
“We have restored commercial access once more. I shall be rather more cautious in predicting how long it will last.”

Current evidence: incident-4/fact-0.
Earlier experience/attitude evidence: incident-1/fact-0, incident-2/fact-0, incident-3/fact-0.
Owned callback memories: `memory:incident-2:fact-0:secretary-bombay:trade-diplomacy`.
Earlier words by this same character: `incident-2:line-2` — “Commerce has resumed. I sincerely hope this marks the beginning of a more stable arrangement.”

#### incident-5 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-6 · Events in India · storms resolved

#### incident-7 · India stack · tile revealed

#### incident-8 · India event · Windfall

**Chronicler** · `chronicler-event-v1` · neutral
India event · Windfall.


#### incident-9 · Events in India · phase complete

#### incident-10 · Parliament complete

#### incident-11 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Other recorded developments: Manual event test · Turmoil; Special Envoy; Manual event test · Turmoil; Special Envoy; Events in India · phase begins; India event · Windfall.


### Turn 2

#### incident-12 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 45; mood: irritated; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-12/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-12/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-12/fact-0.

#### incident-13 · Special Envoy

Secretary confidence after incident: 45; mood: caution; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DIPL-CH-01` · dry
Diplomatic efforts had restored access to a commercial opportunity. The Company was delighted to discover that conversation could occasionally achieve what threats could not.

Current evidence: incident-13/fact-0.

**Madhav of Bombay** · `TR08-DIPL-RUL-02` · sardonic
“How extraordinary. The Company has obtained something it wanted without conquering anyone.”

Current evidence: incident-13/fact-0.

#### incident-14 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 43; mood: irritation; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-14/fact-0.
Earlier experience/attitude evidence: incident-1/fact-0, incident-3/fact-0, incident-12/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-14/fact-0.

#### incident-15 · Special Envoy

Secretary confidence after incident: 43; mood: resigned; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-envoy-v1` · neutral
Bombay: diplomacy restored a commercial opportunity.

Current evidence: incident-15/fact-0.

**Madhav of Bombay** · `TR08-DIPL-RUL-01` · guarded
“The merchants may return to business. Whether this improves our relations with the Company remains to be seen.”

Current evidence: incident-15/fact-0.

**Edward Hale** · `TR08-REST-SEC-04` · resigned
“I am beginning to suspect that maintaining our commercial privileges requires considerably more effort than obtaining them.”

Current evidence: incident-15/fact-0.
Earlier experience/attitude evidence: incident-1/fact-0, incident-2/fact-0, incident-3/fact-0, incident-4/fact-0, incident-12/fact-0, incident-13/fact-0, incident-14/fact-0.
Owned callback memories: `memory:incident-13:fact-0:secretary-bombay:trade-diplomacy`.

#### incident-16 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-17 · Events in India · storms resolved

#### incident-18 · India stack · tile revealed

#### incident-19 · India event · Peace

**Chronicler** · `chronicler-event-v1` · neutral
India event · Peace. Delhi: 2 tower levels, 0 unrest; 1 disrupted commercial opportunities. Maratha: 3 tower levels, 0 unrest; 1 disrupted commercial opportunities.

Current evidence: incident-19/fact-0.

#### incident-20 · Events in India · phase complete

#### incident-21 · Parliament complete

#### incident-22 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Other recorded developments: Manual event test · Turmoil; Special Envoy; Manual event test · Turmoil; Special Envoy; Events in India · phase begins; India event · Peace.


### Turn 3

#### incident-23 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 41; mood: irritated; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-23/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-23/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-23/fact-0.

#### incident-24 · Special Envoy

Secretary confidence after incident: 41; mood: exasperated; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DIPL-CH-01` · dry
Diplomatic efforts had restored access to a commercial opportunity. The Company was delighted to discover that conversation could occasionally achieve what threats could not.

Current evidence: incident-24/fact-0.

**Madhav of Bombay** · `TR08-DIPL-RUL-02` · sardonic
“How extraordinary. The Company has obtained something it wanted without conquering anyone.”

Current evidence: incident-24/fact-0.

**Edward Hale** · `TR08-REST-SEC-03` · exasperated
“I have prepared the usual proclamation announcing the restoration of trade. Perhaps we might dispense with the ceremony this time.”

Current evidence: incident-24/fact-0.
Earlier experience/attitude evidence: incident-1/fact-0, incident-2/fact-0, incident-3/fact-0, incident-4/fact-0, incident-12/fact-0, incident-13/fact-0, incident-14/fact-0, incident-15/fact-0, incident-23/fact-0.
Owned callback memories: `memory:incident-15:fact-0:secretary-bombay:trade-diplomacy`.

#### incident-25 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 39; mood: irritation; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-25/fact-0.
Earlier experience/attitude evidence: incident-1/fact-0, incident-3/fact-0, incident-12/fact-0, incident-14/fact-0, incident-23/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-25/fact-0.

#### incident-26 · Special Envoy

Secretary confidence after incident: 39; mood: weariness; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-envoy-v1` · neutral
Bombay: diplomacy restored a commercial opportunity.

Current evidence: incident-26/fact-0.

**Madhav of Bombay** · `TR08-DIPL-RUL-01` · guarded
“The merchants may return to business. Whether this improves our relations with the Company remains to be seen.”

Current evidence: incident-26/fact-0.

#### incident-27 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-28 · Events in India · storms resolved

#### incident-29 · India stack · tile revealed

#### incident-30 · India event · Turmoil

Secretary confidence after incident: 39; mood: weariness; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-CASC-CH-01` · dry
The disruption spread along the trading network. Commerce, it appeared, possessed a remarkable talent for sharing misfortune.

Current evidence: incident-30/fact-0, incident-30/fact-1, incident-30/fact-2, incident-30/fact-3.

**Mansur of Madras** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-30/fact-0, incident-30/fact-1, incident-30/fact-2, incident-30/fact-3.

**Edward Mercer** · `TR08-CASC-SEC-01` · alarmed
“The difficulties have spread to neighbouring markets. I had understood that commercial enterprise was supposed to encourage cooperation.”

Current evidence: incident-30/fact-0, incident-30/fact-1, incident-30/fact-2, incident-30/fact-3.

#### incident-31 · Events in India · phase complete

#### incident-32 · Parliament complete

#### incident-33 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Other recorded developments: Manual event test · Turmoil; Special Envoy; Manual event test · Turmoil; Special Envoy; Events in India · phase begins; India event · Turmoil.


### Turn 4

#### incident-34 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 37; mood: irritated; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-34/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-34/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-34/fact-0.

#### incident-35 · Special Envoy

Secretary confidence after incident: 37; mood: weariness; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DIPL-CH-01` · dry
Diplomatic efforts had restored access to a commercial opportunity. The Company was delighted to discover that conversation could occasionally achieve what threats could not.

Current evidence: incident-35/fact-0.

**Madhav of Bombay** · `TR08-DIPL-RUL-02` · sardonic
“How extraordinary. The Company has obtained something it wanted without conquering anyone.”

Current evidence: incident-35/fact-0.

#### incident-36 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 35; mood: irritation; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-36/fact-0.
Earlier experience/attitude evidence: incident-1/fact-0, incident-3/fact-0, incident-12/fact-0, incident-14/fact-0, incident-23/fact-0, incident-25/fact-0, incident-34/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-36/fact-0.

#### incident-37 · Special Envoy

Secretary confidence after incident: 35; mood: weariness; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-envoy-v1` · neutral
Bombay: diplomacy restored a commercial opportunity.

Current evidence: incident-37/fact-0.

**Madhav of Bombay** · `TR08-DIPL-RUL-01` · guarded
“The merchants may return to business. Whether this improves our relations with the Company remains to be seen.”

Current evidence: incident-37/fact-0.

#### incident-38 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-39 · Events in India · storms resolved

#### incident-40 · India stack · tile revealed

#### incident-41 · India event · Leader

Secretary confidence after incident: 33; mood: alarmed; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-event-v1` · neutral
The rebellion in Punjab succeeded.

Current evidence: incident-41/fact-0, incident-41/fact-1, incident-41/fact-2, incident-41/fact-3, incident-41/fact-4.

**Salim of Punjab** · `RU-R03-06` · Clear-eyed
“Today we are free. Tomorrow we must discover whether we are capable of remaining so.”

Current evidence: incident-41/fact-0, incident-41/fact-1, incident-41/fact-2.

**Jalal of Delhi** · `m2-sovereign-rebellion-won` · worried
The rebellion in Punjab has succeeded. We cannot write its independence out of the record.

Current evidence: incident-41/fact-0.

**Madhav of Bombay** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-41/fact-2, incident-41/fact-3, incident-41/fact-4.

**Edward Hale** · `TR08-CASC-SEC-01` · alarmed
“The difficulties have spread to neighbouring markets. I had understood that commercial enterprise was supposed to encourage cooperation.”

Current evidence: incident-41/fact-2, incident-41/fact-3, incident-41/fact-4.

#### incident-42 · Events in India · phase complete

#### incident-43 · Parliament complete

#### incident-44 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Changing authority: India event · Leader.

Other recorded developments: Manual event test · Turmoil; Special Envoy; Manual event test · Turmoil; Special Envoy; Events in India · phase begins.


### Turn 5

#### incident-45 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 31; mood: irritated; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-45/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-45/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-45/fact-0.

#### incident-46 · Special Envoy

Secretary confidence after incident: 31; mood: weariness; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DIPL-CH-01` · dry
Diplomatic efforts had restored access to a commercial opportunity. The Company was delighted to discover that conversation could occasionally achieve what threats could not.

Current evidence: incident-46/fact-0.

**Madhav of Bombay** · `TR08-DIPL-RUL-01` · guarded
“The merchants may return to business. Whether this improves our relations with the Company remains to be seen.”

Current evidence: incident-46/fact-0.

#### incident-47 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 29; mood: irritation; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-47/fact-0.
Earlier experience/attitude evidence: incident-1/fact-0, incident-3/fact-0, incident-12/fact-0, incident-14/fact-0, incident-23/fact-0, incident-25/fact-0, incident-34/fact-0, incident-36/fact-0, incident-41/fact-4, incident-45/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-47/fact-0.

#### incident-48 · Special Envoy

Secretary confidence after incident: 29; mood: weariness; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-envoy-v1` · neutral
Bombay: diplomacy restored a commercial opportunity.

Current evidence: incident-48/fact-0.

**Madhav of Bombay** · `TR08-DIPL-RUL-02` · sardonic
“How extraordinary. The Company has obtained something it wanted without conquering anyone.”

Current evidence: incident-48/fact-0.

#### incident-49 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-50 · Events in India · storms resolved

#### incident-51 · India stack · tile revealed

#### incident-52 · India event · Leader

**Chronicler** · `chronicler-event-v1` · neutral
India event · Leader. Hyderabad: 2 tower levels, 0 unrest; 1 disrupted commercial opportunities.


#### incident-53 · Events in India · phase complete

#### incident-54 · Parliament complete

#### incident-55 · Game ended · Final turn completed

**Chronicler** · `chronicler-end-game-v1` · neutral
Other recorded developments: Manual event test · Turmoil; Special Envoy; Manual event test · Turmoil; Special Envoy; Events in India · phase begins; India event · Leader. The campaign has ended. No further years are added.


## cooperative-commerce

Scenario 1710; seed 808; 5 turns. Initial cautious secretary: formality 3, humour 1, caution 85 / pride 30. No repeated Tax pressure; cooperation may develop from actual beneficial interventions.

### Turn 1

#### incident-1 · Army of Bombay → Bombay: success; 0 officer losses.

**Chronicler** · `CH-C01` · Dry commercial irony
The Company had arrived to conduct business. Unfortunately for the local rulers, it had developed an increasingly generous interpretation of the word.

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Madhav of Bombay** · `RU-M04-05` · Defiant
“The Company has won today. I shall be interested to learn whether it has also acquired the wisdom to make use of its victory.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Thomas Bell** · `AD-M04-07` · Smug
“A magnificent victory. I must admit I had not expected such a decisive result, though naturally I had planned for it.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

#### incident-2 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 48; mood: irritated; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-2/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-2/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-2/fact-0.

#### incident-3 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 49; mood: hopeful; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-3/fact-0, incident-3/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-3/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-3/fact-1.

**Edward Hale** · `TR08-REST-SEC-01` · hopeful
“Commerce has resumed. I sincerely hope this marks the beginning of a more stable arrangement.”

Current evidence: incident-3/fact-1.

#### incident-4 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 47; mood: irritation; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-4/fact-0.
Earlier experience/attitude evidence: incident-2/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-4/fact-0.

#### incident-5 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 47; mood: cautious; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-5/fact-0, incident-5/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-01` · hostile
“The Company calls it free trade. I notice that freedom seems to belong almost exclusively to the Company.”

Current evidence: incident-5/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-3/fact-0, incident-3/fact-1.

**Edward Hale** · `TR08-REST-SEC-02` · cautious
“We have restored commercial access once more. I shall be rather more cautious in predicting how long it will last.”

Current evidence: incident-5/fact-1.
Earlier experience/attitude evidence: incident-2/fact-0, incident-3/fact-1, incident-4/fact-0.
Owned callback memories: `memory:incident-3:fact-1:secretary-bombay:trade-military`.
Earlier words by this same character: `incident-3:line-3` — “Commerce has resumed. I sincerely hope this marks the beginning of a more stable arrangement.”

#### incident-6 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-7 · Events in India · storms resolved

#### incident-8 · India stack · tile revealed

#### incident-9 · India event · Windfall

**Chronicler** · `chronicler-event-v1` · neutral
India event · Windfall.


#### incident-10 · Events in India · phase complete

#### incident-11 · Parliament complete

#### incident-12 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Changing authority: Army of Bombay → Bombay: success; 0 officer losses..

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Windfall.


### Turn 2

#### incident-13 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 45; mood: irritated; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-13/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-13/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-13/fact-0.

#### incident-14 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 45; mood: caution; core caution: 85. Ruler's prior political attitude: hostile.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-14/fact-0, incident-14/fact-1.

**Madhav of Bombay** · `TR08-MIL-RUL-01` · contemptuous
“I understand the Company has brought soldiers to encourage trade. Its understanding of voluntary commerce continues to fascinate me.”

Current evidence: incident-14/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-3/fact-0, incident-3/fact-1, incident-5/fact-0, incident-5/fact-1.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-14/fact-1.

#### incident-15 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 43; mood: irritation; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-15/fact-0.
Earlier experience/attitude evidence: incident-2/fact-0, incident-4/fact-0, incident-13/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-15/fact-0.

#### incident-16 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 43; mood: exasperated; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-16/fact-0, incident-16/fact-1.

**Edward Hale** · `TR08-REST-SEC-03` · exasperated
“I have prepared the usual proclamation announcing the restoration of trade. Perhaps we might dispense with the ceremony this time.”

Current evidence: incident-16/fact-1.
Earlier experience/attitude evidence: incident-2/fact-0, incident-3/fact-1, incident-4/fact-0, incident-5/fact-1, incident-13/fact-0, incident-14/fact-1, incident-15/fact-0.
Owned callback memories: `memory:incident-14:fact-1:secretary-bombay:trade-military`.

#### incident-17 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-18 · Events in India · storms resolved

#### incident-19 · India stack · tile revealed

#### incident-20 · India event · Peace

**Chronicler** · `chronicler-event-v1` · neutral
India event · Peace. Delhi: 2 tower levels, 0 unrest; 1 disrupted commercial opportunities. Maratha: 3 tower levels, 0 unrest; 1 disrupted commercial opportunities.

Current evidence: incident-20/fact-0.

#### incident-21 · Events in India · phase complete

#### incident-22 · Parliament complete

#### incident-23 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Peace.


### Turn 3

#### incident-24 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 41; mood: irritated; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-24/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-24/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-24/fact-0.

#### incident-25 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 41; mood: resigned; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-25/fact-0, incident-25/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-03` · independent
“The Company has proved a useful partner. I intend to remember that partnership is not the same thing as obedience.”

Current evidence: incident-25/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-3/fact-0, incident-3/fact-1, incident-5/fact-0, incident-5/fact-1, incident-14/fact-0, incident-14/fact-1, incident-16/fact-0, incident-16/fact-1.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-25/fact-1.

**Edward Hale** · `TR08-REST-SEC-04` · resigned
“I am beginning to suspect that maintaining our commercial privileges requires considerably more effort than obtaining them.”

Current evidence: incident-25/fact-1.
Earlier experience/attitude evidence: incident-2/fact-0, incident-3/fact-1, incident-4/fact-0, incident-5/fact-1, incident-13/fact-0, incident-14/fact-1, incident-15/fact-0, incident-16/fact-1, incident-24/fact-0.
Owned callback memories: `memory:incident-16:fact-1:secretary-bombay:trade-military`.

#### incident-26 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 39; mood: irritation; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-26/fact-0.
Earlier experience/attitude evidence: incident-2/fact-0, incident-4/fact-0, incident-13/fact-0, incident-15/fact-0, incident-24/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-26/fact-0.

#### incident-27 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 39; mood: weariness; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-27/fact-0, incident-27/fact-1.

#### incident-28 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-29 · Events in India · storms resolved

#### incident-30 · India stack · tile revealed

#### incident-31 · India event · Turmoil

Secretary confidence after incident: 39; mood: weariness; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `TR08-CASC-CH-01` · dry
The disruption spread along the trading network. Commerce, it appeared, possessed a remarkable talent for sharing misfortune.

Current evidence: incident-31/fact-0, incident-31/fact-1, incident-31/fact-2, incident-31/fact-3.

**Mansur of Madras** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-31/fact-0, incident-31/fact-1, incident-31/fact-2, incident-31/fact-3.

**Edward Mercer** · `TR08-CASC-SEC-01` · alarmed
“The difficulties have spread to neighbouring markets. I had understood that commercial enterprise was supposed to encourage cooperation.”

Current evidence: incident-31/fact-0, incident-31/fact-1, incident-31/fact-2, incident-31/fact-3.

#### incident-32 · Events in India · phase complete

#### incident-33 · Parliament complete

#### incident-34 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Turmoil.


### Turn 4

#### incident-35 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 37; mood: irritated; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-35/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-35/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-35/fact-0.

#### incident-36 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 37; mood: weariness; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-36/fact-0, incident-36/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-03` · independent
“The Company has proved a useful partner. I intend to remember that partnership is not the same thing as obedience.”

Current evidence: incident-36/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-3/fact-0, incident-3/fact-1, incident-5/fact-0, incident-5/fact-1, incident-14/fact-0, incident-14/fact-1, incident-16/fact-0, incident-16/fact-1, incident-25/fact-0, incident-25/fact-1, incident-27/fact-0, incident-27/fact-1.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-36/fact-1.

#### incident-37 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 35; mood: irritation; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-37/fact-0.
Earlier experience/attitude evidence: incident-2/fact-0, incident-4/fact-0, incident-13/fact-0, incident-15/fact-0, incident-24/fact-0, incident-26/fact-0, incident-35/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-37/fact-0.

#### incident-38 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 35; mood: weariness; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-38/fact-0, incident-38/fact-1.

#### incident-39 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-40 · Events in India · storms resolved

#### incident-41 · India stack · tile revealed

#### incident-42 · India event · Leader

Secretary confidence after incident: 33; mood: alarmed; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-event-v1` · neutral
The rebellion in Punjab succeeded.

Current evidence: incident-42/fact-0, incident-42/fact-1, incident-42/fact-2, incident-42/fact-3, incident-42/fact-4.

**Salim of Punjab** · `RU-R03-06` · Clear-eyed
“Today we are free. Tomorrow we must discover whether we are capable of remaining so.”

Current evidence: incident-42/fact-0, incident-42/fact-1, incident-42/fact-2.

**Jalal of Delhi** · `m2-sovereign-rebellion-won` · worried
The rebellion in Punjab has succeeded. We cannot write its independence out of the record.

Current evidence: incident-42/fact-0.

**Madhav of Bombay** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-42/fact-2, incident-42/fact-3, incident-42/fact-4.

**Edward Hale** · `TR08-CASC-SEC-01` · alarmed
“The difficulties have spread to neighbouring markets. I had understood that commercial enterprise was supposed to encourage cooperation.”

Current evidence: incident-42/fact-2, incident-42/fact-3, incident-42/fact-4.

**Thomas Bell** · `TR08-CASC-OFF-01` · outraged
“This is intolerable! We have invested considerable effort in establishing these commercial connections, and now they are being used to spread dissatisfaction!”

Current evidence: incident-42/fact-2, incident-42/fact-3, incident-42/fact-4.

#### incident-43 · Events in India · phase complete

#### incident-44 · Parliament complete

#### incident-45 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Changing authority: India event · Leader.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins.


### Turn 5

#### incident-46 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 31; mood: irritated; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-46/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-46/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-46/fact-0.

#### incident-47 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 31; mood: weariness; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-47/fact-0, incident-47/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-03` · independent
“The Company has proved a useful partner. I intend to remember that partnership is not the same thing as obedience.”

Current evidence: incident-47/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-3/fact-0, incident-3/fact-1, incident-5/fact-0, incident-5/fact-1, incident-14/fact-0, incident-14/fact-1, incident-16/fact-0, incident-16/fact-1, incident-25/fact-0, incident-25/fact-1, incident-27/fact-0, incident-27/fact-1, incident-36/fact-0, incident-36/fact-1, incident-38/fact-0, incident-38/fact-1.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-47/fact-1.

#### incident-48 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 29; mood: irritation; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-48/fact-0.
Earlier experience/attitude evidence: incident-2/fact-0, incident-4/fact-0, incident-13/fact-0, incident-15/fact-0, incident-24/fact-0, incident-26/fact-0, incident-35/fact-0, incident-37/fact-0, incident-42/fact-4, incident-46/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-48/fact-0.

#### incident-49 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 29; mood: weariness; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-49/fact-0, incident-49/fact-1.

#### incident-50 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-51 · Events in India · storms resolved

#### incident-52 · India stack · tile revealed

#### incident-53 · India event · Leader

**Chronicler** · `chronicler-event-v1` · neutral
India event · Leader. Hyderabad: 2 tower levels, 0 unrest; 1 disrupted commercial opportunities.


#### incident-54 · Events in India · phase complete

#### incident-55 · Parliament complete

#### incident-56 · Game ended · Final turn completed

**Chronicler** · `chronicler-end-game-v1` · neutral
Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Leader. The campaign has ended. No further years are added.


## connected-cascades

Scenario 1813; seed 808; 4 turns. Initial cautious secretary: formality 3, humour 1, caution 85 / pride 30. Repeated Tax/administrative pressure keeps conquest grievances salient despite useful restored commerce.

### Turn 5

#### incident-1 · Bombay · Governor General Tax

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Madhav of Bombay** · `FB07-TAX-RUL-01` · Guarded
“The Company has presented its demands. I shall reserve my gratitude until I discover what remains afterward.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

**Arthur Pembroke** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-1/fact-0, incident-1/fact-1.

#### incident-2 · Governor General · Govern check

**Chronicler** · `chronicler-govern-v1` · neutral
Bengal: Governor General failure recorded; 1 unrest added. Bombay: Governor General failure recorded; 1 unrest added. Madras: Governor General failure recorded; 1 unrest added.

Current evidence: incident-2/fact-0, incident-2/fact-1, incident-2/fact-2.

**Azim of Bengal** · `ruler-admin-1` · worried
The administration in Bengal has produced another matter for the court to consider.

Current evidence: incident-2/fact-0.

**Mansur of Madras** · `RU-R03-01` · Calculating
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-2/fact-2.

**Madhav of Bombay** · `RU-R03-02` · Restrained
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-2/fact-1.

**Arthur Pembroke** · `FB07-ADM-SEC-02` · Anxious
“There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”

Current evidence: incident-2/fact-0.

#### incident-3 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 50; mood: watchful; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-event-v1` · neutral
Hyderabad: a commercial opportunity was disrupted.

Current evidence: incident-3/fact-0.

**Yusuf of Hyderabad** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-3/fact-0.

#### incident-4 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 50; mood: watchful; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-CASC-CH-01` · dry
The disruption spread along the trading network. Commerce, it appeared, possessed a remarkable talent for sharing misfortune.

Current evidence: incident-4/fact-0, incident-4/fact-1, incident-4/fact-2, incident-4/fact-3.

**Mansur of Madras** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-4/fact-0, incident-4/fact-1, incident-4/fact-2, incident-4/fact-3.

**Edward Mercer** · `TR08-CASC-SEC-01` · alarmed
“The difficulties have spread to neighbouring markets. I had understood that commercial enterprise was supposed to encourage cooperation.”

Current evidence: incident-4/fact-0, incident-4/fact-1, incident-4/fact-2, incident-4/fact-3.

#### incident-5 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 48; mood: alarmed; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-CASC-CH-01` · dry
The disruption spread along the trading network. Commerce, it appeared, possessed a remarkable talent for sharing misfortune.

Current evidence: incident-5/fact-0, incident-5/fact-1, incident-5/fact-2, incident-5/fact-3, incident-5/fact-4, incident-5/fact-5.

**Madhav of Bombay** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-5/fact-0, incident-5/fact-1, incident-5/fact-2, incident-5/fact-3, incident-5/fact-4, incident-5/fact-5.

**Edward Hale** · `TR08-CASC-SEC-01` · alarmed
“The difficulties have spread to neighbouring markets. I had understood that commercial enterprise was supposed to encourage cooperation.”

Current evidence: incident-5/fact-0, incident-5/fact-1, incident-5/fact-2, incident-5/fact-3, incident-5/fact-4, incident-5/fact-5.

**Thomas Bell** · `TR08-CASC-OFF-01` · outraged
“This is intolerable! We have invested considerable effort in establishing these commercial connections, and now they are being used to spread dissatisfaction!”

Current evidence: incident-5/fact-0, incident-5/fact-1, incident-5/fact-2, incident-5/fact-3, incident-5/fact-4, incident-5/fact-5.

#### incident-6 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 46; mood: irritated; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-CASC-CH-01` · dry
The disruption spread along the trading network. Commerce, it appeared, possessed a remarkable talent for sharing misfortune.

Current evidence: incident-6/fact-0, incident-6/fact-1, incident-6/fact-2, incident-6/fact-3, incident-6/fact-4, incident-6/fact-5, incident-6/fact-6, incident-6/fact-7.

**Jalal of Delhi** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-6/fact-0, incident-6/fact-1, incident-6/fact-2, incident-6/fact-3, incident-6/fact-4, incident-6/fact-5, incident-6/fact-6, incident-6/fact-7.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-6/fact-0, incident-6/fact-1, incident-6/fact-2, incident-6/fact-3, incident-6/fact-4, incident-6/fact-5, incident-6/fact-6, incident-6/fact-7.

#### incident-7 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

**Chronicler** · `chronicler-event-v1` · neutral
Manual event test · Turmoil.

Current evidence: incident-7/fact-0, incident-7/fact-1, incident-7/fact-2, incident-7/fact-3, incident-7/fact-4, incident-7/fact-5, incident-7/fact-6, incident-7/fact-7.

#### incident-8 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

**Chronicler** · `chronicler-event-v1` · neutral
Manual event test · Turmoil.

Current evidence: incident-8/fact-0, incident-8/fact-1, incident-8/fact-2, incident-8/fact-3, incident-8/fact-4, incident-8/fact-5, incident-8/fact-6, incident-8/fact-7.

#### incident-9 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

**Chronicler** · `chronicler-event-v1` · neutral
Manual event test · Turmoil.

Current evidence: incident-9/fact-0, incident-9/fact-1, incident-9/fact-2, incident-9/fact-3, incident-9/fact-4, incident-9/fact-5, incident-9/fact-6, incident-9/fact-7.

#### incident-10 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

**Chronicler** · `chronicler-event-v1` · neutral
Manual event test · Turmoil.

Current evidence: incident-10/fact-0, incident-10/fact-1, incident-10/fact-2, incident-10/fact-3, incident-10/fact-4, incident-10/fact-5, incident-10/fact-6, incident-10/fact-7.

#### incident-11 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 47; mood: hopeful; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-11/fact-0, incident-11/fact-1.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-11/fact-1.

**Edward Hale** · `TR08-REST-SEC-01` · hopeful
“Commerce has resumed. I sincerely hope this marks the beginning of a more stable arrangement.”

Current evidence: incident-11/fact-1.

#### incident-12 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 45; mood: irritation; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-12/fact-0.
Earlier experience/attitude evidence: incident-5/fact-5, incident-6/fact-4, incident-6/fact-6.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-12/fact-0.

#### incident-13 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 45; mood: cautious; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-13/fact-0, incident-13/fact-1.

**Edward Hale** · `TR08-REST-SEC-02` · cautious
“We have restored commercial access once more. I shall be rather more cautious in predicting how long it will last.”

Current evidence: incident-13/fact-1.
Earlier experience/attitude evidence: incident-5/fact-5, incident-6/fact-4, incident-6/fact-6, incident-11/fact-1, incident-12/fact-0.
Owned callback memories: `memory:incident-11:fact-1:secretary-bombay:trade-military`.
Earlier words by this same character: `incident-11:line-2` — “Commerce has resumed. I sincerely hope this marks the beginning of a more stable arrangement.”

#### incident-14 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-15 · Events in India · storms resolved

#### incident-16 · India stack · tile revealed

#### incident-17 · India event · Windfall

**Chronicler** · `chronicler-event-v1` · neutral
India event · Windfall.


#### incident-18 · Events in India · phase complete

#### incident-19 · Parliament complete

#### incident-20 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Administration and its replies: Bombay · Governor General Tax; Governor General · Govern check.

Other recorded developments: Manual event test · Turmoil; Manual event test · Turmoil; Manual event test · Turmoil; Manual event test · Turmoil; Manual event test · Turmoil; Manual event test · Turmoil; Manual event test · Turmoil; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Windfall.


### Turn 6

#### incident-21 · Bombay · Governor General Tax

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-21/fact-0, incident-21/fact-1.

**Madhav of Bombay** · `FB07-TAX-RUL-03` · Concerned
“Another demand. I begin to wonder whether their expectations have any natural limit.”

Current evidence: incident-21/fact-0, incident-21/fact-1.

**Arthur Pembroke** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-21/fact-0, incident-21/fact-1.

#### incident-22 · Governor General · Govern check

**Chronicler** · `chronicler-govern-v1` · neutral
Bengal: Governor General failure recorded; 1 unrest added. Bombay: Governor General failure recorded; 1 unrest added. Madras: Governor General failure recorded; 1 unrest added.

Current evidence: incident-22/fact-0, incident-22/fact-1, incident-22/fact-2.

**Madhav of Bombay** · `RU-R03-02` · Restrained
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-22/fact-1.

**Mansur of Madras** · `ruler-admin-1` · worried
The administration in Madras has produced another matter for the court to consider.

Current evidence: incident-22/fact-2.

**Arthur Pembroke** · `FB07-ADM-SEC-02` · Anxious
“There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”

Current evidence: incident-22/fact-0.

#### incident-23 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 43; mood: irritated; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-23/fact-0.
Earlier experience/attitude evidence: incident-5/fact-5, incident-6/fact-4, incident-6/fact-6, incident-12/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-23/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-23/fact-0.

#### incident-24 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 43; mood: caution; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-24/fact-0, incident-24/fact-1.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-24/fact-1.

#### incident-25 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 41; mood: irritation; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-25/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-25/fact-0.

#### incident-26 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 41; mood: resigned; core caution: 85. Ruler's prior political attitude: ambiguous.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-26/fact-0, incident-26/fact-1.

**Edward Hale** · `TR08-REST-SEC-04` · resigned
“I am beginning to suspect that maintaining our commercial privileges requires considerably more effort than obtaining them.”

Current evidence: incident-26/fact-1.
Earlier experience/attitude evidence: incident-5/fact-5, incident-6/fact-4, incident-6/fact-6, incident-11/fact-1, incident-12/fact-0, incident-13/fact-1, incident-23/fact-0, incident-24/fact-1, incident-25/fact-0.
Owned callback memories: `memory:incident-24:fact-1:secretary-bombay:trade-military`.

#### incident-27 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-28 · Events in India · storms resolved

#### incident-29 · India stack · tile revealed

#### incident-30 · India event · Peace

**Chronicler** · `chronicler-event-v1` · neutral
India event · Peace. Mysore: 3 tower levels, 0 unrest; 1 disrupted commercial opportunities. Madras: 0 tower levels, 2 unrest; 1 disrupted commercial opportunities.

Current evidence: incident-30/fact-0, incident-30/fact-1.

#### incident-31 · Events in India · phase complete

#### incident-32 · Parliament complete

#### incident-33 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Administration and its replies: Bombay · Governor General Tax; Governor General · Govern check.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Peace.


### Turn 7

#### incident-34 · Bombay · Governor General Tax

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-34/fact-0, incident-34/fact-1.

**Madhav of Bombay** · `FB07-TAX-RUL-03` · Concerned
“Another demand. I begin to wonder whether their expectations have any natural limit.”

Current evidence: incident-34/fact-0, incident-34/fact-1.

**Arthur Pembroke** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-34/fact-0, incident-34/fact-1.

#### incident-35 · Governor General · Govern check

**Chronicler** · `chronicler-govern-v1` · neutral
Bengal: Governor General failure recorded; 1 unrest added. Bombay: Governor General failure recorded; 1 unrest added. Madras: Governor General failure recorded; 1 unrest added.

Current evidence: incident-35/fact-0, incident-35/fact-1, incident-35/fact-2.

**Madhav of Bombay** · `RU-R03-02` · Restrained
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-35/fact-1.

**Mansur of Madras** · `RU-R03-01` · Calculating
“A discontented population is a dangerous thing. Particularly when those responsible for its discontent believe themselves universally adored.”

Current evidence: incident-35/fact-2.

**Arthur Pembroke** · `FB07-ADM-SEC-02` · Anxious
“There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”

Current evidence: incident-35/fact-0.

#### incident-36 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 39; mood: irritated; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-36/fact-0.
Earlier experience/attitude evidence: incident-5/fact-5, incident-6/fact-4, incident-6/fact-6, incident-12/fact-0, incident-23/fact-0, incident-25/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-36/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-36/fact-0.

#### incident-37 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 39; mood: exasperated; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-37/fact-0, incident-37/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-03` · independent
“The Company has proved a useful partner. I intend to remember that partnership is not the same thing as obedience.”

Current evidence: incident-37/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-1, incident-11/fact-0, incident-11/fact-1, incident-13/fact-0, incident-13/fact-1, incident-21/fact-0, incident-21/fact-1, incident-22/fact-1, incident-24/fact-0, incident-24/fact-1, incident-26/fact-0, incident-26/fact-1, incident-34/fact-0, incident-34/fact-1, incident-35/fact-1.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-37/fact-1.

**Edward Hale** · `TR08-REST-SEC-03` · exasperated
“I have prepared the usual proclamation announcing the restoration of trade. Perhaps we might dispense with the ceremony this time.”

Current evidence: incident-37/fact-1.
Earlier experience/attitude evidence: incident-5/fact-5, incident-6/fact-4, incident-6/fact-6, incident-11/fact-1, incident-12/fact-0, incident-13/fact-1, incident-23/fact-0, incident-24/fact-1, incident-25/fact-0, incident-26/fact-1, incident-36/fact-0.
Owned callback memories: `memory:incident-26:fact-1:secretary-bombay:trade-military`.

#### incident-38 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 37; mood: irritation; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-event-v1` · neutral
Bombay: a commercial opportunity was disrupted.

Current evidence: incident-38/fact-0.

**Madhav of Bombay** · `TR08-DISR-RUL-02` · concerned
“The merchants will suffer from this disruption as well. We should be careful not to mistake inconvenience for victory.”

Current evidence: incident-38/fact-0.

#### incident-39 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 37; mood: weariness; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-39/fact-0, incident-39/fact-1.

#### incident-40 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-41 · Events in India · storms resolved

#### incident-42 · India stack · tile revealed

#### incident-43 · India event · Turmoil

Secretary confidence after incident: 35; mood: alarmed; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `TR08-CASC-CH-01` · dry
The disruption spread along the trading network. Commerce, it appeared, possessed a remarkable talent for sharing misfortune.

Current evidence: incident-43/fact-0, incident-43/fact-1, incident-43/fact-2, incident-43/fact-3, incident-43/fact-4, incident-43/fact-5, incident-43/fact-6, incident-43/fact-7, incident-43/fact-8, incident-43/fact-9.

**Madhav of Bombay** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-43/fact-0, incident-43/fact-1, incident-43/fact-2, incident-43/fact-3, incident-43/fact-4, incident-43/fact-5, incident-43/fact-6, incident-43/fact-7, incident-43/fact-8, incident-43/fact-9.

**Mansur of Madras** · `TR08-CASC-RUL-01` · amused
“The Company spent years connecting the markets of India. It seems they have finally discovered that trouble can travel along the same roads.”

Current evidence: incident-43/fact-0, incident-43/fact-1, incident-43/fact-2, incident-43/fact-3, incident-43/fact-4, incident-43/fact-5, incident-43/fact-6, incident-43/fact-7, incident-43/fact-8, incident-43/fact-9.

**Edward Hale** · `TR08-CASC-SEC-01` · alarmed
“The difficulties have spread to neighbouring markets. I had understood that commercial enterprise was supposed to encourage cooperation.”

Current evidence: incident-43/fact-0, incident-43/fact-1, incident-43/fact-2, incident-43/fact-3, incident-43/fact-4, incident-43/fact-5, incident-43/fact-6, incident-43/fact-7, incident-43/fact-8, incident-43/fact-9.

**Thomas Bell** · `TR08-CASC-OFF-01` · outraged
“This is intolerable! We have invested considerable effort in establishing these commercial connections, and now they are being used to spread dissatisfaction!”

Current evidence: incident-43/fact-0, incident-43/fact-1, incident-43/fact-2, incident-43/fact-3, incident-43/fact-4, incident-43/fact-5, incident-43/fact-6, incident-43/fact-7, incident-43/fact-8, incident-43/fact-9.

**Edward Mercer** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-43/fact-0, incident-43/fact-1, incident-43/fact-2, incident-43/fact-3, incident-43/fact-4, incident-43/fact-5, incident-43/fact-6, incident-43/fact-7, incident-43/fact-8, incident-43/fact-9.

#### incident-44 · Events in India · phase complete

#### incident-45 · Parliament complete

#### incident-46 · Begin next turn

**Chronicler** · `chronicler-next-turn-v1` · neutral
Administration and its replies: Bombay · Governor General Tax; Governor General · Govern check.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Turmoil.


### Turn 8

#### incident-47 · Bombay · Governor General Tax

**Chronicler** · `CH-R03-01` · Dry satire
The Company had expected gratitude, or at least obedience. The inhabitants, demonstrating their usual difficulty with administrative terminology, appeared to have confused both with resentment.

Current evidence: incident-47/fact-0, incident-47/fact-1.

**Madhav of Bombay** · `FB07-TAX-RUL-03` · Concerned
“Another demand. I begin to wonder whether their expectations have any natural limit.”

Current evidence: incident-47/fact-0, incident-47/fact-1.

**Arthur Pembroke** · `FB07-TAX-SEC-01` · Composed, smug
“The revenue has been requested. I am confident the gentlemen responsible for providing it will appreciate the distinction between a request and an obligation.”

Current evidence: incident-47/fact-0, incident-47/fact-1.

#### incident-48 · Governor General · Govern check

**Chronicler** · `chronicler-govern-v1` · neutral
Bengal: Governor General failure recorded; 1 unrest added. Bombay: Governor General failure recorded; 1 unrest added. Madras: Governor General failure recorded; 1 unrest added.

Current evidence: incident-48/fact-0, incident-48/fact-1, incident-48/fact-2.

**Azim of Bengal** · `ruler-admin-1` · worried
The administration in Bengal has produced another matter for the court to consider.

Current evidence: incident-48/fact-0.

**Madhav of Bombay** · `RU-R03-02` · Restrained
“Anger is easily gathered. It is rather more difficult to persuade it to march in the same direction.”

Current evidence: incident-48/fact-1.

**Mansur of Madras** · `ruler-admin-1` · worried
The administration in Madras has produced another matter for the court to consider.

Current evidence: incident-48/fact-2.

**Arthur Pembroke** · `FB07-ADM-SEC-02` · Anxious
“There appears to have been a failure somewhere between the issuing of instructions and their unfortunate execution.”

Current evidence: incident-48/fact-0.

#### incident-49 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

**Chronicler** · `chronicler-event-v1` · neutral
Manual event test · Turmoil.

Current evidence: incident-49/fact-0, incident-49/fact-1, incident-49/fact-2, incident-49/fact-3, incident-49/fact-4, incident-49/fact-5, incident-49/fact-6, incident-49/fact-7.

#### incident-50 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 35; mood: weariness; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay cleared its unrest and restored commercial access.

Current evidence: incident-50/fact-0, incident-50/fact-1.

**Madhav of Bombay** · `TR08-REL-RUL-03` · independent
“The Company has proved a useful partner. I intend to remember that partnership is not the same thing as obedience.”

Current evidence: incident-50/fact-1.
Earlier experience/attitude evidence: incident-1/fact-0, incident-1/fact-1, incident-2/fact-1, incident-11/fact-0, incident-11/fact-1, incident-13/fact-0, incident-13/fact-1, incident-21/fact-0, incident-21/fact-1, incident-22/fact-1, incident-24/fact-0, incident-24/fact-1, incident-26/fact-0, incident-26/fact-1, incident-34/fact-0, incident-34/fact-1, incident-35/fact-1, incident-37/fact-0, incident-37/fact-1, incident-39/fact-0, incident-39/fact-1, incident-47/fact-0, incident-47/fact-1, incident-48/fact-1.

**Thomas Bell** · `TR08-MIL-OFF-01` · proud
“The markets are open again. A magnificent demonstration of the benefits of firm government.”

Current evidence: incident-50/fact-1.

#### incident-51 · Manual event test · Turmoil · MANUALLY TRIGGERED TEST EVENT

Secretary confidence after incident: 33; mood: irritated; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `TR08-DISR-CH-01` · dry
Commercial activity in Bombay had suffered another interruption. The Company's merchants were expected to take the development personally.

Current evidence: incident-51/fact-0.
Earlier experience/attitude evidence: incident-5/fact-5, incident-6/fact-4, incident-6/fact-6, incident-12/fact-0, incident-23/fact-0, incident-25/fact-0, incident-36/fact-0, incident-38/fact-0, incident-43/fact-4, incident-43/fact-5, incident-43/fact-7.

**Madhav of Bombay** · `TR08-DISR-RUL-01` · critical
“The Company appears astonished that trade requires the cooperation of those with whom it wishes to trade.”

Current evidence: incident-51/fact-0.

**Edward Hale** · `TR08-DISR-SEC-01` · irritated
“A most unfortunate disruption. Commerce cannot be expected to flourish when everyone insists upon having opinions about it.”

Current evidence: incident-51/fact-0.

#### incident-52 · Army of Bombay → Bombay: success; 0 officer losses.

Secretary confidence after incident: 33; mood: weariness; core caution: 85. Ruler's prior political attitude: aligned.

**Chronicler** · `chronicler-deploy-v1` · neutral
The Company intervention in Bombay restored commercial access.

Current evidence: incident-52/fact-0, incident-52/fact-1.

#### incident-53 · Events in India · phase begins

**Chronicler** · `chronicler-phase-start-v1` · neutral
Events in India · phase begins.


#### incident-54 · Events in India · storms resolved

#### incident-55 · India stack · tile revealed

#### incident-56 · India event · Leader

**Chronicler** · `chronicler-event-v1` · neutral
India event · Leader. Punjab: 3 tower levels, 0 unrest; 1 disrupted commercial opportunities.


#### incident-57 · Events in India · phase complete

#### incident-58 · Parliament complete

#### incident-59 · Game ended · Final turn completed

**Chronicler** · `chronicler-end-game-v1` · neutral
Administration and its replies: Bombay · Governor General Tax; Governor General · Govern check.

Other recorded developments: Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Manual event test · Turmoil; Army of Bombay → Bombay: success; 0 officer losses.; Events in India · phase begins; India event · Leader. The campaign has ended. No further years are added.
