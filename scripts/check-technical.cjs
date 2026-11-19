const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const page=p=>new JSDOM(fs.readFileSync('public/'+p,'utf8'));
const v=JSON.parse(fs.readFileSync('vercel.json'));
for(const route of ['contacto','blog','ubicacion','quienes-somos'])assert(v.redirects.some(r=>r.source==='/'+route&&r.destination==='/'+route+'.html'&&r.statusCode===301));
const headers=v.headers.find(h=>h.source==='/(.*)').headers;
for(const key of ['Content-Security-Policy','X-Content-Type-Options','X-Frame-Options','Referrer-Policy'])assert(headers.some(h=>h.key===key));
for(const name of ['preguntas-frecuentes.html','categorias/antifatiga.html','categorias/gimnasios.html']){
 const dom=page(name),d=dom.window.document,graph=JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
 const faq=graph.find(g=>g['@type']==='FAQPage');assert(faq);assert.equal(faq.mainEntity.length,d.querySelectorAll('.faq details').length);
 for(const q of faq.mainEntity)assert(d.body.textContent.includes(q.name));dom.window.close();
}
for(const name of ['categorias/antifatiga.html','sectores/industria.html','sectores/cocinas.html','sectores/comercio.html']){
 const dom=page(name),d=dom.window.document,graph=JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
 assert(graph.some(g=>g['@type']==='BreadcrumbList'));
 assert.equal(graph.find(g=>g['@type']==='ItemList').itemListElement.length,d.querySelectorAll('.cat-card').length);dom.window.close();
}
const contact=page('contacto.html');assert.equal(contact.window.document.querySelector('form').action,'https://formsubmit.co/matdepotmx@gmail.com');assert(!contact.window.document.querySelector('#f-msg').required);contact.window.close();
const sitemap=fs.readFileSync('public/sitemap.xml','utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,(sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g)||[]).length);
assert(fs.readFileSync('public/llms-full.txt','utf8').includes('matdepotmx@gmail.com'));
assert.equal(fs.readFileSync('public/BingSiteAuth.xml','utf8'),fs.readFileSync('BingSiteAuth.xml','utf8'));
console.log('Technical checks passed: redirects, headers, visible FAQ parity, category/sector schemas, sitemap dates, email and Bing verification.');

assert.notEqual(v.cleanUrls,true,'Keep .html canonical URLs');
for(const folder of ['tapetes','categorias','blog','sectores','guias'])for(const f of fs.readdirSync('public/'+folder).filter(f=>f.endsWith('.html'))){
 const target='/'+folder+'/'+f,source=target.slice(0,-5);
 assert(v.redirects.some(r=>r.source===source&&r.destination===target&&r.statusCode===301),source);
 const dom=page(folder+'/'+f);
 if(folder==='tapetes'){
  const img=dom.window.document.querySelector('.prod-gallery img');assert.equal(img.getAttribute('fetchpriority'),'high');
  assert.equal(dom.window.document.querySelector('link[as="image"]').getAttribute('href'),img.getAttribute('src'));
 }
 dom.window.close();
}
assert(v.redirects.some(r=>r.source==='/aviso-de-privacidad'&&r.destination==='/aviso-privacidad.html'));
const llms=fs.readFileSync('public/llms.txt','utf8');
for(const match of llms.matchAll(/\]\(https:\/\/www\.matdepotmex\.com([^)]*)\)/g)){
 const file=match[1].split('#')[0];assert(fs.existsSync('public'+(file==='/'?'/index.html':file)),file);
}
console.log('SEO follow-up passed: nested routes, product image priority and valid llms links.');
assert(v.redirects.some(r=>r.source==='/(.*)'&&r.statusCode===308&&r.destination==='https://www.matdepotmex.com/$1'&&r.has?.some(h=>h.type==='host'&&h.value==='matdepotmex.com')));
const robots=fs.readFileSync('public/robots.txt','utf8');
for(const bot of ['GPTBot','OAI-SearchBot','ChatGPT-User','ClaudeBot','Claude-User','Claude-SearchBot','PerplexityBot','Perplexity-User','Google-Extended','Applebot-Extended']){
 assert(new RegExp('User-agent: '+bot+'\\nAllow: /').test(robots), bot);
}
assert(llms.includes('/categorias/antifatiga.html')&&llms.includes('/sectores/cocinas.html')&&llms.includes('/guias/tapete-dielectrico-precio-voltajes.html'));
const home=page('index.html');
const homeGraph=JSON.parse(home.window.document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
const org=homeGraph.find(g=>g['@type']==='Organization');
const local=homeGraph.find(g=>g['@type']==='LocalBusiness');
assert(org&&local&&org['@id']!==local['@id']);
assert(!JSON.stringify(homeGraph).includes('linkedin.com'));
assert.equal(org.contactPoint[0].contactType,'sales');
assert.equal(org.contactPoint[0].telephone,'+525544943014');
assert(home.window.document.querySelector('.hero__visual img').getAttribute('srcset').includes(' 480w'));
assert(home.window.document.querySelector('.hero__visual img').getAttribute('sizes'));
home.window.close();
const catalog=page('productos.html');
assert(catalog.window.document.querySelector('.cat-card img').getAttribute('srcset'));
assert(catalog.window.document.querySelector('.cat-card img').getAttribute('sizes'));
catalog.window.close();
const dielectric=page('tapetes/tapete-dielectrico.html');
assert(!/precio/i.test(dielectric.window.document.title));
assert(dielectric.window.document.querySelector('a[href="/guias/tapete-dielectrico-precio-voltajes.html"]').textContent.includes('ver precios y clases'));
assert(dielectric.window.document.querySelector('.prod-gallery img').getAttribute('srcset'));
dielectric.window.close();
const wet=page('categorias/areas-humedas.html');
assert(!wet.window.document.body.textContent.includes('¿Cualquier tapete de hule sirve para una cocina'));
assert(wet.window.document.querySelector('a[href="/blog/tapete-cocina-industrial.html"]'));
wet.window.close();
const industry=page('sectores/industria.html');
assert(!/antifatiga/i.test(industry.window.document.title));
assert.equal(industry.window.document.querySelector('a[href="/categorias/antifatiga.html"]').textContent,'tapetes antifatiga');
industry.window.close();
for(const file of ['categorias/antifatiga.html','categorias/antiderrapantes.html','categorias/gimnasios.html','categorias/seguridad-electrica.html','categorias/areas-humedas.html','sectores/industria.html','sectores/cocinas.html','sectores/comercio.html']){
 const dom=page(file);const description=dom.window.document.querySelector('meta[name="description"]').content;
 const length=[...description].length;
 assert(length>=140&&length<=155, file+' description '+length);
 assert(/CDMX|Edomex/.test(dom.window.document.title), file);
 dom.window.close();
}
const dates=[...sitemap.matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map(match=>[match[1],match[2]]);
assert(dates.some(([,date])=>date==='2026-11-16'),'unchanged URLs keep their previous lastmod');
assert(dates.some(([url,date])=>url.endsWith('/tapetes/tapete-dielectrico.html')&&date==='2026-11-19'));
assert(dates.some(([url,date])=>url.endsWith('/tapetes/tapete-rizo.html')&&date==='2026-11-16'));
assert(!dates.every(([,date])=>date==='2026-11-19'));
console.log('Days 0-7 checks passed: metadata length, schema split, robots, llms, srcset, 308 redirect and selective lastmod.');
