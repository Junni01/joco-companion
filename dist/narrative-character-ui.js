import {CONDITION_LABELS,POLITICAL_ROLES,legacyPoliticalRole,politicalRoleOf} from './narrative-characters.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const role=v=>POLITICAL_ROLES[v.kind]+' · '+v.region[0].toUpperCase()+v.region.slice(1);
export function characterPosition(state,c){const p=politicalRoleOf(state,c),old=legacyPoliticalRole(state,c);return p.kind===old.kind&&p.region===old.region?c.position:role(p);}
export function characterHistoryHTML(state,c){
 const sections=[['Life status history',c.conditionHistory,CONDITION_LABELS],['Political role history',c.politicalHistory,null]];
 return sections.filter(([,rows])=>rows?.length).map(([title,rows,labels])=>`<section class="character-transitions"><h4>${title}</h4><ol>${rows.map(t=>{const h=t.source.incidentId?state.history.find(h=>h.incident?.id===t.source.incidentId):state.history[t.source.historyIndex];return `<li><b>Turn ${t.turn}: ${esc(labels?labels[t.from]:role(t.from))} → ${esc(labels?labels[t.to]:role(t.to))}</b><p>${esc(t.reason)}</p><details><summary>Recorded source</summary><p>${esc(h?.title)} · ${esc(t.source.actionType)} · ${esc(t.source.incidentId||'Debug setup entry '+t.source.historyIndex)}</p></details></li>`;}).join('')}</ol></section>`).join('');
}
