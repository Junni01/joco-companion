import assert from 'node:assert/strict';
import {clone,resolveDeployment,validate} from '../dist/model.js';
import {resolveAction,NeedsInput} from '../dist/actions.js';
import {commitNarrative} from '../dist/narrative.js';
import {drawRequest,pendingEvent} from '../dist/event-stack.js';
import {narrativeState,deployment,fixed} from './m2-fixtures.js';
import {manual} from './collection07-fixtures.js';
export function chapterCampaign(){
 let state=narrativeState('1710',808);const states=[clone(state)],inputs=[],boundaries=[];
 const step=input=>{
  for(let n=0;;n++){
   assert(n<40);try{(input.type==='deploy'?resolveDeployment:resolveAction)(state,input);break;}catch(e){assert(e instanceof NeedsInput,e.message);const q=e.request;
    if(q.type==='defense')input.defenses={...input.defenses,[q.key]:q.strength};
    else if(q.type==='officer-rout')input.officerRouts={...input.officerRouts,[q.region]:0};
    else if(q.type==='invasion-roll')input.rolls={...input.rolls,[q.region]:3};
    else if(q.type==='attack-order')input.attackOrder={...input.attackOrder,[q.key]:q.regions[0]};
    else assert.fail(q.type);
   }
  }
  const r=input.type==='deploy'?resolveDeployment(state,input):resolveAction(state,input);state=validate(commitNarrative(state,r));inputs.push(clone(input));states.push(clone(state));return state;
 };
 const finish=ending=>{
  step({type:'phase-start',face:3});step({type:'phase-ships'});step(drawRequest(state.eventStack,fixed));
  const event=pendingEvent(state.eventStack);if(event.event==='foreign')Object.assign(event,{stormFace:4,storm:'none',rolls:{}});step(event);
  step({type:'phase-finish'});step({type:'parliament-finish'});boundaries.push(states.length-1);step(ending?{type:'end-game',reason:'completed'}:{type:'next-turn'});
 };
 step({type:'deploy',...deployment()});step({type:'tax',region:'bombay'});step({type:'unrest',region:'bombay',reason:'failure'});finish(false);
 step({type:'tax',region:'bombay'});step({type:'unrest',region:'bombay',reason:'failure'});finish(false);
 step(manual('leader','bombay'));finish(false); // Supply the actual requested defence strength, not a sentinel total.
 finish(false);finish(true);
 return {state,states,inputs,boundaries};
}
