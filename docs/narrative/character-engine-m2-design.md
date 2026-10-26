# Character Engine Milestone 2 — Families, claims, succession and regency

**26 October 2026 · Detailed design proposal for review. Not yet Codex implementation authorization.**

## Intent and boundaries

Make Indian rulers and their families persist as interconnected individuals whose history matters. Players make **no** character-family decisions. The John Company 2E resolver alone determines territorial control, sovereignty, vassalage, strengths and other gameplay effects. A narrative transition can change who represents existing rule; it cannot change map mechanics.

Split implementation into **M2A family/claims foundation** and **M2B automatic succession/regency**. This sequencing avoids making generated deaths before a valid coherent successor exists.

## Current verified implementation baseline

- Character Engine M1, `docs/narrative/character-engine-m1-implementation.md`, preserves 23 identities, 8 seats and version-2 optional history fields, with six statuses: `alive`, `exiled`, `presumed-dead`, `dead`, `missing`, `imprisoned`.
- Current M1 role history `politicalRole`, `politicalHistory` and `conditionHistory` already has incident/turn provenance. Extend rather than duplicate this representation.
- Existing sibling links are **younger/older siblings**, not father/child, heirs apparent or spouses; do not change their history on migration.
- Current New Turn increments ages by **3 years** once; until scenario chronology is deliberately reviewed, retain existing numeric convention for all nonconfirmed-dead characters. An uncertain person's age advancing in a save is not knowledge they are alive.
- No gameplay currently generates death, exile, succession, births or marriage. All 81 approved automatic 09E scenes must remain intact.

## M2A: explicit families and claims

### Identity and kinship

Characters keep immutable IDs through marriage, adoption, deposition, exile, political allegiance changes, age and death. Suggested typed relationships with incident-provenance:
- biological parent/child; adoptive parent/child (for a recognised adoption); spouse/ex-spouse/widow(er) with marriage start and ending; guardian/ward; sibling relationship derived from shared parent when proven, or retained as explicit known sibling relation for existing M1 characters.
- spouse links must be mutual or represented as a single pair edge; prevent impossible self-relations, circular ancestry, underage marriages and conflicting simultaneous marriages unless a separately approved culture-specific model genuinely supports that arrangement.
- `dynastyId` plus historical family affiliation; marriage does not silently replace character identity or erase natal-house claims. Ruling-house display can have name/lineage, but must not retroactively convert setup's generic `dynasty` string into proof of unknown ancestors.
- Retain the `family` M1 display array for compatibility and provide a pure projection from typed links when present. Do not silently backfill parents, sexes or marriages for the eight existing sibling pairs. Proposed optional `familyLinks`, `dynasties` and `claimsV2` are design sketches; Codex should propose final schema before coding.

### Age and eligibility

Introduce a distinct character sex/gender field **only where relevant, authored and historically justified**; existing characters must not be assigned false values from their names. No forced parity or modern egalitarian assumptions; female sovereigns/regents may be rare yet plausible according to local succession context. A child can inherit a titular role, while an eligible adult serves as regent; child/young-adult thresholds should be conservative editorial settings and tested against +3 ageing.
Age difference/relationship checks prevent impossible parent-child edges and invalid marriages. No randomly generated children who were never recorded as born/introduced. An explicitly introduced child is a persistent character; birth/introduction records must be traceable to a committed narrative incident, not a viewing event.

### Claims

Claim is a persistent structured record: `claimantId`, `region` or court/title, `basis` (recognised designation, parentage, adoption, marriage-derived, previous rulership, other witnessed authority), `sourceIncident`, `confidence/standing` and `status` (asserted, dormant, realised, relinquished). This is **fictional political eligibility**, never a military modifier or a guaranteed succession. The existence of a marriage does not grant the spouse a sovereign title; a distant relative doesn't outrank an expressly recognised heir without a compatible contextual reason. Claims may endure across generations if inherited through actually recorded family ties.

### M2A delivery and tests

No generation of new people or transitions just by opening a dossier. Implement validators and read-only family dossier with meaningful relationships and provenance. Use test fixtures for marriages, multiple heirs, female regent candidates, adoption, claims and invalid ancestry. Preserve version-2 old saves unchanged and 23-person fresh cast unless a separately authorised family event later introduces a character. Exact undo/import/export/snapshot stability, no gameplay RNG changes, regular/debug/quiet parity. No portraits yet.

## M2B: automatic succession and regency

### Trigger and atomic transaction

Only a **committed, compatible narrative event** may cause an incumbent exit (confirmed natural death, plausible abdication, authorised court succession or a recorded actual control change that requires narrative representation). No timer/UI redraw, unproven officer rout or generic failed battle silently kills a ruler.

