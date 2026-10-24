import {initialState,resolveDeployment,clone,validate} from '../dist/model.js';
import {createNarrative,commitNarrative} from '../dist/narrative.js';
import {resolveAction} from '../dist/actions.js';
import {createEventStack} from '../dist/event-stack.js';
export const fixed=a=>{a[0]=0;return a;};
export const deployment=(target='bombay',patch={})=>({army:'bombay',target,regiments:12,officers:2,alliances:[],outcome:'success',losses:0,...patch});
export function narrativeState(scenario='1710',seed=1234){const s=initialState(scenario);s.eventStack=createEventStack(fixed);s.narrative=createNarrative(s,seed);return s;}
export function commit(s,input){const r=input.type==='deploy'?resolveDeployment(s,input):resolveAction(s,input);return validate(commitNarrative(s,r));}
export function storySequence(scenario='1710',seed=1234){
 let state=narrativeState(scenario,seed);const target=scenario==='1813'?'hyderabad':'bombay',states=[clone(state)],inputs=[];
 const step=input=>{state=commit(state,input);states.push(clone(state));inputs.push(input);};
 step({type:'deploy',...deployment(target)});
 step({type:'tax',region:target});
 step(state.laws.governorGeneral?{type:'govern',outcome:'failure',sixes:0}:{type:'unrest',region:target,reason:'failure'});
 step({type:'deploy',...deployment(target)});
 step(state.laws.governorGeneral?{type:'govern',outcome:'failure',sixes:0}:{type:'tax',region:target});
 return {state,states,inputs,target};
}
