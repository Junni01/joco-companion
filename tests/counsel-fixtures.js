// Synthetic public board/personality setups, not invented campaign outcomes.
import {initialState,correctRegion,validate,resolveDeployment} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {createNarrative,commitNarrative} from '../dist/narrative.js';
import {EVENT_TILES,createEventStack,drawRequest,pendingEvent} from '../dist/event-stack.js';
import {adviserAptitude} from '../dist/narrative-advisers.js';
export const zero=a=>{a[0]=0;return a;};
export function counselState(army='bombay',seed=717,scenario='1710'){
 let s=correctRegion(initialState(scenario),army,{control:'company',presidency:army,strength:0,lootAvailable:false});
 s.eventStack=createEventStack(zero);s.narrative=createNarrative(s,seed);return validate(s);
}
export const deployment=(patch={})=>({type:'deploy',army:'bombay',target:'delhi',regiments:6,officers:1,alliances:[],outcome:'success',losses:0,...patch});
export function step(state,input){return validate(commitNarrative(state,(input.type==='deploy'?resolveDeployment:resolveAction)(state,input)));}
export function profile(state,id,kind){
 const c=state.narrative.characters[id];
 c.traits={ambition:25,pride:25,caution:25,ruthlessness:45,loyalty:35,vindictiveness:25};c.confidence=50;c.mood='watchful';c.voice={formality:1,directness:1,restraint:1,humour:0};
 const patch={careful:{caution:95,ruthlessness:20},proud:{pride:95},ambitious:{ambition:95,pride:70},administrative:{loyalty:85,caution:60},cynical:{ruthlessness:95,vindictiveness:70},uneasy:{ruthlessness:10,caution:85,loyalty:80},confident:{ambition:70,pride:85},fiscal:{loyalty:85,caution:70}}[kind];
 Object.assign(c.traits,patch);if(kind==='administrative')c.voice.formality=3;if(kind==='confident')c.confidence=90;return c;
}
export function dangerState(seed=717){
 let s=counselState('madras',seed);s.elephant={from:'bombay',to:'hyderabad'};
 const discarded=['delhi-crisis','bombay-crisis','punjab-crisis'],first=['madras-shuffle','hyderabad-windfall'];
 s.eventStack={version:1,draw:[...first,...EVENT_TILES.map(t=>t.id).filter(id=>!first.includes(id)&&!discarded.includes(id))],discard:discarded,pending:null};
 s.narrative=createNarrative(s,seed);
 for(const input of [{type:'phase-start',face:3},{type:'phase-ships'}])s=step(s,input);
 s=step(s,drawRequest(s.eventStack,zero));s=step(s,pendingEvent(s.eventStack));
 for(const input of [{type:'phase-finish'},{type:'parliament-finish'},{type:'next-turn'}])s=step(s,input);
 return s;
}
export function dissentState(){
 const s=dangerState(),c=profile(s,'army-madras','careful');
 profile(s,'secretary-madras','ambitious');
 for(let directness=1;directness<=3;directness++)for(let humour=0;humour<=2;humour++){
  c.voice.directness=directness;c.voice.humour=humour;if(adviserAptitude(s,c)>=60)return validate(s);
 }
 throw Error('Synthetic fixture needs a competent adviser voice.');
}
