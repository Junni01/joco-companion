import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion,encode,decode,clone} from '../dist/model.js';
import {createNarrative,commitNarrative} from '../dist/narrative.js';
import {openIndiaPhase} from '../dist/phase-dialog.js';
import {openGameActions} from '../dist/action-dialogs.js';
import {resolveAction,foreignTargets} from '../dist/actions.js';
import {loadActionProgress} from '../dist/action-progress.js';
import {STORM_FACES} from '../dist/india-phase.js';
import {weatherConcealed,countPending,weatherSafeState} from '../dist/weather-presentation.js';
import {readableChronicle,chroniclePanelHTML} from '../dist/chronicle.js';
import {inParliament} from './phase-fixtures.js';
function harness(initial){
 const nodes=new Map(),storage=new Map(),pages=[];let state=initial,applied=0,title='',body='';
 const node=()=>({value:'',innerHTML:'',textContent:'',disabled:false,classList:{remove(){}},open:true,close(){this.closed=true;}});nodes.set('dialog',node());nodes.set('dialog-content',node());
 globalThis.document={getElementById:id=>nodes.get(id),querySelectorAll:()=>[]};globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const showDialog=(t,b,actions='')=>{title=t;body=b;pages.push({title,body,actions});nodes.get('dialog-content').onchange=null;for(const k of [...nodes.keys()])if(!['dialog','dialog-content'].includes(k))nodes.delete(k);for(const m of (b+actions+'<p id="form-error"></p>').matchAll(/\bid="([^"]+)"/g))nodes.set(m[1],node());for(const m of b.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))nodes.get(m[1]).value=m[2].match(/<option value="([^"]*)"[^>]*selected/)?.[1]||'';for(const m of b.matchAll(/<input[^>]*id="([^"]+)"[^>]*value="([^"]*)"/g))nodes.get(m[1]).value=m[2];};
 const apply=r=>{r.state=commitNarrative(state,r);state=r.state;applied++;};
 const click=id=>{assert.equal(typeof nodes.get(id)?.onclick,'function',id);nodes.get(id).onclick();assert(!nodes.get('form-error')?.textContent);};
 const drain=()=>{while(nodes.has('continue-resolution-step'))click('continue-resolution-step');};
 return {nodes,storage,pages,showDialog,apply,click,drain,presentation:next=>state=next,get state(){return state;},get applied(){return applied;},get title(){return title;},get body(){return body;}};
}

function state(narrative=true){const s=initialState();if(narrative)s.narrative=createNarrative(s,717);return s;}
function random(values){let calls=0;Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){assert(calls<values.length,'unexpected RNG call');a[0]=values[calls++];return a;}}});return ()=>calls;}
const phase=h=>openIndiaPhase({state:h.state,showDialog:h.showDialog,apply:h.apply,esc:String,onPresentation:h.presentation,drawEvent:()=>{},blackmail:()=>{}});
const action=(h,start)=>openGameActions({state:h.state,showDialog:h.showDialog,apply:h.apply,esc:String,start});
for(let face=0;face<6;face++)test(`Narrative face ${face}: one saved draw, weather first, delayed count, calm/ships boundary and reload`,()=>{
 const calls=random([face]),h=harness(state());phase(h);assert(!h.nodes.has('manual-phase-storm'));h.click('start-india-phase');assert.equal(calls(),1);assert.equal(h.state.indiaPhase.face,face);assert(weatherConcealed(h.state));assert(!h.body.match(/\d+ India events?/));assert(!h.nodes.has('dice-continue'));assert(!readableChronicle(h.state).match(/Resolve [1-4] India events?/));assert(!chroniclePanelHTML(h.state).match(/Resolve [1-4] India events?/));const before=encode(h.state);phase(h);assert.equal(encode(h.state),before);assert.equal(calls(),1);
 if(face<4){assert(h.nodes.has('ships-resolved'));h.click('ships-resolved');assert.equal(h.applied,2);}else{assert(!h.nodes.has('ships-resolved'));h.click('calm-continue');assert.equal(h.applied,1);}
 assert.equal(h.title,'Events ahead');assert(h.body.includes(`${STORM_FACES[face].events} India event`));assert(!weatherConcealed(h.state));assert(!countPending(h.state));assert.equal(calls(),1);assert.deepEqual(decode(encode(h.state)).state,h.state);h.click('events-revealed');assert(h.nodes.has('draw-phase-event'));assert.equal(calls(),1);
 const off=state(false);const expected=resolveAction(off,{type:'phase-start',face}).state;const end=face<4?resolveAction(expected,{type:'phase-ships'}).state:expected;assert.deepEqual(h.state.indiaPhase,end.indiaPhase);
});
test('Normal initial automatic storm retains graphical die and manual physical option',()=>{
 globalThis.matchMedia=()=>({matches:true});const calls=random([2]),h=harness(state(false));phase(h);assert(h.nodes.has('manual-phase-storm'));h.click('start-india-phase');assert(h.nodes.has('dice-continue'));assert.match(h.body,/animated-die/);assert.equal(calls(),1);h.click('dice-continue');assert(h.nodes.has('ships-resolved'));assert(h.body.includes('3 events'));h.click('ships-resolved');assert(h.nodes.get('dialog').closed);
});
function company(){let s=state();for(const id of ['bombay','madras','bengal'])s=correctRegion(s,id,{control:'company',presidency:id,lootAvailable:false});return s;}
const foreign={type:'event',manualTest:true,event:'foreign',topRegion:'mysore',shape:'circle',redirectShape:'circle'};
function defend(h){h.drain();assert(h.nodes.has('report-defense'));h.nodes.get('defense').value=h.body.match(/<b>([0-9]+) attack strength/)[1];h.click('report-defense');}
for(const france of [false,true])test(`${france?'France':'Foreign'} multiple Narrative invasions announce exact targets, silently save each legal strength and resume without rerolls`,()=>{
 const calls=random([3,0,5,2]),s=france?inParliament(company()):company(),h=harness(s);action(h,france?{type:'france',outcome:'failed'}:foreign);h.click('review-action');assert.equal(calls(),2);assert.match(h.body,/Bombay → Madras → Bengal/);assert.equal(h.title,'Defend Bombay');assert.deepEqual(loadActionProgress(s).input.rolls,{bombay:1});assert(!h.nodes.has('roll-invasion'));assert(!h.body.includes('animated-die'));
 action(h,foreign);assert.equal(calls(),2);defend(h);assert.equal(h.title,'Defend Madras');assert.equal(calls(),3);assert.match(h.body,/6 attack strength/);assert.deepEqual(loadActionProgress(s).input.rolls,{bombay:1,madras:6});defend(h);assert.equal(h.title,'Defend Bengal');assert.equal(calls(),4);defend(h);h.drain();h.click('confirm-action');assert.equal(calls(),4);assert.equal(h.state.history.at(-1).incident.input.rolls.madras,6);assert.deepEqual(decode(encode(h.state)).state,h.state);
});
for(const france of [false,true])test(`${france?'War Against France':'Foreign Invasion'} no-storm targeting follows the real fallback`,()=>{
 const calls=random(france?[4]:[4,5]),s=france?inParliament(state()):state(),h=harness(s);action(h,france?{type:'france',outcome:'failed'}:foreign);h.click('review-action');h.drain();assert.equal(calls(),france?1:2);assert(!h.body.includes('animated-die'));assert.match(h.body,france?/No invasion targets/:/Threatened regions: Mysore/);h.click('confirm-action');if(!france)assert.equal(h.state.regions.mysore.strength,3);
});
test('Normal foreign storm and strength remain animated and strength stays automatic-only',()=>{
 globalThis.matchMedia=()=>({matches:true});const calls=random([0,5]),h=harness({...company(),narrative:undefined});action(h,foreign);h.click('review-action');assert(h.nodes.has('dice-continue'));h.click('dice-continue');assert(h.nodes.has('roll-invasion'));h.click('roll-invasion');assert(h.nodes.has('dice-continue'));assert.equal(calls(),2);h.click('dice-continue');assert(h.nodes.has('report-defense'));assert(!h.nodes.has('invasion-die'));
});
test('failure preserves physical officer rout and redirect, with no second strength roll',()=>{
 const calls=random([1,5]),s=company();s.elephant={from:'bombay',to:null};const h=harness(s);action(h,foreign);h.click('review-action');h.nodes.get('defense').value='0';h.click('report-defense');assert(h.nodes.has('report-rout'));h.nodes.get('rout-removed').value='0';h.click('report-rout');h.drain();h.click('confirm-action');assert.equal(calls(),2);assert.equal(h.applied,1,JSON.stringify({title:h.title,body:h.body}));assert.equal(h.state.regions.bombay.strength,3,JSON.stringify(h.state.history.at(-1)));assert.equal(h.state.regions.bombay.control,'indian');assert(h.pages.some(p=>p.title==='Move the Elephant'));
});
test('weather visibility rejects premature saved-stage escalation; old campaigns remain readable unchanged',()=>{
 const h=harness(state());random([0]);phase(h);h.click('start-india-phase');const bytes=encode(h.state),bad=clone(h.state);bad.narrative.weather.weatherPresented=true;assert.throws(()=>encode(bad),/weather presentation/);const old=clone(h.state);delete old.narrative.weather;assert.deepEqual(decode(encode(old)).state,old);assert(weatherConcealed(old));assert.equal(encode(decode(bytes).state),bytes);assert.deepEqual(foreignTargets({type:'france',storm:'none'}),[]);assert.deepEqual(foreignTargets({type:'event',storm:'none',topRegion:'mysore'}),['mysore']);
});

test('silent invasion sampling retains rejection of the biased uint32 tail',()=>{
 const calls=random([1,4294967295,5]),h=harness(company());action(h,foreign);h.click('review-action');assert.equal(calls(),3);assert.match(h.body,/6 attack strength/);
});

test('explicit Debug phase setup clears the presentation marker without changing random results',async()=>{
 const {debugPhase}=await import('../dist/debug-state.js');const h=harness(state());h.state.debugMode=true;random([0]);phase(h);h.click('start-india-phase');for(const boundary of ['operations','events','parliament','refresh']){const next=debugPhase(h.state,boundary);assert.equal(next.narrative.weather,undefined);assert.equal(next.history.at(-1).input.face,0);}
});

test('actual resolved events take precedence over an earlier calm presentation marker',()=>{
 const initial=state(),started=commitNarrative(initial,resolveAction(initial,{type:'phase-start',face:4}));assert(weatherConcealed(started));const resolved=commitNarrative(started,resolveAction(started,{type:'event',event:'windfall',topRegion:'mysore'}));assert.equal(resolved.indiaPhase.completed,1);assert(!weatherConcealed(resolved));assert(!countPending(resolved));
});
