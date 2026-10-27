# Medición de captación de MatDepot

Implementación: 21 de octubre de 2026. Propiedad GA4 `536869166`, flujo web `14844815798`, etiqueta `G-LC7M7BHNSN`; correspondencia verificada en la administración de GA4.

## Eventos y significado

| Evento | Activación | Uso |
|---|---|---|
| contact_whatsapp | Un clic en un enlace HTTPS al WhatsApp del negocio (`wa.me/5215544943014`, o el mismo número en api.whatsapp.com / web.whatsapp.com) | Evento clave de captación. Un evento por clic. No confirma que el mensaje se haya enviado. Compartir un artículo no lo dispara |
| generate_lead | Envío válido del formulario de cotización, una vez, antes de salir hacia FormSubmit | Evento clave de solicitud por formulario. No se repite en `/gracias.html`. No confirma recepción en buzón ni calificación |
| form_start | Primera interacción de foco del formulario con consentimiento | Inicio de formulario. No es un lead. La medición automática de formularios debe seguir desactivada en GA4 |
| contact_phone / contact_email | Clic en teléfono / correo | Intención de contacto, sin marcado adicional como evento clave |
| view_item | Ficha de producto tras consentimiento | Vista de producto; items contiene ID, nombre y categoría del catálogo |
| select_item | Clic en enlace a una ficha del catálogo | Producto elegido e item_list_id con la ruta de origen |
| compare_products | Añadir, quitar, sustituir, limpiar o filtrar diferencias | accion, cantidad_productos e items; no se emite por renderizado inicial ni por un cuarto producto rechazado |
| filter_catalog | Cambio de filtros/búsqueda del catálogo | Filtro, cantidad de resultados y presencia de búsqueda; no contiene texto libre |
| share | Clic en compartir un artículo por WhatsApp, sin destinatario | Intención de compartir. No es `contact_whatsapp` ni `generate_lead` |
| file_download | Medición mejorada de GA4 al pulsar enlaces a archivos compatibles | Configuración activa para cuando existan fichas descargables; no se duplicó con un evento manual |
| page_view / user_engagement / scroll | Medición estándar y mejorada de GA4 | Visitas, tiempo activo y desplazamiento; no se consideran leads |

No se emiten `form_submit` ni `request_quote_click`. El primero duplicaba el envío del formulario (medición automática o el retorno desde formsubmit.co). El segundo contaba el clic hacia Contacto, que no es una solicitud. `form_start` se conserva como paso anterior del formulario.

WhatsApp y formulario se mantienen separados. No se genera un segundo `generate_lead` al pulsar WhatsApp. Para el indicador conjunto, usar sesiones con al menos uno de esos dos eventos, no sumar ambos conteos como personas únicas.

## Parámetros de captación

`generate_lead`: `lead_channel=form`, `form_id=cotizacion`, `page_location`, `pagina`, `producto`, `categoria`, `nivel_trafico` (solo si eligió Bajo, Medio, Alto o Uso pesado) y `lead_id`. No incluye nombre, teléfono, correo ni mensaje.

`contact_whatsapp`: `lead_channel=whatsapp`, `page_location`, `pagina`, `ubicacion`, `wa_ref`, `producto`, `categoria` y `method=whatsapp`.

`ubicacion` del botón: `flotante`, `encabezado`, `pie`, `comparador`, `faq`, `portada`, `ficha`, `banner`, `formulario`, `datos-contacto`, `mapa`, `gracias` o `contenido`.

`page_location` y `pagina` ya viajan con la medición. `producto`, `categoria`, `pagina` y `ubicacion` siguen siendo las dimensiones personalizadas de ámbito Evento. `lead_channel` y `wa_ref` quedan como parámetros del evento; para usarlos en informes estándar hay que registrarlos en GA4 como dimensiones de evento. El sitio no les asigna valor económico.

## Formulario y retorno desde FormSubmit

El formulario sigue enviándose a FormSubmit y, al terminar, vuelve a `https://www.matdepotmex.com/gracias.html` sin parámetros de campaña ni `lead_id`. `generate_lead` se envía en la página de contacto, con `transport_type=beacon`, antes de esa salida. Así el lead queda en la sesión y el canal originales.

`/gracias.html` no vuelve a emitir `generate_lead`, aunque la visita traiga un `lead_id` antiguo. Si el referrer es formsubmit.co, la configuración de gtag usa `ignore_referrer` y no reenvía ese referrer: el retorno no se atribuye como sesión nueva de referencia formsubmit.co ni genera un segundo lead. Una inactividad mayor al tiempo de sesión de GA4 puede abrir otra sesión directa; esa visita ya no cuenta el formulario.

En GA4, la medición mejorada de interacciones con formularios debe permanecer desactivada. Si se reactiva, GA4 puede volver a registrar `form_submit` con destino formsubmit.co además de `generate_lead`.

## Mensaje de WhatsApp

El número sigue siendo `5215544943014`. El texto es `Hola, quiero cotizar tapetes o pisos. (ref: CODIGO)` o, cuando la página identifica un producto, `Hola, quiero cotizar: {nombre}. (ref: CODIGO)`. En Contacto con `?prod=`, el código sigue siendo `CONTACTO` y el nombre del producto va en la frase. Compartir un artículo abre `wa.me` sin número y sin este texto.

