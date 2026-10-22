(function () {
  'use strict';
  const catalog = window.MD_CATALOG;
  const panel = document.getElementById('comparison');
  if (!panel || !catalog) return;
  const byId = id => document.getElementById(id);
  const cards = [...document.querySelectorAll('#prod-grid > [data-slug]')];
  const key = 'md-comparison-v1';
  const valid = values => Array.isArray(values) ? [...new Set(values.filter(s => catalog.some(p => p.slug === s)))].slice(0, 3) : [];
  let selected = [];
  try { selected = valid(JSON.parse(sessionStorage.getItem(key))); } catch (_) { /* Storage is optional. */ }
  const params = new URLSearchParams(location.search);
  if (params.has('comparar')) {
    selected = valid(params.get('comparar').split(','));
    const url = new URL(location.href);
    url.searchParams.delete('comparar');
    history.replaceState(null, '', url);
  }
  const make = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const link = (text, href) => { const a = make('a', text); a.href = href; return a; };
  const value = (p, field) => String(p.specs[field] ?? '').trim();
  const announce = text => { byId('compare-status').textContent = text; };
  const sorted = [...catalog].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  function picker(current, index) {
    const wrap = make('div', undefined, 'field');
    const label = make('label', current ? 'Cambiar producto' : 'Añadir producto');
    const select = make('select');
    select.id = 'compare-slot-' + index;
    label.htmlFor = select.id;
    select.add(new Option(current ? 'Selecciona otra opción' : 'Selecciona del catálogo', ''));
    sorted.filter(p => !selected.includes(p.slug) || p.slug === current).forEach(p => select.add(new Option(p.name, p.slug)));
    select.value = current || '';
    select.addEventListener('change', () => {
      if (!select.value) return;
      if (current) selected[index] = select.value; else selected.push(select.value);
      render();
      byId('compare-slot-' + index)?.focus();
    });
    wrap.append(label, select);
    return wrap;
  }
  function render() {
    try { sessionStorage.setItem(key, JSON.stringify(selected)); } catch (_) { /* Keep working without storage. */ }
    panel.hidden = false;
    announce(selected.length + ' de 3 productos seleccionados.');
    cards.forEach(card => {
      const button = card.querySelector('.compare-toggle');
      const active = selected.includes(card.dataset.slug);
      button.setAttribute('aria-pressed', String(active));
      button.textContent = active ? 'Quitar de comparación' : 'Añadir a comparación';
      card.querySelector('.compare-view').hidden = !active;
    });
    const products = selected.map(s => catalog.find(p => p.slug === s));
    const slots = byId('compare-slots');
    slots.replaceChildren();
    if (products.length < 3) slots.append(picker('', products.length));
    byId('clear-compare').disabled = products.length === 0;
    byId('compare-differences').disabled = products.length < 2;
    const table = byId('comparison-table');
    table.replaceChildren();
    table.parentElement.hidden = products.length === 0;
    const caption = make('caption', 'Características publicadas · ' + products.length + ' productos');
    table.append(caption);
    const head = make('thead'), row = make('tr'), corner = make('th', 'Característica');
    corner.scope = 'col'; row.append(corner);
    products.forEach((p, index) => {
      const th = make('th'); th.scope = 'col';
      const img = make('img'); img.src = '/' + p.images[0]; img.alt = ''; img.width = 160; img.height = 100;
      img.className = 'comparison-photo';
      th.append(img, link(p.name, '/tapetes/' + p.slug + '.html'), picker(p.slug, index));
      const actions = make('div', undefined, 'comparison-actions');
      const remove = make('button', 'Quitar', 'compare-remove'); remove.type = 'button';
      remove.setAttribute('aria-label', 'Quitar ' + p.name);
      remove.onclick = () => {
        selected = selected.filter(s => s !== p.slug); render();
        (byId('compare-slot-' + Math.min(index, selected.length)) || byId('comparison-title')).focus();
      };
      actions.append(link('Ver ficha', '/tapetes/' + p.slug + '.html'), link('Cotizar', '/contacto.html?prod=' + encodeURIComponent(p.slug)), remove);
      th.append(actions); row.append(th);
    });
    head.append(row); table.append(head);
    const body = make('tbody');
    const fields = [...new Set(products.flatMap(p => Object.keys(p.specs)))];
    let differences = 0;
    fields.forEach(field => {
      const values = products.map(p => value(p, field));
      // Missing information is unknown, never evidence of a technical difference.
      const different = new Set(values.filter(Boolean)).size > 1;
      if (different) differences++;
      if (byId('compare-differences').checked && products.length > 1 && !different) return;
      const tr = make('tr');
      if (different) tr.className = 'comparison-different';
      const th = make('th', field); th.scope = 'row';
      if (different) th.append(make('span', 'Diferencia', 'difference-label'));
      tr.append(th);
      values.forEach(v => tr.append(make('td', v || 'No especificado', v ? '' : 'comparison-missing')));
      body.append(tr);
    });
    table.append(body);
    byId('compare-summary').textContent = products.length < 2
      ? 'Selecciona al menos dos productos para identificar diferencias.'
      : differences + ' características con valores publicados distintos. Los datos faltantes no se cuentan como diferencias.';
    byId('compare-empty-differences').hidden = !(products.length > 1 && byId('compare-differences').checked && !differences);
    byId('compare-electrical-note').hidden = !selected.includes('tapete-dielectrico');
  }
  cards.forEach(card => {
    const button = make('button', 'Añadir a comparación', 'compare-toggle'); button.type = 'button';
    button.setAttribute('aria-label', 'Comparar ' + catalog.find(p => p.slug === card.dataset.slug).name);
    button.onclick = () => {
      const slug = card.dataset.slug;
      if (selected.includes(slug)) selected = selected.filter(s => s !== slug);
      else if (selected.length < 3) selected.push(slug);
      else { announce('Puedes comparar hasta 3 productos. Quita o cambia uno en la tabla.'); return; }
      render();
    };
    const view = link('Ver comparación ↑', '#comparison');
    view.className = 'compare-view';
    view.onclick = () => byId('comparison-title').focus();
    card.append(button, view);
  });
  byId('clear-compare').onclick = () => {
    selected = []; byId('compare-differences').checked = false; render(); byId('compare-slot-0').focus();
  };
  byId('compare-differences').onchange = render;
  render();
})();
