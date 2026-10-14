(function(){
 const grid=document.getElementById('prod-grid');if(!grid)return;
 const catalog=window.MD_CATALOG;
 const sectors={industria:['Industria','Almacenes','Mantenimiento','Talleres'],cocinas:['Restaurantes','Cocinas industriales'],gimnasios:['Gimnasios','Dojos','Áreas deportivas','Box y CrossFit'],comercio:['Comercio','Oficinas','Corporativo','Retail y hotelería','Entradas comerciales','Hoteles'],electrico:['Subestaciones','Mantenimiento eléctrico'],humedos:['Albercas','Balnearios y clubes']};
 const filters=[...window.MD_FILTERS,...window.MD_SECTORS];
 const controls=document.getElementById('catalog-controls');controls.hidden=false;
 const el=id=>document.getElementById(id);
 const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const option=(value,label)=>new Option(label,value);
 filters.forEach(f=>el('catalog-filter').add(option(f.id,f.name)));
 const fields={espesor:'Espesor',ancho:'Ancho',presentacion:'Presentación'};
 Object.entries(fields).forEach(([id,key])=>{
  [...new Set(catalog.map(p=>p.specs[key]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es',{numeric:true})).forEach(v=>el('catalog-'+id).add(option(v,v)));
 });
 let compare=[];
 const cards=[...grid.children];
 cards.forEach(card=>{
  const button=document.createElement('button');button.className='compare-toggle';button.textContent='Añadir a comparación';button.setAttribute('aria-pressed','false');
  button.addEventListener('click',()=>{
   const slug=card.dataset.slug;
   if(compare.includes(slug))compare=compare.filter(s=>s!==slug);
   else if(compare.length<3)compare.push(slug);
   else{el('compare-status').textContent='Puedes comparar hasta 3 productos. Quita uno antes de añadir otro.';return;}
   showCompare();
  });
  card.append(button);
 });
 function showCompare(){
  el('comparison').hidden=compare.length===0;
  el('compare-status').textContent=compare.length+' de 3 productos seleccionados.';
  cards.forEach(c=>{const selected=compare.includes(c.dataset.slug);const b=c.querySelector('button');b.setAttribute('aria-pressed',String(selected));b.textContent=selected?'Quitar de comparación':'Añadir a comparación';});
  const products=compare.map(s=>catalog.find(p=>p.slug===s));
  const table=el('comparison-table');table.replaceChildren();
  const caption=document.createElement('caption');caption.textContent='Comparación de especificaciones publicadas';table.append(caption);
  const head=document.createElement('thead');const row=document.createElement('tr');
  const corner=document.createElement('th');corner.scope='col';corner.textContent='Característica';row.append(corner);
  products.forEach(p=>{const th=document.createElement('th');th.scope='col';const a=document.createElement('a');a.href='/tapetes/'+p.slug+'.html';a.textContent=p.name;th.append(a);row.append(th);});head.append(row);table.append(head);
  const body=document.createElement('tbody');
  const keys=[...new Set(products.flatMap(p=>Object.keys(p.specs)))];
  keys.forEach(key=>{const tr=document.createElement('tr');const th=document.createElement('th');th.scope='row';th.textContent=key;tr.append(th);products.forEach(p=>{const td=document.createElement('td');td.textContent=p.specs[key]||'No especificado';tr.append(td);});body.append(tr);});table.append(body);
 }
 el('clear-compare').onclick=()=>{compare=[];showCompare();};
 function read(){
  const params=new URLSearchParams(location.search);
  el('catalog-filter').value=params.get('filtro')||location.hash.slice(1)||'all';
  if(!el('catalog-filter').value)el('catalog-filter').value='all';
  el('catalog-search').value=params.get('q')||'';
  for(const id of Object.keys(fields))el('catalog-'+id).value=params.get(id)||'';
  el('catalog-order').value=params.get('orden')==='za'?'za':'az';render(false);
 }
 function render(update=true){
  const filter=el('catalog-filter').value;
  const query=norm(el('catalog-search').value.trim());
  const filtered=catalog.filter(p=>{
   if(filter!=='all' && !(sectors[filter]?p.sectors.some(s=>sectors[filter].includes(s)):p.apps.includes(filter)))return false;
   if(query && !norm([p.name,p.short,...Object.values(p.specs),...p.uses].join(' ')).includes(query))return false;
   return Object.entries(fields).every(([id,key])=>!el('catalog-'+id).value||p.specs[key]===el('catalog-'+id).value);
  }).sort((a,b)=>a.name.localeCompare(b.name,'es')*(el('catalog-order').value==='za'?-1:1));
  const selected=new Set(filtered.map(p=>p.slug));cards.forEach(c=>c.hidden=!selected.has(c.dataset.slug));
  filtered.forEach(p=>grid.append(cards.find(c=>c.dataset.slug===p.slug)));
  el('result-count').textContent=filtered.length+' resultados';el('no-results').hidden=filtered.length!==0;
  if(update){
   const url=new URL(location.href);url.search='';url.hash='';
   if(filter!=='all')url.searchParams.set('filtro',filter);
   if(query)url.searchParams.set('q',el('catalog-search').value.trim());
   for(const id of Object.keys(fields))if(el('catalog-'+id).value)url.searchParams.set(id,el('catalog-'+id).value);
   if(el('catalog-order').value==='za')url.searchParams.set('orden','za');
   history.pushState(null,'',url);
   window.mdTrack?.('filter_catalog',{filtro:filter,resultados:filtered.length,con_busqueda:!!query});
  }
 }
 controls.querySelectorAll('select').forEach(s=>s.addEventListener('change',()=>render()));
 let debounce;el('catalog-search').addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>render(),350);});
 el('clear-filters').onclick=()=>{history.pushState(null,'',location.pathname);read();el('catalog-search').focus();};
 window.addEventListener('popstate',read);window.addEventListener('hashchange',read);read();
})();
