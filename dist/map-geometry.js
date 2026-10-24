import {REGIONS} from './model.js';
// Printed order connections, traced from the supplied game board. Endpoints are order IDs.
export const TRADE_ROUTES=[
 ['p7','d5n','M207 85 Q340 12 493 70'],
 ['p7','bo3n','M207 85 L252 223'],
 ['bo3n','d3','M252 223 Q335 175 427 166'],
 ['d5n','d3','M493 70 L427 166'],
 ['d3','d5e','M427 166 Q552 118 682 136'],
 ['d5e','ma4','M682 136 L704 269'],
 ['ma4','be5','M704 269 Q808 310 922 279'],
 ['be5','be6','M922 279 L1127 392'],
 ['be5','ma2','M922 279 Q890 410 813 499'],
 ['ma3','ma2','M500 411 Q650 478 813 499'],
 ['bo3s','ma3','M344 409 Q419 440 500 411'],
 ['bo3n','bo4','M252 223 C260 330 269 442 226 524'],
 ['bo3s','bo4','M344 409 L226 524'],
 ['bo4','my3','M226 524 Q333 640 385 757'],
 ['ma2','h7','M813 499 L627 671'],
 ['h7','my6','M627 671 C493 716 480 776 464 877'],
 ['h7','md5','M627 671 L662 870'],
 ['my3','my6','M385 757 L464 877'],
 ['my6','md4','M464 877 L597 976'],
 ['md5','md4','M662 870 Q610 900 597 976']
];
// Each segment lies on the shared vector boundary, never between arbitrary centres.
export const BORDERS={
 'delhi:punjab':[[280,103],[243,163]],
 'bombay:punjab':[[111,211],[180,187]],
 'bombay:delhi':[[335,188],[377,264]],
 'delhi:maratha':[[515,208],[654,196]],
 'bengal:delhi':[[819,146],[818,185]],
 'bengal:maratha':[[935,352],[1011,352]],
 'bombay:maratha':[[416,389],[428,460]],
 'bombay:hyderabad':[[339,527],[332,585]],
 'bombay:mysore':[[310,742],[399,719]],
 'hyderabad:maratha':[[618,554],[690,568]],
 'hyderabad:mysore':[[478,731],[539,745]],
 'hyderabad:madras':[[610,756],[674,734]],
 'madras:mysore':[[531,895],[548,938]]
};
const CENTERS={punjab:[126,132],delhi:[572,120],bengal:[1010,195],bombay:[310,340],maratha:[600,387],hyderabad:[520,620],mysore:[440,935],madras:[585,1100]};
export function elephantPlacement(from,to){
 if(!to)return {x:CENTERS[from][0],y:CENTERS[from][1],inside:true};
 let borderTo=to;
 if(!REGIONS[from].neighbors.includes(to)){
  // A distant capital can still be the subject’s rebellion target. Use the boundary facing it.
  const angle=id=>Math.atan2(CENTERS[id][1]-CENTERS[from][1],CENTERS[id][0]-CENTERS[from][0]);
  const delta=id=>Math.abs(Math.atan2(Math.sin(angle(id)-angle(to)),Math.cos(angle(id)-angle(to))));
  borderTo=[...REGIONS[from].neighbors].sort((a,b)=>delta(a)-delta(b))[0];
 }
 const [a,b]=BORDERS[[from,borderTo].sort().join(':')];
 const x=(a[0]+b[0])/2,y=(a[1]+b[1])/2,tx=b[0]-a[0],ty=b[1]-a[1],length=Math.hypot(tx,ty);
 let dx=-ty/length,dy=tx/length;
 const toward=[CENTERS[to][0]-CENTERS[from][0],CENTERS[to][1]-CENTERS[from][1]];
 if(dx*toward[0]+dy*toward[1]<0){dx=-dx;dy=-dy;}
 return {x,y,dx,dy,inside:false};
}
