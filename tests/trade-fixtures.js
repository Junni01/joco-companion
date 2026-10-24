import assert from 'node:assert/strict';
import {clone,validate,resolveDeployment} from '../dist/model.js';
import {resolveAction,NeedsInput} from '../dist/actions.js';
import {commitNarrative} from '../dist/narrative.js';
import {drawRequest,pendingEvent} from '../dist/event-stack.js';
import {narrativeState,deployment,fixed} from './m2-fixtures.js';
import {manual} from './collection07-fixtures.js';

export function tradeCampaign({kind='military',profile='cautious',scenario='1710',seed=808,pressure=true}={}){
 let state=narrativeState(scenario,seed);const inputs=[],states=[clone(state)],checkpoints=[];
 const secretary=state.narrative.characters['secretary-bombay'];
 secretary.traits.caution=profile==='cautious'?85:30;secretary.traits.pride=profile==='cautious'?30:85;secretary.voice.formality=3;secretary.voice.humour=1;
 const ruler=state.narrative.characters['ruler-bombay'];ruler.traits.pride=85;ruler.traits.caution=profile==='cautious'?75:25;ruler.voice.restraint=profile==='cautious'?3:1;ruler.voice.humour=1;
 state.narrative.characters['army-bombay'].traits.pride=85;
 states[0]=clone(state);
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
  const r=input.type==='deploy'?resolveDeployment(state,input):resolveAction(state,input);
  state=validate(commitNarrative(state,r));inputs.push(clone(input));states.push(clone(state));return state;
 };
 const finish=advance=>{
  step({type:'phase-start',face:3});step({type:'phase-ships'});step(drawRequest(state.eventStack,fixed));
  const event=pendingEvent(state.eventStack);if(event.event==='foreign')Object.assign(event,{stormFace:4,storm:'none',rolls:{}});step(event);
  step({type:'phase-finish'});step({type:'parliament-finish'});if(advance)step({type:'next-turn'});
 };
 const restore=()=>{
  step(manual('turmoil','bombay'));
  if(kind==='diplomatic'){
   const order=Object.keys(state.regions.bombay.orders).find(o=>!state.regions.bombay.orders[o]);
   checkpoints.push({kind,index:states.length-1});step({type:'envoy',purpose:'order',region:'bombay',order,outcome:'success'});
  }else{
   checkpoints.push({kind,index:states.length-1});step({type:'deploy',...deployment()});
  }
 };
 const total=scenario==='1813'?4:5;
 for(let i=0;i<total;i++){
  if(kind!=='diplomatic'&&i===0&&state.regions.bombay.control!=='company')step({type:'deploy',...deployment()});
  if(kind!=='diplomatic'&&pressure){step({type:'tax',region:'bombay'});if(!state.laws.governorGeneral)step({type:'tax',region:'bombay'});step(state.laws.governorGeneral?{type:'govern',outcome:'failure',sixes:0}:{type:'unrest',region:'bombay',reason:'failure'});}
  if(kind==='cascade'&&i===0){for(let j=0;j<4;j++)step(manual('turmoil','hyderabad'));for(let j=0;j<3;j++)step(manual('turmoil','bombay'));}
  restore();restore();finish(i<total-1);
 }
 step({type:'end-game',reason:'completed'});
 return {state,states,inputs,checkpoints,kind,profile,scenario};
}
