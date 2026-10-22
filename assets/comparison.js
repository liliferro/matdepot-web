(function () {
  'use strict';
  const catalog = window.MD_CATALOG;
  const panel = document.querySelector('section#comparison');
  if (!catalog) return;
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
  const announce = text => { byId('compare-status').hidden = false; byId('compare-status').textContent = text; };
  let replacing = null;
  function focusProducts() { byId('comparison-products-title').focus(); }
  function render() {
    try { sessionStorage.setItem(key, JSON.stringify(selected)); } catch (_) { /* Keep working without storage. */ }
    const href = '/comparar.html' + (selected.length ? '?comparar=' + encodeURIComponent(selected.join(',')) : '');
    document.querySelectorAll('.compare-open,.compare-view').forEach(a => {
      a.href = panel ? '#comparison' : href;
      if (a.classList.contains('compare-open')) a.textContent = 'Comparar productos' + (selected.length ? ' (' + selected.length + '/3)' : '');
    });
    if (panel) panel.hidden = selected.length === 0;
    announce(selected.length + ' de 3 productos seleccionados.');
    if (!panel && !selected.length) byId('compare-status').hidden = true;
    cards.forEach(card => {
      const button = card.querySelector('.compare-toggle');
      const active = selected.includes(card.dataset.slug);
      button.setAttribute('aria-pressed', String(active));
      button.textContent = active ? 'Quitar de comparación' : replacing !== null ? 'Elegir este producto' : 'Agregar a la comparación';
      button.setAttribute('aria-label', button.textContent + ': ' + catalog.find(p => p.slug === card.dataset.slug).name);
      card.querySelector('.compare-view').hidden = !active;
    });
    if (!panel) return;
    const products = selected.map(s => catalog.find(p => p.slug === s));
    byId('compare-jump').hidden = products.length === 0;
    byId('compare-jump').textContent = 'Ver comparación (' + products.length + '/3)';
    byId('cancel-replace').hidden = replacing === null;
    if (replacing !== null) announce('Elige una tarjeta para sustituir ' + catalog.find(p => p.slug === replacing).name + '.');
    byId('clear-compare').disabled = products.length === 0;
    byId('compare-differences').disabled = products.length < 2;
    const table = byId('comparison-table');
    table.replaceChildren();
    table.parentElement.hidden = products.length === 0;
    const caption = make('caption', 'Características publicadas · ' + products.length + ' productos');
    table.append(caption);
    const head = make('thead'), row = make('tr'), corner = make('th', 'Característica');
    corner.scope = 'col'; row.append(corner);
    products.forEach(p => {
      const th = make('th'); th.scope = 'col';
      const img = make('img'); img.src = '/' + p.images[0]; img.alt = ''; img.width = 160; img.height = 100;
      img.className = 'comparison-photo';
      th.append(img, link(p.name, '/tapetes/' + p.slug + '.html'));
      const actions = make('div', undefined, 'comparison-actions');
      const remove = make('button', 'Quitar', 'compare-remove'); remove.type = 'button';
      remove.setAttribute('aria-label', 'Quitar ' + p.name);
      remove.onclick = () => {
        selected = selected.filter(s => s !== p.slug); replacing = null; render();
        (selected.length ? byId('comparison-title') : byId('comparison-products-title')).focus();
      };
      const change = make('button', 'Cambiar producto', 'compare-change'); change.type = 'button';
      change.setAttribute('aria-label', 'Cambiar ' + p.name);
      change.onclick = () => { replacing = p.slug; render(); focusProducts(); };
      actions.append(change, link('Ver ficha', '/tapetes/' + p.slug + '.html'), link('Cotizar', '/contacto.html?prod=' + encodeURIComponent(p.slug)), remove);
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
    const button = make('button', 'Agregar a la comparación', 'compare-toggle'); button.type = 'button';
    button.setAttribute('aria-label', 'Comparar ' + catalog.find(p => p.slug === card.dataset.slug).name);
    button.onclick = () => {
      const slug = card.dataset.slug;
      if (replacing !== null && !selected.includes(slug)) { selected[selected.indexOf(replacing)] = slug; replacing = null; render(); byId('comparison-title').focus(); return; }
      if (selected.includes(slug)) { selected = selected.filter(s => s !== slug); if (replacing === slug) replacing = null; }
      else if (selected.length < 3) selected.push(slug);
      else { announce('Puedes comparar hasta 3 productos. Quita o cambia uno en la tabla.'); return; }
      render();
    };
    const view = link('Ver comparación →', '/comparar.html');
    view.className = 'compare-view';
    card.append(button, view);
  });
  if (panel) byId('clear-compare').onclick = () => {
    selected = []; replacing = null; byId('compare-differences').checked = false; render(); focusProducts();
  };
  if (panel) byId('compare-differences').onchange = render;
  if (panel) byId('cancel-replace').onclick = () => { replacing = null; render(); byId('comparison-title').focus(); };
  if (panel) byId('comparison-picker-toolbar').hidden = false;
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    replacing = null;
    try { selected = valid(JSON.parse(sessionStorage.getItem(key))); } catch (_) {}
    render();
  });
  render();
})();
