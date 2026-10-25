import {eligiblePlanningCounsel} from './narrative-counsel.js';
import {publicKnowledge} from './narrative-outlooks.js';
import {advicePlan,planKey} from './narrative-advice-policy.js';
const copy=v=>JSON.parse(JSON.stringify(v)),captures=new WeakMap();
export const capturedAdvice=result=>captures.get(result)||null;
const person=c=>Object.fromEntries(['id','name','region','role','condition','traits','confidence','voice','memoryIds'].map(k=>[k,copy(c[k])]));

// This object and its visibility observations are session-local. Nothing is saved
// until its opaque capture is attached to the real result and commitNarrative runs.
export function createAdviceAttempt(state){
 const enabled=!!state.narrative?.enabled&&state.narrative.intensity!=='quiet';
 const context=enabled?{publicKnowledge:publicKnowledge(state),board:copy(state.regions),people:{}}:null;
 let view=null,observer=null,sequence=0,report=null,rows=[],closed=false,attached=false,dialog=null;
 const stop=()=>{observer?.disconnect();observer=null;};
 function quoteNodes(){return view?.panel?.querySelectorAll?.('[data-counsel-speaker]')||[];}
 function isRendered(index){
  const node=quoteNodes()[index],line=view?.preview.lines[index];
  return !!node&&view.panel.isConnected!==false&&(!dialog||dialog.open)&&node.dataset?.counselSpeaker===line.speakerId&&node.querySelector?.('p')?.textContent===line.renderedText;
 }
 function record(index){
  if(!enabled||closed||!view||!isRendered(index))return;
  const {preview,plan}=view,line=preview.lines[index],key=planKey(plan)+'|'+preview.templateId+'|'+line.speakerId+'|'+index;
  const old=rows.find(r=>r.key===key);
  if(old)return;
  const candidate=eligiblePlanningCounsel(state,plan).find(c=>c.templateId===preview.templateId);
  if(!candidate||JSON.stringify(candidate.lines)!==JSON.stringify(preview.lines))return;
  for(const l of candidate.lines)context.people[l.speakerId]=person(state.narrative.characters[l.speakerId]);
  rows.push({key,plan:advicePlan(plan),templateId:preview.templateId,lineIndex:index,unitKey:planKey(plan)+'|'+preview.templateId,speakerId:line.speakerId,institutionId:index&&preview.lines.length>1?'presidency:'+plan.army:preview.institutionId,role:line.role,text:line.renderedText,publicEvidence:copy(candidate.publicEvidence),utterancePhase:report?'post-check':'pre-check',shownInAttempt:{method:report?'viewport-visible':'rendered-before-report',sequence:++sequence}});
 }
 function poll(){
  const root=dialog?.getBoundingClientRect?.(),height=globalThis.innerHeight,width=globalThis.innerWidth;
  if(!Number.isFinite(height)||!Number.isFinite(width))return;
  [...quoteNodes()].forEach((node,i)=>{const r=node.getBoundingClientRect?.();if(r&&r.width>0&&r.height>0&&r.top>=Math.max(0,root?.top||0)&&r.bottom<=Math.min(height,root?.bottom||height)&&r.left>=0&&r.right<=width)record(i);});
 }
 return {
  get reported(){return !!report;},
  // Rendering in the actual pre-result stage establishes fictional delivery,
  // never human attention or the timing of a physical table roll. No extra UI step.
  watch(preview,plan,panel){
   if(view?.panel===panel&&view?.preview===preview)return;
   poll();stop();view=preview&&panel?{preview:copy(preview),plan:advicePlan(plan),panel}:null;
   if(!view||!enabled||closed)return;
   const nextDialog=panel.closest?.('dialog');
   if(nextDialog&&nextDialog!==dialog){dialog=nextDialog;dialog.addEventListener('close',()=>{stop();if(!attached){closed=true;rows=[];}},{once:true});}
   if(typeof globalThis.IntersectionObserver==='function'){
    observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting&&entry.intersectionRatio>=.999){const i=[...quoteNodes()].indexOf(entry.target);if(i>=0)record(i);}},{root:dialog,threshold:1});
    for(const node of quoteNodes())observer.observe(node);
   }
   poll();
  },
  report(plan,outcome){
   if(!['success','failure','catastrophe'].includes(outcome)||closed)return;
   poll();if(!report){const canonical=advicePlan(plan);rows=rows.filter(r=>planKey(r.plan)===planKey(canonical));report={sequence:++sequence,plan:canonical,outcome};}else report.outcome=outcome;
  },
  attach(result,plan){
   poll();stop();attached=true;
   if(!enabled||closed||!report)return result;
   const final=advicePlan(plan),same=p=>planKey(p)===planKey(final);
   const selected=rows.filter(r=>final.kind==='envoy'?(r.utterancePhase==='post-check'?same(r.plan):planKey(r.plan)===planKey(report.plan)):same(r.plan));
   if(selected.length){const people=Object.fromEntries([...new Set(selected.map(r=>r.speakerId))].map(id=>[id,context.people[id]]));captures.set(result,{version:1,context:{publicKnowledge:copy(context.publicKnowledge),board:copy(context.board),people:copy(people)},report:copy(report),finalPlan:final,rows:copy(selected)});}
   return result;
  }
 };
}
