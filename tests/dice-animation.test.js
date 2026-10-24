import test from 'node:test';
import assert from 'node:assert/strict';
import {dieMarkup,showDiceRoll} from '../dist/dice-animation.js';
import {openIndiaPhase} from '../dist/phase-dialog.js';
import {initialState} from '../dist/model.js';

function harness(reduced=false){
 const nodes=new Map(),timers=[];
 const element=()=>({textContent:'',disabled:false,open:true,classList:{remove(){}},close(){this.open=false;}});
 nodes.set('dialog',element());
 globalThis.document={getElementById:id=>nodes.get(id)};
 globalThis.matchMedia=()=>({matches:reduced});
 globalThis.setTimeout=fn=>{timers.push(fn);return timers.length;};globalThis.clearTimeout=()=>{};
 const showDialog=(title,body,actions='')=>{
  nodes.get('dialog').open=true;
  for(const m of (body+actions+'<p id="form-error"></p>').matchAll(/\bid="([^"]+)"/g))nodes.set(m[1],element());
 };
 return {nodes,timers,showDialog,click:id=>nodes.get(id).onclick()};
}

test('storm artwork uses six sides with duplicate plain fours and lands the manifest net correctly',()=>{
 const expected=[[720,810],[810,720],[720,630],[720,720],[630,720],[720,900]];
 for(let i=0;i<6;i++){
  const html=dieMarkup('storm',i);assert.match(html,new RegExp(`--land-x:${expected[i][0]}deg;--land-y:${expected[i][1]}deg`));
  assert.equal((html.match(/storm-none.png/g)||[]).length,2);assert.equal((html.match(/class="die-side /g)||[]).length,6);
 }
 for(let i=1;i<=6;i++)assert.match(dieMarkup('regular',i),/fill="white"/);
 assert.throws(()=>dieMarkup('storm',6));assert.throws(()=>dieMarkup('regular',0));
});

test('animation finishes on its saved result, permits skipping and continues only once without randomness',()=>{
 const h=harness();let calls=0;
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(){assert.fail('Animation cannot roll dice');}}});
 showDiceRoll({showDialog:h.showDialog,kind:'regular',value:3,summary:'Invasion die 3',onContinue:()=>calls++});
 assert.equal(h.timers.length,1);h.click('dice-continue');assert.equal(h.nodes.get('dice-status').textContent,'Invasion die 3');assert.equal(calls,0);
 h.click('dice-continue');h.click('dice-continue');assert.equal(calls,1);
});

test('closing or replacing the animation prevents its timer from altering another dialog',()=>{
 const h=harness();let calls=0;
 showDiceRoll({showDialog:h.showDialog,kind:'storm',value:0,summary:'East · 2',onContinue:()=>calls++});
 const oldButton=h.nodes.get('dice-continue'),oldStatus=h.nodes.get('dice-status');h.nodes.get('dialog').close();h.timers[0]();assert.equal(oldStatus.textContent,'');
 showDiceRoll({showDialog:h.showDialog,kind:'regular',value:5,summary:'Invasion die 5',onContinue:()=>calls++});
 oldButton.onclick();h.timers[0]();assert.equal(h.nodes.get('dice-status').textContent,'');assert.equal(calls,0);
 h.timers[1]();assert.equal(h.nodes.get('dice-status').textContent,'Invasion die 5');h.click('dice-continue');assert.equal(calls,1);
});

test('reduced motion displays the result immediately without scheduling a roll animation',()=>{
 const h=harness(true);let continued=false;
 showDiceRoll({showDialog:h.showDialog,kind:'storm',value:4,summary:'No storms · 4 events',onContinue:()=>continued=true});
 assert.equal(h.timers.length,0);assert.equal(h.nodes.get('dice-status').textContent,'No storms · 4 events');h.click('dice-continue');assert(continued);
});

test('storm result is committed before animation, double taps cannot reroll, and closing resumes saved phase',()=>{
 const h=harness();let state=initialState(),rolls=0;
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){rolls++;a[0]=0;return a;}}});
 const args={showDialog:h.showDialog,apply:r=>state=r.state,esc:String,drawEvent(){},blackmail(){}};
 openIndiaPhase({...args,state});const start=h.nodes.get('start-india-phase');start.onclick();start.onclick();
 assert.equal(rolls,1);assert.equal(state.indiaPhase.face,0);assert.equal(state.indiaPhase.status,'ships');assert(h.nodes.get('dice-roll'));
 h.nodes.get('dialog').close();openIndiaPhase({...args,state});assert(h.nodes.get('ships-resolved'));assert.equal(rolls,1);
});
