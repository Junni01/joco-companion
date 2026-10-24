// Share the current regular-page markup as well as its rendering, dialogs and rules.
try{
 document.documentElement.dataset.workspaceMode='debug';
 const response=await fetch('index.html',{cache:'no-store'});
 if(!response.ok)throw Error('The shared app layout could not be loaded.');
 const layout=new DOMParser().parseFromString(await response.text(),'text/html');
 layout.querySelectorAll('script').forEach(script=>script.remove());
 document.body.replaceChildren(...layout.body.childNodes);
 document.body.classList.add('debug-workspace');
 const title=document.querySelector('h1');if(title)title.textContent+=' · Debug';
 const panel=document.createElement('section');panel.id='debug-controls';panel.className='paper-card debug-controls';panel.setAttribute('aria-label','Debug test bench');
 panel.textContent='Loading debug editor controls…';
 document.getElementById('map-page').prepend(panel);
 await import('./app.js');
 if(!panel.querySelector('#debug-edit'))throw Error('The debug editor did not initialize. Reload this page to retry.');
}catch(error){
 const message=document.createElement('p');message.textContent='The debug workspace could not start: '+error.message;
 const back=document.createElement('a');back.href='index.html';back.textContent='Return to regular game';document.body.replaceChildren(message,back);
}
