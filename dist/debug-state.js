// Debug setup edits are separate from gameplay. Actual actions use actions.js/model.js unchanged.
import {assertHistoryDeletionAllowed} from './narrative-evidence.js';
import {IDS,PRESIDENCIES,LAW_NAMES,clone,initialState,validate,correctRegion,record} from './model.js';
import {SCENARIOS} from './scenarios.js';
import {createEventStack,validateEventStack,TILES} from './event-stack.js';
import {legalElephants} from './actions.js';

const check=(ok,message)=>{if(!ok)throw Error(message);};
export function validateDebugState(s){
 validate(s);
 for(const id of PRESIDENCIES)check(s.regions[id].control!=='company'||s.regions[id].presidency===id,`${id} home region can only belong to its own Presidency.`);
 check(IDS.filter(id=>IDS.some(child=>s.regions[child].overlord===id)).length<=3,'Only three empire flag colours are available.');
 check(IDS.reduce((sum,id)=>sum+s.regions[id].strength,0)<=20,'Only 20 tower levels are available.');
 check(IDS.reduce((sum,id)=>sum+s.regions[id].unrest,0)<=30,'Only 30 unrest/fatigue cubes are available.');
 for(const id of IDS)check(s.regions[id].control!=='company'||!s.regions[id].lootAvailable,'Company regions cannot retain an unclaimed loot token.');
 check(legalElephants(s).some(p=>p.from===s.elephant.from&&p.to===s.elephant.to),'Choose a legal Elephant position for this map.');
 return s;
}
export function debugState(scenario='1710'){
 const s=initialState(scenario);s.debugMode=true;s.campaignName='Debug · '+SCENARIOS[scenario].name;s.eventStack=createEventStack();return validateDebugState(s);
}
function normalize(s){
 for(const id of IDS)s.regions[id].empireCapital=IDS.some(child=>s.regions[child].overlord===id);
 const positions=legalElephants(s);
 if(!positions.some(p=>p.from===s.elephant.from&&p.to===s.elephant.to))s.elephant=positions.find(p=>p.from===s.elephant.from)||positions[0];
 return validateDebugState(s);
}
export function debugEditRegion(s,id,patch){
 check(IDS.includes(id),'Choose a region.');
 if(patch.overlord){check(patch.overlord!==id,'A region cannot be its own overlord.');const parent=s.regions[patch.overlord];check(parent?.control==='indian'&&!parent.overlord,'An empire capital must be an independent Indian region.');}
 if(patch.control==='company'){
  check(PRESIDENCIES.includes(patch.presidency),'Choose a Presidency.');
  check(!PRESIDENCIES.includes(id)||patch.presidency===id,'A home region can only belong to its own Presidency.');
  patch={...patch,lootAvailable:false,strength:0,overlord:null};
 }
 const n=correctRegion(s,id,patch);return normalize(n);
}
export function debugEditElephant(s,from,to){const n=clone(s);n.elephant={from,to:to||null};return validateDebugState(n);}
export function debugPhase(s,boundary){
 check(['operations','events','parliament','refresh'].includes(boundary),'Choose a test phase.');
 const n=clone(s);n.gameEnd=null;n.parliamentFinishedTurn=null;if(n.narrative)n.narrative.lastAgedTurn=n.turn;
 n.indiaPhase=boundary==='operations'?null:{turn:n.turn,face:4,total:4,completed:boundary==='events'?0:4,status:boundary==='events'?'events':'complete'};
 if(boundary==='refresh')n.parliamentFinishedTurn=n.turn;
 return validateDebugState(n);
}
export function debugFlags(s,laws,chinaOffice){
 const n=clone(s);for(const id of Object.keys(laws))check(Object.hasOwn(LAW_NAMES,id),'Unknown law.');
 n.laws={...n.laws,...laws};n.chinaOffice=!!chinaOffice||!!n.laws.envoyChina;return validateDebugState(n);
}
export function debugDeck(s,draw,discard){
 const n=clone(s);check(!s.eventStack?.pending,'Finish or restore the pending event before editing the deck.');
 n.eventStack={version:1,draw:[...draw],discard:[...discard],pending:null};validateEventStack(n.eventStack);return validateDebugState(n);
}
export function debugMoveTile(s,id,destination,index){
 check(Object.hasOwn(TILES,id)&&['draw','discard'].includes(destination),'Choose a tile and pile.');
 const draw=s.eventStack.draw.filter(t=>t!==id),discard=s.eventStack.discard.filter(t=>t!==id),pile=destination==='draw'?draw:discard;
 check(Number.isInteger(index)&&index>=0&&index<=pile.length,'Choose a position inside the pile.');pile.splice(index,0,id);return debugDeck(s,draw,discard);
}
export function debugResult(s,next,title){if(next.narrative){const kept=new Set(next.history.map(h=>h.incident?.id));assertHistoryDeletionAllowed(s,s.history.filter(h=>h.incident&&!kept.has(h.incident.id)).map(h=>h.incident.id));}validateDebugState(next);return {state:record(next,next,'Debug setup · '+title)};}
export function debugStageEvent(s,tileId,topRegion){
 check(Object.hasOwn(TILES,tileId)&&IDS.includes(topRegion),'Choose an event tile and exposed region.');
 const tiles=[...s.eventStack.draw,...s.eventStack.discard].filter(id=>id!==tileId);
 const next=tiles.find(id=>TILES[id].region===topRegion);check(next,'No tile can expose that region.');
 const discard=s.eventStack.discard.filter(id=>id!==tileId&&id!==next);
 const draw=[tileId,next,...s.eventStack.draw.filter(id=>id!==tileId&&id!==next)];
 return debugDeck(debugPhase(s,'events'),draw,discard);
}
