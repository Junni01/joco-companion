import {finalTurn} from './scenarios.js';
// Exact six-faced storm die supplied with the game. Duplicate None faces are intentional.
export const STORM_FACES=[
 {label:'East Indian Ocean',seas:['East Indian Ocean'],events:2},
 {label:'West Indian Ocean',seas:['West Indian Ocean'],events:2},
 {label:'South Indian Ocean',seas:['South Indian Ocean'],events:3},
 {label:'All three seas',seas:['West Indian Ocean','South Indian Ocean','East Indian Ocean'],events:1},
 {label:'No storms',seas:[],events:4},
 {label:'No storms',seas:[],events:4}
];
export const STORM_RESULTS=['east','west','south','all','none','none'];
export const phaseFor=s=>s.indiaPhase?.turn===s.turn?s.indiaPhase:null;
export const parliamentFinished=s=>s.parliamentFinishedTurn===s.turn;
export const phaseActive=s=>!!phaseFor(s)&&phaseFor(s).status!=='complete';
export function parliamentBlockReason(s){
 if(s.gameEnd)return 'This game has ended.';
 if(phaseFor(s)?.status!=='complete')return 'Finish Events in India before proceeding to Parliament.';
 if(parliamentFinished(s))return 'Parliament is finished. Undo Finish Parliament before recording another parliamentary outcome.';
 return '';
}
export function nextTurnBlockReason(s){
 if(s.gameEnd)return 'This game has ended.';
 if(finalTurn(s))return 'This is the final turn of this scenario.';
 if(phaseFor(s)?.status!=='complete')return 'Finish Events in India before beginning the next turn.';
 if(!parliamentFinished(s))return 'Finish Parliament before beginning the next turn.';
 return '';
}
export function rollStormFace(random=crypto.getRandomValues.bind(crypto)){
 const bytes=new Uint32Array(1);do{random(bytes);}while(bytes[0]>=4294967292);return bytes[0]%6;
}
export function shipInstructions(face){
 const result=STORM_FACES[face];if(!result)throw Error('Invalid storm die face.');
 if(!result.seas.length)return ['No storms: no ship rolls are required.'];
 return [
  `In ${result.seas.join(', ')}, roll one physical die per ship except Company ships and Extra ships.`,
  ...(result.seas.includes('East Indian Ocean')?['Ships assigned to the Superintendent of Trade in China count as being in the East Indian Ocean for storms.']:[]),
  '1–2: no effect.',
  '3–4: fatigue the ship. If it was already fatigued, it sinks.',
  '5–6: the ship sinks.',
  'Return sunk ships to their shipyards, flipped to their non-fatigued side. Resolve all ship rolls before drawing the first India event.'
 ];
}
