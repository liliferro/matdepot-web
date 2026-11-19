const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const faqs=require('../data/blog-faqs.json');
module.exports=(post,product,products)=>{
 const candidates=[product,...products.filter(p=>post.group==='Gimnasios'?p.category==='Gimnasios':p.category===product.category)];
 const selected=[...new Map(candidates.map(p=>[p.slug,p])).values()].slice(0,3);
 const table=`<section class="seo-summary" aria-label="Datos de catálogo"><h2>Materiales, espesores y precio</h2><div class="blog-table" tabindex="0" role="region" aria-label="Especificaciones y cotización"><table><thead><tr><th scope="col">Producto</th><th scope="col">Material declarado</th><th scope="col">Espesor</th><th scope="col">Precio en MXN</th></tr></thead><tbody>${selected.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.specs.Material||'Consultar ficha técnica del modelo')}</td><td>${esc(p.specs.Espesor||'Consultar')}</td><td>A cotizar</td></tr>`).join('')}</tbody></table></div><p>Datos del catálogo, no una recomendación automática para tu aplicación. No hay una tarifa pública vigente; solicita una cotización en MXN que detalle IVA, envío e instalación.</p></section>`;
 const qa=faqs[post.slug];
 if(!Array.isArray(qa)||!qa.length) throw new Error('Missing unique FAQ for '+post.slug);
 for(const [q,a] of qa){
  if(q==='¿Qué debo confirmar antes de comprar?') throw new Error('Repeated FAQ still present on '+post.slug);
  if(/precio/i.test(q) && !/\d/.test(a)) throw new Error('Price FAQ without a concrete figure on '+post.slug);
  if(!/\d/.test(a)) throw new Error('FAQ without a concrete figure on '+post.slug+': '+q);
 }
 return {table,faq:`<section class="blog-faq"><h2>Preguntas frecuentes de esta guía</h2>${qa.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`,schema:{'@type':'FAQPage',mainEntity:qa.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}};
};
