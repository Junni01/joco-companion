import {REGIONS} from './model.js';
import {TRADE_ROUTES} from './map-geometry.js';

// A 09B line-specific proof from existing public board data. No deck or 09A projection changes.
export function openCompanyRoutes(regions,elephant,region){
 const {from,to}=elephant;
 if(from!==region||!to||!REGIONS[from]?.neighbors.includes(to)||regions[from]?.control!=='indian'||regions[from].overlord||regions[to]?.control!=='company')return [];
 const result=[];
 for(const [a,b]of TRADE_ROUTES){
  for(const [fromOrder,toOrder]of [[a,b],[b,a]])if(REGIONS[from].orders.some(([id])=>id===fromOrder)&&REGIONS[to].orders.some(([id])=>id===toOrder)&&regions[from].orders[fromOrder]===true&&regions[to].orders[toOrder]===true)result.push({from,to,fromOrder,toOrder});
 }
 return result.sort((a,b)=>(a.fromOrder+':'+a.toOrder).localeCompare(b.fromOrder+':'+b.toOrder));
}

// Canonical first later before-state recovers the public board at this saved assessment.
export function routesAtOutlook(state,outlook){
 if(outlook.sourceIncidentId===null)return openCompanyRoutes(outlook.personal.routeSetup||{},outlook.context.elephant,outlook.context.region);
 const cutoff=state.history.findIndex(h=>h.incident?.id===outlook.sourceIncidentId);
 const regions=JSON.parse(JSON.stringify(state.regions));
 for(const region of Object.keys(regions))for(const h of state.history.slice(cutoff+1)){
  const change=h.incident?.changes.find(c=>c.region===region);if(change){regions[region]=change.before;break;}
 }
 const elephant=state.history.slice(cutoff+1).find(h=>h.incident?.elephant)?.incident.elephant.before||state.elephant;
 if(JSON.stringify(elephant)!==JSON.stringify(outlook.context.elephant))return [];
 return openCompanyRoutes(regions,elephant,outlook.context.region);
}

export function routeSetup(regions,elephant){
 return Object.fromEntries([elephant.from,elephant.to].filter(Boolean).map(id=>[id,{control:regions[id].control,overlord:regions[id].overlord,orders:{...regions[id].orders}}]));
}
