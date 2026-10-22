const configs = require('../data/blog-tools.json');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const catalog = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/catalogo.js'),'utf8'),catalog);
const sizes = require('../data/image-sizes.json');
const recommendedProducts = require('../assets/blog-recommendations.js').slugs.map(slug=>{
  const p=catalog.window.MD_CATALOG.find(p=>p.slug===slug);
  if(!p)throw Error('Missing recommendation product '+slug);
  return {slug:p.slug,name:p.name,specs:p.specs,image:p.images[0],size:sizes[p.images[0]]};
});
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports = id => {
  if (!configs[id]) throw Error('Unknown blog tool: ' + id);
  const c = {...configs[id],...(configs[id].type==='planner'?{products:recommendedProducts}:{})};
  let fields;
  if (c.type === 'planner') fields = c.fields.map((f,i) => `<label>${esc(f.label)}<select name="field-${i}" required><option value="">Selecciona una opción</option>${f.options.map((o,j)=>`<option value="${j}">${esc(o.label)}</option>`).join('')}</select></label>`).join('');
  if (c.type === 'checklist') fields = c.items.map(([label],i)=>`<label class="tool-check"><input type="checkbox" name="check-${i}"><span>${esc(label)}</span></label>`).join('');
  if (c.type === 'brief') fields = c.fields.map((f,i)=>`<label>${esc(f.label)}${f.required?' *':''}<input name="field-${i}" maxlength="400" placeholder="${esc(f.placeholder)}" ${f.required?'required':''}></label>`).join('');
  if (c.type === 'costs') fields = `<label>Superficie del proyecto (m²)<input name="area" inputmode="decimal" placeholder="Ej. 60" required></label><p>Usa importes totales en MXN, sin separadores de miles. No se añaden impuestos automáticamente. Escribe 0 para conceptos incluidos o sin cargo; confirma los importes desconocidos.</p><div class="tool-costs">${['A','B'].map((letter,k)=>`<fieldset><legend>Propuesta ${letter}</legend>${['Material','Preparación de la base','Instalación y remates','Transporte','Impuestos no incluidos arriba'].map((label,i)=>`<label>${label} (MXN)<input name="cost-${k}-${i}" inputmode="decimal" placeholder="0.00" required></label>`).join('')}</fieldset>`).join('')}</div>`;
  return `<section class="blog-tool" aria-labelledby="tool-title" data-tool="${esc(id)}"><h3 id="tool-title">${esc(c.title)}</h3><p>${c.type==='planner'?'Selecciona tus necesidades para encontrar opciones del catálogo, comparar sus fichas y solicitar cotización.':'La información se procesa en tu navegador. Generar el resumen no envía una solicitud.'}</p><noscript><p>Activa JavaScript para usar la herramienta o <a href="/productos.html">consulta el catálogo</a>.</p></noscript><form data-tool-form hidden novalidate>${fields}<p role="alert" data-tool-error hidden></p><button class="btn" type="submit">${c.type==='planner'?'Ver productos recomendados':c.type==='costs'?'Calcular comparación':c.type==='checklist'?'Ver pendientes':'Preparar resumen'}</button></form><p data-tool-status role="status"></p><div data-tool-result hidden><h4 tabindex="-1">${c.type==='planner'?'Productos para tu proyecto':'Tu resumen'}</h4>${c.type==='planner'?'<p data-recommendation-notice></p><div class="tool-recommendations" data-recommendations></div><a class="btn" data-recommendation-compare hidden>Comparar estas opciones</a><details class="tool-secondary"><summary>Ver y copiar el detalle de mi selección</summary>':''}<pre data-tool-output></pre><label>Texto para copiar<textarea rows="8" readonly data-tool-summary></textarea></label><button type="button" class="btn" data-copy-summary>Copiar resumen</button>${c.type==='planner'?'</details>':''}<p>${c.type==='planner'?'¿Necesitas confirmar alguna condición del proyecto?':'Pega el resumen en el mensaje de tu solicitud.'}</p><a href="/contacto.html" class="btn">Solicitar orientación</a></div><script type="application/json" data-tool-config>${JSON.stringify(c).replace(/</g,'\\u003c')}</script></section>`;
};
