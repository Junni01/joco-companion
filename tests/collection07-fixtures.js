import assert from 'node:assert/strict';
import {clone,resolveDeployment,validate} from '../dist/model.js';
import {resolveAction,NeedsInput} from '../dist/actions.js';
import {commitNarrative} from '../dist/narrative.js';
import {drawRequest,pendingEvent} from '../dist/event-stack.js';
import {narrativeState,deployment,fixed} from './m2-fixtures.js';
export const manual=(event,region='bombay',patch={})=>({type:'event',event,manualTest:true,topRegion:region,shape:'circle',redirectShape:'circle',modifier:0,...patch});
export function makeCampaign({scenario='1710',profile='proud',seed=707,evolving=false}={}){
 let state=narrativeState(scenario,seed);const target=scenario==='1813'?'hyderabad':'bombay';
 const ruler=state.narrative.characters['ruler-'+target];
 for(const trait of Object.keys(ruler.traits))ruler.traits[trait]=25;
 ruler.traits[profile==='cautious'?'caution':profile==='vindictive'?'vindictiveness':'pride']=85;
 ruler.voice={formality:2,restraint:profile==='cautious'?3:1,directness:2,humour:1};
 const secretary=state.narrative.characters['secretary-bombay'];secretary.voice.formality=3;secretary.traits.pride=35;secretary.traits.caution=70;
 const officer=state.narrative.characters['army-bombay'];officer.traits.caution=85;officer.voice.restraint=3;
 const states=[clone(state)],inputs=[],milestones=[];
 const step=(input,label=null)=>{
  // Secondary defence/rout requests are explicit supplied fixture outcomes too.
  for(let tries=0;;tries++){
   assert(tries<40,'fixture input must resolve');
   try{(input.type==='deploy'?resolveDeployment:resolveAction)(state,input);break;}catch(error){
    assert(error instanceof NeedsInput,error.message);const q=error.request;
    if(q.type==='defense')input.defenses={...input.defenses,[q.key]:q.strength};
    else if(q.type==='officer-rout')input.officerRouts={...input.officerRouts,[q.region]:0};
    else if(q.type==='invasion-roll')input.rolls={...input.rolls,[q.region]:3};
    else if(q.type==='attack-order')input.attackOrder={...input.attackOrder,[q.key]:q.regions[0]};
    else assert.fail('Unexpected fixture request '+q.type);
   }
  }
  const result=input.type==='deploy'?resolveDeployment(state,input):resolveAction(state,input);
  state=validate(commitNarrative(state,result));inputs.push(clone(input));states.push(clone(state));
  if(label)milestones.push({label,incidentId:state.history.at(-1).incident.id,turn:state.turn});return state;
 };
 const deploy=(outcome='success')=>step({type:'deploy',...deployment(target,{outcome})});
 const tax=()=>step({type:'tax',region:target});
 const administer=()=>step(state.laws.governorGeneral?{type:'govern',outcome:'failure',sixes:0}:{type:'unrest',region:target,reason:'failure'});
 const rebellion=won=>step(manual('leader',target,{defenses:{leader:won?0:100},officerRouts:{[target]:0}}),won?'successful rebellion':'failed rebellion');
 const restore=()=>{step(manual('turmoil',target));deploy();};
 function finishTurn(advance){
  step({type:'phase-start',face:3});step({type:'phase-ships'});
  step(drawRequest(state.eventStack,fixed));const input=pendingEvent(state.eventStack);
  if(input.event==='foreign')Object.assign(input,{stormFace:4,storm:'none',rolls:{}});
  for(let tries=0;;tries++){
   assert(tries<40,'event input must resolve');
   try{resolveAction(state,input);break;}catch(error){assert(error instanceof NeedsInput,error.message);const q=error.request;
    if(q.type==='defense')input.defenses={...input.defenses,[q.key]:q.strength};
    else if(q.type==='officer-rout')input.officerRouts={...input.officerRouts,[q.region]:0};
    else if(q.type==='invasion-roll')input.rolls={...input.rolls,[q.region]:3};
    else if(q.type==='attack-order')input.attackOrder={...input.attackOrder,[q.key]:q.regions[0]};
    else assert.fail('Unexpected request '+q.type);
   }
  }
  step(input);step({type:'phase-finish'});step({type:'parliament-finish'});
  if(advance)step({type:'next-turn'},'thematic turn chapter');
 }
 const turns=scenario==='1813'?4:5;
 for(let i=0;i<turns;i++){
  if(i===0){deploy();tax();if(!state.laws.governorGeneral)tax();administer();rebellion(false);}
  else if(evolving){restore();restore();if(i===turns-1){administer();rebellion(false);tax();}}
  else if(i===1){tax();if(!state.laws.governorGeneral)tax();deploy();administer();}
  else if(i===2){tax();administer();rebellion(true);}
  else if(i===3){deploy('failure');deploy();tax();}
  else {tax();administer();rebellion(false);}
  finishTurn(i<turns-1);
 }
 // Supported final scoring closes the final thematic chapter, never a synthetic phase boundary.
 step({type:'end-game',reason:'completed'},'final chapter');
 return {state,states,inputs,milestones,target,profile,evolving};
}
