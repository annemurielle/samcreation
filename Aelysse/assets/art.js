'use strict';
document.documentElement.classList.add('js');
document.querySelectorAll('[data-menu]').forEach(button=>{
 const nav=document.getElementById(button.getAttribute('aria-controls'));
 button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
});
const dialog=document.querySelector('[data-art-dialog]');
const triggers=Array.from(document.querySelectorAll('a[data-gallery]'));
if(dialog&&triggers.length&&typeof dialog.showModal==='function'){
 let index=0,lastFocus=null;
 const image=dialog.querySelector('img'),count=dialog.querySelector('[data-count]'),caption=dialog.querySelector('figcaption'),full=dialog.querySelector('[data-full]'),figure=dialog.querySelector('figure');
 function show(i){index=(i+triggers.length)%triggers.length;const a=triggers[index];image.src=a.href;image.alt=a.dataset.caption||a.querySelector('img')?.alt||'';caption.textContent=image.alt;count.textContent=`${index+1} / ${triggers.length}`;full.href=a.href;figure.classList.remove('zoomed');dialog.querySelector('[data-zoom]').setAttribute('aria-pressed','false');}
 triggers.forEach((a,i)=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();lastFocus=a;show(i);dialog.showModal();}));
 dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
 dialog.querySelector('[data-prev]').addEventListener('click',()=>show(index-1));
 dialog.querySelector('[data-next]').addEventListener('click',()=>show(index+1));
 dialog.querySelector('[data-zoom]').addEventListener('click',e=>{const zoomed=figure.classList.toggle('zoomed');e.currentTarget.setAttribute('aria-pressed',String(zoomed));});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{image.removeAttribute('src');lastFocus?.focus();});
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}});
}
const reader=document.querySelector('[data-reader]');
if(reader){
 const pages=JSON.parse(document.getElementById('reader-pages').textContent),image=reader.querySelector('[data-page-image]'),select=reader.querySelector('[data-page-select]'),status=reader.querySelector('[data-page-status]'),error=reader.querySelector('[data-page-error]'),full=reader.querySelector('[data-page-full]'),resume=reader.querySelector('[data-resume]');
 let index=0;const key='samcreation-reader:'+reader.dataset.reader;
 function show(i,store=true){i=Math.max(0,Math.min(pages.length-1,Number(i)||0));index=i;const p=pages[i];error.hidden=true;image.src=p.src;image.alt=p.alt;image.width=p.width;image.height=p.height;full.href=p.src;select.value=String(i);status.textContent=`${p.chapter?p.chapter+' · ':''}${p.alt} · ${i+1} / ${pages.length}`;reader.querySelectorAll('[data-reader-prev]').forEach(b=>b.disabled=i===0);reader.querySelectorAll('[data-reader-next]').forEach(b=>b.disabled=i===pages.length-1);reader.querySelectorAll('[data-page]').forEach(a=>{if(Number(a.dataset.page)===i)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});if(store){try{localStorage.setItem(key,String(i));}catch(_){}try{history.replaceState(null,'','#page-'+(i+1));}catch(_){}}}
 reader.querySelectorAll('[data-reader-prev]').forEach(b=>b.addEventListener('click',()=>show(index-1)));
 reader.querySelectorAll('[data-reader-next]').forEach(b=>b.addEventListener('click',()=>show(index+1)));
 select.addEventListener('change',()=>show(select.value));
 reader.querySelectorAll('[data-page]').forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();show(a.dataset.page);image.scrollIntoView({block:'start'});}));
 image.addEventListener('error',()=>{error.hidden=false;});
 document.addEventListener('keydown',e=>{if(dialog?.open||/INPUT|SELECT|TEXTAREA|BUTTON|A/.test(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}});
 const match=location.hash.match(/^#page-(\d+)$/);show(match?Number(match[1])-1:0,false);
 try{const saved=Number(localStorage.getItem(key));if(saved>0&&saved<pages.length){resume.hidden=false;resume.textContent=`Reprendre à la page ${saved+1}`;resume.addEventListener('click',()=>{show(saved);resume.hidden=true;});}}catch(_){}
 addEventListener('hashchange',()=>{const m=location.hash.match(/^#page-(\d+)$/);if(m)show(Number(m[1])-1,false);});
}