| Página | Código |
|---|---|
| / | INICIO |
| /productos.html | PRODUCTOS |
| /contacto.html | CONTACTO |
| /quienes-somos.html | NOSOTROS |
| /ubicacion.html | UBICACION |
| /gracias.html | GRACIAS |
| /aviso-privacidad.html | AVISO |
| /comparar.html | COMPARAR |
| /preguntas-frecuentes.html | FAQ |
| /404.html | NO-ENCONTRADA |
| /blog.html | BLOG |
| /producto.html | PRODUCTO |
| /tapetes/piso-para-areas-infantiles.html | PISO-INFANTIL |
| /tapetes/tapete-para-alberca-y-areas-humedas.html | TAP-ALBERCA |
| /tapetes/tapete-de-pvc-con-base-textil.html | TAP-PVC-TEXTIL |
| /tapetes/tapete-de-pvc-con-base-textil-y-circulos.html | TAP-PVC-CIRCULOS |
| /tapetes/tapete-antiderrapante-americano.html | TAP-AMERICANO |
| /tapetes/tapete-antiderrapante-de-espiga.html | TAP-ESPIGA |
| /tapetes/tapete-antiderrapante-decktop.html | TAP-DECKTOP |
| /tapetes/tapete-antiderrapante-liso.html | TAP-AD-LISO |
| /tapetes/tapete-antiderrapante-mil-rayas.html | TAP-MIL-RAYAS |
| /tapetes/tapete-antiderrapante-tachonado.html | TAP-TACHONADO |
| /tapetes/tapete-antiderrapante-tachonado-con-base-textil.html | TAP-TACHON-TEXTIL |
| /tapetes/tapete-de-hule-antiderrapante-estriado-con-base-textil.html | TAP-ESTRIADO |
| /tapetes/tapete-de-hule-liso-con-base-textil.html | TAP-HULE-LISO |
| /tapetes/tapete-antiestatico.html | TAP-ANTIESTATICO |
| /tapetes/tapete-antifatiga-negro-de-uso-general.html | TAP-ANTIFATIGA |
| /tapetes/tapete-esponjoso-con-franjas-amarillas.html | TAP-FRANJAS |
| /tapetes/tapete-de-seguridad-de-pvc-para-trafico-pesado.html | TAP-PVC-PESADO |
| /tapetes/tapete-dielectrico.html | TAP-DIELECTRICO |
| /tapetes/tapete-multiusos-de-uso-rudo.html | TAP-MULTIUSOS |
| /tapetes/tapete-para-artes-marciales-y-crossfit.html | TAP-CROSSFIT |
| /tapetes/tapete-para-cocina.html | TAP-COCINA |
| /tapetes/tapete-para-establo.html | TAP-ESTABLO |
| /tapetes/tapete-para-gimnasio-en-rollo-con-chispas-verdes.html | TAP-GIM-VERDE |
| /tapetes/tapete-de-hule-reciclado-epdm-con-chispas-azules.html | TAP-EPDM-AZUL |
| /tapetes/tapete-modular-con-chispas-plateadas.html | TAP-MOD-PLATA |
| /tapetes/tapete-modular-para-gimnasio-en-diferentes-colores.html | TAP-MOD-COLOR |
| /tapetes/tapete-para-gimnasio-con-chispas-rojas.html | TAP-GIM-ROJO |
| /tapetes/tapete-para-gimnasio-de-hule-reciclado.html | TAP-GIM-RECICLADO |
| /tapetes/tapete-para-gimnasio-en-rollo-con-chispas-azules.html | TAP-GIM-AZUL |
| /tapetes/tapete-para-gimnasio-modular-de-13-mm.html | TAP-GIM-13MM |
| /tapetes/tapete-para-gimnasio-modular-de-7-mm.html | TAP-GIM-7MM |
| /tapetes/tapete-publicitario.html | TAP-PUBLICITARIO |
| /tapetes/tapete-rizo.html | TAP-RIZO |
| /tapetes/tapete-gimnasio-negro-en-rollo-tipo-a.html | TAP-GIM-TIPO-A |
| /tapetes/tapete-gimnasio-negro-en-rollo-tipo-b.html | TAP-GIM-TIPO-B |
| /categorias/antiderrapantes.html | CAT-ANTIDERRAPANTE |
| /categorias/antifatiga.html | CAT-ANTIFATIGA |
| /categorias/gimnasios.html | CAT-GIMNASIO |
| /categorias/seguridad-electrica.html | CAT-ELECTRICO |
| /categorias/areas-humedas.html | CAT-HUMEDAS |
| /blog/mejor-piso-para-gimnasio.html | BLOG-MEJOR-PISO |
| /blog/piso-gimnasio-rollo-o-modular.html | BLOG-ROLLO-MODULAR |
| /blog/espesor-piso-gimnasio.html | BLOG-ESPESOR |
| /blog/instalar-piso-hule-concreto-loseta.html | BLOG-INSTALACION |
| /blog/limpiar-piso-gimnasio.html | BLOG-LIMPIEZA |
| /blog/tapete-trabajo-de-pie.html | BLOG-DE-PIE |
| /blog/antifatiga-o-antiderrapante.html | BLOG-ANTI-O-AD |
| /blog/tapetes-agua-aceite-grasa.html | BLOG-GRASA |
| /blog/tapete-cocina-industrial.html | BLOG-COCINA |
| /blog/comparar-cotizaciones-tapetes.html | BLOG-COTIZACIONES |
| /blog/datos-cotizar-tapetes.html | BLOG-DATOS |
| /blog/precio-piso-hule-m2.html | BLOG-PRECIO-M2 |
| /guias/tapete-dielectrico-precio-voltajes.html | GUIA-DIELECTRICO |

