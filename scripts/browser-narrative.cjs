// Legacy browser regressions still verify rules/storage; the dedicated 09D-2 suite
// checks these new read-only scene pages explicitly instead of dismissing them.
exports.finishNarrativePages=async page=>{
 if(await page.locator('#story-done').isVisible())await page.locator('#story-done').click();
 if(await page.locator('#anticipation-done').isVisible())await page.locator('#anticipation-done').click();
};
