# Auditoría SEO y GEO del blog de MatDepot

Fecha de revisión: 21 de octubre de 2026. Alcance: índice del blog y 11 artículos en www.matdepotmex.com. No es una auditoría de tráfico, rankings ni indexación efectiva.

## Evidencia de la revisión

La captura previa está en blog-audit-2026-10-21.json: las 12 URLs públicas respondieron HTTP 200, con un H1, canonical correcto y sin directivas noindex detectadas. Todas están en el sitemap. robots.txt permite el rastreo general y los agentes de búsqueda de OpenAI, Anthropic y Perplexity. Esto permite rastrear, pero no demuestra que Google o un LLM indexe o cite las páginas.

Las comprobaciones del proyecto cubren títulos y descripciones únicos, schema BlogPosting y BreadcrumbList, fechas coherentes con el contenido visible, enlaces locales y anclas, dimensiones y textos alternativos de imágenes, herramientas y eventos de analítica. El contenido principal está en HTML y no depende de ejecutar las herramientas.

## Hallazgos y cambios

- Prioridad media: faltaban enlaces de regreso al artículo principal desde las cuatro guías específicas de gimnasio. Se añadieron, junto con enlaces contextuales desde la guía principal a formato, espesor, instalación, mantenimiento y presupuesto.
- Prioridad media: siete artículos no enlazaban a sus FAQ dentro del contenido principal. Se incorporó acceso a la categoría/catálogo y sus preguntas existentes en el bloque final de recursos de todos los artículos. No se duplicaron las respuestas de FAQ.
- Prioridad media: seis descripciones seguían presentando los selectores como generadores de resúmenes. Se actualizaron para reflejar las recomendaciones reales de productos y sus límites.
- Prioridad baja: el título de limpieza prometía más que el procedimiento documentado disponible. Se precisó como organización de la limpieza, conservando la URL.
- Prioridad baja: se añadió el tema del artículo a BlogPosting y texto alternativo de la imagen social, con idioma es_MX. No se añadieron reseñas, certificaciones o autores inexistentes.

## Contenido y GEO

Los 11 artículos responden al tema desde el inicio; diferencian selección, formato, espesor, instalación, mantenimiento, aplicación y compra. Incluyen tablas, productos enlazados y herramientas propias. No se encontró duplicación literal sustancial que justifique reescritura masiva. No se afirma canibalización sin datos de consultas y resultados.

Se revisó presencia natural de los términos en títulos, descripciones y apertura. No se aplicó una densidad arbitraria de palabras clave. La prioridad fue la correspondencia entre intención, respuesta y utilidad real.

La evidencia actual procede del catálogo comercial. Los ejemplos se identifican como ilustrativos; no hay ensayos ni revisión técnica independiente documentada. La siguiente mejora editorial requiere fotos autorizadas de una instalación real, producto utilizado, medidas y observaciones verificables. No debe simularse con una firma de experto o estadísticas inventadas.

## Límites de esta auditoría

No se midieron Core Web Vitals de usuarios reales ni se consultaron estados de indexación de Search Console, posiciones, volúmenes o citas de LLM. No se asigna una puntuación global que implique haber medido estos factores. Las páginas deben mantenerse y ampliarse con evidencia propia; no hay garantía de posicionamiento o citación.

## Referencias oficiales

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/appearance/structured-data/article

Google indica que las bases de SEO también aplican a sus funciones de IA, sin schema especial o archivos AI obligatorios. El marcado debe coincidir con el contenido visible.
