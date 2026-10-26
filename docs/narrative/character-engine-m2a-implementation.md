# Character Engine Milestone 2A — Families and Claims

Implemented M2A only on `main`, after pulling approved design commit `a842724`. This extends M1; it does not replace the character engine. **No gameplay generates people, marriages, births, deaths, heirs, claims or succession.** There are no new player decisions/management controls, fictional production dialogue, portraits, board rules or hosted deployment.

## Final additive schema

The proposed schema was stated before coding. All extensions are optional under narrative **version 2**:

- `n.familyLinks`: single pair/directional edges with immutable `id`, `type`, `fromId`, `toId`, `origin`, relationship `ages` where relevant, and optional `end`. Types: biological `parent`, `adoptive-parent`, `spouse`, `guardian`, explicit `sibling`. Directional reverse views are projections, not duplicate stored records. Spouse endings record `divorced`, `widowed` or `ended`; widowhood requires a named confirmed-dead spouse and its recorded death provenance. Missing/presumed death is insufficient.
- `n.dynasties`: ID-keyed `{id,name,origin}` catalogue. Optional `c.dynastyId` is the explicit natal house, with `c.dynastyAffiliations` records for natal, marital, adoptive or political affiliations and known endings. Natal affiliation cannot be erased by marriage. Existing `c.dynasty` text and identity remain unchanged; a generic house name is not proof of ancestors.
- `n.claimsV2`: records containing `id`, `claimantId`, `region`, `basis`, `standing`, `status`, `origin`, supporting family-link/prior-claim IDs, and optional `statusHistory`. Bases: designation, parentage, adoption, marriage-derived, previous rulership, witnessed authority. Standing is recognised/contested/unrecognised; status is asserted/dormant/realised/relinquished.
- Optional `c.introduction` records `birth` or `introduced` with origin; referenced new family identities require an introduction. An explicit birth has age zero and follows the existing committed ageing clock, not a new calendar. Optional authored `c.gender` includes value plus origin; it is never inferred from names or assigned to the original cast.

Every origin uses `{turn,source,reason}`. `source` is either a known canonical `{incidentId,actionType}` or explicit pre-campaign `{setup:true}` at the scenario start. Setup is authored known information, not an automatic migration story. Status changes are chronological, source-linked, continuous and must end at the stored current claim status. No date, unknown parent, marriage or designation is guessed.

Example test-only claim:

```js
{
  id: 'child-claim', claimantId: 'demo-child', region: 'delhi',
  basis: 'parentage', standing: 'recognised', status: 'asserted',
  origin: {turn: 1, source: {incidentId: 'incident-2', actionType: 'event'},
           reason: 'Explicit synthetic fixture record; not caused by Windfall.'},
  support: {familyLinkIds: ['father-child'], claimIds: ['founder-claim']},
  statusHistory: []
}
```

## Integrity and future eligibility context

Validation rejects self/dangling/duplicate relations, biological/adoptive ancestry cycles, guardianship cycles, impossible recorded ages, known close-kin marriages, overlapping spouse episodes, invalid widowhood, births after their relationships, and reinterpretation of an existing known sibling as an ancestor/child. Biological parent count is at most two; the supported foundation also limits active adoptive parents to two. Typed collections and histories are bounded. Claim inheritance links must be real, prior/same-origin, same-region and acyclic; parentage/adoption/marriage-derived claims need the actual connecting edge and a supporting claim held by the other relevant person. Realised claims must match the actual living seat. Previous rulership needs a current seat or recorded M1 role history, not a generic family name.

Conservative **editorial validation settings**, not John Company rules or universal historical laws: adulthood/marriage age 18, biological parent age gap 16, adult adoptive parent with gap 12, adult guardian for a minor ward at the recorded origin. Original ages still increase by **3 once per New Turn** for non-confirmed-dead characters; no age reinterpretation. Historical relationship ages are explicitly recorded, rather than inferred from a dead parent's frozen current age. Future culture-specific exceptions and scenario chronology need separate review.

