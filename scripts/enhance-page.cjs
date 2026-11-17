// Build-time improvements derived only from the content actually visible on each page.
module.exports = function enhance(d, output, origin, graph) {
  const canonical=origin+(output==='index.html'?'/':'/'+output);
  d.querySelectorAll('a[href^="tel:"]').forEach(a=>{const n=a.getAttribute('href').slice(4).replace(/\D/g,'');if(n.length===10)a.href='tel:+52'+n;});
  const questions=[...d.querySelectorAll('.faq details')].map(el=>({
    '@type':'Question',name:el.querySelector('summary').textContent.trim(),
    acceptedAnswer:{'@type':'Answer',text:[...el.querySelectorAll('p:not(.faq-actions)')].map(p=>p.textContent.trim()).join('\n')}
  })).filter(q=>q.acceptedAnswer.text);
  if(questions.length&&!graph.some(g=>g['@type']==='FAQPage'))graph.push({'@type':'FAQPage','@id':canonical+'#faq',mainEntity:questions});
  if(/^(categorias|sectores)\//.test(output)) {
    const name=d.querySelector('h1').textContent.trim();
    graph.push({'@type':'BreadcrumbList',itemListElement:[['Inicio',origin+'/'],['Productos',origin+'/productos.html'],[name,canonical]].map(([name,item],i)=>({'@type':'ListItem',position:i+1,name,item}))});
    graph.push({'@type':'ItemList','@id':canonical+'#productos',name:'Productos: '+name,itemListElement:[...d.querySelectorAll('.cat-card')].map((a,i)=>({'@type':'ListItem',position:i+1,url:new URL(a.getAttribute('href'),origin).href,name:a.querySelector('.cat-card__name').textContent.trim()}))});
  }
  d.querySelectorAll('.blog-body table').forEach((table,i)=>{
    let wrapper=table.closest('.blog-table');
    if(!wrapper){wrapper=d.createElement('div');wrapper.className='blog-table';table.before(wrapper);wrapper.append(table);}
    wrapper.tabIndex=0;wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label','Tabla '+(i+1)+': desplaza horizontalmente para ver todas las columnas');
    const hint=d.createElement('p');hint.className='table-scroll-hint';hint.textContent='Desliza la tabla para ver todas las columnas →';wrapper.before(hint);
  });
  if(output==='index.html'){
    const urls=['/sectores/industria.html','/sectores/cocinas.html','/categorias/gimnasios.html','/sectores/comercio.html','/categorias/seguridad-electrica.html','/categorias/areas-humedas.html'];
    d.querySelectorAll('.sectors .sector').forEach((el,i)=>{const a=d.createElement('a');a.className=el.className;a.href=urls[i];a.innerHTML=el.innerHTML;el.replaceWith(a);});
  }
  const scripts=['/assets/catalog-more.js'];
  if(d.querySelector('#prod-grid')){const s=d.createElement('script');s.src=scripts[0];s.defer=true;d.head.append(s);}
};
