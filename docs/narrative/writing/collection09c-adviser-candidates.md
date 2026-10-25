# Collection 09C — Adviser counsel and China colour: authored candidates

**Status:** **CREATIVELY APPROVED WRITING**, 25 October 2026, following review of eight revisions, China-assistant range and disagreement policy. These exact authored lines are approved for scoped 09C-2 integration where factual predicates can be met; 09D outcome callbacks and dialog relocation remain separate implementation scope. Character names are deliberately omitted pending Collection 10A. Use existing persistent speaker IDs and authored speaker-role voice. Proposed profile/predicate guards are mandatory, not decorative.

**Editorial aim:** No adviser is permanently the sensible one or the idiot. The same factual situation yields conflicting but personally motivated opinions. The army/adviser domain persists, personality varies by campaign. In-world people do not say 'unrest', 'cubes', 'dice', 'opium symbols', 'Orders', 'Elephant', 'deploy' as a board-game action, or mention expected numerical strength. 'Opium' itself is a real commodity and may be named by the China assistant.

## Army planning counsel — one primary voice by default

| ID | Eligibility | Voice | Exact proposed text |
|---|---|---|---|
| `09C-army-defend-professional` | Legal defence / friendly-control target with actual local unrest or exposed threat | Professional, cautious | Securing what we possess wins little praise. Losing it would invite a most thorough inquiry. |
| `09C-army-defend-vain` | Same supported defence | Proud | I had hoped to be remembered for acquiring provinces. Apparently I must first distinguish myself by retaining them. |
| `09C-army-defend-calculating` | Same supported defence | Opportunist | A secure frontier is an invitation to greater enterprise. Let us first make sure we have one. |
| `09C-army-expansion-careful` | Legal conquest attempt against an independent neighbour | Careful | A province is easily admired from a distance. The expense of keeping it is usually learned at closer quarters. |
| `09C-army-expansion-hungry` | Same conquest target with actual legal opportunity | Ambitious | If we wait until every neighbour welcomes our arrival, we shall never leave the Presidency. |
| `09C-army-expansion-bureaucratic` | Same | Administrative | I am less concerned with how we enter the province than with who will be expected to administer it afterwards. |
| `09C-army-strong-opponent-prudent` | Legal attempt against a genuinely stronger displayed Indian position | Competent/cautious | Their position is formidable. I should wish our enthusiasm to be accompanied by a suitable measure of preparation. |
| `09C-army-strong-opponent-rash` | Same | Confident/low aptitude | The size of their forces is most impressive. I trust they will find room to retreat. |
| `09C-army-strong-opponent-honest` | Same | Ambitious but competent | There is glory to be had here. I would be dishonest if I said there was not also considerable danger. |
| `09C-army-weak-opponent-mercy` | Legal attempt against weaker displayed Indian position | Restrained | Victory is one question. Whether we shall wish to be responsible for its consequences is quite another. |
| `09C-army-weak-opponent-vain` | Same | Vainglorious | A modest opponent offers a splendid opportunity to demonstrate extraordinary generalship. |
| `09C-army-known-danger` | 09A public known returned Crisis batch, and plan actually implicates current exposure | Anxious | This is an unfortunate moment to send our strength in search of further obligations. |
| `09C-army-known-danger-predatory` | Same | Ambitious | If disorder spreads, someone will find a use for it. I should prefer it were us. |
| `09C-army-recent-failure` | Adviser knows a real prior failed deployment by its institution; no unrecorded actor | Chastened | We have already been offered one lesson in confidence. I should dislike paying for a second. |
| `09C-army-recent-success` | Adviser knows one or more actual recent successful deployments | Inflated confidence | Success has made caution distinctly unpopular. I note this without recommending the fashion. |

## Contradictory *paired* exchange — only when both guards hold

**`09C-exchange-prudence-vs-glory`**: Legal high-risk conquest plan; distinct competent/cautious and ambitious advisers eligible in the planning context. Keep as one authored unit, not two independently selected quotations.

**Professional:** I advise restraint. A distant victory would leave us with one more frontier to defend.

**Careerist:** And restraint would leave us with precisely the same frontiers to explain to our superiors.

The precise second speaker must be an actually present continuing fictional adviser, never a fabricated name or impossible office. If only one eligible speaker, use a solo line instead.

## Director's Secretary — Special Envoy Indian Order

| ID | Eligibility | Voice | Exact proposed text |
|---|---|---|---|
| `09C-envoy-india-diplomat` | Intended specific eligible closed Order in non-Company Indian region | Diplomatic | I should prefer to call it an invitation to commerce. The court may find that wording less alarming. |
| `09C-envoy-india-cynic` | Same | Cynical | We shall request the opening of trade with all proper courtesy. Courtesy is cheaper than concessions. |
| `09C-envoy-india-confident` | Same | Overconfident | The proposal is eminently reasonable. I expect that to count for something, though experience is strangely divided on the point. |
| `09C-envoy-india-failure` | Actual reported failure for intended India Order; no order opens | Dry | The mission has failed to produce an agreement. Fortunately, my report need not be quite so definite. |
| `09C-envoy-india-success` | Actual success and order really opens | Self-satisfied | Commerce has found an opening. I shall refrain from examining whose interests it serves more generously. |

