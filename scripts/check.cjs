const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'../public');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(root).filter(f=>f.endsWith('.html'));let images=0,links=0;
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 const d=new JSDOM(html).window.document;
 const email='matdepotmx@gmail.com';
 for(const match of html.matchAll(/matdepot[a-z]*@gmail\.com/gi))assert.equal(match[0],email,file+' incorrect contact email');
 for(const a of d.querySelectorAll('a[href^="mailto:"]'))assert.equal(a.getAttribute('href').split('?')[0],'mailto:'+email,file+' incorrect email link');
 if(file.endsWith('/contacto.html'))assert.equal(d.querySelector('#contact-form').getAttribute('action'),'https://formsubmit.co/'+email);
 assert.equal(d.querySelectorAll('main').length,1,file+' main');assert.equal(d.querySelectorAll('link[rel=canonical]').length,1);
 for(const s of d.querySelectorAll('script[type="application/ld+json"]'))assert(JSON.parse(s.textContent)['@graph'].length>=2);
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
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,51+require('../data/blog-posts.json').length);assert(!sitemap.includes('gracias.html'));assert(!sitemap.includes('?id='));
console.log(JSON.stringify({html_pages:files.length,static_products:35,indexable_urls:(sitemap.match(/<loc>/g)||[]).length,image_elements:images,local_references:links,status:'passed'}));
