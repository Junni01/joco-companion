import assert from 'node:assert/strict';
import {clone,validate,resolveDeployment} from '../dist/model.js';
import {resolveAction,NeedsInput} from '../dist/actions.js';
import {commitNarrative} from '../dist/narrative.js';
import {drawRequest,pendingEvent} from '../dist/event-stack.js';
import {narrativeState,deployment,fixed,commit} from './m2-fixtures.js';
import {chapterCampaign} from './chapter-fixtures.js';
import {manual} from './collection07-fixtures.js';

export function commercialFallbackCampaign(){
 let state=narrativeState('1710',808);const states=[clone(state)],inputs=[];
 const step=input=>{
  for(let tries=0;;tries++){
   assert(tries<40);try{(input.type==='deploy'?resolveDeployment:resolveAction)(state,input);break;}catch(e){assert(e instanceof NeedsInput,e.message);const q=e.request;
    if(q.type==='defense')input.defenses={...input.defenses,[q.key]:q.strength};
    else if(q.type==='officer-rout')input.officerRouts={...input.officerRouts,[q.region]:0};
    else if(q.type==='invasion-roll')input.rolls={...input.rolls,[q.region]:3};
    else if(q.type==='attack-order')input.attackOrder={...input.attackOrder,[q.key]:q.regions[0]};
    else assert.fail(q.type);
   }
  }
  state=validate(commitNarrative(state,(input.type==='deploy'?resolveDeployment:resolveAction)(state,input)));inputs.push(clone(input));states.push(clone(state));
 };
 const envoy=order=>step({type:'envoy',purpose:'order',region:'bombay',order,outcome:'success'});
 let interrupted;
 for(let turn=1;turn<=5;turn++){
  if(turn===1){envoy('bo3s');step(manual('turmoil','bombay'));interrupted=Object.keys(state.regions.bombay.orders).find(o=>!state.regions.bombay.orders[o]);}
  if(turn===2)envoy(interrupted);
  if(turn===3){step(manual('turmoil','bombay'));envoy(Object.keys(state.regions.bombay.orders).find(o=>!state.regions.bombay.orders[o]));}
  if(turn===5){step({type:'deploy',...deployment()});step({type:'unrest',region:'bombay',reason:'failure'});step(manual('leader','bombay',{defenses:{leader:0},officerRouts:{bombay:0}}));}
  step({type:'phase-start',face:3});step({type:'phase-ships'});step(drawRequest(state.eventStack,fixed));
  const event=pendingEvent(state.eventStack);if(event.event==='foreign')Object.assign(event,{stormFace:4,storm:'none',rolls:{}});step(event);
  step({type:'phase-finish'});step({type:'parliament-finish'});step(turn===5?{type:'end-game',reason:'completed'}:{type:'next-turn'});
 }
 return {state,states,inputs};
}
export function finalLossCampaign(){
 const original=chapterCampaign(),cut=original.states.findIndex(s=>s.turn===5&&s.history.at(-1)?.actionType==='phase-start')-1;
 let state=clone(original.states[cut]);const states=original.states.slice(0,cut+1),inputs=original.inputs.slice(0,cut);
 for(const input of [{type:'unrest',region:'bombay',reason:'failure'},manual('leader','bombay',{defenses:{leader:0},officerRouts:{bombay:0}}),...original.inputs.slice(cut)]){
  state=commit(state,clone(input));states.push(clone(state));inputs.push(clone(input));
 }
 return {state,states,inputs};
}
