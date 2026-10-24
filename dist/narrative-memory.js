import {POLITICAL_VERSION,POLICY,MEMORY_PROFILES,DIMENSIONS,clamp,narrativeRandom} from './narrative-policy.js';
import {factRef} from './narrative-evidence.js';
const regionName=r=>r.charAt(0).toUpperCase()+r.slice(1);
export function initializePoliticalMemory(n){
 n.version=POLITICAL_VERSION;n.policyVersion=POLICY.id;n.memories={};n.statements={};n.arcs=[];
 for(const c of Object.values(n.characters)){
  c.memoryIds=[];c.confidence=50;c.voice={formality:1+narrativeRandom(n,3),directness:1+narrativeRandom(n,3),restraint:1+narrativeRandom(n,3),humour:narrativeRandom(n,3)};
  c.pacing={relevant:0,lastAppearance:-10,lastCallbackAt:-10,templates:[],phrases:[],callbacks:{}};
  c.development={strongExperiences:[],changes:[],lastChangedTurn:null};
 }return n;
}
export function contextForReaction(before,state,entry,reaction){
 const [trigger,region,context,presidency]=reaction,facts=entry.incident.facts;
 let index=facts.findIndex(f=>f.region===region&&(
  (trigger==='company-conquest'&&f.type==='company-conquest')||(trigger==='company-loss'&&f.type==='company-loss')||
  (trigger==='company-defence'&&f.type==='battle'&&f.kind==='company-defence'&&f.won)||
  (trigger==='subordination'&&f.type==='join')||(trigger==='released'&&f.type==='release')||
  (trigger.startsWith('rebellion-')&&f.type==='battle'&&f.kind==='rebellion')||
  (trigger==='deployment-failed'&&f.type==='deployment')||(trigger==='intervention'&&f.type==='intervention')||
  (trigger==='tax'&&['tax','unrest'].includes(f.type))||(trigger==='administration'&&f.type==='unrest')));
 // A failed/successful Govern check can have zero cubes; its structured input is still authoritative.
 const evidence=index>=0?[factRef(entry,index)]:[];
 let category=trigger;
 if(trigger==='tax'&&context.repeatedTax)category='tax-repeat';
 if(trigger==='deployment-failed'&&entry.incident.input.outcome==='catastrophe')category='deployment-catastrophe';
 const old=before.regions[region],now=state.regions[region];
 return {trigger,category,region,context:{...context,clearedUnrest:old.unrest>0&&now.unrest===0,reopenedOrders:Object.keys(old.orders).some(o=>!old.orders[o]&&now.orders[o]),addedUnrest:now.unrest>old.unrest},presidency,evidence,major:!!MEMORY_PROFILES[category]?.strong};
}
function interpretation(category,region,origin,c,perspective){
 const place=regionName(region),direct=origin==='direct';
 const body=perspective==='sovereign'&&category==='rebellion-won'?`I regard ${place}'s successful rebellion as a loss of our authority.`:
 perspective==='sovereign'&&category==='rebellion-failed'?`I take some reassurance from the failed rebellion in ${place}, without assuming the dispute has ended.`:
 perspective==='sovereign'&&category==='subordination'?`I regard the new allegiance of ${place} as a gain in our political authority.`:
 perspective==='sovereign'&&category==='released'?`I regard the release of ${place} as a loss of our empire's authority.`:
 perspective==='defender'?`I welcome the failure of the Company expedition in ${place}; its wider intentions remain unknown.`:
 category==='company-conquest'?`I regard Company control in ${place} as a constraint on our court.`:
 category==='intervention'?`I welcome the recorded restoration of order in ${place}, without treating every earlier grievance as settled.`:
 category.startsWith('tax')?`I regard ${category==='tax-repeat'?'the repeated demands':'this Tax'} in ${place} with ${c.traits.caution>=50?'caution':'resentment'}.`:
 category==='released'?`I consider the recorded end of ${place}'s subordination a defining political change.`:
 category==='rebellion-failed'?`I regard the failed rebellion in ${place} as a setback, not proof of anyone's private motives.`:
 `I consider the recorded ${category.replaceAll('-',' ')} in ${place} ${direct?'personally significant':'relevant to this household or institution'}.`;
 return {version:1,kind:'opinion',text:body};
}
export function memoryUnresolved(m,state){
 const r=state.regions[m.region];
 if(m.category==='company-conquest')return r.control==='company';
 if(m.category==='subordination')return !!r.overlord&&r.overlord===m.capital;
 if(['tax','tax-repeat','administration'].includes(m.category))return r.control==='company'&&r.unrest>0;
 return false;
}
export function adjustRelationship(n,ownerId,target,entry,memoryId,requested,reason,statementIds=[]){
 const c=n.characters[ownerId];if(!c)return;
 const key=target.kind+':'+target.id;
 const r=c.relations[key]??={...Object.fromEntries(DIMENSIONS.map(d=>[d,0])),origins:[],target,causes:[]};
 const causeId=`cause:${entry.incident.id}:${ownerId}:${key}:${memoryId||statementIds.join('-')}`;
 if(r.causes.some(c=>c.id===causeId))return;
 const deltas={};for(const [dimension,amount] of Object.entries(requested)){
  // Diminishing returns applies to increases; cooling need not erase existing reasons.
  const scaled=amount>0?Math.max(1,Math.round(amount*(1-r[dimension]/125))):amount;
  const value=clamp(r[dimension]+scaled);deltas[dimension]=value-r[dimension];r[dimension]=value;
 }
 r.origins.push(entry.incident.id);r.causes.push({id:causeId,incidentId:entry.incident.id,memoryIds:memoryId?[memoryId]:[],statementIds,deltas,reason});
}
function addMemory(n,state,entry,c,ctx,origin,relatedIds=[],target=null){
 if(!ctx.evidence.length)return null;
 const id=`memory:${entry.incident.id}:${ctx.evidence[0].factKey}:${c.id}:${ctx.category}`;
 if(n.memories[id])return n.memories[id];
 let profile=MEMORY_PROFILES[ctx.category];if(!profile)return null;
 if(ctx.perspective==='sovereign')profile={...profile,...(ctx.category==='subordination'?{significance:80,importance:65,emotion:'pride',hostility:0,respect:4}:ctx.category==='rebellion-failed'?{significance:60,importance:45,emotion:'pride',hostility:5}:ctx.category==='released'?{significance:80,importance:70,emotion:'humiliation'}:{significance:75,importance:70,emotion:'humiliation'})};
 const perspective=ctx.perspective||(['deployment-failed','deployment-catastrophe'].includes(ctx.category)&&c.role==='ruler'&&state.regions[ctx.region].control==='indian'?'defender':'local');
 if(perspective==='defender')profile={...profile,emotion:'relief',importance:40};
 const factor=origin==='direct'?1:c.role==='heir'?.35:.6;
 const m={id,ownerId:c.id,category:ctx.category,region:ctx.region,relatedCharacterIds:relatedIds,origin,evidence:ctx.evidence,statementIds:[],createdTurn:entry.turn,createdIncident:entry.incident.id,sequence:state.incidentSequence,historicalSignificance:Math.round(profile.significance*factor),emotionalImportance:Math.round(profile.importance*factor),emotion:profile.emotion,perspective,interpretation:interpretation(ctx.category,ctx.region,origin,c,perspective),updates:[],capital:ctx.context.capital?ctx.context.capital.toLowerCase():null};
 n.memories[id]=m;c.memoryIds.push(id);
 if(!c.incidents.includes(entry.incident.id))c.incidents.push(entry.incident.id);
 if(origin==='direct'){
  c.mood=profile.emotion;c.confidence=clamp(c.confidence+(['pride','relief','gratitude'].includes(profile.emotion)?6:-6));
  if(target){const changes={};for(const d of DIMENSIONS)if(profile[d])changes[d]=profile[d];
   if(Object.keys(changes).length){changes.familiarity=3;const weight=c.traits.pride>=60&&changes.hostility>0?1:0;changes.hostility&&(changes.hostility+=weight+narrativeRandom(n,2));
    adjustRelationship(n,c.id,target,entry,id,changes,`${ctx.category.replaceAll('-',' ')} in ${regionName(ctx.region)}; this is ${c.name}'s assessment, not a claim about hidden orders.`);
   }
  }
  if(profile.strong&&!c.development.strongExperiences.includes(entry.incident.id)){
   c.development.strongExperiences.push(entry.incident.id);
   if(c.development.strongExperiences.length%POLICY.traitEvery===0&&c.development.lastChangedTurn!==entry.turn){
    const trait='caution',delta=(profile.emotion==='pride'?-1:1)*(1+(narrativeRandom(n,4)===0?1:0)),actual=clamp(c.traits[trait]+delta)-c.traits[trait];
    if(actual){c.traits[trait]+=actual;c.development.changes.push({trait,delta:actual,turn:entry.turn,incidentIds:c.development.strongExperiences.slice(-POLICY.traitEvery)});c.development.lastChangedTurn=entry.turn;}
   }
  }
 }return m;
}
export function processPoliticalMemories(before,state,entry,reactions){
 const n=state.narrative,contexts=reactions.map(r=>contextForReaction(before,state,entry,r)),involved=new Set(),opponents=[];
 for(const ctx of contexts){
  if(!MEMORY_PROFILES[ctx.category]||!ctx.evidence.length)continue;
  const ruler=n.characters[n.seats[ctx.region]],target=ctx.trigger==='subordination'?ctx.context.capital?.toLowerCase():ctx.trigger.startsWith('rebellion-')||ctx.trigger==='released'?before.regions[ctx.region].overlord:null;
  const targetEntity=target?{kind:'character',id:n.seats[target]}:['company-conquest','company-defence','tax','tax-repeat','administration','intervention'].includes(ctx.category)?{kind:'institution',id:'company'}:null;
  if(ruler.condition!=='dead'){addMemory(n,state,entry,ruler,ctx,'direct',targetEntity?.kind==='character'?[targetEntity.id]:[],targetEntity);involved.add(ruler.id);}
  if(target&&n.seats[target]!==ruler.id){
   const sovereign=n.characters[n.seats[target]],opponentContext={...ctx,perspective:'sovereign',rulerId:sovereign.id,adviserId:null};
   if(sovereign.condition==='alive'){addMemory(n,state,entry,sovereign,opponentContext,'direct',[ruler.id],{kind:'character',id:ruler.id});involved.add(sovereign.id);opponents.push(opponentContext);}
  }
  // Immediate relevant awareness is not omniscience or claimed attendance.
  const adviserRole=['company-conquest','company-loss','company-defence','deployment-failed','deployment-catastrophe'].includes(ctx.category)?'army':['tax','tax-repeat','administration','intervention'].includes(ctx.category)?'secretary':null;
  ctx.adviserId=adviserRole&&ctx.presidency?(adviserRole==='secretary'&&state.laws.governorGeneral?'secretary-general':`${adviserRole}-${ctx.presidency}`):null;
  const adviser=n.characters[ctx.adviserId];if(adviser&&adviser.condition==='alive'){addMemory(n,state,entry,adviser,ctx,'indirect',[ruler.id]);involved.add(adviser.id);}
  if(ctx.major){
   const interested=new Set(ruler.family.map(f=>f.id));
   const formerCapital=before.regions[ctx.region].overlord;if(formerCapital&&formerCapital!==target)interested.add(n.seats[formerCapital]);
   for(const id of interested){const c=n.characters[id];if(c&&c.id!==ruler.id&&c.condition==='alive'){addMemory(n,state,entry,c,ctx,'indirect',[ruler.id]);involved.add(c.id);}}
  }
  for(const old of Object.values(n.memories)){
   if(old.createdIncident===entry.incident.id||old.region!==ctx.region||!involved.has(old.ownerId)||old.origin==='statement')continue;
   if(old.updates.some(u=>u.incidentId===entry.incident.id))continue;
   const reconcile=ctx.category==='intervention'&&['company-conquest','tax','tax-repeat','administration'].includes(old.category);
   const related=old.category===ctx.category||['company-conquest','subordination'].includes(old.category);
   if(reconcile||related){const delta=reconcile?-POLICY.reconcile:ctx.major?POLICY.reopen:POLICY.reinforce;
    const next=clamp(old.emotionalImportance+delta);if(next!==old.emotionalImportance)old.updates.push({incidentId:entry.incident.id,evidence:ctx.evidence,delta:next-old.emotionalImportance,kind:reconcile?'partial-reconciliation':'reinforced'});old.emotionalImportance=next;
   }
  }
 }
 for(const id of involved)n.characters[id].pacing.relevant++;
 if(entry.actionType==='next-turn')for(const m of Object.values(n.memories)){
  const fade=memoryUnresolved(m,state)?0:m.historicalSignificance>=75?1:POLICY.fade;
  if(fade&&m.emotionalImportance){const next=clamp(m.emotionalImportance-fade);m.updates.push({incidentId:entry.incident.id,evidence:[],delta:next-m.emotionalImportance,kind:'faded'});m.emotionalImportance=next;}
 }
 return [...contexts,...opponents];
}
