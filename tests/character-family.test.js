import test from 'node:test';
import assert from 'node:assert/strict';
import {clone,validate,encode,decode} from '../dist/model.js';
import {characterCampaign,legacyCampaign} from './character-engine-fixtures.js';
import {dynastyFixture} from './character-family-fixtures.js';
import {familyOf,successionContext,validateFamilyState} from '../dist/narrative-family.js';
import {profileHTML,narrativeExportHTML} from '../dist/narrative-ui.js';
import {incidentReferences,assertHistoryDeletionAllowed} from '../dist/narrative-evidence.js';
import {commitNarrative} from '../dist/narrative.js';
import {resolveAction} from '../dist/actions.js';
import {undoFrame,redoFrame} from '../dist/transactions.js';
test('old M1 and prior current-version saves retain exactly 23 identities and original sibling links without schema backfill',()=>{
 for(const s of [characterCampaign(),legacyCampaign()]){const before=encode(s);validate(s);const f=familyOf(s,'ruler-delhi');assert.deepEqual(f,[{...s.narrative.characters['ruler-delhi'].family[0],legacy:true}]);assert.match(profileHTML(s,'ruler-delhi'),/younger sibling/);assert.equal(s.narrative.familyLinks,undefined);assert.equal(s.narrative.claimsV2,undefined);assert.equal(s.narrative.dynasties,undefined);assert.equal(Object.keys(s.narrative.characters).length,23);assert.equal(encode(decode(before).state),before);assert.equal(s.narrative.version,2);assert.equal(encode(s),before);}
});
test('single edges provide mutual spouse/former-spouse/widow, parent/child, adoption, guardians and explicit/derived siblings',()=>{
 const s=dynastyFixture(),ties=id=>familyOf(s,'demo-'+id).map(f=>f.tie+':'+f.id);
 assert(ties('widow').includes('late spouse:demo-founder'));assert(ties('founder').includes('surviving spouse:demo-widow'));assert(ties('rival').includes('former spouse:demo-former-spouse'));assert(ties('former-spouse').includes('former spouse:demo-rival'));assert(ties('son').includes('parent:demo-founder'));assert(ties('founder').includes('child:demo-son'));assert(ties('adopted').includes('adoptive parent:demo-founder'));assert(ties('widow').includes('ward:demo-child'));assert(ties('child').includes('guardian:demo-widow'));assert.equal(familyOf(s,'demo-son').filter(f=>f.id==='demo-daughter').length,1);assert(ties('founder').includes('sibling:demo-rival'));
});
test('marriage preserves natal identity/house and does not convey a throne or imply an unrecorded claim',()=>{
 const s=dynastyFixture(),c=s.narrative.characters['demo-widow'];assert.equal(c.dynastyId,'natal');assert.equal(c.dynasty,'Synthetic Natal House');assert.equal(c.dynastyAffiliations.length,2);assert.equal(s.narrative.seats.delhi,'ruler-delhi');s.narrative.claimsV2=s.narrative.claimsV2.filter(c=>c.claimantId!=='demo-widow');validate(s);assert(!successionContext(s,'delhi').claimants.some(c=>c.characterId==='demo-widow'));assert(!profileHTML(s,c.id).includes('Marriage derived'));
});
test('future context distinguishes recognised adult/child, widow, guardian, adopted and contested claims without selecting or ranking a successor',()=>{
 const s=dynastyFixture(),before=encode(s),ctx=successionContext(s,'delhi');assert(ctx.claimants.find(c=>c.characterId==='demo-son').designated);assert(ctx.claimants.find(c=>c.characterId==='demo-child').requiresRegent);assert(!ctx.claimants.find(c=>c.characterId==='demo-child').adult);assert(!ctx.claimants.find(c=>c.characterId==='demo-founder').available);assert(ctx.guardians.find(c=>c.characterId==='demo-widow'&&c.wardId==='demo-child').available);assert(ctx.widowed.some(c=>c.characterId==='demo-widow'&&c.currentlyUnmarried));assert.equal(ctx.successor,undefined);const bad=clone(s);bad.regions.unknown={};bad.narrative.claimsV2[1].region='unknown';assert.throws(()=>validateFamilyState(bad),/claim metadata/);assert.equal(encode(s),before);
 for(const condition of ['dead','presumed-dead','exiled','missing','imprisoned']){const f=dynastyFixture(),c=f.narrative.characters['demo-rival'];c.condition=condition;assert(!successionContext(f,'delhi').claimants.find(c=>c.characterId==='demo-rival').available);}
});
const reject=(title,mutate)=>test(title,()=>{const s=dynastyFixture();mutate(s.narrative,s);assert.throws(()=>validate(s));});
reject('self relationship and unknown character references rejected',n=>n.familyLinks[0].toId=n.familyLinks[0].fromId);
reject('dangling family endpoint rejected',n=>n.familyLinks[0].toId='constructor');
reject('biological/adoptive ancestry cycles rejected',n=>n.familyLinks.push({id:'cycle',type:'parent',fromId:'demo-son',toId:'demo-founder',ages:{from:22,to:0},origin:clone(n.familyLinks[0].origin)}));
reject('duplicate reversed pair edges rejected',n=>n.familyLinks.push({...clone(n.familyLinks[0]),id:'reversed',fromId:'demo-widow',toId:'demo-founder',ages:{from:23,to:37}}));
reject('underage marriage rejected at recorded time even after adulthood',n=>n.familyLinks[0].ages.to=17);
reject('impossible biological parent age rejected',n=>n.familyLinks.find(l=>l.id==='father-son').ages.from=12);
reject('underage adoptive parent rejected',n=>n.familyLinks.find(l=>l.id==='adoption').ages.from=17);
reject('underage guardian rejected',n=>n.familyLinks.find(l=>l.id==='guardian').ages.from=17);
reject('conflicting simultaneous spouses rejected',n=>n.familyLinks.push({id:'second',type:'spouse',fromId:'demo-widow',toId:'demo-rival',origin:clone(n.familyLinks[0].origin),ages:{from:23,to:20}}));
reject('known close-kin marriage rejected',n=>n.familyLinks.push({id:'incest',type:'spouse',fromId:'demo-son',toId:'demo-daughter',origin:clone(n.familyLinks[0].origin),ages:{from:22,to:19}}));
reject('presumed death is not proof of widowhood',n=>n.characters['demo-founder'].condition='presumed-dead');
reject('new relative requires explicit introduction',n=>delete n.characters['demo-child'].introduction);
reject('duplicate typed claim ID rejected',n=>n.claimsV2.push(clone(n.claimsV2[0])));
reject('unknown and future claim origins rejected',n=>n.claimsV2[1].origin.source.incidentId='future');
reject('unproven parentage/adoption/marriage claim rejected',n=>n.claimsV2.find(c=>c.id==='adopted-claim').support.familyLinkIds=['father-child']);
reject('claim inheritance cycle rejected',n=>{const a=n.claimsV2[0],b=n.claimsV2[1];a.support.claimIds=[b.id];a.origin=clone(b.origin);b.support.claimIds=[a.id];});
reject('claim current status must match recorded history',n=>n.claimsV2.find(c=>c.id==='rival-claim').status='asserted');
reject('claim cannot realise a throne without the actual seat',n=>n.claimsV2[1].status='realised');
reject('unknown house and retroactive natal-house erasure rejected',n=>n.characters['demo-widow'].dynastyId='unknown');
test('typed source/claim/house evidence cannot be deleted and complete save frames restore exactly',()=>{
 const s=dynastyFixture(),before=characterCampaign(),id=s.history.at(-1).incident.id;assert(incidentReferences(s,id).some(r=>r.startsWith('Dynastic claim')));assert.throws(()=>assertHistoryDeletionAllowed(s,[id]),/Dynastic claim/);const u=undoFrame(s,null,[before],[null],[]),r=redoFrame(u.state,u.progress,u.undo,u.undoProgress,u.redo);assert.deepEqual(r.state,s);assert.deepEqual(decode(encode(s)).state,s);assert.equal(profileHTML(s,'demo-child'),profileHTML(decode(encode(s)).state,'demo-child'));
});
test('dossier/export rendering is read-only, escaped, and shows sources and competing claim status without new controls',()=>{
 const s=dynastyFixture(),before=encode(s);assert.match(profileHTML(s,'demo-child'),/eligible regent/);assert.match(profileHTML(s,'demo-widow'),/late spouse/);assert.match(profileHTML(s,'demo-adopted'),/Contested/);assert.match(narrativeExportHTML(s),/Recorded house affiliations/);assert.equal(encode(s),before);s.narrative.characters['demo-widow'].name='<script>bad()</script>';assert(!profileHTML(s,'demo-child').includes('<script>'));
});
test('ordinary gameplay does not generate relatives, claims, gender, marriages or houses and preserves rules RNG/results',()=>{
 let s=characterCampaign();const original=clone(s.narrative.characters);for(let i=0;i<3;i++)s=validate(commitNarrative(s,resolveAction(s,{type:'event',event:'windfall',topRegion:'mysore',shape:'circle',manualTest:true})));assert.equal(Object.keys(s.narrative.characters).length,23);assert.equal(s.narrative.familyLinks,undefined);assert.equal(s.narrative.claimsV2,undefined);assert.equal(s.narrative.dynasties,undefined);for(const [id,c]of Object.entries(s.narrative.characters)){assert.deepEqual(c.family,original[id].family);assert.deepEqual(c.claims,original[id].claims);assert.equal(c.name,original[id].name);assert.equal(c.gender,undefined);}
});

