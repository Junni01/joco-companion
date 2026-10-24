import {phaseFor,STORM_FACES,rollStormFace,shipInstructions} from './india-phase.js';
import {resolveAction} from './actions.js';
import {showDiceRoll} from './dice-animation.js';
export function openIndiaPhase({state,showDialog,apply,esc,drawEvent,blackmail}){
 const $=id=>document.getElementById(id),phase=phaseFor(state);
 const show=(title,body,actions)=>showDialog(title,body,actions);
 const fail=e=>{$('form-error').textContent=e.message||e;};
 if(!phase){
  show('Start Events in India',`<p>Choose whether to roll the storm die in the app or on the table. Its result determines the affected seas and how many events to resolve.</p><p><b>Last chance for Envoy to the Mughals:</b> that card must be played before this phase begins. Resolve it on the table and in Blackmail cards first.</p><p>After storms, draw and resolve each digital tile separately. You can inspect the map between events.</p>`, '<button id="before-phase-blackmail">Blackmail cards</button><button id="manual-phase-storm">Roll physical die</button><button id="start-india-phase" class="primary">Start phase & roll in app</button>');
  $('before-phase-blackmail').onclick=blackmail;
  let started=false;
  const begin=(face,animated)=>{if(started)return;try{started=true;const result=resolveAction(state,{type:'phase-start',face});apply(result);const next=()=>openIndiaPhase({state:result.state,showDialog,apply,esc,drawEvent,blackmail});if(animated)showDiceRoll({showDialog,kind:'storm',value:face,summary:`${STORM_FACES[face].label} · ${STORM_FACES[face].events} India event${STORM_FACES[face].events===1?'':'s'}`,onContinue:next});else next();}catch(e){started=false;fail(e);}};
  $('start-india-phase').onclick=()=>{if(!started)begin(rollStormFace(),true);};
  $('manual-phase-storm').onclick=()=>{
   let selected=null;
   show('Events in India · physical storm die',`<p>Roll the physical storm die, then select the face you rolled. The phase begins only when you confirm.</p><div class="choice-buttons" role="group" aria-label="Physical storm die result">${[0,1,2,3,4].map(face=>`<button class="choice-button" data-phase-face="${face}" aria-pressed="false">${esc(STORM_FACES[face].label)} · ${STORM_FACES[face].events} event${STORM_FACES[face].events===1?'':'s'}</button>`).join('')}</div><p class="small-note">Both no-storm faces have the same effect: four events and no ship rolls.</p>`,'<button id="confirm-phase-storm" class="primary" disabled>Confirm result & start phase</button>');
   document.querySelectorAll('[data-phase-face]').forEach(button=>button.onclick=()=>{selected=Number(button.dataset.phaseFace);document.querySelectorAll('[data-phase-face]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('confirm-phase-storm').disabled=false;});
   $('confirm-phase-storm').onclick=()=>{if(selected!==null)begin(selected,false);};
  };
  return;
 }
 const face=STORM_FACES[phase.face],headline=`<div class="notice"><b>${esc(face.label)} · ${phase.total} event${phase.total===1?'':'s'}</b><p>${phase.completed} of ${phase.total} events resolved. The storm result is saved.</p></div>`;
 if(phase.status==='ships'){
  show('Events in India · resolve storms',`${headline}<ol class="action-instructions">${shipInstructions(phase.face).map(t=>`<li>${esc(t)}</li>`).join('')}</ol><p>Handle ship dice and pieces on the table. The app does not need ship counts or individual results.</p>`, '<button id="ships-resolved" class="primary">All ship rolls resolved</button>');
  $('ships-resolved').onclick=()=>{try{$('ships-resolved').disabled=true;apply(resolveAction(state,{type:'phase-ships'}));$('dialog').close();}catch(e){$('ships-resolved').disabled=false;fail(e);}};
 }else if(phase.status==='complete'){
  show('Events in India complete',`${headline}<p>All events are resolved. If the Company has failed, use End game to close the chronicle and proceed to Final Scoring. Otherwise continue to Parliament Meets on the physical board.</p>`, '<button id="phase-map">Return to map</button>');$('phase-map').onclick=()=>$('dialog').close();
 }else if(phase.completed===phase.total){
  show('Finish Events in India',`${headline}<p>The required events are resolved. Finish this phase. Then continue to Parliament, or choose End game if the Company has failed.</p>`, '<button id="finish-india-phase" class="primary">Finish phase</button>');
  $('finish-india-phase').onclick=()=>{try{$('finish-india-phase').disabled=true;apply(resolveAction(state,{type:'phase-finish'}));$('dialog').close();}catch(e){$('finish-india-phase').disabled=false;fail(e);}};
 }else{
  show('Events in India',`${headline}${!face.seas.length?'<p>No storms: no ship rolls were needed.</p>':''}<p>When everyone is ready, draw the next tile from the saved digital stack. The app updates the map after confirmation and waits for the next draw.</p><p>The two scandal cards may be played between events. Envoy to the Mughals is unavailable because this phase has begun.</p>`, '<button id="phase-map">Look at map</button><button id="phase-blackmail">Blackmail cards</button><button id="draw-phase-event" class="primary">Draw next event · '+(phase.completed+1)+' of '+phase.total+'</button>');
  $('phase-map').onclick=()=>$('dialog').close();$('phase-blackmail').onclick=blackmail;$('draw-phase-event').onclick=drawEvent;
 }
}
