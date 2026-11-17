# Mat Depot · Aplicación del plan técnico

Marketech · 16 de noviembre de 2026

Base revisada: commit 7dd7900. Esta entrega conserva las URL canónicas .html, el catálogo fotográfico y el correo **matdepotmx@gmail.com**. No promete crecimiento de tráfico, ventas ni presencia en respuestas de IA.

## Cambios implementados

- 301 de /contacto, /blog, /ubicacion, /quienes-somos, /comparar, /preguntas-frecuentes y /aviso-privacidad. Conserva las redirecciones históricas que ya funcionaban.
- Portada móvil con titular y botones antes de la foto; escala de títulos, textos de al menos 12px, campos de 48px, botones normales/compactos y enlaces sociales de 44px.
- Menú móvil con Cotizar y WhatsApp. Se elimina el botón flotante en móvil para no tapar contenido; siguen disponibles el menú y los CTA de página.
- Catálogo y selector del comparador: dos columnas desde 361 hasta 640px, bloques de 12, botón Mostrar más, numeración por orden visible; catálogo con filtros plegables. Sin JavaScript todas las tarjetas permanecen accesibles.
- Galerías sin recorte de producto; última foto ocupa la fila cuando quedaría sola. No se duplican ni se descartan fotografías para rellenar celdas.
- Cotización: nombre, email **o** teléfono y consentimiento obligatorios; mensaje opcional. Sin JavaScript se conserva email obligatorio como alternativa. Destino FormSubmit inalterado.
- Atribución UTM, página de entrada y dominio referente en la sesión y formulario, únicamente después de aceptar analítica; origen en WhatsApp cuando hay campaña. Al revocar se borra la atribución. Nunca se añade gclid con consentimiento publicitario denegado. No se envían valores personales de formulario a GA4.
- Eventos view_item_list por intersección real, form_error sin valores, form_exit_before_submit al abandonar la página y file_download para futuros PDF. No se cuentan cambios de pestaña como abandono. Se conservan eventos y deduplicación anteriores.
- FAQPage basado en respuestas visibles; ItemList y BreadcrumbList en categorías y sectores; sitemap con fechas explícitas de contenido, no fecha cambiante de build. Blog conserva fecha propia de actualización.
- llms-full.txt generado con datos reales del catálogo, opcional y sin promesa de indexación o citación.
- Títulos de productos con sufijo reducido, sin truncar nombres para cumplir un límite arbitrario; alt descriptivo en imágenes de tarjetas del blog.
- Cabeceras CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy y Permissions-Policy. CSP permite los scripts/estilos inline existentes, GA consentido, mapa de Google y formulario FormSubmit; no usa unsafe-eval. No equivale a una política con nonces estrictos.
- Tres páginas nuevas: /sectores/industria.html, /sectores/cocinas.html y /sectores/comercio.html. Gimnasios y seguridad eléctrica enlazan las categorías existentes; no se duplican.
- La portada describe sectores de aplicación sin sugerir testimonios inexistentes. Disponibilidad continúa sujeta al modelo y cotización.
- Cuatro guías enlazan referencias primarias de CCOHS/HSE y muestran fecha real de actualización. Se conserva autoría editorial institucional y declaración sobre asistencia de IA; no se inventa un revisor técnico.
- Tablas de blog navegables horizontalmente con indicación visible y acceso por teclado.

## Estado de las 47 tareas