## Configuración aplicada en GA4

- contact_whatsapp marcado como evento clave, recuento una vez por sesión.
- generate_lead marcado como evento clave; sin valor económico ficticio.
- Cuatro dimensiones personalizadas con ámbito Evento: Producto de interés (`producto`), Categoría de producto (`categoria`), Página de interacción (`pagina`) y Ubicación del botón (`ubicacion`).
- Conservada medición mejorada de vistas de página, scroll, clics salientes, vídeo y descargas.
- Desactivada la medición automática de formularios para evitar duplicación con form_start propio.
- Desactivada búsqueda automática: el catálogo ya registra filter_catalog sin transmitir consultas libres.
- Desactivadas vistas por cambios del historial: filtrar el catálogo no representa una nueva página y no debe transmitir la búsqueda incluida en la URL. Se mantienen vistas al cargar cada página real.

La atribución de origen/medio y dispositivo utiliza dimensiones nativas de GA4. Los clics automáticos de salida (`click`) pueden coexistir con contact_whatsapp, pero no se marcaron como leads adicionales. Se conservaron los eventos clave anteriores de la propiedad.

## Lectura de resultados

1. Tráfico por canal: sesiones, usuarios y sesiones con contact_whatsapp o generate_lead, filtrando México y el host del negocio.
2. Productos: vistas view_item, selecciones select_item y contactos por Producto de interés / Categoría de producto. La solicitud en sí es `generate_lead` o `contact_whatsapp`, no un clic hacia Contacto.
3. Botones: contact_whatsapp por Ubicación del botón, código `wa_ref` y Página de interacción.
4. Formulario: sesiones con form_start frente a sesiones con generate_lead. No confundir número de eventos con número de sesiones o leads únicos. No sumar `form_submit`: el sitio no lo envía.
5. Contenido: tiempo de interacción medio por página y contactos generados; el tiempo activo lo calcula GA4, sin temporizadores artificiales.

Las definiciones y el marcado afectan datos futuros; no reclasifican el histórico. La interfaz puede tardar en mostrar los datos nuevos. El consentimiento condiciona la cobertura de medición.

## Verificación y límites

`npm run build` y `npm test` con Node 22.22+ o 24.15+ comprueban enlaces del sitio, comparador y analítica. Las pruebas usan un DOM local sin cargar scripts remotos ni enviar eventos a Google o formularios. Incluyen consentimiento/revocación, vistas, selección, un `contact_whatsapp` por clic, un `generate_lead` por envío, ausencia de `form_submit` y `request_quote_click`, el referrer de FormSubmit en la página de gracias y los códigos de WhatsApp.

Se verificó la configuración administrativa en GA4. La recepción de los eventos nuevos tras despliegue debe observarse con tráfico real o una sesión de prueba identificada; las pruebas locales no equivalen a confirmar recepción en Google. La entrega del correo y la calificación comercial siguen siendo verificaciones separadas.

Para revertir el código, revertir el commit de instrumentación. Para revertir ajustes administrativos, desmarcar los dos eventos añadidos/restaurar opciones de medición según necesidad; no borrar eventos ni datos históricos. No modificar otras propiedades.

## Compartir artículos por WhatsApp (2026-10-21)

Botón junto a la fecha en los 11 artículos y sus tarjetas del blog. Abre WhatsApp con el título y enlace, sin destinatario preseleccionado. Evento recomendado `share`: `method=whatsapp`, `content_type=article`, `item_id=slug del artículo`, `pagina=ruta de origen`, `ubicacion=articulo|listado_blog`.

Mide clics/intención de compartir, no mensajes enviados ni entregados. Respeta el consentimiento; no dispara `contact_whatsapp` ni `generate_lead`, y no se configura como conversión. La medición automática de clics salientes puede registrar también `click`; usar solo `share` para este KPI.

Enlaces compartidos incluyen `utm_source=whatsapp`, `utm_medium=social`, `utm_campaign=blog_share` y `utm_content=slug` para identificar visitas procedentes de estos enlaces. Canonical sin parámetros. El conteo aparece en GA4 cuando recibe eventos consentidos; la recepción real se debe verificar con tráfico real. Las pruebas locales validan el evento y su separación de leads sin enviar datos de prueba a Google.

Referencia: https://developers.google.com/analytics/devguides/collection/ga4/reference/events#share
