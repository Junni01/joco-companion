import {validateEventStack} from './event-stack.js';
import {validateActionProgress} from './action-progress.js';
import {phaseFor,STORM_FACES} from './india-phase.js';
import {END_REASONS,canCompleteGame} from './game-end.js';
import {SCENARIOS,STARTING_BOARDS} from './scenarios.js';
// Board facts and pure state transitions. Narrative may consume incidents but never mutate this state.
export const IDS=['punjab','delhi','bengal','bombay','maratha','hyderabad','mysore','madras'];
export const PRESIDENCIES=['bombay','madras','bengal'];
export const REGIONS={
 punjab:{lootBonus:6,name:'Punjab',color:'#868c97',xy:[110,23],path:'M0 0H295L280 103 243 163 180 187 111 211 0 251Z',neighbors:['delhi','bombay'],opium:0,orders:[['p7',207,85,7]]},
 delhi:{lootBonus:8,name:'Delhi',color:'#958d83',xy:[625,35],path:'M295 0H850L861 80 819 146 818 185 742 217 654 196 515 208 377 264 335 188 243 163 280 103Z',neighbors:['punjab','bombay','maratha','bengal'],opium:1,orders:[['d5n',493,70,5],['d3',427,166,3],['d5e',682,136,5]]},
 bengal:{lootBonus:6,name:'Bengal',color:'#b47b62',xy:[1040,90],path:'M850 0H1265V360L1210 342 1179 338 1160 383 1090 408 1011 352 935 352 876 376 835 325 815 284 818 185 819 146 861 80Z',neighbors:['delhi','maratha'],opium:2,orders:[['be5',922,279,5],['be6',1127,392,6]]},
 bombay:{lootBonus:4,name:'Bombay',color:'#96aea6',xy:[155,285],path:'M0 251L111 211 180 187 243 163 335 188 377 264 366 314 416 389 428 460 378 480 339 527 332 585 347 647 399 719 310 742 271 711 241 612 214 538 224 471 244 411 222 359 187 344 139 385 89 407 49 374 44 326 13 318Z',neighbors:['punjab','delhi','maratha','hyderabad','mysore'],opium:0,orders:[['bo3n',252,223,3],['bo3s',344,409,3],['bo4',226,524,4]]},
 maratha:{lootBonus:3,name:'Maratha',color:'#c99c67',xy:[635,350],path:'M377 264L515 208 654 196 742 217 818 185 815 284 835 325 876 376 935 352 1011 352 1090 408 1027 490 909 556 842 606 770 628 690 568 618 554 580 510 501 530 428 460 416 389 366 314Z',neighbors:['delhi','bengal','bombay','hyderabad'],opium:0,orders:[['ma4',704,269,4],['ma3',500,411,3],['ma2',813,499,2]]},
 hyderabad:{lootBonus:7,name:'Hyderabad',color:'#9fa476',xy:[530,575],path:'M428 460L501 530 580 510 618 554 690 568 770 628 842 606 787 658 724 695 674 734 610 756 539 745 478 731 399 719 347 647 332 585 339 527 378 480Z',neighbors:['bombay','maratha','mysore','madras'],opium:1,orders:[['h7',627,671,7]]},
 mysore:{lootBonus:5,name:'Mysore',color:'#bfb59c',xy:[445,970],path:'M310 742L399 719 478 731 539 745 516 827 531 895 548 938 526 995 503 1094 445 1058 406 987 372 926 351 856Z',neighbors:['bombay','hyderabad','madras'],opium:0,orders:[['my3',385,757,3],['my6',464,877,6]]},
 madras:{lootBonus:5,name:'Madras',color:'#e5c790',xy:[600,1100],path:'M539 745L610 756 674 734 670 816 683 864 639 917 639 994 620 1067 596 1132 558 1181 517 1202 500 1165 503 1094 526 995 548 938 531 895 516 827Z',neighbors:['hyderabad','mysore'],opium:1,orders:[['md5',662,870,5],['md4',597,976,4]]}
};
export const ALLIANCES=[
 {id:'rajput',name:'Rajput Prince',army:'bombay',cost:5,strength:3,voice:'Dynastic standing, recognition and negotiated service.'},
 {id:'sikhs',name:'Sikhs',army:'bombay',cost:3,strength:2,voice:'Autonomy and reciprocal commitments; a representative of the participating force.'},
 {id:'nizam',name:'The Nizam',army:'madras',cost:3,strength:2,voice:'Diplomacy, reciprocal protection and balancing regional powers.'},
 {id:'arcot',name:'Arcot',army:'madras',cost:4,strength:2,voice:'Courtly status, military assistance and the cost of dependence.'},
 {id:'awadh',name:'Awadh',army:'bengal',cost:4,strength:2,voice:'Security, sovereignty and the demands of powerful partners.'},
 {id:'jagat',name:'Jagat Seths',army:'bengal',cost:4,strength:2,voice:'A banking house: credit, political influence and financial backing.'},
 {id:'orissa',name:'Orissa',army:'bengal',cost:2,strength:1,voice:'Local interests and negotiated assurances; exact historical identity remains open.'}
];
export const LAW_NAMES={royalProtection:'Royal Protection',governorGeneral:'Governor General',envoyChina:'Envoy to China',zamindarTaxes:'Zamindar Taxes',treasureReform:'Treasure Reform',sepoyRecruitment:'Sepoy Recruitment',calicoActs:'Calico Acts',militaryOversight:'Military Oversight',deregulation:'Deregulation'};
// Retain legacy/table-only flags in saves; only these laws belong in the India companion's Parliament.
export const INDIA_LAW_NAMES=Object.fromEntries(['royalProtection','governorGeneral','envoyChina','zamindarTaxes','treasureReform','sepoyRecruitment'].map(id=>[id,LAW_NAMES[id]]));
export const clone=o=>JSON.parse(JSON.stringify(o));
export const regionsLostThisTurn=s=>s.history.filter(h=>h.turn===s.turn).reduce((total,h)=>total+(h.regionLosses?.length||0),0);
export function initialState(scenario='1710'){
 const c=SCENARIOS[scenario];if(!c)throw Error('Choose a supported scenario.');const b=STARTING_BOARDS[c.board];
 return {schemaVersion:1,scenario,campaignName:c.name,turn:c.start,gameEnd:null,indiaPhase:null,parliamentFinishedTurn:null,eventStack:null,chinaOffice:c.china,laws:Object.fromEntries(Object.keys(LAW_NAMES).map(k=>[k,c.laws.includes(k)])),elephant:{...b.elephant},regions:Object.fromEntries(IDS.map((id,i)=>[id,{control:b.company.includes(id)?'company':'indian',presidency:b.company.includes(id)?id:null,overlord:b.subjects[id]||null,empireCapital:Object.values(b.subjects).includes(id),strength:b.strength[i],unrest:0,lootAvailable:!b.company.includes(id),orders:Object.fromEntries(REGIONS[id].orders.map(([oid])=>[oid,!b.closed.includes(oid)]))}])),history:[]};
}
const assert=(v,msg)=>{if(!v)throw Error(msg)};
export function validate(s){
 assert(s&&s.schemaVersion===1&&Object.hasOwn(SCENARIOS,s.scenario),'This file is not a supported campaign.');
 assert(typeof s.campaignName==='string'&&s.campaignName.length<=80,'Campaign name must be at most 80 characters.');
 const c=SCENARIOS[s.scenario];assert(Number.isInteger(s.turn)&&s.turn>=c.start&&s.turn<=Math.max(c.end,s.scenario==='1710'?6:0),'Turn is outside this scenario’s range.'); // Accept legacy turn-6 1710 saves; do not alter their board or history.
 if(s.eventStack!==undefined&&s.eventStack!==null)validateEventStack(s.eventStack);
 if(s.indiaPhase!==undefined&&s.indiaPhase!==null){const p=s.indiaPhase;assert(p.turn===s.turn&&Number.isInteger(p.face)&&p.face>=0&&p.face<6&&['ships','events','complete'].includes(p.status),'Invalid Events in India phase.');assert(p.total===STORM_FACES[p.face].events&&Number.isInteger(p.completed)&&p.completed>=0&&p.completed<=p.total,'Invalid India event count.');assert(p.status!=='ships'||(p.completed===0&&STORM_FACES[p.face].seas.length>0),'Invalid ship-resolution state.');assert(p.status!=='complete'||p.completed===p.total,'Cannot complete an unfinished India phase.');}
 assert(s.parliamentFinishedTurn===undefined||s.parliamentFinishedTurn===null||(Number.isInteger(s.parliamentFinishedTurn)&&s.parliamentFinishedTurn>=1&&s.parliamentFinishedTurn<=s.turn),'Invalid Parliament completion marker.');
 if(s.gameEnd!==undefined&&s.gameEnd!==null){const e=s.gameEnd;assert(e&&Object.hasOwn(END_REASONS,e.reason)&&e.turn===s.turn&&typeof e.note==='string'&&e.note.length<=2000&&typeof e.at==='string'&&Number.isFinite(Date.parse(e.at)),'Invalid game ending.');assert(!s.indiaPhase||s.indiaPhase.status==='complete','Cannot end during Events in India.');assert(!s.eventStack?.pending,'Cannot end with an unresolved event.');assert(e.reason!=='completed'||canCompleteGame(s),'The final turn is not complete.');}
 assert(typeof s.chinaOffice==='boolean','Invalid China office state.');
 for(const k of Object.keys(LAW_NAMES))assert((['sepoyRecruitment','calicoActs','militaryOversight','deregulation'].includes(k)&&s.laws?.[k]===undefined)||typeof s.laws?.[k]==='boolean','Invalid law state.');
 assert(!s.laws.envoyChina||s.chinaOffice,'Envoy to China requires the China office.');
 assert(IDS.includes(s.elephant?.from)&&(s.elephant.to===null||REGIONS[s.elephant.from].neighbors.includes(s.elephant.to)||s.regions?.[s.elephant.from]?.overlord===s.elephant.to),'Elephant must be inside a region or face an adjacent region.');
 for(const id of IDS){
  const r=s.regions?.[id];assert(r&&['indian','company'].includes(r.control),'Invalid region control.');
  assert(Number.isInteger(r.strength)&&r.strength>=0&&r.strength<=100,'Tower levels must be 0–100.');
  assert(Number.isInteger(r.unrest)&&r.unrest>=0&&r.unrest<=10000,'Unrest must be 0–10000.');
  assert(typeof r.lootAvailable==='boolean','Invalid loot state.');
  if(r.control==='company')assert(PRESIDENCIES.includes(r.presidency)&&r.overlord===null&&r.strength===0,'Company regions require a Presidency, no overlord and zero tower levels.');
  else {assert(r.presidency===null&&r.unrest===0,'Indian regions have no Presidency or Company unrest.');if(r.overlord!==null){assert(IDS.includes(r.overlord)&&r.overlord!==id,'Invalid overlord.');const parent=s.regions[r.overlord];assert(parent.control==='indian'&&parent.overlord===null,'An empire capital must be an independent Indian region.');}}
  for(const [oid] of REGIONS[id].orders)assert(typeof r.orders?.[oid]==='boolean','Missing or invalid order state.');
 }
 assert(Array.isArray(s.history)&&s.history.length<=10000,'Chronicle must contain at most 10,000 entries.');
 for(const h of s.history){assert(h&&typeof h.title==='string'&&h.title.length<1000&&['correction','setup','deploy','action'].includes(h.kind)&&Number.isInteger(h.turn),'Invalid history entry.');if(h.kind==='deploy')assert(PRESIDENCIES.includes(h.army)&&['success','failure','catastrophe'].includes(h.outcome)&&typeof h.report==='string'&&h.report.length<12000,'Invalid deployment record.');}
 return s;
}
export function correctRegion(s,id,patch){
 assert(IDS.includes(id),'Unknown region.');let n=clone(s);n.regions[id]={...n.regions[id],...patch};const r=n.regions[id];
 if(r.control==='company'){r.overlord=null;r.strength=0;}else{r.presidency=null;r.unrest=0;}
 if(r.control==='company'||r.overlord)for(const child of IDS)if(n.regions[child].overlord===id)n.regions[child].overlord=null;
 return validate(n);
}
export function controlLabel(s,id){const r=s.regions[id];return r.control==='company'?`Company · ${REGIONS[r.presidency].name}`:r.overlord?`${REGIONS[r.overlord].name} subject`:(r.empireCapital||IDS.some(k=>s.regions[k].overlord===id))?'Empire capital':'Sovereign';}
export function summary(s){const owned=IDS.filter(id=>s.regions[id].control==='company');return {company:owned.length,unrest:owned.reduce((a,id)=>a+s.regions[id].unrest,0),opium:owned.reduce((a,id)=>a+REGIONS[id].opium,0),closed:IDS.reduce((a,id)=>a+Object.values(s.regions[id].orders).filter(v=>!v).length,0)};}
export function record(s,next,title){validate(next);next.history=[...s.history,{kind:'correction',title,turn:next.turn,at:new Date().toISOString()}];return next;}
export function encode(state,undo=[],progress=null,undoProgress=[]){
 const start=Math.max(0,undo.length-20),kept=undo.slice(start),keptProgress=kept.map((s,i)=>validateActionProgress(s,undoProgress[start+i]||null));
 const base={format:'john-company-india',version:1,state,undo:kept,progress:validateActionProgress(state,progress),undoProgress:keptProgress};
 let text=JSON.stringify(base,null,2);
 while(new TextEncoder().encode(text).length>=6000000&&kept.length){kept.shift();keptProgress.shift();text=JSON.stringify(base,null,2);}
 assert(new TextEncoder().encode(text).length<6000000,'Campaign is too large to save. Export a readable chronicle before starting another campaign.');return text;
}
export function decode(text){assert(new TextEncoder().encode(text).length<6000000,'Save file is too large.');const v=JSON.parse(text);assert(v.format==='john-company-india'&&v.version===1,'Unrecognised save format.');validate(v.state);assert(Array.isArray(v.undo)&&v.undo.length<=20,'Invalid undo history.');v.undo.forEach(validate);const up=v.undoProgress??v.undo.map(()=>null);assert(Array.isArray(up)&&up.length===v.undo.length,'Invalid undo resolution history.');up.forEach((p,i)=>validateActionProgress(v.undo[i],p));return {state:clone(v.state),undo:clone(v.undo),progress:clone(validateActionProgress(v.state,v.progress)),undoProgress:clone(up)};}

