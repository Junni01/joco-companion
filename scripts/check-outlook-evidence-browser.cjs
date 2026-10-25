const {chromium}=require(process.env.JOCO_PLAYWRIGHT||'playwright');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://127.0.0.1:4174/dist/',out=process.argv[3]||path.join(os.tmpdir(),'outlook-evidence-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const {roadCampaign}=await import('../tests/outlook-evidence-fixtures.js'),{encode}=await import('../dist/model.js');
 const f=roadCampaign(),file=path.join(out,'synthetic-open-road.json');fs.writeFileSync(file,encode(f.state));
 const browser=await chromium.launch({headless:true,executablePath:process.env.JOCO_BROWSER_EXECUTABLE});
 try{
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
  const click=async id=>{await page.locator('#'+id).click();if(await page.locator('#dialog').isVisible())assert.equal(await page.locator('#form-error').innerText(),'');};
  const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('jc-india-campaign-v1')));
  const mark=s=>{checks.push(s);console.log('PASS',s);};
  await page.goto(base);await page.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();await click('save-menu');await page.locator('#file').setInputFiles(file);await click('confirm-choice');
  await page.locator('[data-tab="register"]').click();await page.locator('[data-select="delhi"]').click();const before=(await saved()).state;
  assert.equal(before.narrative.outlooks.delhi.templateId,'09B-company-border-mercantile');assert.equal(await page.locator('.outlook-text').innerText(),before.narrative.outlooks.delhi.text);
  for(const [label,width,height]of [['desktop',1440,1000],['tablet',1024,768]]){await page.setViewportSize({width,height});await page.locator('.ruler-summary').scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('.ruler-summary').screenshot({path:path.join(out,'open-road-'+label+'.png')});}
  await click('ruler-profile');await click('close-dialog');assert.deepEqual((await saved()).state,before);mark('exact approved open-road thought and specific route proof survive desktop/tablet rendering and profile reads');
  await click('game-actions');await page.locator('[data-action="manual-event"]').click();await page.getByRole('group',{name:'Drawn event',exact:true}).getByRole('button',{name:'Turmoil',exact:true}).click();await page.getByRole('group',{name:'Region on exposed top tile',exact:true}).getByRole('button',{name:'Bombay',exact:true}).click();await click('review-action');await click('confirm-action');
  const after=(await saved()).state;assert.equal(after.regions.bombay.orders.bo3n,false);assert.notEqual(after.narrative.outlooks.delhi.templateId,'09B-company-border-mercantile');assert.deepEqual(after.narrative.outlooks.delhi.context,before.narrative.outlooks.delhi.context);mark('actual manual Turmoil closes the specific Company endpoint and removes route eligibility despite unchanged ruler-side totals');
  await click('undo');assert.deepEqual((await saved()).state,before);await page.reload();await page.locator('#redo:not([disabled])').waitFor();await click('redo');assert.deepEqual((await saved()).state,after);mark('persisted Undo/Redo restores the exact previous words and route proof without rerolling');
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify({checks,errors,browser:await browser.version()},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
