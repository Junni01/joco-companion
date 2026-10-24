// M2-26/27 approved experimental defaults. These affect fiction only.
export const POLITICAL_VERSION=2;
export const POLICY={id:'m2-trial-1',reinforce:12,reopen:20,reconcile:15,fade:2,memoryCooldown:3,templateCooldown:3,speakerCooldown:1,traitEvery:3,traitTurnCap:2};
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
