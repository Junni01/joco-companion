import {APPROVED_DIALOGUE} from './narrative-approved-content.js';
import {POLICY,narrativeRandom} from './narrative-policy.js';

export const approvedById=new Map(APPROVED_DIALOGUE.map(e=>[e.id,e]));
function boardAt(state,entry,region,after=false){
 const own=entry.incident.changes.find(c=>c.region===region);if(own)return after?own.after:own.before;
 const order=state.history.findIndex(h=>h.incident?.id===entry.incident.id);
 for(const h of state.history.slice(order+1)){const change=h.incident?.changes.find(c=>c.region===region);if(change)return change.before;}
 return state.regions[region];
}
const high=(c,key)=>c.traits[key]>=60;
const bitter=c=>high(c,'vindictiveness')||(c.relations['institution:company']?.hostility||0)>=20;
const dry=c=>c.voice.humour>=1;
const pragmatic=c=>c.voice.restraint>=2;
const cautious=c=>high(c,'caution');
const proud=c=>high(c,'pride');
const career=c=>high(c,'ambition');
const professional=c=>c.traits.caution>=50&&c.voice.restraint>=2;

// Facts come from resolver-owned records, never English instructions or inferred meetings.
export function approvedContext(state,entry,region,perspective){
 const facts=entry.incident.facts.filter(f=>f.region===region),change=entry.incident.changes.find(c=>c.region===region);
 const has=(type,p=()=>true)=>facts.some(f=>f.type===type&&p(f));
 const tax=has('tax')||has('unrest',f=>f.reason==='tax');
 const unrest=has('unrest',f=>f.amount>0);
 const admin=has('unrest',f=>(f.cause==='unrest'&&f.reason==='failure')||(f.cause==='govern'&&['failure','catastrophe'].includes(entry.incident.input.outcome)));
 const rebellion=facts.find(f=>f.type==='battle'&&(f.kind==='rebellion'||(f.kind==='company-defence'&&(f.key==='leader'||f.key==='crisis'||f.stage==='secondary'))));
 const rebellionWon=!!rebellion&&(rebellion.kind==='rebellion'?rebellion.won:!rebellion.won);
 const independent=has('independence')||(has('company-loss')&&change?.after.control==='indian'&&!change.after.overlord);
 const conquest=has('company-conquest');
 const failure=has('deployment',f=>f.outcome==='failure'),catastrophe=has('deployment',f=>f.outcome==='catastrophe');
 const companyBefore=boardAt(state,entry,region).control==='company';
 return {region,perspective,conquest,tax,unrest,admin,failure,catastrophe,companyBefore,
  armedConquest:conquest&&has('deployment',f=>f.outcome==='success'),
  failedAttack:(failure||catastrophe)&&has('deployment')&&!companyBefore,
  rebellionWon:rebellionWon&&independent,rebellionFailed:!!rebellion&&!rebellionWon,
  companyRebellionLoss:rebellionWon&&independent&&companyBefore,
  companyRebellionSuppressed:!!rebellion&&rebellion.kind==='company-defence'&&rebellion.won,
  evidence:entry.incident.facts.flatMap((f,i)=>f.region===region?[{incidentId:entry.incident.id,factKey:'fact-'+i}]:[])};
}

