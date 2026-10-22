# Blog de MatDepot

El artículo inicial y diez guías especializadas se generan como HTML estático. El texto y los enlaces son legibles sin JavaScript; las herramientas requieren JavaScript y no envían ni guardan respuestas. El usuario decide copiar el resumen y enviarlo mediante contacto.

- `data/blog-posts.json`: orden editorial, títulos, descripciones, categoría, producto y relaciones de las diez guías nuevas.
- `docs/blog/*.md`: contenido editorial; ejemplos ilustrativos identificados, sin precios, instalaciones o pruebas inventados.
- `data/blog-tools.json`: criterios de los asistentes y listas de comprobación.
- `scripts/build-blog.cjs`: portada agrupada, metadatos, BlogPosting, breadcrumbs, enlaces y herramientas.
- `scripts/blog-tools.cjs` y `assets/blog-tools.js`: interfaz estática y comportamiento de herramientas.

La prioridad editorial responde a decisiones de selección y cotización; no es una clasificación por volúmenes medidos. Las fichas del catálogo son la fuente de dimensiones; no sustituyen ensayos de desempeño o instrucciones específicas del proveedor. El sitio indica autoría corporativa, asistencia de IA y ausencia de revisión técnica independiente.

Antes de actualizar una guía, confirmar las especificaciones del modelo y revisar sus enlaces. Cambiar la fecha de modificación únicamente al actualizar el contenido. No añadir promesas médicas, de aislamiento acústico o de compatibilidad química no documentadas. Publicar casos y fotos de instalaciones solo con evidencia y autorización.

Verificación: `npm run build` y `npm test`, con Node compatible. Las pruebas cubren los once artículos, enlaces, metadatos y las herramientas. No se envían leads de prueba.
