# Mat Depot

Sitio estático publicado en Vercel desde `main`.

## Editar y generar

- Contenido y fichas: `assets/catalogo.js`.
- Plantillas principales: archivos HTML de la raíz.
- Categorías y preguntas frecuentes: `data/content.json`.
- Tamaños de imágenes: `data/image-sizes.json` (actualizar al incorporar fotografías).
- Generador: `scripts/build.cjs`.

```sh
npm ci
npm run build
npm test
python -m http.server 8765 -d public
```

`public/` es una salida generada, excluida de Git. Vercel ejecuta el generador según `vercel.json`. No editar directamente `public/`: el siguiente build la sustituye.

El generador publica 33 fichas de producto con HTML completo, 5 categorías, preguntas frecuentes y páginas corporativas. No utiliza un servidor de aplicación para mostrar el catálogo. Búsqueda, filtros y comparación mejoran el HTML existente en el navegador.

## Medición

`assets/analytics.js` utiliza el ID de GA4 proporcionado en la auditoría: `G-LC7M7BHNSN`. La propiedad, titularidad y recepción deben confirmarse en la administración de Google Analytics.

- Analítica desactivada hasta aceptación; almacenamiento publicitario denegado.
- Eventos: `view_item`, `contact_whatsapp`, `contact_phone`, `contact_email`, `filter_catalog`, `form_start`, `generate_lead`.
- No se envían los datos personales del formulario ni términos de búsqueda libres.
- `generate_lead` requiere un envío previo en la misma sesión y un `lead_id` coincidente; no se repite al recargar. Es una señal de retorno del formulario, no un recibo del buzón ni un lead comercial validado.
- No se asigna valor económico ficticio a las conversiones.
- Verificar en GA4 los eventos clave y las opciones de medición mejorada para evitar duplicar `form_start`.

## Formulario

El receptor comercial autorizado es `matdepotmx@gmail.com`. FormSubmit exige activar el buzón y confirmar una entrega real. El aviso conserva el correo previamente publicado para solicitudes de privacidad: confirmar con la dirección antes de cambiar ese canal.

El sitio no guarda las solicitudes en una base de datos propia. No se debe afirmar que el retorno a `/gracias.html` confirma entrega en bandeja de entrada.

## Datos comerciales pendientes

No añadir precios, existencias, certificados, tensiones de trabajo seguras, dirección completa ni fechas de vigencia sin documentación de Mat Depot. El marcado Product describe el catálogo; sin ofertas o reseñas válidas no se promete elegibilidad para resultados enriquecidos de Google.
