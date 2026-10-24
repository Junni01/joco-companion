# John Company — Narrative Writing Style Guide

**Status:** Approved creative direction and first-event writing approach, 24 October 2026.  
**Scope:** Fictional companion narrative. This is an authoring contract, not permission to change gameplay mechanics.  
**Related:** [Narrative requirements](../narrative-requirements.md), [M2 political-memory specification](../milestone-2-political-memory.md).

## Literary premise

Historical political tragicomedy: proud and sometimes ridiculous people attempting to preserve dignity, profit, power and personal reputation as events expose their contradictions.

**Humour punches up.** The sharpest satire belongs to the East India Company's commercial greed, military vanity, bureaucratic procedure, hypocrisy and institutional self-justification. Indian rulers have equal capacity for personal pride, scheming, tenderness, folly, courage and eccentricity; their humour arises from **individual character**, never cultural stereotype. Serious consequences retain gravity.

The chosen tonal baseline is **dry political comedy with occasional sharper Crusader Kings-style satire**, especially around Company authority and administrative absurdity. Exceptional characters may be more theatrical; not everyone is a comedian.

## Separate the three voices

- **Game instruction:** Exact, factual and unembellished physical actions (tower, loot, unrest, orders, dice, routs and player reports). Not part of character speech.
- **Anonymous chronicler:** Factually reliable, observant, lightly ironic as a norm, more satirical about absurd administration and political hypocrisy, serious about suffering and catastrophe. Notices contradictions only if supported by actual recorded history or saved fictional statements.
- **Fictional characters:** Speak as individuals, driven by personality, emotional state, history, political situation and voice profile. Their allegations and opinions remain subjective; personal references should sound conversational.

## Writing requirements

1. **Natural speech over data narration.** Characters never speak about internal incidents, tracking fields, memory scores or “the physical table.” A secretary may naturally mention correspondence, ledgers or reports if he is talking *as a bureaucrat*.
2. **No invented evidence.** A conquest doesn't prove a particular ruler commanded in battle, personally negotiated, stayed in a particular palace, received an offer or made a promise. Such details need real saved narrative evidence or an explicitly authored exchange that introduces them as *fictional utterances*, never as mechanical facts.
3. **Callbacks imply rather than explain.** “They took the kingdom. Now they send the bill” is better than a recap of the conquest. Quote exact wording only when a saved statement exists and is eligible.
4. **Distinct characters.** An arrogant ruler may deflect humiliation with ceremony; a cautious one protects options; a vindictive one remembers names; a pragmatist accepts a loss without inventing victory. Different advisers can be arrogant, competent, cowardly, principled or obsessed with procedure.
5. **Restraint and pacing.** Default to chronicler plus one or two reactions. Silence and sober lines are valid. Major events can support a short exchange. Avoid repeating one joke or eccentricity in every scene.
6. **Punch up without caricature.** Criticise powerful institutions, imperial hypocrisy and particular people. Do not make ethnic identity, civilians' suffering, famine, torture or tragic deaths the punchline.
7. **Tonal range.** Administrative disasters permit cutting satire; political rivalries witty barbs; death and destruction primarily sober narration.
8. **Persist exactly.** Codex should implement selection/eligibility from stable IDs and saved evidence; do not paraphrase or auto-generate replacement dialogue at runtime.

## Voice palette

| Profile | Characteristic language |
| --- | --- |
| Proud ruler | Elevated dignity, wounded vanity, sharp understatement |
| Cautious diplomat | Diplomatic precision, non-commitment, dry qualifications |
| Vindictive ruler | Concise resentment, memory of slights, personal threats framed as opinion |
| Pragmatic ruler | Practical, unsentimental, keen on what happens next |
| Careerist Company officer | Self-praise, ambition, attention to London and reputation |
| Overconfident officer | Victory proves his genius; defeat requires reclassification |
| Professional officer | Blunt about military realities, wary of political consequences |
| Bureaucratic secretary | Procedure, correspondence, committees, buck-passing, euphemism |
| Principled adviser | Can be sincere and serious; needed as a contrast |

Profiles are selectable voice combinations, not immutable character labels and never assigned by ethnicity.

## Good and bad models

| Avoid | Prefer | Why |
| --- | --- | --- |
| “The conquest remains an important memory.” | “They took the kingdom. Now they send the bill.” | Natural contextual callback |
| “The Tax has been recorded. The payment remains a matter for the physical table.” | “His Highness's objections will be entered in the appropriate ledger. I cannot undertake to have them read.” | In-world voice |
| “A previous assurance was contradicted by later unrest.” | “I said I hoped the peace would last. I should have specified how long.” | Character-driven remembered words |
| Every ruler making the same sarcastic joke | Varied anger, dignity, fear, restraint or sardonic wit | Personality matters |

## Authoring metadata contract

Every line or exchange should have a stable ID; trigger and speaker-role eligibility; supported incident/fact predicates; optional personality, voice, relationship and emotional predicates; required previous memory/statement IDs where applicable; expression/mood; exact authored text; and editorial purpose.

**A complete exchange is one authored scene unit.** Its two or three lines should be selected together, not spliced with unrelated lines. Dialogue may establish that the fictional participants said these words, but may not imply unrecorded gameplay deals or consequences.

If a required fact or earlier statement is missing, the entry is ineligible. A neutral factual fallback remains acceptable.

## Review criteria

Does the line sound like a person rather than a database? Is it consistent with the character? Does the joke have a legitimate target? Are its factual implications supported? Would repetition make it tiresome? Is the scene allowed to be serious?

**Creative ownership:** Dialogue and style are authored/reviewed collaboratively here; Codex implements selection, transactions, UI and tests. This content is approved for editorial handoff, but does not itself authorise an application implementation commit.
