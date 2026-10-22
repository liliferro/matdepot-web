const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('public/comparar.html', 'utf8');
function setup(stored, query = '') {
  const dom = new JSDOM(html, { url: 'https://www.matdepotmex.com/comparar.html' + query, runScripts: 'outside-only' });
  const w = dom.window;
  if (stored !== undefined) w.sessionStorage.setItem('md-comparison-v1', stored);
  for (const file of ['catalogo', 'comparison']) w.eval(fs.readFileSync('assets/' + file + '.js', 'utf8'));
  return dom;
}
const dom = setup('{broken');
const w = dom.window, d = w.document, el = id => d.getElementById(id);
const catalog = w.MD_CATALOG;
function choose(id, slug) { d.querySelector('[data-slug="' + slug + '"] .compare-toggle').click(); }

assert.equal(d.querySelectorAll('.compare-toggle').length, 35);
assert.equal(d.querySelectorAll('select').length, 0);
assert.equal(el('comparison').hidden, true);
assert.equal(el('comparison-table').parentElement.hidden, true);
const first = catalog[0], second = catalog[1], third = catalog[2], fourth = catalog[3];
choose('compare-slot-0', first.slug); choose('compare-slot-1', second.slug); choose('compare-slot-2', third.slug);
assert.equal(d.querySelectorAll('#comparison-table thead th').length, 4);
choose('', fourth.slug);
assert.match(el('compare-status').textContent, /hasta 3/);
assert.equal(d.querySelectorAll('#comparison-table thead th').length, 4);

// Values must be identical to the existing product specifications, including missing values.
for (const row of d.querySelectorAll('#comparison-table tbody tr')) {
  const field = row.firstChild.childNodes[0].textContent;
  [first, second, third].forEach((p, i) => assert.equal(row.children[i + 1].textContent, p.specs[field] || 'No especificado'));
}
assert(d.querySelector('.comparison-missing'));
assert(d.querySelector('.comparison-different'));
for (const a of d.querySelectorAll('#comparison-table a')) {
  if (a.textContent === 'Cotizar') assert(catalog.some(p => a.getAttribute('href') === '/contacto.html?prod=' + p.slug));
  else assert(fs.existsSync('public' + a.getAttribute('href')));
}
d.querySelector('.compare-change').click();
assert.equal(d.activeElement.id, 'comparison-products-title');
assert.equal(el('cancel-replace').hidden, false);
choose('', fourth.slug);
assert.equal(d.activeElement.id, 'comparison-title');
assert.equal(el('cancel-replace').hidden, true);
assert.equal(JSON.parse(w.sessionStorage.getItem('md-comparison-v1'))[0], fourth.slug);
el('compare-differences').click();
assert([...d.querySelectorAll('#comparison-table tbody tr')].every(r => r.classList.contains('comparison-different')));
d.querySelector('.compare-remove').click();
assert.equal(d.querySelectorAll('#comparison-table thead th').length, 3);
const restored = setup(w.sessionStorage.getItem('md-comparison-v1'));
assert.equal(restored.window.document.querySelectorAll('#comparison-table thead th').length, 3);
restored.window.close();
el('clear-compare').click();
assert.equal(el('comparison-table').parentElement.hidden, true);
assert.equal(d.activeElement.id, 'comparison-products-title');
assert.equal(el('compare-differences').checked, false);
dom.window.close();
const sanitized = setup(JSON.stringify([first.slug, first.slug, 'invalid', second.slug, third.slug, fourth.slug]));
assert.equal(sanitized.window.document.querySelectorAll('#comparison-table thead th').length, 4);
sanitized.window.close();
const preset = setup(undefined, '?comparar=tapete-dielectrico');
assert.equal(preset.window.document.getElementById('compare-electrical-note').hidden, false);
preset.window.close();
// Missing data alone must never become a claimed difference; blocked storage must not break selection.
const missing = new JSDOM(html, { url: 'https://www.matdepotmex.com/comparar.html', runScripts: 'outside-only' });
missing.window.eval(fs.readFileSync('assets/catalogo.js', 'utf8'));
missing.window.MD_CATALOG[0].specs = { Color: 'Negro' };
missing.window.MD_CATALOG[1].specs = { Color: 'Negro', Espesor: '5 mm' };
Object.defineProperty(missing.window, 'sessionStorage', { get() { throw Error('blocked'); } });
missing.window.eval(fs.readFileSync('assets/comparison.js', 'utf8'));
for (const [i, product] of missing.window.MD_CATALOG.slice(0, 2).entries()) { missing.window.document.querySelector('[data-slug="' + product.slug + '"] .compare-toggle').click(); }
assert.equal(missing.window.document.querySelectorAll('.comparison-different').length, 0);
missing.window.document.getElementById('compare-differences').click();
assert.equal(missing.window.document.getElementById('compare-empty-differences').hidden, false);
missing.window.close();
// Catalog stays compact and carries the selection to the independent page even without storage.
const listing = new JSDOM(fs.readFileSync('public/productos.html', 'utf8'), { url: 'https://www.matdepotmex.com/productos.html', runScripts: 'outside-only' });
const lw = listing.window, ld = lw.document;
Object.defineProperty(lw, 'sessionStorage', { get() { throw Error('blocked'); } });
for (const file of ['catalogo', 'catalog-ui', 'comparison']) lw.eval(fs.readFileSync('assets/' + file + '.js', 'utf8'));
assert.equal(ld.querySelector('section#comparison'), null);
assert.equal(ld.querySelector('#comparison-table'), null);
assert(ld.querySelector('#catalog-controls .compare-open'));
assert.equal(ld.querySelector('.compare-open').textContent, 'Comparar productos');
const toggles = [...ld.querySelectorAll('.compare-toggle')];
toggles.slice(0, 4).forEach(button => button.click());
assert.match(ld.getElementById('compare-status').textContent, /hasta 3/);
assert.equal(ld.querySelectorAll('.compare-toggle[aria-pressed="true"]').length, 3);
assert.equal(ld.querySelector('.compare-open').textContent, 'Comparar productos (3/3)');
const destination = new URL(ld.querySelector('.compare-open').href);
assert.equal(destination.pathname, '/comparar.html');
const transferred = setup(undefined, destination.search);
assert.equal(transferred.window.document.querySelectorAll('#comparison-table thead th').length, 4);
transferred.window.close();
const filter = ld.getElementById('catalog-filter'); filter.value = 'gimnasios'; filter.dispatchEvent(new lw.Event('change'));
assert.equal(ld.querySelector('.compare-open').href, destination.href);
toggles[0].click();
assert.equal(ld.querySelector('.compare-open').textContent, 'Comparar productos (2/3)');
listing.window.close();
console.log('Comparison passed: selection, limit, replacement, removal, exact source data, missing data, differences, filters, links, persistence, invalid/blocked storage and keyboard focus.');
