const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(fs.readFileSync(process.argv[2] || 'docs/blog/calculadora-gimnasio.html', 'utf8'), { runScripts: 'outside-only' });
const w = dom.window, d = w.document;
w.eval(fs.readFileSync('assets/calculadora-gimnasio.js', 'utf8'));
const $ = selector => d.querySelector(selector);
const zones = () => [...d.querySelector('[data-zones]').children];
function set(selector, value, base = d) {
  const field = base.querySelector(selector); field.value = value;
  field.dispatchEvent(new w.Event('input', { bubbles: true }));
}
function size(length, width, index = 0) {
  set('[name="length"]', length, zones()[index]);
  set('[name="width"]', width, zones()[index]);
}
function calculate() { $('[data-calculator-form]').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); }
const total = () => $('[data-estimate]').textContent;
assert.equal($('[data-calculator-form]').hidden, false);
assert.equal($('[data-results]').hidden, true);
calculate(); assert.equal($('[data-error]').hidden, false);
size('10', '6'); calculate();
assert.equal(total(), '240 piezas');
assert.equal($('[data-total-area]').textContent, '60 m²');
set('[name="reserve"]', '10');
assert.equal($('[data-results]').hidden, true); // stale results must not look current
calculate(); assert.equal(total(), '264 piezas');
set('[name="reserve"]', '0'); size('4,5', '2'); calculate();
assert.equal(total(), '36 piezas');
size('1.001', '1'); calculate(); assert.equal(total(), '5 piezas');
$('[data-add-zone]').click(); size('1.001', '1', 1); calculate();
assert.equal(total(), '10 piezas'); // round separately, not pooled across different zones
set('[name="zone-name"]', '<img src=x onerror=alert(1)>', zones()[0]); calculate();
assert.equal($('[data-zone-results]').querySelector('img'), null);
assert.match($('[data-summary]').value, /<img/);
set('[name="format"]', 'roll'); calculate(); assert.equal(total(), '2.002 m²');
assert.match($('[data-calculation-note]').textContent, /No equivale a un número de rollos/);
for (const value of ['0', '-1', 'Infinity', '1e2', '1,000.00', '1001', '1.0001']) {
  size(value, '1'); calculate(); assert.equal($('[data-results]').hidden, true, value);
  assert.equal($('[data-error]').hidden, false, value);
}
size('10', '6'); set('[name="reserve"]', '31'); calculate();
assert.equal($('[data-error]').hidden, false);
set('[name="reserve"]', ''); calculate(); assert.equal($('[data-error]').hidden, false);
$('[data-clear]').click();
assert.equal(zones().length, 1); assert.equal($('[name="reserve"]').value, '0');
assert.equal($('[data-results]').hidden, true);
assert.equal($('[data-summary]').value, '');
size('0.001', '0.001'); calculate();
assert.equal($('[data-total-area]').textContent, '0.000001 m²');
assert.equal(total(), '1 piezas');
for (let i = 0; i < 25; i++) $('[data-add-zone]').click();
assert.equal(zones().length, 20);
zones()[19].querySelector('[data-remove-zone]').click(); assert.equal(zones().length, 19);
dom.window.close();
console.log('Gym calculator passed: multiple zones, decimals, rounding, reserve, invalid input, stale results, reset and safe labels.');
