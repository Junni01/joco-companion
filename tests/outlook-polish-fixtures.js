import {outlookFixture} from './outlook-fixtures.js';
import {deployment} from './m2-fixtures.js';
export function setProfile(f,region,traits={},confidence=50,competence=80){
 const c=f.state.narrative.characters[f.state.narrative.seats[region]];
 c.traits={ambition:20,pride:20,caution:20,ruthlessness:20,loyalty:20,vindictiveness:20,...traits};c.confidence=confidence;c.mood='watchful';
 f.state.narrative.foresight.aptitudes[c.id]=competence;
 f.state.narrative.outlooks={}; // Explicit fictional initial-profile setup, not a runtime personality mutation.
}
export function contrastingShuffle(){
 const f=outlookFixture();setProfile(f,'madras',{ambition:95,caution:5},75);setProfile(f,'hyderabad',{caution:95},40);setProfile(f,'mysore',{caution:90},90,10);f.shuffle();return f;
}
export function frontierOutlook(proud){
 const f=outlookFixture();setProfile(f,'bombay',proud?{pride:95,caution:5}:{pride:5,caution:95,loyalty:80},proud?55:40);f.step({type:'phase-start',face:4});return f;
}
export function grievanceShuffle(){const f=outlookFixture();f.step({type:'deploy',...deployment()});f.shuffle();return f;}
