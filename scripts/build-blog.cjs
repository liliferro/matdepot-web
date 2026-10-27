const { marked } = require('marked');
const { JSDOM } = require('jsdom');
const vm = require('node:vm');
const renderTool = require('./blog-tools.cjs');
const enrich = require('./blog-summary.cjs');
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports = function buildBlog({ page, read, origin }) {
  const catalog = {window:{},encodeURIComponent,URLSearchParams}; vm.runInNewContext(read('assets/catalogo.js'),catalog);
  const first = {slug:'mejor-piso-para-gimnasio',title:'¿Cuál es el mejor piso para un gimnasio? Guía para elegir por zona',seoTitle:'¿Cuál es el mejor piso para un gimnasio? | MatDepot',description:'Elige el mejor piso para un gimnasio según sus zonas. Compara hule en rollo y modular, revisa espesores y calcula el área para solicitar tu cotización.',group:'Gimnasios',category:'gimnasios',product:'tapete-para-gimnasio-modular-de-13-mm',date:'2026-10-21',tool:'gym',related:['piso-gimnasio-rollo-o-modular','espesor-piso-gimnasio','instalar-piso-hule-concreto-loseta']};
  const {categories} = JSON.parse(read('data/content.json'));
  const posts = [first,...JSON.parse(read('data/blog-posts.json'))];
  const pathOf = post=>'/blog/'+post.slug+'.html';
  const share = (post, placement) => {
    const url = new URL(origin+pathOf(post));
    Object.entries({utm_source:'whatsapp',utm_medium:'social',utm_campaign:'blog_share',utm_content:post.slug}).forEach(([k,v])=>url.searchParams.set(k,v));
    return `<a class="btn blog-share" href="https://wa.me/?text=${esc(encodeURIComponent(post.title+'\n'+url.href))}" target="_blank" rel="noopener noreferrer" data-share-article="${esc(post.slug)}" data-share-placement="${placement}" aria-label="Compartir por WhatsApp: ${esc(post.title)}">Compartir por WhatsApp <span aria-hidden="true">↗</span></a>`;
  };
  const dateLabel = date=>new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));
  const productOf = post=>catalog.window.MD_CATALOG.find(p=>p.slug===post.product);
  const crumbs = post=>({'@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'Inicio',item:origin+'/'},
    {'@type':'ListItem',position:2,name:'Blog',item:origin+'/blog.html'},
    ...(post?[{'@type':'ListItem',position:3,name:post.title,item:origin+pathOf(post)}]:[])
  ]});
  function prepare(d,html) {
    d.querySelectorAll('body > section,script:not([src])').forEach(el=>el.remove());
    const css=d.createElement('link'); css.rel='stylesheet';css.href='/assets/blog.css';d.head.append(css);
    d.querySelector('footer').insertAdjacentHTML('beforebegin',html);
  }
  const groups=[...new Set(posts.map(p=>p.group))];
  const groupId = name=>name.toLowerCase();
  const card = post=>`<article class="blog-card"><a class="blog-card-image" href="${pathOf(post)}" tabindex="-1" aria-hidden="true"><img src="/${productOf(post).images[0]}" alt="" loading="lazy"></a><div><p class="eyebrow">${esc(post.group)} · Herramienta interactiva</p><h3><a href="${pathOf(post)}">${esc(post.title)}</a></h3><p>${esc(post.description)}</p><p class="blog-meta"><time datetime="${post.date}">${dateLabel(post.date)}</time>${share(post,'listado_blog')}</p><a class="btn" href="${pathOf(post)}">Leer guía y usar herramienta →</a></div></article>`;
  page('ubicacion.html','blog.html',{
    title:'Blog de tapetes y pisos técnicos | MatDepot',description:'Guías y herramientas para elegir pisos de gimnasio, tapetes industriales y de cocina. Compara opciones y prepara tu cotización con MatDepot.',image:productOf(first).images[0],
    graph:[crumbs(),{'@type':'Blog','@id':origin+'/blog.html#blog',url:origin+'/blog.html',name:'Blog de MatDepot',inLanguage:'es-MX',publisher:{'@id':origin+'/#organization'},blogPost:posts.map(p=>({'@id':origin+pathOf(p)+'#article'}))}],
    mutate(d){prepare(d,`<main class="blog-main"><header class="blog-heading"><nav class="crumbs" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><span aria-current="page">Blog</span></nav><p class="eyebrow">Guías para tu proyecto</p><h1>Blog de tapetes y pisos técnicos</h1><p class="lead">Resuelve tu proyecto con guías, comparaciones y herramientas: calcula cantidades, organiza requisitos y prepara una cotización.</p></header><nav class="blog-filter" aria-label="Temas del blog">${groups.map(g=>`<a href="#${groupId(g)}">${esc(g)}</a>`).join('')}</nav>${groups.map(g=>`<section class="blog-group" id="${groupId(g)}" aria-labelledby="heading-${groupId(g)}"><h2 id="heading-${groupId(g)}">${esc(g)}</h2><div class="blog-list">${posts.filter(p=>p.group===g).map(card).join('')}</div></section>`).join('')}<aside class="blog-help"><h2>¿Ya sabes qué necesita tu proyecto?</h2><p>Consulta las fichas del catálogo o comparte las condiciones de uso para recibir orientación.</p><a href="/productos.html">Explorar productos</a> · <a href="/contacto.html">Solicitar cotización</a></aside></main>`);}
  });
  for(const post of posts) {
    const product=productOf(post); if(!product)throw Error('Missing blog product '+post.product);
    const url=pathOf(post),image=product.images[0];
    const summary=enrich(post,product,catalog.window.MD_CATALOG);
    const markdown=read('docs/blog/'+post.slug+'.md').replace(/<!--[\s\S]*?-->/g,'').replace(/^# .*$/m,'');
    const contentDom=new JSDOM(`<div id="body">${marked.parse(markdown)}</div>`);
    const body=contentDom.window.document.querySelector('#body');
    if(post.tool==='gym') {
      const calcDom=new JSDOM(read('docs/blog/calculadora-gimnasio.html'));
      const calc=calcDom.window.document.querySelector('[data-gym-calculator]');
      const old=calc.querySelector('h1'),heading=calcDom.window.document.createElement('h3');heading.id=old.id;heading.textContent='Ingresa las medidas de tu proyecto';old.replaceWith(heading);
      body.querySelector('a[href="calculadora-gimnasio.html"]').parentElement.outerHTML=calc.outerHTML;calcDom.window.close();
    }else body.querySelector('[data-blog-tool]').outerHTML=renderTool(post.tool);
    const headings=[...body.querySelectorAll(':scope > h2')];
    headings.forEach((heading,i)=>heading.id=heading.textContent.startsWith('Calcula cuánto')?'calculadora':`seccion-${i+1}`);
    if(post.tool!=='gym')body.querySelector('[data-tool]').id='herramienta';
    body.querySelectorAll('a[href]').forEach(a=>{if(a.getAttribute('href').startsWith(origin+'/'))a.setAttribute('href',a.getAttribute('href').slice(origin.length));});
    body.querySelectorAll(':scope > table').forEach(table=>{
      const wrap=contentDom.window.document.createElement('div');wrap.className='blog-table';wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label','Tabla comparativa de la guía');table.before(wrap);wrap.append(table);table.querySelectorAll('thead th').forEach(th=>th.scope='col');
    });
    const toc=headings.map(h=>`<li><a href="#${h.id}">${esc(h.textContent)}</a></li>`).join('');
    const category=categories.find(c=>c.slug===post.category);
    const resources=[
      ...(post.slug==='precio-piso-hule-m2'?[]:[['/blog/precio-piso-hule-m2.html','Precio de piso de hule por m²: cómo calcularlo']]),
      ['/guias/tapete-dielectrico-precio-voltajes.html','Tapete dieléctrico: precio y documentación de voltaje'],
      [category?'/categorias/'+category.slug+'.html':'/productos.html',category?category.name:'Catálogo de tapetes y pisos'],
      [category?'/categorias/'+category.slug+'.html#preguntas-frecuentes':'/preguntas-frecuentes.html',category?'Preguntas frecuentes de esta categoría':'Preguntas de compra y cotización']
    ];
    if(post.group==='Gimnasios' && post.slug!==first.slug)resources.push([pathOf(first),'Guía general: elegir piso para gimnasio y calcular la superficie']);
    const resourceLinks=resources.map(([href,label])=>`<li><a href="${href}">${esc(label)}</a></li>`).join('');
    const related=post.related.map(slug=>{const other=posts.find(p=>p.slug===slug);if(!other)throw Error('Missing related '+slug);return `<li><a href="${pathOf(other)}">${esc(other.title)}</a></li>`;}).join('');
    page('ubicacion.html',url.slice(1),{
      title:post.seoTitle,description:post.description,article:true,image,
      graph:[crumbs(post),summary.schema,{'@type':'BlogPosting','@id':origin+url+'#article',mainEntityOfPage:origin+url,url:origin+url,headline:post.title,description:post.description,articleSection:post.group,image:origin+'/'+image,datePublished:post.date,dateModified:'2026-10-22',inLanguage:'es-MX',author:{'@type':'Organization','@id':origin+'/#organization',name:'Mat Depot',url:origin+'/quienes-somos.html'},publisher:{'@id':origin+'/#organization'},isPartOf:{'@id':origin+'/blog.html#blog'}}],
      mutate(d){
        prepare(d,`<main class="blog-main"><article><header class="blog-heading"><nav class="crumbs" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><a href="/blog.html">Blog</a><span>/</span><span aria-current="page">${esc(post.group)}</span></nav><p class="eyebrow">Guía de compra · ${esc(post.group)}</p><h1>${esc(post.title)}</h1><p class="blog-byline blog-meta"><span>Por <a href="/quienes-somos.html" rel="author">Mat Depot</a> · Publicado el <time datetime="${post.date}">${dateLabel(post.date)}</time></span>${share(post,'articulo')}</p></header><div class="blog-body">${body.firstElementChild.outerHTML}${summary.table}<p><a class="btn" href="#${post.tool==='gym'?'calculadora':'herramienta'}">${post.tool==='gym'?'Calcular mi superficie':'Usar la herramienta'} ↓</a></p><figure class="blog-figure"><img src="/${image}" alt="${esc(product.name)} del catálogo MatDepot" loading="lazy"><figcaption>Imagen de catálogo: ${esc(product.name)}. Consulta su <a href="/tapetes/${product.slug}.html">ficha de producto</a>.</figcaption></figure><nav class="blog-toc" aria-label="Contenido del artículo"><strong>En esta guía</strong><ol>${toc}</ol></nav>${[...body.children].slice(1).map(el=>el.outerHTML).join('')}${summary.faq}<aside class="blog-help"><h2>Continúa con tu proyecto</h2><ul>${related}${resourceLinks}</ul></aside><aside class="blog-editorial"><h2>Sobre esta guía</h2><p>Contenido elaborado con asistencia de inteligencia artificial a partir del catálogo comercial de Mat Depot. Los ejemplos identificados como ilustrativos no representan instalaciones ni resultados de clientes. No se realizaron ensayos físicos ni una revisión técnica independiente. Confirma la selección y las instrucciones del modelo según las condiciones de tu proyecto.</p><p>Datos de catálogo consultados el ${dateLabel(post.date)}. <a href="/contacto.html">Contacta a Mat Depot</a> para confirmar especificaciones o solicitar una corrección.</p></aside></div></article><p><a href="/blog.html">← Volver al blog</a></p></main>`);
        for(const [property,content] of Object.entries({'og:image:alt':product.name+' del catálogo MatDepot','og:locale':'es_MX'})) {
          const meta=d.createElement('meta');meta.setAttribute('property',property);meta.content=content;d.head.append(meta);
        }
        if(post.tool!=='gym'){const recommendations=d.createElement('script');recommendations.src='/assets/blog-recommendations.js';recommendations.defer=true;d.head.append(recommendations);}
        const script=d.createElement('script');script.src=post.tool==='gym'?'/assets/calculadora-gimnasio.js':'/assets/blog-tools.js';script.defer=true;d.head.append(script);
        if(post.tool==='gym'){const css=d.createElement('link');css.rel='stylesheet';css.href='/assets/calculadora-gimnasio.css';d.head.append(css);}
      }
    });
    contentDom.window.close();
  }
};
