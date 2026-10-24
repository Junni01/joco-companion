import {inParliament,afterParliament} from './phase-fixtures.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion,encode,decode} from '../dist/model.js';
import {resolveAction,NeedsInput,march,legalElephants,scandalOffices} from '../dist/actions.js';
const company=(s,id,presidency='bombay')=>correctRegion(s,id,{control:'company',presidency,lootAvailable:false});
const evt=(event,patch={})=>({type:'event',event,topRegion:'mysore',shape:'circle',redirectShape:'circle',modifier:0,...patch});

test('administration applies Zamindar penalties without multiplying tax or sixes',()=>{
 let s=company(initialState(),'bombay');s.laws.zamindarTaxes=true;
 assert.equal(resolveAction(s,{type:'unrest',region:'bombay',reason:'failure'}).state.regions.bombay.unrest,2);
 assert.equal(resolveAction(s,{type:'unrest',region:'bombay',reason:'tax'}).state.regions.bombay.unrest,1);
 s=company(s,'madras','madras');s.laws.governorGeneral=true;
 const failed=resolveAction(s,{type:'govern',outcome:'failure',sixes:2}).state;
 assert.equal(failed.regions.bombay.unrest,4);assert.equal(failed.regions.madras.unrest,4);
 const success=resolveAction(s,{type:'govern',outcome:'success',sixes:2}).state;
 assert.equal(success.regions.bombay.unrest,2);
 assert.throws(()=>resolveAction(success,{type:'govern',outcome:'failure',sixes:0}),/already governed/);
 assert.throws(()=>resolveAction(s,{type:'unrest',region:'bombay',reason:'failure'}),/Governor General/);
 const taxed=resolveAction(success,{type:'unrest',region:'bombay',reason:'tax'}).state;
 assert.throws(()=>resolveAction(taxed,{type:'unrest',region:'bombay',reason:'tax'}),/already been placed/);
 const next=resolveAction(afterParliament(taxed),{type:'next-turn'}).state;
 assert.doesNotThrow(()=>resolveAction(next,{type:'unrest',region:'bombay',reason:'tax'}));
});

test('Turmoil closes the geographically northernmost open order, and fully closed networks Cascade once per region',()=>{
 const s=initialState();s.regions.delhi.orders={d5n:false,d3:true,d5e:true};
 const r=resolveAction(s,evt('turmoil',{topRegion:'delhi'}));
 assert.equal(r.state.regions.delhi.orders.d5e,false);assert.equal(r.state.regions.delhi.orders.d3,true);
 for(const r of Object.values(s.regions))for(const o of Object.keys(r.orders))r.orders[o]=false;
 const all=resolveAction(s,evt('turmoil',{topRegion:'delhi'}));
 assert.equal(all.instructions.filter(t=>t.includes('Cascades along')).length,8);
 assert.equal(s.regions.delhi.orders.d3,false);
});

test('a Cascade treats a multiply-connected destination order as a single order',()=>{
 const s=initialState();for(const o of Object.keys(s.regions.maratha.orders))s.regions.maratha.orders[o]=false;
 const r=resolveAction(s,evt('turmoil',{topRegion:'maratha'}));
 assert.equal(r.state.regions.bengal.orders.be5,false);assert.equal(r.state.regions.bengal.orders.be6,true);
});

test('Peace across a border opens only connected orders and does not clear border-region unrest',()=>{
 let s=company(initialState(),'madras','madras');s.regions.madras.unrest=3;s.elephant={from:'mysore',to:'madras'};
 s.regions.mysore.orders.my3=false;s.regions.mysore.orders.my6=false;s.regions.madras.orders.md5=false;
 const r=resolveAction(s,evt('peace'));
 assert.equal(r.state.regions.mysore.orders.my3,false);assert.equal(r.state.regions.mysore.orders.my6,true);
 assert.equal(r.state.regions.madras.orders.md4,true);assert.equal(r.state.regions.madras.orders.md5,false);
 assert.equal(r.state.regions.madras.unrest,3);assert.equal(r.state.regions.mysore.strength,2);
 s.elephant={from:'madras',to:null};const inside=resolveAction(s,evt('peace')).state;
 assert.equal(inside.regions.madras.unrest,0);assert(Object.values(inside.regions.madras.orders).every(Boolean));
});

