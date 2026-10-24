import {selectApprovedDialogue} from './narrative-approved.js';
import {TEMPLATES} from './narrative-content.js';
import {POLICY,MEMORY_PROFILES,narrativeRandom} from './narrative-policy.js';
import {adjustRelationship} from './narrative-memory.js';
const name=r=>r.charAt(0).toUpperCase()+r.slice(1);
const fill=(text,ctx)=>text.replaceAll('{region}',name(ctx.region)).replaceAll('{capital}',ctx.context.capital||'the capital');
const variants=[
 {id:'m2-tax-repeat-2',trigger:'tax',role:'ruler',requires:['tax','repeatedTax'],emotion:'resentment',tone:'restrained',text:'Another demand in {region}. The court will not confuse repetition with consent.'},
 {id:'m2-tax-repeat-3',trigger:'tax',role:'ruler',requires:['tax','repeatedTax'],emotion:'worried',tone:'formal',text:'The demands on {region} continue. Our misgivings have not become less serious.'},
 {id:'m2-tax-first-2',trigger:'tax',role:'ruler',requires:['tax','firstTax'],emotion:'watchful',tone:'restrained',text:'The Tax in {region} is recorded. We shall see what follows it.'},
 {id:'m2-tax-general-2',trigger:'tax',role:'ruler',requires:['tax','generalTax'],emotion:'worried',tone:'formal',text:'The Governor General’s demand in {region} has been noted. Central authority does not make the local response uniform.'},
 {id:'m2-admin-2',trigger:'administration',role:'ruler',requires:['administration'],emotion:'worried',tone:'restrained',text:'The recorded administration in {region} gives us further cause for concern.'},
 {id:'m2-admin-3',trigger:'administration',role:'ruler',requires:['administration'],emotion:'resentment',tone:'formal',text:'The court in {region} has another administrative setback to consider.'},
 {id:'m2-secretary-tax-2',trigger:'tax',role:'secretary',requires:['tax'],emotion:'watchful',tone:'dry',text:'The demand in {region} has its own entry. We shall not mistake the entry for a local endorsement.'},
 {id:'m2-secretary-admin-2',trigger:'administration',role:'secretary',requires:['administration'],emotion:'worried',tone:'formal',text:'The result in {region} is recorded. The instructions and the explanation remain separate matters.'}
];
function allowedCallback(c,key,major){if(!major&&c.pacing.relevant-c.pacing.lastCallbackAt<POLICY.globalCallbackCooldown)return false;const last=c.pacing.callbacks[key];return !last||c.pacing.relevant-last.at>=last.cooldown||major;}
function memoryCallback(before,state,c,ctx){
 const n=state.narrative;
 // Collection 07 replaces data-narration callbacks; silence remains valid during cooldowns.
 if(['tax','tax-repeat','administration'].includes(ctx.category))return null;
 const memories=Object.values(before.narrative.memories).filter(m=>m.ownerId===c.id&&m.region===ctx.region&&m.origin!=='statement').sort((a,b)=>
  (b.category==='company-conquest'?POLICY.conquestRecallBonus:0)+(b.historicalSignificance+b.emotionalImportance)/2-((a.category==='company-conquest'?POLICY.conquestRecallBonus:0)+(a.historicalSignificance+a.emotionalImportance)/2));
 for(const old of memories){
  if(!allowedCallback(c,old.id,ctx.major))continue;
  let text=null,family='memory-'+old.category+'-'+ctx.category;
  if(old.category==='company-conquest'&&['tax','tax-repeat'].includes(ctx.category))text=`The Company took control of ${name(ctx.region)} before this demand. ${c.voice.directness>=3?'That history will not be lost among the Tax entries.':c.voice.formality>=3?'Our court has retained that entry in its account.':'The court has not forgotten.'}`;
  else if(old.category==='company-conquest'&&ctx.category==='administration')text=`The Company took control of ${name(ctx.region)}. This administrative setback gives our court another reason to remember.`;
  else if(old.category==='company-conquest'&&ctx.category==='intervention')text=`Order has improved in ${name(ctx.region)}. My account of the Company's arrival remains unchanged.`;
  else if(old.category==='company-conquest'&&ctx.category==='company-loss')text=`Company control of ${name(ctx.region)} has ended. I still remember its beginning.`;
  else if(old.category==='subordination'&&ctx.category==='released')text=`The allegiance of ${name(ctx.region)} to ${name(old.capital)} has ended. I remember how it began.`;
  else if(old.category==='rebellion-failed'&&ctx.category==='rebellion-won')text=`The earlier rebellion in ${name(ctx.region)} failed. This time the region is independent.`;
  else if(['tax','tax-repeat'].includes(old.category)&&ctx.category==='tax-repeat')text=`The earlier Tax in ${name(ctx.region)} has not become a distant memory. This demand joins it.`;
  else if(old.category===ctx.category&&['administration','deployment-failed','deployment-catastrophe','rebellion-failed'].includes(ctx.category))text=`The earlier setback in ${name(ctx.region)} remains in my account. This one does not improve the reading.`;
  if(text&&!c.pacing.phrases.some(p=>p.family===family&&c.pacing.relevant-p.at<POLICY.templateCooldown))return {templateId:'m2-callback-'+old.category+'-'+ctx.category,text,emotion:ctx.category==='intervention'?'guarded':'reflective',family,callbackMemoryIds:[old.id],callbackStatementIds:[]};
 }return null;
}
function quoteCallback(before,state,c,ctx){
 if(!ctx.context.addedUnrest||!['tax','tax-repeat','administration'].includes(ctx.category))return null;
 const candidates=Object.values(before.narrative.statements).filter(s=>s.type==='assurance'&&s.region===ctx.region&&(s.speakerId===c.id||s.audienceIds.includes(c.id))).reverse();
 for(const s of candidates){if(!allowedCallback(c,s.id,ctx.major))continue;
  const speaker=state.narrative.characters[s.speakerId];
  return {templateId:'m2-quote-assurance',family:'quote-assurance',text:`“${s.text}” ${s.speakerId===c.id?'I was hopeful about the earlier improvement':`${speaker.name} was hopeful about the earlier improvement`}. The new unrest in ${name(ctx.region)} calls for a fresh assessment.`,emotion:'worried',callbackMemoryIds:[],callbackStatementIds:[s.id]};
 }return null;
}
function primary(c,ctx,role,n){
 if(ctx.perspective==='sovereign'){
  const lines={'subordination':`The allegiance of ${name(ctx.region)} has changed. Our court must now deal with the authority the result gives us.`,'rebellion-won':`The rebellion in ${name(ctx.region)} has succeeded. We cannot write its independence out of the record.`, 'rebellion-failed':`The rebellion in ${name(ctx.region)} has failed. I shall not mistake that outcome for an end to the dispute.`, 'released':`Our empire no longer holds ${name(ctx.region)}. Earlier authority does not describe our present position.`};
  if(lines[ctx.category])return {templateId:'m2-sovereign-'+ctx.category,family:'sovereign-'+ctx.category,text:lines[ctx.category],emotion:ctx.category==='rebellion-won'?'worried':'watchful'};
 }
 if(role==='secretary'&&ctx.category==='intervention'&&(ctx.context.clearedUnrest||ctx.context.reopenedOrders))return {templateId:ctx.context.clearedUnrest?'m2-assurance-unrest':'m2-assurance-orders',family:'assurance',text:ctx.context.clearedUnrest?`The unrest in ${name(ctx.region)} has been cleared. I hope the improvement lasts.`:`The closed orders in ${name(ctx.region)} have reopened. I hope the improvement lasts.`,emotion:'relieved',statementType:'assurance'};
 const retired=new Set(['secretary-tax-1','secretary-admin-1','army-loss-1','army-deploy-failure-1','ruler-deploy-failure-1','ruler-tax-first-1','ruler-tax-repeat-1','ruler-tax-general-1','ruler-defence-1',...variants.map(t=>t.id)]);
 const eligible=[...TEMPLATES,...variants].filter(t=>!retired.has(t.id)&&t.trigger===ctx.trigger&&t.role===role&&t.requires.every(r=>ctx.context[r])&&(!t.trait||c.traits[t.trait]>=POLICY.requiredTraitMinimum));
 const fresh=eligible.filter(t=>!c.pacing.templates.some(p=>p.id===t.id&&c.pacing.relevant-p.at<POLICY.templateCooldown));
 if(!fresh.length)return null;
 const ranked=fresh.map(t=>({t,weight:POLICY.templateBaseWeight+t.requires.length*POLICY.conditionWeight+(variants.includes(t)?0:POLICY.originalCatalogBonus)+(t.trait?Math.round(c.traits[t.trait]/POLICY.traitWeightDivisor):0)+(t.tone==='formal'?c.voice.formality:t.tone==='dry'?c.voice.humour:t.tone==='proud'?c.voice.directness:c.voice.restraint)})).sort((a,b)=>b.weight-a.weight);
 const best=ranked.filter(t=>t.weight===ranked[0].weight),t=best[narrativeRandom(n,best.length)].t;
 return {templateId:t.id,family:t.id,text:fill(t.text,ctx),emotion:t.emotion};
}
function statementMemory(n,state,entry,s,ownerId){
 const c=n.characters[ownerId],id=`memory:${s.id}:${ownerId}`;
 if(n.memories[id])return;
 n.memories[id]={id,ownerId,category:'statement',region:s.region,relatedCharacterIds:[s.speakerId],origin:'statement',evidence:s.evidence,statementIds:[s.id],createdTurn:entry.turn,createdIncident:entry.incident.id,sequence:state.incidentSequence,historicalSignificance:MEMORY_PROFILES.statement.significance,emotionalImportance:MEMORY_PROFILES.statement.importance,emotion:'expectation',interpretation:{version:1,kind:'opinion',text:'I remember this assurance as an expression of hope, not a guaranteed outcome.'},updates:[],capital:null};c.memoryIds.push(id);
 if(!c.incidents.includes(entry.incident.id))c.incidents.push(entry.incident.id);
}
export function renderPoliticalDialogue(before,state,entry,scene,contexts,add){
 const n=state.narrative,candidates=[],used=new Set(),assurances=new Map();
 // A single authored observation replaces the summary only for a single-region context.
 if(contexts.length===1){const chosen=selectApprovedDialogue(state,entry,null,contexts[0],'chronicler');if(chosen)Object.assign(scene.lines[0],chosen);}
 for(const ctx of contexts){
  const ruler=n.characters[ctx.rulerId||n.seats[ctx.region]];
  const connection=Math.max(0,...ruler.memoryIds.map(id=>n.memories[id]).filter(m=>m.region===ctx.region).map(m=>m.historicalSignificance));
  candidates.push({c:ruler,role:'ruler',ctx,priority:POLICY.rulerPriority+(ctx.major?POLICY.majorPriority:0)+connection});
  const adviser=n.characters[ctx.adviserId];
  if(adviser)candidates.push({c:adviser,role:adviser.role,ctx,priority:ctx.category==='intervention'?POLICY.exchangePriority:POLICY.adviserPriority});
 }
 const priority=x=>x.priority-(x.c.pacing.relevant-x.c.pacing.lastAppearance<=POLICY.speakerCooldown?POLICY.appearancePenalty:0);
 candidates.sort((a,b)=>priority(b)-priority(a));let callbackCount=0;
 for(const {c,role,ctx} of candidates){
  if(c.condition!=='alive'||used.has(c.id)||!ctx.evidence.length)continue;
  const quotation=ctx.perspective!=='sovereign'&&(callbackCount===0||ctx.major)?quoteCallback(before,state,c,ctx):null;
  const authored=quotation?null:selectApprovedDialogue(state,entry,c,ctx,role);
  let chosen=quotation||authored||(ctx.perspective!=='sovereign'&&(callbackCount===0||ctx.major)?(quoteCallback(before,state,c,ctx)||(role==='ruler'?memoryCallback(before,state,c,ctx):null)):null)||primary(c,ctx,role,n);
  if(!chosen)continue;
  const callbacks=[...(chosen.callbackMemoryIds||[]),...(chosen.callbackStatementIds||[])];
  const overrides=callbacks.filter(key=>c.pacing.callbacks[key]&&c.pacing.relevant-c.pacing.callbacks[key].at<c.pacing.callbacks[key].cooldown);
  const line=add(chosen.templateId,chosen.text,c.id,chosen.emotion);
  Object.assign(line,{evidence:chosen.evidence||ctx.evidence,callbackMemoryIds:chosen.callbackMemoryIds||[],callbackStatementIds:chosen.callbackStatementIds||[],phraseFamily:chosen.family,selectionEvidence:chosen.selectionEvidence||[],cooldownOverride:overrides.length?'new-major-political-outcome':null});
  for(const key of callbacks)c.pacing.callbacks[key]={at:c.pacing.relevant,cooldown:POLICY.memoryCooldown,incidentId:entry.incident.id};
  if(callbacks.length){c.pacing.lastCallbackAt=c.pacing.relevant;callbackCount++;}
  c.pacing.templates.push({id:chosen.templateId,at:c.pacing.relevant});c.pacing.templates=c.pacing.templates.slice(-POLICY.recentBuffer);
  c.pacing.phrases.push({family:chosen.family,at:c.pacing.relevant});c.pacing.phrases=c.pacing.phrases.slice(-POLICY.recentBuffer);c.pacing.lastAppearance=c.pacing.relevant;c.mood=chosen.emotion;
  if(chosen.statementType){
   const audience=n.characters[n.seats[ctx.region]],s={id:`statement:${line.id}`,speakerId:c.id,audienceIds:audience.condition==='alive'?[audience.id]:[],incidentId:entry.incident.id,lineId:line.id,region:ctx.region,type:chosen.statementType,text:line.text,evidence:ctx.evidence};
   n.statements[s.id]=s;line.statementId=s.id;statementMemory(n,state,entry,s,c.id);s.audienceIds.forEach(id=>statementMemory(n,state,entry,s,id));assurances.set(ctx.region,s);
  }
  const assurance=assurances.get(ctx.region);
  if(role==='ruler'&&ctx.category==='intervention'&&assurance){
   line.replyToLineId=assurance.lineId;line.replyToStatementId=assurance.id;
   adjustRelationship(n,c.id,{kind:'character',id:assurance.speakerId},entry,null,POLICY.personalReply,'A response to the adviser’s saved assurance, not credit for ordering the intervention.',[assurance.id]);
   adjustRelationship(n,assurance.speakerId,{kind:'character',id:c.id},entry,null,POLICY.personalResponse,'A supported exchange about the recorded intervention.',[assurance.id]);
  }
  for(const statementId of chosen.callbackStatementIds||[])for(const m of Object.values(n.memories))if(m.ownerId===c.id&&m.statementIds.includes(statementId)){
   const statement=n.statements[statementId],relation=c.relations['character:'+statement.speakerId];
   const trusting=c.traits.loyalty>=POLICY.loyaltyThreshold||(relation?.respect||0)>=POLICY.trustThreshold;
   const doubtful=c.traits.vindictiveness>=POLICY.vindictivenessThreshold||(relation?.mistrust||0)>=POLICY.mistrustThreshold;
   const assessment=trusting?'The renewed unrest challenges the hope in this note. I remain inclined to trust its author; that is my judgement, not proof of the outcome.':doubtful?'The new unrest makes me less confident in the assurance. It does not establish intentional deception.':'I now treat the hope in this assurance more cautiously. The earlier improvement remains part of the record.';
   m.currentAssessment={kind:'opinion',text:assessment,incidentId:entry.incident.id,evidence:ctx.evidence};
   m.updates.push({incidentId:entry.incident.id,evidence:ctx.evidence,delta:0,kind:'challenged-expectation'});
  }
  used.add(c.id);if(!c.incidents.includes(entry.incident.id))c.incidents.push(entry.incident.id);
 }
}
