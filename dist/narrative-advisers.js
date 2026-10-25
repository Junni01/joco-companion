// Functional assignments reuse continuing people. No cast mutation or save backfill.
export const ADVISER_BINDINGS=Object.freeze({
 'army:bombay':'army-bombay','army:madras':'army-madras','army:bengal':'army-bengal',
 'director-of-trade':'secretary-general','china-affairs':'secretary-bengal',
 'presidency:bombay':'secretary-bombay','presidency:madras':'secretary-madras','presidency:bengal':'secretary-bengal'
});
export function institutionalAdviser(state,institutionId){
 const n=state.narrative;if(!n?.enabled)return null;
 if(institutionId==='director-of-trade'&&state.laws.governorGeneral)return null;
 const id=ADVISER_BINDINGS[institutionId],c=n.characters[id];
 if(!c||c.id!==id||c.condition!=='alive')return null;
 const army=institutionId.startsWith('army:'),region=id==='secretary-general'?'bengal':id.split('-').at(-1);
 return c.role===(army?'army':'secretary')&&c.region===region?c:null;
}
// A pure independent reading of saved identity/voice, not core personality,
// current RNG, deck order, ruler-only 09A aptitude storage, or new attributes.
const hash=s=>[...s].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,17);
export const adviserAptitude=(state,c)=>hash(JSON.stringify([c.id,c.name,c.voice]))%101;
export function adviserContactHTML(state,institutionId,esc){
 const c=institutionalAdviser(state,institutionId);if(!c)return '';
 const labels={ambition:'ambitious',pride:'proud',caution:'cautious',ruthlessness:'unyielding',loyalty:'steadfast',vindictiveness:'holds grudges'};
 const traits=Object.entries(c.traits).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([t])=>labels[t]).join(' · ');
 return `<p class="operation-adviser"><span>Fictional planning adviser</span><b>${esc(c.name)}</b><small>${esc(traits)}</small></p>`;
}

export function adviserPlanningRole(institutionId){
 if(institutionId==='director-of-trade')return "Director of Trade's planning secretary";
 if(institutionId==='china-affairs')return 'China affairs planning adviser';
 if(institutionId.startsWith('army:'))return institutionId.slice(5).replace(/^./,c=>c.toUpperCase())+' Army adjutant';
 return institutionId.slice(11).replace(/^./,c=>c.toUpperCase())+' regional administrative adviser';
}
