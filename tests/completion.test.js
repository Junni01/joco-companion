import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,encode,decode} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {parliamentBlockReason,nextTurnBlockReason} from '../dist/india-phase.js';
import {inParliament,afterParliament} from './phase-fixtures.js';
import {saveActionProgress,loadActionProgress,restoreActionProgress} from '../dist/action-progress.js';
import {EVENT_TILES,drawRequest,pendingEvent} from '../dist/event-stack.js';
import {chroniclePage,chroniclePanelHTML,readableChronicle} from '../dist/chronicle.js';
import {confirmInApp} from '../dist/confirm-dialog.js';

function storage(){const values=new Map();return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};}
test('Parliament and next turn cannot bypass India, while Revenue failure can still end the game',()=>{
 const before=initialState();assert(parliamentBlockReason(before));assert(nextTurnBlockReason(before));
 for(const d of [{type:'law',law:'sepoyRecruitment',outcome:'passed'},{type:'famine',outcome:'failed'},{type:'france',outcome:'failed',storm:'none'},{type:'next-turn'}])assert.throws(()=>resolveAction(before,d),/Finish Events in India/);
 assert.doesNotThrow(()=>resolveAction(before,{type:'end-game',reason:'failure'}));
 let s=resolveAction(before,{type:'phase-start',face:4}).state;
 for(let i=0;i<4;i++)s=resolveAction(s,{type:'event',event:'windfall',topRegion:'madras'}).state;
 assert.throws(()=>resolveAction(s,{type:'law',law:'sepoyRecruitment',outcome:'passed'}),/Finish Events/);
 s=resolveAction(s,{type:'phase-finish'}).state;assert.equal(parliamentBlockReason(s),'');assert.throws(()=>resolveAction(s,{type:'next-turn'}),/Finish Parliament/);
 s=resolveAction(s,{type:'parliament-finish'}).state;assert.equal(nextTurnBlockReason(s),'');assert.equal(resolveAction(s,{type:'next-turn'}).state.turn,2);
 const last=afterParliament(initialState());last.turn=6;last.indiaPhase.turn=6;last.parliamentFinishedTurn=6;assert.match(nextTurnBlockReason(last),/final turn/);
});

test('an unfinished stack event survives portable save with dice, defence choices, cursor and Undo progress',()=>{
 const store=storage(),s=initialState();
 const foreign=EVENT_TILES.find(t=>t.event==='foreign').id;
 s.eventStack={version:1,draw:[foreign,...EVENT_TILES.map(t=>t.id).filter(id=>id!==foreign)],discard:[],pending:null};
 const started=resolveAction(s,{type:'phase-start',face:4}).state;
 const drawn=resolveAction(started,drawRequest(started.eventStack)).state;
 const input={...pendingEvent(drawn.eventStack),storm:'west',rolls:{bombay:5},defenses:{'foreign:bombay':0},attackOrder:{first:'bombay'}};
 saveActionProgress(drawn,input,'resolve',store,{instructionCursor:4});const progress=loadActionProgress(drawn,store);
 const result=decode(encode(drawn,[drawn],progress,[progress]));assert.deepEqual(result.progress,progress);assert.deepEqual(result.undoProgress,[progress]);assert.deepEqual(result.state.eventStack,drawn.eventStack);
 const anotherBrowser=storage();restoreActionProgress(result.state,result.progress,anotherBrowser);const recovered=loadActionProgress(result.state,anotherBrowser);
 assert.equal(recovered.input.rolls.bombay,5);assert.equal(recovered.input.defenses['foreign:bombay'],0);assert.equal(recovered.ui.instructionCursor,4);
 const continued=resolveAction(result.state,recovered.input),original=resolveAction(drawn,input);assert.deepEqual(continued.state.regions,original.state.regions);assert.deepEqual(continued.state.elephant,original.state.elephant);assert.deepEqual(continued.state.history.at(-1).input.rolls,{bombay:5});
});

test('France resolution transfers with its saved roll, and malformed or mismatched progress is rejected',()=>{
 const s=inParliament(initialState()),store=storage(),input={type:'france',outcome:'failed',storm:'west',rolls:{bombay:4}};
 saveActionProgress(s,input,'resolve',store,{instructionCursor:0});const progress=loadActionProgress(s,store),json=encode(s,[],progress),parsed=JSON.parse(json);
 assert.equal(decode(json).progress.input.rolls.bombay,4);
 for(const change of [p=>p.progress.input.rolls.bombay=7,p=>p.progress.ui.instructionCursor=-1,p=>p.progress.fingerprint='another campaign',p=>p.progress.stage='unknown',p=>p.progress.input.type='tax']){const bad=structuredClone(parsed);change(bad);assert.throws(()=>decode(JSON.stringify(bad)),/Invalid saved resolution/);}
 const old=JSON.parse(encode(initialState()));delete old.progress;delete old.undoProgress;assert.equal(decode(JSON.stringify(old)).progress,null);
});

