import assert from 'node:assert/strict';
import {initialState,validate,clone,resolveDeployment} from '../dist/model.js';
import {resolveAction,NeedsInput} from '../dist/actions.js';
import {createNarrative,commitNarrative} from '../dist/narrative.js';
import {EVENT_TILES,drawRequest,pendingEvent} from '../dist/event-stack.js';
export const zero=a=>{a[0]=0;return a;};
export function outlookFixture(discard=['delhi-crisis','bombay-crisis','punjab-crisis'],empty=false){
 let state=initialState();const first=empty?['madras-shuffle']:['madras-shuffle','punjab-turmoil'];
 if(empty)discard=EVENT_TILES.map(t=>t.id).filter(id=>id!=='madras-shuffle');
 state.eventStack={version:1,draw:[...first,...EVENT_TILES.map(t=>t.id).filter(id=>!first.includes(id)&&!discard.includes(id))],discard,pending:null};
 state.elephant={from:'delhi',to:'bombay'};state.narrative=createNarrative(state,909);
 const initial=clone(state),states=[clone(state)],inputs=[];
 const step=input=>{
  for(let n=0;;n++){assert(n<40);try{(input.type==='deploy'?resolveDeployment:resolveAction)(state,input);break;}catch(e){assert(e instanceof NeedsInput,e.message);const q=e.request;
   if(q.type==='defense')input.defenses={...input.defenses,[q.key]:q.strength};else if(q.type==='officer-rout')input.officerRouts={...input.officerRouts,[q.region]:0};else if(q.type==='invasion-roll')input.rolls={...input.rolls,[q.region]:3};else if(q.type==='attack-order')input.attackOrder={...input.attackOrder,[q.key]:q.regions[0]};else assert.fail(q.type);
  }}
  const before=state;state=validate(commitNarrative(before,(input.type==='deploy'?resolveDeployment:resolveAction)(before,input)));states.push(clone(state));inputs.push(clone(input));return state;
 };
 return {initial,states,inputs,step,get state(){return state;},shuffle(){step({type:'phase-start',face:4});step(drawRequest(state.eventStack,zero));step(pendingEvent(state.eventStack));return state;},draw(){return step(drawRequest(state.eventStack,zero));},resolve(){return step(pendingEvent(state.eventStack));}};
}
