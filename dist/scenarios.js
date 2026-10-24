// Scenario backs supplied by the player; turn numbers follow the printed board.
export const SCENARIOS={
 '1710':{name:'Early Company',label:'1710',start:1,end:5,board:'1710',laws:['royalProtection'],china:false,deregulationVote:false},
 '1758':{name:'Company Under Siege',label:'1758',start:3,end:7,board:'1758',laws:['calicoActs'],china:false,deregulationVote:true},
 '1813':{name:'Post Monopoly',label:'1813',start:5,end:8,board:'1813',laws:['governorGeneral','calicoActs','militaryOversight','deregulation'],china:true,deregulationVote:false},
 '1710-long':{name:'Long 1710',label:'Long 1710',start:1,end:8,board:'1710',laws:['royalProtection'],china:false,deregulationVote:true}
};
export const STARTING_BOARDS={
 '1710':{strength:[0,1,1,1,2,1,1,1],closed:['p7','d3','d5e','bo3s','ma3','h7','md4'],subjects:{punjab:'delhi',maratha:'delhi'},company:[],elephant:{from:'maratha',to:'delhi'}},
 '1758':{strength:[1,1,0,2,2,1,2,1],closed:['p7','d3','d5e','h7','my6','md5','md4'],subjects:{punjab:'delhi'},company:['bengal'],elephant:{from:'delhi',to:'bengal'}},
 '1813':{strength:[2,1,0,0,2,1,2,0],closed:['p7','d3','d5e','be5','be6','ma3','md4'],subjects:{},company:['bombay','madras','bengal'],elephant:{from:'mysore',to:'madras'}}
};
export const scenarioFor=s=>SCENARIOS[s.scenario];
export const finalTurn=s=>s.turn>=scenarioFor(s).end;
export const scenarioCaption=s=>`${scenarioFor(s).label} scenario · Turn ${s.turn} of ${scenarioFor(s).end}`;
export function setupInstructions(id){
 const c=SCENARIOS[id],b=STARTING_BOARDS[c.board];
 return [
  `Place the turn marker on ${c.start}; this scenario ends after turn ${c.end} (${c.end-c.start+1} rounds). Set the Prime Minister dial to ${c.board}.`,
  `Company Balance starts at £5. Standing starts above £${id==='1758'?12:10} expectations; Debt starts at ${id==='1758'?3:0}. Place £${id==='1758'?4:3} in every Company treasury.`,
  id==='1813'?'Place 2 regiments in each Army and 1 Company ship in each sea zone.':'Place 1 regiment in each Army. '+(id==='1758'?'Place 1 Company ship in East Indian Ocean.':'There are no starting Company ships.'),
  `Use the ${c.board} player setup cards, including the appropriate extra cards for your player count. Set up local alliances and shuffle the India event tiles.`,
  id==='1813'?'Place Military Oversight, Calico Acts and Deregulation (Debtor’s Prison side) near play. Install the Governor General overlay, open the China office and put the three control tokens in their matching Presidencies. Place the +2/−2 VP Company-share overlay in the Court.':id==='1758'?'Place Calico Acts near play and put the Bengal control token in the Bengal Presidency.':'Place Royal Protection near play.',
  b.company.length?`Company control starts in ${b.company.join(', ')}. Their loot tokens have already been removed; do not pay starting loot.`:'All regions start under Indian control with their loot tokens available.',
  ...(c.deregulationVote?['Before London Season on later turns, check Standing and Debt for an optional (lined space) or mandatory (starred space) special Deregulation vote. Record its outcome in Game actions.']:[])
 ];
}
