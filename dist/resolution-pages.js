import {showAnticipation,anticipationLines} from './narrative-resolution.js';
import {IDS,REGIONS,controlLabel} from './model.js';
import {exposedRegion} from './event-stack.js';
import {elephantPlacement} from './map-geometry.js';
import {orderLabel} from './actions.js';

export function positionLabel(p){return p.to?`${REGIONS[p.from].name} border → ${REGIONS[p.to].name}`:`Wholly inside ${REGIONS[p.from].name}`;}
function miniMap(highlight,position,esc){
 const place=position?elephantPlacement(position.from,position.to):null;
 let marker='';
 if(place){const {x,y}=place;marker=place.inside?`<circle cx="${x}" cy="${y}" r="24" fill="#8b3e27"/><text x="${x}" y="${y+9}" text-anchor="middle" font-size="28" fill="white">E</text>`:`<path d="M${x-place.dx*30} ${y-place.dy*30}L${x+place.dx*45} ${y+place.dy*45}" stroke="#fff9e9" stroke-width="24"/><path d="M${x-place.dx*30} ${y-place.dy*30}L${x+place.dx*45} ${y+place.dy*45}" stroke="#8b3e27" stroke-width="12"/><path d="M${x+place.dx*45} ${y+place.dy*45}l${-place.dx*25-place.dy*18} ${-place.dy*25+place.dx*18}l${place.dy*36} ${-place.dx*36}Z" fill="#8b3e27"/>`;}
 return `<svg class="resolution-map" viewBox="0 0 1265 1218" role="img" aria-label="${esc(position?positionLabel(position):REGIONS[highlight[0]].name)}">${IDS.map(id=>`<path d="${REGIONS[id].path}" fill="${highlight.includes(id)?REGIONS[id].color:'#e2e3da'}" stroke="${highlight.includes(id)?'#294c3e':'#fffdf5'}" stroke-width="${highlight.includes(id)?10:5}"/>`).join('')}${marker}</svg>`;
}
export function elephantPageHTML(move,esc){
 const after=move.after;
 return `<p class="eyebrow">PHYSICAL BOARD · ELEPHANT</p><div class="elephant-destination"><p class="small-note">Previous position: ${esc(positionLabel(move.before))}</p><h4>${esc(positionLabel(after))}</h4><p>${after.to?`Place the Elephant on the border of <b>${esc(REGIONS[after.from].name)}</b>, facing into <b>${esc(REGIONS[after.to].name)}</b>.`:`Place the Elephant <b>wholly inside ${esc(REGIONS[after.from].name)}</b>.`}</p></div>${miniMap([after.from,...(after.to?[after.to]:[])],after,esc)}<p>Move the physical Elephant, then continue.</p>`;
}
export function showElephantSteps({instructions,elephantMoves=[],after=0,showDialog,esc,onProgress=()=>{},onDone}){
 const $=id=>document.getElementById(id);let cursor=after;
 function next(){
  const move=elephantMoves.find(m=>m.instructionIndex>=cursor);
  if(!move){onDone(cursor);return;}
  const isMove=move.instructionIndex===cursor,end=isMove?cursor+1:move.instructionIndex;
  showDialog(isMove?'Move the Elephant':'Board changes before the Elephant moves',isMove?elephantPageHTML(move,esc):`<p>Resolve these physical changes before moving the Elephant.</p><ol class="action-instructions">${instructions.slice(cursor,end).map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`, '<button id="continue-resolution-step" class="primary">Continue</button>');
  let advanced=false;
  $('continue-resolution-step').onclick=()=>{if(advanced)return;try{onProgress(end);advanced=true;cursor=end;next();}catch(e){$('form-error').textContent=e.message||e;}};
 }
 next();
}
export function stackRegionHTML(state,esc){
 const id=exposedRegion(state.eventStack);
 if(!id)return '<p>No region is currently exposed on the stack.</p>';
 const r=REGIONS[id],v=state.regions[id];
 return `<p class="eyebrow">EXPOSED REGION · EVENT RESOLVED</p><h4 class="stack-region-name">${esc(r.name)}</h4><p class="tag">${esc(controlLabel(state,id))}</p>${miniMap([id],null,esc)}<div class="stack-region-facts"><div><span>Tower levels</span><b>${v.strength}</b></div><div><span>Unrest</span><b>${v.unrest}</b></div><div><span>Closed orders</span><b>${Object.values(v.orders).filter(x=>!x).length} / ${r.orders.length}</b></div></div><h4>Orders</h4><ul class="stack-order-list">${r.orders.map(([oid])=>`<li>${esc(orderLabel(oid))}: <b>${v.orders[oid]?'Open':'Closed'}</b></li>`).join('')}</ul><p>This is the region on top of the event stack after resolution. Its back stays visible on the main screen. The next event’s front remains hidden.</p>`;
}
export function showStackRegion({state,showDialog,esc}){
 const topRegion=exposedRegion(state.eventStack),done=()=>document.getElementById('dialog').close();
 const show=()=>{
  showDialog('Region on top of the event stack',stackRegionHTML(state,esc),`<button id="stack-region-done" class="primary">${anticipationLines(state,topRegion).length?'Continue':'Return to map'}</button>`);
  document.getElementById('stack-region-done').onclick=()=>showAnticipation({state,topRegion,position:positionLabel(state.elephant),showDialog,onBack:show,onDone:done});
 };
 show();
}
