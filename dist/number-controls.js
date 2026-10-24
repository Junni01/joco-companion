// Enhance every dialog number field while preserving its value and change contract.
export function enhanceNumbers(root){
 const observers=[];
 root.querySelectorAll('input[type="number"]').forEach(input=>{
  const label=input.closest('label'),name=label?.textContent.trim()||'Value';
  input.setAttribute('aria-label',name);input.readOnly=true;input.inputMode='none';
  const wrap=document.createElement('span');wrap.className='number-control';
  input.before(wrap);wrap.append(input);
  const minus=document.createElement('button'),plus=document.createElement('button');
  for(const [button,delta,text] of [[minus,-1,'−'],[plus,1,'+']]){
   button.type='button';button.textContent=text;button.setAttribute('aria-label',`${delta<0?'Decrease':'Increase'} ${name}`);
   button.onclick=e=>{e.preventDefault();if(input.disabled)return;delta<0?input.stepDown():input.stepUp();sync();input.dispatchEvent(new Event('change',{bubbles:true}));};
  }
  wrap.prepend(minus);wrap.append(plus);
  const sync=()=>{const value=Number(input.value);minus.disabled=input.disabled||(input.min!==''&&value<=Number(input.min));plus.disabled=input.disabled||(input.max!==''&&value>=Number(input.max));};
  input.addEventListener('change',sync);
  const observer=new MutationObserver(sync);observer.observe(input,{attributes:true,attributeFilter:['disabled','min','max','value']});observers.push(observer);sync();
 });
 return ()=>observers.forEach(o=>o.disconnect());
}
