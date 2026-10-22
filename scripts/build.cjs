const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),out=path.join(root,'public'),origin='https://www.matdepotmex.com';
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const data={window:{}};vm.runInNewContext(read('assets/catalogo.js'),data);const {MD_CATALOG:products,MD_CONTACT:contact}=data.window;
const {categories,faq}=JSON.parse(read('data/content.json')),sizes=JSON.parse(read('data/image-sizes.json'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const faqGroups=JSON.parse(read('data/faqs.json'));
const faqUrl=g=>g.category==='general'?'/preguntas-frecuentes.html':'/categorias/'+g.category+'.html';
const renderFaq=questions=>`<div class="faq prose">${questions.map(q=>`<details id="${esc(q.id)}"><summary>${esc(q.question)}</summary>${q.answer.map(a=>`<p>${esc(a)}</p>`).join('')}<p class="faq-actions">${q.links.map(([label,url])=>`<a href="${esc(url==='whatsapp'?contact.waUrl:url)}">${esc(label)}</a>`).join('')}</p></details>`).join('')}</div>`;
const categoryFaq=slug=>{const g=faqGroups.find(g=>g.category===slug);return g?`<section class="faq-section" id="preguntas-frecuentes" aria-labelledby="faq-heading"><h2 id="faq-heading">Preguntas frecuentes: ${esc(g.title)}</h2><p>${esc(g.intro)}</p>${renderFaq(g.questions)}<p><a href="/preguntas-frecuentes.html">Ver preguntas sobre cotizaciones, compra y entrega</a></p></section>`:'';};
const productUrl=p=>'/tapetes/'+p.slug+'.html';
const links=()=>'<nav class="category-links" aria-label="Categorías de productos">'+categories.map(c=>`<a href="/categorias/${c.slug}.html">${esc(c.name)}</a>`).join('')+'</nav>';
const card=(p,i=0,compare=false)=>`${compare?`<article class="catalog-card-wrap" data-slug="${p.slug}">`:''}<a class="cat-card" href="${productUrl(p)}"><div class="cat-card__media cat-card__media--photo"><img src="/${p.images[0]}" alt="${esc(p.name)}" loading="lazy"><span class="cat-card__num">${String(i+1).padStart(2,'0')}</span></div><div><span class="cat-card__name">${esc(p.name)}</span><p>${esc(p.short)}</p><div class="cat-card__tags">${p.sectors.map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div></div><span class="cat-card__cta">Ver ficha técnica →</span></a>${compare?'</article>':''}`;
const baseGraph=[{'@type':['Organization','LocalBusiness'],'@id':origin+'/#organization',name:'Mat Depot',legalName:'Mat Depot, S.A. de C.V.',url:origin+'/',telephone:['+525596265258','+525596265259'],email:contact.email,address:{'@type':'PostalAddress',addressLocality:'Tlalnepantla de Baz',addressRegion:'Estado de México',addressCountry:'MX'},sameAs:['https://www.instagram.com/matdepotmex','https://www.linkedin.com/in/mat-depot-70b19937a/','https://youtube.com/@matdepot25','https://www.tiktok.com/@matdepot']},{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Mat Depot',inLanguage:'es-MX',publisher:{'@id':origin+'/#organization'}}];
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
fs.copyFileSync(path.join(root,'assets/favicon.ico'),path.join(out,'favicon.ico'));
const allUrls=[];
function page(source,output,options={}){
 const dom=new JSDOM(read(source),{url:origin+'/'+(options.renderPath||output),runScripts:'outside-only'});const w=dom.window,d=w.document;
 w.eval(read('assets/catalogo.js'));w.eval(read('assets/chrome.js'));
 if(options.renderInline){d.querySelectorAll('script:not([src])').forEach(s=>{w.eval(s.textContent);s.remove();});}
 if(options.mutate)options.mutate(d,w);
 const relatedGuides=require('../data/blog-posts.json').filter(p=>output==='categorias/'+p.category+'.html'||(output==='preguntas-frecuentes.html'&&p.category==='general')||options.product?.slug===p.product);
 if(relatedGuides.length){const target=d.querySelector('main')||d.querySelector('body > section:last-of-type');if(target)target.insertAdjacentHTML('beforeend',`<aside class="container section--tight"><h2>Guías y herramientas para tu proyecto</h2><ul>${relatedGuides.map(p=>`<li><a href="/blog/${p.slug}.html">${esc(p.title)}</a></li>`).join('')}</ul></aside>`);}
 if(output==='categorias/gimnasios.html')d.querySelector('.prose').insertAdjacentHTML('beforeend','<p><a href="/blog/mejor-piso-para-gimnasio.html">Guía: cómo elegir piso para gimnasio y calcular la superficie de tu proyecto</a></p>');
 const canonical=origin+(output==='index.html'?'/':'/'+output);
 if(!d.querySelector('main')){
  const main=d.createElement('main');main.id='main-content';const footer=d.querySelector('.site-footer');
  const nodes=[...d.body.children].filter(e=>!e.matches('header,footer,script,.wa-fab'));
  footer.before(main);nodes.forEach(n=>main.append(n));
 }else d.querySelector('main').id='main-content';
 const skip=d.createElement('a');skip.className='skip-link';skip.href='#main-content';skip.textContent='Saltar al contenido';d.body.prepend(skip);
 d.documentElement.lang='es-MX';
 d.querySelectorAll('.nav-links a[aria-current]').forEach(a=>a.removeAttribute('aria-current'));
 const active=output.startsWith('blog/')?'blog.html':output==='comparar.html'||output.startsWith('tapetes/')||output.startsWith('categorias/')?'productos.html':output;
 d.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')===active)a.setAttribute('aria-current','page');});
 const noscript=d.createElement('noscript');noscript.innerHTML='<style>@media(max-width:1024px){.nav-links{display:flex;position:static;grid-column:1/-1;max-height:none}.burger{display:none}}</style>';d.head.append(noscript);
 if(options.title)d.title=options.title;
 if(options.description)d.querySelector('meta[name="description"]').content=options.description;
 const link=d.createElement('link');link.rel='canonical';link.href=canonical;d.head.append(link);
 for(const attrs of [
  {rel:'icon',type:'image/x-icon',sizes:'16x16 32x32 48x48 64x64',href:'/favicon.ico?v=2'},
  {rel:'icon',type:'image/png',sizes:'48x48',href:'/assets/favicon-48.png?v=2'},
  {rel:'icon',type:'image/svg+xml',sizes:'any',href:'/assets/favicon.svg?v=2'},
  {rel:'apple-touch-icon',sizes:'180x180',href:'/assets/apple-touch-icon.png?v=2'}
 ]) { const icon=d.createElement('link');for(const [key,value]of Object.entries(attrs))icon.setAttribute(key,value);d.head.append(icon); }
 d.querySelectorAll('link[href*="fonts.googleapis.com"],link[href*="fonts.gstatic.com"]').forEach(n=>n.remove());
 const fonts=d.createElement('link');fonts.rel='stylesheet';fonts.href='/assets/fonts.css';d.head.append(fonts);
 const preload=d.createElement('link');preload.rel='preload';preload.as='font';preload.type='font/woff2';preload.crossOrigin='anonymous';preload.href='/assets/fonts/archivo-400.woff2';d.head.append(preload);
 const graph=[...baseGraph,...(options.graph||[])];
 const json=d.createElement('script');json.type='application/ld+json';json.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');d.head.append(json);
 for(const [property,content]of Object.entries({'og:title':d.title,'og:description':d.querySelector('meta[name="description"]').content,'og:url':canonical,'og:type':options.article?'article':options.product?'product':'website','og:image':origin+'/'+(options.image||options.product?.images[0]||products[14].images[0])})){
  const meta=d.createElement('meta');meta.setAttribute('property',property);meta.content=content;d.head.append(meta);
 }
 const analytics=d.createElement('script');analytics.src='/assets/analytics.js';analytics.defer=true;d.head.append(analytics);
 if(d.querySelector('.faq')){const script=d.createElement('script');script.src='/assets/faq.js';script.defer=true;d.head.append(script);}
 // Root-relative links work at every product/category depth.
 d.querySelectorAll('[href],[src]').forEach(e=>{
  for(const attr of ['href','src']){
   const value=e.getAttribute(attr);if(!value||/^(?:[a-z]+:|\/|#)/i.test(value))continue;
   if(value.startsWith('producto.html?id=')){
    const slug=new URL(value,origin).searchParams.get('id');const p=products.find(p=>p.slug===slug);if(p){e.setAttribute(attr,productUrl(p));continue;}
   }
   e.setAttribute(attr,value==='index.html'?'/':'/'+value);
  }
 });
 d.querySelectorAll('img').forEach(img=>{
  const key=img.getAttribute('src').replace(/^\//,'');const size=sizes[key];if(!size)throw Error('Unknown image '+key);
  img.width=size[0];img.height=size[1];img.setAttribute('decoding','async');
  if(!img.hasAttribute('alt'))throw Error('Missing alt '+output);
 });
 d.querySelector('.hero__visual img')?.setAttribute('fetchpriority','high');
 d.querySelectorAll('footer a[href*="productos.html#"]').forEach(a=>a.href=a.getAttribute('href').replace('#','?filtro='));
 const company=d.querySelector('.foot-top > div:last-child ul');if(company)company.insertAdjacentHTML('beforeend','<li><a href="/preguntas-frecuentes.html">Preguntas frecuentes</a></li>');
 if(options.noindex && !d.querySelector('meta[name="robots"]')){const m=d.createElement('meta');m.name='robots';m.content='noindex,follow';d.head.append(m);}
 const file=path.join(out,output);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,dom.serialize());
 if(!options.noindex && output!=='gracias.html')allUrls.push(canonical);
 dom.window.close();
}
page('index.html','index.html',{renderInline:true,title:'Tapetes y pisos de hule en CDMX y Edomex | Mat Depot',mutate(d){d.querySelector('#featured-cats').insertAdjacentHTML('beforebegin',links());}});
page('productos.html','productos.html',{title:'Catálogo de tapetes y pisos técnicos | Mat Depot',description:`Compara ${products.length} tapetes y pisos técnicos por aplicación, espesor, ancho y presentación. Solicita asesoría y cotización en Mat Depot.`,mutate(d){
 d.querySelectorAll('script:not([src])').forEach(s=>s.remove());
 d.querySelector('.prod-toolbar').innerHTML=`<span id="result-count" role="status">${products.length} resultados</span>`;
 d.querySelector('.prod-toolbar').insertAdjacentHTML('beforebegin',links()+`<div class="catalog-controls" id="catalog-controls" hidden>
 <div class="field"><label for="catalog-search">Buscar nombre, medida o especificación</label><input id="catalog-search" type="search" maxlength="120" placeholder="Ej. cocina, 13 mm, rollo"></div>
 <div class="field"><label for="catalog-filter">Aplicación o sector</label><select id="catalog-filter"></select></div>
 ${['espesor','ancho','presentacion'].map(k=>`<div class="field"><label for="catalog-${k}">${k==='presentacion'?'Presentación':k[0].toUpperCase()+k.slice(1)}</label><select id="catalog-${k}"><option value="">Todos</option></select></div>`).join('')}
 <div class="field"><label for="catalog-order">Orden</label><select id="catalog-order"><option value="az">Nombre: A–Z</option><option value="za">Nombre: Z–A</option></select></div><button class="btn btn--ghost" id="clear-filters" type="button">Limpiar filtros</button><a class="btn compare-open" id="comparison" href="/comparar.html">Comparar productos</a></div><p id="compare-status" class="catalog-compare-status" role="status" aria-live="polite"></p>
`);
 d.querySelector('#prod-grid').innerHTML=products.map((p,i)=>card(p,i,true)).join('');
 d.querySelector('#prod-grid').insertAdjacentHTML('afterend','<p id="no-results" hidden>No hay productos con esa combinación. Prueba otras medidas o limpia los filtros.</p>');
 const script=d.createElement('script');script.src='/assets/catalog-ui.js';d.body.append(script);
 const comparison=d.createElement('script');comparison.src='/assets/comparison.js';d.body.append(comparison);
}});
page('ubicacion.html','comparar.html',{title:'Comparador de productos | Mat Depot',description:'Compara hasta tres tapetes y pisos de Mat Depot con las especificaciones publicadas en sus fichas.',mutate(d){
 d.querySelectorAll('body > section,script:not([src])').forEach(e=>e.remove());
 d.querySelector('footer').insertAdjacentHTML('beforebegin',shell('Comparador de productos','Selecciona hasta tres productos para revisar sus características técnicas.',`<a class="btn btn--ghost" href="/productos.html">← Volver al catálogo</a>
 <section class="comparison" id="comparison" aria-labelledby="comparison-title" hidden>
 <span class="eyebrow">Tu selección · Hasta 3 productos</span><h2 class="h2" id="comparison-title" tabindex="-1">Compara tus opciones</h2>
 <p>Elige productos del catálogo y revisa sus especificaciones lado a lado. Los datos provienen de las fichas publicadas de Mat Depot; consulta cada ficha para ver sus características y usos completos.</p>

 <div class="comparison-toolbar"><label><input type="checkbox" id="compare-differences"> Solo diferencias</label><button class="btn btn--ghost" id="clear-compare" type="button">Vaciar comparación</button></div>
 <p id="compare-summary"></p><p class="source-note">“No especificado” significa que el dato no aparece en la ficha; no implica que el producto carezca de esa característica. Confirma las especificaciones al cotizar.</p>
 <p id="compare-electrical-note" class="source-note" hidden>El certificado del tapete dieléctrico no está publicado aquí. No utilices esta comparación para deducir una tensión de trabajo segura.</p>
 <div class="comparison-scroll" tabindex="0" role="region" aria-label="Tabla de comparación, desplaza horizontalmente para ver todos los productos"><table id="comparison-table"></table></div>
 <p id="compare-empty-differences" hidden>No hay diferencias entre los valores publicados disponibles. Desactiva “Solo diferencias” para revisar también los datos faltantes.</p></section>
 <section class="comparison-products" aria-labelledby="comparison-products-title"><h2 class="h2" id="comparison-products-title" tabindex="-1">Elige tus productos</h2><p>Agrega hasta tres productos usando el botón de cada tarjeta.</p>
 <div class="comparison-picker-toolbar" id="comparison-picker-toolbar" hidden><p id="compare-status" role="status" aria-live="polite"></p><a class="btn" id="compare-jump" href="#comparison" hidden>Ver comparación</a><button class="btn btn--ghost" id="cancel-replace" type="button" hidden>Cancelar cambio</button></div>
 <div class="cat-grid" id="prod-grid">${products.map((p,i)=>card(p,i,true)).join('')}</div></section>
<noscript><p>Activa JavaScript para seleccionar y comparar productos. Puedes consultar todas las fichas en el <a href="/productos.html">catálogo</a>.</p></noscript>`));
 d.body.classList.add('comparison-page');
 const comparison=d.createElement('script');comparison.src='/assets/comparison.js';d.body.append(comparison);
}});
for(const [file,title]of Object.entries({'contacto.html':'Cotiza tapetes y pisos para tu proyecto | Mat Depot','quienes-somos.html':'Proveedor de tapetes y pisos en México | Mat Depot','ubicacion.html':'Ubicación y envíos desde Tlalnepantla | Mat Depot','aviso-privacidad.html':'Aviso de privacidad y uso de datos | Mat Depot','gracias.html':'Solicitud enviada y contacto por WhatsApp | Mat Depot'}))page(file,file,{title,mutate(d){
 if(file==='quienes-somos.html')d.querySelector('.page-banner .container').insertAdjacentHTML('beforeend','<p class="lead">Mat Depot suministra tapetes y pisos de hule y PVC para espacios industriales, comerciales y deportivos. Atiende solicitudes de mayoreo, menudeo y proyectos a medida, con asesoría técnica para revisar uso, tráfico y superficie. Su operación se ubica en Tlalnepantla de Baz y ofrece cobertura de entrega nacional.</p>');
 if(file==='aviso-privacidad.html')d.querySelector('.prose').insertAdjacentHTML('beforeend','<h2>Formulario y analítica del sitio</h2><p>El formulario utiliza FormSubmit para procesar y enviar la solicitud al correo comercial matdepotmx@gmail.com. Google Analytics se carga únicamente si aceptas la analítica. Mide visitas e interacciones; el sitio no envía a Analytics el nombre, teléfono, correo ni descripción del proyecto.</p><p>Puedes aceptar o rechazar la analítica y cambiar tu elección desde Preferencias de privacidad en el pie de página. La elección se conserva en este navegador. Los datos de contacto del formulario se utilizan para atender tu solicitud.</p>');
}});
for(const p of products){
 const schema={'@type':'Product','@id':origin+productUrl(p)+'#product',url:origin+productUrl(p),name:p.name,description:p.short,image:p.images.map(i=>origin+'/'+i),category:p.category,additionalProperty:Object.entries(p.specs).map(([name,value])=>({'@type':'PropertyValue',name,value}))};
 const crumbs={'@type':'BreadcrumbList',itemListElement:[['Inicio',origin+'/'],['Productos',origin+'/productos.html'],[p.name,origin+productUrl(p)]].map(([name,item],i)=>({'@type':'ListItem',position:i+1,name,item}))};
 page('producto.html',productUrl(p).slice(1),{renderPath:'producto.html?id='+p.slug,renderInline:true,product:p,title:p.name+' | Ficha y cotización · Mat Depot',description:p.short,graph:[schema,crumbs],mutate(d){
  d.querySelector('#banner .lead').textContent=p.intro;
  const detail=d.querySelector('#detail');const article=d.createElement('article');article.className=detail.className;article.id='detail';article.innerHTML=detail.innerHTML;detail.replaceWith(article);
  const note=d.createElement('p');note.className='source-note';note.textContent='Fuente de los datos: catálogo comercial de Mat Depot publicado en este sitio. Confirma especificaciones, existencias y documentación del modelo al solicitar tu cotización.';article.lastElementChild.append(note);
  if(p.slug==='tapete-dielectrico')note.textContent+=' El certificado no está publicado aquí; no utilices esta ficha para deducir una tensión de trabajo segura.';
  const relevant=categories.filter(c=>faqGroups.some(g=>g.category===c.slug) && (c.filter?p.apps.includes(c.filter):p.sectors.some(s=>['Gimnasios','Dojos','Áreas deportivas','Box y CrossFit'].includes(s))));
  if(p.slug==='tapete-para-cocina' && !relevant.some(c=>c.slug==='areas-humedas'))relevant.push(categories.find(c=>c.slug==='areas-humedas'));
  article.lastElementChild.insertAdjacentHTML('beforeend',`<nav class="faq-product-links" aria-label="Ayuda para elegir y cotizar"><h2>Resuelve tus dudas antes de cotizar</h2><ul>${relevant.map(c=>`<li><a href="/categorias/${c.slug}.html#preguntas-frecuentes">${p.slug==='tapete-para-cocina'&&c.slug==='areas-humedas'?'Preguntas sobre tapetes para cocina':'Preguntas sobre '+esc(c.name.toLowerCase())}</a></li>`).join('')}<li><a href="/preguntas-frecuentes.html#datos-cotizacion">Qué datos enviar para cotizar</a></li><li><a href="/comparar.html">Comparar productos</a></li></ul></nav>`);
 }});
}
function shell(title,intro,body){return `<section class="page-banner"><div class="container"><div class="crumbs"><a href="/">Inicio</a><span>/</span><a href="/productos.html">Productos</a></div><h1 class="h-display" style="color:var(--c-bone)">${esc(title)}</h1><p class="lead">${esc(intro)}</p></div></section><section class="section--tight"><div class="container">${body}</div></section>`;}
const common='<h2>Cómo preparar tu cotización</h2><p>Selecciona las alternativas que quieres consultar y anota la cantidad aproximada, las dimensiones del área y el destino de entrega. Si todavía no sabes qué producto corresponde, solicita asesoría y describe el uso previsto. Las fotografías ayudan a identificar opciones, pero la compra debe basarse en las características confirmadas del modelo.</p><p>El precio, las existencias y el plazo se confirman al cotizar. Utiliza el formulario o WhatsApp para compartir los datos del proyecto y resolver lo que no aparece en la ficha. No se publica una disponibilidad automática ni un compromiso de entrega para todos los modelos. Guarda el enlace de la ficha para identificar con claridad el producto al contactar al equipo.</p>';
for(const c of categories){
 const selected=products.filter(p=>c.filter?p.apps.includes(c.filter):p.sectors.some(s=>['Gimnasios','Dojos','Áreas deportivas','Box y CrossFit'].includes(s)));
 page('ubicacion.html','categorias/'+c.slug+'.html',{title:c.name+' para tu proyecto | Mat Depot',description:c.intro,mutate(d){
 d.querySelectorAll('body > section,script:not([src])').forEach(e=>e.remove());
 d.querySelector('footer').insertAdjacentHTML('beforebegin',shell(c.name,c.intro,`<div class="prose"><h2>Qué revisar antes de elegir</h2>${c.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')}${common}</div>${links()}${categoryFaq(c.slug)}<h2 class="h2">Productos de esta categoría</h2><div class="cat-grid" style="margin-top:24px">${selected.map((p,i)=>card(p,i)).join('')}</div><p><a class="btn" href="/productos.html?filtro=${c.filter||c.sector}">Filtrar y comparar</a></p>`));
 }});
}
page('ubicacion.html','preguntas-frecuentes.html',{title:'Preguntas sobre tapetes, cotizaciones y envíos | Mat Depot',description:'Encuentra respuestas sobre compra, cotizaciones, entrega y selección de tapetes antifatiga, antiderrapantes, pisos de gimnasio y tapetes para cocina.',mutate(d){
 const general=faqGroups.find(g=>g.category==='general');
 const retained=faq.filter(([q])=>q.includes('almacén')||q.includes('precio publicado')).map(([question,answer],i)=>({id:i?'precios-publicados':'visitar-almacen',question,answer:[answer],links:[['Consultar al equipo','/contacto.html']]}));
 const index=faqGroups.filter(g=>g.category!=='general').map(g=>`<section class="faq-index-group"><h3><a href="${faqUrl(g)}#preguntas-frecuentes">${esc(g.title)}</a></h3><ul>${g.questions.map(q=>`<li><a href="${faqUrl(g)}#${esc(q.id)}">${esc(q.question)}</a></li>`).join('')}</ul></section>`).join('');
 d.querySelectorAll('body > section,script:not([src])').forEach(e=>e.remove());d.querySelector('footer').insertAdjacentHTML('beforebegin',shell('Preguntas frecuentes','Encuentra orientación para elegir un tapete, comparar opciones y preparar tu cotización. Consulta también las preguntas específicas de cada aplicación.',`<nav class="category-links" aria-label="Temas de preguntas frecuentes"><a href="#compra-cotizacion">Compra y cotización</a><a href="#preguntas-por-aplicacion">Preguntas por aplicación</a></nav><section id="compra-cotizacion"><h2>${esc(general.title)}</h2><p>${esc(general.intro)}</p>${renderFaq([...general.questions,...retained])}</section><nav class="faq-index" id="preguntas-por-aplicacion" aria-labelledby="faq-index-title"><h2 id="faq-index-title">Preguntas por aplicación</h2><p>Abre una pregunta para leer la respuesta en su categoría y consultar los productos relacionados.</p>${index}</nav><p><a class="btn" href="/contacto.html">Solicitar asesoría</a></p>`));
}});
page('ubicacion.html','404.html',{title:'Página no encontrada | Mat Depot',noindex:true,mutate(d){d.querySelectorAll('body > section,script:not([src])').forEach(e=>e.remove());d.querySelector('footer').insertAdjacentHTML('beforebegin',shell('Página no encontrada','La dirección solicitada no corresponde a una página disponible.','<a class="btn" href="/productos.html">Consultar catálogo</a>'));}});
// Legacy dynamic page remains a safe fallback for unknown identifiers; known IDs are redirected at the edge.
require('./build-blog.cjs')({ page, read, origin });
require('./build-guides.cjs')({ page, products, origin, shell, esc });
page('producto.html','producto.html',{noindex:true,title:'Consultar producto del catálogo | Mat Depot'});
fs.writeFileSync(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+allUrls.map(u=>'<url><loc>'+esc(u)+'</loc></url>').join('')+'</urlset>');
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: Claude-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nSitemap: '+origin+'/sitemap.xml\n');
fs.writeFileSync(path.join(out,'llms.txt'),'# Mat Depot\n\n> Catálogo comercial de tapetes y pisos de hule y PVC para proyectos industriales, comerciales y deportivos. Atención desde Tlalnepantla de Baz, México.\n\n## Contacto\n\n- [Cotizaciones]('+origin+'/contacto.html): '+contact.email+'; WhatsApp '+contact.wa+'.\n- Precios, existencias, condiciones de entrega y documentación técnica se confirman al cotizar. No se publica una garantía general de disponibilidad.\n\n## Catálogo\n\n'+products.map(p=>'- ['+p.name+']('+origin+productUrl(p)+'): '+p.short).join('\n')+'\n\n## Ayuda\n\n- [Preguntas frecuentes]('+origin+'/preguntas-frecuentes.html)\n- [Ubicación]('+origin+'/ubicacion.html)\n');
console.log('Generated '+allUrls.length+' indexable pages, '+products.length+' static product pages.');
