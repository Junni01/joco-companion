// M2-26/27 approved experimental defaults. These affect fiction only.
export const POLITICAL_VERSION=2;
export const POLICY={
 id:'m2-trial-1',reinforce:12,reopen:20,reconcile:15,fade:2,memoryCooldown:3,globalCallbackCooldown:2,templateCooldown:3,speakerCooldown:1,
 traitEvery:3,traitTurnCap:2,traitDoubleChance:4,confidenceInitial:50,confidenceStep:6,voiceLevels:3,
 heirAwarenessFactor:.35,institutionAwarenessFactor:.6,defenderImportance:40,cautiousInterpretationThreshold:50,
 diminishingDenominator:125,baseFamiliarity:3,prideThreshold:60,prideBonus:1,reactionVariation:2,
 trustThreshold:50,loyaltyThreshold:60,mistrustThreshold:30,vindictivenessThreshold:60,
 rulerPriority:1000,majorPriority:100,adviserPriority:700,exchangePriority:1200,appearancePenalty:25,conquestRecallBonus:100,
 templateBaseWeight:10,conditionWeight:8,originalCatalogBonus:20,traitWeightDivisor:10,requiredTraitMinimum:40,recentBuffer:8,
 personalReply:{gratitude:3,respect:2,familiarity:3},personalResponse:{respect:2,familiarity:2}
};
// Trial selection thresholds for the first approved dialogue integration. No mechanical effects.
export const APPROVED_POLICY={highTrait:60,professionalCaution:50,bitterHostility:20,humour:1,restraint:2,formality:2,definingSignificance:75,callbackWeight:100,importanceDivisor:10};
// Collection 07 narrative-only trial thresholds.
export const POLISH_POLICY={activeGrievance:40,hostilityMinimum:20,alignmentMinimum:30,alignmentMargin:15,beneficialCauses:2,selectionBonus:120,routineUnrest:1};
export const SOVEREIGN_PROFILES={
 subordination:{significance:80,importance:65,emotion:'pride',hostility:0,respect:4},
 'rebellion-failed':{significance:60,importance:45,emotion:'pride',hostility:5},
 released:{significance:80,importance:70,emotion:'humiliation'},
 'rebellion-won':{significance:75,importance:70,emotion:'humiliation'}
};
export const MEMORY_PROFILES={
 'company-conquest':{significance:85,importance:80,emotion:'resentment',hostility:20,mistrust:6,strong:true},
 'company-loss':{significance:75,importance:65,emotion:'uncertainty',strong:true},
 'company-defence':{significance:60,importance:45,emotion:'relief',gratitude:10},
 'subordination':{significance:70,importance:65,emotion:'resentment',hostility:17,respect:4,strong:true},
 'released':{significance:75,importance:60,emotion:'relief',strong:true},
 'rebellion-won':{significance:85,importance:75,emotion:'pride',respect:4,strong:true},
 'rebellion-failed':{significance:65,importance:65,emotion:'humiliation',hostility:10,strong:true},
 'deployment-failed':{significance:60,importance:50,emotion:'disappointment',strong:true},
 'deployment-catastrophe':{significance:75,importance:70,emotion:'humiliation',strong:true},
 'tax':{significance:25,importance:25,emotion:'resentment',hostility:3},
 'tax-repeat':{significance:45,importance:45,emotion:'resentment',hostility:6,mistrust:2},
 'administration':{significance:35,importance:35,emotion:'concern',hostility:4},
 'intervention':{significance:60,importance:50,emotion:'gratitude',gratitude:9,respect:4,hostility:-7},
 'statement':{significance:40,importance:35,emotion:'expectation'}
};
export const DIMENSIONS=['hostility','respect','gratitude','mistrust','loyalty','familiarity'];
export const clamp=(n,min=0,max=100)=>Math.min(max,Math.max(min,n));
export function narrativeRandom(n,max){n.rng=(Math.imul(n.rng,1664525)+1013904223)>>>0;return Math.floor(n.rng/4294967296*max);}
