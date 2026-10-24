import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion,regionsLostThisTurn,encode,decode} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {afterParliament} from './phase-fixtures.js';
test('turn losses count every loss, survive recapture and saves, and reset by turn with Undo',()=>{
 let s=correctRegion(initialState(),'bombay',{control:'company',presidency:'bombay'});s.elephant={from:'bombay',to:null};assert.equal(regionsLostThisTurn(s),0);
 const input={type:'event',manualTest:true,event:'crisis',modifier:1,defenses:{crisis:0},officerRouts:{bombay:0},topRegion:'mysore',shape:'circle'};
 const first=resolveAction(s,input).state;assert.equal(regionsLostThisTurn(first),1);
 let recaptured=correctRegion(first,'bombay',{control:'company',presidency:'bombay'});recaptured.elephant={from:'bombay',to:null};assert.equal(regionsLostThisTurn(recaptured),1);
 const second=resolveAction(recaptured,input);assert.equal(regionsLostThisTurn(second.state),2);assert.match(second.report,/Standing by 2 spaces/);
 const next=resolveAction(afterParliament(second.state),{type:'next-turn'}).state;assert.equal(regionsLostThisTurn(next),0);
 const saved=decode(encode(next,[second.state]));assert.equal(regionsLostThisTurn(saved.state),0);assert.equal(regionsLostThisTurn(saved.undo[0]),2);
});
test('multiple losses in one event count individually and legacy entries without loss data contribute zero',()=>{
 let s=correctRegion(initialState(),'bombay',{control:'company',presidency:'bombay'});s=correctRegion(s,'hyderabad',{control:'company',presidency:'bombay',unrest:1});s.elephant={from:'bombay',to:null};
 s.history.push({kind:'action',title:'Legacy entry',turn:1});
 const r=resolveAction(s,{type:'event',manualTest:true,event:'crisis',modifier:1,defenses:{crisis:0,'crisis:secondary:hyderabad':0},officerRouts:{bombay:0,hyderabad:0},topRegion:'mysore',shape:'circle'});
 assert.equal(regionsLostThisTurn(r.state),2);assert.equal(regionsLostThisTurn(s),0);
});
