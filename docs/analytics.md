# Medición de captación de MatDepot

Implementación: 21 de octubre de 2026. Propiedad GA4 `536869166`, flujo web `14844815798`, etiqueta `G-LC7M7BHNSN`; correspondencia verificada en la administración de GA4.

## Eventos y significado

| Evento | Activación | Uso |
|---|---|---|
| contact_whatsapp | Clic en enlace HTTPS de wa.me, api.whatsapp.com o web.whatsapp.com | Evento clave de captación; una vez por sesión en GA4. El evento bruto conserva todos los clics. No confirma envío de mensaje |
| generate_lead | Retorno a gracias con solicitud reciente e ID coincidente | Evento clave de solicitud por formulario; deduplicado por ID en el navegador. No confirma recepción en buzón ni calificación |
| contact_phone / contact_email | Clic en teléfono / correo | Intención de contacto, sin marcado adicional como evento clave |
| view_item | Ficha de producto tras consentimiento | Vista de producto; items contiene ID, nombre y categoría del catálogo |
| select_item | Clic en enlace a una ficha del catálogo | Producto elegido e item_list_id con la ruta de origen |
| request_quote_click | Botón a contacto o enlace de cotización con producto | Intención de cotizar, anterior al envío |
| form_start | Primera interacción de foco del formulario con consentimiento | Inicio de formulario; la medición automática de formularios se desactivó en GA4 |
| compare_products | Añadir, quitar, sustituir, limpiar o filtrar diferencias | accion, cantidad_productos e items; no se emite por renderizado inicial ni por un cuarto producto rechazado |
| filter_catalog | Cambio de filtros/búsqueda del catálogo | Filtro, cantidad de resultados y presencia de búsqueda; no contiene texto libre |
| file_download | Medición mejorada de GA4 al pulsar enlaces a archivos compatibles | Configuración activa para cuando existan fichas descargables; no se duplicó con un evento manual |
| page_view / user_engagement / scroll | Medición estándar y mejorada de GA4 | Visitas, tiempo activo y desplazamiento; no se consideran leads |

WhatsApp y formulario se mantienen separados. No se genera un segundo generate_lead al pulsar WhatsApp. Para el indicador conjunto, usar sesiones con al menos uno de esos dos eventos, no sumar ambos conteos como personas únicas.

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
2. Productos: vistas view_item, selecciones select_item, clics de cotización y contactos por Producto de interés / Categoría de producto.
3. Botones: contact_whatsapp por Ubicación del botón y Página de interacción.
4. Formulario: sesiones con form_start frente a sesiones con generate_lead. No confundir número de eventos con número de sesiones o leads únicos.
5. Contenido: tiempo de interacción medio por página y contactos generados; el tiempo activo lo calcula GA4, sin temporizadores artificiales.

Las definiciones y el marcado afectan datos futuros; no reclasifican el histórico. La interfaz puede tardar en mostrar los datos nuevos. El consentimiento condiciona la cobertura de medición.

## Verificación y límites

`npm run build` y `npm test` con Node 24.15+ comprueban enlaces del sitio, comparador y analítica. Las pruebas usan un DOM local sin cargar scripts remotos ni enviar eventos a Google o formularios. Incluyen consentimiento/revocación, vistas, selección, WhatsApp, cotización, inicio de formulario tras consentimiento tardío, validación de retorno e ID, deduplicación y comparador.

Se verificó la configuración administrativa en GA4. La recepción de los eventos nuevos tras despliegue debe observarse con tráfico real o una sesión de prueba identificada; las pruebas locales no equivalen a confirmar recepción en Google. La entrega del correo y la calificación comercial siguen siendo verificaciones separadas.

Para revertir el código, revertir el commit de instrumentación. Para revertir ajustes administrativos, desmarcar los dos eventos añadidos/restaurar opciones de medición según necesidad; no borrar eventos ni datos históricos. No modificar otras propiedades.

## Compartir artículos por WhatsApp (2026-10-21)

Botón junto a la fecha en los 11 artículos y sus tarjetas del blog. Abre WhatsApp con el título y enlace, sin destinatario preseleccionado. Evento recomendado `share`: `method=whatsapp`, `content_type=article`, `item_id=slug del artículo`, `pagina=ruta de origen`, `ubicacion=articulo|listado_blog`.

Mide clics/intención de compartir, no mensajes enviados ni entregados. Respeta el consentimiento; no dispara `contact_whatsapp` ni `generate_lead`, y no se configura como conversión. La medición automática de clics salientes puede registrar también `click`; usar solo `share` para este KPI.

Enlaces compartidos incluyen `utm_source=whatsapp`, `utm_medium=social`, `utm_campaign=blog_share` y `utm_content=slug` para identificar visitas procedentes de estos enlaces. Canonical sin parámetros. El conteo aparece en GA4 cuando recibe eventos consentidos; la recepción real se debe verificar con tráfico real. Las pruebas locales validan el evento y su separación de leads sin enviar datos de prueba a Google.

Referencia: https://developers.google.com/analytics/devguides/collection/ga4/reference/events#share
