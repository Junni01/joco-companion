# Events in India: comparison with the uploaded app

Reviewed 21 October 2026. This is a comparison with the supplied `johncompany-app-main.zip` snapshot (archive commit beginning `b57feeb`, archive file dates 4 June 2026). It does not establish which revision is currently running on the public website. Our comparison baseline is source commit `4b476dad48b1b9d96da8b119ebde89f89452d39a`, followed by the independently requested China/Parliament interface changes.

The principal finding is that the uploaded source contains several incomplete or simplified event handlers. It is useful as a cross-check, but copying its event code would introduce rules discrepancies into our companion. The printed rulebook and official errata remain the rules authority.

## Execution path and overall flow

In the uploaded source, `client/src/components/events/GanjifaDeck.tsx` calls `drawNextEvent` and `handleEventResolution` in `client/src/store/index.ts`. The latter dispatches to individual event handlers. Those handlers call `completeEvent`, which calls `resolveCurrentEvent`. That last function invokes the tile's `effect` from `client/src/types/events.ts`. The tile effect functions currently return the state without additional rule changes; most meaningful map changes occur in the store handlers.

Both companions roll a storm die to set the number of events, show the exposed tile back, let the player draw the next tile, and support Undo. Both use 20 event tiles and the same six storm outcomes: East/2, West/2, South/3, All/1 and two None/4 faces. The official app's event panel explicitly makes the map view-only during the event phase; its free editing controls principally belong to Company operations.

The uploaded version decrements `eventsRemaining` when drawing, immediately adds the drawn tile to its discard pile, and increments a `turn` counter when each event completes. Our companion reserves a tile until confirmation, counts completed events separately from the actual board turn, and preserves an unfinished resolution and its dice across saves. Our event phase leads to Parliament; theirs returns directly to Company phase. That is partly a difference in product scope.

## Event-by-event findings

| Area | Uploaded source | Our companion and printed rule comparison |
| --- | --- | --- |
| Windfall | Logs who should receive money; no financial inventory | Provides physical payment instructions. Both leave writers and cash to players. |
| Turmoil | Closes the northernmost order, or starts a Cascade if all were already closed | Same basic rule. All regional northern-order priorities agree after mapping order IDs. |
| Peace | Opens the border's connected orders and adds tower levels, but also clears unrest from both border regions | Our border Peace leaves that unrest intact. Rulebook p.31 only removes unrest when the Elephant is wholly within a region; its example explicitly retains border-region unrest. |
| Leader | Sovereign gains one level; subjects rebel using the printed modifier | Shared basic behavior. However, its Company branch loses the region whenever modifier + unrest is positive, with no Army defence input. It also lacks our successful-Company-rebellion Elephant redirect. |
| Indian invasion | Uses combined empire strength only when the region being evaluated has the starred capital flag | Our defence includes the target's whole empire even when the target is a subject. Rulebook p.32 includes other regions in the defender's empire. Both use strict greater-than success and remove one attacker level on failure. |
| Company attack | The Crisis handler uses modifier + unrest and assumes defence succeeds at strength 2 or less; secondary attacks assume defence succeeds at unrest 1 or less | Our companion asks for newly available Army defence, includes the invading empire's strength when applicable, and applies Sepoy Recruitment. Fixed thresholds do not implement rulebook p.33. |
| Additional rebellions | In the Crisis Company handler, follow-up attacks are launched only when the primary attack defeats the Company. The Leader Company handler merely logs their existence | Ours resolves other unrest regions after the primary Company attack, including when that primary attack is defended, following Presidency order and asking for regional order choices when necessary. |
| Foreign Invasion | Rolls a storm result, rolls one d6 per target, logs the numbers, and completes the event. It does not compare strength or change control, towers, orders or flags | Ours resolves each target in sequence against the board resulting from earlier targets, asks for Company defence, closes orders on success, breaks empires, sets strength to floor(original d6 / 2), and handles required Elephant redirection. This is the largest implementation gap in the supplied snapshot. |
| Shuffle | Combines all discards and the remaining draw pile, then shuffles the entire combined pile once. March always happens first | Ours follows p.31: March first, shuffle the Shuffle tile into the remaining draw stack, then separately shuffle discards and put them above it. With an empty draw pile, rebuild first and March last. |
| Region loss | Clears Company control/unrest, restores one tower and closes orders. Standing consequences are logged generally | Ours preserves spent loot, clears Presidency association, gives the cumulative Standing penalty and office/Army instructions, and places closure/Cascade handling in the appropriate attack context to avoid applying it twice. |

