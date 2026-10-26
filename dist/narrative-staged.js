import {TILES} from './event-stack.js';
import {STAGED_DIALOGUE} from './narrative-staged-content.js';
import {REGIONS} from './model.js';
import {foreignTargets} from './invasion-targets.js';
import {STORM_FACES,STORM_RESULTS} from './india-phase.js';
const copy=v=>JSON.parse(JSON.stringify(v)),equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const hash=s=>[...s].reduce((h,c)=>(Math.imul(h,31)+c.charCodeAt(0))>>>0,17);
export const stagedEnabled=s=>s.narrative?.enabled&&s.narrative.intensity!=='quiet';
const enabled=stagedEnabled;
const weatherFamily=face=>['east','west','south','all','calm','calm'][face];
export function invasionContext(state,input,region=null){
 const type=input.type==='france'?'france':'foreign',targets=input.targetsOrder||foreignTargets({...input,storm:input.storm??STORM_RESULTS[input.stormFace]});
 const context={type,targets:copy(targets),companyTargets:targets.filter(id=>state.regions[id]?.control==='company'),governorGeneral:state.laws.governorGeneral,courts:Object.fromEntries(targets.filter(id=>state.narrative?.characters[state.narrative.seats[id]]?.condition==='alive').map(id=>[id,state.narrative.seats[id]]))};
 if(region){context.region=region;context.raw=input.rolls?.[region];}return context;
}
export function stagedCandidates(kind,c){
 const family=kind==='weather'?weatherFamily(c.face):kind==='tension'?c.count:kind==='force'?(c.raw<=2?'low':c.raw<=4?'medium':'high'):!c.targets?.length?'none':c.type+'-'+(c.targets.length===1?'single':'multiple');
 if(kind==='weather'&&!Number.isInteger(c.face)||kind==='force'&&(!Number.isInteger(c.raw)||c.raw<1||c.raw>6||!c.targets.includes(c.region))||kind==='announcement'&&!c.targets.length&&c.type!=='france')return [];
 return STAGED_DIALOGUE.filter(e=>e.kind===kind&&e.family===family&&!(e.sourceId==='F-09'&&(c.governorGeneral||c.companyTargets.length!==c.targets.length))&&!(['F-03','H-03'].includes(e.sourceId)&&!c.courts[c.region||c.targets[0]]));
}
function rendered(e,c){const names=(c.targets||[]).map(id=>REGIONS[id].name),region=c.region||c.targets?.[0];return e.lines.map(l=>({...l,text:l.text.replaceAll('{region}',region?REGIONS[region].name:'').replaceAll('{regions}',names.length<2?(names[0]||''):names.slice(0,-1).join(', ')+' and '+names.at(-1))}));}
export function stagedHistory(state){return state.history.flatMap(h=>h.narrative?.stagedScenes||[]);}
export function selectStaged(state,kind,context,key,prior=[]){
 if(!enabled(state))return null;
 const recent=[...stagedHistory(state),...prior],last=recent.at(-1),same=recent.filter(s=>s.kind===kind&&stagedCandidates(kind,context).some(e=>e.id===s.templateId)).at(-1),choices=stagedCandidates(kind,context);
 const rank=e=>(e.id===same?.templateId?10000:0)+(e.theme===last?.theme?1000:0)+(last&&(e.lines.length===1)===(last.lines.length===1)?100:0);
 choices.sort((a,b)=>rank(a)-rank(b)||a.id.localeCompare(b.id));
 const best=choices.filter(e=>rank(e)===rank(choices[0])),e=best[hash(state.narrative.rng+':'+state.turn+':'+state.incidentSequence+':'+key+':'+recent.length)%best.length];return e?{version:1,key,kind,templateId:e.id,context:copy(context),theme:e.theme,lines:rendered(e,context)}:null;
}
export function validateStaged(scene){
 try{const keys=scene?.kind==='weather'?['face']:scene?.kind==='tension'?['count']:scene?.kind==='force'?['type','targets','companyTargets','governorGeneral','courts','region','raw']:['type','targets','companyTargets','governorGeneral','courts'];if(!scene?.context||!equal(Object.keys(scene.context).sort(),keys.sort()))throw Error();
 const e=STAGED_DIALOGUE.find(e=>e.id===scene?.templateId);if(!e||scene.version!==1||e.kind!==scene.kind||scene.theme!==e.theme||!stagedCandidates(scene.kind,scene.context).some(c=>c.id===e.id)||!equal(scene.lines,rendered(e,scene.context)))throw Error();}catch{throw Error('Invalid saved 09E dialogue.');}
}
export function validatePendingScenes(state,input,scenes=[]){
 if(scenes.length&&!(input.type==='france'&&input.outcome==='failed'||input.type==='event'&&(input.stackTile?TILES[input.stackTile]?.event:input.event)==='foreign'))throw Error('Invalid 09E action source.');
 if(!Array.isArray(scenes)||scenes.length>4)throw Error('Invalid 09E progress scenes.');const keys=new Set();for(const scene of scenes){validateStaged(scene);if(keys.has(scene.key))throw Error('Duplicate 09E scene.');keys.add(scene.key);const expected=invasionContext(state,input,scene.kind==='force'?scene.context.region:null);if(!['announcement','force'].includes(scene.kind)||scene.key!==(scene.kind==='force'?'force:'+scene.context.region:'announcement')||!equal(expected,scene.context))throw Error('Invalid 09E action evidence.');}
}
export function phaseScene(state,kind){if(!enabled(state))return null;const h=state.history.findLast(h=>h.actionType==='phase-start'&&h.turn===state.turn&&h.input?.face===state.indiaPhase?.face);return h?.narrative?.stagedScenes?.find(s=>s.kind===kind)||null;}
export function ensurePhaseScene(state,kind){
 const old=phaseScene(state,kind);if(old)return state;
 const p=state.indiaPhase,h=state.history.findLast(h=>h.actionType==='phase-start'&&h.turn===state.turn&&h.input?.face===p?.face);if(!h?.narrative||!h.incident||!enabled(state))return state;
 if(kind==='tension'&&(p.status==='ships'||!state.narrative.weather?.weatherPresented))return state;
 const context=kind==='weather'?{face:p.face}:{count:p.total},scene=selectStaged(state,kind,context,kind);if(!scene)return state;
 return {...state,history:state.history.map(entry=>entry===h?{...h,narrative:{...h.narrative,stagedScenes:[...(h.narrative.stagedScenes||[]),scene]}}:entry)};
}
export function commitStaged(before,state,entry,result){if(result.stagedScenes?.length){validatePendingScenes(before,entry.incident.input,result.stagedScenes);entry.narrative.stagedScenes=copy(result.stagedScenes);}}
export function validateStagedHistory(state){
 for(const h of state.history){const rows=h.narrative?.stagedScenes||[];if(!Array.isArray(rows)||rows.length>4||rows.some(s=>!s||typeof s.key!=='string')||new Set(rows.map(s=>s.key)).size!==rows.length)throw Error('Duplicate or invalid 09E history.');for(const scene of rows){validateStaged(scene);const d=h.incident.input,c=scene.context;if(scene.key!==(scene.kind==='force'?'force:'+c.region:scene.kind==='announcement'?'announcement':scene.kind))throw Error('Invalid 09E scene key.');if(scene.kind==='weather'&&(d.type!=='phase-start'||d.face!==c.face)||scene.kind==='tension'&&(d.type!=='phase-start'||STORM_FACES[d.face].events!==c.count))throw Error('Invalid 09E phase evidence.');if(['announcement','force'].includes(scene.kind)){const targets=d.targetsOrder||foreignTargets({...d,storm:d.storm??STORM_RESULTS[d.stormFace]});const company=targets.filter(id=>h.incident.facts.some(f=>f.type==='battle'&&f.kind==='company-defence'&&f.key==='foreign:'+id));if(!equal(company,c.companyTargets)||Object.entries(c.courts).some(([region,id])=>!targets.includes(region)||state.narrative.characters[id]?.region!==region))throw Error('Invalid 09E political evidence.');if(!(d.type==='event'&&d.event==='foreign'||d.type==='france'&&d.outcome==='failed')||!equal(targets,c.targets)||c.governorGeneral!==h.incident.laws.before.governorGeneral||scene.kind==='force'&&d.rolls?.[c.region]!==c.raw)throw Error('Invalid 09E invasion evidence.');}}}
}
