import {CONDITION_LABELS,legacyPoliticalRole,recordPoliticalRole,validateCharacters,validateCharacterContinuity} from './narrative-characters.js';
import {commitStaged,validateStagedHistory} from './narrative-staged.js';
import {initializeWeather,validateWeather} from './weather-presentation.js';
import {saveAnticipation,validateAnticipation} from './narrative-resolution.js';
import {commitAdvice} from './narrative-advice.js';
import {initializeOutlooks,updateOutlooks} from './narrative-outlooks.js';
import {composeChapter} from './narrative-chapters.js';
import {initializePoliticalMemory,processPoliticalMemories} from './narrative-memory.js';
import {renderPoliticalDialogue} from './narrative-dialogue.js';
import {tradeContexts} from './narrative-trade.js';
import {validatePoliticalMemory} from './narrative-state.js';
import {NAME_POOLS,TRAITS,TRAIT_LABELS,BACKGROUNDS} from './narrative-content.js';
const copy=v=>JSON.parse(JSON.stringify(v));
const regions=Object.keys(NAME_POOLS),modes=['quiet','standard','full'];
const name=id=>id.charAt(0).toUpperCase()+id.slice(1);
const ensure=(ok,message)=>{if(!ok)throw Error('Invalid narrative: '+message);};
// Independent PRNG state is saved and restored. Never use the gameplay random source.
function random(n,max){n.rng=(Math.imul(n.rng,1664525)+1013904223)>>>0;return Math.floor(n.rng/4294967296*max);}
function seedValue(){const bytes=new Uint32Array(1);globalThis.crypto.getRandomValues(bytes);return bytes[0];}
function position(board){return board.control==='company'?'retained local ruler':board.overlord?'subordinate ruler':'sovereign ruler';}
export function createNarrative(state,seed=seedValue()){
 const n={version:1,enabled:true,intensity:'standard',rng:seed>>>0,nextIncident:1,characters:{},seats:{},allegiances:[],chapters:[],lastIncident:null,lastAgedTurn:state.turn};
 for(const region of regions){
  const pool=NAME_POOLS[region],offset=random(n,pool.length),id='ruler-'+region,heir='heir-'+region;
  const dynasty='House of '+pool[offset]+' of '+name(region);
  const traits=Object.fromEntries(TRAITS.map(t=>[t,20+random(n,61)]));
  const age=35+random(n,21);
  n.characters[id]={id,name:pool[offset]+' of '+name(region),aliases:[],region,age,dynasty,role:'ruler',condition:'alive',position:position(state.regions[region]),mood:'watchful',traits,family:[{id:heir,tie:'younger sibling'}],claims:[region],relations:{},incidents:[],background:BACKGROUNDS[random(n,BACKGROUNDS.length)],provenance:'Fictional pre-campaign background'};
  n.characters[heir]={id:heir,name:pool[(offset+1)%pool.length]+' of '+name(region),aliases:[],region,age:age-8,dynasty,role:'heir',condition:'alive',position:'family member',mood:'watchful',traits:Object.fromEntries(TRAITS.map(t=>[t,20+random(n,61)])),family:[{id,tie:'older sibling'}],claims:[],relations:{},incidents:[],background:'A younger sibling within this fictional household; no earlier campaign events are asserted.',provenance:'Fictional pre-campaign background'};
  n.seats[region]=id;
  if(state.regions[region].overlord)n.allegiances.push({id:'setup-'+region,subject:region,capital:state.regions[region].overlord,subjectRuler:id,capitalRuler:'ruler-'+state.regions[region].overlord,start:state.turn,origin:'unknown',promises:[],end:null,provenance:'Scenario setup'});
 }
 for(const [role,label] of [['secretary','Presidency secretary'],['army','Army adjutant']])for(const region of ['bombay','madras','bengal']){
  const id=role+'-'+region,first=['Thomas','Edward','Henry'],last=['Mercer','Bell','Finch','Reed','Avery','Hale'];
  let candidate=random(n,18),fullName=first[Math.floor(candidate/6)]+' '+last[candidate%6];
  while(Object.values(n.characters).some(c=>c.name===fullName)){candidate=(candidate+1)%18;fullName=first[Math.floor(candidate/6)]+' '+last[candidate%6];}
  n.characters[id]={id,name:fullName,aliases:[],region,age:30+random(n,21),dynasty:'Company institution',role,condition:'alive',position:label+' of '+name(region),mood:'watchful',traits:Object.fromEntries(TRAITS.map(t=>[t,20+random(n,61)])),family:[],claims:[],relations:{},incidents:[],background:'A fictional institutional adviser, distinct from every player officeholder.',provenance:'Fictional pre-campaign background'};
 }
 n.characters['secretary-general']={...copy(n.characters['secretary-bengal']),id:'secretary-general',name:'Arthur Pembroke',region:'bengal',position:'Governor General secretary'};
 const view={...state,narrative:n};for(const c of Object.values(n.characters)){c.politicalRole=legacyPoliticalRole(view,c);c.politicalHistory=[];c.conditionHistory=[];}
 return initializeOutlooks(state,initializePoliticalMemory(n));
}
export function validateNarrative(state){
 const n=state.narrative;if(n===undefined||n===null)return;
 ensure(n&&n.version===2&&n.enabled===true&&modes.includes(n.intensity),'unsupported format or display mode');
 ensure(Number.isInteger(n.rng)&&n.rng>=0&&n.rng<=4294967295&&Number.isInteger(n.nextIncident)&&n.nextIncident>0,'random state or incident sequence');
 ensure(n.characters&&typeof n.characters==='object'&&!Array.isArray(n.characters)&&Object.keys(n.characters).length<=2000,'character catalogue');
 for(const [id,c] of Object.entries(n.characters)){
  ensure(c&&c.id===id&&typeof c.name==='string'&&c.name.length<=160&&regions.includes(c.region),'character identity');
  ensure(Number.isInteger(c.age)&&c.age>=0&&c.age<=200&&Object.hasOwn(CONDITION_LABELS,c.condition),'age or condition');
  ensure(['ruler','heir','secretary','army'].includes(c.role)&&typeof c.position==='string'&&typeof c.mood==='string'&&typeof c.background==='string','character role');
  ensure(TRAITS.every(t=>Number.isInteger(c.traits?.[t])&&c.traits[t]>=0&&c.traits[t]<=100),'traits');
  ensure(Array.isArray(c.family)&&c.family.every(f=>n.characters[f.id]&&typeof f.tie==='string'),'family reference');
  ensure(Array.isArray(c.claims)&&c.claims.every(r=>regions.includes(r))&&Array.isArray(c.incidents)&&c.incidents.length<=10000&&new Set(c.incidents).size===c.incidents.length&&c.incidents.every(i=>typeof i==='string'),'character records');
  ensure(c.relations&&typeof c.relations==='object'&&Object.values(c.relations).every(r=>r&&Array.isArray(r.origins)&&r.origins.every(i=>typeof i==='string')&&['hostility','gratitude','respect','mistrust','loyalty','familiarity'].every(k=>Number.isInteger(r[k])&&r[k]>=0&&r[k]<=100)),'relationships');
 }
 ensure(regions.every(r=>n.characters[n.seats?.[r]]?.region===r&&n.characters[n.seats[r]].role==='ruler'),'regional seats');
 ensure(Array.isArray(n.allegiances)&&n.allegiances.every(a=>regions.includes(a.subject)&&regions.includes(a.capital)&&a.subject!==a.capital&&['unknown','battle','negotiated'].includes(a.origin)&&n.characters[a.subjectRuler]&&n.characters[a.capitalRuler]&&Array.isArray(a.promises)),'allegiance records');
 ensure(Array.isArray(n.chapters)&&n.chapters.every(c=>Number.isInteger(c.turn)&&typeof c.title==='string'&&typeof c.text==='string'&&Array.isArray(c.incidents)),'chapters');
 ensure(Number.isInteger(n.lastAgedTurn)&&n.lastAgedTurn<=state.turn,'ageing boundary');
 const ids=new Set();
 validateCharacters(state);validatePoliticalMemory(state);validateStagedHistory(state);validateWeather(state);
 for(const h of state.history){if(!h.narrative)continue;validateAnticipation(state,h);const scene=h.narrative;
  ensure(typeof scene.id==='string'&&!ids.has(scene.id)&&Array.isArray(scene.lines)&&scene.lines.length<=40,'scene identity');ids.add(scene.id);
  for(const l of scene.lines)ensure(l.incidentId===scene.id&&(l.speakerId==='chronicler'||n.characters[l.speakerId])&&typeof l.templateId==='string'&&typeof l.text==='string'&&l.text.length<=5000&&typeof l.emotion==='string','saved scene');
 }
}
function allegiance(n,f,id,turn){
 const active=n.allegiances.find(a=>a.subject===f.region&&!a.end);
 if(f.type==='release'||f.type==='independence'||f.type==='company-conquest'||f.type==='foreign-settlement'||f.type==='join'){
  if(active){active.end={incident:id,turn,reason:f.type};}
  if(f.type==='join')n.allegiances.push({id:id+'-'+n.allegiances.length,subject:f.region,capital:f.capital,subjectRuler:n.seats[f.region],capitalRuler:n.seats[f.capital],start:turn,origin:'battle',promises:[],end:null,provenance:'Campaign incident',incident:id});
 }
 return active;
}
function chapter(state,n,turn,ending=false){
 const c=composeChapter(state,turn,ending);n.chapters.push(c);return c;
}
// Called exactly at the application commit boundary; previews remain pure gameplay.
export function commitNarrative(before,result){
 if(!before.narrative||!result.state.narrative)return result.state;
 validateCharacterContinuity(before,result.state);
 if(result.state.history.at(-1)?.narrative)return result.state; // already processed result
 const state=copy(result.state),n=state.narrative,entry=state.history.at(-1);
 if(!entry||entry.kind==='correction'||entry.actionType==='rename'){
  // Debug edits are setup provenance, never invented conquest, grievances or promises.
  if(entry?.kind==='correction'){
   for(const region of regions){n.characters[n.seats[region]].position=position(state.regions[region]);recordPoliticalRole(before,state,entry,region);const a=n.allegiances.find(a=>a.subject===region&&!a.end);if(a&&a.capital!==state.regions[region].overlord)a.end={turn:state.turn,reason:'debug-setup'};
    if(state.regions[region].overlord&&!n.allegiances.some(a=>a.subject===region&&!a.end))n.allegiances.push({id:'debug-'+n.nextIncident+++'-'+region,subject:region,capital:state.regions[region].overlord,subjectRuler:n.seats[region],capitalRuler:n.seats[state.regions[region].overlord],start:state.turn,origin:'unknown',promises:[],end:null,provenance:'Debug setup'});
   }
  }
  if(entry?.kind==='correction')updateOutlooks(before,state,entry);
  return state;
 }
 // Stack reservation and phase bookkeeping are retained facts but need no duplicate scene.
 initializeWeather(state,entry);
 if(['stack-draw','phase-ships','phase-finish','parliament-finish'].includes(entry.actionType)){updateOutlooks(before,state,entry);return state;}
 const incident=entry.incident||{type:entry.actionType||entry.kind,input:{},facts:[],changes:[]};
 const id=incident.id||'incident-'+n.nextIncident,lines=[],affected=new Set(incident.changes.map(c=>c.region));
 n.nextIncident=Math.max(n.nextIncident+1,(state.incidentSequence||0)+1);
 const scene={id,turn:entry.turn,lines,coverage:'specific',provenance:incident.provenance||'gameplay'};
 const add=(templateId,text,speakerId='chronicler',emotion='neutral')=>{const line={id:id+':line-'+lines.length,templateId,text,speakerId,speaker:speakerId==='chronicler'?'Chronicler':n.characters[speakerId].name,role:speakerId==='chronicler'?'Anonymous narrator':n.characters[speakerId].position,emotion,incidentId:id,evidence:[],callbackMemoryIds:[],callbackStatementIds:[],provenance:'Authored fictional dialogue'};lines.push(line);return line;};
 const facts=incident.facts||[],summary=[];
 const reactions=[];
 for(const f of facts){if(f.region)affected.add(f.region);const ended=allegiance(n,f,id,entry.turn);
  if(f.type==='company-conquest'){summary.push(`The Company took control of ${name(f.region)}${f.lootConsumed?'; its one-time regional loot token was consumed':''}.`);reactions.push(['company-conquest',f.region,{conquest:true},f.army]);/* Relationship changes are committed by the political-memory processor. */}
  if(f.type==='company-loss'){summary.push(`The Company lost ${name(f.region)}. The reported officer rout removed ${f.removed}; removal does not establish death.`);reactions.push(['company-loss',f.region,{lost:true},f.presidency]);}
  if(f.type==='battle'){
   if(f.kind==='company-defence'&&f.won){summary.push(`The attack on ${name(f.region)} was repelled.`);reactions.push(['company-defence',f.region,{defended:true},f.presidency]);}
   if(f.kind==='rebellion'){summary.push(`The rebellion in ${name(f.region)} ${f.won?'succeeded':'failed'}.`);reactions.push([f.won?'rebellion-won':'rebellion-failed',f.region,f.won?{independent:true}:{failedRebellion:true}]);}
   if(f.kind==='indian-invasion'||f.kind==='foreign-invasion')summary.push(`${f.kind==='indian-invasion'?name(f.attacker):'A foreign force'} ${f.won?'won':'failed in'} the attack on ${name(f.region)}.`);
  }
  if(f.type==='release'){summary.push(`${name(f.region)} became sovereign after ${name(f.capital)} lost its empire.`);reactions.push(['released',f.region,{released:true,battleOrigin:ended?.origin==='battle'}]);}
  if(f.type==='join'){summary.push(`${name(f.region)} became subordinate to ${name(f.capital)} following the attack.`);reactions.push(['subordination',f.region,{joined:true,capital:name(f.capital)}]);/* Political-memory processing records directional causes. */}
  if(f.type==='deployment'&&f.outcome!=='success'){summary.push(`The Company deployment in ${name(f.region)} ended in ${f.outcome==='catastrophe'?'catastrophic failure':'failure'}; ${f.losses} officer ${f.losses===1?'loss was':'losses were'} reported.`);reactions.push(['deployment-failed',f.region,{failedDeployment:true},f.army]);}
  if(f.type==='intervention'){const change=incident.changes.find(c=>c.region===f.region),effects=[];if(change?.before.unrest>0&&change.after.unrest===0)effects.push('cleared its unrest');if(change&&Object.keys(change.before.orders).some(o=>!change.before.orders[o]&&change.after.orders[o]))effects.push('restored commercial access');summary.push(`The Company intervention in ${name(f.region)} ${effects.join(' and ')}.`);reactions.push(['intervention',f.region,{intervention:true},f.army]);}
 }
 for(const change of incident.changes){const c=n.characters[n.seats[change.region]];c.position=position(change.after);recordPoliticalRole(before,state,entry,change.region);}
 if(['tax','unrest','govern'].includes(entry.actionType)){
  const input=incident.input,targets=input.region?[input.region]:regions.filter(r=>state.regions[r].control==='company');
  for(const region of targets){affected.add(region);const change=incident.changes.find(c=>c.region===region),amount=(change?.after.unrest||0)-(change?.before.unrest||0),tax=entry.actionType==='tax'||input.reason==='tax';
   summary.push(`${name(region)}: ${tax?'Tax':entry.actionType==='govern'?'Governor General '+input.outcome:'unsuccessful administration'} recorded; ${amount} unrest added.`);
   const reportedTax=facts.find(f=>f.type==='tax'&&f.region===region),generalTax=tax&&!!state.laws.governorGeneral;
   reactions.push([tax?'tax':'administration',region,{tax,generalTax,firstTax:tax&&!generalTax&&reportedTax?.ordinal===1,repeatedTax:tax&&!generalTax&&(reportedTax?.ordinal>1||input.reason==='tax'),administration:!tax},state.regions[region].presidency]);/* Political-memory processing records the Tax assessment. */
  }
 }
 if(entry.actionType==='tax'&&facts.some(f=>f.type==='tax'&&f.mode==='governor'&&f.ordinal>1))summary.push('A familiar demand has acquired a fresh entry.');
 const commerce=tradeContexts(state,entry);
 const politicalContexts=processPoliticalMemories(before,state,entry,reactions,commerce);
 if(!summary.length&&commerce.length)for(const ctx of commerce)summary.push(`${name(ctx.region)}: ${ctx.category==='trade-diplomacy'?'diplomacy restored a commercial opportunity':ctx.category==='trade-military'?'military intervention restored commercial access':'a commercial opportunity was disrupted'}.`);
 if(entry.actionType==='next-turn'){
  const c=chapter(state,n,before.turn);if(n.lastAgedTurn<state.turn){for(const person of Object.values(n.characters))if(person.condition!=='dead')person.age+=3;n.lastAgedTurn=state.turn;}
  summary.push(c.text||`Turn ${before.turn} closes.`);
 }else if(entry.actionType==='end-game'){summary.push(chapter(state,n,state.turn,true).text,'The campaign has ended. No further years are added.');}
 if(!summary.length){scene.coverage='summary';summary.push(entry.title+'.');for(const change of incident.changes){summary.push(`${name(change.region)}: ${change.after.strength} tower levels, ${change.after.unrest} unrest; ${Object.values(change.after.orders).filter(v=>!v).length} disrupted commercial opportunities.`);}}
 const chroniclerLine=add('chronicler-'+incident.type+'-v1',summary.join(' '));chroniclerLine.evidence=incident.facts.map((f,i)=>({incidentId:id,factKey:'fact-'+i}));
 renderPoliticalDialogue(before,state,entry,scene,politicalContexts.filter(ctx=>ctx.category!=='intervention'||!commerce.some(c=>c.region===ctx.region&&c.category==='trade-military')),add);
 for(const region of affected){const c=n.characters[n.seats[region]];if(!c.incidents.includes(id))c.incidents.push(id);}
 for(const line of lines){if(line.speakerId!=='chronicler'){const c=n.characters[line.speakerId];if(!c.incidents.includes(id))c.incidents.push(id);}}
 entry.narrative=scene;if(entry.incident)entry.incident.id=id;n.lastIncident=id;updateOutlooks(before,state,entry);commitAdvice(before,state,entry,scene,result);saveAnticipation(state,entry);commitStaged(before,state,entry,result);return state;
}
export function dominantTraits(person){return Object.entries(person.traits).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([key])=>TRAIT_LABELS[key]).join(', ');}
