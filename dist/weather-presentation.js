import {STORM_FACES,phaseFor} from './india-phase.js';
export const narrativeWeather=s=>!!s.narrative?.enabled;
export function weatherConcealed(s){const p=phaseFor(s),w=s.narrative?.weather;return narrativeWeather(s)&&!!p&&(p.status==='ships'||p.status==='events'&&p.completed===0&&!STORM_FACES[p.face].seas.length&&w?.turn===s.turn&&!w.weatherPresented);}
export function countPending(s){const p=phaseFor(s),w=s.narrative?.weather;return narrativeWeather(s)&&p?.status==='events'&&p.completed===0&&w?.turn===s.turn&&w.weatherPresented&&!w.countPresented;}
export function initializeWeather(s,h){
 if(!s.narrative)return;
 if(h.actionType==='phase-start')s.narrative.weather={turn:s.turn,sourceIncidentId:h.incident.id,weatherPresented:false,countPresented:false};
 if(h.actionType==='phase-ships'){const start=s.history.findLast(e=>e.actionType==='phase-start'&&e.turn===s.turn);if(start&&!s.narrative.weather)s.narrative.weather={turn:s.turn,sourceIncidentId:start.incident.id,weatherPresented:true,countPresented:false};if(s.narrative.weather?.turn===s.turn)s.narrative.weather.weatherPresented=true;}
 if(h.actionType==='next-turn')delete s.narrative.weather;
}
export function validateWeather(s){const w=s.narrative?.weather;if(!w)return;const h=s.history.find(h=>h.incident?.id===w.sourceIncidentId);if(!h||h.actionType!=='phase-start'||h.turn!==w.turn||w.turn>s.turn||typeof w.weatherPresented!=='boolean'||typeof w.countPresented!=='boolean'||w.countPresented&&!w.weatherPresented||w.turn===s.turn&&phaseFor(s)?.status==='ships'&&w.weatherPresented)throw Error('Invalid saved weather presentation.');}
// Redact only CURRENT undisclosed count in normal-readable archive surfaces.
// Raw JSON retains the original saved face; this is staging, not rules secrecy.
export function weatherSafeState(s){if(!weatherConcealed(s))return s;const face=STORM_FACES[s.indiaPhase.face];return {...s,history:s.history.map(h=>h.turn===s.turn&&h.actionType==='phase-start'?{...h,title:'Ocean conditions',report:face.seas.length?`Storms affect ${face.seas.join(', ')}. Resolve ship effects before proceeding.`:'Calm seas. No ship checks are required.',narrative:undefined}:h)};}
