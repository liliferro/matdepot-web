(() => {
  'use strict';
  document.querySelectorAll('[data-tool]').forEach(root => {
    const c = JSON.parse(root.querySelector('[data-tool-config]').textContent);
    const form = root.querySelector('form'), result = root.querySelector('[data-tool-result]');
    const error = root.querySelector('[data-tool-error]'), status = root.querySelector('[data-tool-status]');
    const summary = root.querySelector('[data-tool-summary]');
    const field = name => form.elements.namedItem(name);
    const num = value => /^\d+(?:[.,]\d{1,2})?$/.test(value.trim()) ? Number(value.trim().replace(',','.')) : NaN;
    const money = value => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(value);
    function clear() {
      if (!result.hidden) status.textContent = 'Cambiaste información. Genera un nuevo resumen para actualizarla.';
      result.hidden = true; summary.value = ''; error.hidden = true;
      form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
    }
    function invalid(el, message) {
      error.textContent = message; error.hidden = false; el.setAttribute('aria-invalid','true'); el.focus();
    }
    form.addEventListener('input',clear); form.addEventListener('change',clear);
    form.addEventListener('submit',event=>{
      event.preventDefault(); clear(); status.textContent = '';
      const lines = [c.title, ''];
      if (c.type === 'planner') {
        for (let i=0;i<c.fields.length;i++) {
          const el=field('field-'+i), option=c.fields[i].options[el.value];
          if(el.value==='' || !option){invalid(el,'Selecciona una opción en cada campo.');return;}
          lines.push(c.fields[i].label+': '+option.label, '→ '+option.note, '');
        }
        lines.push('Criterios para consulta; no es una recomendación técnica definitiva ni una certificación.');
      }
      if (c.type === 'checklist') {
        const done=[],pending=[];
        c.items.forEach(([label,note],i)=>{if(field('check-'+i).checked)done.push('• '+label);else pending.push('• '+note);});
        lines.push('Confirmado por ti:',...(done.length?done:['Aún no marcaste puntos confirmados.']),'','Pendientes:',...(pending.length?pending:['No quedan puntos sin marcar en esta lista. Esto no certifica aptitud ni sustituye la revisión del modelo y del proyecto.']));
      }
      if (c.type === 'brief') {
        for(let i=0;i<c.fields.length;i++) {
          const el=field('field-'+i), value=el.value.trim();
          if(c.fields[i].required && !value){invalid(el,'Completa los campos marcados con asterisco.');return;}
          lines.push(c.fields[i].label+': '+(value||'Por confirmar'));
        }
        lines.push('','Solicito orientación y cotización. Cantidades, especificaciones y entrega pendientes de confirmar.');
      }
      if (c.type === 'costs') {
        const area=num(field('area').value);
        if(!Number.isFinite(area)||area<=0||area>1000000){invalid(field('area'),'Ingresa una superficie mayor que 0 y hasta 1,000,000 m², con hasta dos decimales y sin separadores de miles.');return;}
        const totals=[];
        for(let k=0;k<2;k++) {
          let cents=0;
          for(let i=0;i<5;i++) {
            const el=field(`cost-${k}-${i}`),value=num(el.value);
            if(!Number.isFinite(value)||value<0||value>100000000){invalid(el,'Completa cada importe entre 0 y 100,000,000 MXN, con hasta dos decimales y sin separadores de miles.');return;}
            cents+=Math.round(value*100);
          }
          totals.push(cents/100);
        }
        lines.push(`Superficie del proyecto: ${area} m².`);
        totals.forEach((total,i)=>lines.push(`Propuesta ${i?'B':'A'}: ${money(total)}; ${money(total/area)} por m² del proyecto.`));
        lines.push(`Diferencia absoluta: ${money(Math.abs(totals[0]-totals[1]))}.`, '','Totales calculados con tus importes. No son precios de MatDepot. Comparar costos no demuestra equivalencia técnica; confirma alcance, cantidades e impuestos y evita duplicar conceptos.');
      }
      const text=lines.join('\n');
      root.querySelector('[data-tool-output]').textContent=text; summary.value=text;
      result.hidden=false; result.querySelector('h4').focus();
    });
    root.querySelector('[data-copy-summary]').addEventListener('click',async()=>{
      const current=summary.value;
      try {
        await navigator.clipboard.writeText(current);
        if(summary.value===current)status.textContent='Resumen copiado. Puedes pegarlo en tu solicitud.';
      } catch {
        summary.focus(); summary.select(); status.textContent='Seleccionamos el resumen. Usa la opción Copiar de tu dispositivo.';
      }
    });
    form.hidden=false;
  });
})();
