const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'../public');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(root).filter(f=>f.endsWith('.html'));let images=0,links=0;
const origin='https://www.matdepotmex.com';
const sameAs=['https://www.instagram.com/matdepotmex','https://www.facebook.com/share/1CJdVqXQmH/','https://www.linkedin.com/in/mat-depot-70b19937a/','https://youtube.com/@matdepot25','https://www.tiktok.com/@matdepot'];
const disambiguation='Mat Depot no tiene relación con matdepot.com.mx, que corresponde a otra empresa.';
const types=node=>[].concat(node['@type']||[]);
const walkSchema=(value,where)=>{
 if(typeof value==='string')assert(value.trim(),where+' empty string');
 else if(Array.isArray(value))value.forEach((item,i)=>walkSchema(item,where+'['+i+']'));
 else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))walkSchema(item,where+'.'+key);
};
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 const d=new JSDOM(html).window.document;
 const email='matdepotmx@gmail.com';
 for(const match of html.matchAll(/matdepot[a-z]*@gmail\.com/gi))assert.equal(match[0],email,file+' incorrect contact email');
 for(const a of d.querySelectorAll('a[href^="mailto:"]'))assert.equal(a.getAttribute('href').split('?')[0],'mailto:'+email,file+' incorrect email link');
 if(file.endsWith('/contacto.html'))assert.equal(d.querySelector('#contact-form').getAttribute('action'),'https://formsubmit.co/'+email);
 assert.equal(d.querySelectorAll('main').length,1,file+' main');assert.equal(d.querySelectorAll('link[rel=canonical]').length,1);
 const blocks=[...d.querySelectorAll('script[type="application/ld+json"]')];
 assert.equal(blocks.length,1,file+' json-ld');
 const data=JSON.parse(blocks[0].textContent);
 assert.equal(data['@context'],'https://schema.org',file);
 walkSchema(data,file);
 const graph=data['@graph'];
 assert(graph.length>=3,file);
 const org=graph.find(n=>types(n).includes('Organization')&&n['@id']===origin+'/#organization');
 const local=graph.find(n=>types(n).includes('LocalBusiness')&&n['@id']===origin+'/#localbusiness');
 const site=graph.find(n=>types(n).includes('WebSite')&&n['@id']===origin+'/#website');
 assert(org&&local&&site,file+' entity graph');
 assert.equal(org.name,'Mat Depot');
 assert.equal(org.legalName,'Mat Depot, S.A. de C.V.');
 assert.equal(org.url,origin+'/');
 assert.equal(org.email,'matdepotmx@gmail.com');
 assert.equal(org.telephone,'+525596265258');
 assert.equal(local.telephone,org.telephone);
 assert.deepEqual(org.sameAs,sameAs);
 assert.deepEqual(local.sameAs,sameAs);
 assert.deepEqual([...d.querySelectorAll('.foot-socials a')].map(a=>a.href),sameAs);
 assert.equal(org.logo['@type'],'ImageObject');
 assert.equal(org.logo.url,origin+'/assets/apple-touch-icon.png');
 assert.equal(org.logo.width,180);
 assert.equal(org.logo.height,180);
 assert.equal(local.logo.url,org.logo.url);
 assert.equal(org.address.streetAddress,'C. Popocatépetl 42, San Javier');
 assert.equal(org.address.postalCode,'54030');
 assert.equal(org.address.addressLocality,'Tlalnepantla de Baz');
 assert.equal(org.address.addressRegion,'Estado de México');
 assert.equal(org.address.addressCountry,'MX');
 assert.deepEqual(local.address,org.address);
 assert.equal(org.openingHoursSpecification,undefined);
 assert.equal(local.openingHoursSpecification.opens,'09:00');
 assert.equal(local.openingHoursSpecification.closes,'18:00');
 assert.deepEqual(local.openingHoursSpecification.dayOfWeek,['https://schema.org/Monday','https://schema.org/Tuesday','https://schema.org/Wednesday','https://schema.org/Thursday','https://schema.org/Friday']);
 assert(!JSON.stringify(local.openingHoursSpecification).match(/Saturday|Sunday/));
 assert.deepEqual(local.contactPoint.map(p=>p.telephone),['+525596265259','+525544943014']);
 assert.deepEqual(local.areaServed.map(a=>a.name),['Tlalnepantla de Baz','Estado de México','México']);
 assert(!graph.some(n=>n.geo||n.latitude||n.longitude),file+' invented coordinates');
 assert(d.body.textContent.includes('Lun – Vie · 9:00 – 18:00'),file+' hours not visible');
 assert(d.body.textContent.includes('C. Popocatépetl 42, San Javier'),file+' address not visible');
 const rival=(html.match(/matdepot\.com\.mx/g)||[]).length;
 if(file.endsWith('/sobre-mat-depot.html')){
  assert(rival>=1);
  assert(d.body.textContent.includes(disambiguation));
  assert.equal(graph.filter(n=>n.disambiguatingDescription).map(n=>n.disambiguatingDescription).join(''),disambiguation);
  assert.equal(d.querySelectorAll('h1').length,1);
  assert.equal(d.querySelector('h1').textContent.trim(),'Sobre Mat Depot');
  assert.equal(d.title,'Sobre Mat Depot | Sitio oficial matdepotmex.com');
  const about=graph.find(n=>types(n).includes('AboutPage'));
  assert(about&&about.mainEntity['@id']===origin+'/#organization');
  assert.equal(about.url,origin+'/sobre-mat-depot.html');
  for(const href of ['/quienes-somos.html','/ubicacion.html','/contacto.html','/productos.html','/tapetes-de-hule-tlalnepantla.html'])assert(d.querySelector('a[href="'+href+'"]'),href);
 }else{
  assert.equal(rival,0,file+' rival domain');
  assert(!blocks[0].textContent.includes('matdepot.com.mx'),file);
  assert(!graph.some(n=>types(n).includes('AboutPage')),file);
 }
 if(file.endsWith('/tapetes-de-hule-tlalnepantla.html')){
  assert.equal(d.querySelectorAll('h1').length,1);
  assert.equal(d.querySelector('h1').textContent.trim(),'Tapetes de hule en Tlalnepantla');
  assert.equal(d.title,'Tapetes de hule en Tlalnepantla y mayoreo en Edomex | Mat Depot');
  assert.equal(d.querySelector('#contact-form').getAttribute('action'),'https://formsubmit.co/matdepotmx@gmail.com');
  assert(d.body.textContent.includes('[PENDIENTE]'));
  const faq=graph.find(n=>types(n).includes('FAQPage'));
  const details=[...d.querySelectorAll('#faq-zona details')];
  assert.equal(faq.mainEntity.length,details.length);
  details.forEach((item,i)=>{
   assert.equal(faq.mainEntity[i].name,item.querySelector('summary').textContent.trim());
   assert.equal(faq.mainEntity[i].acceptedAnswer.text,[...item.querySelectorAll(':scope > p')].map(p=>p.textContent.trim()).join(' '));
  });
  const pageNode=graph.find(n=>types(n).includes('WebPage')&&n['@id']===origin+'/tapetes-de-hule-tlalnepantla.html#webpage');
  assert.equal(pageNode.mainEntity['@id'],origin+'/#localbusiness');
 }
 if(file.endsWith('/quienes-somos.html')){
  assert.equal(d.querySelector('h1').textContent.trim(),'Especialistas en materia que resiste.');
  assert.equal(d.title,'Proveedor de tapetes y pisos en México | Mat Depot');
  assert(d.querySelector('a[href="/sobre-mat-depot.html"]'));
 }
 if(file.endsWith('/ubicacion.html')){
  assert.equal(d.querySelector('h1').textContent.trim(),'Nuestro almacén.');
  assert.equal(d.title,'Ubicación y envíos desde Tlalnepantla | Mat Depot');
  assert(!/mayoreo/i.test(d.title));
  assert(d.querySelector('a[href="/tapetes-de-hule-tlalnepantla.html"]'));
 }
 if(file.endsWith('/index.html'))assert.equal(d.querySelector('h1').textContent.trim(),'Tapetes y pisos de hule industriales en CDMX y Edomex');
 for(const img of d.querySelectorAll('img')){assert(img.hasAttribute('alt'));assert(img.width>0&&img.height>0);images++;}
 for(const e of d.querySelectorAll('[href],[src]'))for(const attr of ['href','src']){
  const url=e.getAttribute(attr);if(!url||!url.startsWith('/')||url.startsWith('//'))continue;
  const target=new URL(url,'https://www.matdepotmex.com').pathname;assert(fs.existsSync(path.join(root,target==='/'?'index.html':target)),file+' missing '+target);links++;
 }
 if(file.includes('/tapetes/')){assert(d.querySelector('article'));assert(d.querySelector('#detail').textContent.length>100);assert(!d.querySelector('script:not([src]):not([type="application/ld+json"])'));}
 if(file.endsWith('/productos.html'))assert.equal(d.querySelectorAll('.catalog-card-wrap').length,35);
 const sales=[...d.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="web.whatsapp.com"]')];
 assert(sales.some(a=>!a.hasAttribute('data-share-article')),file+' missing sales WhatsApp link');
 for(const a of sales){
  const href=a.getAttribute('href');
  const u=new URL(href,'https://www.matdepotmex.com');
  if(a.hasAttribute('data-share-article')){
   assert.equal(u.hostname,'wa.me',file);
   assert.equal(u.pathname,'/',file);
   assert.equal(u.searchParams.get('phone'),null,file);
   assert(!href.includes('5215544943014'),file);
   continue;
  }
  assert.equal(u.hostname,'wa.me',file);
  assert.equal(u.pathname,'/5215544943014',file+' '+href);
  assert.match(u.searchParams.get('text')||'',/^Hola, quiero cotizar(?:: .+| tapetes o pisos)\. \(ref: [A-Z0-9-]+\)$/,file);
 }
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,53+require('../data/blog-posts.json').length);assert(!sitemap.includes('gracias.html'));assert(!sitemap.includes('?id='));assert(sitemap.includes(origin+'/sobre-mat-depot.html'));assert(sitemap.includes(origin+'/tapetes-de-hule-tlalnepantla.html'));assert(fs.existsSync(path.join(root,'assets/apple-touch-icon.png')));
console.log(JSON.stringify({html_pages:files.length,static_products:35,indexable_urls:(sitemap.match(/<loc>/g)||[]).length,image_elements:images,local_references:links,status:'passed'}));
