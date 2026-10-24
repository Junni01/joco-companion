// Keep the existing form/change contracts while presenting every choice as a touch button.
export function enhanceChoices(root){
 const cleanups=[];
 root.querySelectorAll('select').forEach(select=>{
  const name=select.closest('label')?.childNodes[0]?.textContent.trim()||'Choose an option';
  const group=document.createElement('span');group.className='choice-buttons';group.setAttribute('role','group');group.setAttribute('aria-label',name);
  select.hidden=true;select.tabIndex=-1;select.after(group);
  const sync=()=>{
   group.replaceChildren();
   [...select.options].forEach(option=>{
    if(option.hidden||(!option.value&&/choose.*…/i.test(option.textContent)))return;
    const button=document.createElement('button');button.type='button';button.className='choice-button';button.textContent=option.textContent;
    button.disabled=select.disabled||option.disabled;button.setAttribute('aria-pressed',String(select.value===option.value));
    button.onclick=e=>{e.preventDefault();select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));};
    group.append(button);
   });
   if(!group.children.length){const empty=document.createElement('span');empty.className='small-note';empty.textContent='No available choices.';group.append(empty);}
  };
  // Update state without replacing the focused button after a selection.
  const update=()=>{[...group.querySelectorAll('button')].forEach(button=>button.setAttribute('aria-pressed',String(button.textContent===[...select.options].find(o=>o.value===select.value)?.textContent)));};
  select.addEventListener('change',update);
  const observer=new MutationObserver(sync);observer.observe(select,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','hidden','selected']});
  sync();cleanups.push(()=>{observer.disconnect();select.removeEventListener('change',update);});
 });
 return ()=>cleanups.forEach(cleanup=>cleanup());
}
