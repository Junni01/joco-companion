# Collection 09C/09D — Source-checked trade and military boundaries

**Source:** User-provided `John_Company_Rules_(BGG)_Final.pdf`, printed pp. 18, 25 and 26 (PDF pages 18, 25, 26). Checked against text and rendered pages on 25 October 2026. This is a source-bound summary rather than a new rule interpretation; consult `docs/buried-giant-rules-audit.md` for any explicit app/campaign corrections and current code/tests for implemented scope.

## Printed page 18: Director of Trade and Special Envoy

- Director of Trade **may take Special Envoy multiple times** and then may make **up to two writer/ship transfers** between Presidencies/sea zones.
- **Special Envoy: make a check**; **each £1 spent grants one die; no penalty**.
- **Only after a successful check**, choose **one**: **(a)** open trade with China by creating the Superintendent of Trade in China office and hiring it immediately, **or (b)** open **one closed Order** in **any Indian region not Company-controlled**.
- Thus action-first choice in companion is a provisional planning/reporting preference, **not** a restriction on post-roll choice. Allow revision of effect/target before successful confirmation.
- A failed Special Envoy check performs neither success effect. The physical finance, ships and personal officeholders are not tracked by this app.

## Printed page 25: China office and opium

- The Superintendent office can be established by **successful Special Envoy to China** or **Envoy to China law**; ships assigned to office count as Eastern sea zone for storms, expenses, events and laws.
- Superintendent acts **after Bengal Presidency**.
- **Trade in China check** is an entirely **separate action**: one die per assigned ship, may be attempted once, **cannot be attempted if Company-controlled regions have no opium icons**.
- On a successful China trade check, increase Company Balance **£4 per opium icon** in Company-controlled regions and officeholder takes **£1 per icon** from bank. This is a **physical-game instruction**, not permission for this app to record actual funds or infer the result.
- The source does not say that opening an Indian Order or founding the China office creates or consumes opium icons. Opium count follows printed icons within actual Company-controlled regions.
- Existing project status says China office activation/opium potential is tracked but **actual Trade in China outcome is not tracked**. This remains true until explicit new scope.

## Printed page 26: Governor General law

- On Governor General law, **all Governors become pensioners; remove Governor overlays; no new Governors created** on later Company conquest.
- **Director of Trade card is replaced by Governor General card.** Governor General acts at the former Director's position in operations sequence. Do not show an active Director/available Special Envoy after this replacement without an actual rule supporting it.
- Governor General has its own govern actions; regional assistant speech and Governor UI must not imply old active Governor offices.

## UI/rules separation

Changing companion input to **choose intended effect before reporting success/failure** must not change any underlying physical game check, legal choice, accounting, repeat limit, office lifecycle, or ability to choose the effect **after success**. If current resolver behavior disagrees with above or a scenario/law overrides it, investigate the actual code/audit and report explicitly rather than silently changing game rules under a UI-only task.

**Not verified here:** The numeric opium-icon-per-region map counts and existing application representation have not been independently compared to a legible physical India board in this review; verify against authoritative board image/model before implementing derived opium deltas. Deployment target algorithms and Governor action availability are existing engine decisions to be preserved and regression tested, not redefined by this document.
