// Optional browser verification; no application dependency.
const {chromium}=require(process.env.JOCO_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=(process.argv[2]||'http://127.0.0.1:4174/dist/').replace(/\/?$/,'/'),out=process.argv[3]||'collection07-browser';fs.mkdirSync(out,{recursive:true});
const fixtures=path.resolve(__dirname,'../docs/narrative/review/collection07');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.JOCO_BROWSER_EXECUTABLE?{executablePath:process.env.JOCO_BROWSER_EXECUTABLE}:{})});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],checks=[];
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
  const click=async id=>page.locator('#'+id).click();
  const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('jc-india-campaign-v1')));
  const load=async file=>{await click('save-menu');await page.locator('#file').setInputFiles(path.join(fixtures,file));await click('confirm-choice');await page.locator('#dialog').waitFor({state:'hidden'});};
  const mark=s=>{checks.push(s);console.log('PASS',s);};
  await page.goto(base);await page.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();
  await load('before-hostile-defence.json');const before=await saved();
  await click('game-actions');await page.locator('[data-action="manual-event"]').click();
  await page.getByRole('group',{name:'Drawn event',exact:true}).getByRole('button',{name:'Leader',exact:true}).click();
  await page.getByRole('group',{name:'Region on exposed top tile',exact:true}).getByRole('button',{name:'Bombay',exact:true}).click();await click('review-action');
  await page.locator('#report-defense').waitFor();const maximum=Number(await page.locator('#defense').getAttribute('max'));
  for(let i=0;i<maximum;i++)await page.getByRole('button',{name:'Increase Total available strength exhausted',exact:true}).click();
  await click('report-defense');assert.deepEqual((await saved()).state,before.state);await click('confirm-action');
  let after=await saved();const l=after.state.history.at(-1).narrative.lines.find(l=>l.speakerId==='ruler-bombay');
  assert(['FB07-DEF-RUL-01','FB07-REB-RUL-01','FB07-DEF-RUL-02'].includes(l.templateId));assert(l.selectionEvidence.length);assert(!/relieved/i.test(l.emotion));
  mark('normal controls suppress a real rebellion while the hostile ruler retains an evidence-backed hostile reaction');
  const exact=JSON.stringify(after.state);await click('undo');await page.reload();await page.locator('#redo:not([disabled])').waitFor();await click('redo');assert.equal(JSON.stringify((await saved()).state),exact);
  mark('political response, exact words and source evidence survive persisted Undo/Redo');
  await load('reconciliation.json');after=await saved();assert.equal(after.state.narrative.chapters.length,5);
  await page.locator('[data-tab="register"]').click();await page.getByRole('heading',{name:'Turn chapters',exact:true}).waitFor();await page.locator('[data-select="bombay"]').click();await click('ruler-profile');
  await page.locator('.dialogue-evidence > details > summary').click();
  const aligned=after.state.history.flatMap(h=>h.narrative?.lines||[]).find(l=>l.templateId==='FB07-DEF-RUL-03');assert(aligned);
  const article=page.locator('.dialogue-evidence article').filter({hasText:aligned.text});await article.waitFor();await article.locator('.memory-evidence summary').first().click();
  for(const [name,width,height] of [['desktop',1440,1000],['tablet',1024,768]]){
   await page.setViewportSize({width,height});await article.scrollIntoViewIfNeeded();assert(await page.locator('#dialog-content').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
   await page.locator('#dialog').screenshot({path:path.join(out,'political-evidence-'+name+'.png')});
  }
  mark('five-turn imported chronicle and changed political attitude are inspectable on desktop and tablet without horizontal overflow');
  await click('close-dialog');await page.reload();assert.equal((await saved()).state.narrative.chapters.length,5);
  await page.goto(new URL('../docs/narrative/review/collection07/reconciliation.html',base).href);await page.getByRole('heading',{name:'Political memories and their evidence',exact:true}).waitFor();assert.equal(await page.locator('script').count(),0);
  mark('multi-turn HTML chronicle is readable and script-free');assert.deepEqual(errors,[]);
  const report={checks,errors,browser:await browser.version(),viewportChecks:['1440x1000','1024x768']};fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify(report,null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
