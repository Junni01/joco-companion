export function workspaceKeys(path){
 // Hosting may rewrite location.pathname. The entry document owns its mode.
 // Explicit paths are still useful when copying between the two save stores.
 const mode=globalThis.document?.documentElement?.dataset?.workspaceMode;
 const debug=path!==undefined?path.endsWith('/debug.html'):mode==='debug'||(mode!=='regular'&&(globalThis.location?.pathname||'').endsWith('/debug.html'));
 return {debug,campaign:debug?'jc-india-debug-campaign-v1':'jc-india-campaign-v1',slots:debug?'jc-india-debug-slots-v1':'jc-india-slots-v1',progress:debug?'jc-india-debug-progress-v1':'jc-india-action-draft-v1',checkpoint:'jc-india-debug-checkpoint-v1'};
}