test('March uses directional shapes, skips own subjects clockwise, and redirects fully formed empires',()=>{
 const s=initialState();
 assert.deepEqual(march(s,'mysore','triangle'),{from:'mysore',to:'hyderabad'});
 assert.deepEqual(march(s,'madras','triangle'),{from:'madras',to:'mysore'});
 assert.deepEqual(march(s,'delhi','square'),{from:'delhi',to:'bengal'});
 for(const id of ['bengal','bombay'])s.regions[id].overlord='delhi';
 assert.deepEqual(march(s,'delhi','circle','square'),{from:'punjab',to:'delhi'});
 assert(!legalElephants(s).some(p=>p.from==='delhi'));
});

test('Indian invasion shatters a capital without closing its orders or consuming its loot',()=>{
 const s=initialState();s.regions.bombay.strength=5;s.elephant={from:'bombay',to:'delhi'};
 const r=resolveAction(s,evt('crisis',{shape:'circle'}));
 assert.equal(r.state.regions.delhi.overlord,'bombay');assert.equal(r.state.regions.punjab.overlord,null);assert.equal(r.state.regions.maratha.overlord,null);
 assert.deepEqual(r.state.regions.delhi.orders,s.regions.delhi.orders);assert.equal(r.state.regions.delhi.lootAvailable,true);
 assert.equal(r.state.elephant.from,'bombay');assert.equal(s.regions.punjab.overlord,'delhi');
});

test('rebellion ignores other subjects and releases the successful subject with closed orders',()=>{
 const s=initialState();s.regions.punjab.strength=20;
 const r=resolveAction(s,evt('leader',{topRegion:'maratha',modifier:0}));
 assert.equal(r.state.regions.maratha.overlord,null);assert(Object.values(r.state.regions.maratha.orders).every(v=>!v));
 assert.deepEqual(r.state.elephant,s.elephant);
});

test('Company attack uses Sepoy unrest and resolves additional rebellions using current state',()=>{
 let s=company(initialState(),'bombay');s=company(s,'hyderabad');s.laws.sepoyRecruitment=true;s.regions.bombay.unrest=2;s.regions.hyderabad.unrest=1;s.elephant={from:'bombay',to:null};
 const d=evt('crisis',{modifier:1});
 assert.throws(()=>resolveAction(s,d),e=>e instanceof NeedsInput&&e.request.strength===5);
 d.defenses={crisis:5};
 assert.throws(()=>resolveAction(s,d),e=>e instanceof NeedsInput&&e.request.region==='hyderabad'&&e.request.strength===2);
 d.defenses['crisis:secondary:hyderabad']=2;const r=resolveAction(s,d);
 assert.equal(r.state.regions.bombay.unrest,0);assert.equal(r.state.regions.hyderabad.unrest,0);
 assert.equal(r.state.regions.bombay.control,'company');assert.equal(s.regions.bombay.unrest,2);
});

