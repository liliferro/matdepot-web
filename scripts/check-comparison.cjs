const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('public/productos.html', 'utf8');
function setup(stored, query = '') {
  const dom = new JSDOM(html, { url: 'https://www.matdepotmex.com/productos.html' + query, runScripts: 'outside-only' });
  const w = dom.window;
  if (stored !== undefined) w.sessionStorage.setItem('md-comparison-v1', stored);
  for (const file of ['catalogo', 'catalog-ui', 'comparison']) w.eval(fs.readFileSync('assets/' + file + '.js', 'utf8'));
  return dom;
}
const dom = setup('{broken');
const w = dom.window, d = w.document, el = id => d.getElementById(id);
const catalog = w.MD_CATALOG;
function choose(id, slug) { el(id).value = slug; el(id).dispatchEvent(new w.Event('change', { bubbles: true })); }
function clickCard(slug) { d.querySelector('[data-slug="' + slug + '"] .compare-toggle').click(); }
assert.equal(d.querySelectorAll('.compare-toggle').length, 35);
assert.equal(el('comparison').hidden, false);
assert.equal(el('comparison-table').parentElement.hidden, true);
const first = catalog[0], second = catalog[1], third = catalog[2], fourth = catalog[3];
clickCard(first.slug); choose('compare-slot-1', second.slug); clickCard(third.slug);
assert.equal(d.querySelectorAll('#comparison-table thead th').length, 4);
clickCard(fourth.slug);
assert.match(el('compare-status').textContent, /hasta 3/);
assert.equal(d.querySelectorAll('#comparison-table thead th').length, 4);
assert(![...el('compare-slot-0').options].some(o => o.value === second.slug));
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
choose('catalog-filter', 'gimnasios');
assert.equal(d.querySelectorAll('#comparison-table thead th').length, 4);
assert(d.querySelector('[data-slug="' + first.slug + '"]').hidden);
choose('compare-slot-0', fourth.slug);
assert.equal(d.activeElement.id, 'compare-slot-0');
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
assert.equal(d.activeElement.id, 'compare-slot-0');
assert.equal(el('compare-differences').checked, false);
dom.window.close();
const sanitized = setup(JSON.stringify([first.slug, first.slug, 'invalid', second.slug, third.slug, fourth.slug]));
assert.equal(sanitized.window.document.querySelectorAll('#comparison-table thead th').length, 4);
sanitized.window.close();
const preset = setup(undefined, '?comparar=tapete-dielectrico');
assert.equal(preset.window.document.getElementById('compare-electrical-note').hidden, false);
preset.window.close();
// Missing data alone must never become a claimed difference; blocked storage must not break selection.
const missing = new JSDOM(html, { url: 'https://www.matdepotmex.com/productos.html', runScripts: 'outside-only' });
missing.window.eval(fs.readFileSync('assets/catalogo.js', 'utf8'));
missing.window.MD_CATALOG[0].specs = { Color: 'Negro' };
missing.window.MD_CATALOG[1].specs = { Color: 'Negro', Espesor: '5 mm' };
Object.defineProperty(missing.window, 'sessionStorage', { get() { throw Error('blocked'); } });
missing.window.eval(fs.readFileSync('assets/comparison.js', 'utf8'));
const buttons = missing.window.document.querySelectorAll('.compare-toggle'); buttons[0].click(); buttons[1].click();
assert.equal(missing.window.document.querySelectorAll('.comparison-different').length, 0);
missing.window.document.getElementById('compare-differences').click();
assert.equal(missing.window.document.getElementById('compare-empty-differences').hidden, false);
missing.window.close();
console.log('Comparison passed: selection, limit, replacement, removal, exact source data, missing data, differences, filters, links, persistence, invalid/blocked storage and keyboard focus.');
