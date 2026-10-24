// Optional integration check; npm test and the application remain dependency-free.
const {chromium}=require(process.env.JOCO_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const os=require('node:os');
const base=(process.argv[2]||'http://127.0.0.1:4174/dist/').replace(/\/?$/,'/');
const out=process.argv[3]||path.join(os.tmpdir(),'joco-m2-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.JOCO_BROWSER_EXECUTABLE?{executablePath:process.env.JOCO_BROWSER_EXECUTABLE}:{})});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],checks=[];
  page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
  const click=async id=>{await page.locator('#'+id).click();if(await page.locator('#dialog').isVisible())assert.equal(await page.locator('#form-error').textContent().catch(()=>''),'');};
  const current=async(debug=false)=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),debug?'jc-india-debug-campaign-v1':'jc-india-campaign-v1');
  const mark=text=>{checks.push(text);console.log('PASS',text);};
  const selectBombay=async()=>{await page.locator('[data-tab="register"]').click();await page.locator('[data-select="bombay"]').click();};
  const deploy=async(regional=false)=>{
   await click(regional?'region-deploy-action':'deploy-action');await click('next-deploy');if(!regional)await click('next-deploy');
   for(let i=0;i<6;i++)await page.getByRole('button',{name:'Increase Regiments',exact:true}).click();
   for(let i=0;i<2;i++)await page.getByRole('button',{name:'Increase Officers',exact:true}).click();
   await click('next-deploy');await page.getByRole('button',{name:'1–2 · Success',exact:true}).click();await click('next-deploy');await click('next-deploy');
   const before=await current(page.url().includes('debug.html'));await click('next-deploy');return before;
  };
  const tax=async()=>{await click('region-governor-action');await click('governor-tax');await click('review-action');await click('confirm-action');};
  await page.goto(base);await page.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();
  await click('save-menu');await click('new-campaign');await click('narrative-on');await click('close-dialog');assert(!(await current()).state.narrative);
  await click('save-menu');await click('new-campaign');await click('narrative-on');await click('start-scenario');
  const preview=await deploy();assert.equal(preview.state.history.length,0);assert.equal(Object.keys(preview.state.narrative.memories).length,0);
  let saved=await current();assert.equal(saved.version,2);assert.equal(saved.state.regions.bombay.control,'company');
  const conquest=Object.values(saved.state.narrative.memories).find(m=>m.ownerId==='ruler-bombay'&&m.category==='company-conquest');assert(conquest);
  await selectBombay();await tax();saved=await current();assert(saved.state.history.at(-1).narrative.lines.some(l=>l.callbackMemoryIds.includes(conquest.id)));
  mark('normal touch controls: conquest, personal memory, grievance and Tax callback; preview is inert');
  await click('ruler-profile');await page.getByRole('heading',{name:'Defining memories',exact:true}).waitFor();await page.locator('#dialog-content .memory-evidence summary').first().click();
  assert((await page.locator('#dialog-content').innerText()).includes(conquest.createdIncident));
  await page.locator('#dialog').screenshot({path:path.join(out,'dossier-desktop.png')});await click('close-dialog');
  await click('region-governor-action');await click('governor-administer');await click('review-action');await click('confirm-action');
  await deploy(true);saved=await current();const statement=Object.values(saved.state.narrative.statements)[0];assert(statement);
  await tax();saved=await current();const quote=saved.state.history.at(-1).narrative.lines.find(l=>l.callbackStatementIds.includes(statement.id));assert(quote&&quote.text.includes(statement.text));
  await page.screenshot({path:path.join(out,'story-desktop.png'),fullPage:true});
  const exact=JSON.stringify(saved.state);await click('undo');await page.reload();await page.locator('#redo:not([disabled])').waitFor();await click('redo');assert.equal(JSON.stringify((await current()).state),exact);
  mark('intervention, partial reconciliation, saved assurance, exact quote and Undo/Redo across reload');
  await page.locator('[data-narrative-mode="quiet"]').click();assert.equal((await current()).state.narrative.intensity,'quiet');await page.locator('[data-narrative-mode="full"]').click();
  await click('save-menu');await click('snapshot');const download=page.waitForEvent('download');await click('menu-export-chronicle');await(await download).saveAs(path.join(out,'live-browser-chronicle.html'));await click('close-dialog');
  await selectBombay();await click('ruler-profile');await page.setViewportSize({width:390,height:844});
  assert(await page.locator('#dialog-content').evaluate(el=>el.scrollWidth<=el.clientWidth+1));await page.locator('#dialog').screenshot({path:path.join(out,'dossier-mobile.png')});await click('close-dialog');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join(out,'story-mobile.png'),fullPage:true});
  mark('dossier evidence, quiet/full, snapshot/export and 390px mobile layout');await page.setViewportSize({width:1440,height:1000});
  await click('events-phase-action');await click('manual-phase-storm');await page.locator('[data-phase-face="4"]').click();await click('confirm-phase-storm');await click('phase-map');await click('phase-next');
  const pending=await current();assert(pending.progress&&pending.state.eventStack.pending);await click('close-dialog');await page.reload();await page.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();assert.deepEqual(await current(),pending);
  await click('save-menu');await page.locator('#campaign-name').fill('M2 pending narrative campaign');await click('rename');assert.deepEqual((await current()).progress.input,pending.progress.input);await click('undo');assert.deepEqual((await current()).state,pending.state);await click('redo');
  mark('revealed tile/roll progress survives reload and metadata rename/Undo/Redo');
  for(const scenario of ['1758','1813','1710-long']){await click('save-menu');await click('new-campaign');await click('narrative-on');await page.locator(`[data-scenario="${scenario}"]`).click();await click('start-scenario');assert.equal((await current()).state.scenario,scenario);assert.equal((await current()).state.narrative.version,2);}
  mark('all four scenario starts');
  const regular=await current();await page.goto(base+'debug.html?scenario=1710&reset=1&narrative=1');await page.locator('#debug-edit').waitFor();assert.deepEqual(await current(),regular);
  await deploy();const debug=await current(true);assert(debug.state.narrative.memories);await click('debug-clear');await page.locator('#debug-confirm').click();assert((await page.locator('#form-error').innerText()).includes('support saved narrative evidence'));assert.deepEqual(await current(true),debug);assert(await page.locator('#dialog-content').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
  await click('close-dialog');await click('undo');assert.equal(Object.keys((await current(true)).state.narrative.memories).length,0);await click('redo');assert.deepEqual((await current(true)).state,debug.state);await page.screenshot({path:path.join(out,'debug-desktop.png'),fullPage:true});
  await page.goto(base);await page.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();assert.deepEqual(await current(),regular);
  mark('regular/debug isolation, named deletion blockers and unrestricted atomic Undo/Redo');
  // Old save rejection uses a different isolated browser context, never the user's storage.
  const oldContext=await browser.newContext(),oldPage=await oldContext.newPage();oldPage.on('pageerror',e=>errors.push(e.message));await oldPage.goto(base);await oldPage.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();
  const raw=JSON.stringify({...regular,version:1}),protectedOld='{"older":"protected progress"}';await oldPage.evaluate(({raw,protectedOld})=>{localStorage.setItem('jc-india-campaign-v1',raw);localStorage.setItem('jc-india-action-draft-v1',protectedOld);},{raw,protectedOld});await oldPage.reload();await oldPage.locator('#storage-alert').filter({hasText:'Unsupported development save version'}).waitFor();
  assert.equal(await oldPage.evaluate(()=>localStorage.getItem('jc-india-campaign-v1')),raw);assert.equal(await oldPage.evaluate(()=>localStorage.getItem('jc-india-action-draft-v1')),protectedOld);mark('incompatible save and protected bytes left unchanged, with clear rejection');
  await oldPage.goto(base+'?scenario=1710&reset=1&narrative=1');await oldPage.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();await oldPage.locator('#save-menu').click();assert(await oldPage.locator('#snapshot').isEnabled());assert(await oldPage.locator('#rename').isEnabled());mark('explicit new-campaign URL reset clears the unsupported-save gate');
  const reviewURL=new URL('../docs/narrative/review/m2/story-1710.html',base).href;await page.goto(reviewURL);await page.getByRole('heading',{name:'Political memories and their evidence',exact:true}).waitFor();assert.equal(await page.locator('script').count(),0);await page.screenshot({path:path.join(out,'printable-chronicle.png')});await page.getByRole('heading',{name:'Political memories and their evidence',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'printable-evidence.png')});
  assert.deepEqual(errors,[]);const report={checks,errors,browser:await browser.version(),viewportChecks:['1440x1000','390x844']};fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