## Governor Administer — pre-check recommendations and post-success choice (new editorial candidates)

Unlike a specific deployment, Governor **Administer** is a check followed by a choice among rule-permitted effects after success. The proposed preference is **not a declaration** of a specific outcome. Never claim actual Tax, regiment commissioning or shipbuilding before its effect is committed. In campaigns where Governor General has replaced Governors, use a correctly eligible separate General adviser and never a fictitious active Governor.

| ID | Eligibility | Voice | Exact proposed text |
|---|---|---|---|
| `09C-governor-plan-tax` | Governor Administer planning; Tax is actually legal among eventual successful effects | Fiscal/pragmatic | I recommend improving the Company's finances. It is difficult to govern a province upon promises alone. |
| `09C-governor-plan-regiment` | Governor Administer planning; Commission Regiment is legally available | Military-minded | Our neighbours may respect an argument more readily when we have men to defend it. |
| `09C-governor-plan-ship` | Governor Administer planning; Build Company Ship legally available | Commercial | A ship would carry our interests further than another memorandum. I have written enough of those to be certain. |
| `09C-governor-plan-prudent` | Governor Administer planning; at least two successful effect options plausible | Cautious | I should prefer an undertaking whose consequences we shall not spend the next year explaining. |
| `09D-governor-followed` | Successful check, committed effect matches this adviser's **actually saved** prior recommendation | Pleased | I am relieved that my advice was of some use. One grows accustomed to the opposite. |
| `09D-governor-overruled` | Successful check, player chooses legal effect other than adviser's **actually saved** recommendation | Wounded pride | An interesting choice. I shall revise my memorandum to make room for it. |
| `09D-governor-check-failed` | Real failed Administer check; no successful effect selected | Dry | Our plans are extensive. Our achievements for the present are rather more modest. |

**Choice guard:** Select these only where the live resolver confirms legal effects and check lifecycle. No adviser can accuse a Governor of *ignoring a recommendation* if the check failed, if the effect was unavailable, or if the relevant preview was never visible/saved.

## Special Envoy — changing the intended effect after success (new editorial candidates)

| ID | Eligibility | Voice | Exact proposed text |
|---|---|---|---|
| `09D-envoy-switched-to-china` | Successful Envoy check; initial actually visible India-opening preference, final legal choice establishes Superintendent in China | Director's Secretary, resigned | China, then. I shall inform our Indian correspondents that their affairs have been temporarily overtaken by geography. |
| `09D-envoy-switched-to-india` | Successful Envoy check; initial actually visible China office preference, final choice opens a legal Indian Order | China assistant, disappointed | India has prevailed upon us once again. I shall try to look pleased on behalf of our future trade in China. |

A switch can be recorded as *actual preview history* only if the player was shown the first recommendation and then visibly changed the intended effect within the same real attempt; distinguish this from independently selected UI defaults and from unreported player motive. A successful check grants a choice; a failed check never grants an alternative effect.

## China assistant — distinct interest in opium access

| ID | Eligibility | Voice | Exact proposed text |
|---|---|---|---|
| `09C-china-office-plan` | Intended Superintendent creation, office absent | Eager | A proper office for our interests in China would be a splendid beginning. I should prefer to have something to send it as well. |
| `09C-china-office-created` | Successful Special Envoy genuinely establishes Superintendent | Bureaucratic satisfaction | At last there is an office to which my memoranda may be addressed. Whether that constitutes progress remains to be seen. |
| `09C-china-office-failure` | Reported failed Special Envoy intended for China | Dry | The establishment of an office in China has been delayed. I shall resist the temptation to call this a triumph of administrative restraint. |
| `09C-china-zero-access` | Actual zero printed opium icons across Company-controlled regions, office absent or present | Sardonic | Our ambitions in China are admirably extensive. Our means of pursuing them are not. |
| `09C-china-access-gain` | Committed territorial control change actually increases accessible printed opium icon total | Obsessive | A new source of supply! I confess to finding this rather more exciting than the military particulars. |
| `09C-china-access-loss` | Committed territorial control change actually decreases accessible icon total | Aggrieved | The loss of territory is regrettable. Its effect upon our prospects in China is positively intolerable. |
| `09C-china-no-change` | Successful conquest that adds zero opium icons; no claim of China trade | Cynical | Another province acquired, and not a grain added to our prospects in China. I wonder whether the generals consult maps for anything but roads. |
| `09C-china-high-access` | Available opium total meaningfully high **only after board verified and thresholds established** | Self-interested | India has been obliging to our commercial designs. I make a point of not asking whether it intended to be. |

