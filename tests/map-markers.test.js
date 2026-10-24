import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,IDS,REGIONS} from '../dist/model.js';
import {LABEL_ANCHORS,mapAffiliation,regionMarker} from '../dist/map-markers.js';

test('map distinguishes capitals, vassals, sovereigns and Company control without changing state',()=>{
 const state=initialState(),before=JSON.stringify(state);
 assert.equal(mapAffiliation(state,'delhi').kind,'capital');
 assert.equal(mapAffiliation(state,'punjab').kind,'vassal');
 assert.equal(mapAffiliation(state,'punjab').color,mapAffiliation(state,'delhi').color);
 assert.equal(mapAffiliation(state,'bengal').kind,'sovereign');
 for(const id of IDS){
  const html=regionMarker(state,id);
  assert.ok(html.includes(REGIONS[id].name.toUpperCase()));
  assert.ok(html.includes('text-anchor="middle"'));
  assert.ok(html.includes('tower-piece'));
  assert.ok(html.includes('unrest-piece'));
  assert.equal(LABEL_ANCHORS[id].length,2);
 }
 assert.equal(JSON.stringify(state),before);
 state.regions.punjab.control='company';state.regions.punjab.presidency='bombay';
 const a=mapAffiliation(state,'punjab');
 assert.equal(a.kind,'company');assert.equal(a.detail,'Bombay Presidency');
 assert.match(regionMarker(state,'punjab'),/COMPANY/);
});
test('map affiliation follows empire breakup and bounds physical piece icons while retaining exact counts',()=>{
 const state=initialState();
 state.regions.punjab.overlord=null;state.regions.maratha.overlord=null;state.regions.delhi.empireCapital=false;
 assert.equal(mapAffiliation(state,'delhi').kind,'sovereign');
 state.regions.delhi.empireCapital=true;
 assert.equal(mapAffiliation(state,'delhi').kind,'capital');
 state.regions.delhi.strength=100;state.regions.delhi.unrest=10000;
 const html=regionMarker(state,'delhi');
 assert.ok(html.length<4000);assert.match(html,/100 tower levels, 10000 unrest/);
 assert.match(html,/>100<\/text>/);assert.match(html,/>10000<\/text>/);
});