export function legalTargets(s,army){
 return IDS.filter(id=>!deploymentBlockReason(s,army,id));
}
export function deploymentBlockReason(s,army,id){
 if(s.gameEnd)return 'The game has ended.';
 if(phaseFor(s))return 'Company Operation has ended for this turn.';
 if(!PRESIDENCIES.includes(army)||!IDS.includes(id))return 'Choose a valid army and region.';
 if(s.history.some(h=>h.kind==='deploy'&&h.turn===s.turn&&h.army===army&&h.outcome==='catastrophe'))return 'This Commander suffered a catastrophic failure and cannot act again this turn.';
 if(PRESIDENCIES.includes(id)&&id!==army)return `An army cannot target another Presidency’s home region (${REGIONS[id].name}).`;
 if(s.regions[id].control==='company'&&s.regions[id].presidency!==army)return `This Company region is assigned to ${REGIONS[s.regions[id].presidency].name}; only that Presidency’s army may deploy here.`;
 const bases=IDS.filter(k=>s.regions[k].control==='company'&&s.regions[k].presidency===army);
 if(id!==army&&!bases.includes(id)&&!bases.some(b=>REGIONS[b].neighbors.includes(id)))return `No Company region assigned to ${REGIONS[army].name} borders this target. This army can always start in its own home region.`;
 if(s.regions[id].control==='company'&&s.regions[id].unrest===0&&Object.values(s.regions[id].orders).every(Boolean))return 'No effect: this Company region has no unrest and all its orders are open.';
 return '';
}
export function deploymentStrength(s,d){
 const r=s.regions[d.target],capital=r.overlord||d.target;
 const defenders=r.control==='company'?[{id:d.target,strength:0}]:IDS.filter(id=>id===capital||s.regions[id].overlord===capital).map(id=>({id,strength:s.regions[id].strength}));
 const defense=defenders.reduce((n,r)=>n+r.strength,0);
 const allies=d.alliances.map(id=>ALLIANCES.find(a=>a.id===id));
 const strength=d.officers+d.regiments+allies.reduce((n,a)=>n+a.strength,0);
 return {defenders,allies,strength,defense,dice:strength-defense};
}
export function deploymentCheck(s,d){
 assert(legalTargets(s,d.army).includes(d.target),'Choose a legal target. This army may not act again after catastrophe this turn.');
 for(const k of ['officers','regiments'])assert(Number.isInteger(d[k])&&d[k]>=0&&d[k]<=100,'Enter whole troop counts between 0 and 100.');
 assert(Array.isArray(d.alliances)&&new Set(d.alliances).size===d.alliances.length&&d.alliances.every(id=>ALLIANCES.some(a=>a.id===id&&a.army===d.army)),'Select only alliances belonging to this army.');
 const {strength,defense,dice}=deploymentStrength(s,d);
 assert(strength>defense,'Commit enough available forces to roll at least one die after defence.');
 return {strength,defense,dice};
}
export function resolveDeployment(s,d){
 const check=deploymentCheck(s,d);
 assert(['success','failure','catastrophe'].includes(d.outcome),'Report the final check outcome.');
 assert(Number.isInteger(d.losses)&&d.losses>=0&&d.losses<=d.officers,'Officer losses must be between zero and officers committed.');
 const n=clone(s),r=n.regions[d.target],name=REGIONS[d.target].name,instructions=[],elephantMoves=[];
 instructions.push(`Exhaust ${d.regiments} regiments, ${d.officers} officers and ${d.alliances.length} local alliances. Return ${d.losses} lost officers to their players’ supplies. Never remove regiments for this loss check.`);
 if(d.outcome==='catastrophe')instructions.push('First return half the Commander’s trophies, rounded up, to supply. Return the Commander to their player’s supply. Flip the office card into Vacant Offices and return its fatigue. This office takes no further actions this turn.');
 if(d.outcome==='success'){
  const loot=Math.max(r.strength*4+(r.control!=='company'&&r.lootAvailable?REGIONS[d.target].lootBonus:0),d.officers-d.losses+1);
  instructions.push(s.laws.treasureReform?`Add £${loot} loot to the Company Balance (Treasure Reform).`:`Distribute £${loot} loot: Commander £1 plus £1 per own surviving officer, then clockwise £1 per surviving officer. Pay the bank £1 per regiment and alliance. Repeat while cash remains; stop when it runs out.`);
  instructions.push(`Take ${r.strength} trophies; remove the target’s tower and dome. Open all its orders and remove all its unrest.`);
  const subjects=IDS.filter(id=>n.regions[id].overlord===d.target);
  if(subjects.length){instructions.push(`Remove matching flags: ${subjects.map(id=>REGIONS[id].name).join(', ')} become sovereign.`);subjects.forEach(id=>n.regions[id].overlord=null);}
  if(r.overlord)instructions.push(`Remove ${name}’s empire flag.`);
  if(r.control!=='company'){
   instructions.push(`Move ${name}’s loot/control token, region side faceup, above the ${REGIONS[d.army].name} President.${s.laws.governorGeneral?' Governor General is active: do not create a Governor office.':' Place its Governor overlay and put its Governor card in Vacant Offices.'}`);
   r.control='company';r.presidency=d.army;r.lootAvailable=false;
  }
  r.empireCapital=false;r.overlord=null;r.strength=0;r.unrest=0;Object.keys(r.orders).forEach(id=>r.orders[id]=true);
  if(n.elephant.from===d.target&&n.elephant.to){const before=clone(n.elephant);n.elephant.to=null;const instruction=`Move the Elephant wholly inside ${name}.`;elephantMoves.push({before,after:clone(n.elephant),instructionIndex:instructions.length,instruction});instructions.push(instruction);}
 }else instructions.push('Region control, orders, unrest and Elephant position stay as they were.');
 const title=`Army of ${REGIONS[d.army].name} → ${name}: ${d.outcome==='catastrophe'?'catastrophic failure':d.outcome}; ${d.losses} officer losses.`;
 const report=`${check.dice} dice after ${check.defense} defence. Committed: ${d.regiments} regiments, ${d.officers} officers; alliances: ${d.alliances.map(id=>ALLIANCES.find(a=>a.id===id).name).join(', ')||'none'}.\n\n${instructions.join('\n\n')}`;
 n.history.push({kind:'deploy',army:d.army,outcome:d.outcome,title,report,elephantMoves,turn:s.turn,at:new Date().toISOString()});
 return {state:validate(n),title,report,instructions,check,elephantMoves};
}