// Current facts first. The voice functions are gates, not excuses to invent prerequisites.
const rules={
 'CH-C01':{role:'chronicler',event:f=>f.conquest},
 'CH-C03':{role:'chronicler',event:f=>f.armedConquest},
 'CH-C04':{role:'chronicler',event:f=>f.conquest},
 'RC-P01':{role:'ruler',event:f=>f.conquest,voice:proud,trait:'pride'},
 'RC-D01':{role:'ruler',event:f=>f.conquest,voice:cautious,trait:'caution'},
 'RC-D02':{role:'ruler',event:f=>f.conquest,voice:c=>cautious(c)||pragmatic(c),trait:'caution'},
 'RC-V01':{role:'ruler',event:f=>f.conquest,voice:c=>high(c,'vindictiveness'),trait:'vindictiveness',salient:true},
 'RC-V02':{role:'ruler',event:f=>f.conquest,voice:bitter,trait:'vindictiveness'},
 'AC-C01':{role:'army',event:f=>f.armedConquest,voice:career,trait:'ambition'},
 'AC-C02':{role:'army',event:f=>f.armedConquest,voice:c=>c.voice.formality>=2&&dry(c)},
 'AC-C03':{role:'army',event:f=>f.armedConquest,voice:c=>proud(c)&&!cautious(c),trait:'pride'},
 'AC-C04':{role:'army',event:f=>f.armedConquest,voice:professional,trait:'caution'},
 'CB-C-TAX-01':{role:'ruler',event:f=>f.tax,voice:bitter,memory:'company-conquest',trait:'vindictiveness'},
 'CB-C-TAX-02':{role:'ruler',event:f=>f.tax,voice:c=>proud(c)&&dry(c),memory:'company-conquest',trait:'pride'},
 'CB-C-TAX-03':{role:'ruler',event:f=>f.tax,voice:cautious,memory:'company-conquest',trait:'caution'},
 'CB-T02-03':{role:'ruler',event:f=>f.tax,voice:bitter,memory:'company-conquest',trait:'vindictiveness'},
 'CB-C-FAIL-02':{role:'ruler',event:f=>f.failedAttack,voice:c=>high(c,'vindictiveness'),memory:'company-conquest',trait:'vindictiveness'},
 'CB-C-REB-03':{role:'ruler',event:f=>f.rebellionWon,voice:cautious,memory:'company-conquest',trait:'caution'},
 'AD-T02-01':{role:'secretary',event:f=>f.tax,voice:c=>proud(c)&&!cautious(c),trait:'pride'},
 'RU-T02-01':{role:'ruler',event:f=>f.tax,voice:c=>dry(c)&&pragmatic(c)},
 'RU-T02-02':{role:'ruler',event:f=>f.tax,voice:c=>proud(c)||bitter(c),memory:'company-conquest',trait:'pride'},
 'CH-T02-03':{role:'chronicler',event:f=>f.admin},
 'AD-T02-03':{role:'secretary',event:f=>f.admin,voice:c=>c.voice.formality>=2&&proud(c)},
 'CH-R03-01':{role:'chronicler',event:f=>f.unrest&&f.companyBefore},
 'RU-R03-01':{role:'ruler',event:f=>f.unrest&&f.companyBefore,voice:c=>high(c,'ambition'),trait:'ambition'},
 'RU-R03-02':{role:'ruler',event:f=>f.unrest,voice:c=>cautious(c)||pragmatic(c),trait:'caution'},
 'CH-R03-02':{role:'chronicler',event:f=>f.companyRebellionLoss},
 'RU-R03-06':{role:'ruler',event:f=>f.rebellionWon,voice:c=>cautious(c)||pragmatic(c),trait:'caution'},
 'CH-R03-03':{role:'chronicler',event:f=>f.rebellionFailed,grievance:true},
 'AD-R03-05':{role:'army',event:f=>f.companyRebellionSuppressed,voice:professional,trait:'caution'},
 'CB-R03-01':{role:'ruler',event:f=>f.companyRebellionLoss,voice:c=>dry(c)||bitter(c),memory:'company-conquest'},
 'CH-M04-01':{role:'chronicler',event:f=>f.failure},
 'CH-M04-02':{role:'chronicler',event:f=>f.catastrophe},
 'AD-M04-01':{role:'army',event:f=>f.failure,voice:c=>proud(c)&&!cautious(c),trait:'pride'},
 'AD-M04-02':{role:'army',event:f=>f.failure,voice:c=>c.voice.formality>=2&&dry(c)},
 'AD-M04-03':{role:'army',event:f=>f.failure,voice:professional,trait:'caution'},
 'AD-M04-04':{role:'army',event:f=>f.catastrophe,voice:career,trait:'ambition'},
 'AD-M04-05':{role:'army',event:f=>f.catastrophe,voice:c=>proud(c)&&!cautious(c),trait:'pride'},
 'AD-M04-07':{role:'army',event:f=>f.armedConquest,voice:proud,trait:'pride'},
 'AD-M04-08':{role:'army',event:f=>f.armedConquest,voice:career,trait:'ambition'},
 'RU-M04-03':{role:'ruler',event:f=>f.catastrophe&&f.failedAttack,voice:proud,trait:'pride'},
 'RU-M04-05':{role:'ruler',event:f=>f.armedConquest,voice:proud,trait:'pride'}
};

