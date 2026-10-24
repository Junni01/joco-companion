// Frames include their protected physical progress. Redo restores, never resolves.
const copy=v=>JSON.parse(JSON.stringify(v));
export function undoFrame(state,progress,undo,undoProgress,redo){
 if(!undo.length)return null;
 const frames=copy(undo),progresses=copy(undoProgress),redone=copy(redo);
 redone.push({state:copy(state),progress:copy(progress)});
 return {state:frames.pop(),progress:progresses.pop()||null,undo:frames,undoProgress:progresses,redo:redone.slice(-20)};
}
export function redoFrame(state,progress,undo,undoProgress,redo){
 if(!redo.length)return null;
 const remaining=copy(redo),frame=remaining.pop();
 return {...frame,undo:[...copy(undo),copy(state)].slice(-20),undoProgress:[...copy(undoProgress),copy(progress)].slice(-20),redo:remaining};
}
