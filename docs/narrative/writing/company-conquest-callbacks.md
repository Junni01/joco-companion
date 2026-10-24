# Conquest Memories and Later Callbacks — Authored Catalogue (Collection 01B)

**Status:** User-approved writing direction; reviewable authored content, 24 October 2026.  
**Use:** Select only after a related subsequent committed event and supported remembered source. These are fictional utterances, not new gameplay facts.  
**Companion:** [Company Conquest dialogue](company-conquest-dialogue.md) and [Narrative style guide](style-guide.md).

## Evidence/eligibility conventions

- `earlier-conquest`: the current speaker was directly affected by a committed Company conquest of the named region; the source incident survives this branch.
- `subsequent-tax`: a later committed Tax affects the same region; don't imply money was paid or actual income changed unless separately recorded.
- `failed-expedition`: a later actual failed/catastrophic Company deployment affecting the relevant region.
- `successful-rebellion`: a later successfully resolved independence/rebellion outcome. Do not treat mere unrest or an unsuccessful rebellion as freedom.
- `saved-boast`: exact earlier line spoken by the attributed character with an appropriate audience/knowledge link.
- `saved-assurance`: exact earlier expression of hope or assurance spoken by attributed adviser and eligible to be remembered. The existence of the statement doesn't imply intention to deceive.
- No callback may use an event from an undone/abandoned branch or suggest a physical witness merely because the character was politically affected.

## After conquest → Tax

| ID | Required sources | Voice | Exact authored text |
| --- | --- | --- | --- |
| CB-C-TAX-01 | earlier-conquest + subsequent-tax | Bitter, concise ruler | “They took the kingdom. Now they send the bill.” |
| CB-C-TAX-02 | earlier-conquest + subsequent-tax | Proud, sarcastic ruler | “I had assumed the conquest was payment enough. Evidently, I misunderstood the terms.” |
| CB-C-TAX-03 | earlier-conquest + subsequent-tax | Cautious ruler | “Their demands are becoming easier to predict. I wish I could say the same of their intentions.” |

The first two imply a complaint about a Tax, not a confirmed personal payment. A tax event may carry the Company's statutory mechanics separately in the UI.

## After conquest → failed Company expedition

| ID | Required sources | Voice | Exact authored text |
| --- | --- | --- | --- |
| CB-C-FAIL-01 | earlier-conquest + failed-expedition | Sarcastic ruler | “How reassuring. The Company's armies have finally discovered that this territory is not theirs merely for the asking.” |
| CB-C-FAIL-02 | earlier-conquest + failed-expedition | Vindictive ruler | “Their previous success appears to have encouraged certain unfortunate assumptions.” |
| CB-C-FAIL-03 | earlier-conquest + failed-expedition | Proud ruler | “I trust the Company will remember this visit rather longer than I intend to welcome the next.” |

For a failed expedition where the target was already Company-controlled, avoid suggesting it attempted a new conquest; use a suitable intervention/defence-specific reaction instead.

## After a saved military boast → later failure

| ID | Required sources | Voice | Exact authored text |
| --- | --- | --- | --- |
| CB-BOAST-FAIL-01 | saved-boast by this adviser + later failed expedition, speaker knows boast | Cutting ruler | “I recall your confidence rather better than your results.” |
| CB-BOAST-FAIL-02 | saved-boast + later failed expedition | Dry chronicler | The adviser's earlier confidence remained undiminished in the historical record. His recent expedition offered less support for it. |

The chronicler variant must be grounded in a boast and a **supported association** between the relevant adviser and later failure; do not claim he personally commanded unless established. If the current speaker has no knowledge of the saved boast, the character callback is ineligible.

## After conquest → successful independence/rebellion

| ID | Required sources | Voice | Exact authored text |
| --- | --- | --- | --- |
| CB-C-REB-01 | earlier-conquest + successful-rebellion | Proud ruler | “The Company was most insistent that the matter was settled. I fear we shall have to disappoint it.” |
| CB-C-REB-02 | earlier-conquest + successful-rebellion | Bitter ruler | “They called our defeat inevitable. I trust they will be equally philosophical about their own.” |
| CB-C-REB-03 | earlier-conquest + successful-rebellion | Cautious ruler | “Independence has been recovered. I suggest we resist the temptation to mistake it for permanence.” |

**Special requirements:** CB-C-REB-01 requires an earlier *saved Company statement* that the matter was settled. CB-C-REB-02 requires an earlier *saved Company statement* calling defeat inevitable. Otherwise use CB-C-REB-03 or another evidence-safe line. The narrator may report restored independence only if the actual board state supports it.

## Saved assurance → later renewed unrest

| ID | Required sources | Voice | Exact authored text |
| --- | --- | --- | --- |
| CB-ASSURE-01 | saved-assurance from adviser + later relevant unrest | Sarcastic ruler | “Mr {adviserSurname}'s assurances are becoming considerably more interesting than his results.” |
| CB-ASSURE-02 | adviser previously said he *hoped* improvement would last + later renewed unrest | Wry adviser himself | “I said that I hoped the improvement would last. I should have specified how long.” |
| CB-ASSURE-03 | saved-assurance + later related setback | Chronicler | The earlier prediction had proved optimistic. Its author would doubtless prefer the word *premature*. |

The name must resolve to the actual speaker of the saved utterance. A mere expression of hope does **not** establish that the adviser guaranteed any outcome. Use “hope” rather than “assurance” in a reply where the original statement was only hopeful. A failed promise is not automatically a deliberate lie.

## From the complete EX-C01 conquest exchange

**Required source:** The complete authored exchange EX-C01 was actually selected/saved (including its Company peace statement), the speaker knew it, and a later relevant failed expedition occurred.

- **CB-PEACE-RETURN-01 — Indian ruler, sardonic:** “I see the Company has returned to discuss peace. Its arguments appear somewhat less persuasive this time.”
- **CB-PEACE-TAX-01 — Indian ruler, bitter:** “First they brought soldiers to discuss peace. Now they send collectors to explain prosperity.” Requires later Tax in this region.
- **CB-PEACE-INDEPENDENCE-01 — Indian ruler, triumphant:** “At last we have reached a peaceful settlement. I find the absence of Company soldiers greatly improves the conversation.” Requires genuine independence and must not assert that all soldiers physically departed unless established. **Safer default:** “At last we have reached a settlement I might describe as peaceful. The Company may find my definition unexpectedly strict.”

The last callback is included as a stylistic candidate but requires careful fact review before activation. Do not infer a total physical troop departure from a sovereignty change.

## Global selection/format requirements

1. **Source validation first.** Check canonical history, chosen saved statements, speaker knowledge and turn/branch ordering before personality weighting.
2. **No fake names or times.** Replace `{adviserSurname}` only with the exact relevant saved speaker's surname; if unavailable, use a different complete line.
3. **No meta language.** Never substitute “incident,” “memory score,” “recorded result,” or technical terms inside character lines.
4. **Pacing.** Existing M2 trial cooldowns (approximately 2–3 relevant incidents for repeating a source) apply. Important events may override; use different phrasing.
5. **State changes.** The historical event and original utterance remain saved even after emotional reconciliation. A joke may become bitter, affectionate or irrelevant as relations change.
6. **Presentation.** Save source IDs and full text. Dossiers expose the chain of evidence on demand; ordinary dialogue remains short and conversational.
7. **No mechanical consequences.** The lines express fictional attitudes only.

**Editorial note:** These are first-collection exemplars. Codex may adapt data shape, never silently rewrite approved wording or loosen predicates to make a joke appear more often. Additional authored alternatives should return for creative review.
