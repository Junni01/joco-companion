// Optional isolated browser check; the application has no Playwright dependency.
const {chromium}=require(process.env.JOCO_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=(process.argv[2]||'http://127.0.0.1:4174/dist/').replace(/\/?$/,'/'),out=process.argv[3]||'trade-browser';fs.mkdirSync(out,{recursive:true});
const review=path.resolve(__dirname,'../docs/narrative/review/collection08a');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.JOCO_BROWSER_EXECUTABLE?{executablePath:process.env.JOCO_BROWSER_EXECUTABLE}:{})});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],checks=[];page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
  const click=async id=>{await page.locator('#'+id).click();if(await page.locator('#dialog').isVisible())assert.equal(await page.locator('#form-error').textContent(),'');};
  const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('jc-india-campaign-v1')));
  const load=async name=>{await click('save-menu');await page.locator('#file').setInputFiles(path.join(review,name));await click('confirm-choice');await page.locator('#dialog').waitFor({state:'hidden'});};
  const select=async()=>{await page.locator('[data-tab="register"]').click();await page.locator('[data-select="bombay"]').click();};
  const deploy=async()=>{
   await click('operations-deploy-bombay');await page.getByRole('group',{name:'Target',exact:true}).getByRole('button',{name:'Bombay',exact:true}).click();await click('next-deploy');
   for(let i=0;i<6;i++)await page.getByRole('button',{name:'Increase Regiments',exact:true}).click();for(let i=0;i<2;i++)await page.getByRole('button',{name:'Increase Officers',exact:true}).click();
   await click('next-deploy');await page.getByRole('button',{name:'1–2 · Success',exact:true}).click();await click('next-deploy');await click('next-deploy');
   assert((await page.locator('#dialog-content').innerText()).includes('Open all its orders'));await click('next-deploy');
  };
  const turmoil=async region=>{await click('game-actions');await page.locator('[data-action="manual-event"]').click();await page.getByRole('group',{name:'Drawn event',exact:true}).getByRole('button',{name:'Turmoil',exact:true}).click();await page.getByRole('group',{name:'Region on exposed top tile',exact:true}).getByRole('button',{name:region.charAt(0).toUpperCase()+region.slice(1),exact:true}).click();await click('review-action');await click('confirm-action');};
  const mark=s=>{checks.push(s);console.log('PASS',s);};
  await page.goto(base);await page.locator('#save-status').filter({hasText:'Saved in this browser'}).waitFor();
  await load('before-military.json');await select();await deploy();
  let state=(await saved()).state,first=state.history.at(-1).narrative.lines.find(l=>l.templateId==='TR08-REST-SEC-01');assert(first);assert.deepEqual(state.narrative.statements[first.statementId].audienceIds,[]);
  await select();await turmoil('bombay');await select();await deploy();state=(await saved()).state;
  const later=state.history.at(-1).narrative.lines.find(l=>l.templateId==='TR08-REST-SEC-02');assert(later);assert.deepEqual(later.experienceLineIds,[first.id]);
  assert(!state.history.at(-1).narrative.lines.some(l=>l.templateId==='m2-assurance-orders'));
  mark('actual Commander controls retain Open all its orders instructions and select distinct saved commercial reactions');
  const exact=JSON.stringify(state);await click('undo');await page.reload();await page.locator('#redo:not([disabled])').waitFor();await click('redo');assert.equal(JSON.stringify((await saved()).state),exact);mark('saved personal experience, exact wording and RNG survive persisted Undo/Redo');
  await page.locator('[data-tab="register"]').click();await page.locator('[data-character="secretary-bombay"]').click();await page.locator('.dialogue-evidence > details > summary').click();
  const article=page.locator('.dialogue-evidence article').filter({hasText:later.text});await article.waitFor();assert((await article.innerText()).includes(first.text));
  for(const [name,width,height] of [['desktop',1440,1000],['tablet',1024,768]]){
   await page.setViewportSize({width,height});await article.scrollIntoViewIfNeeded();assert(await page.locator('#dialog-content').evaluate(el=>el.scrollWidth<=el.clientWidth+1));await page.locator('#dialog').screenshot({path:path.join(out,'commercial-experience-'+name+'.png')});
  }
  await click('close-dialog');mark('desktop and tablet dossiers expose owned earlier words and commercial evidence without horizontal overflow');
  await load('before-diplomacy.json');await select();await click('operations-envoy');await page.getByRole('group',{name:'Intended action',exact:true}).getByRole('button',{name:'Open Order in India',exact:true}).click();
  const orders=page.getByRole('group',{name:'Closed order outside Company control',exact:true});await orders.getByRole('button').first().click();await page.getByRole('group',{name:'Final check outcome',exact:true}).getByRole('button',{name:'Success',exact:true}).click();await click('review-action');assert((await page.locator('#dialog-content').innerText()).includes('closed-order marker'));await click('confirm-action');
  state=(await saved()).state;assert(state.history.at(-1).narrative.lines.some(l=>l.tradeKind==='trade-diplomacy'));assert(!state.history.at(-1).narrative.lines.some(l=>l.tradeKind==='trade-military'));mark('actual Special Envoy controls preserve component terminology and select diplomatic restoration only');
  await load('before-cascade.json');const input=JSON.parse(fs.readFileSync(path.join(review,'cascade-input.json'),'utf8'));await turmoil(input.topRegion);state=(await saved()).state;
  assert(state.history.at(-1).incident.facts.some(f=>f.type==='trade-cascade'));assert(state.history.at(-1).narrative.lines.some(l=>l.templateId==='TR08-CASC-CH-01'));mark('actual manual Turmoil triggers a genuine cascade with saved connected-opportunity evidence');
  await page.goto(new URL('../docs/narrative/review/collection08a/hostile-military.html',base).href);await page.getByRole('heading',{name:'Political memories and their evidence',exact:true}).waitFor();assert.equal(await page.locator('script').count(),0);
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify({checks,errors,browser:await browser.version(),viewportChecks:['1440x1000','1024x768']},null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
