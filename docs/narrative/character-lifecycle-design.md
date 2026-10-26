# Character lifecycle and succession — design proposal

**26 October 2026. Concept proposal arising from user-approved direction to design a character lifecycle. NOT Codex implementation authorization.** Peace's neighbouring-house marriage scope and existing protagonist continuity remain governed by `collection09cd-counsel-dialogues.md`.

## Design principle

The narrative remembers actual people; it does not simply regenerate regional speaker names. A character has a persistent ID, family and personal history independent of the region's game control, plus a current fictional political role. All territorial outcomes, allegiance and tower strength remain solely determined by the John Company 2E resolver. Players do not administer the family simulation.

## Two independent axes

- **Life status:** alive, dead, missing, imprisoned, exiled (the last three are narrative whereabouts/fate categories, not automatic disqualification from claims). Do not conflate being deposed with death.
- **Political role:** sovereign ruler, vassal ruler, Company-appointed/Company-dependent regional ruler, regent, heir, claimant, minister, former ruler, other court figure. A regent may govern for a child who is the titular heir. Current region office assignment must stay consistent with actual map control and the recorded handoff.

A character may persist as a defeated claimant without ruling; an existing ruler may serve under a new overlord when the actual transfer makes that plausible. The rogue British VIP follows these same rules. Foreign commanders are separate from Indian regional sovereignty: a successful foreign attack doesn't automatically create a permanently foreign-administered province.

## Introductory sources

1. Initial region rulers / family nuclei at campaign creation.
2. Named relatives/children from an eligible marriage, birth, widowhood or heir-recognition scene.
3. Established ministers, rivals and pretenders from Leader or rebellion events.
4. Rare handcrafted VIP entry under its own predicates.

Prefer reusing suitable named characters rather than generating substitutes. A character never changes identity merely because their role or allegiance changes.

## Suggested persistent data (illustrative, not yet frozen)

- Character: immutable `id`, created-by incident, name, dynasty ID, approximate age or age band, alive/fate status, role, associated region, traits (temperament, ambition, legitimacy/confidence, health), outlook toward Company, historical incident references and former roles.
- Kinship: separate typed links (parent/child, spouses with dates and status, siblings derived from parentage) and lineage/dynasty with appropriate eligibility constraints; maintain a single identity through marriage and succession.
- Relationships: personal regard, trust and provenance-bound grievances; links to actual Peace treaties, betrayals and court episodes. A kinship link does not force affection or fealty.
- Claims: character, claimed region/title, origin incident and present status (asserted/dormant/abandoned/realised). Claims are **fictional political interests**, not independent mechanical authority.
- Office holder: explicitly project from verified region state, using narrative appointed/selected individual only where applicable. Keep sovereign/control/vassal distinctions clear.
- Incident provenance: source action/turn/stage and character IDs; exact saved scene/selection immutable after commitment. Do not invent a past marriage, death, succession, massacre, failed defence, payment, or troop count from suggestive text.

Avoid adding unnecessary permanent NPCs from incidental one-off dialogue.

## Lifecycle opportunities and gate conditions

**New Turn:** Age in a scenario-aware way; avoid claiming each turn is precisely one calendar year given irregular historical gaps. If timeline not confidently mapped, use approximate age bands rather than fabricated exact chronology. Older age/poor health may make illness and rare natural death eligible, not inevitable. Once a death is committed, resolve a coherent narrative successor and save both atomically. A character never dies from simply opening the roster.

**Peace on border:** Update personal regard/trust/grievances of actual adjacent rulers according to personality/history. Rarely create a legally and narratively eligible marriage **between the two participating neighbouring houses** with persistent spouses/claims. No automatic military alliance, inheritance, allegiance change or ruler swap. If ineligible, an ordinary treaty or cool reconciliation is always a valid fallback.

**Peace inside region:** Domestic stability, with optional local ruler confidence and nuanced Company outlook. It isn't a dynastic marriage trigger by default, nor evidence of material enrichment.

**Sovereign-region Leader event:** Actual mechanical +1 strength always; narratively usually the existing ruler consolidates authority, sometimes a court rival/minister gains prominence or heir is acknowledged; rarely a successor replaces an incumbent, *without modifying region control, overlord or tower strength*. A succession should normally require a compatible death, abdication or court succession incident. Avoid two separate rival 'rulers' simultaneously in the narrative.

**Non-sovereign Leader event:** Existing actual rebellion resolution dominates. Before result, speak only of a credible attempted rising; choose a known claimant/former ruler where eligible or create one. After a committed result, update their role/claim and ruler history based on real successful or failed rebellion. A failed rebellion does not by itself establish imprisonment, exile or death.

**Conquest/company loss/foreign invasion:** Translate recorded transfer to ruler continuity or displacement. Company or Indian empire control change is authoritative; choose whether a known local ruler remains, is appointed/deposed or goes into exile only if narrative outcome and roster have a coherent persistent record. Indian imperial vassalage differs from newly independent status after foreign invasion. Never use a fictional marriage to change map rules.

**Later returns:** The same saved claimant ID can recur in future Leader/rebellion/conquest fiction. Earlier defeats may be remembered and revised, but never converted retroactively to past wins.

## Narrative selection and anti-bloat

Use temperament, family history, recent incidents and actual political context to choose from serious, ironic, bitter, hopeful or triumphant scenes. A ruler's death and a major succession deserve a scene; most minor ageing, sibling relations and routine Peace do not require dedicated prompts. Prefer a few fully developed individuals per region over large unused family trees. A child needn't have a full voiced personality or portrait before they are relevant.

Future writing should include examples of: anticipated heir, unexpected succession, reluctant widow-regent, contested claim, exiled return, old rivals reconciled, grieving child, and a British-appointed ruler who betrays his former patrons *only on an actual compatible outcome*.

## Transaction and save invariants

- Produce character changes **only with an authoritative committed event/new turn**; never via preview, dialog revisit, screen render or archive read.
- Save identity, roles, incidents, relationship edits and selected exact dialogue atomically with source event. Maintain Undo/Redo, reload, snapshots and readable export provenance; no accidental narrative RNG consumption of game randomness.
- Validate no dead ruler is still active absent explicit historical/informational context; no impossible self-parent/marriage or duplicated mutually exclusive officeholders; prevent cycles in parentage and accidental identity clones.
- Narrative-only influence: relationship attributes, marriage and claims NEVER adjust target eligibility, modifiers, dice, region strength, control or printed rules.
- Existing campaigns without rich biographies should remain readable and not gain invented prior family histories on migration.

## Pending decisions before integration

- Whether to model exact dates or age bands per scenario; determine real scenario-turn chronology first.
- Exact outcome weights and cooldowns for sovereign Leader development, rare succession and marriage; test frequency across long simulated campaigns.
- What narrative-only causes justify early death, exile, imprisonment and restoration; do not overgenerate punitive outcomes.
- Succession eligibility including regencies, adoptions, female claimants and culture-specific dynasty practices.
- Character roster UI vs internal-only data: expose meaningful biographies and family trees without creating a management minigame.
- Whether to preserve or reject a narrative branch when a user corrects earlier authoritative board state.
- Review and approve prose, state schema and tests separately from currently running 09E scene integration.
