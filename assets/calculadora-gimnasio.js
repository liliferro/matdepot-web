/* Nominal area estimate only. No assumptions about cuts, impact ratings or installation. */
(() => {
  'use strict';
  document.querySelectorAll('[data-gym-calculator]').forEach(root => {
    const find = selector => root.querySelector(selector);
    const form = find('[data-calculator-form]');
    const zones = find('[data-zones]');
    const results = find('[data-results]');
    const error = find('[data-error]');
    const status = find('[data-update-status]');
    const format = form.elements.format;
    const reserve = form.elements.reserve;
    const number = value => /^\d+(?:[.,]\d{1,3})?$/.test(value.trim()) ? Number(value.trim().replace(',', '.')) : NaN;
    const show = value => new Intl.NumberFormat('es-MX', { maximumFractionDigits: 6 }).format(value);
    // Remove insignificant floating-point noise before rounding whole pieces upward.
    const wholePieces = value => Math.ceil(Number(value.toFixed(9)));
    function invalidate() {
      if (!results.hidden) status.textContent = 'Cambiaste las medidas u opciones. Calcula de nuevo para actualizar el resultado.';
      results.hidden = true;
      find('[data-summary]').value = '';
      error.hidden = true;
      root.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
    }
    function renumber() {
      [...zones.children].forEach((zone, index) => {
        zone.querySelector('legend').textContent = `Zona ${index + 1}`;
        const remove = zone.querySelector('[data-remove-zone]');
        remove.hidden = zones.children.length === 1;
        remove.setAttribute('aria-label', `Quitar zona ${index + 1}`);
      });
      find('[data-add-zone]').hidden = zones.children.length >= 20;
    }
    function addZone(focus = true) {
      if (zones.children.length >= 20) return;
      zones.append(find('[data-zone-template]').content.cloneNode(true));
      renumber();
      invalidate();
      if (focus) zones.lastElementChild.querySelector('input').focus();
    }
    function fail(field, message) {
      error.textContent = message;
      error.hidden = false;
      field.setAttribute('aria-invalid', 'true');
      field.focus();
    }
    find('[data-add-zone]').addEventListener('click', () => addZone());
    zones.addEventListener('click', event => {
      const remove = event.target.closest('[data-remove-zone]');
      if (!remove || zones.children.length === 1) return;
      remove.closest('fieldset').remove();
      renumber();
      invalidate();
      find('[data-add-zone]').focus();
    });
    form.addEventListener('input', invalidate);
    form.addEventListener('change', invalidate);
    find('[data-clear]').addEventListener('click', () => {
      form.reset();
      zones.replaceChildren();
      addZone();
      status.textContent = 'Ingresa las medidas de tu nuevo proyecto.';
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      invalidate();
      status.textContent = '';
      const rows = [];
      for (const [index, zone] of [...zones.children].entries()) {
        const dimensions = {};
        for (const key of ['length', 'width']) {
          const input = zone.querySelector(`[name="${key}"]`);
          const value = number(input.value);
          if (!Number.isFinite(value) || value <= 0 || value > 1000) {
            fail(input, `Zona ${index + 1}: ingresa ${key === 'length' ? 'un largo' : 'un ancho'} mayor que 0 y hasta 1,000 metros, con máximo 3 decimales y sin separadores de miles.`);
            return;
          }
          dimensions[key] = value;
        }
        rows.push({ name: zone.querySelector('[name="zone-name"]').value.trim() || `Zona ${index + 1}`, ...dimensions, area: dimensions.length * dimensions.width });
      }
      const extra = number(reserve.value);
      if (!Number.isFinite(extra) || extra < 0 || extra > 30) {
        fail(reserve, 'Indica una reserva entre 0 y 30%. Usa 0 si todavía no has definido una reserva.');
        return;
      }
      const modular = format.value === 'modular';
      let area = 0, quantity = 0;
      const body = find('[data-zone-results]');
      body.replaceChildren();
      const lines = [];
      rows.forEach(row => {
        const estimate = modular ? wholePieces(row.area * (1 + extra / 100) / 0.25) : row.area * (1 + extra / 100);
        area += row.area;
        quantity += estimate;
        const tr = document.createElement('tr');
        [row.name, `${show(row.area)} m²`, `${show(estimate)} ${modular ? 'piezas' : 'm²'}`].forEach((value, index) => {
          const cell = document.createElement(index === 0 ? 'th' : 'td');
          if (index === 0) cell.scope = 'row';
          cell.textContent = value;
          tr.append(cell);
        });
        body.append(tr);
        lines.push(`${row.name}: ${show(row.length)} × ${show(row.width)} m = ${show(row.area)} m²; estimación: ${show(estimate)} ${modular ? 'piezas' : 'm²'}.`);
      });
      find('[data-total-area]').textContent = `${show(area)} m²`;
      find('[data-estimate-label]').textContent = modular ? 'Losetas estimadas, con tu reserva' : 'Superficie con tu reserva';
      find('[data-estimate]').textContent = `${show(quantity)} ${modular ? 'piezas' : 'm²'}`;
      find('[data-quantity-heading]').textContent = modular ? 'Losetas con reserva' : 'm² con reserva';
      const note = modular
        ? `Reserva elegida: ${show(extra)}%. Cálculo por zona: largo × ancho × (1 + reserva / 100) ÷ 0.25 m²; se redondea hacia arriba y se suman las piezas. No se considera aprovechamiento de recortes entre zonas.`
        : `Reserva elegida: ${show(extra)}%. Cálculo: superficie × (1 + reserva / 100). No equivale a un número de rollos ni a metros lineales: se necesitan el ancho, largo de presentación y trazado de cortes.`;
      find('[data-calculation-note]').textContent = note;
      find('[data-summary]').value = ['Proyecto de piso para gimnasio', ...lines, `Superficie medida: ${show(area)} m².`, `Total estimado: ${show(quantity)} ${modular ? 'losetas nominales de 50 × 50 cm' : 'm² para rollo'}, con reserva de ${show(extra)}%.`, 'Estimación de cobertura pendiente de confirmar cortes, medidas útiles e instalación.'].join('\n');
      results.hidden = false;
      find('#results-title').focus();
    });
    addZone(false);
    form.hidden = false;
  });
})();
