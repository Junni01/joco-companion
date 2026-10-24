import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,encode,decode,legalTargets,resolveDeployment,validate} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {canEndGame} from '../dist/game-end.js';

const end=s=>resolveAction(s,{type:'end-game',reason:'failure',note:'A final dispatch.'});
const finishIndia=s=>{
 s=resolveAction(s,{type:'phase-start',face:4}).state;
 for(let i=0;i<4;i++)s=resolveAction(s,{type:'event',event:'windfall',topRegion:'delhi'}).state;
 return resolveAction(s,{type:'phase-finish'}).state;
};

test('failure before India closes the chronicle, preserves the board and survives export with undo',()=>{
 const before=initialState(),result=end(before),closed=result.state;
 assert.equal(before.gameEnd,null);assert.equal(closed.gameEnd.reason,'failure');assert.equal(closed.gameEnd.note,'A final dispatch.');
 assert.deepEqual(closed.regions,before.regions);assert.deepEqual(closed.elephant,before.elephant);assert.deepEqual(closed.eventStack,before.eventStack);
 assert.match(result.report,/Company failure card/);assert.match(result.report,/Final Company territory: none/);assert.equal(closed.history.at(-1).actionType,'end-game');
 const loaded=decode(encode(closed,[before]));assert.deepEqual(loaded.state.gameEnd,closed.gameEnd);assert.equal(loaded.undo[0].gameEnd,null);assert.equal(canEndGame(loaded.undo[0]),true);
 const old=initialState();delete old.gameEnd;assert.doesNotThrow(()=>decode(encode(old)));
});

test('ending is blocked during ships, between events and until phase completion, then bypasses Parliament',()=>{
 let s=resolveAction(initialState(),{type:'phase-start',face:0}).state;
 for(let i=0;i<3;i++){
  assert.equal(canEndGame(s),false);assert.throws(()=>end(s),/Finish Events in India/);
  if(i===0)s=resolveAction(s,{type:'phase-ships'}).state;
  else s=resolveAction(s,{type:'event',event:'windfall',topRegion:'delhi'}).state;
 }
 assert.equal(s.indiaPhase.completed,2);assert.throws(()=>end(s),/Finish Events in India/);
 s=resolveAction(s,{type:'phase-finish'}).state;
 assert.equal(canEndGame(s),true);const closed=end(s).state;
 assert.equal(closed.parliamentFinishedTurn,null);assert.equal(closed.gameEnd.turn,1);
 const forged=structuredClone(closed);forged.indiaPhase.status='events';assert.throws(()=>validate(forged),/Cannot end during/);
});

test('closed games reject all gameplay while allowing rename and inspection',()=>{
 const closed=end(initialState()).state;
 for(const d of [{type:'phase-start',face:4},{type:'end-game',reason:'failure'},{type:'next-turn'},{type:'event',manualTest:true,event:'windfall',topRegion:'delhi'},{type:'law',law:'sepoyRecruitment',outcome:'passed'},{type:'blackmail',card:'london',office:'chairman'}])assert.throws(()=>resolveAction(closed,d),/game has ended/);
 assert.deepEqual(legalTargets(closed,'bombay'),[]);
 assert.throws(()=>resolveDeployment(closed,{army:'bombay',target:'bombay',regiments:5,officers:0,alliances:[],outcome:'success',losses:0}));
 assert.equal(resolveAction(closed,{type:'rename',name:'The fallen Company'}).state.campaignName,'The fallen Company');
});

test('normal ending requires final Parliament and offers final upkeep rather than failure instructions',()=>{
 assert.throws(()=>resolveAction(initialState(),{type:'end-game',reason:'completed'}),/final turn/);
 let s=initialState();s.turn=6;s=finishIndia(s);
 assert.throws(()=>resolveAction(s,{type:'end-game',reason:'completed'}),/Complete Parliament/);
 s=resolveAction(s,{type:'parliament-finish'}).state;
 const result=resolveAction(s,{type:'end-game',reason:'completed'});
 assert.match(result.report,/final prize upkeep/);assert.doesNotMatch(result.report,/failure card/);
 assert.equal(result.state.gameEnd.reason,'completed');
 assert.throws(()=>resolveAction(s,{type:'end-game',reason:'failure',note:'x'.repeat(2001)}),/2,000/);
});
