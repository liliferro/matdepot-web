# Mat Depot

Sitio estático publicado en Vercel desde `main`.

## Editar y generar

- Contenido y fichas: `assets/catalogo.js`.
- Plantillas principales: archivos HTML de la raíz.
- Categorías y respuestas generales conservadas: `data/content.json`.
- Las 20 FAQ de compra y selección, agrupadas por aplicación y con enlaces: `data/faqs.json`. El generador publica ocho en la FAQ general, cuatro en antifatiga, dos en antiderrapantes, cuatro en gimnasios y dos sobre cocina en áreas húmedas. La FAQ general conserva además las respuestas sobre visitas al almacén y precios, e incluye un índice hacia las preguntas de cada categoría.
- `assets/faq.js` abre la respuesta indicada por un enlace directo; las preguntas y respuestas están en el HTML y los desplegables funcionan sin JavaScript.
- Tamaños de imágenes: `data/image-sizes.json` (actualizar al incorporar fotografías).
- Generador: `scripts/build.cjs`.

```sh
npm ci
npm run build
npm test
python -m http.server 8765 -d public
```

`public/` es una salida generada, excluida de Git. Vercel ejecuta el generador según `vercel.json`. No editar directamente `public/`: el siguiente build la sustituye.

El generador publica 35 fichas de producto con HTML completo, 5 categorías, preguntas frecuentes y páginas corporativas. No utiliza un servidor de aplicación para mostrar el catálogo. Búsqueda, filtros y comparación mejoran el HTML existente en el navegador.

## Comparador

En `/comparar.html` se pueden seleccionar hasta tres productos desde las tarjetas del catálogo o las tarjetas con foto de la página de comparación. El catálogo muestra un botón «Comparar productos» junto a «Limpiar filtros», sin la tabla ni el panel de comparación. La página de comparación muestra los 35 productos, sin desplegables, con botones «Agregar a la comparación». Cada columna permite cambiar el producto eligiendo otra tarjeta o quitar el producto y abrir su ficha o cotización. La selección se conserva en `sessionStorage` durante la sesión; si el navegador bloquea ese almacenamiento, la comparación sigue funcionando en la página actual.

`assets/comparison.js` lee exclusivamente `MD_CATALOG[].specs`, la misma fuente utilizada por las fichas. No infiere atributos desde nombres o fotografías. “Solo diferencias” compara los valores textuales publicados; los campos ausentes se muestran como “No especificado” y no se cuentan como diferencias. Las unidades y redacción de las fichas no se convierten ni normalizan. En móvil, la tabla se desplaza horizontalmente y mantiene visible el nombre de la característica.

Se admite un enlace inicial `/comparar.html?comparar=slug-1,slug-2`. Los identificadores desconocidos o repetidos se descartan y se limita la selección a tres. `npm test` comprueba también selección, cambio, límite, datos originales, faltantes, filtros, enlaces, persistencia y foco de teclado. Utilizar Node 24.15 o posterior (Vercel: 24.x).

## Medición

`assets/analytics.js` utiliza el ID de GA4 proporcionado en la auditoría: `G-LC7M7BHNSN`. La propiedad, titularidad y recepción deben confirmarse en la administración de Google Analytics.

- Analítica desactivada hasta aceptación; almacenamiento publicitario denegado.
- Eventos: `view_item`, `select_item`, `request_quote_click`, `compare_products`, `contact_whatsapp`, `contact_phone`, `contact_email`, `filter_catalog`, `form_start`, `generate_lead`.
- No se envían los datos personales del formulario ni términos de búsqueda libres.
- `generate_lead` requiere un envío previo en la misma sesión y un `lead_id` coincidente; no se repite al recargar. Es una señal de retorno del formulario, no un recibo del buzón ni un lead comercial validado.
- No se asigna valor económico ficticio a las conversiones.
- Configuración GA4 verificada: `contact_whatsapp` y `generate_lead` son eventos clave; WhatsApp cuenta una vez por sesión. Formularios automáticos desactivados para evitar duplicar `form_start`. Detalles, dimensiones y límites en [docs/analytics.md](docs/analytics.md).

## Formulario

El receptor comercial autorizado es `matdepotmx@gmail.com`. FormSubmit exige activar el buzón y confirmar una entrega real. El único correo autorizado en toda la web, incluido el aviso de privacidad, es `matdepotmx@gmail.com`. La validación de publicación comprueba enlaces de correo, destinatario del formulario y ausencia de variantes incorrectas.

El sitio no guarda las solicitudes en una base de datos propia. No se debe afirmar que el retorno a `/gracias.html` confirma entrega en bandeja de entrada.

## Datos comerciales pendientes

No añadir precios, existencias, certificados, tensiones de trabajo seguras, dirección completa ni fechas de vigencia sin documentación de Mat Depot. El marcado Product describe el catálogo; sin ofertas o reseñas válidas no se promete elegibilidad para resultados enriquecidos de Google.
