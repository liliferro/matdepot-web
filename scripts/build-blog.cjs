const { marked } = require('marked');
const { JSDOM } = require('jsdom');

module.exports = function buildBlog({ page, read, origin }) {
  const url = '/blog/mejor-piso-para-gimnasio.html';
  const title = '¿Cuál es el mejor piso para un gimnasio? Guía para elegir por zona';
  const description = 'Elige el mejor piso para un gimnasio según sus zonas. Compara hule en rollo y modular, revisa espesores y calcula el área para solicitar tu cotización.';
  const image = 'assets/products/tapete-para-gimnasio-modular-de-13-mm-01.webp';
  const date = '2026-10-21';
  const dateLabel = '21 de octubre de 2026';
  const crumbs = (article = false) => ({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: origin + '/' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: origin + '/blog.html' },
    ...(article ? [{ '@type': 'ListItem', position: 3, name: title, item: origin + url }] : [])
  ] });
  function prepare(d, html) {
    d.querySelectorAll('body > section,script:not([src])').forEach(el => el.remove());
    const css = d.createElement('link'); css.rel = 'stylesheet'; css.href = '/assets/blog.css'; d.head.append(css);
    d.querySelector('footer').insertAdjacentHTML('beforebegin', html);
  }
  page('ubicacion.html', 'blog.html', {
    title: 'Blog de tapetes y pisos técnicos | MatDepot',
    description: 'Guías para elegir tapetes y pisos técnicos en México. Compara opciones, calcula cantidades y prepara la cotización de tu proyecto con MatDepot.',
    image,
    graph: [crumbs(), { '@type': 'Blog', '@id': origin + '/blog.html#blog', url: origin + '/blog.html', name: 'Blog de MatDepot', inLanguage: 'es-MX', publisher: { '@id': origin + '/#organization' }, blogPost: { '@id': origin + url + '#article' } }],
    mutate(d) {
      prepare(d, `<main class="blog-main"><header class="blog-heading"><nav class="crumbs" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><span aria-current="page">Blog</span></nav><p class="eyebrow">Guías para tu proyecto</p><h1>Blog de tapetes y pisos técnicos</h1><p class="lead">Elige con información: compara materiales, calcula cantidades y descubre qué revisar antes de cotizar.</p></header><section aria-labelledby="latest-heading"><h2 id="latest-heading">Primera guía · Gimnasios</h2><article class="blog-card"><a class="blog-card-image" href="${url}" tabindex="-1" aria-hidden="true"><img src="/${image}" alt="" loading="lazy"></a><div><p class="eyebrow">Gimnasios · Incluye calculadora</p><h3><a href="${url}">${title}</a></h3><p>Compara formatos y espesores según la actividad de cada zona. Usa la calculadora para estimar superficie y losetas de tu proyecto.</p><p><time datetime="${date}">${dateLabel}</time></p><a class="btn" href="${url}">Leer guía y calcular superficie →</a></div></article></section><aside class="blog-help"><h2>¿Ya sabes qué necesita tu proyecto?</h2><p>Consulta las fichas del catálogo o comparte las condiciones de uso para recibir orientación.</p><a href="/productos.html">Explorar productos</a> · <a href="/contacto.html">Solicitar cotización</a></aside></main>`);
    }
  });
  // Only trusted repository Markdown is rendered; HTML comments contain editorial notes, not published copy.
  const markdown = read('docs/blog/mejor-piso-para-gimnasio.md').replace(/<!--[\s\S]*?-->/g, '').replace(/^# .*$/m, '');
  const contentDom = new JSDOM(`<div id="body">${marked.parse(markdown)}</div>`);
  const body = contentDom.window.document.querySelector('#body');
  const calculatorDom = new JSDOM(read('docs/blog/calculadora-gimnasio.html'));
  const calculator = calculatorDom.window.document.querySelector('[data-gym-calculator]');
  const calcTitle = calculator.querySelector('h1');
  const h3 = calculatorDom.window.document.createElement('h3'); h3.id = calcTitle.id; h3.textContent = 'Ingresa las medidas de tu proyecto'; calcTitle.replaceWith(h3);
  body.querySelector('a[href="calculadora-gimnasio.html"]').parentElement.outerHTML = calculator.outerHTML;
  const headings = [...body.querySelectorAll(':scope > h2')];
  headings.forEach((heading, index) => heading.id = heading.textContent.startsWith('Calcula cuánto') ? 'calculadora' : `seccion-${index + 1}`);
  // Use responsive scroll containers for comparison tables without changing their semantics.
  body.querySelectorAll(':scope > table').forEach(table => {
    const wrap = contentDom.window.document.createElement('div'); wrap.className = 'blog-table'; wrap.tabIndex = 0;
    wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', table.previousElementSibling?.textContent || 'Comparación de pisos');
    table.before(wrap); wrap.append(table); table.querySelectorAll('thead th').forEach(th => th.scope = 'col');
  });
  const toc = headings.map(h => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join('');
  page('ubicacion.html', url.slice(1), {
    title: '¿Cuál es el mejor piso para un gimnasio? | MatDepot', description, article: true, image,
    graph: [crumbs(true), { '@type': 'BlogPosting', '@id': origin + url + '#article', mainEntityOfPage: origin + url, url: origin + url,
      headline: title, description, image: origin + '/' + image, datePublished: date, dateModified: date, inLanguage: 'es-MX',
      author: { '@type': 'Organization', '@id': origin + '/#organization', name: 'Mat Depot', url: origin + '/quienes-somos.html' }, publisher: { '@id': origin + '/#organization' }, isPartOf: { '@id': origin + '/blog.html#blog' } }],
    mutate(d) {
      prepare(d, `<main class="blog-main"><article><header class="blog-heading"><nav class="crumbs" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><a href="/blog.html">Blog</a><span>/</span><span aria-current="page">Pisos para gimnasio</span></nav><p class="eyebrow">Guía de compra · Gimnasios</p><h1>${title}</h1><p class="blog-byline">Por <a href="/quienes-somos.html" rel="author">Mat Depot</a> · Publicado el <time datetime="${date}">${dateLabel}</time></p></header><div class="blog-body">${body.firstElementChild.outerHTML}<p><a class="btn" href="#calculadora">Calcular mi superficie ↓</a></p><figure class="blog-figure"><img src="/${image}" alt="Tapete modular negro para gimnasio de 13 mm del catálogo MatDepot" loading="lazy"><figcaption>Imagen del catálogo: tapete modular de 13 mm. No representa una instalación documentada.</figcaption></figure><nav class="blog-toc" aria-label="Contenido del artículo"><strong>En esta guía</strong><ol>${toc}</ol></nav>${[...body.children].slice(1).map(el => el.outerHTML).join('')}<aside class="blog-editorial"><h2>Sobre esta guía</h2><p>Contenido elaborado con asistencia de inteligencia artificial a partir del catálogo comercial de Mat Depot. Se contrastaron medidas y presentaciones con las fichas del sitio. No se realizaron ensayos físicos ni una revisión técnica independiente. La selección final requiere confirmar las condiciones de uso del proyecto.</p><p>Las especificaciones se consultaron el ${dateLabel}. Si tienes dudas sobre un dato, <a href="/contacto.html">contacta a Mat Depot</a>.</p></aside></div></article><p><a href="/blog.html">← Volver al blog</a></p></main>`);
      const css = d.createElement('link'); css.rel = 'stylesheet'; css.href = '/assets/calculadora-gimnasio.css'; d.head.append(css);
      const script = d.createElement('script'); script.src = '/assets/calculadora-gimnasio.js'; script.defer = true; d.head.append(script);
    }
  });
  contentDom.window.close(); calculatorDom.window.close();
};
