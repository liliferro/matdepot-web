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
    function showProducts(selection) {
      const grid=root.querySelector('[data-recommendations]');grid.replaceChildren();
      root.querySelector('[data-recommendation-notice]').textContent=selection.notice;
      result.querySelector('h4').textContent=selection.items.length?'Productos para tu proyecto':'Revisemos la compatibilidad de tu proyecto';
      selection.items.forEach(item=>{
        const p=c.products.find(p=>p.slug===item.slug);if(!p)throw Error('Missing recommendation product');
        const card=document.createElement('article');card.className='tool-product';
        const img=document.createElement('img');img.src='/'+p.image;img.alt=p.name;img.width=p.size[0];img.height=p.size[1];img.loading='lazy';card.append(img);
        const tag=document.createElement('p');tag.className='tool-product-label';tag.textContent=item.verify?'Opción para validar':'Recomendado por aplicación';card.append(tag);
        const title=document.createElement('h5');title.textContent=p.name;card.append(title);
        const reason=document.createElement('p');reason.textContent=item.reason;card.append(reason);
        const specs=document.createElement('dl');
        Object.entries(p.specs).filter(([key])=>['Espesor','Medidas','Ancho','Longitud','Presentación'].includes(key)).forEach(([key,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=value;specs.append(dt,dd);});card.append(specs);
        if(item.verify){const note=document.createElement('p');note.className='tool-product-note';note.textContent=item.verify;card.append(note);}
        const actions=document.createElement('div');actions.className='tool-product-actions';
        for(const [label,url] of [['Ver ficha','/tapetes/'+p.slug+'.html'],['Cotizar este producto','/contacto.html?prod='+encodeURIComponent(p.slug)]]){const link=document.createElement('a');link.textContent=label;link.href=url;link.className='btn';actions.append(link);}card.append(actions);grid.append(card);
      });
      const compare=root.querySelector('[data-recommendation-compare]');
      compare.hidden=selection.items.length<2;
      if(!compare.hidden)compare.href='/comparar.html?comparar='+selection.items.map(p=>p.slug).join(',');else compare.removeAttribute('href');
      root.querySelector('.tool-secondary').open=false;
    }
    function clear() {
      if (!result.hidden) status.textContent = c.type==='planner'?'Cambiaste tus necesidades. Consulta de nuevo los productos recomendados.':'Cambiaste información. Genera un nuevo resumen para actualizarla.';
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
        const selection=window.MD_BLOG_RECOMMENDATIONS.recommend(root.dataset.tool,c.fields.map((_,i)=>field('field-'+i).value));
        showProducts(selection);
        lines.push('Productos seleccionados:');
        selection.items.forEach(item=>{const p=c.products.find(p=>p.slug===item.slug);lines.push(p.name+': '+item.reason, 'https://www.matdepotmex.com/tapetes/'+p.slug+'.html',item.verify);});
        lines.push(selection.notice);
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
