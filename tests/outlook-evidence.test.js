import test from 'node:test';
import assert from 'node:assert/strict';
import {APPROVED_OUTLOOKS,OUTLOOK_TEXT} from '../dist/narrative-outlook-content.js';
import {publicKnowledge,forecastRegion,outlookCandidates} from '../dist/narrative-outlooks.js';
import {openCompanyRoutes,routesAtOutlook} from '../dist/narrative-outlook-routes.js';
import {clone,validate,encode,decode} from '../dist/model.js';
import {resolveAction} from '../dist/actions.js';
import {commitNarrative} from '../dist/narrative.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
import {outlookFixture} from './outlook-fixtures.js';
import {grievanceShuffle} from './outlook-polish-fixtures.js';
import {roadCampaign} from './outlook-evidence-fixtures.js';
import {rulerSummaryHTML} from '../dist/narrative-ui.js';
const allow=['09B-strong-defender-dismissive','09B-company-threat-resentful','09B-occupation-wounded','09B-subject-restless','09B-capital-outraged','09B-conquest-grievance-ceremonial','09B-conquest-grievance-scornful'];
const road='09B-company-border-mercantile',has=(xs,id)=>xs.some(x=>x.key===id);
const person=(s,region,traits={})=>({c:{...clone(s.narrative.characters[s.narrative.seats[region]]),traits:{ambition:20,pride:20,caution:20,ruthlessness:20,loyalty:20,vindictiveness:20,...traits},confidence:50,mood:'watchful'},grievance:null,helpful:[]});


test('the exact seven reviewed rhetorical entries are enabled under their actual political contexts',()=>{
 const s=outlookFixture().state,p=publicKnowledge(s);
 p.regions.bombay.strength=20;
 assert(has(outlookCandidates(forecastRegion(p,'bombay'),person(s,'bombay'),80),allow[0]));
 p.regions.bombay={...p.regions.bombay,control:'company',strength:0,unrest:1};
 assert(has(outlookCandidates(forecastRegion(p,'bombay'),person(s,'bombay'),80),allow[1]));
 p.elephant={from:'punjab',to:'delhi'};
 assert(has(outlookCandidates(forecastRegion(p,'bombay'),person(s,'bombay'),80),allow[2]));
 assert(has(outlookCandidates(forecastRegion(p,'punjab'),person(s,'punjab'),80),allow[3]));
 assert(has(outlookCandidates(forecastRegion(p,'delhi'),person(s,'delhi'),80),allow[4]));
 const g=grievanceShuffle().state,owned=person(g,'bombay'),o=g.narrative.outlooks.bombay;owned.grievance=o.personal.grievance;
 const context=forecastRegion(publicKnowledge(g),'bombay');
 assert(has(outlookCandidates(context,owned,80),allow[5]));assert(has(outlookCandidates(context,owned,80),allow[6]));
 owned.grievance=null;assert(!has(outlookCandidates(context,owned,80),allow[5]));
 const neutral={...context,issues:[],local:{...context.local,control:'indian',unrest:0}};
 for(const id of allow)assert(!has(outlookCandidates(neutral,owned,80),id));
});

test('reviewed voice preferences work without adding court, receipt, military or cooperation incidents',()=>{
 const s=outlookFixture().state,p=publicKnowledge(s);p.regions.bombay={...p.regions.bombay,control:'company',unrest:1};p.elephant={from:'punjab',to:'delhi'};
 const wounded=person(s,'bombay',{pride:95,vindictiveness:95});assert.equal(outlookCandidates(forecastRegion(p,'bombay'),wounded,80)[0].key,'09B-occupation-wounded');
 const before=clone(s);rulerSummaryHTML(s,'delhi');assert.deepEqual(s,before);
 assert.deepEqual(APPROVED_OUTLOOKS.filter(e=>e.blocked).map(e=>e.id),['09B-qualified-gratitude-conflicted','09B-qualified-gratitude-pragmatic','09B-commerce-anxious','09B-commerce-dismissive']);
 for(const id of allow)assert(!APPROVED_OUTLOOKS.find(e=>e.id===id).blocked);
});

