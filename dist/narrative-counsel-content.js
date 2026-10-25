// Exact creatively approved Collection 09C wording. Guards are implemented separately.
export const COUNSEL_CATALOGUE=[
 {
  "id": "09C-army-defend-professional",
  "eligibility": "Legal defence / friendly-control target with actual local unrest or exposed threat",
  "voice": "Professional, cautious",
  "text": "Securing what we possess wins little praise. Losing it would invite a most thorough inquiry.",
  "selectable": true
 },
 {
  "id": "09C-army-defend-vain",
  "eligibility": "Same supported defence",
  "voice": "Proud",
  "text": "I had hoped to be remembered for acquiring provinces. Apparently I must first distinguish myself by retaining them.",
  "selectable": true
 },
 {
  "id": "09C-army-defend-calculating",
  "eligibility": "Same supported defence",
  "voice": "Opportunist",
  "text": "A secure frontier is an invitation to greater enterprise. Let us first make sure we have one.",
  "selectable": true
 },
 {
  "id": "09C-army-expansion-careful",
  "eligibility": "Legal conquest attempt against an independent neighbour",
  "voice": "Careful",
  "text": "A province is easily admired from a distance. The expense of keeping it is usually learned at closer quarters.",
  "selectable": true
 },
 {
  "id": "09C-army-expansion-hungry",
  "eligibility": "Same conquest target with actual legal opportunity",
  "voice": "Ambitious",
  "text": "If we wait until every neighbour welcomes our arrival, we shall never leave the Presidency.",
  "selectable": true
 },
 {
  "id": "09C-army-expansion-bureaucratic",
  "eligibility": "Same",
  "voice": "Administrative",
  "text": "I am less concerned with how we enter the province than with who will be expected to administer it afterwards.",
  "selectable": true
 },
 {
  "id": "09C-army-strong-opponent-prudent",
  "eligibility": "Legal attempt against a genuinely stronger displayed Indian position",
  "voice": "Competent/cautious",
  "text": "Their position is formidable. I should wish our enthusiasm to be accompanied by a suitable measure of preparation.",
  "selectable": false,
  "withheldReason": "No safe, stable relative Army force comparison; physical Army inventory is untracked."
 },
 {
  "id": "09C-army-strong-opponent-rash",
  "eligibility": "Same",
  "voice": "Confident/low aptitude",
  "text": "The size of their forces is most impressive. I trust they will find room to retreat.",
  "selectable": false,
  "withheldReason": "No safe, stable relative Army force comparison; physical Army inventory is untracked."
 },
 {
  "id": "09C-army-strong-opponent-honest",
  "eligibility": "Same",
  "voice": "Ambitious but competent",
  "text": "There is glory to be had here. I would be dishonest if I said there was not also considerable danger.",
  "selectable": false,
  "withheldReason": "No safe, stable relative Army force comparison; physical Army inventory is untracked."
 },
 {
  "id": "09C-army-weak-opponent-mercy",
  "eligibility": "Legal attempt against weaker displayed Indian position",
  "voice": "Restrained",
  "text": "Victory is one question. Whether we shall wish to be responsible for its consequences is quite another.",
  "selectable": false,
  "withheldReason": "No safe, stable relative Army force comparison; physical Army inventory is untracked."
 },
 {
  "id": "09C-army-weak-opponent-vain",
  "eligibility": "Same",
  "voice": "Vainglorious",
  "text": "A modest opponent offers a splendid opportunity to demonstrate extraordinary generalship.",
  "selectable": false,
  "withheldReason": "No safe, stable relative Army force comparison; physical Army inventory is untracked."
 },
 {
  "id": "09C-army-known-danger",
  "eligibility": "09A public known returned Crisis batch, and plan actually implicates current exposure",
  "voice": "Anxious",
  "text": "This is an unfortunate moment to send our strength in search of further obligations.",
  "selectable": true
 },
 {
  "id": "09C-army-known-danger-predatory",
  "eligibility": "Same",
  "voice": "Ambitious",
  "text": "If disorder spreads, someone will find a use for it. I should prefer it were us.",
  "selectable": true
 },
 {
  "id": "09C-army-recent-failure",
  "eligibility": "Adviser knows a real prior failed deployment by its institution; no unrecorded actor",
  "voice": "Chastened",
  "text": "We have already been offered one lesson in confidence. I should dislike paying for a second.",
  "selectable": true
 },
 {
  "id": "09C-army-recent-success",
  "eligibility": "Adviser knows one or more actual recent successful deployments",
  "voice": "Inflated confidence",
  "text": "Success has made caution distinctly unpopular. I note this without recommending the fashion.",
  "selectable": true
 },
 {
  "id": "09C-envoy-india-diplomat",
  "eligibility": "Intended specific eligible closed Order in non-Company Indian region",
  "voice": "Diplomatic",
  "text": "I should prefer to call it an invitation to commerce. The court may find that wording less alarming.",
  "selectable": true
 },
 {
  "id": "09C-envoy-india-cynic",
  "eligibility": "Same",
  "voice": "Cynical",
  "text": "We shall request the opening of trade with all proper courtesy. Courtesy is cheaper than concessions.",
  "selectable": true
 },
 {
  "id": "09C-envoy-india-confident",
  "eligibility": "Same",
  "voice": "Overconfident",
  "text": "The proposal is eminently reasonable. I expect that to count for something, though experience is strangely divided on the point.",
  "selectable": true
 },
 {
  "id": "09C-envoy-india-failure",
  "eligibility": "Actual reported failure for intended India Order; no order opens",
  "voice": "Dry",
  "text": "The mission has failed to produce an agreement. Fortunately, my report need not be quite so definite.",
  "selectable": false,
  "withheldReason": "Post-action outcome or control-delta commentary is deferred to 09D; no planning claim of an accomplished effect."
 },
 {
  "id": "09C-envoy-india-success",
  "eligibility": "Actual success and order really opens",
  "voice": "Self-satisfied",
  "text": "Commerce has found an opening. I shall refrain from examining whose interests it serves more generously.",
  "selectable": false,
  "withheldReason": "Post-action outcome or control-delta commentary is deferred to 09D; no planning claim of an accomplished effect."
 },
 {
  "id": "09C-governor-plan-tax",
  "eligibility": "Governor Administer planning; Tax is actually legal among eventual successful effects",
  "voice": "Fiscal/pragmatic",
  "text": "I recommend improving the Company's finances. It is difficult to govern a province upon promises alone.",
  "selectable": true
 },
 {
  "id": "09C-governor-plan-regiment",
  "eligibility": "Governor Administer planning; Commission Regiment is legally available",
  "voice": "Military-minded",
  "text": "Our neighbours may respect an argument more readily when we have men to defend it.",
  "selectable": false,
  "withheldReason": "Successful ship/regiment availability and full Administer effect lifecycle are not represented by the live resolver."
 },
 {
  "id": "09C-governor-plan-ship",
  "eligibility": "Governor Administer planning; Build Company Ship legally available",
  "voice": "Commercial",
  "text": "A ship would carry our interests further than another memorandum. I have written enough of those to be certain.",
  "selectable": false,
  "withheldReason": "Successful ship/regiment availability and full Administer effect lifecycle are not represented by the live resolver."
 },
 {
  "id": "09C-governor-plan-prudent",
  "eligibility": "Governor Administer planning; at least two successful effect options plausible",
  "voice": "Cautious",
  "text": "I should prefer an undertaking whose consequences we shall not spend the next year explaining.",
  "selectable": false,
  "withheldReason": "Successful ship/regiment availability and full Administer effect lifecycle are not represented by the live resolver."
 },
 {
  "id": "09D-governor-followed",
  "eligibility": "Successful check, committed effect matches this adviser's **actually saved** prior recommendation",
  "voice": "Pleased",
  "text": "I am relieved that my advice was of some use. One grows accustomed to the opposite.",
  "selectable": false,
  "withheldReason": "09D committed-advice/outcome follow-through is out of scope."
 },
 {
  "id": "09D-governor-overruled",
  "eligibility": "Successful check, player chooses legal effect other than adviser's **actually saved** recommendation",
  "voice": "Wounded pride",
  "text": "An interesting choice. I shall revise my memorandum to make room for it.",
  "selectable": false,
  "withheldReason": "09D committed-advice/outcome follow-through is out of scope."
 },
 {
  "id": "09D-governor-check-failed",
  "eligibility": "Real failed Administer check; no successful effect selected",
  "voice": "Dry",
  "text": "Our plans are extensive. Our achievements for the present are rather more modest.",
  "selectable": false,
  "withheldReason": "09D committed-advice/outcome follow-through is out of scope."
 },
 {
  "id": "09D-envoy-switched-to-china",
  "eligibility": "Successful Envoy check; initial actually visible India-opening preference, final legal choice establishes Superintendent in China",
  "voice": "Director's Secretary, resigned",
  "text": "China, then. I shall inform our Indian correspondents that their affairs have been temporarily overtaken by geography.",
  "selectable": false,
  "withheldReason": "09D committed-advice/outcome follow-through is out of scope."
 },
 {
  "id": "09D-envoy-switched-to-india",
  "eligibility": "Successful Envoy check; initial actually visible China office preference, final choice opens a legal Indian Order",
  "voice": "China assistant, disappointed",
  "text": "India has prevailed upon us once again. I shall try to look pleased on behalf of our future trade in China.",
  "selectable": false,
  "withheldReason": "09D committed-advice/outcome follow-through is out of scope."
 },
 {
  "id": "09C-china-office-plan",
  "eligibility": "Intended Superintendent creation, office absent",
  "voice": "Eager",
  "text": "A proper office for our interests in China would be a splendid beginning. I should prefer to have something to send it as well.",
  "selectable": true
 },
 {
  "id": "09C-china-office-created",
  "eligibility": "Successful Special Envoy genuinely establishes Superintendent",
  "voice": "Bureaucratic satisfaction",
  "text": "At last there is an office to which my memoranda may be addressed. Whether that constitutes progress remains to be seen.",
  "selectable": false,
  "withheldReason": "Post-action outcome or control-delta commentary is deferred to 09D; no planning claim of an accomplished effect."
 },
 {
  "id": "09C-china-office-failure",
  "eligibility": "Reported failed Special Envoy intended for China",
  "voice": "Dry",
  "text": "The establishment of an office in China has been delayed. I shall resist the temptation to call this a triumph of administrative restraint.",
  "selectable": false,
  "withheldReason": "Post-action outcome or control-delta commentary is deferred to 09D; no planning claim of an accomplished effect."
 },
 {
  "id": "09C-china-zero-access",
  "eligibility": "Actual zero printed opium icons across Company-controlled regions, office absent or present",
  "voice": "Sardonic",
  "text": "Our ambitions in China are admirably extensive. Our means of pursuing them are not.",
  "selectable": false,
  "withheldReason": "Printed opium metadata/thresholds and any comparative military-importance claim are not independently verified."
 },
 {
  "id": "09C-china-access-gain",
  "eligibility": "Committed territorial control change actually increases accessible printed opium icon total",
  "voice": "Obsessive",
  "text": "A new source of supply! I confess to finding this rather more exciting than the military particulars.",
  "selectable": false,
  "withheldReason": "Post-action outcome or control-delta commentary is deferred to 09D; no planning claim of an accomplished effect."
 },
 {
  "id": "09C-china-access-loss",
  "eligibility": "Committed territorial control change actually decreases accessible icon total",
  "voice": "Aggrieved",
  "text": "The loss of territory is regrettable. Its effect upon our prospects in China is positively intolerable.",
  "selectable": false,
  "withheldReason": "Post-action outcome or control-delta commentary is deferred to 09D; no planning claim of an accomplished effect."
 },
 {
  "id": "09C-china-no-change",
  "eligibility": "Successful conquest that adds zero opium icons; no claim of China trade",
  "voice": "Cynical",
  "text": "Another province acquired, and not a grain added to our prospects in China. I wonder whether the generals consult maps for anything but roads.",
  "selectable": false,
  "withheldReason": "Post-action outcome or control-delta commentary is deferred to 09D; no planning claim of an accomplished effect."
 },
 {
  "id": "09C-china-high-access",
  "eligibility": "Available opium total meaningfully high **only after board verified and thresholds established**",
  "voice": "Self-interested",
  "text": "India has been obliging to our commercial designs. I make a point of not asking whether it intended to be.",
  "selectable": false,
  "withheldReason": "Printed opium metadata/thresholds and any comparative military-importance claim are not independently verified."
 },
 {
  "id": "09D-warning-failure",
  "eligibility": "Same adviser actually gave saved discouraging advice for this committed deployment; reported deployment fails",
  "voice": "Vindicated but anxious",
  "text": "I advised against this undertaking. I had hoped my caution would prove unnecessary rather than correct.",
  "selectable": false,
  "withheldReason": "09D committed-advice/outcome follow-through is out of scope."
 },
 {
  "id": "09D-warning-success",
  "eligibility": "Same actual saved warning, deployment succeeds",
  "voice": "Proud restraint",
  "text": "I concede that it succeeded. I have not yet conceded that it was wise.",
  "selectable": false,
  "withheldReason": "09D committed-advice/outcome follow-through is out of scope."
 },
 {
  "id": "09D-advocate-failure",
  "eligibility": "Same adviser actually supported this committed deployment; it fails",
  "voice": "Evasive",
  "text": "My recommendation was sound in principle. Events have been uncommonly hostile to principle.",
  "selectable": false,
  "withheldReason": "09D committed-advice/outcome follow-through is out of scope."
 },
 {
  "id": "09D-advocate-success",
  "eligibility": "Same adviser actually supported and it succeeds",
  "voice": "Vain",
  "text": "I am pleased the expedition has confirmed what I had the good sense to recommend.",
  "selectable": false,
  "withheldReason": "09D committed-advice/outcome follow-through is out of scope."
 },
 {
  "id": "09D-callback-later-crisis",
  "eligibility": "Previous **committed** discouraging advice concerned loss of defence, plus subsequent actual related crisis; no causation inferred",
  "voice": "Bitter",
  "text": "I warned that we might be needed here. I had hoped to be wrong.",
  "selectable": false,
  "withheldReason": "09D committed-advice/outcome follow-through is out of scope."
 },
 {
  "id": "09C-china-prospects-commercial",
  "eligibility": "Real territorial acquisition prospect with verified printed opium access in target, no claimed shipment",
  "voice": "Commercial enthusiast",
  "text": "The province may be of little military consequence, but its produce interests me considerably more than its fortifications.",
  "selectable": false,
  "withheldReason": "Printed opium metadata/thresholds and any comparative military-importance claim are not independently verified."
 },
 {
  "id": "09C-china-prospects-accountant",
  "eligibility": "Actual committed loss of Company-accessible printed opium icons; institutional assistant exists",
  "voice": "Bureaucratic accountant",
  "text": "Our supply has diminished. I trust someone will explain this development to the Directors before they discover it themselves.",
  "selectable": false,
  "withheldReason": "Post-action outcome or control-delta commentary is deferred to 09D; no planning claim of an accomplished effect."
 },
 {
  "id": "09C-china-prospects-uneasy",
  "eligibility": "China-affairs assistant discussing opium trade policy or legitimate potential, without asserting completed transactions",
  "voice": "Morally conflicted",
  "text": "We speak rather freely of the advantages of this trade. I find we speak considerably less of those expected to consume its wares.",
  "selectable": true
 },
 {
  "id": "09C-exchange-prudence-vs-glory",
  "selectable": true,
  "eligibility": "Legal high-risk neighbouring conquest; one additional frontier; distinct cautious competent Army adviser and ambitious same-Presidency secretary.",
  "lines": [
   {
    "voice": "Professional",
    "text": "I advise restraint. A distant victory would leave us with one more frontier to defend."
   },
   {
    "voice": "Careerist",
    "text": "And restraint would leave us with precisely the same frontiers to explain to our superiors."
   }
  ]
 },
 {
  "id": "09C-exchange-frontier-vs-opium",
  "selectable": false,
  "withheldReason": "No verified printed opium access or supported military hold-risk comparison.",
  "lines": [
   {
    "voice": "Army adviser",
    "text": "The province will be difficult to hold. I see little advantage in acquiring responsibilities we can scarcely afford."
   },
   {
    "voice": "China assistant",
    "text": "Its commercial possibilities are considerable. I should be grateful if the military could trouble itself with the practicalities."
   }
  ]
 }
];
export const COUNSEL_BY_ID=Object.fromEntries(COUNSEL_CATALOGUE.map(e=>[e.id,e]));
export const WITHHELD_COUNSEL=COUNSEL_CATALOGUE.filter(e=>!e.selectable);
