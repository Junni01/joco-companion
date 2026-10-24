import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,correctRegion} from '../dist/model.js';
import {chinaTrade} from '../dist/china-trade.js';
test('China proceeds count only Company opium and update with the office, law and territorial control',()=>{
 let s=initialState();assert.equal(chinaTrade(s).active,false);
 s=correctRegion(s,'bengal',{control:'company',presidency:'bengal',lootAvailable:false});s.chinaOffice=true;
 assert.deepEqual(chinaTrade(s),{active:true,icons:2,rate:4,companyRevenue:8,superintendentBonus:2});
 s.laws.envoyChina=true;assert.equal(chinaTrade(s).companyRevenue,10);assert.equal(chinaTrade(s).superintendentBonus,2);
 s=correctRegion(s,'bengal',{control:'indian',strength:1});assert.equal(chinaTrade(s).companyRevenue,0);
 assert.equal(chinaTrade(initialState('1813')).companyRevenue,12);
 const before=JSON.stringify(s);chinaTrade(s);assert.equal(JSON.stringify(s),before);
});
