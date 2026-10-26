const {chromium}=require(process.env.JOCO_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const base=(process.argv[2]||'http://127.0.0.1:4174/dist/').replace(/\/?$/,'/'),out=process.argv[3]||path.join(os.tmpdir(),'joco-weather-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const {initialState,correctRegion,encode}=await import('../dist/model.js'),{createNarrative}=await import('../dist/narrative.js'),{STORM_FACES}=await import('../dist/india-phase.js'),{createEventStack}=await import('../dist/event-stack.js'),{inParliament}=await import('../tests/phase-fixtures.js');
 const browser=await chromium.launch({headless:true,executablePath:process.env.JOCO_BROWSER_EXECUTABLE}),checks=[],errors=[];
 try{for(const [label,width,height]of [['desktop',1440,900],['tablet',1024,768]]){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',acceptDownloads:true}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);let debug=false;
 const key=()=>debug?'jc-india-debug-campaign-v1':'jc-india-campaign-v1',saved=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key());
 const click=async id=>{await page.locator('#'+id).click();if(await page.locator('#dialog').isVisible())assert.equal(await page.locator('#form-error').innerText(),'');};
 const choose=(group,name)=>page.getByRole('group',{name:group,exact:true}).getByRole('button',{name,exact:true}).click();
 const fixture=(n=true)=>{const s=initialState();s.eventStack=createEventStack(a=>{a[0]=0;return a;});if(n)s.narrative=createNarrative(s,717);return s;};
 const load=async(s,d=false)=>{debug=d;s=structuredClone(s);if(d)s.debugMode=true;await page.goto(base+(d?'debug.html':''));await page.waitForSelector('#events-phase-action');await page.evaluate(({key,payload})=>{localStorage.removeItem(key.includes('debug')?'jc-india-debug-progress-v1':'jc-india-action-draft-v1');localStorage.setItem(key,payload);},{key:key(),payload:encode(s)});await page.reload();await page.waitForSelector('#events-phase-action');};
 const rng=values=>page.evaluate(values=>{window.testRandomCalls=0;Object.defineProperty(crypto,'getRandomValues',{configurable:true,value(a){if(testRandomCalls>=values.length)throw Error('Unexpected gameplay RNG');a[0]=values[testRandomCalls++];return a;}});},values);
 const calls=()=>page.evaluate(()=>testRandomCalls);
 const noDice=async()=>assert.equal(await page.locator('#dialog .animated-die,#dialog #dice-roll,#dialog #roll-invasion').count(),0);
 const fit=async()=>{assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert(await page.locator('#dialog-content').evaluate(e=>e.scrollWidth<=e.clientWidth+1));};
 const hidden=async()=>{const text=await page.locator('body').innerText();assert(!/\b[1-4] India events?\b|0 \/ [1-4] events|Draw next event · 1 of/.test(text));};
 const mark=s=>{checks.push(label+': '+s);console.log('PASS',label,s);};
 for(const d of [false,true])for(let face=0;face<6;face++){
 await load(fixture(),d);await rng([face]);await click('events-phase-action');assert.equal(await page.locator('#manual-phase-storm').count(),0);await click('start-india-phase');await noDice();await hidden();assert.equal(await calls(),1);assert.equal((await saved()).state.indiaPhase.face,face);await fit();if(!d&&face===3)await page.locator('#dialog').screenshot({path:path.join(out,`storm-before-count-${label}.png`)});
 await click('close-dialog');await hidden();await page.locator('[data-tab="register"]').click();await hidden();await page.reload();await page.waitForSelector('#events-phase-action');await rng([]);await click('events-phase-action');await hidden();if(face<4){assert.equal(await page.locator('#calm-continue').count(),0);await click('ships-resolved');}else{assert.equal(await page.locator('#ships-resolved').count(),0);await click('calm-continue');}assert.equal(await page.locator('#dialog h3').innerText(),'Events ahead');assert((await page.locator('#dialog-content').innerText()).includes(`${STORM_FACES[face].events} India event`));assert.equal(await calls(),0);await noDice();if(!d&&face===3)await page.locator('#dialog').screenshot({path:path.join(out,`count-reveal-${label}.png`)});await click('events-revealed');await click('phase-map');
 const complete=(await saved()).state;await click('undo');if(face<4)assert.equal((await saved()).state.indiaPhase.status,'ships');else assert.equal((await saved()).state.indiaPhase,null);await click('redo');assert.deepEqual((await saved()).state,complete);
 // A fresh undo of the start retains its result without another random call.
 if(face<4)await click('undo');await click('undo');assert.equal((await saved()).progress.input.face,face);await click('events-phase-action');await noDice();await hidden();assert.equal((await saved()).state.indiaPhase.face,face);assert.equal(await calls(),0);await click('close-dialog');
 }
 mark('all six Narrative faces in regular/debug: one roll, hidden count in workspace/archive, calm/ship separation, delayed reveal, reload and protected Undo/Redo');
 for(const d of [false,true]){
 await load(fixture(false),d);await rng([3]);await click('events-phase-action');assert(await page.locator('#manual-phase-storm').isVisible());await click('start-india-phase');assert.equal(await page.locator('#dialog .animated-die').count(),1);if(!d)await page.locator('#dialog').screenshot({path:path.join(out,`normal-storm-die-${label}.png`)});await click('dice-continue');assert((await page.locator('#dialog-content').innerText()).includes('1 event'));await click('close-dialog');
 await load(fixture(false),d);await click('events-phase-action');await click('manual-phase-storm');await page.locator('[data-phase-face="4"]').click();await click('confirm-phase-storm');assert.equal((await saved()).state.indiaPhase.face,4);await click('phase-map');
 }
 mark('unchanged Normal graphical storm and manual physical storm option, regular/debug');
 const company=()=>{let s=fixture();for(const id of ['bombay','madras','bengal'])s=correctRegion(s,id,{control:'company',presidency:id,lootAvailable:false});return s;};
 const drain=async()=>{while(await page.locator('#continue-resolution-step').count())await click('continue-resolution-step');};
 for(const d of [false,true])for(const france of [false,true]){
 await load(france?inParliament(company()):company(),d);await rng([3,5,2,4]);await click(france?'phase-parliament':'game-actions');if(france){await click('france-action');await click('parliament-failed');await click('confirm-parliament-outcome');}else{await page.locator('[data-action="manual-event"]').click();await choose('Drawn event','Foreign Invasion');await choose('Region on exposed top tile','Mysore');await click('review-action');}
 await noDice();assert((await page.locator('.invasion-theatre').innerText()).includes('Bombay → Madras → Bengal'));assert.equal(await calls(),2);assert((await page.locator('#dialog-content').innerText()).includes('6 attack strength'));await fit();if(!d&&!france)await page.locator('#dialog').screenshot({path:path.join(out,`foreign-large-force-${label}.png`)});
 const pending=await saved();await click('close-dialog');await page.reload();await page.waitForSelector('#events-phase-action');await rng([]);await click('game-actions');await noDice();assert.deepEqual((await saved()).progress.input.rolls,pending.progress.input.rolls);assert.equal(await calls(),0);
 if(!d&&!france){await click('close-dialog');await click('save-menu');await click('snapshot');const promise=page.waitForEvent('download');await click('export');const file=path.join(out,`pending-invasion-${label}.json`);await(await promise).saveAs(file);await click('close-dialog');await load(fixture());await click('save-menu');await page.locator('#file').setInputFiles(file);await click('confirm-choice');assert.deepEqual((await saved()).progress.input,pending.progress.input);await load(fixture());await click('save-menu');await page.locator('[data-load="0"]').click();await click('confirm-choice');assert.deepEqual((await saved()).progress.input,pending.progress.input);await rng([]);await click('game-actions');assert.equal(await calls(),0);}
 await rng([2,4]);
 for(let i=0;i<3;i++){await noDice();const max=await page.locator('#defense').getAttribute('max');for(let j=0;j<Number(max);j++)await page.getByRole('button',{name:'Increase Total available strength exhausted',exact:true}).click();await click('report-defense');await drain();}
 assert.equal(await calls(),2);await click('confirm-action');const done=(await saved()).state;assert.deepEqual(done.history.at(-1).incident.input.rolls,{bombay:6,madras:3,bengal:5});await noDice();await click('story-done');if(france)await click('close-dialog');await click('undo');await click('redo');assert.deepEqual((await saved()).state,done);
 }
 mark('Foreign/France multi-target silent rolls at each defence boundary, numeric large-force UI, saved progress and exact restore in regular/debug');
 await context.close();
 }assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify({checks,errors,browser:await browser.version(),viewports:['1440x900','1024x768']},null,2)+'\n');}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