test('Foreign invasion uses the saved roll and closes once, preserves spent loot and accumulates turn losses',()=>{
 let s=company(initialState(),'bombay');s.regions.bombay.unrest=3;s.laws.sepoyRecruitment=true;s.elephant={from:'bombay',to:null};
 const d=evt('foreign',{storm:'west',rolls:{bombay:5},defenses:{'foreign:bombay':0},officerRouts:{bombay:0}});
 const r=resolveAction(s,d);assert.equal(r.state.regions.bombay.strength,2);assert.equal(r.state.regions.bombay.control,'indian');assert.equal(r.state.regions.bombay.unrest,0);assert.equal(r.state.regions.bombay.lootAvailable,false);
 assert.match(r.report,/5 base \+ 3 unrest × 2 = 11/);assert.match(r.report,/Standing by 1 spaces/);
 s=company(r.state,'madras','madras');
 const second=resolveAction(s,evt('foreign',{storm:'south',rolls:{madras:2},defenses:{'foreign:madras':0},officerRouts:{madras:0}}));
 assert.match(second.report,/Standing by 2 spaces/);
 assert.equal(second.instructions.filter(t=>t.includes('Madras Cascades')).length,0);
 const restored=decode(encode(r.state,[s]));assert.equal(restored.state.history.at(-1).input.rolls.bombay,5);
});

test('all-seas foreign invasion evaluates later empire defence after an earlier capital falls',()=>{
 const s=initialState();s.regions.bombay.strength=1;s.regions.madras.strength=1;s.regions.madras.overlord='bombay';s.regions.bengal.strength=0;
 const r=resolveAction(s,evt('foreign',{storm:'all',rolls:{bombay:3,madras:2,bengal:1}}));
 assert.equal(r.state.regions.bombay.strength,1);assert.equal(r.state.regions.madras.overlord,null);assert.match(r.report,/2 invasion strength against 1 empire defence: successful/);
 assert.equal(r.state.regions.bengal.strength,0);
});

test('France none causes no invasion; ordinary foreign none uses the exposed region',()=>{
 const s=initialState();
 const none=resolveAction(inParliament(s),{type:'france',outcome:'failed',storm:'none'}).state;
 for(const id of Object.keys(s.regions)){for(const key of ['control','strength','unrest','overlord','lootAvailable'])assert.equal(none.regions[id][key],s.regions[id][key]);assert.deepEqual(none.regions[id].orders,s.regions[id].orders);}
 assert.throws(()=>resolveAction(s,evt('foreign',{storm:'none',topRegion:'mysore'})),e=>e instanceof NeedsInput&&e.request.region==='mysore');
 assert.match(resolveAction(inParliament(s),{type:'france',outcome:'passed'}).report,/3 non-extra ships/);
});

test('Famine, Special Envoy, laws and scandal actions apply only their own consequences',()=>{
 let s=company(initialState(),'bombay');s.laws.zamindarTaxes=true;
 const famine=resolveAction(inParliament(s),{type:'famine',outcome:'failed'});assert.equal(famine.state.regions.bombay.unrest,1);assert.equal(famine.state.regions.bombay.orders.bo3n,false);
 const opened=resolveAction(s,{type:'envoy',outcome:'success',purpose:'order',order:'p7'});assert.equal(opened.state.regions.punjab.orders.p7,true);
 assert.throws(()=>resolveAction(s,{type:'envoy',outcome:'success',purpose:'order',order:'bo3s'}),/outside Company/);
 const china=resolveAction(s,{type:'envoy',outcome:'success',purpose:'china'}).state;assert(china.chinaOffice);
 const gg=resolveAction(inParliament(china),{type:'law',law:'governorGeneral',outcome:'passed'}).state;
 assert(!scandalOffices(gg,'india').some(o=>o.id==='governor:bombay'));assert(scandalOffices(gg,'india').some(o=>o.id==='governor-general'));
 const scene=resolveAction(gg,{type:'blackmail',card:'india',office:'governor-general'});
 assert.deepEqual(scene.state.regions,gg.regions);assert(scene.state.laws.governorGeneral);assert.equal(scene.scenes[0].speaker,'Arthur Pembroke');
 assert.throws(()=>resolveAction(gg,{type:'blackmail',card:'london',office:'governor-general'}),/eligible office/);
 const move=resolveAction(s,{type:'blackmail',card:'envoy',from:'bombay',to:null});assert.equal(move.state.elephant.to,null);assert.match(move.report,/Take £4/);
});
