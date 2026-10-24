import {chapterEvidenceHTML} from './narrative-chapter-ui.js';
import {politicalProfileHTML,politicalExportHTML,dialogueEvidenceHTML} from './narrative-memory-ui.js';
import {dominantTraits} from './narrative.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=r=>r.charAt(0).toUpperCase()+r.slice(1);
const silhouette='<svg class="character-silhouette" viewBox="0 0 64 80" role="img" aria-label="Generic character silhouette"><circle cx="32" cy="23" r="14"/><path d="M8 76V62c0-17 10-24 24-24s24 7 24 24v14z"/></svg>';
export function sceneHTML(scene,{intensity='full',archive=false}={}){
 if(!scene)return '';
 const limit=intensity==='quiet'?0:intensity==='standard'?3:scene.lines.length;
 const lineHTML=line=>`<blockquote class="narrative-line">${line.speakerId==='chronicler'?'<span class="chronicler-icon" aria-hidden="true">▤</span>':silhouette}<div><b>${esc(line.speaker)}</b><small>${esc(line.role)} · ${esc(line.emotion)}</small><p>${esc(line.text)}</p></div></blockquote>`;
 const lines=scene.lines.map(lineHTML);
 return `<section class="narrative-scene" aria-label="Saved narrative scene"><p class="eyebrow">FICTIONAL CAMPAIGN CHRONICLE${scene.provenance==='manual-test'?' · MANUAL TEST':''}</p>${scene.coverage==='summary'?'<p class="small-note">Factual summary · richer reactions for this event are planned.</p>':''}${lines.slice(0,limit).join('')}${lines.length>limit?`<details${archive?' open':''}><summary>${limit?'More voices':'Read saved scene'}</summary>${lines.slice(limit).join('')}</details>`:''}</section>`;
}
export function latestSceneHTML(state){
 if(!state.narrative)return '';
 const scene=state.history.findLast(h=>h.narrative)?.narrative;
 return `<article class="paper-card"><div class="card-heading"><h3>Campaign voices</h3><button id="open-roster">Characters & chapters</button></div><p class="small-note">Fiction follows the recorded game. Complete every physical instruction first.</p><div class="choice-buttons" role="group" aria-label="Narrative display">${['quiet','standard','full'].map(mode=>`<button data-narrative-mode="${mode}" aria-pressed="${state.narrative.intensity===mode}">${label(mode)}</button>`).join('')}</div>${scene?sceneHTML(scene,{intensity:state.narrative.intensity}):'<p>Your fictional cast is ready. Recorded events will appear here.</p>'}</article>`;
}
export function rulerSummaryHTML(state,region){
 const n=state.narrative;if(!n)return '';const c=n.characters[n.seats[region]];
 return `<section class="ruler-summary">${silhouette}<div><p class="eyebrow">FICTIONAL LOCAL RULER</p><h4>${esc(c.name)}</h4><p>${esc(c.position)} · ${esc(c.condition)} · age ${c.age}</p><p>${esc(c.mood)} · ${esc(dominantTraits(c))}</p><button id="ruler-profile">View character</button></div></section>`;
}
export function rosterCardsHTML(state,{query='',region='all',role='all'}={}){
 const n=state.narrative;if(!n)return '';
 return Object.values(n.characters).filter(c=>(region==='all'||c.region===region)&&(role==='all'||c.role===role)&&`${c.name} ${c.position} ${c.condition} ${c.dynasty}`.toLowerCase().includes(query.toLowerCase())).map(c=>`<article class="character-card">${silhouette}<div><h4>${esc(c.name)}</h4><p>${esc(c.position)} · ${esc(c.condition)} · age ${c.age}</p><p>${esc(c.mood)} · ${esc(dominantTraits(c))}</p><button data-character="${esc(c.id)}">View character</button></div></article>`).join('')||'<p>No characters match.</p>';
}
export function chaptersHTML(state){return (state.narrative?.chapters||[]).map(c=>`<article class="thematic-chapter"><h4>${c.version===1?'Turn '+c.turn+' · ':''}${esc(c.title)}</h4>${c.text?`<p class="record-report">${esc(c.text)}</p>`:'<p class="small-note">No substantial chapter for this turn. The complete chronological journal remains available.</p>'}${c.version===1?chapterEvidenceHTML(state,c):''}</article>`).join('')||'<p>No turn chapter yet. The first is written when you begin the next turn or end the game.</p>';}
export function rosterHTML(state){
 if(!state.narrative)return '';
 return `<article class="paper-card narrative-roster"><h3>Fictional characters</h3><p>Local political rulers, their families and fictional institutional advisers. These are separate from player families and officeholders.</p><label>Find a character<input id="character-search" type="search" maxlength="160" placeholder="Name, institution or condition"></label><div class="choice-buttons" role="group" aria-label="Character region">${['all',...Object.keys(state.narrative.seats)].map(r=>`<button data-character-region="${r}" aria-pressed="${r==='all'}">${label(r)}</button>`).join('')}</div><div class="choice-buttons" role="group" aria-label="Character role">${['all','ruler','heir','secretary','army'].map(r=>`<button data-character-role="${r}" aria-pressed="${r==='all'}">${r==='heir'?'Family':label(r)}</button>`).join('')}</div><div id="character-list" class="character-grid">${rosterCardsHTML(state)}</div><h3>Turn chapters</h3>${chaptersHTML(state)}</article>`;
}
export function profileHTML(state,id){
 const n=state.narrative,c=n.characters[id];if(!c)return '<p>Character unavailable.</p>';
 const incidents=state.history.filter(h=>h.narrative&&c.incidents.includes(h.narrative.id));
 return `${silhouette}<p>${esc(c.position)} · ${esc(c.condition)} · age ${c.age}</p><p>${esc(c.dynasty)}</p><p>${esc(c.mood)} · ${esc(dominantTraits(c))}</p><h4>Fictional pre-campaign background</h4><p>${esc(c.background)}</p><h4>Family</h4><ul>${c.family.map(f=>`<li>${esc(f.tie)}: ${esc(n.characters[f.id].name)}</li>`).join('')||'<li>No family ties recorded.</li>'}</ul><h4>Claims</h4><p>${c.claims.map(label).join(', ')||'None recorded.'}</p><h4>Relationships</h4><ul>${Object.entries(c.relations).map(([target,r])=>`<li>${esc(r.target.kind==='institution'?'The Company':n.characters[r.target.id].name)}: ${r.hostility?'a recorded grievance':'acquaintance'}; ${r.origins.length} supporting incident${r.origins.length===1?'':'s'}.</li>`).join('')||'<li>No campaign relationships recorded.</li>'}</ul>${politicalProfileHTML(state,id)}${dialogueEvidenceHTML(state,id)}<h4>Recorded incidents</h4>${incidents.map(h=>`<details><summary>Turn ${h.turn} · ${esc(h.title)}</summary>${sceneHTML(h.narrative,{archive:true})}</details>`).join('')||'<p>No witnessed campaign incidents yet.</p>'}`;
}
export function narrativeExportHTML(state){
 const n=state.narrative;if(!n)return '';
 return `<section><h2>Fictional campaign history</h2><p>Authored fiction follows recorded gameplay. Starting backgrounds are invented, not witnessed history. Natural succession, weighted fates and advanced arcs are deferred in this release.</p><h3>Turn chapters</h3>${chaptersHTML(state)}<h3>Character appendix</h3>${Object.values(n.characters).map(c=>`<article class="entry">${silhouette}<h4>${esc(c.name)}</h4><p>${esc(c.position)} · ${esc(c.condition)} · age ${c.age}. ${esc(c.dynasty)}.</p><p>${esc(c.mood)} · ${esc(dominantTraits(c))}.</p><p>Fictional background: ${esc(c.background)}</p><p>Family: ${c.family.map(f=>`${esc(f.tie)} ${esc(n.characters[f.id].name)}`).join('; ')||'none recorded'}. Claims: ${c.claims.map(label).join(', ')||'none'}.</p></article>`).join('')}<h3>Allegiance history</h3><ul>${n.allegiances.map(a=>`<li>${label(a.subject)} under ${label(a.capital)}: ${esc(a.origin)} origin; began turn ${a.start}${a.end?`, ended turn ${a.end.turn}`:', continuing'}. ${esc(a.provenance)}.</li>`).join('')||'<li>No allegiance episodes recorded.</li>'}</ul></section>${politicalExportHTML(state)}`;
}