`familyOf` is a pure union/projection of unchanged legacy ties and typed records. It preserves “younger sibling”/“older sibling”, supplies inverse parent/child, spouse and guardian views, derives siblings only from actual shared biological parents, and deduplicates known ties. It does not invent missing parents. Ended guardians/adoptions remain historical, not current.

`successionContext` provides unranked recorded facts for M2B: explicit claimants, designation/standing/status, current incumbent, person availability, adulthood/need for a regent, relevant active guardians, and recorded widowhood/current unmarried status. It never selects a successor, assigns a regent, ranks children/genders/claims, changes a political role or alters a seat. Unavailable life statuses remain unavailable for ordinary succession context; there is no hidden survival decision. Marriage or kinship alone does not create a claim. Regional custom and political support remain for a later selector.

## Dossiers and provenance

The existing dossier and readable character appendix display known family ties, ended relationships, sources, structured claims, claim status history, supporting family/prior-claim evidence, authored gender where present, and recorded house affiliations. No new editor or management flow. Original campaigns without typed data keep the existing family and claim display. Source references participate in named history-deletion blockers, including introductions, house affiliations and claim status updates. Reads, searches and projections do not write or consume RNG.

## Compatibility decision

**No migration, version bump, backfill or historical rewrite.** New games still create exactly the original 23 identities and eight seats, with the same names, regions, traits, sibling links, old claims, histories and RNG sequence. They do not initialize or populate typed families, houses, claims or gender. Existing current-version saves load, render, import/export and restore unchanged when these fields are absent. The legacy `family`, `claims` and `dynasty` fields remain intact; typed projections supplement them. Legacy regional-interest strings are not promoted to recognised structured inheritance claims. New structured records use the existing save/Undo/Redo/snapshot infrastructure.

## Verification

**454 tests pass, 0 fail** (418 baseline + **36** new tests). Coverage includes existing M1/prior-current-version compatibility; unchanged 23-person cast and sibling semantics; single-edge inverse views; adoption, widowhood, guardianship and derived siblings; natal-house retention; age checks, cycles and invalid references; claim basis/provenance/status/realised-seat guards; unavailable candidates; deletion blockers; exact save/Undo/Redo and read-only dossiers/export; no live family generation; typed records unchanged across New Turn; explicit test birth +3 ageing. All existing gameplay-parity and 81-scene exact-wording/automatic-presentation regressions pass.

`scripts/check-family-browser.cjs` passes in Chrome **156.0.8078.47**, **1440×900** and **1024×768**, regular/Debug, standard/quiet and Normal: original 23-person family, synthetic 31-person dynasty, source/basis expansion, no added management inputs, unchanged reads, reload, real JSON download/import, snapshot restore, actual conquest, exact Undo/Redo and no selected successor. Screenshots inspected; no page errors/horizontal overflow, and modal height stays within the viewport. Existing **09E**, **Character M1** and **M2** browser suites pass. M2 additionally covers **1440×1000** and **390×844**, protected roll progress and regular/Debug isolation.

See [small existing/synthetic family demonstration](character-engine-m2a-demo.md), [verification record](character-engine-m2a-verification.json), and reproducible test fixture `tests/character-family-fixtures.js`.

## Deliberate limits

M2B succession/regency and all live family/fate generation remain unimplemented. No culturally universal succession order, automatic male/female priority, new mortality odds, spouse-to-throne transfer, or effects on combat/control. Incapacitated-adult wards, multiple simultaneous marriages and close-kin marriage exceptions are outside the conservative supported foundation. Unknown historical dates/parentage stay unknown. Existing institutional advisers, private outlooks, narrative history, current-version saves, protected progress and all 81 automatically presented scenes are preserved. No hosted Site deployment.
Implementation commit: `88fb604a473771ec733973eeee0ccd86c12afff5`.
