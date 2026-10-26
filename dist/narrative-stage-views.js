import {workspaceKeys} from './workspace-mode.js';
// Local presentation journal survives Undo, not a statement, memory or game fact.
// Exported campaign/progress markers handle restoration on another device.
export function stageViewToken(state,attempt,scene){
 const cast=Object.values(state.narrative.characters).map(c=>[c.id,c.name,c.traits]);
 return JSON.stringify([cast,state.turn,attempt,scene.key,scene.templateId,scene.context]);
}
export function takeStageViews(state,attempt,scenes,presented=[],storage=globalThis.localStorage){
 if(!scenes.length)return [];
 const key=workspaceKeys().campaign+'-scene-views';let journal=[];
 try{const saved=JSON.parse(storage?.getItem(key)||'[]');if(Array.isArray(saved))journal=saved.filter(v=>typeof v==='string');}catch{}
 const fresh=scenes.filter(scene=>!presented.includes(scene.key)&&!journal.includes(stageViewToken(state,attempt,scene)));
 for(const scene of scenes){const token=stageViewToken(state,attempt,scene);if(!journal.includes(token))journal.push(token);}
 try{storage?.setItem(key,JSON.stringify(journal.slice(-256)));}catch{}
 return fresh;
}
