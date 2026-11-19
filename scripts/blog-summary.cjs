const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports=(post,product,products)=>{
 const candidates=[product,...products.filter(p=>post.group==='Gimnasios'?p.category==='Gimnasios':p.category===product.category)];
 const selected=[...new Map(candidates.map(p=>[p.slug,p])).values()].slice(0,3);
 const table=`<section class="seo-summary" aria-label="Datos de catálogo"><h2>Materiales, espesores y precio</h2><div class="blog-table" tabindex="0" role="region" aria-label="Especificaciones y cotización"><table><thead><tr><th scope="col">Producto</th><th scope="col">Material declarado</th><th scope="col">Espesor</th><th scope="col">Precio en MXN</th></tr></thead><tbody>${selected.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.specs.Material||'Consultar ficha técnica del modelo')}</td><td>${esc(p.specs.Espesor||'Consultar')}</td><td>A cotizar</td></tr>`).join('')}</tbody></table></div><p>Datos del catálogo, no una recomendación automática para tu aplicación. No hay una tarifa pública vigente; solicita una cotización en MXN que detalle IVA, envío e instalación.</p></section>`;
 if(!Array.isArray(post.faqs)||post.faqs.length<2)throw Error('FAQ única incompleta '+post.slug);
 const qa=post.faqs.map(([q,a])=>{
  if(q==='¿Qué debo confirmar antes de comprar?')throw Error('FAQ repetida '+post.slug);
  if(/precio/i.test(q)&&/cotizaci[oó]n/i.test(a)&&!/\d/.test(a))throw Error('FAQ de precio sin dato '+post.slug);
  if(!/\d/.test(a))throw Error('FAQ sin dato concreto '+post.slug);
  return [q,a];
 });
 return {table,faq:`<section class="blog-faq"><h2>Preguntas frecuentes de esta guía</h2>${qa.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`,schema:{'@type':'FAQPage',mainEntity:qa.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}};
};
