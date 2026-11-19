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
assert(v.redirects.some(r=>r.source==='/:path*'&&r.statusCode===308&&r.destination==='https://www.matdepotmex.com/:path*'&&r.has.some(h=>h.type==='host'&&h.value==='matdepotmex.com')));
const robots=fs.readFileSync('public/robots.txt','utf8');
for(const bot of ['GPTBot','OAI-SearchBot','ChatGPT-User','ClaudeBot','Claude-User','PerplexityBot','Google-Extended','Applebot-Extended','Claude-SearchBot','Perplexity-User']){
 assert(new RegExp('User-agent: '+bot+'\\nAllow: /').test(robots),bot);
}
assert(!robots.toLowerCase().includes('disallow'));
const llmsText=fs.readFileSync('public/llms.txt','utf8');
for(const heading of ['## Categorías','## Sectores','## Guías'])assert(llmsText.includes(heading),heading);
const descriptions={
 'categorias/antifatiga.html':1,'categorias/antiderrapantes.html':1,'categorias/gimnasios.html':1,'categorias/seguridad-electrica.html':1,'categorias/areas-humedas.html':1,
 'sectores/industria.html':1,'sectores/cocinas.html':1,'sectores/comercio.html':1
};
for(const file of Object.keys(descriptions)){
 const dom=page(file),d=dom.window.document,text=d.querySelector('meta[name="description"]').content;
 assert(text.length>=140&&text.length<=155,file+' description '+text.length);
 assert(/CDMX/.test(d.title)&&/Edomex/.test(d.title),file+' title');
 assert(!/para tu proyecto/i.test(d.title),file);
 dom.window.close();
}
assert(!page('sectores/industria.html').window.document.title.toLowerCase().includes('antifatiga'));
const dielectric=page('tapetes/tapete-dielectrico.html');
assert(!/precio/i.test(dielectric.window.document.title));
assert(dielectric.window.document.querySelector('a[href="/guias/tapete-dielectrico-precio-voltajes.html"]').textContent.toLowerCase().includes('ver precios y clases'));
dielectric.window.close();
const wet=page('categorias/areas-humedas.html');
assert(!wet.window.document.body.textContent.includes('¿Cualquier tapete de hule sirve para una cocina'));
assert(!wet.window.document.body.textContent.includes('levantar los tapetes de la cocina'));
wet.window.close();
const home=page('index.html'),catalog=page('productos.html');
for(const img of [...home.window.document.querySelectorAll('.hero__visual img, .image-block img, .cat-card img'),...catalog.window.document.querySelectorAll('.cat-card img')]){
 assert(img.getAttribute('srcset'),img.getAttribute('src'));
 assert(img.getAttribute('sizes'));
 for(const part of img.getAttribute('srcset').split(',')){
  const url=part.trim().split(/\s+/)[0];
  assert(fs.existsSync('public'+url),url);
 }
}
home.window.close();catalog.window.close();
assert(!fs.readFileSync('public/index.html','utf8').includes('linkedin.com'));
const orgPage=page('index.html');
const orgGraph=JSON.parse(orgPage.window.document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
const org=orgGraph.find(g=>g['@type']==='Organization');
const local=orgGraph.find(g=>g['@type']==='LocalBusiness');
assert(org&&local&&org['@id']!==local['@id']);
assert(!JSON.stringify(orgGraph).includes('linkedin.com'));
assert.equal(org.contactPoint[0].contactType,'sales');
assert.equal(org.contactPoint[0].telephone,'+525544943014');
assert.equal(local.address.postalCode,'54030');
assert.equal(local.openingHoursSpecification[0].opens,'09:00');
orgPage.window.close();
const blogFiles=['blog.html',...require('../data/blog-posts.json').map(p=>'blog/'+p.slug+'.html'),'blog/mejor-piso-para-gimnasio.html'];
const questions=new Set();
for(const file of blogFiles){
 const dom=page(file),d=dom.window.document;
 assert(!d.title.includes('MatDepot'),file);
 if(file==='blog.html'){dom.window.close();continue;}
 assert(!d.body.textContent.includes('¿Qué debo confirmar antes de comprar?'),file);
 assert(!d.body.textContent.includes('El precio se confirma mediante cotización'),file);
 const graph=JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
 const faq=graph.find(g=>g['@type']==='FAQPage');
 const visible=[...d.querySelectorAll('.blog-faq details')].map(el=>[el.querySelector('summary').textContent,el.querySelector('p').textContent]);
 assert.deepEqual(faq.mainEntity.map(q=>[q.name,q.acceptedAnswer.text]),visible,file);
 for(const [q,a] of visible){assert(!questions.has(q),q);questions.add(q);assert(/\d/.test(a),q);}
 dom.window.close();
}
const dates=[...fs.readFileSync('public/sitemap.xml','utf8').matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m=>m[1]);
assert(new Set(dates).size>1,'lastmod must not stamp every URL with one date');
assert(fs.readFileSync('public/sitemap.xml','utf8').includes('<loc>https://www.matdepotmex.com/categorias/antifatiga.html</loc><lastmod>2026-11-19</lastmod>'));
assert(fs.readFileSync('public/sitemap.xml','utf8').includes('<loc>https://www.matdepotmex.com/tapetes/tapete-rizo.html</loc><lastmod>2026-11-16</lastmod>'));
console.log('Days 0-7 checks passed: metadata length, schema split, robots, llms, unique FAQs, srcset and lastmod.');