## Real outcome follow-through — requires 09D commit-bound advice memory

| ID | Eligibility | Voice | Exact proposed text |
|---|---|---|---|
| `09D-warning-failure` | Same adviser actually gave saved discouraging advice for this committed deployment; reported deployment fails | Vindicated but anxious | I advised against this undertaking. I had hoped my caution would prove unnecessary rather than correct. |
| `09D-warning-success` | Same actual saved warning, deployment succeeds | Proud restraint | I concede that it succeeded. I have not yet conceded that it was wise. |
| `09D-advocate-failure` | Same adviser actually supported this committed deployment; it fails | Evasive | My recommendation was sound in principle. Events have been uncommonly hostile to principle. |
| `09D-advocate-success` | Same adviser actually supported and it succeeds | Vain | I am pleased the expedition has confirmed what I had the good sense to recommend. |
| `09D-callback-later-crisis` | Previous **committed** discouraging advice concerned loss of defence, plus subsequent actual related crisis; no causation inferred | Bitter | I warned that we might be needed here. I had hoped to be wrong. |


## Approved adviser personality range and occasional disagreement

**Institution does not dictate morality or temperament.** China affairs is concerned with available opium access, but a campaign's assistant may be commercially enthusiastic, principally worried about the administrative consequences, or morally conflicted. The character's private convictions and competence are chosen from persistent traits, not from office name or ethnicity. Maintain moments of professional sobriety; don't turn every incident into a joke about profit.

**Cross-institutional dissent is rare and evidence-led.** Primary advice normally comes from the action's own Army or trade adviser. A second, separately eligible continuing adviser appears only when a supported interest genuinely differs; for instance a target region would change Company opium access according to **verified printed map icons**, and the China assistant has a legitimate stake. No universal two-adviser debate, no invented audience/presence, and no automatic second speaker from an unrelated Presidency. Paired lines must be authored as a coherent exchange with speaker eligibility and persistent IDs; never splice arbitrary lines.

**Restraint and silence:** No fresh line every time a dialog is reopened, clicked or a +/- counter changes. One stable recommendation for a meaningful current plan is normal; routine plans may receive no counsel. A substantive target/effect change may update the preview. The preview is never treated as a recorded historical utterance until a compatible action is committed.

### Additional China voice candidates — approved wording, guarded future use

| ID | Eligibility | Voice | Exact approved text |
|---|---|---|---|
| `09C-china-prospects-commercial` | Real territorial acquisition prospect with verified printed opium access in target, no claimed shipment | Commercial enthusiast | The province may be of little military consequence, but its produce interests me considerably more than its fortifications. |
| `09C-china-prospects-accountant` | Actual committed loss of Company-accessible printed opium icons; institutional assistant exists | Bureaucratic accountant | Our supply has diminished. I trust someone will explain this development to the Directors before they discover it themselves. |
| `09C-china-prospects-uneasy` | China-affairs assistant discussing opium trade policy or legitimate potential, without asserting completed transactions | Morally conflicted | We speak rather freely of the advantages of this trade. I find we speak considerably less of those expected to consume its wares. |

These are optional personality variants, not mandatory role attitudes. The first must **not** assert the target is of little military importance unless the supported board-state context makes that comparison appropriate; if that cannot be verified, keep it withheld and report why rather than weaken the guard.

### Additional contextual cross-institution exchange — approved wording, fact-gated

**`09C-exchange-frontier-vs-opium`**: Legal planned conquest, military adviser has a **supported** reason for defending/holding difficulty, and printed map metadata verifies the planned target has opium icons not already accessible to the Company. Both real fictional advisers must be eligible. This is pre-action **speculation**, not a claimed successful conquest or profit.

**Army adviser:** The province will be difficult to hold. I see little advantage in acquiring responsibilities we can scarcely afford.

**China assistant:** Its commercial possibilities are considerable. I should be grateful if the military could trouble itself with the practicalities.

If the current data cannot support the military hold-risk claim, withhold this exchange rather than present it as an objective fact.

## Review questions

1. Is there enough variety without constant theatrical comedy?
2. Should paired dissent come from another Presidency adviser, Director's secretary, or a region-connected person only when actually eligible?
3. Do the Army lines avoid unproven claims about physical forces while still sounding military?
4. Should the China assistant be primarily satirical or occasionally principled about the opium trade?
5. Do we want any sober reactions to the human cost of Company commerce, rather than making every incident a profit joke?

**Implementation authorization:** This document provides creatively approved **exact text and factual guards** for scoped 09C-2 previews/adviser identity. It does **not** authorize 09D committed-advice callbacks, post-action narration relocation, historical-event invention, new opium map facts, or a site deployment. 09D lines are writing-approved but implementation-deferred.
