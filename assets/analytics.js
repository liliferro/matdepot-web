/* No personal form values or free-text searches are sent to analytics. */
(function () {
  const id = 'G-LC7M7BHNSN';
  const phone = '5215544943014';
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
  const pageLocation = () => {
    const safe = new URL(location.origin+location.pathname);
    const params = new URLSearchParams(location.search);
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','prod','filtro']) {
      const value = params.get(key);
      if (value && value.length<120 && !/[@\n]/.test(value)) safe.searchParams.set(key,value);
    }
    return safe.href;
  };
  const formsubmitReturn = () => { try { return new URL(document.referrer).hostname.replace(/^www\./,'') === 'formsubmit.co'; } catch { return false; } };
  window.mdTrack = (name, data={}) => { if(!enabled)return false; gtag('event',name,{...context(),...data}); return true; };
  const buttonPlace = a => {
    if (a.classList.contains('wa-fab')) return 'flotante';
    if (a.closest('header')) return 'encabezado';
    if (a.closest('footer')) return 'pie';
    if (a.closest('#comparison')) return 'comparador';
    if (a.closest('.faq, .faq-actions, .faq-section')) return 'faq';
    return { 'wa-cta':'portada','prod-wa':'ficha','cta-wa':'banner','wa-link':'formulario','wa-item':'datos-contacto','wa-loc':'mapa','urgent-wa':'gracias' }[a.id] || 'contenido';
  };
  const waRef = url => ((url.searchParams.get('text')||'').match(/\(ref:\s*([A-Z0-9-]{2,40})\)\s*$/)||[])[1] || '';
  const salesWhatsApp = url => {
    if (url.protocol !== 'https:') return false;
    if (url.hostname === 'wa.me') return url.pathname === '/'+phone;
    if (url.hostname === 'api.whatsapp.com' || url.hostname === 'web.whatsapp.com') return (url.searchParams.get('phone')||'').replace(/\D/g,'') === phone;
    return false;
  };
  function enable() {
    if(enabled)return; enabled=true;
    window['ga-disable-'+id] = false;
    gtag('consent','update',{analytics_storage:'granted'});
    if(initialized)return;
    initialized=true;
    gtag('js',new Date());
    const returning = formsubmitReturn();
    const config = {page_location:pageLocation(),allow_google_signals:false,allow_ad_personalization_signals:false};
    if (returning) config.ignore_referrer = true;
    else { try { const referrer = new URL(document.referrer); config.page_referrer = referrer.origin+referrer.pathname; } catch {} }
    gtag('config',id,config);
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
    const p=item();if(p)mdTrack('view_item',{items:[gaItem(p)]});
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
  const trafficLevels = new Set(['Bajo','Medio','Alto','Uso pesado']);
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
      form.addEventListener('focusin',()=>{if(!started)started=mdTrack('form_start',{form_id:'cotizacion',page_location:pageLocation()});});
      window.addEventListener('pageshow',()=>{delete form.dataset.mdLeadQueued;});
      form.addEventListener('submit',event=>{
        if(form.dataset.mdLeadQueued==='1'){event.preventDefault();return;}
        const leadId='md-'+(window.crypto?.randomUUID?crypto.randomUUID():Date.now());
        const selected=document.getElementById('f-cat')?.selectedOptions[0];
        const productSlug=selected?.dataset.slug||'';
        const trafficValue=document.getElementById('f-traffic')?.value||'';
        const traffic=trafficLevels.has(trafficValue)?trafficValue:'';
        const leadField=document.getElementById('lead-id');
        if(leadField)leadField.value=leadId;
        const next=form.querySelector('[name="_next"]');
        if(next)next.value=location.origin+'/gracias.html';
        save('md-pending-lead',{id:leadId,product:productSlug,traffic,time:Date.now()},true);
        if(!enabled||read('md-counted-'+leadId,true))return;
        form.dataset.mdLeadQueued='1';
        event.preventDefault();
        let done=false;
        const go=()=>{
          if(done)return; done=true;
          const view=form.ownerDocument&&form.ownerDocument.defaultView;
          if(!view||view.closed||!form.isConnected)return;
          try{HTMLFormElement.prototype.submit.call(form);}catch{}
        };
        let tracked=false;
        try{
          const payload={form_id:'cotizacion',lead_channel:'form',page_location:pageLocation(),lead_id:leadId,transport_type:'beacon',event_callback:go,event_timeout:1000};
          if(traffic)payload.nivel_trafico=traffic;
          tracked=mdTrack('generate_lead',payload);
          save('md-counted-'+leadId,true,true);
        }catch{}
        if(!tracked)go(); else setTimeout(go,1000);
      });
    }
    document.addEventListener('click',e=>{
      const a=e.target.closest('a[href]');if(!a)return;
      const href=a.getAttribute('href');
      let url; try{url=new URL(href,location.href);}catch{return;}
      const targetProduct=url.origin===location.origin ? window.MD_CATALOG?.find(p=>url.pathname==='/tapetes/'+p.slug+'.html') : null;
      const quoteProduct=url.origin===location.origin ? product(url.searchParams.get('prod')) : null;
      const p=targetProduct || quoteProduct || item() || selectedItem();
      const data={...context(p),ubicacion:buttonPlace(a)};
      if(a.dataset.shareArticle && url.protocol==='https:' && url.hostname==='wa.me' && url.pathname==='/') {
        mdTrack('share',{...data,method:'whatsapp',content_type:'article',item_id:a.dataset.shareArticle,ubicacion:a.dataset.sharePlacement});
      }
      else if(salesWhatsApp(url))mdTrack('contact_whatsapp',{...data,method:'whatsapp',lead_channel:'whatsapp',page_location:pageLocation(),wa_ref:waRef(url)});
      else if(href.startsWith('tel:'))mdTrack('contact_phone',{...data,linea:href.includes('5258')?'linea1':'linea2'});
      else if(href.startsWith('mailto:'))mdTrack('contact_email',data);
      else if(targetProduct)mdTrack('select_item',{...data,item_list_id:location.pathname,items:[gaItem(targetProduct)]});
    });
    document.addEventListener('md:compare',e=>{
      const actions=['add','remove','replace','clear','differences'];
      if(!actions.includes(e.detail?.action))return;
      const products=(e.detail.slugs||[]).map(product).filter(Boolean).slice(0,3);
      mdTrack('compare_products',{accion:e.detail.action,cantidad_productos:products.length,items:products.map(gaItem)});
    });
  });
})();