test('mercantile evidence requires the exact printed adjacent cross-border route and both open endpoints',()=>{
 const f=roadCampaign(),s=f.state,proof=openCompanyRoutes(s.regions,s.elephant,'delhi');assert.deepEqual(proof,[{from:'delhi',to:'bombay',fromOrder:'d3',toOrder:'bo3n'}]);
 const c=forecastRegion(publicKnowledge(s),'delhi'),p=person(s,'delhi');assert(!has(outlookCandidates(c,p,80),road));p.routeEvidence=proof;assert(has(outlookCandidates(c,p,80),road));
 for(const mutate of [r=>r.bombay.orders.bo3n=false,r=>r.delhi.orders.d3=false,r=>r.bombay.control='indian',r=>r.delhi.overlord='punjab']){const r=clone(s.regions);mutate(r);assert.deepEqual(openCompanyRoutes(r,s.elephant,'delhi'),[]);}
 assert.deepEqual(openCompanyRoutes(s.regions,{from:'delhi',to:'madras'},'delhi'),[]);
 assert.deepEqual(openCompanyRoutes(s.regions,{from:'delhi',to:null},'delhi'),[]);
 // Other opportunities remain open, but none can replace this connection.
 const r=clone(s.regions);r.bombay.orders.bo3n=false;assert(r.bombay.orders.bo4);assert.deepEqual(openCompanyRoutes(r,s.elephant,'delhi'),[]);
});

test('a real route closure reconsiders the thought even when the ruler’s aggregate context is unchanged',()=>{
 const f=roadCampaign(),before=clone(f.state),old=clone(before.narrative.outlooks.delhi);assert.equal(old.templateId,road);assert.equal(old.version,3);
 f.step({type:'event',manualTest:true,event:'turmoil',topRegion:'bombay'});const after=f.state;
 assert.deepEqual(after.narrative.outlooks.delhi.context,old.context);assert.notEqual(after.narrative.outlooks.delhi.templateId,road);assert.deepEqual(after.narrative.outlooks.delhi.personal.routeEvidence,[]);
 assert.deepEqual(routesAtOutlook(after,old),old.personal.routeEvidence);
 const u=undoFrame(after,null,[before],[null],[]),saved=decode(encode(u.state,u.undo,u.progress,u.undoProgress,u.redo));assert.deepEqual(redoFrame(saved.state,saved.progress,saved.undo,saved.undoProgress,saved.redo).state,after);
 assert.deepEqual(decode(encode(before)).state,before);
 const forged=clone(before);forged.narrative.outlooks.delhi.personal.routeEvidence[0].toOrder='bo4';assert.throws(()=>validate(forged),/route proof/);
});

test('previous policy-2 words retain the original choices and are not upgraded by a harmless commit',()=>{
 const s=outlookFixture().state;
 for(const o of Object.values(s.narrative.outlooks)){
  o.version=2;o.selectionPolicy='09b-polish-1';delete o.personal.routeEvidence;
  const c={...s.narrative.characters[o.characterId],traits:o.personal.traits,confidence:o.personal.confidence,mood:o.personal.mood};
  o.templateId=outlookCandidates(o.context,{c,grievance:o.personal.grievance,helpful:o.personal.helpful,recentCategory:o.personal.recentCategory},o.personal.competence,o.selectionPolicy)[0].key;o.text=OUTLOOK_TEXT[o.templateId];
 }
 validate(s);assert.deepEqual(decode(encode(s)).state,s);
 const next=commitNarrative(s,resolveAction(s,{type:'event',manualTest:true,event:'windfall',topRegion:'delhi'}));assert.deepEqual(next.narrative.outlooks,s.narrative.outlooks);
 const p=person(s,'bombay'),context={...forecastRegion(publicKnowledge(s),'bombay'),issues:['occupied-discontent']};
 assert(!has(outlookCandidates(context,p,80,'09b-polish-1'),'09B-occupation-wounded'));assert(has(outlookCandidates(context,p,80),'09B-occupation-wounded'));
});
