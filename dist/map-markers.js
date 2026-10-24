import {IDS,REGIONS} from './model.js';

// Label anchors are independent of border/Elephant geometry and order positions.
export const LABEL_ANCHORS={punjab:[112,30],delhi:[637,15],bengal:[1040,100],bombay:[155,282],maratha:[655,350],hyderabad:[550,575],mysore:[449,947],madras:[567,1080]};
const EMPIRE_COLORS=['#68448a','#865022','#205c77','#576023','#924b65','#336657','#634535','#514e8c'];
export function mapAffiliation(state,id){
 const r=state.regions[id];
 if(r.control==='company')return {kind:'company',color:'#963b32',heading:'COMPANY',detail:REGIONS[r.presidency].name+' Presidency'};
 const capital=r.overlord||id,isCapital=!r.overlord&&(r.empireCapital||IDS.some(k=>state.regions[k].overlord===id));
 if(r.overlord||isCapital)return {kind:isCapital?'capital':'vassal',capital,color:EMPIRE_COLORS[IDS.indexOf(capital)],heading:isCapital?'EMPIRE CAPITAL':'VASSAL',detail:REGIONS[capital].name+' Empire'};
 return {kind:'sovereign',color:'#526152',heading:'SOVEREIGN',detail:''};
}
export function regionMarker(state,id){
 const r=state.regions[id],a=mapAffiliation(state,id),[x,y]=LABEL_ANCHORS[id],name=REGIONS[id].name;
 // Individual tower tiers and red cubes echo physical board pieces; counts stay
 // explicit even for imported high values. Never create thousands of SVG cubes.
 const tiers=Array.from({length:Math.min(r.strength,3)},(_,i)=>`<path d="M-11 ${-i*7}l11 -5 11 5v7l-11 5 -11 -5Z"/>`).join('');
 const cubes=Array.from({length:Math.min(r.unrest,3)},(_,i)=>`<path d="M${i*7-7} -8l6 -3 6 3v10l-6 3 -6 -3Z"/>`).join('');
 return `<g class="region-marker affiliation-${a.kind}" transform="translate(${x} ${y})" style="--affiliation:${a.color}" pointer-events="none" aria-label="${name}, ${a.heading}, ${a.detail}, ${r.strength} tower levels, ${r.unrest} unrest"><title>${name}: ${a.heading}${a.detail?' · '+a.detail:''}. Tower levels: ${r.strength}. Unrest: ${r.unrest}.</title><text class="region-name" text-anchor="middle">${name.toUpperCase()}</text>${a.kind==='sovereign'?'<text class="sovereign-label" y="25" text-anchor="middle">Sovereign</text>':`<rect class="affiliation-plaque" x="-76" y="11" width="152" height="39" rx="5"/><text class="affiliation-heading" text-anchor="middle" y="27">${a.kind==='capital'?'♛ ':''}${a.heading}</text><text class="affiliation-detail" text-anchor="middle" y="42">${a.detail}</text>`}<g class="region-piece-counts" transform="translate(0 ${a.kind==='sovereign'?48:72})"><rect class="piece-backing" x="-60" y="-24" width="120" height="38" rx="6"/><g class="tower-piece" transform="translate(-39 0)">${tiers||'<path class="empty-tower" d="M-11 0l11 -5 11 5v7l-11 5 -11 -5Z"/>'}</g><text class="piece-number" x="-15" y="6">${r.strength}</text><g class="unrest-piece" transform="translate(19 0)">${cubes||'<path class="empty-cube" d="M-7 -8l6 -3 6 3v10l-6 3 -6 -3Z"/>'}</g><text class="piece-number" x="40" y="6">${r.unrest}</text></g></g>`;
}