At the same committed boundary:
1. Verify actual authoritative board status and incumbent's current seat, life status and documented family/claims.
2. Decide a justified exit incident and successor eligibility; when no coherent option exists, choose a non-disruptive fallback (keep incumbent alive/office) unless death is already independently established—in that case a carefully documented newly introduced eligible replacement is required, not an invalid vacant seat.
3. Select successor from **eligible living known characters** first: recognised adult heir with appropriate claim; suitably recognised child with eligible regent; other credible daughter/son/sibling/widow/adopted heir/established claimant depending on fictional court tradition and support; introduce a new credible candidate only if necessary. No automatic male primogeniture; no automatic daughter/widow accession either.
4. Atomically update former ruler's role/fate, `n.seats[region]`, successor's role, title/claim outcomes, regent relationship if any, grievance/political memories and one immutable chronicle scene with provenance.
5. Maintain **exact region control/strength/overlord** as determined by game state. A succession conflict can be narrated as tension but cannot cause a game-rule rebellion without the actual resolver.
6. Returning to old saved states/Undo restores old seat and identity with no extra RNG draw; redo returns exactly the same successor and text.

### Regent vs sovereign

A minor ruler may hold the **legitimate titular seat** if M1's seat invariant is expanded to distinguish titular ruler from `actingRegentId`, who must be a different eligible adult. Ensure existing consumers do not accidentally call a child 'regent' or describe a mother as sovereign when she merely acts for the child. Adult regency ends at a committed New Turn milestone if conditions warrant; may continue under contested/council circumstances when justified and recorded. Independent vs Company-dependent vs vassal control remains an orthogonal map-derived position.

### Fate and death

- **Confirmed-dead** cannot return; dying ruler must cease occupying active seat atomically.
- **Exiled** is a living displaced status, with higher *relative* chance of later compatible restoration, not an automatic successor to any distant throne.
- **Presumed-dead** is unavailable as a routine successor. No hidden isAlive flag or preselected surprise; any genuine reappearance belongs to later Milestone 4 with committed public reveal. Do not substitute a false claimant for the original ID.
- `missing` and `imprisoned` are not ordinary present-and-available regents; narrative eligibility should be conservative unless explicit release/return is committed.
- New Turn mortality must be rare and age/health-aware; **do not choose numeric mortality percentages yet**. Simulate scenarios over many campaigns and review projected ruler turnover before enabling it. Avoid killing enough rulers that players never recognise recurring faces.
- Expected M2B scope can deliver eligibility and explicit committed test succession first, with live mortality switched on only after tuning and approved writing.

### Story tone and disclosure

Major succession receives a serious or dryly humorous complete scene, highlighting specific known heir/parent/minister history. Avoid literal board objects and never fabricate confirmed murders, violence, death by battle, parental kinship or wealth transfer. Family detail isn't an excuse to multiply generic NPCs; a few memorable relatives per dynasty are preferable. Same narrative scene principles: automatically presented in Narrative mode, factual instructions retain priority, no 'Read scene' click or new acknowledgement, Normal/quiet unchanged.

## Example eligibility situations to test

1. Recognised adult heir succeeds an older ruler, existing map status untouched.
2. Recognised child succeeds, widow/mother serves as regent, seat role and dialogue accurately distinguish both.
3. Several adult claimants: one credible winner, other claimant retains political claim and documented grievance without generating map revolt.
4. Previously existing M1 younger sibling is *eligible for consideration* but not automatically a child or designated heir.
5. No qualified family: introduction of successor with an explicit origin rather than invisible seat rewrite.
6. Daughter/widow/adopted relative may lawfully succeed or become regent when scenario-aware succession tradition supports it.
7. Dead, exiled, missing, imprisoned or presumed-dead unavailable candidates are never accidentally installed.
8. Married-off princess's spouse never obtains control simply through marriage; relationship/claims can persist without title.
9. Existing Company-dependent ruler succession does not reassert Indian sovereignty, and vassal ruler succession preserves overlord.
10. Older version-2 saves, Debug setup, repeated processing, snapshots/Undo/Redo and 09E automatic scenes remain stable.

## Remaining choices before authorizing M2B live generation

- Determine scenario-specific succession customs and how to express gender, adoption, designation and regency without unverifiable universal rules.
- Set maximum family size, child-generation frequency and narrative event cooldowns.
- Tune age/health/mortality with a representative long-campaign simulation, including the current +3 age convention and uneven turn years.
- Review authored succession and bereavement prose before production.
- Decide whether new ruler introduction may occur only at New Turn/Leader or also upon an independently established actual conquest/regional loss (likely eventual requirement, but beyond the first succession integration).
- Distinguish ordinary lineage succession from later M4 restoration, impostor and exiled claimant surprise arcs.

## Proposed build order

1. Codex M2A: additive kinship + claims schema, validators, dossiers, test-only fixtures, strict backwards compatibility.
2. Review M2A demo and data consistency.
3. Codex M2B foundation: automatic selector and transactional seat transfer on explicit **test-only** eligible succession, simulation and authored candidate dialogues.
4. Separate creative approval for active death/succession production triggers and prose; then enable narrowly and test whole campaigns.
5. M3 Peace/Leader relationship and occasional marriage triggers.
6. M4 exiles, true survivor reveals and impostors.

**Current status:** detailed proposal, not authorization to integrate. Hosted Site must not be deployed.
