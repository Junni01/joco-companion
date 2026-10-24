export function confirmInApp({showDialog,title,message,confirmLabel='Confirm',onConfirm,onCancel}){
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 showDialog(title,`<p>${esc(message)}</p>`,`<button id="cancel-choice">Cancel</button><button id="confirm-choice" class="primary">${esc(confirmLabel)}</button>`);
 const $=id=>document.getElementById(id);let done=false;
 $('cancel-choice').onclick=()=>{if(done)return;done=true;onCancel();};
 $('confirm-choice').onclick=()=>{if(done)return;try{done=true;$('confirm-choice').disabled=true;onConfirm();}catch(e){done=false;if($('confirm-choice'))$('confirm-choice').disabled=false;$('form-error').textContent=e.message||e;}};
}
