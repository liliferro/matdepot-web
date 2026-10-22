const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'../public');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(root).filter(f=>f.endsWith('.html'));let images=0,links=0;
for(const file of files){
 const d=new JSDOM(fs.readFileSync(file,'utf8')).window.document;
 assert.equal(d.querySelectorAll('main').length,1,file+' main');assert.equal(d.querySelectorAll('link[rel=canonical]').length,1);
 for(const s of d.querySelectorAll('script[type="application/ld+json"]'))assert(JSON.parse(s.textContent)['@graph'].length>=2);
 for(const img of d.querySelectorAll('img')){assert(img.hasAttribute('alt'));assert(img.width>0&&img.height>0);images++;}
 for(const e of d.querySelectorAll('[href],[src]'))for(const attr of ['href','src']){
  const url=e.getAttribute(attr);if(!url||!url.startsWith('/')||url.startsWith('//'))continue;
  const target=new URL(url,'https://www.matdepotmex.com').pathname;assert(fs.existsSync(path.join(root,target==='/'?'index.html':target)),file+' missing '+target);links++;
 }
 if(file.includes('/tapetes/')){assert(d.querySelector('article'));assert(d.querySelector('#detail').textContent.length>100);assert(!d.querySelector('script:not([src]):not([type="application/ld+json"])'));}
 if(file.endsWith('/productos.html'))assert.equal(d.querySelectorAll('.catalog-card-wrap').length,35);
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,60);assert(!sitemap.includes('gracias.html'));assert(!sitemap.includes('?id='));
console.log(JSON.stringify({html_pages:files.length,static_products:35,indexable_urls:60,image_elements:images,local_references:links,status:'passed'}));
