import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,legalTargets,deploymentBlockReason,deploymentStrength,deploymentCheck,resolveDeployment,correctRegion,encode,decode,PRESIDENCIES} from '../dist/model.js';
const established=()=>correctRegion(initialState(),'bombay',{control:'company',presidency:'bombay',lootAvailable:false});
const draft=(patch={})=>({army:'bombay',target:'delhi',regiments:6,officers:2,alliances:['rajput'],outcome:'success',losses:1,lootBonus:8,...patch});
test('live strength breakdown includes every empire member and works before enough forces are chosen',()=>{
 const s=established(),d=draft({regiments:0,officers:0,alliances:[]});
 const c=deploymentStrength(s,d);
 assert.deepEqual(c.defenders,[{id:'punjab',strength:0},{id:'delhi',strength:1},{id:'maratha',strength:2}]);
 assert.equal(c.strength,0);assert.equal(c.defense,3);assert.equal(c.dice,-3);
 const ready=deploymentStrength(s,{...d,officers:1,alliances:['rajput']});
 assert.equal(ready.strength,4);assert.equal(ready.dice,1);assert.equal(ready.allies[0].name,'Rajput Prince');
 assert.deepEqual(deploymentStrength(s,{...d,target:'maratha'}).defenders,c.defenders);
});
test('legal targets exclude foreign home regions and inactive Company targets',()=>{
 let s=initialState();for(const army of ['bombay','madras','bengal'])assert.deepEqual(legalTargets(s,army),[army]);
 assert.throws(()=>deploymentCheck(s,draft()));
 s=correctRegion(s,'madras',{control:'company',presidency:'madras',orders:{md5:true,md4:true}});
 assert(!legalTargets(s,'madras').includes('madras'));s.regions.madras.unrest=1;assert(legalTargets(s,'madras').includes('madras'));
});
test('defence counts the entire empire and alliances cannot cross armies',()=>{
 const s=established();assert.equal(deploymentCheck(s,draft()).defense,3);
 assert.throws(()=>deploymentCheck(s,draft({alliances:['nizam']})));
 assert.throws(()=>deploymentCheck(s,draft({regiments:0,officers:0,alliances:[]})));
});
test('capital conquest releases subjects, opens orders, consumes loot, and preserves input',()=>{
 const s=established();s.elephant={from:'delhi',to:'bengal'};
 const r=resolveDeployment(s,draft());assert.equal(r.state.regions.delhi.control,'company');assert.equal(r.state.regions.delhi.presidency,'bombay');
 assert.equal(r.state.regions.punjab.overlord,null);assert.equal(r.state.regions.maratha.overlord,null);assert.equal(r.state.elephant.to,null);
 assert.equal(r.state.regions.delhi.lootAvailable,false);assert(Object.values(r.state.regions.delhi.orders).every(Boolean));assert.equal(s.regions.delhi.control,'indian');
 assert.match(r.report,/£12 loot/);assert.equal(decode(encode(r.state,[s])).undo[0].regions.delhi.control,'indian');
});
test('failure preserves board; catastrophe prevents further action only that turn',()=>{
 const s=established();for(const outcome of ['failure','catastrophe']){const r=resolveDeployment(s,draft({outcome}));assert.deepEqual(r.state.regions,s.regions);assert.deepEqual(r.state.elephant,s.elephant);if(outcome==='catastrophe'){assert.deepEqual(legalTargets(r.state,'bombay'),[]);r.state.turn++;assert(legalTargets(r.state,'bombay').length);}}
 assert.throws(()=>resolveDeployment(s,draft({losses:3})));
});
test('Company intervention retains presidency; loot minimum and laws are applied',()=>{
 let s=correctRegion(established(),'hyderabad',{control:'company',presidency:'bombay',unrest:2,lootAvailable:false});s.laws.treasureReform=true;
 const r=resolveDeployment(s,draft({army:'bombay',target:'hyderabad',alliances:[],losses:0}));assert.equal(r.state.regions.hyderabad.presidency,'bombay');assert.equal(r.state.regions.hyderabad.unrest,0);assert.match(r.report,/£3 loot to the Company Balance/);
 s=established();s.laws.governorGeneral=true;assert.match(resolveDeployment(s,draft()).report,/do not create a Governor office/);
});

test('errata: only the assigned Presidency can deploy into a Company region, even with adjacency and unrest',()=>{
 for(const assigned of PRESIDENCIES){
  let s=initialState();for(const army of PRESIDENCIES)s=correctRegion(s,army,{control:'company',presidency:army,lootAvailable:false});
  s=correctRegion(s,'hyderabad',{control:'company',presidency:assigned,unrest:2,lootAvailable:false});
  const before=JSON.stringify(s);
  for(const army of PRESIDENCIES){
   const d=draft({army,target:'hyderabad',alliances:[],losses:0});
   if(army===assigned){assert.equal(deploymentBlockReason(s,army,'hyderabad'),'');assert(legalTargets(s,army).includes('hyderabad'));assert.equal(resolveDeployment(s,d).state.regions.hyderabad.unrest,0);}
   else{assert.match(deploymentBlockReason(s,army,'hyderabad'),/only that Presidency/);assert(!legalTargets(s,army).includes('hyderabad'));assert.throws(()=>deploymentCheck(s,d),/legal target/);assert.throws(()=>resolveDeployment(s,d),/legal target/);}
  }
  assert.equal(JSON.stringify(s),before);
 }
});

 test('conquering the home region unlocks adjacent targets; losing it removes that base',()=>{
 const s=initialState();const conquered=resolveDeployment(s,draft({target:'bombay'})).state;
 assert(legalTargets(conquered,'bombay').includes('delhi'));
 const lost=correctRegion(conquered,'bombay',{control:'indian',strength:1});
 assert.deepEqual(legalTargets(lost,'bombay'),['bombay']);
 });

test('regional loot is automatic and ignores missing or stale manual draft amounts',()=>{
 for(const [target,bonus] of Object.entries({punjab:6,delhi:8,bengal:6,bombay:4,maratha:3,hyderabad:7,mysore:5,madras:5})){
  let s=established();
  if(target==='bombay')s=initialState();
  else if(!legalTargets(s,'bombay').includes(target))s=correctRegion(s,'hyderabad',{control:'company',presidency:'bombay',lootAvailable:false});
  const army=['bengal','madras'].includes(target)?target:'bombay';
  const d=draft({army,target,alliances:[],regiments:20,officers:0,losses:0});delete d.lootBonus;
  const expected=s.regions[target].strength*4+bonus;
  const first=resolveDeployment(s,d);assert.match(first.report,new RegExp(`£${expected} loot`));
  assert.equal(first.state.regions[target].lootAvailable,false);
  assert.equal(resolveDeployment(s,{...d,lootBonus:999}).report,first.report);
  // A rebellion can restore Indian control, but it cannot restore the spent token.
  const rebel=correctRegion(first.state,target,{control:'indian',strength:1});
  assert.match(resolveDeployment(rebel,d).report,/£4 loot/);
 }
});
