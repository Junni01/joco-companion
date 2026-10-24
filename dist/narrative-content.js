// Fictional combinations, not historical rulers. See docs/narrative/content-sources.md.
export const NAME_POOLS={
 punjab:['Farid','Karim','Salim','Rahim'],delhi:['Jalal','Kamal','Rashid','Hamid'],
 bengal:['Azim','Nasir','Latif','Murad'],bombay:['Govind','Madhav','Keshav','Narayan'],
 maratha:['Vishwanath','Raghunath','Balwant','Gopal'],hyderabad:['Qasim','Yusuf','Husain','Rafi'],
 mysore:['Chandra','Narasimha','Krishna','Deva'],madras:['Abdul','Anwar','Hasan','Mansur']
};
export const TRAITS=['ambition','pride','caution','ruthlessness','loyalty','vindictiveness'];
export const TRAIT_LABELS={ambition:'ambitious',pride:'proud',caution:'cautious',ruthlessness:'unyielding',loyalty:'steadfast',vindictiveness:'remembers grievances'};
export const BACKGROUNDS=[
 'The court prizes ceremony; its ruler prefers a concise petition.',
 'The household keeps an extensive archive and argues over its precedents.',
 'A small circle of relatives debates policy before the court assembles.',
 'The ruler cultivates a reputation for careful listening.'
];
// Stable IDs and explicit fact predicates. All dialogue is authored fiction.
export const TEMPLATES=[
 {id:'ruler-conquest-1',trigger:'company-conquest',role:'ruler',requires:['conquest'],emotion:'worried',tone:'guarded',text:'The Company has taken control of {region}. We shall have to discover what remains of our authority.'},
 {id:'ruler-conquest-2',trigger:'company-conquest',role:'ruler',requires:['conquest'],emotion:'angry',tone:'proud',trait:'pride',text:'The Company holds {region}. It does not follow that every question here has been answered.'},
 {id:'army-conquest-1',trigger:'company-conquest',role:'army',requires:['conquest'],emotion:'triumphant',tone:'dry',text:'The map can now be amended. The correspondence will take longer.'},
 {id:'ruler-deploy-failure-1',trigger:'deployment-failed',role:'ruler',requires:['failedDeployment'],emotion:'relieved',tone:'guarded',text:'The expedition has failed to change the position in {region}. We shall not mistake that for a permanent settlement.'},
 {id:'army-deploy-failure-1',trigger:'deployment-failed',role:'army',requires:['failedDeployment'],emotion:'worried',tone:'dry',text:'The expedition has failed. A shorter report would not improve its outcome.'},
 {id:'ruler-defence-1',trigger:'company-defence',role:'ruler',requires:['defended'],emotion:'relieved',tone:'guarded',text:'The attack on {region} has been repelled. For the moment, our arrangements remain.'},
 {id:'army-defence-1',trigger:'company-defence',role:'army',requires:['defended'],emotion:'relieved',tone:'dry',text:'The defence held. The Army must still account for what it has exhausted.'},
 {id:'ruler-loss-1',trigger:'company-loss',role:'ruler',requires:['lost'],emotion:'worried',tone:'guarded',text:'Company control of {region} has ended. We must now answer the questions it leaves behind.'},
 {id:'army-loss-1',trigger:'company-loss',role:'army',requires:['lost'],emotion:'sad',tone:'serious',text:'{region} has been lost. The physical reports record the Army consequences; they do not tell us the fate of every person.'},
 {id:'ruler-rebellion-win-1',trigger:'rebellion-won',role:'ruler',requires:['independent'],emotion:'triumphant',tone:'proud',text:'{region} is independent. We may begin answering our own correspondence.'},
 {id:'ruler-rebellion-fail-1',trigger:'rebellion-failed',role:'ruler',requires:['failedRebellion'],emotion:'worried',tone:'guarded',text:'The rebellion has failed. The political position in {region} remains unchanged.'},
 {id:'ruler-subject-1',trigger:'subordination',role:'ruler',requires:['joined'],emotion:'worried',tone:'guarded',text:'{region} now answers to {capital}. We shall remember how that arrangement began.'},
 {id:'ruler-freed-unknown-1',trigger:'released',role:'ruler',requires:['released'],emotion:'neutral',tone:'guarded',text:'The capital has fallen. {region} will now conduct its own affairs.'},
 {id:'ruler-freed-battle-1',trigger:'released',role:'ruler',requires:['released','battleOrigin'],emotion:'relieved',tone:'dry',text:'The rule imposed on {region} has ended with the capital. We shall attend to our own affairs.'},
 {id:'ruler-tax-first-1',trigger:'tax',role:'ruler',requires:['tax','firstTax'],emotion:'neutral',tone:'guarded',text:'A Tax has been reported in {region}. The first demand is seldom the last subject of discussion.'},
 {id:'ruler-tax-repeat-1',trigger:'tax',role:'ruler',requires:['tax','repeatedTax'],emotion:'angry',tone:'dry',text:'Another Tax in {region}. The demand is familiar; familiarity has not made it welcome.'},
 {id:'ruler-tax-general-1',trigger:'tax',role:'ruler',requires:['tax','generalTax'],emotion:'worried',tone:'guarded',text:'The Governor General has recorded a Tax in {region}. We shall consider what this administration asks of us.'},
 {id:'secretary-tax-1',trigger:'tax',role:'secretary',requires:['tax'],emotion:'neutral',tone:'dry',text:'The Tax has been recorded. The payment remains a matter for the physical table.'},
 {id:'ruler-admin-1',trigger:'administration',role:'ruler',requires:['administration'],emotion:'worried',tone:'guarded',text:'The administration in {region} has produced another matter for the court to consider.'},
 {id:'secretary-admin-1',trigger:'administration',role:'secretary',requires:['administration'],emotion:'worried',tone:'dry',text:'The recorded result has been circulated. We have retained room for the replies.'},
 {id:'ruler-intervention-1',trigger:'intervention',role:'ruler',requires:['intervention'],emotion:'neutral',tone:'guarded',text:'The intervention in {region} is complete. Restoring order does not settle every grievance.'},
 {id:'secretary-intervention-1',trigger:'intervention',role:'secretary',requires:['intervention'],emotion:'relieved',tone:'dry',text:'The prescribed changes are recorded. Our report will distinguish intervention from conquest.'},
 {id:'ruler-neutral-1',trigger:'summary',role:'ruler',requires:[],emotion:'neutral',tone:'guarded',text:'The court in {region} has taken note of the recorded developments.'}
].map(t=>({...t,provenance:'Authored fictional dialogue'}));