reject('null typed collections are not silently treated as absent',n=>n.dynasties=null);
reject('null claim support is invalid',n=>n.claimsV2[0].support=null);
reject('null affiliation history is invalid',n=>n.characters['demo-widow'].dynastyAffiliations=null);
reject('typed ancestry cannot rewrite a known legacy younger sibling as a child',n=>n.familyLinks.push({id:'rewrite',type:'parent',fromId:'ruler-delhi',toId:'heir-delhi',ages:{from:30,to:0},origin:clone(n.familyLinks[0].origin)}));
reject('family relationship cannot predate the explicitly recorded birth',n=>{n.characters['demo-child'].introduction={kind:'birth',age:0,origin:clone(n.claimsV2[1].origin)};});
test('future context is region-related and an unavailable guardian is not represented as ready to act',()=>{const s=dynastyFixture();assert.equal(successionContext(s,'bombay').guardians.length,0);s.narrative.characters['demo-widow'].condition='imprisoned';assert(!successionContext(s,'delhi').guardians[0].available);});
test('legacy siblings and an explicit typed corroboration project once without inventing parents or sex',()=>{const s=characterCampaign();s.narrative.familyLinks=[{id:'known-siblings',type:'sibling',fromId:'ruler-delhi',toId:'heir-delhi',origin:{turn:s.turn,source:{setup:true},reason:'Explicit corroboration of the existing sibling record.'}}];validate(s);const f=familyOf(s,'ruler-delhi');assert.equal(f.length,1);assert.equal(f[0].tie,'younger sibling');assert.equal(s.narrative.characters['heir-delhi'].gender,undefined);assert(!s.narrative.familyLinks.some(l=>l.type==='parent'));});

