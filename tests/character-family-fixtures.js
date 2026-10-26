// Explicit synthetic dynasty only. No production generator invokes this module.
import {characterCampaign} from './character-engine-fixtures.js';
import {clone,validate} from '../dist/model.js';
import {commitNarrative} from '../dist/narrative.js';
import {resolveAction} from '../dist/actions.js';
export function dynastyFixture(){
 let s=characterCampaign();for(let i=0;i<2;i++)s=commitNarrative(s,resolveAction(s,{type:'event',event:'windfall',topRegion:'mysore',shape:'circle',manualTest:true}));
 const n=s.narrative,origin=(index,reason='Explicit synthetic fixture record; not caused by Windfall.')=>({turn:s.turn,source:index===null?{setup:true}:{incidentId:s.history[index].incident.id,actionType:'event'},reason});
 const setup=()=>origin(null),one=()=>origin(0),two=()=>origin(1);
 n.dynasties={example:{id:'example',name:'Synthetic House of Example',origin:setup()},natal:{id:'natal',name:'Synthetic Natal House',origin:setup()}};
 const template=n.characters['heir-delhi'];
 for(const [name,age]of [['founder',60],['widow',46],['son',22],['daughter',19],['child',12],['adopted',16],['rival',38],['former-spouse',45]]){
  const c=clone(template);Object.assign(c,{id:'demo-'+name,name:'Synthetic '+name,age,dynasty:name==='widow'?'Synthetic Natal House':'Synthetic House of Example',family:[],claims:[],relations:{},incidents:[],memoryIds:[],politicalHistory:[],conditionHistory:[],introduction:{kind:'introduced',origin:setup()},dynastyId:name==='widow'?'natal':'example'});c.dynastyAffiliations=[{dynastyId:c.dynastyId,kind:'natal',origin:setup()}];n.characters[c.id]=c;
 }
 const founder=n.characters['demo-founder'];founder.condition='dead';founder.conditionHistory=[{from:'alive',to:'dead',turn:s.turn,source:one().source,reason:one().reason}];founder.politicalRole={kind:'former-ruler',region:'delhi'};founder.politicalHistory=[{from:{kind:'sovereign-ruler',region:'delhi'},to:{kind:'former-ruler',region:'delhi'},turn:s.turn,source:one().source,reason:one().reason}];
 n.characters['demo-widow'].gender={value:'woman',origin:setup()};n.characters['demo-daughter'].gender={value:'woman',origin:setup()};n.characters['demo-widow'].dynastyAffiliations.push({dynastyId:'example',kind:'marital',origin:setup()});
 const link=(id,type,from,to,ages,more={})=>({id,type,fromId:'demo-'+from,toId:'demo-'+to,origin:setup(),...(ages?{ages:{from:ages[0],to:ages[1]}}:{}),...more});
 n.familyLinks=[link('marriage','spouse','founder','widow',[37,23],{end:{...one(),outcome:'widowed',deceasedId:'demo-founder'}}),link('former-marriage','spouse','rival','former-spouse',[20,27],{end:{...one(),outcome:'divorced'}}),link('brothers','sibling','founder','rival'),link('adoption','adoptive-parent','founder','adopted',[50,6]),link('guardian','guardian','widow','child',[46,12],{origin:two()})];
 for(const [child,age]of [['son',22],['daughter',19],['child',12]]){n.familyLinks.push(link('father-'+child,'parent','founder',child,[60-age,0]),link('mother-'+child,'parent','widow',child,[46-age,0]));}
 const claim=(id,person,basis,standing='recognised',support={},at=two())=>({id,claimantId:'demo-'+person,region:'delhi',basis,status:'asserted',standing,origin:at,support,statusHistory:[]});
 n.claimsV2=[{...claim('founder-claim','founder','previous-rulership','recognised',{},one()),status:'dormant'},claim('son-claim','son','designation'),claim('daughter-claim','daughter','parentage','recognised',{familyLinkIds:['father-daughter'],claimIds:['founder-claim']}),claim('child-claim','child','parentage','recognised',{familyLinkIds:['father-child'],claimIds:['founder-claim']}),claim('adopted-claim','adopted','adoption','contested',{familyLinkIds:['adoption'],claimIds:['founder-claim']}),claim('widow-claim','widow','marriage-derived','contested',{familyLinkIds:['marriage'],claimIds:['founder-claim']}),{...claim('rival-claim','rival','witnessed-authority','contested',{},one()),status:'dormant',statusHistory:[{from:'asserted',to:'dormant',origin:two()}]}];
 return validate(s);
}