Relevant uploaded functions are `resolveLeader`, `resolveCompanyAttack`, `resolveCompanyAttackCrisis`, `resolveAdditionalRebellion`, `resolveInvasionCrisis`, `resolveForeignInvasion`, `resolveShuffle`, `resolveRegionLoss`, and `resolveElephantPeace` in `client/src/store/index.ts`. Their counterparts are in our `dist/actions.js` and `dist/event-stack.js`.

## Cascade: reproduced behavioral difference

The uploaded `client/src/utils/gameLogic.ts` closes a region's northernmost order when a connected destination order is already closed. It then triggers a Cascade if that closure has left the destination fully closed. Rulebook p.28 instead calls for an additional Cascade when every order in the destination was *already* closed when a closure was required.

I executed the uploaded helper directly using Node's TypeScript stripping with a small fixture:

1. Region A is fully closed and Cascades into an already-closed order in B.
2. B has one other open order, which is its northernmost remaining order.
3. That last B order is connected to an open order in C.

The uploaded helper closes B's last open order and immediately Cascades out of B, also closing C's order. B should not overflow merely because its last order has just closed. Our resolver checks for an already-closed destination before deciding to Cascade and does not perform that extra overflow.

There is a second implementation distinction: the uploaded helper skips the already-closed-destination branch once its region is marked as having Cascaded. Our resolver continues to allow incoming closure effects while ensuring that each region can itself Cascade only once per event, matching the rulebook's distinction between receiving effects and overflowing.

This Cascade fixture was executed; the entire uploaded UI/store was not run as a browser application. Other findings above come from tracing the actual UI-to-store call path and comparing its code with the printed rules.

## Agreements verified programmatically

After mapping the uploaded numeric order IDs to ours, all 20 trade-route connections match, and every region's northernmost-order priority matches. The printed-shape Elephant lookup destinations and clockwise lists also agree by source inspection (the Hyderabad lists are rotations of the same cycle). Both implementations skip a capital's subjects clockwise and point a subject toward its capital. The uploaded subject lookup searches neighboring capitals only; our representation can retain a distant overlord after a larger empire changes shape.

## Component data conflicts: verify before changing anything

These are catalogue disagreements, not proof that either app has the right component pairings. Our catalogue came from the player's earlier tile specification. The uploaded source provides a different set of back/front pairings in `client/src/types/events.ts`:

| Tile/front | Uploaded catalogue | Our catalogue |
| --- | --- | --- |
| Peace with square symbol | Hyderabad back | Mysore back |
| Peace with triangle symbol | Mysore back | Madras back |
| Shuffle | Delhi back | Madras back |
| Foreign Invasion | Madras back | Maratha back |

No catalogue changes were made from this comparison. A verified paired tile manifest or component reference should settle these differences, because they change the exposed-region distribution and the correlation between fronts and backs.

The uploaded app also removes a capital's starred flag when its last subject leaves (`removeLonelyEmpireCapitals`). Our companion can retain a starred capital with no subjects until its flag is explicitly removed by the applicable rule. This can affect availability of the three empire flag colors. The supplied rulebook passages do not explicitly settle returning a lone capital's flag merely because its last subject departs; this remains a separate rules clarification rather than a correction imported from the uploaded code.

## Result

Retain our guided event resolution and physical Army defence input. Do not replace them with the supplied fixed thresholds or its incomplete Foreign Invasion handler. Keep the printed Shuffle, Peace and Cascade behavior already implemented. The highest-value follow-up is verifying the conflicting tile pairs and the lone-capital flag question. Manual opening/closing controls are an interface choice and do not establish that the automatic event logic is more accurate.
