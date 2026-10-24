// Optional isolated browser verification. No application dependency is added.
const {chromium}=require(process.env.JOCO_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=(process.argv[2]||'http://127.0.0.1:4174/dist/').replace(/\/?$/,'/'),out=process.argv[3]||'chapter-browser';fs.mkdirSync(out,{recursive:true});
const review=path.resolve(__dirname,'../docs/narrative/review/collection08b-polish');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.JOCO_BROWSER_EXECUTABLE?{executablePath:process.env.JOCO_BROWSER_EXECUTABLE}:{})});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],checks=[];page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
  const click=async id=>{await page.locator('#'+id).click();if(await page.locator('#dialog').isVisible())assert.equal(await page.locator('#form-error').textContent(),'');};
  const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('jc-india-campaign-v1')));
  const load=async name=>{await click('save-menu');await page.locator('#file').setInputFiles(path.join(review,name));await click('confirm-choice');await page.locator('#dialog').waitFor({state:'hidden'});};
  const mark=s=>{checks.push(s);console.log('PASS',s);};
  await page.goto(base);await page.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();await load('before-first-chapter.json');
  const before=(await saved()).state;assert.equal(before.narrative.chapters.length,0);
  await click('game-actions');await page.locator('[data-action="next-turn"]').click();await click('review-action');assert.equal((await saved()).state.narrative.chapters.length,0);await click('confirm-action');
  const after=(await saved()).state,c=after.narrative.chapters[0];assert.equal(after.turn,before.turn+1);assert.equal(c.threads[0].templateId,'CH08-02');assert(c.lineIds.length===2);assert.equal(after.narrative.rng,before.narrative.rng);assert(await page.locator('#dialog').isHidden());
  mark('normal New Turn controls commit one evidence-backed chapter without rerolling or a personal-conversation interruption');
  await page.locator('[data-tab="register"]').click();const chapter=page.locator('.thematic-chapter').first();assert.equal(await chapter.locator('.record-report').textContent(),c.text);
  for(const [name,width,height] of [['desktop',1440,1000],['tablet',1024,768]]){
   await page.setViewportSize({width,height});await chapter.scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await chapter.screenshot({path:path.join(out,'thematic-chapter-'+name+'.png')});
  }
  await chapter.locator('.chapter-evidence > summary').click();assert((await chapter.innerText()).includes(c.lineIds[0]));assert((await chapter.innerText()).includes('Commerce has resumed'));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join(out,'chapter-evidence-tablet.png')});
  mark('desktop/tablet chapter text and optional clause/source evidence are readable without horizontal overflow');
  const exact=JSON.stringify(after);await page.locator('[data-tab="map"]').click();await click('undo');assert.equal((await saved()).state.narrative.chapters.length,0);await page.reload();await page.locator('#redo:not([disabled])').waitFor();await click('redo');assert.equal(JSON.stringify((await saved()).state),exact);
  mark('persisted Undo/Redo restores exact chapter words, parameters, evidence and RNG');
  await load('before-final-coda.json');const finalBefore=(await saved()).state;
  await click('game-actions');await page.locator('[data-action="end-game"]').click();await page.getByRole('button',{name:'Final turn completed',exact:true}).click();
  await click('review-action');assert.equal((await saved()).state.narrative.chapters.length,4);await click('confirm-action');const finalAfter=(await saved()).state;
  assert.equal(finalAfter.narrative.chapters.at(-1).threads[0].templateId,'CH08-FINAL-GRIEVANCE');assert.equal(finalBefore.narrative.rng,finalAfter.narrative.rng);
  await click('undo');await page.reload();await page.locator('#redo:not([disabled])').waitFor();await click('redo');assert.deepEqual((await saved()).state,finalAfter);
  mark('actual End game confirmation and persisted Undo/Redo save the exact eligible coda without RNG draws');
  await page.locator('[data-tab="register"]').click();assert.equal(await page.locator('.thematic-chapter').count(),5);assert.equal(await page.locator('.thematic-chapter').filter({hasText:'No substantial chapter for this turn'}).count(),1);
  const coda=page.locator('.thematic-chapter').last();assert((await coda.innerText()).includes('grievance had outlived the conquest'));
  await coda.scrollIntoViewIfNeeded();await coda.screenshot({path:path.join(out,'final-coda-tablet.png')});
  await coda.locator('.chapter-evidence > summary').click();assert((await coda.innerText()).includes('held the relevant seat at an earlier-turn conquest'));
  mark('final coda preserves the original ruler identity and optional personal/end-state proof at tablet width');
  await load('commercial-fallbacks.json');await page.locator('[data-tab="register"]').click();const fallback=page.locator('.thematic-chapter').nth(1);
  assert((await fallback.innerText()).includes('The earlier interruption'));assert((await fallback.innerText()).includes('the Company would have to make its own use of it'));
  for(const [name,width,height] of [['desktop',1440,1000],['tablet',1024,768]]){await page.setViewportSize({width,height});await fallback.scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await fallback.screenshot({path:path.join(out,'polished-fallback-'+name+'.png')});}
  await load('useful-partner-is-not-protection-proof.json');await page.locator('[data-tab="register"]').click();assert((await page.locator('.thematic-chapter').last().innerText()).includes('No substantial chapter'));
  mark('approved fallback prose renders at desktop/tablet sizes and a cooled personal grievance correctly leaves a quiet final page');
  await page.goto(new URL('../docs/narrative/review/collection08b-polish/commercial-memory.html',base).href);await page.locator('.thematic-chapter').first().waitFor();assert.equal(await page.locator('script').count(),0);assert((await page.locator('.thematic-chapter').first().innerText()).includes(c.text.split('\n\n')[0]));
  mark('HTML chronicle includes saved thematic chapters and evidence without runtime scripts');assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify({checks,errors,browser:await browser.version(),viewportChecks:['1440x1000','1024x768']},null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
