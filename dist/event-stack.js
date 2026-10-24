// Component facts recovered from the user's 15 October tile list and reference catalogue.
// Fresh implementation: back region and drawn-front symbol are distinct information.
export const EVENT_TILES=[
 {id:'delhi-crisis',region:'delhi',event:'crisis',modifier:0,shape:'triangle'},
 {id:'madras-windfall',region:'madras',event:'windfall'},
 {id:'madras-peace',region:'madras',event:'peace',shape:'triangle'},
 {id:'delhi-turmoil',region:'delhi',event:'turmoil'},
 {id:'hyderabad-leader',region:'hyderabad',event:'leader',modifier:4,shape:'triangle'},
 {id:'punjab-leader',region:'punjab',event:'leader',modifier:3,shape:'circle'},
 {id:'hyderabad-windfall',region:'hyderabad',event:'windfall'},
 {id:'bombay-crisis',region:'bombay',event:'crisis',modifier:1,shape:'square'},
 {id:'bombay-leader',region:'bombay',event:'leader',modifier:2,shape:'square'},
 {id:'punjab-turmoil',region:'punjab',event:'turmoil'},
 {id:'punjab-crisis',region:'punjab',event:'crisis',modifier:-1,shape:'circle'},
 {id:'maratha-turmoil',region:'maratha',event:'turmoil'},
 {id:'bengal-leader',region:'bengal',event:'leader',modifier:2,shape:'triangle'},
 {id:'madras-shuffle',region:'madras',event:'shuffle',shape:'circle'},
 {id:'mysore-peace',region:'mysore',event:'peace',shape:'square'},
 {id:'bombay-turmoil',region:'bombay',event:'turmoil'},
 {id:'mysore-crisis',region:'mysore',event:'crisis',modifier:2,shape:'square'},
 {id:'bengal-crisis',region:'bengal',event:'crisis',modifier:1,shape:'triangle'},
 {id:'maratha-foreign',region:'maratha',event:'foreign',shape:'circle'},
 {id:'maratha-crisis',region:'maratha',event:'crisis',modifier:3,shape:'circle'}
];
export const TILES=Object.fromEntries(EVENT_TILES.map(t=>[t.id,t]));
const ids=EVENT_TILES.map(t=>t.id),check=(ok,message)=>{if(!ok)throw Error(message);};
export function shuffled(values,random=crypto.getRandomValues.bind(crypto)){
 const result=[...values],bytes=new Uint32Array(1);
 for(let i=result.length-1;i>0;i--){const limit=Math.floor(4294967296/(i+1))*(i+1);do{random(bytes);}while(bytes[0]>=limit);const j=bytes[0]%(i+1);[result[i],result[j]]=[result[j],result[i]];}
 return result;
}
export const createEventStack=random=>({version:1,draw:shuffled(ids,random),discard:[],pending:null});
const sameSet=(a,b)=>Array.isArray(a)&&a.length===b.length&&new Set(a).size===a.length&&a.every(id=>b.includes(id));
export function validateEventStack(stack){
 check(stack?.version===1&&Array.isArray(stack.draw)&&Array.isArray(stack.discard),'Invalid event stack.');
 const all=[...stack.draw,...stack.discard,...(stack.pending?[stack.pending.tileId]:[])];check(sameSet(all,ids),'Event stack must contain each of the 20 tiles exactly once.');
 check(!stack.discard.includes('madras-shuffle'),'The Shuffle tile cannot remain in the discard pile.');
 if(stack.pending){
  const p=stack.pending,tile=TILES[p.tileId];check(!!tile,'Invalid pending tile.');
  check(p.emptyAfterDraw===(stack.draw.length===0),'Invalid pending stack state.');
  if(tile.event==='shuffle'){
   check(sameSet(p.rebuild?.draw,[...stack.draw,p.tileId]),'Invalid Shuffle draw-pile permutation.');
   check(sameSet(p.rebuild?.discards,stack.discard),'Invalid Shuffle discard permutation.');
  }else check(!p.rebuild&&stack.draw.length>0,'Only the Shuffle tile can empty the stack.');
 }else check(stack.draw.length>0,'The event stack is empty.');
 return stack;
}
export function drawRequest(stack,random){
 validateEventStack(stack);if(stack.pending)return {type:'stack-draw'};
 const tile=TILES[stack.draw[0]];
 return {type:'stack-draw',...(tile.event==='shuffle'?{rebuild:{draw:shuffled([...stack.draw.slice(1),tile.id],random),discards:shuffled(stack.discard,random)}}:{})};
}
export function reserveTile(stack,rebuild){
 validateEventStack(stack);if(stack.pending)return stack.pending;
 const tileId=stack.draw.shift();stack.pending={tileId,emptyAfterDraw:stack.draw.length===0,...(rebuild?{rebuild:JSON.parse(JSON.stringify(rebuild))}:{})};validateEventStack(stack);return stack.pending;
}
export function exposedRegion(stack){return stack?.draw?.length?TILES[stack.draw[0]]?.region:null;}
export function pendingEvent(stack){
 validateEventStack(stack);check(stack.pending,'Draw a tile first.');const p=stack.pending,tile=TILES[p.tileId];
 const top=p.emptyAfterDraw&&tile.event==='shuffle'?[...p.rebuild.discards,...p.rebuild.draw][0]:stack.draw[0];
 return {type:'event',stackTile:tile.id,event:tile.event,modifier:tile.modifier??0,shape:tile.shape||'',redirectShape:tile.shape||'',topRegion:TILES[top].region,emptyStack:p.emptyAfterDraw};
}
export function finishTile(stack){
 validateEventStack(stack);const p=stack.pending;check(p,'There is no revealed event to finish.');
 if(TILES[p.tileId].event==='shuffle'){stack.draw=[...p.rebuild.discards,...p.rebuild.draw];stack.discard=[];}
 else stack.discard.push(p.tileId);
 stack.pending=null;validateEventStack(stack);return stack;
}
