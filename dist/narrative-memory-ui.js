import {evidenceIndex,resolveFact} from './narrative-evidence.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=r=>r?r.charAt(0).toUpperCase()+r.slice(1):'';
const origin={direct:'Directly affected · does not imply eyewitness attendance',indirect:'Indirect political or institutional awareness',statement:'Recorded fictional statement',inherited:'Inherited account'};
function factText(f){
 const r=label(f.region);
 if(f.type==='company-conquest')return `The Company took control of ${r}${f.lootConsumed?'; the regional loot token was consumed':''}.`;
 if(f.type==='company-loss')return `The Company lost ${r}. The reported rout removed ${f.removed} officers; this does not establish death.`;
 if(f.type==='join')return `${r} became subordinate to ${label(f.capital)} following a successful attack.`;
 if(f.type==='release')return `${r} became sovereign after the empire of ${label(f.capital)} broke.`;
 if(f.type==='battle')return `${f.kind==='company-defence'?'Company defence':f.kind==='rebellion'?'Rebellion':'Invasion'} in ${r}: ${f.won?'successful':'unsuccessful'}${f.capital?` against ${label(f.capital)}`:''}.`;
 if(f.type==='tax')return `${f.mode==='general'?'Governor General Tax':`Ordinary Tax ${f.ordinal} this turn`} in ${r}; ${f.unrest} unrest added.`;
 if(f.type==='unrest')return `${f.amount} unrest added in ${r}; recorded cause: ${f.cause}${f.reason?' / '+f.reason:''}.`;
 if(f.type==='deployment')return `Army of ${label(f.army)} deployed in ${r}: ${f.outcome}; ${f.losses} officer losses reported.`;
 if(f.type==='intervention')return `A successful Company intervention restored the prescribed open-order/zero-unrest position in ${r}.`;
 return `${f.type.replaceAll('-',' ')}${r?' in '+r:''}.`;
}
function sourcesHTML(index,refs,archive=false){
 const unique=[...new Map(refs.map(r=>[`${r.incidentId}/${r.factKey}`,r])).values()];
 return unique.map(ref=>{const source=resolveFact(index,ref);if(!source)return '<p>Source unavailable.</p>';
  return `<details class="memory-evidence"${archive?' open':''}><summary>Source · Turn ${source.entry.turn}: ${esc(source.entry.title)}</summary><p>${esc(factText(source.fact))}</p><p class="small-note">Recorded incident ${esc(ref.incidentId)} · ${esc(ref.factKey)}</p></details>`;
 }).join('');
}
function memoryHTML(state,index,m,archive=false){
 const n=state.narrative,importance=m.emotionalImportance>=60?'Pressing':m.emotionalImportance>=30?'Active':'Quiet',historical=m.historicalSignificance>=75?'Defining':m.historicalSignificance>=40?'Significant':'Modest';
 return `<article class="personal-memory"><h5>Turn ${m.createdTurn} · ${esc(label(m.category.replaceAll('-',' ')))} · ${esc(label(m.region))}</h5><p class="small-note">${origin[m.origin]}<br>Historical significance: ${historical} · Current emotional importance: ${importance} · ${esc(m.emotion)}</p><p><b>${m.interpretation.kind==='supported-observation'?'Supported observation':'Personal '+esc(m.interpretation.kind)}:</b> ${esc(m.interpretation.text)}</p>${m.statementIds.map(id=>{const s=n.statements[id];return `<blockquote><b>${esc(n.characters[s.speakerId].name)}</b><p>${esc(s.text)}</p><small>A saved ${esc(s.type)}, not a guaranteed truth.</small></blockquote>`;}).join('')}${sourcesHTML(index,m.evidence,archive)}${m.updates.length?`<details${archive?' open':''}><summary>How this memory has changed</summary><ul>${m.updates.map(u=>`<li>${esc(u.kind.replaceAll('-',' '))}${u.kind==='faded'?' after a committed turn boundary':''}${u.evidence.length?sourcesHTML(index,u.evidence,archive):''}</li>`).join('')}</ul></details>`:''}</article>`;
}
export function politicalProfileHTML(state,id,{archive=false}={}){
 const n=state.narrative,c=n.characters[id],index=evidenceIndex(state),memories=c.memoryIds.map(id=>n.memories[id]);
 const defining=[...memories].sort((a,b)=>b.historicalSignificance-a.historicalSignificance).slice(0,3),pressing=[...memories].filter(m=>m.emotionalImportance>=40).sort((a,b)=>b.emotionalImportance-a.emotionalImportance).slice(0,3);
 const relationships=Object.values(c.relations);
 return `<section class="political-profile"><h4>Defining memories</h4><p class="small-note">Personal interpretations remain separate from the authoritative incidents below.</p>${defining.map(m=>memoryHTML(state,index,m,archive)).join('')||'<p>No political memories recorded yet.</p>'}<h4>Currently pressing</h4>${pressing.map(m=>`<p>${esc(label(m.category.replaceAll('-',' ')))} in ${esc(label(m.region))} · ${esc(m.emotion)}</p>`).join('')||'<p>No presently pressing memories.</p>'}<h4>Relationship reasons</h4>${relationships.map(r=>`<details${archive?' open':''}><summary>${esc(r.target.kind==='institution'?'The Company':n.characters[r.target.id].name)}</summary><p>${['hostility','respect','gratitude','mistrust','loyalty','familiarity'].filter(d=>r[d]>0).map(d=>esc(label(d))).join(' · ')||'No current attitude recorded'}</p>${r.causes.map(cause=>`<p>${esc(cause.reason)}</p>${sourcesHTML(index,cause.memoryIds.flatMap(id=>n.memories[id].evidence),archive)}${cause.statementIds.map(id=>`<blockquote>${esc(n.statements[id].text)}</blockquote>`).join('')}`).join('')}</details>`).join('')||'<p>No relationship causes recorded.</p>'}<h4>Chronological personal memory journal</h4><p class="small-note">All memories are retained, including quiet ones. Fictional starting background is shown separately above.</p><details${archive?' open':''}><summary>Read all ${memories.length} memories</summary>${[...memories].sort((a,b)=>a.sequence-b.sequence||a.id.localeCompare(b.id)).map(m=>memoryHTML(state,index,m,archive)).join('')||'<p>No recorded memories.</p>'}</details>${c.development.changes.length?`<h4>Lasting personal changes</h4><ul>${c.development.changes.map(d=>`<li>${esc(label(d.trait))} changed after recorded experiences: ${esc(d.incidentIds.join(', '))}.</li>`).join('')}</ul>`:''}</section>`;
}
export function politicalExportHTML(state){
 return `<section><h2>Political memories and their evidence</h2>${Object.values(state.narrative.characters).filter(c=>c.memoryIds.length).map(c=>`<article><h3>${esc(c.name)}</h3>${politicalProfileHTML(state,c.id,{archive:true})}</article>`).join('')}</section>`;
}
