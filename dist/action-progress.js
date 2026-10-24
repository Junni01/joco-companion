import {TILES} from './event-stack.js';
import {workspaceKeys} from './workspace-mode.js';
import {STORM_RESULTS} from './india-phase.js';
// Reuse the old key to migrate existing sessions, but keep only committed progress.
export const ACTION_PROGRESS=workspaceKeys().progress;
export function validateActionProgress(state,saved){
 if(saved===undefined||saved===null)return null;
 const fail=message=>{throw Error('Invalid saved resolution: '+message);};
 if(!saved||typeof saved!=='object'||saved.fingerprint!==JSON.stringify(state))fail('campaign does not match.');
 const d=saved.input;
 if(!d||!['event','france','phase-start','stack-draw'].includes(d.type)||!['form','resolve'].includes(saved.stage))fail('no committed event or die result.');
 if(d.stackTile&&state.eventStack?.pending?.tileId!==d.stackTile)fail('revealed tile does not match.');
 const stormAction=(d.type==='france'&&d.outcome==='failed')||(d.type==='event'&&(d.stackTile?TILES[d.stackTile]?.event:d.event)==='foreign');
 if(d.stormFace!==undefined&&(!stormAction||!Number.isInteger(d.stormFace)||d.stormFace<0||d.stormFace>5||d.storm!==STORM_RESULTS[d.stormFace]))fail('invalid France storm die or Foreign Invasion storm die.');
 if(d.rolls&&(typeof d.rolls!=='object'||Array.isArray(d.rolls)||Object.entries(d.rolls).some(([id,n])=>!Object.hasOwn(state.regions,id)||!Number.isInteger(n)||n<1||n>6)))fail('invalid invasion dice.');
 if(d.officerRouts&&(typeof d.officerRouts!=='object'||Array.isArray(d.officerRouts)||Object.entries(d.officerRouts).some(([id,n])=>!Object.hasOwn(state.regions,id)||!Number.isInteger(n)||n<0||n>1000)))fail('invalid officer rout counts.');
 if(!hasCommittedProgress(state,d))fail('no committed event or die result.');
 if(saved.ui?.instructionCursor!==undefined&&(!Number.isInteger(saved.ui.instructionCursor)||saved.ui.instructionCursor<0||saved.ui.instructionCursor>10000))fail('invalid instruction position.');
 return saved;
}
export function hasCommittedProgress(state,input){
 if(!input||typeof input!=='object')return false;
 if(input.type==='event'&&input.stackTile&&state.eventStack?.pending?.tileId===input.stackTile)return true;
 if(((input.type==='france'&&input.outcome==='failed')||(input.type==='event'&&(input.stackTile?TILES[input.stackTile]?.event:input.event)==='foreign'))&&Number.isInteger(input.stormFace)&&input.stormFace>=0&&input.stormFace<6)return true;
 if(input.rolls&&Object.values(input.rolls).some(n=>Number.isInteger(n)&&n>=1&&n<=6))return true;
 if(['event','france'].includes(input.type)&&input.officerRouts&&Object.values(input.officerRouts).some(n=>Number.isInteger(n)&&n>=0&&n<=1000))return true;
 // Undo must retain a result that was already rolled or a stack draw already made.
 return input.type==='stack-draw'||(input.type==='phase-start'&&Number.isInteger(input.face)&&input.face>=0&&input.face<6);
}
export function loadActionProgress(state,storage=localStorage){
 try{
  const saved=JSON.parse(storage.getItem(ACTION_PROGRESS));
  if(saved?.fingerprint===JSON.stringify(state)&&hasCommittedProgress(state,saved.input))return validateActionProgress(state,saved);
  if(saved)storage.removeItem(ACTION_PROGRESS);
 }catch{}
 return null;
}
export function restoreActionProgress(state,saved,storage=localStorage){
 if(saved)storage.setItem(ACTION_PROGRESS,JSON.stringify(validateActionProgress(state,{...saved,fingerprint:JSON.stringify(state)})));
 else storage.removeItem(ACTION_PROGRESS);
}
export function saveActionProgress(state,input,stage,storage=localStorage,ui={}){
 if(hasCommittedProgress(state,input))storage.setItem(ACTION_PROGRESS,JSON.stringify({fingerprint:JSON.stringify(state),input,stage,ui}));
 else storage.removeItem(ACTION_PROGRESS);
}
