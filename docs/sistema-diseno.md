# Mat Depot · Reglas de interfaz

- Colores: tokens existentes `--c-carbon`, `--c-paper`, `--c-bone` y escala gris. No añadir colores de marca alternativos.
- Archivo para navegación, párrafos, formularios y especificaciones. JetBrains Mono para etiquetas cortas y referencias. Mínimo 12px; inputs móviles 16px.
- Títulos: H1 32–60px; encabezados destacados secundarios 28–48px; H2 26–40px. Las palabras no deben truncarse.
- Botones: `.btn` estándar mínimo 48px y `.btn--sm` compacto mínimo 44px; contenido centrado. Primario sólido, secundario outline y contraste inverso. `.btn--ghost-light` es la variante outline sobre fondo oscuro. No subrayar botones.
- Formularios: controles mínimo 48px; etiqueta visible, relación for/id, foco visible y consentimiento separado. Mantener fallback sin JavaScript.
- Galería: 4:3 y object-fit contain. Nunca recortar ni repetir fotos para rellenar la cuadrícula.
- Catálogo: 4 columnas escritorio, 2 tablet/móvil >360px, 1 en pantallas muy estrechas. 12 tarjetas por bloque móvil con progresive enhancement, sin ocultar a rastreadores ni a usuarios sin JS.
- Navegación móvil: Escape cierra, foco vuelve al botón y se mantiene aria-expanded. CTA de cotización y WhatsApp dentro del menú.
- Contenido crítico y formulario nunca se cubren con WhatsApp flotante en móvil. Tablas con desplazamiento interno e indicación visible.
- Prueba antes de publicar: build/test, 360/390/768/1024/1440px, teclado, filtros, comparador, consentimiento y formulario. No disparar envíos o analítica reales durante QA automatizada.
