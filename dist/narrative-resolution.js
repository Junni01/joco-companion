import {exposedRegion} from './event-stack.js';
import {OUTLOOK_TEXT} from './narrative-outlook-content.js';
import {REGIONS} from './model.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const active=s=>!!s.narrative?.enabled&&s.narrative.intensity!=='quiet';
// Display titles use authoritative input/facts, never dialogue or hidden tile data.
export function actionResultTitle(result){
 const h=result.state.history.at(-1),i=h?.incident,d=i?.input;
 if(i?.type==='deploy'){
  if(i.facts.some(f=>f.type==='company-conquest'))return `Company Takes Control of ${REGIONS[d.target].name}`;
  return `${REGIONS[d.army].name} Army ${d.outcome==='success'?'Succeeds in':d.outcome==='catastrophe'?'Fails Catastrophically in':'Fails in'} ${REGIONS[d.target].name}`;
 }
 if(i?.type==='envoy')return d.outcome==='success'?(d.purpose==='china'?'Superintendent of Trade in China Established':'Special Envoy Opens an Indian Order'):`Special Envoy ${d.outcome==='catastrophe'?'Fails Catastrophically':'Fails'}`;
 return result.title;
}
export function actionSceneLines(result){
 if(!active(result.state))return [];
 const h=result.state.history.at(-1),lines=[...(h?.narrative?.lines||[])];
 for(const saved of h?.scenes||[])if(!lines.some(l=>l.text===saved.text))lines.push(saved);
 // Prefer the exact committed advice response to an older generic reaction by
 // that speaker. No speaker quota; complete authored exchanges remain intact.
 const responding=new Set(lines.filter(l=>l.adviceIds?.length).map(l=>l.speakerId));
 const selected=lines.filter(l=>!responding.has(l.speakerId)||l.adviceIds?.length);
 // An authored chronicler still speaks. Only the mechanical fallback is redundant
 // when character voices are available; the full original scene remains archived.
 return selected.some(l=>l.speakerId!=='chronicler')&&!['next-turn','end-game'].includes(h?.actionType)?selected.filter(l=>!l.templateId?.startsWith('chronicler-')):selected;
}
export function actionSceneHTML(lines){
 return `<section class="action-story" aria-label="Narrative scene">${lines.map(line=>`<article class="action-story-turn" ${line.speakerId?`data-character-id="${esc(line.speakerId)}"`:''}><div class="action-story-speaker"><b>${esc(line.speaker)}</b>${line.role?`<small>${esc(line.role)}</small>`:''}</div><p>${esc(line.text)}</p></article>`).join('')}</section>`;
}
// Call ONLY after apply succeeds. All text is already saved; navigation is pure UI.
export function showActionStory({result,showDialog,onDone,replayInstructions,doneLabel='Return to map'}){
 const lines=actionSceneLines(result);if(!lines.length){onDone();return;}
 const $=id=>document.getElementById(id),title=actionResultTitle(result);let finished=false;
 const done=()=>{if(finished)return;finished=true;onDone();};
 const instructions=()=>{
  const show=(cursor=0)=>{showDialog(title,`<ol class="action-instructions">${result.instructions.slice(cursor).map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`,'<button id="return-to-story" class="primary">Return to scene</button>');$('return-to-story').onclick=story;};
  if(replayInstructions)replayInstructions({instructions:result.instructions,elephantMoves:result.elephantMoves||[],showDialog,esc,onDone:show});else show();
 };
 function story(){showDialog(title,actionSceneHTML(lines),`<button id="story-instructions">View physical instructions</button><button id="story-done" class="primary">${esc(doneLabel)}</button>`);$('story-instructions').onclick=instructions;$('story-done').onclick=done;}
 story();
}
// Re-present saved PRIVATE assessments. Never generate/publicize thoughts or read hidden fronts.
export function anticipationLines(state,topRegion){
 if(!active(state))return [];
 return [...new Set([state.elephant.from,state.elephant.to,topRegion].filter(Boolean))].flatMap(region=>{
  const thought=state.narrative.outlooks?.[region],c=state.narrative.characters[thought?.characterId];
  return thought&&c?.condition==='alive'&&state.narrative.seats[region]===c.id?[{speakerId:c.id,speaker:c.name,role:`Private outlook · ${REGIONS[region].name}`,text:thought.text}]:[];
 });
}
export function showAnticipation({state,topRegion,position,showDialog,onBack,onDone}){
 if(!active(state)){onDone();return;}
 const lines=state.history.at(-1)?.narrative?.anticipation?.thoughts||anticipationLines(state,topRegion);if(!lines.length){onDone();return;}
 showDialog('Across India',`<p class="anticipation-context">Elephant: ${esc(position)}<br>Visible stack region: ${esc(topRegion?REGIONS[topRegion].name:'None')}</p>${actionSceneHTML(lines)}`,'<button id="anticipation-instructions">View exposed region</button><button id="anticipation-done" class="primary">Return to map</button>');
 document.getElementById('anticipation-instructions').onclick=onBack;document.getElementById('anticipation-done').onclick=onDone;
}

// A read-only presentation snapshot, not a public statement or a new memory.
export function saveAnticipation(state,entry){
 if(entry.incident?.type!=='event'||!entry.incident.input.stackTile)return;
 const topRegion=exposedRegion(state.eventStack),thoughts=anticipationLines(state,topRegion).map(line=>({...line,templateId:state.narrative.outlooks[state.narrative.characters[line.speakerId].region].templateId}));
 if(thoughts.length)entry.narrative.anticipation={version:1,visibility:'private',elephant:{...state.elephant},topRegion,thoughts};
}
export function validateAnticipation(state,entry){
 const a=entry.narrative?.anticipation;if(!a)return;
 const fail=()=>{throw Error('Invalid saved anticipation scene.');};
 if(a.version!==1||a.visibility!=='private'||entry.incident?.type!=='event'||!entry.incident.input.stackTile||JSON.stringify(a.elephant)!==JSON.stringify(entry.incident.elephant.after)||!REGIONS[a.topRegion]||!Array.isArray(a.thoughts)||!a.thoughts.length||a.thoughts.length>3)fail();
 const regions=[a.elephant.from,a.elephant.to,a.topRegion],seen=new Set();
 for(const line of a.thoughts){const c=state.narrative.characters[line.speakerId];if(!c||!regions.includes(c.region)||state.narrative.seats[c.region]!==c.id||seen.has(c.id)||line.speaker!==c.name||line.role!==`Private outlook · ${REGIONS[c.region].name}`||line.text!==OUTLOOK_TEXT[line.templateId])fail();seen.add(c.id);}
}
export function archivedAnticipationHTML(entry){
 const a=entry.narrative?.anticipation;return a?`<details class="saved-anticipation" open><summary>Private outlooks after this event</summary>${actionSceneHTML(a.thoughts)}</details>`:'';
}
