import {summary} from './model.js';
// Potential proceeds of a successful check; no roll or money is recorded here.
export function chinaTrade(state){
 const icons=summary(state).opium,rate=state.laws.envoyChina?5:4;
 return {active:state.chinaOffice,icons,rate,companyRevenue:icons*rate,superintendentBonus:icons};
}
