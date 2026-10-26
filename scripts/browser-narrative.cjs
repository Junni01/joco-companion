// Legacy browser regressions still verify rules/storage; the dedicated 09D-2 suite
// checks these new read-only scene pages explicitly instead of dismissing them.
exports.finishNarrativePages=async page=>{
 if(await page.locator('#story-done').isVisible())await page.locator('#story-done').click();
 if(await page.locator('#anticipation-done').isVisible())await page.locator('#anticipation-done').click();
};

// Older regression scripts explicitly start a known calm phase. Narrative mode
// now obtains it automatically; this test-only RNG fixture replaces manual entry.
exports.beginCalmNarrative=async(page,click)=>{
 await page.evaluate(()=>{window.priorWeatherRng=crypto.getRandomValues;Object.defineProperty(crypto,'getRandomValues',{configurable:true,value(a){a[0]=4;return a;}});});
 await click('start-india-phase');await page.evaluate(()=>Object.defineProperty(crypto,'getRandomValues',{configurable:true,value:window.priorWeatherRng}));await click('calm-continue');await click('events-revealed');
};
