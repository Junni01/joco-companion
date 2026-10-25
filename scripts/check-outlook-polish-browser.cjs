const {chromium}=require(process.env.JOCO_PLAYWRIGHT||'playwright');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://127.0.0.1:4174/dist/',out=process.argv[3]||path.join(os.tmpdir(),'outlook-polish-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const {contrastingShuffle,frontierOutlook,grievanceShuffle}=await import('../tests/outlook-polish-fixtures.js'),{outlookFixture}=await import('../tests/outlook-fixtures.js');
 const {encode}=await import('../dist/model.js'),{legacyOutlookCandidates}=await import('../dist/narrative-outlooks.js'),{OUTLOOK_TEXT}=await import('../dist/narrative-outlook-content.js');
 const f=contrastingShuffle(),scenes={contrasts:f.state,proud:frontierOutlook(true).state,cautious:frontierOutlook(false).state,grievance:grievanceShuffle().state,legacy:outlookFixture().state};
 for(const o of Object.values(scenes.legacy.narrative.outlooks)){o.version=1;delete o.selectionPolicy;delete o.personal.mood;delete o.personal.recentCategory;delete o.personal.recentMemoryId;const c={...scenes.legacy.narrative.characters[o.characterId],traits:o.personal.traits,confidence:o.personal.confidence};o.templateId=legacyOutlookCandidates(o.context,{c,grievance:o.personal.grievance,helpful:o.personal.helpful},o.personal.competence)[0].key;o.text=OUTLOOK_TEXT[o.templateId];}
 for(const [name,state]of Object.entries(scenes))fs.writeFileSync(path.join(out,name+'.json'),encode(state,name==='contrasts'?[f.states.at(-2)]:[]));
 const browser=await chromium.launch({headless:true,executablePath:process.env.JOCO_BROWSER_EXECUTABLE});
 try{
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
  const click=async id=>{await page.locator('#'+id).click();if(await page.locator('#dialog').isVisible())assert.equal(await page.locator('#form-error').innerText(),'');};
  const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('jc-india-campaign-v1')));
  const load=async name=>{await click('save-menu');await page.locator('#file').setInputFiles(path.join(out,name+'.json'));await click('confirm-choice');await page.locator('#dialog').waitFor({state:'hidden'});};
  const select=async region=>{await page.locator('[data-tab="register"]').click();await page.locator(`[data-select="${region}"]`).click();};
  const mark=s=>{checks.push(s);console.log('PASS',s);};
  await page.goto(base);await page.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();await load('legacy');await select('delhi');
  const old=await saved();assert.equal(await page.locator('.outlook-text').innerText(),scenes.legacy.narrative.outlooks.delhi.text);await click('ruler-profile');await click('close-dialog');await page.reload();assert.deepEqual((await saved()).state,old.state);mark('earlier version-1 saved words survive import, region/profile reads and reload verbatim');
  await load('contrasts');const original=(await saved()).state;
  for(const r of ['madras','hyderabad','mysore']){await select(r);assert.equal(await page.locator('.outlook-text').innerText(),original.narrative.outlooks[r].text);}
  assert.deepEqual((await saved()).state,original);await click('undo');assert.equal((await saved()).state.narrative.foresight.batch,null);await page.reload();await page.locator('#redo:not([disabled])').waitFor();await click('redo');assert.deepEqual((await saved()).state,original);mark('three distinct approved Shuffle thoughts persist exactly through region selection and reload/Undo/Redo');
  await select('mysore');
  for(const [label,width,height] of [['desktop',1440,1000],['tablet',1024,768]]){await page.setViewportSize({width,height});await page.locator('.ruler-summary').scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('.ruler-summary').screenshot({path:path.join(out,'approved-outlook-'+label+'.png')});}
  mark('desktop/tablet approved private thoughts fit the selected-region panel without horizontal overflow');
  const words=[];for(const name of ['proud','cautious']){await load(name);await select('bombay');words.push(await page.locator('.outlook-text').innerText());}assert.notEqual(words[0],words[1]);mark('proud and cautious frontier variants retain their exact approved wording');
  await load('grievance');await select('bombay');const personal=(await saved()).state.narrative.outlooks.bombay;assert(personal.templateId.startsWith('09B-conquest-grievance-'));assert(personal.context.issues.includes('military-climate'));assert.equal(await page.locator('.outlook-text').innerText(),personal.text);mark('sourced personal grievance remains prominent despite general instability');
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify({checks,errors,browser:await browser.version()},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