test('typed records retain exact provenance across an ordinary New Turn without family generation or forced heir/regency changes',async()=>{
 const {inParliament}=await import('./phase-fixtures.js');let s=dynastyFixture();s=inParliament(s);s.parliamentFinishedTurn=s.turn;const old=clone(s),next=validate(commitNarrative(s,resolveAction(s,{type:'next-turn'})));assert.deepEqual(next.narrative.familyLinks,old.narrative.familyLinks);assert.deepEqual(next.narrative.claimsV2,old.narrative.claimsV2);assert.deepEqual(next.narrative.dynasties,old.narrative.dynasties);assert.deepEqual(next.narrative.seats,old.narrative.seats);assert.deepEqual(Object.keys(next.narrative.characters),Object.keys(old.narrative.characters));assert.match(profileHTML(next,'demo-daughter'),/father-daughter/);
});

test('explicit birth fixture requires coherent current age and follows existing +3 ageing, never live generation',async()=>{
 const {inParliament}=await import('./phase-fixtures.js');let s=characterCampaign();s=commitNarrative(s,resolveAction(s,{type:'event',event:'windfall',topRegion:'mysore',shape:'circle',manualTest:true}));const h=s.history.at(-1),origin={turn:s.turn,source:{incidentId:h.incident.id,actionType:'event'},reason:'Explicit test-only birth record, not caused by Windfall.'};const child=clone(s.narrative.characters['heir-delhi']);Object.assign(child,{id:'demo-newborn',name:'Synthetic newborn',age:0,family:[],claims:[],introduction:{kind:'birth',age:0,origin}});s.narrative.characters[child.id]=child;s.narrative.familyLinks=[{id:'newborn-parent',type:'parent',fromId:'heir-delhi',toId:child.id,origin,ages:{from:s.narrative.characters['heir-delhi'].age,to:0}}];validate(s);const bad=clone(s);bad.narrative.characters[child.id].age=6;assert.throws(()=>validate(bad),/birth\/age chronology/);s=inParliament(s);s.parliamentFinishedTurn=s.turn;const next=validate(commitNarrative(s,resolveAction(s,{type:'next-turn'})));assert.equal(next.narrative.characters[child.id].age,3);assert.equal(Object.keys(next.narrative.characters).length,24);
});
test('ended guardianship stays inspectable but is not current or eligible future regency context',()=>{const s=dynastyFixture(),l=s.narrative.familyLinks.find(l=>l.type==='guardian');l.end=clone(l.origin);validate(s);assert(familyOf(s,'demo-child').some(f=>f.tie==='former guardian'));assert.equal(successionContext(s,'delhi').guardians.length,0);});
