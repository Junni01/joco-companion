import {outlookFixture} from './outlook-fixtures.js';
import {setProfile} from './outlook-polish-fixtures.js';
import {deployment} from './m2-fixtures.js';
export function roadCampaign(){const f=outlookFixture();setProfile(f,'delhi',{caution:60,ruthlessness:10},50,90);f.step({type:'envoy',purpose:'order',region:'delhi',order:'d3',outcome:'success'});f.step({type:'deploy',...deployment()});return f;}
