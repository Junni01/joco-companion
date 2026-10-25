# Collection 09D-1 — small review demonstration

Synthetic isolated campaigns with explicitly configured personalities. Reported physical outcomes and reading acknowledgements are manual test inputs; authoritative consequences come from the real resolvers. This demonstrates integration, not creative acceptance.

## Support, committed victory

**Edward Avery** (army-bombay; army:bombay)

> If we wait until every neighbour welcomes our arrival, we shall never leave the Presidency.

Source: `09C-army-expansion-hungry`; timing: **pre-check**, player-attested-before-check. Stance: **encourage**; reservations: none explicitly stated.

Committed action: `incident-1`, deploy; target delhi; reported **success**; actual effect null; interpretation **followed**. Evidence: incident-1/fact-0, incident-1/fact-1, incident-1/fact-2, incident-1/fact-3. Public sources: board:delhi, army:bombay.

**Immediate reaction** (`09D1-deploy-supported-victory-ambitious`):

> A fine result. I trust my earlier recommendation will not be overlooked in the official account.

## Warning, committed catastrophe

**Thomas Hale** (army-madras; army:madras)

> This is an unfortunate moment to send our strength in search of further obligations.

Source: `09C-army-known-danger`; timing: **pre-check**, player-attested-before-check. Stance: **discourage**; reservations: an unfortunate moment to send our strength in search of further obligations.

Committed action: `incident-8`, deploy; target hyderabad; reported **catastrophe**; actual effect null; interpretation **proceeded-despite-warning**. Evidence: incident-8/fact-0. Public sources: board:hyderabad, army:madras, public-crisis-batch.

**Immediate reaction** (`09D1-deploy-discouraged-catastrophe-sober`):

> I advised restraint. There is no satisfaction to be found in what followed.

## Indian recommendation, success, China chosen afterwards

**Arthur Pembroke** (secretary-general; director-of-trade)

> I should prefer to call it an invitation to commerce. The court may find that wording less alarming.

Source: `09C-envoy-india-diplomat`; timing: **pre-check**, player-attested-before-check. Stance: **prefer-effect**; reservations: The court may find that wording less alarming.

Committed action: `incident-1`, envoy; target d3; reported **success**; actual effect {"kind":"china-office"}; interpretation **different-effect**. Evidence: committed incident input/result (no regional fact; no additional event invented). Public sources: closed-order:d3.

**Immediate reaction** (`09D-envoy-switched-to-china`):

> China, then. I shall inform our Indian correspondents that their affairs have been temporarily overtaken by geography.

**Edward Hale** (secretary-bengal; china-affairs)

> A proper office for our interests in China would be a splendid beginning. I should prefer to have something to send it as well.

Source: `09C-china-office-plan`; timing: **post-check**, viewport-visible. Stance: **prefer-effect**; reservations: I should prefer to have something to send it as well.

Committed action: `incident-1`, envoy; target china-office; reported **success**; actual effect {"kind":"china-office"}; interpretation **not-applicable/unknown**. Evidence: committed incident input/result (no regional fact; no additional event invented). Public sources: china-office-absent.

**Immediate reaction** (`09D1-envoy-success-china`):

> There is now an office. I shall not mistake its existence for a successful voyage.

## Same support without verified pre-check timing

**Edward Avery** (army-bombay; army:bombay)

> If we wait until every neighbour welcomes our arrival, we shall never leave the Presidency.

Source: `09C-army-expansion-hungry`; timing: **pre-commit**, viewport-visible. Stance: **encourage**; reservations: none explicitly stated.

Committed action: `incident-1`, deploy; target delhi; reported **success**; actual effect null; interpretation **not-applicable/unknown**. Evidence: incident-1/fact-0, incident-1/fact-1, incident-1/fact-2, incident-1/fact-3. Public sources: board:delhi, army:bombay.

**No advice-linked reaction:** the required retrospective evidence is absent.

The last example deliberately withholds the appealing “supported victory” reaction: visible text alone does not prove it preceded the physical check. Cancelled or abandoned target previews produce no committed statements. Governor Regiment/Ship and alternative-effect claims remain withheld because their actual successful effects are not recorded.
