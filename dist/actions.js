import {incidentRecorder} from './incidents.js';
import {scenarioFor,finalTurn} from './scenarios.js';
import {TILES,reserveTile,pendingEvent,finishTile,exposedRegion} from './event-stack.js';
import {governorTaxCount,generalTaxUsed,taxBlockReason} from './administration.js';
import {END_REASONS,canEndGame,canCompleteGame,endingInstructions} from './game-end.js';
import {STORM_FACES,STORM_RESULTS,phaseFor,phaseActive,parliamentFinished,shipInstructions,parliamentBlockReason,nextTurnBlockReason} from './india-phase.js';
import {IDS,PRESIDENCIES,REGIONS,LAW_NAMES,clone,validate,regionsLostThisTurn} from './model.js';
import {TRADE_ROUTES} from './map-geometry.js';
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const integer=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
export const SHAPES=['circle','triangle','square'];
// Symbols are directional. Multiple symbols can identify the same border.
// Transcribed from the supplied board PDF at native image resolution.
export const SHAPE_TARGETS={
 punjab:{circle:'bombay',triangle:'bombay',square:'delhi'},
 delhi:{circle:'maratha',triangle:'bengal',square:'punjab'},
 bengal:{circle:'maratha',triangle:'delhi',square:'delhi'},
 bombay:{circle:'maratha',triangle:'punjab',square:'hyderabad'},
 maratha:{circle:'bombay',triangle:'bengal',square:'delhi'},
 hyderabad:{circle:'madras',triangle:'maratha',square:'bombay'},
 mysore:{circle:'bombay',triangle:'hyderabad',square:'madras'},
 madras:{circle:'hyderabad',triangle:'mysore',square:'mysore'}
};
export const CLOCKWISE={punjab:['delhi','bombay'],delhi:['bengal','maratha','bombay','punjab'],bengal:['maratha','delhi'],bombay:['punjab','delhi','maratha','hyderabad','mysore'],maratha:['delhi','bengal','hyderabad','bombay'],hyderabad:['maratha','madras','mysore','bombay'],mysore:['hyderabad','madras','bombay'],madras:['hyderabad','mysore']};
export const EVENTS={turmoil:'Turmoil',windfall:'Windfall',shuffle:'Shuffle',leader:'Leader',peace:'Peace',crisis:'Crisis',foreign:'Foreign Invasion'};
export const ORDER_OWNER=Object.fromEntries(IDS.flatMap(id=>REGIONS[id].orders.map(([o])=>[o,id])));
export function orderLabel(oid){
 const id=ORDER_OWNER[oid],orders=[...REGIONS[id].orders].sort((a,b)=>a[2]-b[2]),index=orders.findIndex(o=>o[0]===oid),value=orders[index][3];
 return `${REGIONS[id].name} £${value} (${orders.length===1?'only order':['northern','middle','southern'][orders.length===2&&index===1?2:index]})`;
}
export function companyRegions(s){return IDS.filter(id=>s.regions[id].control==='company');}
export function legalElephants(s){
 return IDS.flatMap(from=>{const r=s.regions[from];if(r.control==='company')return [{from,to:null}];if(r.overlord)return [{from,to:r.overlord}];
  const targets=REGIONS[from].neighbors.filter(to=>s.regions[to].overlord!==from);
  return targets.length?targets.map(to=>({from,to})):REGIONS[from].neighbors.map(subject=>({from:subject,to:from}));
 }).filter((p,i,a)=>a.findIndex(q=>q.from===p.from&&q.to===p.to)===i);
}
export function march(s,region,shape,redirectShape){
 assert(IDS.includes(region),'Report the exposed tile region.');
 const r=s.regions[region];
 if(r.control==='company')return {from:region,to:null};
 if(r.overlord)return {from:region,to:r.overlord};
 assert(SHAPES.includes(shape),'Report the border symbol on the exposed tile.');
 const around=CLOCKWISE[region],start=around.indexOf(SHAPE_TARGETS[region][shape]);
 for(let i=0;i<around.length;i++){const to=around[(start+i)%around.length];if(s.regions[to].overlord!==region)return {from:region,to};}
 assert(SHAPES.includes(redirectShape),'Report the symbol on the Elephant redirect arrow.');
 return {from:SHAPE_TARGETS[region][redirectShape],to:region};
}
export class NeedsInput extends Error{constructor(request){super('Further table information required.');this.request=request;}}
export function resolveAction(s,d){
 if(d.type==='france'){
  if(d.stormFace!==undefined){assert(d.outcome==='failed'&&integer(d.stormFace,0,5),'Invalid France storm die face.');assert(d.storm===undefined||d.storm===STORM_RESULTS[d.stormFace],'France storm result does not match its saved die.');d={...d,storm:STORM_RESULTS[d.stormFace]};}
  const topRegion=exposedRegion(s.eventStack);
  d={...d,...(topRegion?{topRegion}:{}),shape:'circle',redirectShape:'circle'};
 }
 if(s.gameEnd&&d.type!=='rename')throw Error('This game has ended. Use Undo to reopen it before recording gameplay.');
 if(d.type==='event'&&d.stackTile){assert(!d.manualTest,'A stack draw cannot also be a manual test.');assert(s.eventStack?.pending?.tileId===d.stackTile,'This tile is not the pending stack event.');d={...d,...pendingEvent(s.eventStack)};}
 if(d.type==='event'&&d.stormFace!==undefined){assert(d.event==='foreign'&&integer(d.stormFace,0,5),'Invalid Foreign Invasion storm die face.');assert(d.storm===undefined||d.storm===STORM_RESULTS[d.stormFace],'Foreign Invasion storm result does not match its saved die.');d={...d,storm:STORM_RESULTS[d.stormFace]};}
 if(s.eventStack?.pending&&!['event','stack-draw','rename'].includes(d.type))throw Error('Resolve the revealed stack event before taking another game action.');
 if(s.eventStack?.pending&&d.type==='event'&&!d.stackTile)throw Error('Resolve the revealed stack tile before running a manual test.');
 const n=clone(s),instructions=[],cascaded=new Set(),losses=[],officerRouts=[],scenes=[],elephantMoves=[];
 const journal=incidentRecorder(s,n,d);
 const phase=phaseFor(s);
 if(parliamentFinished(s)&&['law','famine','france','dilemma'].includes(d.type))throw Error('Parliament is finished. Undo Finish Parliament before recording another parliamentary outcome.');
 if(phase&&['unrest','tax','govern','envoy'].includes(d.type))throw Error('Company Operations has ended for this turn.');
 if(phaseActive(s)&&['law','famine','france','dilemma','parliament-finish','next-turn'].includes(d.type))throw Error('Finish Events in India before proceeding to Parliament or the next turn.');
 if(['law','famine','france','dilemma'].includes(d.type))assert(!parliamentBlockReason(s),parliamentBlockReason(s));
 if(d.type==='next-turn')assert(!nextTurnBlockReason(s),nextTurnBlockReason(s));

 if(phase&&d.type==='blackmail'&&d.card==='envoy')throw Error('Envoy to the Mughals must be played before Events in India begins.');
 if(phase&&d.type==='event'&&!d.manualTest)assert(phase.status==='events'&&phase.completed<phase.total,'Resolve storms first, or finish this phase if all events are complete.');

 if(!['end-game','rename'].includes(d.type))for(const id of IDS)if(n.regions[id].empireCapital===undefined)n.regions[id].empireCapital=IDS.some(k=>n.regions[k].overlord===id);
 const say=t=>instructions.push(t),name=id=>REGIONS[id].name;
 if(d.revivedByOldIdeas){assert(['law','famine','france','dilemma'].includes(d.type),'Old Ideas must resolve the recovered law or dilemma.');say('Old Ideas Made New: resolve the card selected from the physical discard pile. Cards drawn this turn are not yet discarded.');}
 const addUnrest=(id,amount)=>{if(!amount)return;assert(n.regions[id].control==='company','Unrest belongs in Company regions.');journal.add('unrest',{region:id,amount,cause:d.type,reason:d.reason||null});n.regions[id].unrest+=amount;say(`Add ${amount} unrest to ${name(id)} (now ${n.regions[id].unrest}).`);};
 function open(oid){const id=ORDER_OWNER[oid];if(!n.regions[id].orders[oid]){journal.add('order-opened',{region:id,order:oid});n.regions[id].orders[oid]=true;say(`Open ${orderLabel(oid)}; remove its closed-order marker.`);}}
 function close(oid,cascadeFrom=null){const id=ORDER_OWNER[oid];if(n.regions[id].orders[oid]){journal.add('order-closed',{region:id,order:oid,...(cascadeFrom?{cascadeFrom}:{})});n.regions[id].orders[oid]=false;say(`Close ${orderLabel(oid)}. Return any writer there to its owner; flip any filled-order token.`);}}
 const northern=id=>[...REGIONS[id].orders].sort((a,b)=>a[2]-b[2]).find(([o])=>n.regions[id].orders[o])?.[0];
 function cascade(id){
  if(cascaded.has(id))return;cascaded.add(id);journal.add('trade-cascade',{region:id});say(`${name(id)} Cascades along its trade routes.`);
  const reached=new Set();
  for(const [a,b] of TRADE_ROUTES){let oid;if(ORDER_OWNER[a]===id&&ORDER_OWNER[b]!==id)oid=b;else if(ORDER_OWNER[b]===id&&ORDER_OWNER[a]!==id)oid=a;else continue;
   if(reached.has(oid))continue;reached.add(oid);
   const other=ORDER_OWNER[oid];if(n.regions[other].orders[oid])close(oid,id);else{const next=northern(other);if(next)close(next,id);else cascade(other);}
  }
 }
 function closeAll(id){const available=REGIONS[id].orders.filter(([o])=>n.regions[id].orders[o]);if(!available.length)cascade(id);else available.forEach(([o])=>close(o));}
 function turmoil(id){const oid=northern(id);if(oid)close(oid);else cascade(id);}
 function clearUnrest(id){if(n.regions[id].unrest){journal.add('unrest-cleared',{region:id,amount:n.regions[id].unrest});say(`Remove all ${n.regions[id].unrest} unrest from ${name(id)}.`);n.regions[id].unrest=0;}}
 function release(id){n.regions[id].empireCapital=false;const children=IDS.filter(k=>n.regions[k].overlord===id);children.forEach(k=>{journal.add('release',{region:k,capital:id});n.regions[k].overlord=null;say(`Remove ${name(k)}’s allegiance flag: it becomes sovereign after ${name(id)}’s empire breaks.`);});}
 const empireStrength=id=>{const capital=n.regions[id].overlord||id;return IDS.filter(k=>k===capital||n.regions[k].overlord===capital).reduce((v,k)=>v+n.regions[k].strength,0);};
 function strengthen(id,amount){const r=n.regions[id];r.strength=Math.max(0,r.strength+amount);say(`${name(id)}: set tower to ${r.strength} level${r.strength===1?'':'s'}.`);}
 function setElephant(position){
  const before=clone(n.elephant),instructionIndex=instructions.length;n.elephant=position;
  const instruction=`Move the Elephant ${position.to?`from ${name(position.from)} facing ${name(position.to)}`:`wholly inside ${name(position.from)}`}.`;
  if(before.from!==position.from||before.to!==position.to)elephantMoves.push({before,after:clone(position),instructionIndex,instruction});
  say(instruction);
 }
 function move(region=d.topRegion,shape=d.shape){
  const r=n.regions[region],needsRegion=!r,needsShape=!!r&&r.control==='indian'&&!r.overlord&&!SHAPES.includes(shape),needsRedirect=!!r&&r.control==='indian'&&!r.overlord&&REGIONS[region].neighbors.every(id=>n.regions[id].overlord===region)&&!SHAPES.includes(d.redirectShape);
  if(needsRegion||needsShape||needsRedirect)throw new NeedsInput({type:'march',region:r?region:null,needsRegion,needsShape,needsRedirect,instructions:[...instructions],elephantMoves:clone(elephantMoves)});
  setElephant(march(n,region,shape,d.redirectShape||undefined));}
 function loseRegion(id){
  const r=n.regions[id],presidency=r.presidency;losses.push(id);
  const count=regionsLostThisTurn(s)+losses.length;
  say(`${name(id)} is lost. Army of ${name(presidency)}: if the Commander office is occupied, return half that family’s trophies (round up) and remove the Commander; roll one die per officer in the Army and remove each officer rolling 6.`);
  const removed=d.officerRouts?.[id];
  if(removed===undefined)throw new NeedsInput({type:'officer-rout',region:id,presidency,instructions:[...instructions],elephantMoves:clone(elephantMoves)});
  assert(integer(removed,0,1000),'Officer rout removals must be a whole number between 0 and 1000.');
  officerRouts.push({region:id,presidency,removed});journal.add('company-loss',{region:id,presidency,removed});
  say(`Officer rout · ${name(id)} · Army of ${name(presidency)}: ${removed} officer${removed===1?'':'s'} removed (reported from the table).`);
  if(!n.laws.governorGeneral)say(`Return the Governor of ${name(id)} card to unused offices, its officeholder and fatigue to supply, and remove its overlay.`);
  say(`Remove any unfinished Company ship; return ${name(id)}’s control token to the region loot-side facedown. Lower Company Standing by ${count} spaces for this turn’s ${count}${count===1?'st':count===2?'nd':count===3?'rd':'th'} region loss.`);
  clearUnrest(id);r.control='indian';r.presidency=null;r.overlord=null;r.strength=1;r.lootAvailable=false;
  say(`Restore ${name(id)}’s dome with one tower level.`);
 }
 function companyAttack(id,base,key){
  const multiplier=n.laws.sepoyRecruitment?2:1,unrest=n.regions[id].unrest,strength=Math.max(0,base+multiplier*unrest),answer=d.defenses?.[key];
  if(!integer(answer,0,1000))throw new NeedsInput({type:'defense',key,region:id,presidency:n.regions[id].presidency,base,unrest,multiplier,strength,instructions:[...instructions],elephantMoves:clone(elephantMoves)});
  say(`${name(id)} attack: ${base} base + ${unrest} unrest × ${multiplier} = ${strength}. Exhaust available Army strength ${Math.min(answer,strength)}; ${answer>=strength?'attack repelled':'insufficient defence'}.`);
  journal.add('battle',{kind:'company-defence',region:id,presidency:n.regions[id].presidency,base,unrest,strength,defence:answer,won:answer>=strength,key,stage:key.includes(':secondary:')?'secondary':'primary'});
  if(answer>=strength){clearUnrest(id);say(`The associated Commander, if occupied, takes one trophy for defending ${name(id)}.`);return false;}
  loseRegion(id);return true;
 }
 function secondary(prefix,primary){
  // Snapshot the eligible additional rebellions after primary consequences, then resolve using current state.
  for(const presidency of PRESIDENCIES){
   const remaining=companyRegions(n).filter(id=>id!==primary&&n.regions[id].presidency===presidency&&n.regions[id].unrest>0);
   while(remaining.length){let id=remaining[0];
    if(remaining.length>1){const key=`${prefix}:order:${presidency}:${remaining.slice().sort().join(',')}`,choice=d.attackOrder?.[key];if(!remaining.includes(choice))throw new NeedsInput({type:'attack-order',key,regions:[...remaining],presidency,instructions:[...instructions],elephantMoves:clone(elephantMoves)});id=choice;}
    remaining.splice(remaining.indexOf(id),1);
    if(n.regions[id].control==='company'&&n.regions[id].unrest>0){const won=companyAttack(id,0,`${prefix}:secondary:${id}`);if(won)closeAll(id);}
   }
  }
 }
 function join(id,capital){
  release(id);n.regions[id].overlord=null;const existing=IDS.filter(k=>n.regions[k].empireCapital);
  const hasEmpire=!!n.regions[capital].empireCapital;
  if(!hasEmpire&&existing.length>=3){say('All three empire flag colours are in use: no new empire can be formed.');return false;}
  journal.add('join',{region:id,capital});n.regions[id].overlord=capital;n.regions[capital].empireCapital=true;say(`Place ${name(capital)}’s flag on ${name(id)}. ${name(capital)} is the empire capital; use an available starred flag if this forms a new empire.`);return true;
 }
 function rebellion(id,modifier,key){
  const r=n.regions[id];
  if(r.control==='company'){
   const won=companyAttack(id,modifier,key);if(won)closeAll(id);secondary(key,id);return won;
  }
  assert(r.overlord,'Only a subject or Company region can rebel.');const capital=r.overlord,attack=r.strength+modifier,defense=n.regions[capital].strength,won=attack>defense;
  say(`${name(id)} rebellion: ${r.strength} + ${modifier} = ${attack} against ${name(capital)}’s ${defense}; ${won?'successful':'failed'} (ties fail). Other empire regions do not contribute.`);
  journal.add('battle',{kind:'rebellion',region:id,capital,attack,defence:defense,won});
  if(won){journal.add('independence',{region:id,capital});r.overlord=null;say(`Remove ${name(id)}’s empire flag: it becomes sovereign.`);closeAll(id);}else strengthen(capital,-1);return won;
 }
 function crisis(){
  const {from,to}=n.elephant,attacker=n.regions[from];let victoriousCapital=null;
  if(!to||attacker.overlord){rebellion(from,d.modifier,'crisis');}
  else{
   const attack=empireStrength(from)+d.modifier,target=n.regions[to];let won;
   if(target.control==='company'){
    won=companyAttack(to,attack,'crisis');if(won){join(to,from);closeAll(to);}else strengthen(from,-1);
    secondary('crisis',to);
   }else{
    const defense=empireStrength(to);won=attack>defense;say(`${name(from)} invasion: ${attack} attack against ${defense} empire defence; ${won?'successful':'failed'} (ties fail).`);
    journal.add('battle',{kind:'indian-invasion',region:to,attacker:from,attack,defence:defense,won});
    if(won)join(to,from);else strengthen(from,-1);
   }
   if(won)victoriousCapital=from;
  }
  move(victoriousCapital||d.topRegion);
 }
 function foreign(){
  const targets=d.storm==='all'?['bombay','madras','bengal']:d.storm==='west'?['bombay']:d.storm==='south'?['madras']:d.storm==='east'?['bengal']:d.type==='france'?[]:[d.topRegion];
  assert(['all','west','south','east','none'].includes(d.storm),'Report the storm die result.');
  const order=d.targetsOrder||targets;
  assert(order.length===targets.length&&new Set(order).size===targets.length&&order.every(id=>targets.includes(id)),'Invalid invasion target order.');
  let attackedCompany=false;
  for(const id of order){
   assert(IDS.includes(id),'Report the exposed tile region.');const roll=d.rolls?.[id];if(!integer(roll,1,6))throw new NeedsInput({type:'invasion-roll',region:id,instructions:[...instructions],elephantMoves:clone(elephantMoves)});
   say(`Foreign invasion of ${name(id)}: saved invasion die ${roll}.`);
   const wasCompany=n.regions[id].control==='company',redirect=wasCompany&&n.elephant.from===id&&!n.elephant.to;let won;
   if(wasCompany)attackedCompany=true;
   if(wasCompany)won=companyAttack(id,roll,`foreign:${id}`);else{const defense=empireStrength(id);won=roll>defense;say(`${roll} invasion strength against ${defense} empire defence: ${won?'successful':'failed'} (ties fail).`);}
   journal.add('battle',{kind:'foreign-invasion',region:id,attack:roll,won,source:d.type==='france'?'france':'foreign'});
   if(won){release(id);journal.add('foreign-settlement',{region:id});const r=n.regions[id];r.overlord=null;r.strength=Math.floor(roll/2);say(`${name(id)} is sovereign. Remove its former allegiance flag and set its tower to ${r.strength}, half the original invasion die rounded down.`);closeAll(id);if(redirect)move(d.topRegion,'circle');}
  }
  // Rules Library 13.9: finish every Foreign Invasion before one set of extra rebellions.
  if(attackedCompany){say('All Foreign Invasions are resolved. Now resolve one set of additional rebellions in the remaining Company regions with unrest, in Presidency order. Armies do not refresh.');secondary('foreign',null);}
  if(!targets.length)say('No storms: War Against France causes no invasion.');
 }
 let title='';
 if(d.type==='end-game'){
  assert(canEndGame(s),'Finish Events in India, including every remaining event, before ending the game.');
  assert(Object.hasOwn(END_REASONS,d.reason),'Choose why the game ended.');
  assert(d.reason!=='completed'||canCompleteGame(s),'Complete Parliament on the final turn before closing a completed game.');
  assert(d.note===undefined||(typeof d.note==='string'&&d.note.length<=2000),'Chronicle note must be at most 2,000 characters.');
  n.gameEnd={reason:d.reason,turn:s.turn,note:(d.note||'').trim(),at:new Date().toISOString()};
  title=`Game ended · ${END_REASONS[d.reason]}`;
  say(`The chronicle closes on turn ${s.turn}: ${END_REASONS[d.reason]}.`);
  endingInstructions(s,d.reason).forEach(say);
  const held=companyRegions(s),lost=s.history.filter(h=>h.turn===s.turn).reduce((v,h)=>v+(h.regionLosses?.length||0),0);
  say(`Final Company territory: ${held.length?held.map(name).join(', '):'none'}. Company regions lost this turn: ${lost}.`);
  if(n.gameEnd.note)say(`Closing note: ${n.gameEnd.note}`);
  say('The final map, event stack and campaign record are preserved. Gameplay is closed; Undo reopens the game. Export a JSON backup from Saved games to keep the chronicle.');
 }else if(d.type==='stack-draw'){
  assert(phase?.status==='events'&&phase.completed<phase.total,'Start Events in India and resolve ships before drawing a stack event.');assert(n.eventStack,'The event stack has not been initialized.');
  assert(!n.eventStack.pending,'A stack event is already revealed. Resume that event.');
  const p=reserveTile(n.eventStack,d.rebuild),tile=TILES[p.tileId];title='India stack · tile revealed';say(`Reveal ${EVENTS[tile.event]}${tile.modifier!==undefined?' ('+(tile.modifier>=0?'+':'')+tile.modifier+')':''}. Its back was ${name(tile.region)}. Resolve this event before drawing another.`);
 }else if(d.type==='phase-start'){
  assert(!phase,'Events in India has already begun this turn.');assert(integer(d.face,0,5),'Invalid storm die face.');const face=STORM_FACES[d.face];title='Events in India · phase begins';
  n.indiaPhase={turn:s.turn,face:d.face,total:face.events,completed:0,status:face.seas.length?'ships':'events'};
  say(`Storm die: ${face.label}. Resolve ${face.events} India event${face.events===1?'':'s'} after storms.`);shipInstructions(d.face).forEach(say);
 }else if(d.type==='phase-ships'){
  assert(phase?.status==='ships','There are no pending storm ship rolls.');title='Events in India · storms resolved';n.indiaPhase.status='events';say('All affected ships have been checked on the table. The next India event may now be drawn from the digital stack.');
 }else if(d.type==='phase-finish'){
  assert(phase?.status==='events'&&phase.completed===phase.total,'Resolve all required events before finishing the phase.');title='Events in India · phase complete';n.indiaPhase.status='complete';say('All India events are resolved. If the Company has failed, choose End game and proceed to Final Scoring. Otherwise continue to Parliament Meets.');
 }else if(d.type==='tax'){
  assert(IDS.includes(d.region),'Choose a Company region.');assert(!taxBlockReason(s,d.region),taxBlockReason(s,d.region));
  d={...d,taxMode:s.laws.governorGeneral?'general':'governor'};
  const prior=governorTaxCount(s,d.region),amount=s.laws.governorGeneral?1:prior?1:0;
  journal.add('tax',{region:d.region,mode:d.taxMode,ordinal:prior+1,unrest:amount});
  title=`${name(d.region)} · ${s.laws.governorGeneral?'Governor General Tax':`Tax ${prior+1} this turn`}`;
  say(`Resolve the successful Tax’s £2 payment on the table${s.laws.governorGeneral?'; do not place it in the Governor General’s own treasury':''}.`);
  if(amount)addUnrest(d.region,1);else say(`First Tax in ${name(d.region)} this turn: add no unrest. Later Taxes in this region add one unrest each.`);
 }else if(d.type==='unrest'){
  assert(IDS.includes(d.region),'Choose a Company region.');title=`${name(d.region)} · ${d.reason==='failure'?'Unsuccessful Administer':'Additional Tax'}`;
  assert(companyRegions(n).includes(d.region),'Choose a Company region.');
  if(d.reason==='failure'){assert(!n.laws.governorGeneral,'Use Governor General check for failed Govern rolls.');addUnrest(d.region,n.laws.zamindarTaxes?2:1);}
  else{assert(d.reason==='tax','Choose the cause of unrest.');if(n.laws.governorGeneral)assert(!generalTaxUsed(s,d.region),'Governor General Tax unrest has already been placed in this region this turn.');addUnrest(d.region,1);}
 }else if(d.type==='govern'){
  title='Governor General · Govern check';assert(n.laws.governorGeneral,'Governor General is not active.');assert(companyRegions(n).length,'There are no Company regions.');
  assert(!s.history.some(h=>h.turn===s.turn&&h.actionType==='govern'&&h.input?.outcome==='success'),'The Governor General has already governed successfully this turn.');
  assert(['success','failure','catastrophe'].includes(d.outcome)&&integer(d.sixes,0,100),'Report the check outcome and number of sixes.');
  const amount=d.sixes+(d.outcome==='success'?0:n.laws.zamindarTaxes?2:1);companyRegions(n).forEach(id=>addUnrest(id,amount));
  say(d.outcome==='success'?'Resolve your successful Govern income and one required choice per Company region on the table. Record each Tax placement using Governor General Tax.':'Resolve any office consequences on the table. The failed-check unrest includes all reported sixes.');
 }else if(d.type==='envoy'){
  title='Special Envoy';assert(!n.laws.governorGeneral,'The Governor General has replaced the Director of Trade.');assert(['success','failure','catastrophe'].includes(d.outcome),'Report the final check outcome.');
  if(d.region){assert(IDS.includes(d.region)&&n.regions[d.region].control==='indian','Choose a region outside Company control.');assert(d.purpose==='order'&&(d.outcome!=='success'||ORDER_OWNER[d.order]===d.region),'Open an order in the selected region.');}
  if(d.outcome==='success'){assert(['china','order'].includes(d.purpose),'Choose the Special Envoy action.');if(d.purpose==='china'){assert(!n.chinaOffice,'The China office already exists.');n.chinaOffice=true;say('Create the Superintendent of Trade in China office and hire it immediately.');}else{assert(ORDER_OWNER[d.order]&&n.regions[ORDER_OWNER[d.order]].control==='indian'&&!n.regions[ORDER_OWNER[d.order]].orders[d.order],'Choose a closed order outside Company control.');open(d.order);}}
  else say('The Special Envoy check did not succeed; no map change.');
 }else if(d.type==='deregulation'){
  assert(scenarioFor(s).deregulationVote&&!n.laws.deregulation,'Deregulation is not available in this scenario or is already active.');assert(!phase,'Record this special vote at the start of the turn, before London Season.');assert(['passed','failed'].includes(d.outcome),'Report Passed or Failed.');title='Special session · Deregulation';
  if(d.outcome==='passed'){n.laws.deregulation=true;say('Deregulation passed. Lower Company Debt one space for every two Debt, set Standing to S, and give the Prime Minister a passed-law token. Apply the Deregulation rules on the table; private firms may now operate.');}
  else say('Deregulation failed. Increase the value of Company shares using the Court overlay, to a maximum of ±3 VP. The Prime Minister does not change hands and Deregulation is not discarded.');
 }else if(d.type==='law'){
  assert(Object.hasOwn(LAW_NAMES,d.law)&&d.law!=='deregulation','Choose a supported law; Deregulation uses its special session.');assert(!n.laws[d.law],'This law is already active.');title=`Parliament · ${LAW_NAMES[d.law]}`;
  if(d.outcome==='passed'){n.laws[d.law]=true;if(d.law==='envoyChina'){n.chinaOffice=true;say('Create the China office if not already created; hire it immediately when created.');}if(d.law==='governorGeneral')say('Replace Director of Trade with Governor General; pension all Governors, remove their overlays and unfinished Company ships. Company territorial control continues.');say(`${LAW_NAMES[d.law]} is now active. Apply its other printed effects on the table.`);}else{assert(d.outcome==='failed','Report Passed or Failed.');say('The law failed; no tracked map change.');}
 }else if(d.type==='dilemma'){
  assert(['impeachment','franchise'].includes(d.dilemma),'Choose a supported dilemma.');assert(['passed','failed'].includes(d.outcome),'Report Passed or Failed.');
  title=`Parliament · ${d.dilemma==='impeachment'?'Public Demands Impeachment!':'Masses Demand Franchise!'} · ${d.outcome==='passed'?'Passed':'Failed'}`;
  if(d.dilemma==='impeachment'){
   const office=[...scandalOffices(n,'india'),...scandalOffices(n,'london')].find(o=>o.id===d.office);assert(office,'Choose the officeholder selected on the table.');
   say(`The Prime Minister selected the ${office.name}.`);say(d.outcome==='passed'?`Return that officeholder to supply and place its office card in Vacant Offices. Resolve fatigue on the table.`:'Lower Company Standing one space on the table. If this causes Company failure, finish the vote and choose End game.');
  }else say(d.outcome==='passed'?'Rotten Boroughs are now worth one vote each. Votes now cost £2 instead of £1; apply these changes on the table.':'The dilemma failed; no further card effects.');
 }else if(d.type==='famine'){
  title='Parliament · Relief Demanded for Indian Famine!';if(d.outcome==='failed'){PRESIDENCIES.forEach(turmoil);companyRegions(n).forEach(id=>addUnrest(id,1));}else{assert(d.outcome==='passed','Report Passed or Failed.');say('Enact this policy consequence a second time on the table. No direct map change.');}
 }else if(d.type==='france'){
  title='Parliament · War Against France!';if(d.outcome==='passed')say('Prime Minister: select 3 non-extra ships and 3 officers/regiments. Return ships to shipyards or supply, and officers/regiments to supply. No invasion occurs.');else{assert(d.outcome==='failed','Report Passed or Failed.');if(d.stormFace!==undefined)say(`War Against France storm die: ${STORM_FACES[d.stormFace].label}. This roll determines invasion targets only; it does not cause ship storm checks or additional India events.`);foreign();}
 }else if(d.type==='blackmail'){
  if(d.card==='envoy'){
   title='Blackmail · Envoy to the Mughals';assert(legalElephants(n).some(p=>p.from===d.from&&p.to===(d.to||null)),'Choose a legal Elephant position.');setElephant({from:d.from,to:d.to||null});
   const values=REGIONS[d.from].orders.filter(([o])=>n.regions[d.from].orders[o]).map(o=>o[3]);say(`Take £${Math.max(0,...values)}: the highest open order in ${name(d.from)}${values.length?'':'; no orders are open'}.`);
  }else{
   const offices=scandalOffices(n,d.card);assert(offices.some(o=>o.id===d.office),'Choose an eligible office.');const office=offices.find(o=>o.id===d.office);title=`Blackmail · ${d.card==='india'?'Scandal in India':'Scandal on Leadenhall Street'} · ${office.name}`;
   say(`Force the ${office.name} officeholder to vacate without retirement. Return the family member to supply and put the office card in Vacant Offices; return its fatigue. The office continues to exist.`);
   scenes.push({speaker:office.assistant,role:`Assistant to the ${office.name}`,text:d.card==='india'?'“The dispatch describes it as a voluntary departure. I have left space beneath that phrase for the corrections.”':'“I have changed the nameplate, retained the correspondence, and ordered a smaller portrait for the next incumbent.”'});
  }
 }else if(d.type==='parliament-finish'){
  assert(phase?.status==='complete','Finish Events in India before finishing Parliament.');assert(!parliamentFinished(s),'Parliament has already been finished this turn.');title='Parliament complete';n.parliamentFinishedTurn=n.turn;say('Parliament is finished. No additional India changes are required.');say(finalTurn(n)?'Complete prize upkeep on the table, skip refresh and proceed to Final Scoring.':'Complete Upkeep and Refresh on the table: pay prize upkeep; return writers to their Presidencies, filled-order tokens and Presidency dividers to supply; return Extra ships to supply; activate exhausted officers/regiments and exhaust active local alliances. Then choose Begin next turn.');
 }else if(d.type==='next-turn'){title='Begin next turn';assert(!finalTurn(n),'This is the final turn of this scenario.');n.turn++;n.indiaPhase=null;n.parliamentFinishedTurn=null;say(`Begin turn ${n.turn}. Refresh pieces and resolve the normal turn procedures on the table. New-turn action limits now apply.`);
 }else if(d.type==='rename'){title='Campaign renamed';assert(typeof d.name==='string'&&d.name.trim().length<=80,'Enter a campaign name up to 80 characters.');n.campaignName=d.name.trim()||'Early Company';say(`Campaign name: ${n.campaignName}.`);
 }else if(d.type==='event'){
  assert(Object.hasOwn(EVENTS,d.event),'Choose the drawn event.');assert(IDS.includes(d.topRegion),'Report the exposed top tile’s region.');title=`${d.manualTest?'Manual event test':'India event'} · ${EVENTS[d.event]}`;
  if(['leader','crisis'].includes(d.event))assert(integer(d.modifier,-10,10),'Report the strength modifier printed on the event tile.');
  switch(d.event){
   case 'turmoil':turmoil(d.topRegion);break;
   case 'windfall':say(`Each player takes £1 per writer they have on an order in ${[d.topRegion,...REGIONS[d.topRegion].neighbors].map(name).join(', ')}. Count writers on the physical board.`);break;
   case 'shuffle':if(d.stackTile){if(d.emptyStack)say('The empty stack is rebuilt by shuffling the discards above the Shuffle tile before the Elephant marches.');move();if(!d.emptyStack)say('The app shuffles this tile into the remaining draw pile, shuffles the discards separately and places them on top.');break;}move();say(d.emptyStack?'The draw stack was empty: first rebuild and shuffle the stack as printed, then use the new exposed region and symbols for this March.':'After the Elephant’s March, shuffle this tile into the remaining draw stack, then shuffle the discards and place them facedown on top.');break;
   case 'leader':{const id=d.topRegion,r=n.regions[id],redirect=n.elephant.from===id&&!n.elephant.to&&r.control==='company';if(r.control==='indian'&&!r.overlord)strengthen(id,1);else if(rebellion(id,d.modifier,'leader')&&redirect)move();break;}
   case 'peace':{const {from,to}=n.elephant;if(to){for(const [a,b] of TRADE_ROUTES)if((ORDER_OWNER[a]===from&&ORDER_OWNER[b]===to)||(ORDER_OWNER[b]===from&&ORDER_OWNER[a]===to)){open(a);open(b);}for(const id of [from,to])if(n.regions[id].control!=='company')strengthen(id,1);}else{REGIONS[from].orders.forEach(([o])=>open(o));clearUnrest(from);}move();break;}
   case 'crisis':crisis();break;
   case 'foreign':if(d.stormFace!==undefined)say(`Foreign Invasion storm die: ${STORM_FACES[d.stormFace].label}. This roll determines invasion targets only; it does not cause ship storm checks or change the phase event count.`);foreign();break;
  }
 }else throw Error('Unknown game action.');
 if(d.type==='event'&&d.stackTile)finishTile(n.eventStack);
 if(d.type==='event'&&d.manualTest)say('Manual test: the digital event stack and phase event count are unchanged. Use Undo to reverse this test’s board effects.');
 if(d.type==='event'&&phase&&!d.manualTest){n.indiaPhase.completed++;say(`India event ${n.indiaPhase.completed} of ${n.indiaPhase.total} resolved.${n.indiaPhase.completed===n.indiaPhase.total?' All required events are complete; finish the phase when ready.':' Return to the map before drawing the next tile.'}`);}
 if(!instructions.length)say('No tracked board changes are required.');
 if(d.revivedByOldIdeas){title='Old Ideas Made New → '+title;say('After this vote, shuffle all discards, cards drawn this turn and Old Ideas Made New into the physical law deck. Keep any newly passed law with the passed laws.');}
 const report=instructions.join('\n\n'),entry={kind:'action',actionType:d.type,title,report,input:clone(d),incident:{...journal.finish(),input:clone(d)},regionLosses:losses,officerRouts,scenes,elephantMoves,turn:s.turn,at:new Date().toISOString()};
 n.history.push(entry);return {state:validate(n),title,report,instructions,scenes,elephantMoves};
}
export function scandalOffices(s,card){
 const india=[...PRESIDENCIES.map(id=>({id:'president:'+id,name:`President of ${REGIONS[id].name}`,assistant:({bombay:'Thomas Mercer',madras:'Edward Bell',bengal:'Henry Finch'})[id]})),...(s.laws.governorGeneral?[{id:'governor-general',name:'Governor General',assistant:'Arthur Pembroke'}]:companyRegions(s).map(id=>({id:'governor:'+id,name:`Governor of ${REGIONS[id].name}`,assistant:({punjab:'Samuel Reed',delhi:'George Avery',bengal:'Philip Grant',bombay:'Daniel Brooks',maratha:'Oliver Shaw',hyderabad:'Richard Hale',mysore:'Peter Ashby',madras:'Joseph Trent'})[id]})))];
 const london=[{id:'chairman',name:'Chairman',assistant:'Nathaniel Pike'},{id:'shipping',name:'Manager of Shipping',assistant:'William Hales'},{id:'military',name:'Military Affairs',assistant:'George Wilton'},...(!s.laws.governorGeneral?[{id:'trade',name:'Director of Trade',assistant:'Arthur Pembroke'}]:[]),...(s.chinaOffice?[{id:'china',name:'Superintendent of Trade in China',assistant:'James Porter'}]:[]),...PRESIDENCIES.map(id=>({id:'commander:'+id,name:`Commander of ${REGIONS[id].name}`,assistant:({bombay:'Charles Ward',madras:'Robert Ellis',bengal:'Francis Cole'})[id]}))];
 return card==='india'?india:card==='london'?london:[];
}
