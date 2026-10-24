const stormArt=['east','west','south','all','none','none'];
// Folded from the storm net on page 4 of the supplied component manifest.
const sides=[['front',1,3],['back',6,5],['right',3,2],['left',4,0],['top',2,4],['bottom',5,1]];
const angles={front:[0,0],back:[0,180],right:[0,-90],left:[0,90],top:[-90,0],bottom:[90,0]};
const pips={1:[[50,50]],2:[[25,25],[75,75]],3:[[25,25],[50,50],[75,75]],4:[[25,25],[75,25],[25,75],[75,75]],5:[[25,25],[75,25],[50,50],[25,75],[75,75]],6:[[25,25],[75,25],[25,50],[75,50],[25,75],[75,75]]};
export function dieMarkup(kind,value){
 if(!['storm','regular'].includes(kind)||!Number.isInteger(value)||(kind==='storm'?(value<0||value>5):(value<1||value>6)))throw Error('Invalid die face.');
 const side=sides.find(s=>s[kind==='storm'?2:1]===value),[x,y]=angles[side[0]];
 return `<div class="dice-stage" aria-hidden="true"><div class="dice-shadow"></div><div class="animated-die ${kind}" style="--land-x:${720+x}deg;--land-y:${720+y}deg">${sides.map(([position,normal,storm])=>`<div class="die-side ${position}">${kind==='storm'?`<img src="assets/dice/storm-${stormArt[storm]}.png" alt="" width="280" height="280">`:`<svg viewBox="0 0 100 100" aria-hidden="true">${pips[normal].map(([cx,cy])=>`<circle cx="${cx}" cy="${cy}" r="9" fill="white"/>`).join('')}</svg>`}</div>`).join('')}</div></div>`;
}
export function showDiceRoll({showDialog,kind,value,summary,onContinue}){
 const $=id=>document.getElementById(id);
 showDialog(kind==='storm'?'Rolling the storm die':'Rolling invasion strength',`<div id="dice-roll" class="dice-roll is-rolling">${dieMarkup(kind,value)}<p id="dice-status" class="dice-status" role="status" aria-live="polite">Rolling…</p></div>`, '<button id="dice-continue" class="primary">Skip animation</button>');
 const root=$('dice-roll'),button=$('dice-continue');let finished=false,continued=false,timer;
 const current=()=>$('dice-roll')===root&&$('dialog')?.open!==false;
 function finish(){
  if(finished||!current())return;finished=true;clearTimeout(timer);
  root.classList.remove('is-rolling');$('dice-status').textContent=summary;button.textContent='Continue';
 }
 button.onclick=()=>{
  if(!current()||continued)return;
  if(!finished){finish();return;}
  continued=true;clearTimeout(timer);onContinue();
 };
 if(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)finish();
 else timer=setTimeout(finish,1150);
}
