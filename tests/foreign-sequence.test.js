import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion,encode,decode} from '../dist/model.js';
import {resolveAction,NeedsInput} from '../dist/actions.js';
import {inParliament} from './phase-fixtures.js';

const company=(s,id,presidency)=>correctRegion(s,id,{control:'company',presidency,lootAvailable:false});
function board(){
 let s=initialState();
 for(const [id,p] of [['bombay','bombay'],['madras','madras'],['bengal','bengal'],['hyderabad','bombay'],['mysore','madras']])s=company(s,id,p);
 s.regions.bombay.unrest=1;s.regions.madras.unrest=2;s.regions.bengal.unrest=1;
 s.regions.hyderabad.unrest=2;s.regions.mysore.unrest=3;s.elephant={from:'bombay',to:null};return s;
}
function request(s,d){try{resolveAction(s,d);assert.fail('Expected another physical report');}catch(e){assert(e instanceof NeedsInput,e.message);return e.request;}}
for(const type of ['event','france'])test(`${type}: all foreign invasions precede one set of unrest rebellions`,()=>{
 const s=type==='france'?inParliament(board()):board();
 const d={type,...(type==='event'?{event:'foreign',manualTest:true}:{outcome:'failed'}),storm:'all',topRegion:'punjab',shape:'circle',redirectShape:'circle',rolls:{bombay:2},defenses:{},officerRouts:{}};
 let q=request(s,d);assert.equal(q.key,'foreign:bombay');assert.equal(q.strength,3);d.defenses[q.key]=q.strength;
 q=request(s,d);assert.equal(q.type,'invasion-roll');assert.equal(q.region,'madras');d.rolls.madras=3;
 q=request(s,d);assert.equal(q.key,'foreign:madras');assert.equal(q.strength,5);d.defenses[q.key]=q.strength;
 q=request(s,d);assert.equal(q.type,'invasion-roll');assert.equal(q.region,'bengal');d.rolls.bengal=4;
 q=request(s,d);assert.equal(q.key,'foreign:bengal');assert.equal(q.strength,5);d.defenses[q.key]=q.strength;
 q=request(s,d);assert.equal(q.key,'foreign:secondary:hyderabad');assert.equal(q.strength,2);d.defenses[q.key]=2;
 q=request(s,d);assert.equal(q.key,'foreign:secondary:mysore');assert.equal(q.strength,3);d.defenses[q.key]=3;
 const r=resolveAction(s,d),attacks=r.instructions.filter(t=>t.includes(' attack:')).map(t=>t.split(' attack:')[0]);
 assert.deepEqual(attacks,['Bombay','Madras','Bengal','Hyderabad','Mysore']);
 for(const id of ['bombay','madras','bengal','hyderabad','mysore']){assert.equal(r.state.regions[id].unrest,0);assert.equal(r.state.regions[id].control,'company');}
 assert.deepEqual(decode(encode(r.state)).state.regions,r.state.regions);
 assert.equal(s.regions.madras.unrest,2);
});

test('foreign losses resolve routs before later invasions and remaining rebellions; tower uses raw die, not unrest',()=>{
 const s=board();s.laws.sepoyRecruitment=true;
 const d={type:'event',event:'foreign',manualTest:true,storm:'all',topRegion:'punjab',shape:'circle',redirectShape:'circle',rolls:{bombay:5,madras:3,bengal:1},defenses:{'foreign:bombay':0},officerRouts:{}};
 let q=request(s,d);assert.equal(q.type,'officer-rout');assert.equal(q.region,'bombay');d.officerRouts.bombay=2;
 q=request(s,d);assert.equal(q.key,'foreign:madras');d.defenses[q.key]=0;d.officerRouts.madras=0;
 q=request(s,d);assert.equal(q.key,'foreign:bengal');d.defenses[q.key]=0;d.officerRouts.bengal=1;
 q=request(s,d);assert.equal(q.key,'foreign:secondary:hyderabad');d.defenses[q.key]=0;d.officerRouts.hyderabad=0;
 q=request(s,d);assert.equal(q.key,'foreign:secondary:mysore');d.defenses[q.key]=0;d.officerRouts.mysore=0;
 const r=resolveAction(s,d);assert.deepEqual(r.state.history.at(-1).regionLosses,['bombay','madras','bengal','hyderabad','mysore']);
 assert.deepEqual(['bombay','madras','bengal'].map(id=>r.state.regions[id].strength),[2,1,0]);assert.equal(r.state.regions.hyderabad.strength,1);
 assert.equal(r.instructions.filter(t=>t.includes('Cascades along')).length,new Set(r.instructions.filter(t=>t.includes('Cascades along'))).size);
});

test('invasions of Indian regions alone do not trigger Company unrest rebellions',()=>{
 let s=company(initialState(),'hyderabad','bombay');s.regions.hyderabad.unrest=2;
 const r=resolveAction(s,{type:'event',event:'foreign',storm:'all',topRegion:'punjab',shape:'circle',redirectShape:'circle',rolls:{bombay:1,madras:1,bengal:1}});
 assert.equal(r.state.regions.hyderabad.unrest,2);assert(!r.instructions.some(t=>t.includes('Hyderabad attack:')));
});
