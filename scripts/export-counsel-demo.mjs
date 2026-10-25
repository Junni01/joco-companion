// Small reproducible creative-review demonstration; never runtime dialogue generation.
import fs from 'node:fs';
import path from 'node:path';
import {counselState,profile,dissentState} from '../tests/counsel-fixtures.js';
import {createCounselSession} from '../dist/narrative-counsel.js';
const output=path.resolve(process.argv[2]||'docs/narrative/collection09c2-demo.md');
const rows=[];
for(const [voice,seed]of [['careful',717],['ambitious',1234]]){
 const s=counselState('bombay',seed);profile(s,'army-bombay',voice);
 rows.push({label:`Bombay → Delhi, ${voice} adviser`,proof:'The same legal plan against an independent neighbouring empire capital; Bombay is Company-controlled. Alternative synthetic campaigns, not a personality change during play.',preview:createCounselSession(s).preview({kind:'deploy',army:'bombay',target:'delhi'})});
}
{
 const s=counselState();profile(s,'secretary-general','careful');rows.push({label:'Director: a particular Indian commercial opening',proof:'Delhi £3 Order is closed and Delhi is outside Company control.',preview:createCounselSession(s).preview({kind:'envoy',purpose:'order',order:'d3'})});
}
for(const voice of ['confident','uneasy']){
 const s=counselState('bombay',voice==='confident'?717:1234);profile(s,'secretary-bengal',voice);profile(s,'secretary-general','careful');const session=createCounselSession(s);
 if(voice==='uneasy')session.preview({kind:'envoy',purpose:'order',order:'d3'});
 rows.push({label:voice==='confident'?'China affairs: eager office planning':'China affairs: moral unease after a reported success and changed intention',proof:'Superintendent office absent; intended creation is legal. No available-opium quantity, shipment, completed trade or payment is asserted.'+(voice==='uneasy'?' Displayed as AFTER THE REPORTED CHECK, never as an earlier warning.':''),preview:session.preview({kind:'envoy',purpose:'china'},voice==='uneasy'?'success':'')});
}
{
 const s=dissentState(),preview=createCounselSession(s).preview({kind:'deploy',army:'madras',target:'hyderabad'});rows.push({label:'Rare intact disagreement: Madras → Hyderabad',proof:'Actual Shuffle, storm acknowledgement, phase finish, Parliament and New Turn resolvers leave three publicly known unordered Crisis events. Madras is exposed. This legal hypothetical conquest raises Company frontier-neighbour count from 2 to 3. Distinct cautious/competent adjutant and ambitious same-Presidency secretary are eligible.',preview});
}
let text='# Collection 09C-2 — Small creative-review demonstration\n\nSynthetic board/cast setups and explicit personality alternatives; they are not personal campaigns or newly recorded dialogue history. The rare-danger setup advances through actual game resolvers. All quotations are exact approved authored text selected by production code. These examples demonstrate integration, not final creative acceptance.\n\n';
for(const [i,row]of rows.entries()){
 if(!row.preview)throw Error('Missing demonstration: '+row.label);
 text+=`## ${i+1}. ${row.label}\n\n${row.proof}\n\n`;
 for(const line of row.preview.lines)text+=`**${line.speaker}** (${line.speakerId}; ${line.role}):\n\n> ${line.renderedText}\n\n`;
 text+=`Selected: \`${row.preview.templateId}\`.\n\n`;
}
text+='Quiet cases: first home footholds without a qualifying context, routine order-only military interventions, and China assistants without an eligible eager/uneasy voice may have no counsel. Unverified opium-dependent and relative-force passages remain withheld. Preview text is never archived or turned into a later warning in this milestone.\n';
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,text);console.log('Wrote small adviser demonstration.');
