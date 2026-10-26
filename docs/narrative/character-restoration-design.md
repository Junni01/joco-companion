# Character restoration and disputed identity — design proposal

**26 October 2026. Core creative approach approved by user; implementation not yet authorized.** Builds on approved automatic succession, confirmed-dead/exiled/presumed-dead distinctions in `character-lifecycle-design.md`. Resolvers in `dist/actions.js` are authoritative.

## Central rule

An existing claimant can be selected as the fictional protagonist of an actual event; **their presence never changes the event's probability or outcome**. The app's published-game resolver first establishes legal targets, mechanical rebellion/invasion outcome and map control. The character system may only interpret that outcome, reuse persistent identities and change narrative-only positions. Do not invent a successful rebellion, acquisition of a province, foreign occupation, military casualty or new empire relationship.

## Restoration opportunities

1. **Successful rebellion in a subject or Company region:** Possible restoration of an existing exiled former ruler or established claimant as sovereign representative **only when** the actual resolver makes the region sovereign. Existing character must be plausible for the region. Rebellion character may be provisionally selected before resolution; final reign role only commits on success.
2. **Conquest / allegiance change:** A claimant may return as a dependent local ruler only where the actual recorded overlord/control relationship supports that story. Company-dependent arrangements are distinct from Indian imperial vassalage; a successful Foreign Invasion mechanically creates sovereignty, not a foreign empire's new vassal.
3. **Peaceful rehabilitation:** An eligible exile can occasionally return to a court without taking the throne, at a narratively justified committed trigger. Must not imply new map control or move a ruler by fiat.
4. **Unexpected survival:** A *presumed-dead* character may rarely reappear during a compatible committed Leader/rebellion/conquest or political-development event, as a claimant or adviser, and may become ruler only if the actual map result or an authorized narrative-only succession of the incumbent permits it.

**Confirmed dead NEVER returns.** A new pretender may claim to be that person, but cannot become the original character ID or change the finality of recorded death.

## Candidate selection (eligibility first, weights later)

Strong regional connection, matching claim provenance, compatible age and life status, existing rival/overlord relationships and character's narrative availability all precede any selection. Prefer exiled former sovereign and exiled documented heir; then established local ruler with reason to rebel; then recognized political pretender/minister; presumed-dead claimant only as an exceptional revelation; otherwise a new generated rebel. This is a relative *story selection* preference, not probability of rebellion success. Rerolling to force a favourite character's victory is forbidden.

Selection may depend on actual ruler/claim IDs and relationship history but must not inspect hidden event order or unrevealed dice. Keep chosen protagonist/claim/source event stable across pending input, reload, Undo/Redo and archive.

## Before and after resolution

**Before outcome:** It is safe to say a named claimant is attempting a rebellion, gathering support and asserting a known claim, provided their participation has been committed to the saved pending resolution. It is NOT safe to say they have captured the throne. An exiled claimant's presence is known once they lead the attempt, even if they lose; a presumed-dead claimant's actual reappearance resolves their missing status as alive if they physically speak/appear, independent of whether the rebellion succeeds. To keep presumed-dead mystery rare and avoid premature leaks, select and commit that reveal only at the appropriate dramatic/legal trigger; a mere rumour need not establish survival.

**Success:** Actual independent sovereignty permits an eligible restored sovereign. Update character role, predecessor's role/fate, dynasty claims and remembered outcome atomically. Conquest under another sovereign may instead permit a retained/dependent ruler, never fabricated sovereign status.

**Failure:** No restored ruler. Claimant remains alive/eligible where justified; can retreat, retain grievance, suffer reputational harm or have changed relationships as expressly recorded. Failed rebellion alone is not proof of death, imprisonment or exile. If the claimant was already exiled, returning to exile is plausible, but the episode is remembered and cooldowns reduce identical repeat plots.

## Presumed dead and impostors

- Do not preselect 'secretly alive' at disappearance. Public roster and exports contain only last known facts, not a predetermined twist.
- True return is **rare** and contingent on eligible real event. Commit proof of survival at reveal; preserve original character ID and past relationships. It can be revealed without successful restoration; the person may remain claimant.
- An impostor is a **different permanent character ID** with an asserted identity or forged claim. If the original is confirmed dead, the pretender does not undo that death. A fraudulent claimant's backing might be real even when ancestry is not.
- If identity uncertainty is part of the fiction, keep the authoritative stored identity unambiguous for consistency, while public speakers may disagree. Do not retcon an established truthful chronicler claim.
- Do not make presumed-dead characters conveniently reappear every campaign. Actual weights, cooldowns and maximum frequency still need simulation and user review.

## Escalation, consequences and voice

Remember prior flight, treaty, kinship, humiliation and patrons. Returning protagonists should refer to specific *recorded* events and related living people. A successful claim can alter pride, trust and personal grievances; a failed one can deepen them. Impostor discovery is a fictional story outcome and must not imply a game-rule coup without a corresponding real event.

Characters can acquire a nemesis based on repeated personal conflict. A dynastic marriage/claim informs who has a plausible restoration story; it never transfers the province. A historical court may be sceptical about a spouse or widow inheriting, but female claimants/regents remain possible under contextual succession customs.

## Invariants and test requirements for a future Codex task

- Published-game resolution independent of character selection and outcome narration.
- One authoritative current narrative ruler per relevant region/role; no simultaneous impossible sovereign and Company office claim.
- Original persistent ID and lineage preserved across all compatible political roles; dead ID never revives.
- Story incidents and fate changes commit only with authoritative events; no rerolls on view, reload, undo, snapshot, import/export, back navigation.
- Match narration timing to revealed outcome; no 'successful restoration' before actual resolution.
- Last known status and rumours visibly separate from confirmed truth, without leaking precommitted secret fate.
- Compatible results for company rebellions, Indian empire rebellion, Indian invasions, Foreign Invasion/France and narrative-only domestic succession.
- Never spawn an NPC solely to fill an incidental quotation.

## Open editorial choices

1. **Approved:** An impostor may remain a recurring pretender after a failed claim, with their own persistent ID; no forced disappearance or automatic restoration.
2. **Approved relative weighting:** exile returns are much more common when an eligible event occurs; genuine presumed-dead returns are exceptionally rare. Numeric weights and cooldowns still require testing; avoid per-turn automatic return lottery.
3. **Approved:** A genuine unexpected survivor may be revealed during a successful restoration OR before an unsuccessful attempt; the reveal does not predetermine the rebellion result.
4. Narrow supported triggers for peaceful rehabilitation without adding extra player reporting.

These creative choices are approved. Detailed probability tuning, data schema, prose and code integration remain separate work and require a user-approved technical handoff.
