import {createAdviceAttempt} from './narrative-advice-session.js';
import {createCounselSession,planningCounselHTML} from './narrative-counsel.js';
import {scenarioFor,finalTurn} from './scenarios.js';
import {showElephantSteps,showStackRegion} from './resolution-pages.js';
import {TILES,pendingEvent,exposedRegion} from './event-stack.js';
import {showDiceRoll} from './dice-animation.js';
import {ACTION_PROGRESS,loadActionProgress,saveActionProgress,hasCommittedProgress} from './action-progress.js';
import {operationsBlockReason,governorTaxCount,taxBlockReason} from './administration.js';
import {END_REASONS,canEndGame,canCompleteGame} from './game-end.js';
import {phaseFor,phaseActive,parliamentFinished,parliamentBlockReason,nextTurnBlockReason,STORM_FACES,STORM_RESULTS,rollStormFace} from './india-phase.js';
import {IDS,REGIONS,INDIA_LAW_NAMES} from './model.js';
import {EVENTS,SHAPES,ORDER_OWNER,orderLabel,companyRegions,legalElephants,scandalOffices,resolveAction,NeedsInput} from './actions.js';
export const ACTION_DRAFT=ACTION_PROGRESS;
const symbols={circle:'● Circle',triangle:'▲ Triangle',square:'■ Square'};
export function openGameActions({state,showDialog,apply,esc,start,onPhase,onProgressSaved}){
 const $=id=>document.getElementById(id);
 let d={},stage='form',instructionCursor=0;
 const counselSession=createCounselSession(state),adviceAttempt=createAdviceAttempt(state);
 const error=e=>{$('form-error').textContent=e.message||e;};
 const pick=(id,label,items,value='')=>`<label>${esc(label)}<select id="${id}"><option value="">Choose…</option>${items.map(([v,l])=>`<option value="${esc(v)}" ${v===value?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
 const regions=ids=>ids.map(id=>[id,REGIONS[id].name]);
 const number=(id,label,value=0,min=0,max=100)=>`<label>${label}<input type="number" id="${id}" min="${min}" max="${max}" value="${value}"></label>`;
 const outcome=()=>pick('outcome','Final check outcome',[['success','Success'],['failure','Failure'],['catastrophe','Catastrophic failure']],d.outcome);
 const result=()=>pick('outcome','Parliament result',[['passed','Passed'],['failed','Failed']],d.outcome);
 function save(){saveActionProgress(state,d,stage,localStorage,{instructionCursor});onProgressSaved?.();}
 function show(title,body,actions){showDialog(title,(hasCommittedProgress(state,d)?'<p class="small-note">The revealed event or saved roll is already part of this game. Closing this window keeps its resolution available to resume.</p>':'')+body,actions);}
 function form(title,body,read,sync=()=>{}){
  stage='form';show(title,body,'<button id="review-action" class="primary">Review effects</button>');
  const capture=()=>{Object.assign(d,read());save();};
  $('dialog-content').onchange=()=>{capture();sync();};sync();
  if(d.type==='event'&&phaseFor(state))save();
  $('review-action').onclick=()=>{try{capture();advance();}catch(e){error(e);}};
 }
 function startForm(type,input={}){
  d={...input,type};
  const companies=companyRegions(state);
  if(type==='governor'){
   const fixed=d.regionContext,blocked=operationsBlockReason(state)||(state.laws.governorGeneral?'Governor General has replaced regional Governors. Use the Governor General controls.':!companies.length?'There are no Company regions.':fixed&&!companies.includes(fixed)?'This region is not under Company control.':'');
   show('Governor actions',`${fixed?`<p class="notice">${esc(REGIONS[fixed].name)}</p>`:''}<p>Before the physical check, you may open optional planning. After resolving it, report the actual effect or failure.</p>${fixed?`<button id="governor-plan" ${blocked?'disabled':''}>Plan Administer · optional</button>`:''}<div class="action-menu"><button id="governor-tax" ${blocked?'disabled':''}>Tax</button><button id="governor-administer" ${blocked?'disabled':''}>Unsuccessful Administer</button></div>${blocked?`<p class="small-note">${esc(blocked)}</p>`:'<p class="small-note">The first Tax in a region each turn adds no unrest. Later Taxes add one. Unsuccessful Administer adds the unrest required by the active laws. Other permitted successful effects are handled on the physical board.</p>'}`);
   if(fixed)$('governor-plan').onclick=()=>{
    if(blocked)return;
    const plan={kind:'governor',region:fixed},preview=counselSession.preview(plan);
    if(preview&&adviceAttempt.reported)preview.temporalRole='after-report';
    show('Plan Administer',`<p class="notice">${esc(REGIONS[fixed].name)}</p><p>Any recommendation is provisional. Make the physical Administer check under the current rules, then choose any permitted successful effect on the table. Nothing here declares or records Tax, a regiment or a ship.</p><div id="governor-plan-counsel">${planningCounselHTML(preview,esc)}</div><p class="small-note">If you have already rolled, this view is not evidence of an earlier warning. Shipbuilding and regiment commissioning remain untracked; use the normal controls only to report an actual Tax or unsuccessful Administer.</p>`,'<button id="governor-return">Return to result reporting</button>');
    adviceAttempt.watch(preview,plan,$('governor-plan-counsel'));
    $('governor-return').onclick=()=>startForm('governor',{regionContext:fixed});
   };
   $('governor-tax').onclick=()=>{adviceAttempt.report({kind:'governor',region:fixed},'success');startForm('tax',{regionContext:fixed});};
   $('governor-administer').onclick=()=>{adviceAttempt.report({kind:'governor',region:fixed},'failure');startForm('unrest',{regionContext:fixed,reason:'failure',governorAction:true});};
  }else if(type==='unrest'&&d.governorAction){
   const fixed=d.regionContext;
   form('Unsuccessful Administer',`${fixed?`<p class="notice">${esc(REGIONS[fixed].name)}</p>`:pick('region','Company region',regions(companies),d.region)}<p>Add <b>${state.laws.zamindarTaxes?2:1} unrest</b>${state.laws.zamindarTaxes?' under Zamindar Taxes':''}. Report either failure or catastrophic failure here; handle any dismissal on the table.</p>`,()=>({region:fixed||$('region').value,reason:'failure'}));
  }else if(type==='unrest'){
   const fixed=d.regionContext;
   form('Add unrest',`<p>Report the cause. The active laws determine the number of cubes.</p>${fixed?`<p class="notice">${esc(REGIONS[fixed].name)}</p>`:pick('region','Company region',regions(companies),d.region)}${pick('reason','Reason',state.laws.governorGeneral?[['tax','Governor General Tax']]:[['failure','Unsuccessful Administer'],['tax','Successful Tax · first Tax is tracked automatically']],d.reason)}<p class="small-note">${state.laws.governorGeneral?'Place Tax unrest in a different region for each Tax choice this turn.':'First Tax adds no unrest; later Taxes in this region this turn add one. Unsuccessful Administer includes both failure and catastrophic failure.'}</p>`,()=>({region:fixed||$('region').value,reason:$('reason').value,type:$('reason').value==='tax'?'tax':'unrest'}));
  }else if(type==='tax'){
   const fixed=d.regionContext,eligible=companies.filter(id=>!taxBlockReason(state,id));
   form(state.laws.governorGeneral?'Governor General Tax':'Report a successful Tax',`${fixed?`<p class="notice">${esc(REGIONS[fixed].name)}</p>`:pick('region','Company region',regions(eligible),d.region)}<div id="tax-effect"></div><p>Report each successful Tax once. Handle the £2 payment on the table.</p>`,()=>({region:fixed||$('region').value}),()=>{const id=fixed||$('region').value;$('tax-effect').innerHTML=!id?'<p>Choose the region for this Tax.</p>':state.laws.governorGeneral?'<p>Add <b>1 unrest</b>. Each Governor General Tax placement must use a different Company region this turn.</p>':`<p>${governorTaxCount(state,id)} Taxes already recorded here this turn. This Tax adds <b>${governorTaxCount(state,id)?1:0} unrest</b>.</p>`;});
  }else if(type==='govern'){
   form('Governor General check',`<p>Report every six rolled, including on a successful check. Unrest from sixes is additional to any failed-check penalty.</p>${outcome()}${number('sixes','Number of sixes rolled',d.sixes||0)}`,()=>({outcome:$('outcome').value,sixes:Number($('sixes').value)}));
  }else if(type==='envoy'){
   const blocked=operationsBlockReason(state)||(state.laws.governorGeneral?'The Governor General has replaced the Director of Trade. Special Envoy is unavailable.':'');
   if(blocked){show('Special Envoy unavailable',`<p>${esc(blocked)}</p>`);return;}
   const orders=Object.keys(ORDER_OWNER).filter(o=>state.regions[ORDER_OWNER[o]].control==='indian'&&!state.regions[ORDER_OWNER[o]].orders[o]);
   // No region lock: successful checks retain the printed right to choose another effect.
   delete d.regionContext;delete d.region;
   const planValid=()=>d.purpose==='china'?!state.chinaOffice:d.purpose==='order'&&orders.includes(d.order);
   form('Special Envoy',`<p>Choose an intended effect before reporting the physical check. This is provisional: after success you may change the effect or target before confirming.</p>${pick('purpose','Intended action',[...(orders.length?[['order','Open Order in India']]:[]),...(!state.chinaOffice?[['china','Establish Superintendent of Trade in China']]:[])],d.purpose)}<div id="order-field">${pick('order','Closed order outside Company control',orders.map(o=>[o,orderLabel(o)]),d.order)}</div>${!orders.length?'<p class="small-note">No closed Orders outside Company control are available.</p>':''}${state.chinaOffice?'<p class="small-note">The Superintendent office already exists; it cannot be created again.</p>':''}<p>Make the physical Special Envoy check: each £1 spent grants one die, with no penalty. It may be attempted repeatedly. Resolve spending and dice on the table.</p><div id="envoy-counsel"></div>${pick('outcome','Final check outcome',[['success','Success'],['failure','Failure'],['catastrophe','Catastrophic failure']],d.outcome)}<p class="small-note">Establishing the Superintendent creates and immediately hires the office. It does not resolve the later Trade in China check, move cargo or add opium. After Special Envoy, the Director may make up to two writer/ship transfers between Presidencies/sea zones on the table.</p>`,()=>({outcome:$('outcome').value,purpose:$('purpose').value,order:$('purpose').value==='order'?$('order').value:undefined}),()=>{
    $('order-field').hidden=$('purpose').value!=='order';
    $('outcome').disabled=!planValid();
    $('review-action').disabled=!planValid()||!d.outcome;
    const plan={kind:'envoy',purpose:$('purpose').value,order:$('order').value};
    adviceAttempt.report(plan,$('outcome').value);
    const preview=counselSession.preview(plan,$('outcome').value),panel=$('envoy-counsel'),html=planningCounselHTML(preview,esc);
    if(panel.innerHTML!==html)panel.innerHTML=html;
    adviceAttempt.watch(preview,plan,panel);
   });
   $('review-action').onclick=()=>{try{Object.assign(d,{purpose:$('purpose').value,order:$('purpose').value==='order'?$('order').value:undefined,outcome:$('outcome').value});if(!planValid())throw Error('Choose an available intended effect and, for India, a specific closed Order outside Company control.');save();advance();}catch(e){error(e);}};
  }else if(type==='event'&&d.stackTile){
   const tile=TILES[d.stackTile],facts=pendingEvent(state.eventStack);
   form('Drawn event · '+EVENTS[tile.event],`<p class="eyebrow">EVENT ${phaseFor(state).completed+1} OF ${phaseFor(state).total}</p><div class="notice"><b>${esc(EVENTS[tile.event])}${tile.modifier!==undefined?' · '+(tile.modifier>=0?'+':'')+tile.modifier:''}</b><p>Tile back: ${esc(REGIONS[tile.region].name)}<br>Exposed region for resolution: <b>${esc(REGIONS[facts.topRegion].name)}</b>${tile.shape?'<br>Elephant symbol on drawn front: '+esc(symbols[tile.shape]):''}</p></div><p>The drawn tile and stack position are saved. Resolve this event before drawing another.</p>${tile.event==='foreign'?'<p>Confirming rolls this Foreign Invasion’s storm die automatically in the app. This is separate from the phase’s initial storm roll.</p>':''}`,()=>({}));
  }else if(type==='event'){
   form(d.manualTest?'Manual event resolution · test':'Resolve an India event',`${phaseFor(state)&&!d.manualTest?`<p class="eyebrow">EVENT ${phaseFor(state).completed+1} OF ${phaseFor(state).total}</p>`:''}${d.manualTest?'<p class="notice">This test applies map effects but does not draw a digital tile or consume a phase event. Use Undo afterward to restore the board state.</p>':''}<p>Use the event just drawn and the newly exposed tile back on the physical stack. The app calculates all map effects.</p>${pick('event','Drawn event',Object.entries(EVENTS),d.event)}${pick('topRegion','Region on exposed top tile',regions(IDS),d.topRegion)}<div id="modifier-field">${number('modifier','Strength modifier printed on drawn tile',d.modifier||0,-10,10)}</div><div id="march-fields">${pick('shape','Border symbol on the drawn event front',SHAPES.map(s=>[s,symbols[s]]),d.shape)}${pick('redirectShape','Symbol on the drawn event’s Elephant redirect arrow (if needed)',SHAPES.map(s=>[s,symbols[s]]),d.redirectShape)}<p class="small-note">The redirect symbol is only needed if every neighbour belongs to the moving capital’s empire.</p></div><div id="storm-field"><p>The app automatically rolls a new storm die to determine invasion targets when you review this event.</p></div><div id="shuffle-field"><label class="check-label"><input id="emptyStack" type="checkbox" ${d.emptyStack?'checked':''}> The draw stack was empty</label><p class="small-note">If empty, rebuild the stack first and report its new exposed back above. Otherwise March occurs before shuffling.</p></div>`,()=>({event:$('event').value,topRegion:$('topRegion').value,modifier:Number($('modifier').value),shape:$('shape').value,redirectShape:$('redirectShape').value,emptyStack:$('emptyStack').checked}),()=>{const e=$('event').value;$('modifier-field').hidden=!['leader','crisis'].includes(e);$('march-fields').hidden=!['peace','shuffle','leader','crisis','foreign'].includes(e);$('storm-field').hidden=e!=='foreign';$('shuffle-field').hidden=e!=='shuffle';});
  }else if(type==='deregulation'){
   form('Special session · Deregulation',`<p>Resolve this vote at the start of the turn, before London Season. It is optional when Standing or Debt is on a lined space and compulsory when either is on a starred space. Players check these tracks and handle the vote on the table.</p>${result()}<p>The app records the result and updates the phase reminders if Deregulation passes.</p>`,()=>({outcome:$('outcome').value}));
  }else if(type==='law'){
   form('Record a passed law',`${pick('law','Passed law',Object.entries(INDIA_LAW_NAMES).filter(([id])=>!state.laws[id]),d.law)}<p class="notice">Record this only after the law has passed. Unpassed laws stay available for a later proposal.</p><p class="small-note">The app applies the law’s India effects. Resolve voting and other payments on the table.</p>`,()=>({law:$('law').value,outcome:'passed'}));
  }else if(type==='dilemma'){
   const impeachment=d.dilemma==='impeachment',offices=[...scandalOffices(state,'india'),...scandalOffices(state,'london')];
   form(impeachment?'Public Demands Impeachment!':'Masses Demand Franchise!',`${impeachment?pick('office','Officeholder selected on the table',offices.map(o=>[o.id,o.name]),d.office):''}${result()}<p>${impeachment?'The Prime Minister selects an occupied office before the vote. If passed, return that officeholder to supply and put the office card in Vacant Offices. If failed, lower Company Standing one space; this may cause Company failure.':'If passed, Rotten Boroughs are worth one vote each and votes cost £2. If failed, nothing happens.'}</p><p class="small-note">The outcome is recorded in the chronicle for future narration. Handle offices, votes and Standing on the table.</p>`,()=>({outcome:$('outcome').value,...(impeachment?{office:$('office').value}:{})}));
  }else if(type==='famine'){
   form('Relief Demanded for Indian Famine!',`${result()}<p>Failure causes Turmoil in all three home regions and adds one unrest to every Company region.</p>`,()=>({outcome:$('outcome').value}));
  }else if(type==='france'){
   form('War Against France!',`${result()}<p>On failure, confirming rolls a new storm die in the app. Invasion targets and any Elephant redirection use the saved map and event stack.</p>`,()=>({outcome:$('outcome').value}));
   $('review-action').onclick=()=>{try{d.outcome=$('outcome').value;if(!['passed','failed'].includes(d.outcome))throw Error('Choose Passed or Failed.');if(d.outcome==='failed')beginFrance(d);else advance();}catch(e){error(e);}};
  }else if(type==='blackmail'){
   const card=d.card;
   if(card==='envoy'){
    envoyCard(d);
   }else{
    const label=card==='india'?'Scandal in India':'Scandal on Leadenhall Street';
    form(label,`<p>Play when taken from the display, or after Revenue. Select the occupied office being dismissed; the player handles cancellation before applying.</p>${pick('office','Affected office',scandalOffices(state,card).map(o=>[o.id,o.name]),d.office)}<p class="small-note">The player’s officeholder leaves without retirement. The fictional assistant remains attached to the office.</p>`,()=>({card,office:$('office').value}));
   }
  }else if(type==='end-game'){
   if(!canEndGame(state))throw Error('Finish Events in India before ending the game.');
   form('End game · close the chronicle',`<p>Report the outcome from the physical board. The app does not track Company Standing or player scores.</p>${pick('end-reason','Why is the game ending?',Object.entries(END_REASONS).filter(([id])=>id==='failure'||canCompleteGame(state)),d.reason)}<label>Closing note (optional)<textarea id="end-note" maxlength="2000" rows="4" placeholder="A final dispatch for the campaign chronicle…">${esc(d.note||'')}</textarea></label><p>The final map and campaign record will remain available. Further gameplay stops after confirmation; Undo can reopen the game.</p>`,()=>({reason:$('end-reason').value,note:$('end-note').value}));
  }else if(type==='parliament-finish'){
   form('Finish Parliament',`<p>Record any relevant laws or dilemmas first. You can finish without recording a law when the vote has no effect on the India state tracked here.</p><p>${finalTurn(state)?'Next: complete prize upkeep and proceed to Final Scoring. Skip refresh on the final turn.':'Next: complete Upkeep and Refresh on the table, then begin the next turn.'}</p>`,()=>({}));
  }else if(type==='next-turn'){
   if(nextTurnBlockReason(state)){show('Next turn unavailable',`<p>${esc(nextTurnBlockReason(state))}</p>`);return;}
   form('Begin next turn',`<p>Advance from turn ${state.turn} to ${state.turn+1}. This resets turn-based Tax and Governor General limits and allows Armies to act again after last turn’s catastrophe.</p><p>Complete prize upkeep and the printed refresh steps on the table before confirming.</p>`,()=>({}));
  }
 }
 function envoyCard(input){
  const positions=legalElephants(state),mode=input.positionMode||(input.from?(input.to?'border':'inside'):''),inside=positions.filter(p=>!p.to),borders=positions.filter(p=>p.to);
  const available=mode==='inside'?inside:mode==='border'?borders:[],starts=IDS.filter(id=>available.some(p=>p.from===id));
  const from=starts.includes(input.from)?input.from:'',destinations=IDS.filter(id=>available.some(p=>p.from===from&&p.to===id));
  const to=mode==='inside'?null:destinations.includes(input.to)?input.to:'';
  d={type:'blackmail',card:'envoy',positionMode:mode,from,to};stage='form';save();
  const valid=positions.some(p=>p.from===from&&p.to===to);
  show('Envoy to the Mughals',`<p>Play before Events in India. Resolve any cancellation on the table first.</p><div class="choice-buttons" role="group" aria-label="Elephant placement"><button id="envoy-inside" class="choice-button" aria-pressed="${mode==='inside'}" ${inside.length?'':'disabled'}>Inside a region</button><button id="envoy-border" class="choice-button" aria-pressed="${mode==='border'}" ${borders.length?'':'disabled'}>On a border</button></div>${!inside.length?'<p class="small-note">Inside placement requires a Company-controlled region.</p>':''}${mode?pick('envoy-from',mode==='inside'?'Region':'Starting region',regions(starts),from):''}${mode==='border'&&from?pick('envoy-to','Destination region · Elephant faces here',regions(destinations),to):''}${mode==='border'?'<p class="small-note">Only legal starting regions and destinations are shown.</p>':''}`,'<button id="review-action" class="primary" '+(valid?'':'disabled')+'>Review effects</button>');
  $('envoy-inside').onclick=()=>{if(inside.length)envoyCard({positionMode:'inside'});};
  $('envoy-border').onclick=()=>{if(borders.length)envoyCard({positionMode:'border'});};
  $('dialog-content').onchange=()=>{const nextFrom=$('envoy-from')?.value||'';envoyCard({positionMode:mode,from:nextFrom,to:mode==='inside'?null:nextFrom===from?$('envoy-to')?.value||'':''});};
  $('review-action').onclick=()=>{try{if(!valid)throw Error('Choose a legal Elephant position.');advance();}catch(e){error(e);}};
 }
 function progress(request){const remaining=request.instructions.slice(instructionCursor);return remaining.length?`<details><summary>Physical consequences before this attack</summary><ol>${remaining.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></details>`:'';}
 function beginFrance(input){
  d={...input,type:'france',outcome:'failed',topRegion:exposedRegion(state.eventStack)||input.topRegion,shape:'circle',redirectShape:'circle'};
  if(d.storm!==undefined||d.stormFace!==undefined){advance();return;}
  d.stormFace=rollStormFace();d.storm=STORM_RESULTS[d.stormFace];stage='resolve';save();
  showDiceRoll({showDialog:show,kind:'storm',value:d.stormFace,summary:`War Against France · ${STORM_FACES[d.stormFace].label}${d.storm==='none'?' · no invasion':' · resolve the indicated invasions'}`,onContinue:advance});
 }
 function advance(){
  const foreignEvent=d.type==='event'&&(d.stackTile?TILES[d.stackTile]?.event:d.event)==='foreign';
  if(foreignEvent&&d.storm===undefined&&d.stormFace===undefined){
   if(!d.stackTile&&!IDS.includes(d.topRegion))throw Error('Choose the exposed top tile’s region before rolling.');
   d.stormFace=rollStormFace();d.storm=STORM_RESULTS[d.stormFace];stage='resolve';save();
   showDiceRoll({showDialog:show,kind:'storm',value:d.stormFace,summary:`Foreign Invasion · ${STORM_FACES[d.stormFace].label}${d.storm==='none'?' · invade the exposed region':' · resolve the indicated invasions'}`,onContinue:advance});return;
  }
  stage='resolve';save();let r;
  try{r=resolveAction(state,d);}catch(e){
   if(!(e instanceof NeedsInput))throw e;
   const q=e.request;present(q,()=>requestInput(q));return;
  }
  present(r,()=>review(r));
 }
 function present(result,onDone){
  showElephantSteps({instructions:result.instructions,elephantMoves:result.elephantMoves||[],after:instructionCursor,showDialog:show,esc,onProgress:cursor=>{instructionCursor=cursor;save();},onDone});
 }
 function requestInput(q){
   if(q.type==='march'){
    show('Elephant’s March',`${progress(q)}<p>Report the remaining information from the exposed tile. ${q.region?'The Elephant moves to '+REGIONS[q.region].name+'.':''}</p>${q.needsRegion?pick('march-region','Exposed tile region',regions(IDS)):''}${q.needsShape?pick('march-shape','Border symbol on the drawn event front',SHAPES.map(s=>[s,symbols[s]])):''}${q.needsRedirect?pick('march-redirect','Symbol on the Elephant redirect arrow',SHAPES.map(s=>[s,symbols[s]])):''}`,'<button id="continue-march" class="primary">Continue</button>');
    $('continue-march').onclick=()=>{try{if(q.needsRegion){if(!$('march-region').value)throw Error('Choose the exposed region.');d.topRegion=$('march-region').value;}if(q.needsShape){if(!$('march-shape').value)throw Error('Choose the border symbol.');d.shape=$('march-shape').value;}if(q.needsRedirect){if(!$('march-redirect').value)throw Error('Choose the redirect symbol.');d.redirectShape=$('march-redirect').value;}instructionCursor=Math.max(instructionCursor,q.instructions.length);save();advance();}catch(e){error(e);}};
   }else if(q.type==='invasion-roll'){
    show(`Foreign invasion · ${REGIONS[q.region].name}`,`${progress(q)}<p>Roll this target’s invasion strength once. The app saves the result immediately and reuses it when this action resumes.</p>`,'<button id="roll-invasion" class="primary">Roll invasion strength</button>');
    let rolling=false;
    $('roll-invasion').onclick=()=>{if(rolling)return;try{rolling=true;if(!d.rolls?.[q.region]){let a=new Uint32Array(1);do{crypto.getRandomValues(a);}while(a[0]>=4294967292);d.rolls={...d.rolls,[q.region]:a[0]%6+1};}instructionCursor=Math.max(instructionCursor,q.instructions.length);save();showDiceRoll({showDialog:show,kind:'regular',value:d.rolls[q.region],summary:`${REGIONS[q.region].name} · invasion die ${d.rolls[q.region]}`,onContinue:advance});}catch(e){rolling=false;error(e);}};
   }else if(q.type==='officer-rout'){
    show(`Officer rout · ${REGIONS[q.region].name}`,`${progress(q)}<p><b>${REGIONS[q.region].name} is lost.</b> Use the Army of ${REGIONS[q.presidency].name}.</p><p>If the Commander office is occupied, return half that family’s trophies (round up) and remove the Commander. Then roll one die per officer currently in this Army and remove each officer rolling 6.</p>${number('rout-removed','Officers removed',0,0,1000)}<p class="small-note">Report the physical result, including zero if no officers were removed or the Army had none. No officer names or player-family information are recorded. Resolve this before the next attack; pieces do not refresh.</p>`,'<button id="report-rout" class="primary">Record officer rout</button>');
    $('report-rout').onclick=()=>{try{const removed=Number($('rout-removed').value);if(!Number.isInteger(removed)||removed<0||removed>1000)throw Error('Report a whole number between 0 and 1000.');d.officerRouts={...d.officerRouts,[q.region]:removed};instructionCursor=Math.max(instructionCursor,q.instructions.length);save();advance();}catch(e){error(e);}};
   }else if(q.type==='attack-order'){
    show(`Additional rebellions · Army of ${REGIONS[q.presidency].name}`,`${progress(q)}${pick('next-rebellion','Choose the next region to defend',regions(q.regions))}`,'<button id="resolve-order" class="primary">Continue</button>');
    $('resolve-order').onclick=()=>{try{const id=$('next-rebellion').value;if(!id)throw Error('Choose a region.');d.attackOrder={...d.attackOrder,[q.key]:id};instructionCursor=Math.max(instructionCursor,q.instructions.length);save();advance();}catch(e){error(e);}};
   }else{
    show(`Defend ${REGIONS[q.region].name}`,`${progress(q)}<div class="notice"><b>${q.strength} attack strength</b><p>${q.base} base + ${q.unrest} unrest × ${q.multiplier}${d.rolls?.[q.region]?` · saved invasion die ${d.rolls[q.region]}`:''}</p></div><p>Use the Army of ${REGIONS[q.presidency].name}. Exhaust pieces equal to the attack strength, or as much strength as remains available. Forces do not refresh between attacks.</p>${number('defense','Total available strength exhausted',0,0,q.strength)}<p class="small-note">If an office is vacant, Military Affairs acts; if also vacant, the Chairman chooses. Resolve any officer rout and office removals in the physical consequences before the next attack.</p>`,'<button id="report-defense" class="primary">Report defence</button>');
    $('report-defense').onclick=()=>{try{d.defenses={...d.defenses,[q.key]:Number($('defense').value)};instructionCursor=Math.max(instructionCursor,q.instructions.length);save();advance();}catch(e){error(e);}};
   }
 }
 function review(r){
  const remaining=r.instructions.slice(instructionCursor);
  show('Review · '+r.title,`<p>Complete the physical instructions below, then confirm to save all map changes together. If you close without confirming, reverse any unconfirmed physical changes yourself.</p>${remaining.length?`<ol class="action-instructions">${remaining.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`:'<p>All listed board changes and Elephant movements have been reviewed. Confirm to record the result.</p>'}${r.scenes?.map(scene=>`<blockquote><b>${esc(scene.speaker)}</b> · ${esc(scene.role)}<p>${esc(scene.text)}</p></blockquote>`).join('')||''}`,`${d.type==='envoy'?'<button id="revise-envoy">Change intended effect / target</button>':''}<button id="confirm-action" class="primary">Confirm & apply</button>`);
  if(d.type==='envoy')$('revise-envoy').onclick=()=>startForm('envoy',d);
  let confirmed=false;
  $('confirm-action').onclick=()=>{if(confirmed)return;try{confirmed=true;$('confirm-action').disabled=true;apply(adviceAttempt.attach(r,d.type==='envoy'?{kind:'envoy',purpose:d.purpose,order:d.order}:['tax','unrest'].includes(d.type)?{kind:'governor',region:d.region||d.regionContext}:{kind:'unsupported'}));localStorage.removeItem(ACTION_DRAFT);if(d.type==='event'&&d.stackTile)showStackRegion({state:r.state,showDialog,esc});else if(d.type==='france'&&d.parliamentSelection){state=r.state;d={};parliamentChoices(null,r);}else $('dialog').close();}catch(e){confirmed=false;if($('confirm-action'))$('confirm-action').disabled=false;error(e);}};
 }
 function menu(){
  if(state.gameEnd){show('Game ended',`<p>This chronicle is closed: <b>${esc(END_REASONS[state.gameEnd.reason])}</b>, turn ${state.gameEnd.turn}.</p><p>Inspect the map and Campaign record, export a backup from Saved games, or use Undo to reopen the game.</p>`);return;}
  const buttons=phaseFor(state)?[['events-phase','Events in India'],['blackmail','Blackmail cards'],['manual-event','Manual event resolution · test'],...(!phaseActive(state)?[['parliament','Parliament'],...(parliamentFinished(state)?[['next-turn','Begin next turn']]:[])]:[])]:[['events-phase','Start Events in India'],['manual-event','Manual event resolution · test'],...(state.laws.governorGeneral?[['tax','Governor General Tax'],['govern','Governor General check']]:[]),['blackmail','Blackmail cards'],['parliament','Parliament'],['next-turn','Begin next turn']];
  if(!phaseFor(state)&&scenarioFor(state).deregulationVote&&!state.laws.deregulation)buttons.push(['deregulation','Special session · Deregulation']);
  buttons.push(['end-game','End game']);
  show('Game actions',`<p>Choose the action happening on the table. Each action previews its map effects and physical instructions. Closing an unconfirmed action forgets its entries. Parliament follows Events in India; the next turn follows Parliament and physical upkeep.</p><div class="action-menu">${(state.eventStack?.pending?[['events-phase','Resume revealed event']]:buttons).map(([id,label])=>`<button data-action="${id}" ${(['governor','unrest','tax','govern'].includes(id)&&!companyRegions(state).length)||(id==='envoy'&&state.laws.governorGeneral)||(id==='tax'&&companyRegions(state).every(region=>!!taxBlockReason(state,region)))||(id==='next-turn'&&!!nextTurnBlockReason(state))||(id==='parliament'&&!!parliamentBlockReason(state))||(id==='end-game'&&!canEndGame(state))?'disabled':''}>${label}</button>`).join('')}</div>${phaseActive(state)?'<p class="small-note">End game becomes available after all India events are resolved and the phase is finished, even if the Company fails during the phase.</p>':''}`);
  document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{if(b.dataset.action==='manual-event')startForm('event',{manualTest:true});else if(b.dataset.action==='events-phase')onPhase?.();else if(b.dataset.action==='blackmail')blackmail();else if(b.dataset.action==='parliament')parliament();else startForm(b.dataset.action);});
 }
 function blackmail(){
  show('Blackmail cards',`<p>Apply a card here only after players have resolved any cancellation at the table.</p><div class="action-menu"><button data-card="envoy" ${phaseFor(state)?'disabled':''}>Envoy to the Mughals${phaseFor(state)?' · before Events in India only':''}</button><button data-card="india">Scandal in India</button><button data-card="london">Scandal on Leadenhall Street</button></div>`);
  document.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>startForm('blackmail',{card:b.dataset.card}));
 }
 function parliament(){
  if(!parliamentFinished(state)&&parliamentBlockReason(state)){show('Parliament unavailable',`<p>${esc(parliamentBlockReason(state))}</p>`);return;}
  if(parliamentFinished(state)){
   show('Parliament complete',`<p>${finalTurn(state)?'Complete prize upkeep and proceed to Final Scoring; skip refresh.':'Complete Upkeep and Refresh on the table, then begin the next turn. The India map and event stack carry forward.'}</p>`,finalTurn(state)?'<button id="parliament-done">Return to map</button>':'<button id="after-parliament-next" class="primary">Begin next turn</button>');
   if($('parliament-done'))$('parliament-done').onclick=()=>$('dialog').close();if($('after-parliament-next'))$('after-parliament-next').onclick=()=>startForm('next-turn');return;
  }
  parliamentChoices();
 }
 function parliamentChoices(selected=null,notice=null){
  const laws=Object.entries(INDIA_LAW_NAMES).filter(([id])=>!state.laws[id]);
  const dilemmas=[['france','War Against France!'],['famine','Relief Demanded for Indian Famine!']];
  const label=selected?.type==='law'?INDIA_LAW_NAMES[selected.law]:dilemmas.find(([id])=>id===selected?.type)?.[1];
  const selection=selected?`<section class="parliament-outcome" aria-label="Selected card"><h4>${esc(label)}</h4>${selected.type==='law'?'<p>Record this law only if it passed. Unpassed laws need no entry.</p>':'<p>Select the final vote outcome, then confirm to resolve its effects.</p>'}<div class="parliament-outcome-buttons"><button id="parliament-passed" ${selected.type==='law'?'class="primary"':`aria-pressed="${selected.outcome==='passed'}"`}>Passed</button>${selected.type!=='law'?`<button id="parliament-failed" aria-pressed="${selected.outcome==='failed'}">Failed</button>`:''}</div>${selected.type!=='law'?`<button id="confirm-parliament-outcome" class="primary wide" ${selected.outcome?'':'disabled'}>Confirm${selected.outcome?' '+selected.outcome+' outcome':' outcome'}</button>`:''}</section>`:'';
  show('Parliament',`<p>Select an applicable card below and record its result. If none applies, choose End Parliament.</p>${notice?`<div class="notice" role="status"><b>${esc(notice.title)}</b><ul>${notice.instructions.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`:''}<div class="parliament-sections"><section class="paper-card" aria-label="Laws"><h4>Laws</h4><p>Passed only · active laws are excluded.</p><div class="action-menu">${laws.map(([id,name])=>`<button id="parliament-law-${id}" aria-pressed="${selected?.law===id}">${esc(name)}</button>`).join('')||'<p class="small-note">All applicable laws are already active.</p>'}</div></section><section class="paper-card" aria-label="Dilemmas"><h4>Dilemmas</h4><p>Passed or Failed</p><div class="action-menu">${dilemmas.map(([id,name])=>`<button id="${id}-action" aria-pressed="${selected?.type===id}">${esc(name)}</button>`).join('')}</div></section></div>${selection}`,'<button id="finish-parliament">End Parliament</button>');
  laws.forEach(([law])=>$('parliament-law-'+law).onclick=()=>parliamentChoices({type:'law',law}));
  dilemmas.forEach(([type])=>$(type+'-action').onclick=()=>parliamentChoices({type}));
  let recorded=false;
  const record=input=>{if(recorded)return;try{recorded=true;const r=resolveAction(state,input);apply(r);state=r.state;parliamentChoices(null,r);}catch(e){recorded=false;error(e);}};
  if(selected){
   if(selected.type==='law')$('parliament-passed').onclick=()=>record({...selected,outcome:'passed'});
   else{
    $('parliament-passed').onclick=()=>parliamentChoices({...selected,outcome:'passed'});
    $('parliament-failed').onclick=()=>parliamentChoices({...selected,outcome:'failed'});
    $('confirm-parliament-outcome').onclick=()=>{if(recorded||!selected.outcome)return;if(selected.type==='france'&&selected.outcome==='failed'){try{recorded=true;beginFrance({...selected,parliamentSelection:true});}catch(e){recorded=false;error(e);}}else record(selected);};
   }
  }
  $('finish-parliament').onclick=()=>{if(recorded)return;try{recorded=true;const r=resolveAction(state,{type:'parliament-finish'});apply(r);state=r.state;show('Parliament complete',`<ol class="action-instructions">${r.instructions.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`,'<button id="parliament-done" class="primary">Return to map</button>');$('parliament-done').onclick=()=>$('dialog').close();}catch(e){recorded=false;error(e);}};
 }

 const savedProgress=loadActionProgress(state);
 if(state.gameEnd)menu();
 else if(savedProgress){d=savedProgress.input;instructionCursor=Number.isInteger(savedProgress.ui?.instructionCursor)&&savedProgress.ui.instructionCursor>=0?savedProgress.ui.instructionCursor:0;try{savedProgress.stage==='form'?startForm(d.type,d):advance();}catch(e){error(e);}}
 else if(start){if(start==='blackmail-menu')blackmail();else if(start==='parliament-menu')parliament();else if(typeof start==='string')startForm(start);else startForm(start.type,start);}
 else menu();
}

