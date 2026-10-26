import {seatAt,speakerRoleAt} from './narrative-succession-state.js';
import {TRADE_DIALOGUE} from './narrative-trade-content.js';
import {POLICY,TRADE_POLICY as P,narrativeRandom} from './narrative-policy.js';
import {politicalPosture} from './narrative-posture.js';
const byId=new Map(TRADE_DIALOGUE.map(e=>[e.id,e]));
const unique=refs=>[...new Map(refs.map(r=>[r.incidentId+'/'+r.factKey,r])).values()];
const label=r=>r.charAt(0).toUpperCase()+r.slice(1);
const prior=(state,entry)=>state.history.slice(0,state.history.findIndex(h=>h.incident?.id===entry.incident.id));

// Only resolver facts and saved before/after board states; never instruction-text parsing.
export function tradeContexts(state,entry){
 const incident=entry.incident;if(!incident)return [];
 const contexts=[];
 for(const change of incident.changes){
  const region=change.region,closed=incident.facts.some(f=>f.region===region&&f.type==='order-closed'),opened=incident.facts.some(f=>f.region===region&&f.type==='order-opened');
  const reopened=Object.keys(change.before.orders).some(o=>!change.before.orders[o]&&change.after.orders[o]);
  const cascade=incident.facts.some(f=>f.region===region&&f.type==='order-closed'&&f.cascadeFrom&&incident.facts.some(c=>c.type==='trade-cascade'&&c.region===f.cascadeFrom));
  const military=reopened&&incident.facts.some(f=>f.type==='intervention'&&f.region===region)&&incident.input.type==='deploy'&&incident.input.outcome==='success';
  const diplomacy=opened&&incident.input.type==='envoy'&&incident.input.outcome==='success'&&incident.input.purpose==='order';
  const category=cascade?'trade-cascade':closed?'trade-disruption':military?'trade-military':diplomacy?'trade-diplomacy':null;
  if(!category)continue;
  const presidency=change.before.presidency||change.after.presidency||null;
  const evidence=incident.facts.flatMap((f,i)=>f.region===region&&((category.startsWith('trade-d')&&f.type===(closed?'order-closed':'order-opened'))||(military&&f.type==='intervention')||(cascade&&f.type==='order-closed'))?[{incidentId:incident.id,factKey:'fact-'+i}]:[]);
  const tradeEvidence=cascade?incident.facts.flatMap((f,i)=>['trade-cascade','order-closed'].includes(f.type)?[{incidentId:incident.id,factKey:'fact-'+i}]:[]):evidence;
  const army=military?incident.facts.find(f=>f.type==='intervention'&&f.region===region).army:presidency;
  const adviserId=state.narrative.characters['secretary-'+(presidency||region)]?'secretary-'+(presidency||region):null;
  contexts.push({trigger:category,category,region,evidence,tradeEvidence,presidency,adviserId,officerId:army&&state.narrative.characters['army-'+army]?'army-'+army:null,army,commerce:true,context:{},major:false});
 }return contexts;
}
export function tradeExperience(state,c,ctx,entry){
 const earlier=prior(state,entry),ids=new Set(earlier.map(h=>h.incident?.id));
 const relevant=region=>c.role==='secretary'||region===ctx.region;
 const knownRestoration=m=>m.category==='intervention'&&earlier.some(h=>h.incident?.id===m.createdIncident&&tradeContexts(state,h).some(x=>x.region===m.region&&x.category==='trade-military'));
 const memories=c.memoryIds.map(id=>state.narrative.memories[id]).filter(m=>relevant(m.region)&&ids.has(m.createdIncident)&&(m.category.startsWith('trade-')||knownRestoration(m)));
 const oncePerEvent=list=>[...new Map(list.map(m=>[m.createdIncident,m])).values()];
 const restores=oncePerEvent(memories.filter(m=>['trade-diplomacy','trade-military','intervention'].includes(m.category)));
 const disruptions=oncePerEvent(memories.filter(m=>['trade-disruption','trade-cascade'].includes(m.category)));
 const lines=earlier.flatMap(h=>(h.narrative?.lines||[]).filter(l=>l.speakerId===c.id&&((l.tradeRegion&&relevant(l.tradeRegion))||(l.statementId&&relevant(state.narrative.statements[l.statementId]?.region)))));
 const hope=lines.find(l=>l.templateId==='TR08-REST-SEC-01'||(l.templateId==='m2-assurance-orders'&&restores.some(m=>m.createdIncident===l.incidentId)));
 return {memories,restores,disruptions,lines,hope};
}
const restoration=f=>['trade-military','trade-diplomacy'].includes(f.category);
const cautious=c=>c.traits.caution>=P.highTrait;
const proud=c=>c.traits.pride>=P.highTrait;
const dry=c=>c.voice.humour>=P.humour;
const procedural=c=>c.voice.formality>=P.formality;
const practical=c=>c.voice.restraint>=P.restraint;
const rules={
 'TR08-DISR-CH-01':{role:'chronicler',event:f=>f.category==='trade-disruption',regionalRepeat:true},
 'TR08-DISR-SEC-01':{role:'secretary',event:f=>['trade-disruption','trade-cascade'].includes(f.category),voice:procedural,emotion:'irritated'},
 'TR08-DISR-RUL-01':{role:'ruler',event:f=>f.category==='trade-disruption',voice:c=>proud(c)||dry(c),emotion:'critical'},
 'TR08-DISR-RUL-02':{role:'ruler',event:f=>f.category==='trade-disruption',voice:practical,emotion:'concerned'},
 'TR08-DIPL-CH-01':{role:'chronicler',event:f=>f.category==='trade-diplomacy'},
 'TR08-DIPL-SEC-01':{role:'secretary',event:f=>f.category==='trade-diplomacy',experience:x=>x.restores.length<P.optimisticLimit,once:true,emotion:'pleased'},
 'TR08-DIPL-RUL-01':{role:'ruler',event:f=>f.category==='trade-diplomacy',voice:c=>cautious(c)||practical(c),emotion:'guarded'},
 'TR08-DIPL-RUL-02':{role:'ruler',event:f=>f.category==='trade-diplomacy',voice:dry,emotion:'sardonic'},
 'TR08-MIL-OFF-01':{role:'army',event:f=>f.category==='trade-military',voice:proud,emotion:'proud'},
 'TR08-MIL-RUL-01':{role:'ruler',event:f=>f.category==='trade-military',hostile:true,emotion:'contemptuous'},
 'TR08-REST-SEC-01':{role:'secretary',event:restoration,voice:cautious,experience:x=>x.restores.length===0,once:true,hope:true,emotion:'hopeful'},
 'TR08-REST-SEC-02':{role:'secretary',event:restoration,experience:x=>x.restores.length>=1&&x.hope,once:true,recall:true,emotion:'cautious'},
 'TR08-REST-SEC-03':{role:'secretary',event:restoration,voice:c=>procedural(c)&&(dry(c)||proud(c)),experience:x=>x.restores.length>=P.several,once:true,recall:true,emotion:'exasperated'},
 'TR08-REST-SEC-04':{role:'secretary',event:restoration,voice:c=>cautious(c)||c.confidence<P.confident,experience:x=>x.restores.length>=P.several&&x.disruptions.length>=P.repeatedDisruptions,once:true,recall:true,emotion:'resigned'},
 'TR08-CASC-CH-01':{role:'chronicler',event:f=>f.category==='trade-cascade'},
 'TR08-CASC-SEC-01':{role:'secretary',event:f=>f.category==='trade-cascade',emotion:'alarmed'},
 'TR08-CASC-RUL-01':{role:'ruler',event:f=>f.category==='trade-cascade',voice:dry,emotion:'amused'},
 'TR08-CASC-OFF-01':{role:'army',event:f=>f.category==='trade-cascade',voice:proud,emotion:'outraged'},
 'TR08-REL-RUL-01':{role:'ruler',event:restoration,hostile:true,emotion:'hostile'},
 'TR08-REL-RUL-03':{role:'ruler',event:restoration,aligned:true,experience:x=>x.restores.length>=P.beneficial,emotion:'independent'}
};
function eligible(state,entry,c,ctx,role,e,{historical=false,line=null}={}){
 const r=rules[e.id];if(r.role!==role||!r.event(ctx))return null;
 if(role!=='chronicler'){
  if(!c||(!historical&&c.condition!=='alive'))return null;
  if(role==='ruler'&&(historical?seatAt(state,ctx.region,entry):state.narrative.seats[ctx.region])!==c.id)return null;
  if(role==='secretary'&&c.region!==(ctx.presidency||ctx.region))return null;
  if(role==='army'&&c.region!==ctx.army)return null;
 }
 const regional=prior(state,entry).filter(h=>h.incident?.facts.some(f=>f.type==='order-closed'&&f.region===ctx.region));
 if(r.regionalRepeat&&!regional.length)return null;
 const x=c?tradeExperience(state,c,ctx,entry):null;
 if(r.experience&&!r.experience(x))return null;
 if(!historical&&r.voice&&!r.voice(c))return null;
 const posture=c&&(r.hostile||r.aligned)?politicalPosture(state,c,ctx.region,entry.incident.id):null;
 if(r.hostile&&posture.kind!=='hostile')return null;
 if(r.aligned&&posture.kind!=='aligned')return null;
 if(r.once&&x.lines.some(l=>l.templateId===e.id))return null;
 if(!historical&&c&&c.pacing.templates.some(p=>p.id===e.id&&c.pacing.relevant-p.at<POLICY.templateCooldown))return null;
 if(!historical&&!c&&prior(state,entry).filter(h=>h.incident?.changes.some(x=>x.region===ctx.region)).slice(-POLICY.templateCooldown).some(h=>h.narrative?.lines.some(l=>l.templateId===e.id)))return null;
 const recall=r.recall?(line?.callbackMemoryIds[0]?x.restores.find(m=>m.id===line.callbackMemoryIds[0]):x.restores.at(-1)):null;
 if(r.recall&&!recall)return null;
 if(!historical&&recall){const last=c.pacing.callbacks[recall.id];if(c.pacing.relevant-c.pacing.lastCallbackAt<POLICY.globalCallbackCooldown||(last&&c.pacing.relevant-last.at<last.cooldown))return null;}
 const knowledge=r.recall?x.memories.flatMap(m=>m.evidence):[];
 const selectionEvidence=unique([...(posture?.evidence||[]),...knowledge,...(r.regionalRepeat?regional.flatMap(h=>h.incident.facts.flatMap((f,i)=>f.type==='order-closed'&&f.region===ctx.region?[{incidentId:h.incident.id,factKey:'fact-'+i}]:[])):[])]);
 const experienceLineIds=e.id==='TR08-REST-SEC-02'?[x.hope.id]:[];
 return {e,r,x,recall,selectionEvidence,experienceLineIds};
}
export function selectTradeDialogue(state,entry,c,ctx,role){
 const candidates=TRADE_DIALOGUE.flatMap(e=>{const chosen=eligible(state,entry,c,ctx,role,e);return chosen?[chosen]:[];});
 if(!candidates.length)return null;
 const score=x=>(x.e.id.startsWith('TR08-REST')?P.experiencePriority:0)+(x.e.id==='TR08-MIL-RUL-01'?P.localPriority:0)+(x.e.id==='TR08-CASC-SEC-01'?P.localPriority:0);
 candidates.sort((a,b)=>score(b)-score(a));const best=candidates.filter(x=>score(x)===score(candidates[0])),chosen=best[narrativeRandom(state.narrative,best.length)];
 const {e,r,recall,selectionEvidence,experienceLineIds}=chosen;
 return {templateId:e.id,text:e.text.replaceAll('{region}',label(ctx.region)),emotion:r.emotion||'dry',family:e.id,evidence:ctx.tradeEvidence,selectionEvidence,callbackMemoryIds:recall?[recall.id]:[],callbackStatementIds:[],experienceLineIds,tradeRegion:ctx.region,tradeKind:ctx.category,...(r.hope?{statementType:'assurance',audienceIds:[]}: {})};
}
export function validateTradeLine(state,entry,line){
 const e=byId.get(line.templateId);if(!e){if(line.templateId.startsWith('TR08-'))throw Error('Invalid narrative: unsupported trade template');return;}
 const ctx=tradeContexts(state,entry).find(c=>c.region===line.tradeRegion&&c.category===line.tradeKind);
 if(!ctx)throw Error('Invalid narrative: trade dialogue event');
 const role=line.speakerId==='chronicler'?'chronicler':speakerRoleAt(state,state.narrative.characters[line.speakerId],entry),c=state.narrative.characters[line.speakerId];
 const chosen=eligible(state,entry,c,ctx,role,e,{historical:true,line});
 const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 if(!chosen||line.text!==e.text.replaceAll('{region}',label(ctx.region))||line.emotion!==(chosen.r.emotion||'dry')||!equal(line.evidence,ctx.tradeEvidence)||!equal(line.selectionEvidence||[],chosen.selectionEvidence)||!equal(line.callbackMemoryIds,chosen.recall?[chosen.recall.id]:[])||!equal(line.callbackStatementIds,[])||!equal(line.experienceLineIds||[],chosen.experienceLineIds))throw Error('Invalid narrative: trade dialogue wording or experience');
 if(chosen.r.hope){const statement=state.narrative.statements[line.statementId];if(!statement||statement.speakerId!==c.id||statement.type!=='assurance'||statement.audienceIds.length)throw Error('Invalid narrative: commercial hope ownership or audience');}
}
