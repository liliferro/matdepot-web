const fs = require('node:fs'), assert = require('node:assert/strict'), { JSDOM } = require('jsdom');
const articlePath = '/blog/mejor-piso-para-gimnasio.html';
const posts = require('../data/blog-posts.json');
const titles=new Set(), descriptions=new Set();
for (const path of ['/blog.html', articlePath, ...posts.map(p=>'/blog/'+p.slug+'.html')]) {
  const dom = new JSDOM(fs.readFileSync('public' + path, 'utf8'));
  const d = dom.window.document;
  assert.equal(d.querySelectorAll('h1').length, 1);
  assert.equal(d.querySelector('link[rel="canonical"]').href, 'https://www.matdepotmex.com' + path);
  assert.equal(d.querySelector('meta[name="robots"]'), null);
  assert.equal(d.querySelector('.nav-links [aria-current="page"]').getAttribute('href'), '/blog.html');
  const ids = [...d.querySelectorAll('[id]')].map(e => e.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate IDs');
  for (const link of d.querySelectorAll('a[href^="#"]')) assert(d.getElementById(link.getAttribute('href').slice(1)), 'broken anchor');
  assert(!titles.has(d.title)); titles.add(d.title);
  const description=d.querySelector('meta[name="description"]').content;
  assert(!descriptions.has(description)); descriptions.add(description);
  if (path.startsWith('/blog/')) {
    const graph = JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
    const posting = graph.find(g => g['@type'] === 'BlogPosting');
    assert(posting && graph.some(g => g['@type'] === 'BreadcrumbList'));
    assert.equal(posting.headline, d.querySelector('h1').textContent);
    assert.equal(posting.datePublished, d.querySelector('time').dateTime);
    assert(posting.articleSection);
    assert(d.querySelector('meta[property="og:image:alt"]').content);
    assert(d.querySelector('.blog-body a[href*="preguntas-frecuentes"]'),'article links to existing FAQ');
    assert(d.querySelector('.blog-body a[href*="/categorias/"], .blog-body a[href="/productos.html"]'),'article links to catalogue');
    assert.equal(d.querySelector('meta[property="og:type"]').content, 'article');
    if(path!==articlePath){
      const post=posts.find(p=>path==='/blog/'+p.slug+'.html');
      if(post.group==='Gimnasios')assert(d.querySelector('.blog-body a[href="'+articlePath+'"]'),'gym guide links to pillar');
      assert(d.querySelector('.blog-body > p').textContent.toLowerCase().includes(post.keyword),post.slug+' opening keyword');
      assert.equal(d.querySelectorAll('[data-tool]').length,1);
      assert(d.querySelector('script[src="/assets/blog-tools.js"]'));
      assert(d.querySelector('main article a[href*="/tapetes/"]'));
    } else {
    assert.match(d.querySelector('.blog-body > p').textContent, /mejor piso para un gimnasio/);
    assert.equal(d.querySelectorAll('[data-gym-calculator]').length, 1);
    assert(d.querySelector('script[src="/assets/calculadora-gimnasio.js"]'));
    assert.equal(d.querySelector('a[href="calculadora-gimnasio.html"]'), null);
    assert.equal(d.querySelectorAll('main article a[href*="/tapetes/"]').length, 4);
    }
  }
  dom.window.close();
}
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
assert(sitemap.includes(articlePath)); assert(sitemap.includes('/blog.html'));
for(const post of posts)assert(sitemap.includes('/blog/'+post.slug+'.html'));
const index=new JSDOM(fs.readFileSync('public/blog.html','utf8'));
assert.equal(index.window.document.querySelectorAll('.blog-card').length,11);index.window.close();
console.log('Blog passed: indexability, canonical URLs, structured data, navigation, unique headings/anchors and embedded calculator.');
