// Authored recommendation semantics, never inferred from the eventual result.
export const ADVICE_SEMANTICS={
 '09C-army-defend-professional':{stance:'conditional',qualification:['Losing it would invite a most thorough inquiry.'],confidenceTone:'professional'},
 '09C-army-defend-vain':{stance:'conditional',qualification:['Apparently I must first distinguish myself by retaining them.'],confidenceTone:'proud'},
 '09C-army-defend-calculating':{stance:'encourage',qualification:['Let us first make sure we have one.'],confidenceTone:'qualified'},
 '09C-army-expansion-careful':{stance:'conditional',qualification:['The expense of keeping it is usually learned at closer quarters.'],confidenceTone:'cautious'},
 '09C-army-expansion-hungry':{stance:'encourage',qualification:[],confidenceTone:'ambitious'},
 '09C-army-expansion-bureaucratic':{stance:'conditional',qualification:['who will be expected to administer it afterwards.'],confidenceTone:'administrative'},
 '09C-army-known-danger':{stance:'discourage',qualification:['an unfortunate moment to send our strength in search of further obligations.'],confidenceTone:'anxious'},
 '09C-army-known-danger-predatory':{stance:'encourage',qualification:['If disorder spreads'],confidenceTone:'conditional-opportunity'},
 '09C-army-recent-failure':{stance:'discourage',qualification:['I should dislike paying for a second.'],confidenceTone:'chastened'},
 '09C-army-recent-success':{stance:'neutral',qualification:['without recommending the fashion.'],confidenceTone:'reserved'},
 '09C-envoy-india-diplomat':{stance:'prefer-effect',qualification:['The court may find that wording less alarming.'],confidenceTone:'diplomatic'},
 '09C-envoy-india-cynic':{stance:'prefer-effect',qualification:[],confidenceTone:'cynical'},
 '09C-envoy-india-confident':{stance:'prefer-effect',qualification:['experience is strangely divided on the point.'],confidenceTone:'confident-not-certain'},
 '09C-china-office-plan':{stance:'prefer-effect',qualification:['I should prefer to have something to send it as well.'],confidenceTone:'eager-with-reservation'},
 '09C-china-prospects-uneasy':{stance:'neutral',qualification:['those expected to consume its wares.'],confidenceTone:'morally-uneasy'},
 '09C-governor-plan-tax':{stance:'prefer-effect',qualification:[],confidenceTone:'pragmatic'},
 '09C-exchange-prudence-vs-glory':[
  {stance:'discourage',qualification:['one more frontier to defend.'],confidenceTone:'professional'},
  {stance:'encourage',qualification:[],confidenceTone:'careerist'}
 ],
 // Approved but still unavailable as a 09C preview: retain the distinction for
 // future integration rather than treating acknowledged danger as a promise.
 '09C-army-strong-opponent-honest':{stance:'encourage',qualification:['considerable danger.'],confidenceTone:'explicit-risk'}
};
export const semanticsFor=(id,index=0)=>Array.isArray(ADVICE_SEMANTICS[id])?ADVICE_SEMANTICS[id][index]:ADVICE_SEMANTICS[id];
export function advicePlan(plan){
 if(plan.kind==='deploy')return {kind:'deploy',army:plan.army,target:plan.target};
 if(plan.kind==='governor')return {kind:'governor',region:plan.region};
 if(plan.kind==='envoy')return plan.purpose==='china'?{kind:'envoy',purpose:'china'}:{kind:'envoy',purpose:'order',order:plan.order};
 return {kind:'unsupported'};
}
export const planKey=p=>JSON.stringify(advicePlan(p));
export function intendedEffect(plan){
 if(plan.kind==='governor')return {kind:'tax',region:plan.region};
 if(plan.kind==='envoy')return plan.purpose==='china'?{kind:'china-office'}:{kind:'order',order:plan.order};
 return null;
}
