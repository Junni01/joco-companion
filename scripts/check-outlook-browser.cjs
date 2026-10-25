const {chromium}=require(process.env.JOCO_PLAYWRIGHT||'playwright');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://127.0.0.1:4174/dist/',out=process.argv[3]||path.join(os.tmpdir(),'outlook-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const {outlookFixture}=await import('../tests/outlook-fixtures.js'),{encode}=await import('../dist/model.js');
 const file=path.join(out,'synthetic-outlook-setup.json');fs.writeFileSync(file,encode(outlookFixture().initial));
 const browser=await chromium.launch({headless:true,executablePath:process.env.JOCO_BROWSER_EXECUTABLE});
 try{
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
  const click=async id=>{await page.locator('#'+id).click();if(await page.locator('#dialog').isVisible())assert.equal(await page.locator('#form-error').innerText(),'');};
  const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('jc-india-campaign-v1')));
  const mark=s=>{checks.push(s);console.log('PASS',s);};
  await page.goto(base);await page.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();await click('save-menu');await page.locator('#file').setInputFiles(file);await click('confirm-choice');
  const initial=await saved();
  await click('operations-deploy-bombay');await click('close-dialog');assert.deepEqual(await saved(),initial);mark('cancelled Deploy leaves private thoughts, knowledge and RNG unchanged');
  await click('events-phase-action');await click('manual-phase-storm');await page.locator('[data-phase-face="4"]').click();await click('confirm-phase-storm');await click('phase-map');await click('phase-next');
  assert.equal((await saved()).state.eventStack.pending.tileId,'madras-shuffle');assert.equal((await saved()).state.narrative.foresight.batch,null);
  await click('review-action');
  for(let i=0;i<8&&await page.locator('#continue-resolution-step').isVisible();i++)await click('continue-resolution-step');
  await click('confirm-action');await click('stack-region-done');
  const shuffled=(await saved()).state;assert.equal(shuffled.narrative.foresight.batch.remaining,3);assert.deepEqual(shuffled.narrative.foresight.batch.counts,{crisis:3});mark('actual Shuffle controls preserve March pages and commit the public unordered three-Crisis batch');
  const old=JSON.stringify(await saved());
  for(const region of ['delhi','bombay','delhi']){await page.locator('[data-tab="register"]').click();await page.locator(`[data-select="${region}"]`).click();assert(await page.locator('.outlook-text').isVisible());await click('ruler-profile');await click('close-dialog');}
  assert.equal(JSON.stringify(await saved()),old);await page.reload();await page.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();assert.equal(JSON.stringify(await saved()),old);mark('region selection, profile reads and reload preserve exact private text and public knowledge');
  for(const [label,width,height] of [['desktop',1440,1000],['tablet',1024,768]]){await page.setViewportSize({width,height});await page.locator('.ruler-summary').scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('.ruler-summary').screenshot({path:path.join(out,'outlook-'+label+'.png')});}
  await page.locator('.private-outlook summary').click();assert((await page.locator('.private-outlook').innerText()).includes('Order unknown'));mark('desktop/tablet private thought and optional public evidence render without overflow');
  await click('undo');assert.equal((await saved()).state.narrative.foresight.batch,null);await page.reload();await page.locator('#redo:not([disabled])').waitFor();await click('redo');assert.deepEqual((await saved()).state,shuffled);mark('persisted Undo/Redo restores the exact Shuffle outlook and batch');
  await click('phase-next');assert.equal((await saved()).state.narrative.foresight.batch.remaining,2);await click('close-dialog');await page.reload();assert.equal((await saved()).state.narrative.foresight.batch.remaining,2);mark('reveal consumes one known-batch member and protected reload does not consume it again');
  const regular=await saved();await page.goto(base+'debug.html?scenario=1710&reset=1&narrative=1');await page.locator('#debug-edit').waitFor();assert(await page.locator('.outlook-text').isVisible());assert.deepEqual(await saved(),regular);mark('debug entry has saved private outlooks and preserves regular storage');
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify({checks,errors,browser:await browser.version()},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