| N.º | Resultado de esta entrega |
|---|---|
| 1–3 | Alineación, subrayados y reglas compartidas de botones corregidos; variantes de tema conservadas. |
| 4–10 | Correcciones móviles y tipográficas aplicadas. No se cambia la identidad de fuentes/colores. |
| 11 | Rutas conocidas corregidas; inventario adicional de URL históricas requiere exportación de Search Console. |
| 12 | Se mantiene opt-in. Cambiar el modelo de consentimiento necesita una decisión específica. |
| 13 | Eventos de teléfono/email ya existentes. No se verificó ni modificó la administración de eventos clave/DebugView de GA4. |
| 14–16 | Rejillas, galerías y numeración corregidas. |
| 17–19 | Sitemap, archivo opcional de catálogo, schema, títulos/alt y cabeceras implementados. |
| 20 | Prefijos telefónicos y áreas táctiles listos. URL LinkedIn conservada hasta disponer de una página empresarial real. |
| 21 | Eliminada insinuación de prueba social; faltan testimonios/logotipos autorizados. |
| 22 | No aplicar: contradice instrucción del cliente de conservar Gmail. |
| 23 | Pendiente documentación técnica original; ningún certificado fue creado o inferido. |
| 24 | Texto claro sin nueva promesa comercial; SLA requiere confirmación. |
| 25–26 | Catálogo/comparador móvil y formulario implementados. |
| 27 | lead_id se conserva; conexión a CRM requiere identificar cuenta, pipeline y destino autorizados. |
| 28 | UTM y referencia de origen implementados con consentimiento; gclid queda fuera mientras ad_storage esté denegado. |
| 29–31 | Meta, Ads/Enhanced Conversions y Clarity requieren cuentas/proyectos, IDs y consentimiento específico; no se instalan etiquetas ficticias. |
| 32 | Eventos implementados; filtros/búsqueda ya existían y siguen sin enviar texto libre. La salida del formulario es una señal de navegación, no abandono definitivo ni pérdida de venta. |
| 33 | Valor y estado comercial requieren datos de ventas/CRM; no se asigna valor monetario arbitrario. |
| 34 | Introducciones y cifras existentes conservadas; nuevos sectores reutilizan datos verificables y cuatro guías añaden fuentes. No se inventan ensayos ni normas de producto. |
| 35 | Precios y Offer requieren confirmación comercial. |
| 36 | Tablas móviles corregidas. |
| 37 | Chrome automatizado en cinco anchos y validación de foco realizados; iPhone/Android físicos no disponibles. |
| 38 | La imagen hero ya tenía fetchpriority=high y WebP. Orden móvil mejorado; no se afirma un LCP de campo sin medirlo. |
| 39–40 | GBP/directorios requieren acceso y estado de las fichas existentes; no crear duplicados. |
| 41 | Casos de proyectos requieren fotos, datos y permisos del cliente. |
| 42 | Fuentes primarias añadidas a cuatro guías; autoría institucional existente. Revisor técnico nominal pendiente de persona real. |
| 43 | Tres sectores nuevos y dos categorías existentes enlazadas. |
| 44 | Protocolo reproducible de 20 preguntas preparado; no se inventa línea base ni se programa una tarea recurrente no solicitada. |
| 45 | Entidad y contactos conservados; perfiles empresariales/Wikidata necesitan identidad y elegibilidad verificadas. |
| 46 | Sistema de controles, fuentes, tamaños y pruebas documentado. |
| 47 | Tablero comercial depende de CRM y datos de ventas; el código deja lead_id y origen disponibles en la consulta. |

## Validación y límites

- `npm run build` y suite `npm test`, incluyendo comprobaciones de schema visible, rutas, sitemap, email y Bing.
- Chrome local con política CSP activa, tamaños 360/390/768/1024/1440; portada, catálogo, contacto, ficha dieléctrica, comparador, blog y sector cocinas. Pruebas sin solicitudes reales a Google Analytics ni FormSubmit.
- Comprobación de email solo, teléfono solo, ambos vacíos e email inválido; pruebas de filtros, mostrar más, numeración, menú y revocación del consentimiento.
- No se enviaron correos de prueba ni se comprobó entrega en la bandeja del cliente. El evento generate_lead preexistente indica envío hacia FormSubmit; no acredita recepción, lead calificado ni venta.
- Las nuevas páginas son contenido comercial orientativo; no certificaciones ni casos reales de instalaciones.

## Fuentes consultadas

- https://www.ccohs.ca/oshanswers/ergonomics/mats.html
- https://www.hse.gov.uk/slips/cleancampaign.htm
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
