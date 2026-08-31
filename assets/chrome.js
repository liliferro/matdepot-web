/* =========================================================================
   MAT DEPOT — Chrome compartido (header + footer + WA fab)
   Inserta automáticamente en cualquier página que cargue este script
   ========================================================================= */

(function () {
  const path = location.pathname.split("/").pop() || "index.html";
  const isActive = (target) => path === target || (target === "index.html" && (path === "" || path === "/"));

  const wa = window.MD_CONTACT?.waUrl || "https://wa.me/5215544943014";

  // ---------- HEADER ----------
  const header = `
  <header class="site-header">
    <div class="bar-promo">
      <span><span class="dot"></span> Envíos a toda la República</span>
      <span class="hide-sm"><span class="dot"></span> Mayoreo y menudeo</span>
      <span class="hide-sm"><span class="dot"></span> Asesoría técnica gratuita</span>
    </div>
    <nav class="nav" id="md-nav">
      <a class="brand" href="index.html" aria-label="Mat Depot · inicio">
        <span class="brand-mark">M</span>
        <span>
          <span class="brand-wm">MAT&nbsp;DEPOT</span>
          <span class="brand-sub">Tapetes técnicos · MX</span>
        </span>
      </a>
      <ul class="nav-links">
        <li><a href="index.html"            ${isActive("index.html")          ? 'aria-current="page"' : ""}>Inicio</a></li>
        <li><a href="productos.html"        ${isActive("productos.html")      ? 'aria-current="page"' : ""}>Productos</a></li>
        <li><a href="quienes-somos.html"    ${isActive("quienes-somos.html")  ? 'aria-current="page"' : ""}>Nosotros</a></li>
        <li><a href="ubicacion.html"        ${isActive("ubicacion.html")      ? 'aria-current="page"' : ""}>Ubicación</a></li>
        <li><a href="contacto.html"         ${isActive("contacto.html")       ? 'aria-current="page"' : ""}>Contacto</a></li>
      </ul>
      <div class="nav-cta">
        <a class="btn btn--ghost-light btn--sm" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>
        <a class="btn btn--invert btn--sm" href="contacto.html">Cotizar <span class="arrow"></span></a>
      </div>
      <button class="burger" aria-label="Menú" id="md-burger"><span></span></button>
    </nav>
  </header>`;

  // ---------- FOOTER ----------
  const c = window.MD_CONTACT;
  const footer = `
  <footer class="site-footer">
    <div class="foot-top">
      <div>
        <div class="brand" style="margin-bottom:20px">
          <span class="brand-mark">M</span>
          <span>
            <span class="brand-wm">MAT&nbsp;DEPOT</span>
            <span class="brand-sub">Tapetes técnicos · MX</span>
          </span>
        </div>
        <p class="foot-cta">Material que resiste.</p>
        <div class="foot-contact">
          ${c.address}<br>
          <a href="tel:5596265258">${c.tel1}</a> · <a href="tel:5596265259">${c.tel2}</a><br>
          <a href="mailto:${c.email}">${c.email}</a>
        </div>
      </div>
      <div>
        <h4>Productos</h4>
        <ul>
          <li><a href="producto.html?id=antifatiga">Antifatiga</a></li>
          <li><a href="producto.html?id=gimnasio">Gimnasio</a></li>
          <li><a href="producto.html?id=dielectrico">Dieléctrico</a></li>
          <li><a href="producto.html?id=cocina">Cocina</a></li>
          <li><a href="producto.html?id=publicitario">Publicitario</a></li>
          <li><a href="productos.html">Ver todos →</a></li>
        </ul>
      </div>
      <div>
        <h4>Sectores</h4>
        <ul>
          <li><a href="productos.html#industria">Industria</a></li>
          <li><a href="productos.html#cocinas">Cocinas</a></li>
          <li><a href="productos.html#gimnasios">Gimnasios</a></li>
          <li><a href="productos.html#comercio">Comercio</a></li>
          <li><a href="productos.html#electrico">Eléctrico</a></li>
        </ul>
      </div>
      <div>
        <h4>Compañía</h4>
        <ul>
          <li><a href="quienes-somos.html">Nosotros</a></li>
          <li><a href="contacto.html">Contacto</a></li>
          <li><a href="ubicacion.html">Ubicación</a></li>
          <li><a href="aviso-privacidad.html">Aviso de privacidad</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bot">
      <span>© Mat Depot S.A. de C.V. · ${new Date().getFullYear()}</span>
      <div class="foot-socials">
        <a href="https://www.instagram.com/matdepotmex" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
        <a href="https://www.facebook.com/share/1CJdVqXQmH/" target="_blank" rel="noopener" aria-label="Facebook">FB</a>
        <a href="https://www.linkedin.com/in/mat-depot-70b19937a/" target="_blank" rel="noopener" aria-label="LinkedIn">IN</a>
        <a href="https://youtube.com/@matdepot25" target="_blank" rel="noopener" aria-label="YouTube">YT</a>
        <a href="https://www.tiktok.com/@matdepot" target="_blank" rel="noopener" aria-label="TikTok">TT</a>
      </div>
      <span>matdepot.mx</span>
    </div>
  </footer>`;

  // ---------- WA FAB ----------
  const fab = `
  <a class="wa-fab" href="${wa}" target="_blank" rel="noopener" aria-label="WhatsApp">
    <svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.8-1.6-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.6.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.7.5 3.4 1.3 4.8L2 22l5.3-1.4c1.4.7 2.9 1.1 4.7 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
  </a>`;

  // ---------- INJECT ----------
  const headerSlot = document.getElementById("md-header");
  const footerSlot = document.getElementById("md-footer");
  if (headerSlot) headerSlot.outerHTML = header;
  if (footerSlot) footerSlot.outerHTML = footer;
  document.body.insertAdjacentHTML("beforeend", fab);

  // burger toggle
  const nav = document.getElementById("md-nav");
  const burger = document.getElementById("md-burger");
  if (burger && nav) {
    burger.addEventListener("click", () => nav.classList.toggle("open"));
  }
})();
