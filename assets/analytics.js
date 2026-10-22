/* No personal form values or free-text searches are sent to analytics. */
(function () {
  const id = 'G-LC7M7BHNSN';
  window['ga-disable-'+id] = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', {ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
  let enabled = false, initialized = false;
  const read = (key, session=false) => { try { return JSON.parse((session?sessionStorage:localStorage).getItem(key)); } catch { return null; } };
  const save = (key, value, session=false) => { try { (session?sessionStorage:localStorage).setItem(key,JSON.stringify(value)); } catch {} };
  const product = slug => window.MD_CATALOG?.find(p => p.slug === slug);
  const item = () => window.MD_CATALOG?.find(p => location.pathname === '/tapetes/'+p.slug+'.html');
  const selectedItem = () => product(document.getElementById('f-cat')?.selectedOptions[0]?.dataset.slug);
  const gaItem = p => ({item_id:p.slug,item_name:p.name,item_category:p.category});
  const context = (p=item() || selectedItem()) => ({pagina:location.pathname,producto:p?.slug||'',categoria:p?.category||''});
  window.mdTrack = (name, data={}) => { if(!enabled)return false; gtag('event',name,{...context(),...data}); return true; };
  function lead() {
    if(!location.pathname.endsWith('/gracias.html')) return;
    const pending=read('md-pending-lead',true);
    const received=new URLSearchParams(location.search).get('lead_id');
    if(!pending || pending.id!==received || Date.now()-pending.time>3600000 || read('md-counted-'+pending.id,true))return;
    if(!mdTrack('generate_lead',{...context(product(pending.product)),lead_id:pending.id,method:'formulario',producto_interes:pending.product,nivel_trafico:pending.traffic}))return;
    save('md-counted-'+pending.id,true,true);
  }
  function enable() {
    if(enabled)return; enabled=true;
    window['ga-disable-'+id] = false;
    gtag('consent','update',{analytics_storage:'granted'});
    if(initialized){lead();return;}
    initialized=true;
    gtag('js',new Date());
    const safe=new URL(location.origin+location.pathname);
    for(const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
      const v=new URLSearchParams(location.search).get(k);
      if(v && v.length<120 && !/[@\n]/.test(v))safe.searchParams.set(k,v);
    }
    let ref='';try { const u=new URL(document.referrer);ref=u.origin+u.pathname; } catch {}
    gtag('config',id,{page_location:safe.href,page_referrer:ref,allow_google_signals:false,allow_ad_personalization_signals:false});
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
    const p=item();if(p)mdTrack('view_item',{items:[gaItem(p)]});
    lead();
  }
  function choice(value) {
    save('md-analytics-consent',value);
    if(value==='granted')enable();
    else {
      window['ga-disable-'+id] = true;
      if(enabled)gtag('consent','update',{analytics_storage:'denied'});
      enabled=false;
    }
    document.getElementById('cookie-choice').hidden=true;
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const box=document.createElement('aside');box.id='cookie-choice';box.className='cookie-choice';box.setAttribute('aria-label','Preferencias de analítica');
    box.innerHTML='<p>¿Nos permites usar analítica para conocer las visitas y mejorar la web? Puedes rechazarla y seguir usando el sitio. <a href="/aviso-privacidad.html">Más información</a>.</p><div><button class="btn btn--sm" id="accept-analytics">Aceptar analítica</button><button class="btn btn--ghost btn--sm" id="reject-analytics">Rechazar</button></div>';
    document.body.append(box);box.hidden=!!read('md-analytics-consent');
    document.getElementById('accept-analytics').onclick=()=>choice('granted');document.getElementById('reject-analytics').onclick=()=>choice('denied');
    const settings=document.createElement('button');settings.textContent='Preferencias de privacidad';settings.className='privacy-settings';settings.onclick=()=>{box.hidden=false;document.getElementById('accept-analytics').focus();};document.querySelector('.foot-bot')?.append(settings);
    if(read('md-analytics-consent')==='granted')enable();
    const form=document.getElementById('contact-form');
    if(form){
      let started=false;
      form.addEventListener('focusin',()=>{if(!started)started=mdTrack('form_start',{form_id:'cotizacion'});});
      form.addEventListener('submit',()=>{
        const leadId='md-'+crypto.randomUUID();
        const selected=document.getElementById('f-cat').selectedOptions[0];
        const product=selected?.dataset.slug || 'asesoria';
        const traffic=document.getElementById('f-traffic').value;
        save('md-pending-lead',{id:leadId,product,traffic,time:Date.now()},true);
        document.getElementById('lead-id').value=leadId;
        form.querySelector('[name="_next"]').value=location.origin+'/gracias.html?lead_id='+encodeURIComponent(leadId);
      });
    }
    document.addEventListener('click',e=>{
      const a=e.target.closest('a[href]');if(!a)return;
      const href=a.getAttribute('href');
      const url=new URL(href,location.href);
      const targetProduct=url.origin===location.origin ? window.MD_CATALOG?.find(p=>url.pathname==='/tapetes/'+p.slug+'.html') : null;
      const quoteProduct=url.origin===location.origin ? product(url.searchParams.get('prod')) : null;
      const p=targetProduct || quoteProduct || item() || selectedItem();
      const data={...context(p),ubicacion:a.classList.contains('wa-fab')?'flotante':a.closest('footer')?'pie':a.closest('header')?'encabezado':a.closest('#comparison')?'comparador':'contenido'};
      if(a.dataset.shareArticle && url.protocol==='https:' && url.hostname==='wa.me' && url.pathname==='/') {
        mdTrack('share',{...data,method:'whatsapp',content_type:'article',item_id:a.dataset.shareArticle,ubicacion:a.dataset.sharePlacement});
      }
      else if(url.protocol==='https:' && ['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(url.hostname))mdTrack('contact_whatsapp',{...data,method:'whatsapp'});
      else if(href.startsWith('tel:'))mdTrack('contact_phone',{...data,linea:href.includes('5258')?'linea1':'linea2'});
      else if(href.startsWith('mailto:'))mdTrack('contact_email',data);
      else if(targetProduct)mdTrack('select_item',{...data,item_list_id:location.pathname,items:[gaItem(targetProduct)]});
      else if(url.origin===location.origin && url.pathname==='/contacto.html' && (quoteProduct || a.classList.contains('btn')))mdTrack('request_quote_click',data);
    });
    document.addEventListener('md:compare',e=>{
      const actions=['add','remove','replace','clear','differences'];
      if(!actions.includes(e.detail?.action))return;
      const products=(e.detail.slugs||[]).map(product).filter(Boolean).slice(0,3);
      mdTrack('compare_products',{accion:e.detail.action,cantidad_productos:products.length,items:products.map(gaItem)});
    });
  });
})();