test('large saves retain the full current chronicle and progress while trimming only the oldest Undo frames to fit',()=>{
 const s=inParliament(initialState());s.history=[{kind:'action',actionType:'event',turn:1,title:'Large report',report:'a'.repeat(450000)}];
 const p={fingerprint:JSON.stringify(s),input:{type:'france',outcome:'failed',storm:'west',rolls:{bombay:2}},stage:'resolve',ui:{instructionCursor:0}};
 const json=encode(s,Array.from({length:20},()=>structuredClone(s)),p);assert(json.length<6000000);
 const saved=decode(json);assert.equal(saved.state.history[0].report.length,450000);assert.equal(saved.progress.input.rolls.bombay,2);assert(saved.undo.length<20);assert.equal(saved.undoProgress.length,saved.undo.length);
});

test('chronicle pagination exposes older records and turn/category filters are independent',()=>{
 const s=initialState();s.turn=3;s.history=Array.from({length:70},(_,i)=>({kind:i%2?'deploy':'action',actionType:'event',turn:1+i%3,title:`Entry ${i}`,report:'Instructions'}));
 const first=chroniclePage(s);assert.equal(first.entries[0].title,'Entry 69');assert.equal(first.count,70);assert.equal(first.pages,3);
 const older=chroniclePage(s,{page:2});assert.equal(older.entries.at(-1).title,'Entry 0');assert.equal(older.entries.length,20);
 assert(chroniclePage(s,{turn:'2',kind:'deploy'}).entries.every(h=>h.turn===2&&h.kind==='deploy'));
 assert.match(chroniclePanelHTML(s),/Older entries/);assert.equal(chroniclePage(s,{turn:'6'}).count,0);
});

test('recording beyond the old 1,000-entry cap preserves the earliest chronicle entry',()=>{
 const s=initialState();s.history=Array.from({length:1000},(_,i)=>({kind:'action',turn:1,title:`Entry ${i}`,report:'Instructions'}));
 const next=resolveAction(s,{type:'rename',name:'Complete chronicle'}).state;assert.equal(next.history.length,1001);assert.equal(next.history[0].title,'Entry 0');assert.equal(chroniclePage(next,{page:40}).entries.at(-1).title,'Entry 0');
});

test('readable export includes the whole chronology, escapes input and exposes no future event faces',()=>{
 const s=initialState();s.campaignName='<script>unsafe</script>';s.history=Array.from({length:40},(_,i)=>({kind:'action',turn:i<20?1:2,title:`Entry ${i}`,report:'<b>physical instruction</b>'}));
 s.eventStack={version:1,draw:EVENT_TILES.map(t=>t.id),discard:[],pending:null};
 const html=readableChronicle(s);assert(html.indexOf('Entry 0')<html.indexOf('Entry 39'));assert(html.includes('Entry 39'));assert(!html.includes('<script>unsafe'));assert(html.includes('&lt;script&gt;unsafe'));
 assert(!html.includes('<b>physical instruction'));assert(html.includes('&lt;b&gt;physical instruction'));assert(!html.includes('Leader +4'));assert(html.includes('JSON backup'));
});

test('in-app confirmation works without native popups, cancels safely and only confirms once',()=>{
 const nodes=new Map();globalThis.document={getElementById:id=>nodes.get(id)};globalThis.confirm=()=>assert.fail('Native confirmation should not be used');let confirmed=0,cancelled=0;
 const showDialog=(title,body,actions)=>{for(const m of (body+actions+'<p id="form-error"></p>').matchAll(/id="([^"]+)"/g))nodes.set(m[1],{});};
 const args={showDialog,title:'Load?',message:'Replace campaign?',onConfirm:()=>confirmed++,onCancel:()=>cancelled++};
 confirmInApp(args);nodes.get('cancel-choice').onclick();assert.equal(confirmed,0);assert.equal(cancelled,1);
 confirmInApp(args);const button=nodes.get('confirm-choice');button.onclick();button.onclick();assert.equal(confirmed,1);
});
