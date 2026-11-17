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
