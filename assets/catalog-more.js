(function(){
  const grid=document.getElementById('prod-grid');if(!grid)return;
  const mobile=window.matchMedia('(max-width:640px)');
  const cards=[...grid.children];let limit=12;
  const more=document.createElement('button');more.type='button';more.className='btn btn--ghost catalog-more';grid.after(more);
  function update(){
    const matched=[...grid.children].filter(c=>c.dataset.filtered!=='false');
    matched.forEach((c,i)=>{c.hidden=mobile.matches&&i>=limit;const n=c.querySelector('.cat-card__num');if(n)n.textContent=String(i+1).padStart(2,'0');});
    cards.filter(c=>c.dataset.filtered==='false').forEach(c=>c.hidden=true);
    more.hidden=!mobile.matches||matched.length<=limit;
    more.textContent='Mostrar más ('+Math.min(limit,matched.length)+' de '+matched.length+')';
    document.dispatchEvent(new CustomEvent('md:catalog-visible'));
  }
  more.addEventListener('click',()=>{const next=[...grid.children].filter(c=>c.dataset.filtered!=='false')[limit];limit+=12;update();const a=next?.querySelector('a');a?.focus();});
  document.addEventListener('md:catalog-filter',()=>{limit=12;update();});
  mobile.addEventListener('change',()=>{limit=12;update();});
  const controls=document.getElementById('catalog-controls');
  if(controls){
    let expanded=false;
    const toggle=document.createElement('button');toggle.type='button';toggle.className='btn btn--ghost catalog-filter-toggle';toggle.textContent='Buscar y filtrar productos';toggle.setAttribute('aria-controls',controls.id);controls.before(toggle);
    function fold(){controls.hidden=mobile.matches&&!expanded;toggle.setAttribute('aria-expanded',String(!controls.hidden));}
    toggle.addEventListener('click',()=>{expanded=!expanded;fold();});mobile.addEventListener('change',fold);fold();
  }
  update();
})();
