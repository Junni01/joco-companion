import {phaseFor} from './india-phase.js';

export function operationsBlockReason(s){
 if(s.gameEnd)return 'The game has ended.';
 if(phaseFor(s))return 'Company Operation has ended for this turn.';
 if(s.eventStack?.pending)return 'Resolve the revealed event first.';
 return '';
}
export function governorTaxCount(s,region){
 const logs=s.history.filter(h=>h.turn===s.turn&&h.input?.region===region);
 const old=logs.filter(h=>h.actionType==='unrest'&&h.input.reason==='tax'&&h.input.taxMode!=='general');
 // Older versions only recorded taxes AFTER the first; infer that first tax once.
 return logs.filter(h=>h.actionType==='tax'&&h.input.taxMode==='governor').length+(old.length?old.length+1:0);
}
export function generalTaxUsed(s,region){
 return s.history.some(h=>h.turn===s.turn&&h.input?.region===region&&((h.actionType==='tax'&&h.input.taxMode==='general')||(h.actionType==='unrest'&&h.input.reason==='tax')));
}
export function taxBlockReason(s,region){
 return operationsBlockReason(s)||(s.regions[region]?.control!=='company'?'Only Company regions can be taxed.':s.laws.governorGeneral&&generalTaxUsed(s,region)?'Governor General Tax unrest has already been placed here this turn.':'');
}
export function envoyBlockReason(s,region){
 return operationsBlockReason(s)||(s.laws.governorGeneral?'The Governor General has replaced the Director of Trade.':s.regions[region]?.control!=='indian'?'Special Envoy cannot open orders in Company regions.':Object.values(s.regions[region].orders).every(Boolean)?'There are no closed orders to open.':'');
}
