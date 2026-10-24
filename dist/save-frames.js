// Serialize each immutable frame once. Large campaigns must not stringify the
// entire 40-frame undo/redo history again for every frame removed by the cap.
const bytes=text=>new TextEncoder().encode(text).length;
const stringify=value=>JSON.stringify(value,null,2);
export function encodeFrames(base,limit=6000000){
 const frames=base.undo.map((state,i)=>({text:stringify(state),progress:stringify(base.undoProgress[i])}));
 const redo=(base.redo||[]).map(stringify);
 const main={format:base.format,version:base.version,state:base.state,progress:base.progress};
 const prefix=stringify(main).slice(0,-2);
 const render=()=>prefix+',\n  "undo": ['+frames.map(f=>f.text).join(',\n')+'],\n  "undoProgress": ['+frames.map(f=>f.progress).join(',\n')+']'+(redo.length?',\n  "redo": ['+redo.join(',\n')+']':'')+'\n}';
 const frameBytes=frames.map(f=>bytes(f.text)+bytes(f.progress)),redoBytes=redo.map(bytes);
 // An empty rendering has the same fixed keys, with four [] bracket bytes.
 const emptyBytes=bytes(prefix+',\n  "undo": [],\n  "undoProgress": []\n}');
 const total=()=>emptyBytes+frameBytes.reduce((a,b)=>a+b,0)+Math.max(0,frames.length-1)*4+(redo.length?bytes(',\n  "redo": []')+redoBytes.reduce((a,b)=>a+b,0)+Math.max(0,redo.length-1)*2:0);
 while(total()>=limit&&redo.length){redo.shift();redoBytes.shift();}
 while(total()>=limit&&frames.length){frames.shift();frameBytes.shift();}
 const text=render();if(bytes(text)>=limit)throw Error('Campaign is too large to save. Export a readable chronicle before starting another campaign.');
 return text;
}
