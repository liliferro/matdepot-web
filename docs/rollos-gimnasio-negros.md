# Rollos negros de gimnasio A y B

## Fuentes
Datos transcritos de las fichas suministradas por el cliente:
- FT PHASA ROLLO GIMNASIO NEGRO TIPO -A.pdf, una página.
- FT PHASA ROLLO GIMNASIO NEGRO TIPO B.pdf, una página.

| Dato | Tipo A | Tipo B |
| --- | --- | --- |
| Material | EPDM | EPDM |
| Dimensiones | 1 m ancho × 10 m largo | 1 m ancho × 10 m largo |
| Espesor | 5 mm | 5 mm |
| Color | Negro | Negro |
| Acabado | Poroso | Liso sin poros |
| Peso específico (denominación de la ficha) | 0.8 g/cm³ | 1.07 g/cm³ |

El campo CÓDIGO está vacío en ambos documentos; no se inventó SKU. Los valores en g/cm³ se conservaron tal como figuran: no son el peso total del rollo. No se añadieron precios, existencias, garantías, certificados ni capacidades de carga no documentadas. Las aplicaciones proceden de la descripción del proveedor.

## Fotografías
- `assets/products/tapete-gimnasio-negro-en-rollo-tipo-a-01.webp`: retoque generativo de la fotografía principal del proveedor.
- `assets/products/tapete-gimnasio-negro-en-rollo-tipo-b-01.webp`: retoque generativo de la fotografía principal del proveedor.
- Las dos imágenes `-02.webp` son vistas originales extraídas de los PDF, convertidas a WebP sin modificar forma, textura ni encuadre.
- Las fotografías retocadas son de presentación; la especificación del material se rige por los datos del proveedor, no por detalle reconstruido de la imagen.

Se utilizó la herramienta integrada de edición de imágenes. Instrucciones: conservar silueta, color negro y cámara; fondo limpio #F4F1EA, sombra suave, iluminación y nitidez moderadas; tipo A con acabado poroso y núcleo de cartón visible; tipo B liso sin poros y abertura superior oscura sin cartón. Sin logotipos, textos, objetos nuevos ni cambio de geometría. Las imágenes se muestran completas mediante object-fit: contain.

## Integración
Las entradas de `assets/catalogo.js` generan las fichas estáticas, tarjetas, categoría de gimnasios, filtros, comparador, selección del formulario, datos estructurados, sitemap y llms.txt. Se registraron las dimensiones de las cuatro imágenes y se añadieron redirecciones para los identificadores nuevos.