function priorConquest(state,entry,c,region){
 const order=state.history.findIndex(h=>h.incident?.id===entry.incident.id);
 return Object.values(state.narrative.memories).filter(m=>m.ownerId===c.id&&m.region===region&&m.category==='company-conquest'&&m.origin==='direct'&&state.history.findIndex(h=>h.incident?.id===m.createdIncident)<order)
  .sort((a,b)=>b.emotionalImportance-a.emotionalImportance);
}
function factualEligibility(state,entry,c,role,f,e,r,memoryId=null,historical=false){
 if(r.role!==role||!r.event(f)||f.perspective==='sovereign')return null;
 if(role!=='chronicler'){
  if(!historical&&c.condition!=='alive')return null;
  if(role==='ruler'&&state.narrative.seats[f.region]!==c.id)return null;
  if(['army','secretary'].includes(role)){
   const facts=entry.incident.facts.filter(x=>x.region===f.region);
   const supported=facts.some(x=>(role==='army'&&(x.army===c.region||x.presidency===c.region))||(role==='secretary'&&(c.id==='secretary-general'?entry.incident.laws.before.governorGeneral:boardAt(state,entry,f.region).presidency===c.region)));
   if(!supported)return null;
  }
 }
 if(r.salient&&!Object.values(state.narrative.memories).some(m=>m.ownerId===c.id&&m.category==='company-conquest'&&m.createdIncident===entry.incident.id&&m.historicalSignificance>=75))return null;
 if(r.grievance&&!Object.values(state.narrative.memories).some(m=>m.region===f.region&&state.history.findIndex(h=>h.incident?.id===m.createdIncident)<state.history.findIndex(h=>h.incident?.id===entry.incident.id)&&['company-conquest','subordination','tax-repeat'].includes(m.category)))return null;
 const memories=r.memory?priorConquest(state,entry,c,f.region):[];
 const memory=memoryId?memories.find(m=>m.id===memoryId):memories[0];
 if(r.memory&&!memory)return null;
 return {entry:e,memory};
}
export function approvedCandidates(state,entry,c,ctx,role){
 const f=approvedContext(state,entry,ctx.region,ctx.perspective);
 return APPROVED_DIALOGUE.flatMap(e=>{
  const r=rules[e.id],candidate=factualEligibility(state,entry,c,role,f,e,r);
  if(!candidate||(r.voice&&!r.voice(c)))return [];
  if(!c&&state.history.filter(h=>h.incident?.facts.some(f=>f.region===ctx.region)).slice(-POLICY.templateCooldown-1,-1).some(h=>h.narrative?.lines.some(l=>l.templateId===e.id)))return [];
  if(c&&c.pacing.templates.some(p=>p.id===e.id&&c.pacing.relevant-p.at<POLICY.templateCooldown))return [];
  if(candidate.memory){const pacing=c.pacing,key=candidate.memory.id,last=pacing.callbacks[key];
   if(!ctx.major&&(pacing.relevant-pacing.lastCallbackAt<POLICY.globalCallbackCooldown||(last&&pacing.relevant-last.at<last.cooldown)))return [];
  }
  return [{...candidate,evidence:f.evidence,weight:(r.memory?100:0)+(r.trait?c.traits[r.trait]:0)+(candidate.memory?Math.round(candidate.memory.emotionalImportance/10):0)}];
 });
}
export function selectApprovedDialogue(state,entry,c,ctx,role){
 const candidates=approvedCandidates(state,entry,c,ctx,role).sort((a,b)=>b.weight-a.weight);
 if(!candidates.length)return null;
 const best=candidates.filter(x=>x.weight===candidates[0].weight),chosen=best[narrativeRandom(state.narrative,best.length)],e=chosen.entry;
 return {templateId:e.id,text:e.text,emotion:e.emotion,family:e.id,evidence:chosen.evidence,callbackMemoryIds:chosen.memory?[chosen.memory.id]:[],callbackStatementIds:[]};
}
// Validate selected words and factual support on import. Do not reselect using later traits.
export function validateApprovedLine(state,entry,line){
 const e=approvedById.get(line.templateId);if(!e)return;
 const role=line.speakerId==='chronicler'?'chronicler':state.narrative.characters[line.speakerId]?.role;
 const regions=[...new Set(line.evidence.map(r=>entry.incident.facts[Number(r.factKey.slice(5))]?.region).filter(Boolean))];
 if(line.text!==e.text||line.emotion!==e.emotion||regions.length!==1)throw Error('Invalid narrative: approved dialogue wording or scope');
 const c=state.narrative.characters[line.speakerId],f=approvedContext(state,entry,regions[0]);
 if(JSON.stringify(line.evidence)!==JSON.stringify(f.evidence))throw Error('Invalid narrative: approved dialogue current evidence');
 const valid=factualEligibility(state,entry,c,role,f,e,rules[e.id],line.callbackMemoryIds[0],true);
 if(!valid||JSON.stringify(line.callbackMemoryIds)!==JSON.stringify(valid.memory?[valid.memory.id]:[]))throw Error('Invalid narrative: approved dialogue prerequisites');
}
