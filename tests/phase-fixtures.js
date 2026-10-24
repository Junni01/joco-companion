// Set up a phase boundary without adding unrelated random events to a focused rule test.
export function inParliament(state){const s=structuredClone(state);s.indiaPhase={turn:s.turn,face:3,total:1,completed:1,status:'complete'};s.parliamentFinishedTurn=null;return s;}
export function afterParliament(state){const s=inParliament(state);s.parliamentFinishedTurn=s.turn;return s;}
