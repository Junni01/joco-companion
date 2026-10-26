// Shared existing rules mapping; no narrative interpretation.
export function foreignTargets(d){return d.storm==='all'?['bombay','madras','bengal']:d.storm==='west'?['bombay']:d.storm==='south'?['madras']:d.storm==='east'?['bengal']:d.type==='france'?[]:[d.topRegion];}
