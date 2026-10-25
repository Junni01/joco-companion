import {createAdviceAttempt} from '../dist/narrative-advice-session.js';
import {createCounselSession} from '../dist/narrative-counsel.js';
import {resolveDeployment,validate} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {commitNarrative} from '../dist/narrative.js';
export function displayed(attempt,state,plan,{ack=true,visible=true,preview=null}={}){
 preview??=createCounselSession(state).preview(plan);if(!preview)throw Error('Fixture needs eligible counsel');
 globalThis.innerHeight=900;globalThis.innerWidth=1440;
 const button={disabled:false,textContent:''},events={},dialog={open:true,addEventListener:(type,fn)=>events[type]=fn,getBoundingClientRect:()=>({top:0,bottom:900})};
 const nodes=preview.lines.map(line=>({dataset:{counselSpeaker:line.speakerId},querySelector:()=>({textContent:line.renderedText}),getBoundingClientRect:()=>({width:400,height:100,top:visible?20:1000,bottom:visible?120:1100,left:10,right:410})}));
 const panel={isConnected:true,closest:()=>dialog,querySelectorAll:()=>nodes,querySelector:()=>button};
 attempt.watch(preview,plan,panel);if(ack)button.onclick();
 return {preview,panel,button,close(){dialog.open=false;events.close?.();}};
}
export function advisedResult(state,plan,input,{ack=true,visible=true}={}){
 const attempt=createAdviceAttempt(state),view=displayed(attempt,state,plan,{ack,visible});attempt.report(plan,input.type==='tax'?'success':input.type==='unrest'?'failure':input.outcome);
 const result=(input.type==='deploy'?resolveDeployment:resolveAction)(state,input);attempt.attach(result,plan);return {attempt,view,result,state:validate(commitNarrative(state,result))};
}
