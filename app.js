(() => {
 'use strict';
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';
 const copyIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/></svg>';
 const key='prestige-preview-v1',baseline=structuredClone(window.PRESTIGE_DATA);let data=structuredClone(baseline);
 try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&Array.isArray(saved.partners)&&saved.partners.length===5&&Array.isArray(saved.roster)&&saved.roster.length===5)data=saved;}catch{}
 function safeImage(value){const s=String(value||'');return /^(?:assets\/[a-zA-Z0-9_./-]+|https:\/\/[^\s]+|data:image\/(?:png|jpeg|webp);base64,[a-zA-Z0-9+/=]+)$/.test(s)?s:'assets/prestige-art.png';}
 function safeLink(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:'';}catch{return '';}}
 let toastTimer;function toast(text){const el=$('.toast');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3000);}
 function observe(){if(!('IntersectionObserver'in window))return;const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.07});$$('.reveal:not(.is-visible)').forEach(el=>observer.observe(el));}
 function render(){
  const partners=$('#partners-grid');if(partners)partners.innerHTML=data.partners.map((p,n)=>`<article class="partner-card ${n===0?'featured':''} reveal"><div class="partner-image"><img src="${escape(safeImage(p.image))}" alt="${escape(p.name)} banner" ${n?'loading="lazy"':''}></div><div class="partner-info"><span class="eyebrow">${n===0?'FEATURED PARTNER':'PARTNER / 0'+(n+1)}</span><h2>${escape(p.name)}</h2><p>${escape(p.description)}</p><button class="partner-code" data-copy-index="${n}" ${p.code?'':'disabled'} aria-label="${p.code?'Copy '+escape(p.code):'Partner code coming soon'}"><span>${escape(p.code||'CODE COMING SOON')}</span><span class="copy-label">${p.code?'COPY CODE':'SOON'} ${copyIcon}</span></button></div></article>`).join('');
  const roster=$('#roster-grid');if(roster)roster.innerHTML=data.roster.map((p,n)=>`<article class="roster-card reveal"><div class="roster-photo"><img src="${escape(safeImage(p.image))}" alt="${escape(p.name)} roster image" loading="lazy"><span class="player-number">0${n+1}</span></div><div class="roster-info"><h2>${escape(p.name)}</h2><p class="handle">${escape(p.handle)}</p><div class="roster-links">${[1,2].map(k=>{const url=safeLink(p['link'+k]);return `<a ${url?'href="'+escape(url)+'" target="_blank" rel="noopener noreferrer"':'role="link" aria-disabled="true" title="Player link to be announced"'}>${escape(p['link'+k+'Label']||'Link '+k)}${arrow}</a>`;}).join('')}</div></div></article>`).join('');
  observe();
 }
 render();
 if('IntersectionObserver'in window){document.documentElement.classList.add('js-ready');observe();}
 $$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
 const drawer=$('#nav-drawer'),toggle=$('.menu-toggle');let closing=false;
 toggle.addEventListener('click',()=>{drawer.showModal();document.body.style.overflow='hidden';toggle.setAttribute('aria-expanded','true');requestAnimationFrame(()=>drawer.classList.add('is-open'));});
 function closeMenu(){if(closing)return;closing=true;drawer.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');setTimeout(()=>{drawer.close();document.body.style.overflow='';toggle.focus();closing=false;},250);}
 $('.menu-close').addEventListener('click',closeMenu);drawer.addEventListener('cancel',e=>{e.preventDefault();closeMenu();});drawer.addEventListener('click',e=>{if(e.target===drawer){const r=drawer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeMenu();}});
 document.addEventListener('click',async e=>{const button=e.target.closest('[data-copy-index]');if(!button)return;const code=data.partners[Number(button.dataset.copyIndex)]?.code;if(!code)return;
  let success=false;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(code);success=true;}else{const field=document.createElement('textarea');field.value=code;field.style.cssText='position:fixed;left:-9999px';document.body.append(field);field.select();success=document.execCommand('copy');field.remove();}}catch{}
  toast(success?'Copied '+code+' to clipboard.':'Copy unavailable. Your code is '+code+'.');
 });
 const editor=$('#card-editor'),editorForm=$('#editor-form');const kind=document.body.dataset.page==='partners'?'partners':'roster';
 if(editor&&editorForm){
  const selector=$('#edit-card'),status=$('#editor-status');
  const setStatus=(message,error=false)=>{status.textContent=message;status.dataset.error=String(error);};
  function options(){const old=selector.value;selector.replaceChildren(...data[kind].map((card,n)=>new Option(`${String(n+1).padStart(2,'0')} — ${card.name}`,String(n))));selector.value=old&&Number(old)<5?old:'0';}
  function fill(){const card=data[kind][Number(selector.value)];for(const field of ['name','code','description','handle','link1Label','link1','link2Label','link2'])if(editorForm.elements[field])editorForm.elements[field].value=card[field]||'';editorForm.elements.image.value='';setStatus('');}
  $('[data-editor-open]').addEventListener('click',()=>{options();fill();editor.showModal();});$('[data-editor-close]').addEventListener('click',()=>editor.close());selector.addEventListener('change',fill);
  async function readImage(file){
   if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Choose a PNG, JPG, or WebP image.');if(file.size>12*1024*1024)throw Error('Choose an image smaller than 12 MB.');
   const url=URL.createObjectURL(file);try{const image=new Image();image.src=url;await image.decode();const ratio=Math.min(1,1200/image.width,1200/image.height),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/webp',.86);}finally{URL.revokeObjectURL(url);}
  }
  editorForm.addEventListener('submit',async e=>{e.preventDefault();const submit=editorForm.querySelector('[type=submit]');submit.disabled=true;setStatus('Saving preview…');try{
   const n=Number(selector.value),card={...data[kind][n]};for(const field of ['name','code','description','handle','link1Label','link1','link2Label','link2'])if(editorForm.elements[field])card[field]=editorForm.elements[field].value.trim();
   for(const field of ['link1','link2'])if(card[field]&&!safeLink(card[field]))throw Error('Use an http:// or https:// URL for player links.');if(!card.name)throw Error('Enter a card name.');
   const file=editorForm.elements.image.files[0];if(file)card.image=await readImage(file);data[kind][n]=card;
   let stored=true;try{localStorage.setItem(key,JSON.stringify(data));}catch{stored=false;}
   render();options();selector.value=String(n);fill();setStatus(stored?'Preview saved on this device. Export site-data.js to publish your changes.':'Preview updated. Browser storage is full; export site-data.js now to keep your changes.');
  }catch(err){setStatus(err.message||'Could not save this preview.',true);}finally{submit.disabled=false;}});
  $('[data-export]').addEventListener('click',()=>{const content='// Prestige public card configuration. Upload this file beside index.html.\nwindow.PRESTIGE_DATA = '+JSON.stringify(data,null,2)+';\n';const url=URL.createObjectURL(new Blob([content],{type:'text/javascript'}));const anchor=document.createElement('a');anchor.href=url;anchor.download='site-data.js';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('Export downloaded. Replace site-data.js in your GitHub repository to make these cards public.');});
  $('[data-reset]').addEventListener('click',()=>{data=structuredClone(baseline);try{localStorage.removeItem(key);}catch{}render();options();fill();setStatus('Local previews reset to the published card configuration.');});
 }
 const form=$('#contact-form');if(form)form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const status=$('#form-status'),submit=form.querySelector('[type=submit]');if(submit.disabled)return;submit.disabled=true;submit.textContent='Sending…';status.textContent='';status.dataset.error='false';
  try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!response.ok){let details;try{details=await response.json();}catch{}throw Error(details?.errors?.map(e=>e.message).join(' ')||'Your message could not be sent. Please try again or email fearprsggs@gmail.com.');}form.reset();status.textContent='Message sent. Thank you for reaching out to Prestige.';}catch(err){status.dataset.error='true';status.textContent=err.message==='Failed to fetch'?'Connection failed. Please retry, or email fearprsggs@gmail.com.':err.message;}finally{submit.disabled=false;submit.innerHTML='Send message '+arrow;}
 });
})();
