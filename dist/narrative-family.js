// Optional typed kinship/claims. No generation, succession choice or gameplay effects.
import {NAME_POOLS} from './narrative-content.js';
import {SCENARIOS} from './scenarios.js';
export const FAMILY_POLICY=Object.freeze({adultAge:18,parentGap:16,adoptionGap:12,maxLinks:4000,maxClaims:4000});
export const CLAIM_BASES=['designation','parentage','adoption','marriage-derived','previous-rulership','witnessed-authority'];
export const CLAIM_STATUSES=['asserted','dormant','realised','relinquished'];
const object=v=>v&&typeof v==='object'&&!Array.isArray(v),fail=m=>{throw Error('Invalid family/claim history: '+m);};
const bounded=(v,max)=>Array.isArray(v)&&v.length<=max;
const named=v=>typeof v==='string'&&v.length>0&&v.length<=160;
const text=v=>typeof v==='string'&&v.trim().length>0&&v.length<=1000;
export function originOrder(state,o){
 if(!object(o)||!Number.isInteger(o.turn)||o.turn<1||!state.debugMode&&o.turn>state.turn||!text(o.reason)||!object(o.source))fail('origin');
 const s=o.source;if(s.setup===true&&Object.keys(s).length===1){if(o.turn!==SCENARIOS[state.scenario].start)fail('setup turn');return -1;}
 if(Object.keys(s).length!==2||!named(s.incidentId)||!named(s.actionType))fail('origin source');
 const index=state.history.findIndex(h=>h.incident?.id===s.incidentId&&(h.actionType||h.incident.type)===s.actionType&&h.turn===o.turn);if(index<0)fail('unknown origin incident/action/turn');return index;
}
const endOrder=(s,l)=>l.end?originOrder(s,l.end):Infinity;
export function familyOrigins(state){
 const n=state.narrative,found=[];const add=(label,o)=>{if(o)found.push({label,origin:o});};
 for(const l of n.familyLinks||[]){add('Family link '+l.id,l.origin);add('Family link end '+l.id,l.end);}
 for(const d of Object.values(n.dynasties||{}))add('Dynasty '+d.id,d.origin);
 for(const c of Object.values(n.characters)){add('Introduction of '+c.name,c.introduction?.origin);add('Authored identity of '+c.name,c.gender?.origin);for(const a of c.dynastyAffiliations||[]){add('House affiliation of '+c.name,a.origin);add('House affiliation end of '+c.name,a.end);}}
 for(const c of n.claimsV2||[]){add('Dynastic claim '+c.id,c.origin);for(const h of c.statusHistory||[])add('Dynastic claim status '+c.id,h.origin);}
 return found;
}
export function validateFamilyState(state){
 const n=state.narrative,people=n.characters,links=n.familyLinks||[],claims=n.claimsV2||[],houses=n.dynasties||{};
 if(n.familyLinks!==undefined&&!bounded(n.familyLinks,FAMILY_POLICY.maxLinks)||n.claimsV2!==undefined&&!bounded(n.claimsV2,FAMILY_POLICY.maxClaims)||n.dynasties!==undefined&&!object(n.dynasties)||!object(houses)||Object.keys(houses).length>1000)fail('bounded collections');
 const unique=(rows,kind)=>{const ids=new Set();for(const row of rows){if(!object(row)||!named(row.id)||ids.has(row.id))fail('duplicate '+kind+' identity');ids.add(row.id);}};
 unique(links,'family link');unique(claims,'claim');
 for(const [id,d]of Object.entries(houses)){if(!object(d)||d.id!==id||!named(d.name))fail('dynasty identity');originOrder(state,d.origin);}
 const original=new Set([...Object.keys(NAME_POOLS).flatMap(r=>['ruler-'+r,'heir-'+r]),...['bombay','madras','bengal'].flatMap(r=>['secretary-'+r,'army-'+r]),'secretary-general']);
 const referenced=new Set([...links.flatMap(l=>[l.fromId,l.toId]),...claims.map(c=>c.claimantId)]);
 for(const c of Object.values(people)){
  if(c.family.some(f=>f.id===c.id))fail('self family relation');
  if(c.dynastyAffiliations!==undefined&&!Array.isArray(c.dynastyAffiliations))fail('affiliations');
  if(referenced.has(c.id)&&!original.has(c.id)&&!c.introduction)fail('new family member needs recorded introduction');
  if(c.introduction!==undefined){if(!object(c.introduction)||!['birth','introduced'].includes(c.introduction.kind))fail('introduction');originOrder(state,c.introduction.origin);if(c.introduction.kind==='birth'){if(c.introduction.age!==0)fail('birth age');const death=c.condition==='dead'?c.conditionHistory?.find(t=>t.to==='dead'):null;if(c.condition==='dead'&&!death)fail('birth chronology needs recorded death');if(!state.debugMode&&c.age!==3*((death?.turn??n.lastAgedTurn)-c.introduction.origin.turn))fail('birth/age chronology');}}
  if(c.gender!==undefined){if(!object(c.gender)||!['woman','man','unspecified'].includes(c.gender.value))fail('authored gender');originOrder(state,c.gender.origin);}
  if(c.dynastyId!==undefined&&!Object.hasOwn(houses,c.dynastyId))fail('natal dynasty reference');
  const affiliations=c.dynastyAffiliations||[];if(!bounded(affiliations,100))fail('affiliations');let natal=0;const seen=new Set();
  for(const a of affiliations){if(!object(a)||!Object.hasOwn(houses,a.dynastyId)||!['natal','marital','adoptive','political'].includes(a.kind))fail('house affiliation');const order=originOrder(state,a.origin);if(originOrder(state,houses[a.dynastyId].origin)>order)fail('future house affiliation');if(a.end&&originOrder(state,a.end)<order)fail('affiliation order');const key=a.dynastyId+':'+a.kind+':'+order;if(seen.has(key))fail('duplicate affiliation');seen.add(key);if(a.kind==='natal'){natal++;if(a.dynastyId!==c.dynastyId||a.end)fail('natal house cannot be erased');}}
  if(natal>1||c.dynastyId!==undefined&&natal!==1)fail('explicit natal affiliation');
 }
 const graph=Object.create(null),guardians=Object.create(null),pairs=new Set(),parents=Object.create(null),adopters=Object.create(null);
 for(const l of links){
  if(!['parent','adoptive-parent','spouse','guardian','sibling'].includes(l.type)||!Object.hasOwn(people,l.fromId)||!Object.hasOwn(people,l.toId)||l.fromId===l.toId)fail('relationship endpoints/type');
  const start=originOrder(state,l.origin);for(const id of [l.fromId,l.toId])if(people[id].introduction?.kind==='birth'&&originOrder(state,people[id].introduction.origin)>start)fail('relationship predates recorded birth');const end=endOrder(state,l);if(end<start)fail('relationship order');
  const pair=l.type+':'+(['spouse','sibling'].includes(l.type)?[l.fromId,l.toId].sort().join(':'):l.fromId+':'+l.toId);
  if(l.type!=='spouse'&&pairs.has(pair))fail('duplicate relationship');pairs.add(pair);
  if(l.type==='sibling'&&l.end)fail('sibling history cannot be erased');
  if(['parent','adoptive-parent','spouse','guardian'].includes(l.type)){
   const ages=l.ages;if(!object(ages)||!Number.isInteger(ages.from)||!Number.isInteger(ages.to)||ages.from<0||ages.to<0||ages.from>people[l.fromId].age||ages.to>people[l.toId].age)fail('recorded relationship ages');
   if(l.type==='parent'&&ages.from-ages.to<FAMILY_POLICY.parentGap||l.type==='adoptive-parent'&&(ages.from<FAMILY_POLICY.adultAge||ages.from-ages.to<FAMILY_POLICY.adoptionGap)||l.type==='guardian'&&(ages.from<FAMILY_POLICY.adultAge||ages.to>=FAMILY_POLICY.adultAge)||l.type==='spouse'&&(ages.from<FAMILY_POLICY.adultAge||ages.to<FAMILY_POLICY.adultAge))fail('age eligibility');
  }
  if(['parent','adoptive-parent'].includes(l.type)){
   (graph[l.fromId]??=[]).push(l.toId);if(l.type==='parent'){if(l.end)fail('biological parentage cannot end');parents[l.toId]=(parents[l.toId]||0)+1;if(parents[l.toId]>2)fail('too many biological parents');}else if(!l.end){adopters[l.toId]=(adopters[l.toId]||0)+1;if(adopters[l.toId]>2)fail('too many active adoptive parents');}
  }
  if(l.type==='guardian')(guardians[l.fromId]??=[]).push(l.toId);
  if(l.type==='spouse'){
   if(l.end){if(!['divorced','widowed','ended'].includes(l.end.outcome))fail('marriage ending');if(l.end.outcome==='widowed'){const dead=people[l.end.deceasedId];if(![l.fromId,l.toId].includes(dead?.id)||dead.condition!=='dead'||!(dead.conditionHistory||[]).some(t=>t.to==='dead'&&originOrder(state,{turn:t.turn,source:t.source,reason:t.reason})<=end))fail('unverified widowhood');}}
   else if([l.fromId,l.toId].some(id=>people[id].condition==='dead'))fail('confirmed-dead spouse needs a recorded ending');
  }
 }
 const acyclic=(edges,label)=>{const done=new Set(),active=new Set();const visit=id=>{if(active.has(id))fail(label+' cycle');if(done.has(id))return;active.add(id);for(const next of edges[id]||[])visit(next);active.delete(id);done.add(id);};for(const id of Object.keys(edges))visit(id);};
 acyclic(graph,'ancestry');acyclic(guardians,'guardianship');
 const descendant=(a,b,seen=new Set())=>{if(seen.has(a))return false;seen.add(a);return (graph[a]||[]).some(next=>next===b||descendant(next,b,seen));};
 const siblings=(a,b)=>links.some(l=>l.type==='sibling'&&[l.fromId,l.toId].includes(a)&&[l.fromId,l.toId].includes(b))||people[a].family.some(f=>f.id===b&&/sibling/.test(f.tie))||Object.values(graph).some(children=>children.includes(a)&&children.includes(b));
 for(const l of links)if(l.type==='spouse'&&(descendant(l.fromId,l.toId)||descendant(l.toId,l.fromId)||siblings(l.fromId,l.toId)))fail('marriage between known close kin');
 for(const c of Object.values(people))for(const f of c.family)if(/sibling/.test(f.tie)&&descendant(c.id,f.id))fail('known siblings cannot be ancestors');for(const l of links)if(l.type==='sibling'&&(descendant(l.fromId,l.toId)||descendant(l.toId,l.fromId)))fail('known siblings cannot be ancestors');
 const marriages=links.filter(l=>l.type==='spouse');for(let i=0;i<marriages.length;i++)for(let j=i+1;j<marriages.length;j++){const a=marriages[i],b=marriages[j];if([a.fromId,a.toId].some(id=>[b.fromId,b.toId].includes(id))&&Math.max(originOrder(state,a.origin),originOrder(state,b.origin))<Math.min(endOrder(state,a),endOrder(state,b)))fail('overlapping marriages');if([a.fromId,a.toId].sort().join(':')===[b.fromId,b.toId].sort().join(':')&&originOrder(state,a.origin)===originOrder(state,b.origin))fail('duplicate marriage');}
 const claimMap=new Map(claims.map(c=>[c.id,c])),claimGraph=Object.create(null);
 for(const c of claims){
  if(!Object.hasOwn(people,c.claimantId)||!Object.hasOwn(NAME_POOLS,c.region)||!CLAIM_BASES.includes(c.basis)||!CLAIM_STATUSES.includes(c.status)||!['recognised','contested','unrecognised'].includes(c.standing))fail('claim metadata');
  const order=originOrder(state,c.origin),support=c.support||{};if(c.support!==undefined&&!object(c.support))fail('claim support');if(c.statusHistory!==undefined&&!Array.isArray(c.statusHistory))fail('claim history');if(!object(support)||!bounded(support.familyLinkIds||[],20)||!bounded(support.claimIds||[],20))fail('claim support');
  const family=(support.familyLinkIds||[]).map(id=>links.find(l=>l.id===id)),prior=(support.claimIds||[]).map(id=>claimMap.get(id));if(family.some(l=>!l||originOrder(state,l.origin)>order)||prior.some(p=>!p||p.id===c.id||p.region!==c.region||originOrder(state,p.origin)>order)||new Set(support.familyLinkIds||[]).size!==(support.familyLinkIds||[]).length||new Set(support.claimIds||[]).size!==(support.claimIds||[]).length)fail('unknown/future/duplicate claim support');
  claimGraph[c.id]=prior.map(p=>p.id);
  if(['parentage','adoption','marriage-derived'].includes(c.basis)){
   const type={parentage:'parent',adoption:'adoptive-parent','marriage-derived':'spouse'}[c.basis];if(!family.some(l=>l.type===type&&(type==='spouse'?[l.fromId,l.toId].includes(c.claimantId):l.toId===c.claimantId)&&prior.some(p=>p.claimantId===(l.fromId===c.claimantId?l.toId:l.fromId))))fail('claim lacks its actual family and prior-claim basis');
  }
  if(c.basis==='previous-rulership'&&n.seats[c.region]!==c.claimantId&&!(people[c.claimantId].politicalHistory||[]).some(t=>[t.from,t.to].some(p=>p.region===c.region&&['sovereign-ruler','vassal-ruler','company-dependent-ruler','regent'].includes(p.kind))&&originOrder(state,{turn:t.turn,source:t.source,reason:t.reason})<=order))fail('unverified previous rulership');
  if(c.status==='realised'&&(n.seats[c.region]!==c.claimantId||people[c.claimantId].condition!=='alive'))fail('realised claim is not the actual seat');
  const history=c.statusHistory||[];if(!bounded(history,1000))fail('claim history bounds');let last,previousOrder=order;for(const h of history){const at=originOrder(state,h.origin);if(at<=previousOrder||!CLAIM_STATUSES.includes(h.from)||!CLAIM_STATUSES.includes(h.to)||h.from===h.to||last&&last!==h.from)fail('claim status history');last=h.to;previousOrder=at;}if(last&&last!==c.status)fail('claim status mismatch');
 }
 acyclic(claimGraph,'claim inheritance');
}
export function familyOf(state,id){
 const n=state.narrative,c=n.characters[id],result=c.family.map(f=>({...f,legacy:true}));
 const add=f=>{const old=result.find(r=>r.id===f.id&&(r.tie===f.tie||f.tie==='sibling'&&/sibling/.test(r.tie)));if(old){if(f.link)old.link=f.link;}else result.push(f);};
 for(const l of n.familyLinks||[]){if(![l.fromId,l.toId].includes(id))continue;const from=l.fromId===id,other=from?l.toId:l.fromId;let tie={parent:from?'child':'parent','adoptive-parent':from?'adopted child':'adoptive parent',guardian:from?'ward':'guardian',sibling:'sibling',spouse:'spouse'}[l.type];if(l.type==='guardian'&&l.end)tie=from?'former ward':'former guardian';if(l.type==='adoptive-parent'&&l.end)tie=from?'former adopted child':'former adoptive parent';if(l.type==='spouse'&&l.end)tie=l.end.outcome==='widowed'?(l.end.deceasedId===other?'late spouse':'surviving spouse'):'former spouse';add({id:other,tie,link:l});}
 const parents=(n.familyLinks||[]).filter(l=>l.type==='parent'&&l.toId===id);for(const l of n.familyLinks||[])if(l.type==='parent'&&l.toId!==id&&parents.some(p=>p.fromId===l.fromId))add({id:l.toId,tie:'sibling',derived:true,sources:[parents.find(p=>p.fromId===l.fromId).origin,l.origin]});
 return result;
}
// Context for a FUTURE selector: no ordering, winner, throne transfer or culture rule.
export function successionContext(state,region){
 const n=state.narrative,ids=new Set((n.claimsV2||[]).filter(c=>c.region===region).map(c=>c.claimantId));return {region,claimants:(n.claimsV2||[]).filter(c=>c.region===region).map(claim=>{const c=n.characters[claim.claimantId];return {characterId:c.id,claimId:claim.id,status:claim.status,standing:claim.standing,isIncumbent:n.seats[region]===c.id,claimActive:['asserted','dormant'].includes(claim.status),available:c.condition==='alive',adult:c.age>=FAMILY_POLICY.adultAge,requiresRegent:c.age<FAMILY_POLICY.adultAge,designated:claim.basis==='designation'&&claim.standing==='recognised'};}),guardians:(n.familyLinks||[]).filter(l=>l.type==='guardian'&&!l.end&&ids.has(l.toId)).map(l=>({characterId:l.fromId,wardId:l.toId,available:n.characters[l.fromId].condition==='alive'&&n.characters[l.fromId].age>=FAMILY_POLICY.adultAge})),widowed:(n.familyLinks||[]).filter(l=>l.type==='spouse'&&l.end?.outcome==='widowed'&&[l.fromId,l.toId].some(id=>n.characters[id].region===region)).map(l=>{const id=l.fromId===l.end.deceasedId?l.toId:l.fromId;return {characterId:id,deceasedId:l.end.deceasedId,currentlyUnmarried:!(n.familyLinks||[]).some(m=>m.type==='spouse'&&!m.end&&[m.fromId,m.toId].includes(id))};})};
}
