// Resolver-owned facts. Never derive facts from human-readable instruction text.
const copy=value=>JSON.parse(JSON.stringify(value));
export function incidentRecorder(before,after,input){
 const facts=[],baseline=copy(before.regions);
 return {
  add(type,data={}){facts.push({type,...copy(data)});},
  finish(){
   const sequence=(before.incidentSequence??before.history.length)+1;
   after.incidentSequence=sequence;
   const changes=Object.keys(baseline).filter(id=>JSON.stringify(baseline[id])!==JSON.stringify(after.regions[id])).map(region=>({region,before:baseline[region],after:copy(after.regions[region])}));
   return {version:1,id:'incident-'+sequence,type:input.type||'deploy',input:copy(input),turn:before.turn,scenario:before.scenario,provenance:input.manualTest?'manual-test':'gameplay',changes,facts:facts.map((f,i)=>({factId:'fact-'+i,...f})),elephant:{before:copy(before.elephant),after:copy(after.elephant)},laws:{before:copy(before.laws),after:copy(after.laws)}};
  }
 };
}
