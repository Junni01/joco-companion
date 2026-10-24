import {phaseActive,parliamentFinished} from './india-phase.js';
import {finalTurn} from './scenarios.js';

export const END_REASONS={failure:'Company failure',completed:'Final turn completed'};
export const canEndGame=s=>!s.gameEnd&&!phaseActive(s)&&!s.eventStack?.pending;
export const canCompleteGame=s=>finalTurn(s)&&parliamentFinished(s);
export function endingInstructions(s,reason){
 const steps=reason==='failure'
  ? ['The Company has failed. Resolve Final Scoring on the physical board, including the Company failure card. Skip remaining phases; Events in India must already be complete if it began this turn.']
  : ['Complete final prize upkeep if not already done, skip refresh, and resolve Final Scoring on the physical board.'];
 return [...steps,'After Final Scoring, the player with the most victory points wins. Break ties by most window icons, then clockwise order starting with the Prime Minister.'];
}
