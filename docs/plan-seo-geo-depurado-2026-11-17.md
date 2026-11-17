# Mat Depot · Plan SEO y GEO depurado

Marketech · 17 de noviembre de 2026

## Objetivo y criterio de publicación

Mejorar el acceso a las páginas, la claridad del catálogo y la medición de consultas comerciales. La visibilidad en respuestas de IA se evalúa con evidencia; no se garantiza por publicar un archivo, un esquema o cierta cantidad de páginas.

Publicar únicamente información respaldada por el catálogo o por documentos del negocio. Los datos técnicos de una norma o de otro fabricante no acreditan prestaciones de un producto Mat Depot. El contenido debe responder a una necesidad real de compra y coincidir con sus datos estructurados.

Identidad operativa que se conserva:

- Web: https://www.matdepotmex.com/
- Correo: **matdepotmx@gmail.com**.
- Teléfonos publicados: +52 55 9626 5258 y +52 55 9626 5259.
- WhatsApp publicado: 55 4494 3014.
- Dirección: C. Popocatépetl 42, San Javier, C.P. 54030, Tlalnepantla de Baz, Estado de México.
- Horario publicado: lunes a viernes, 09:00–18:00; visitas bajo cita previa.

No se sustituye el teléfono por 55 5384 1644, ni se crean alias de correo, coordenadas, identificadores comerciales o declaraciones de fabricante basados en el texto recibido.

## Diagnóstico verificable y limitaciones

La base incorpora 35 productos con fotos, cinco categorías, tres páginas de sector, blog, comparador, herramientas y preguntas frecuentes. El sitemap contiene 65 URL indexables. Ya existen HTML pre-renderizado, dimensiones de imágenes, WebP, consentimiento previo de analítica, marcado de productos y navegación, y verificación de Bing.

Los scores 86/88/68/48/25 del documento recibido no cuentan con una metodología reproducible aportada. Tampoco se ha reconsultado en esta entrega el período y alcance de sus cifras GSC/GA4. No se usan como línea base actual ni se afirma que el único formulario registrado fuera una prueba sin evidencia de esa sesión.

Una visita referida desde ChatGPT no demuestra una cita. Un clic en WhatsApp no confirma una conversación y el evento de envío a FormSubmit no acredita recepción ni venta.

## 1. Rutas y arquitectura

Implementado en esta entrega:

- 56 rutas internas sin extensión de productos, categorías, blog, sectores y guías redirigen mediante 301 a su página .html existente.
- Tres alias adicionales: /nosotros → /quienes-somos.html; /aviso-de-privacidad → /aviso-privacidad.html; /tapete-esponjoso-con-franjas-amaril → la ficha completa correspondiente.
- Se conservan las redirecciones anteriores y las URL canónicas .html.
- No se activa cleanUrls junto con reglas que vuelvan a añadir .html. No se sustituye la configuración completa de Vercel por un ejemplo parcial.
- Las rutas desconocidas siguen siendo 404; no se convierten en redirecciones masivas a una categoría o a Inicio.

Siguiente acción condicionada: exportar de Search Console las URL históricas con impresiones y los errores de indexación para añadir equivalencias específicas. La URL truncada se corrige por su correspondencia inequívoca; no se afirma haber comprobado sus impresiones en esta entrega.

## 2. Rendimiento

Implementado: prioridad alta y precarga de la imagen principal real de cada producto y de portada. Las imágenes secundarias siguen con carga diferida. Las dimensiones explícitas existentes se mantienen.

Las fotos ya son WebP: no procede describirlas como formatos heredados. Algunas secundarias pesan aproximadamente 480–630 KB. La siguiente optimización debe crear variantes de miniatura y tamaños responsive, conservar originales y revisar detalle visual antes de sustituirlas. No se impone un peso máximo que destruya la utilidad de la fotografía.

Validar rendimiento con varias ejecuciones comparables y, cuando exista muestra suficiente, datos de campo en percentil 75. No afirmar que 2,488 ms sea un dato actual ni que 12 ms de diferencia en una prueba aislada determinen éxito o exclusión de un motor de IA. No se declara una mejora numérica de LCP sin medición posterior.

## 3. Rastreo y acceso

Se mantiene el acceso para los buscadores y agentes de búsqueda ya configurados. No se introducen bloqueos de entrenamiento como requisito SEO: esa política tiene objetivos diferentes y requiere una decisión expresa del propietario.

/gracias.html conserva noindex y queda fuera del sitemap. No se añade Disallow para esa página: el rastreador debe poder acceder a la directiva de exclusión de indexación. robots.txt no protege información privada; no se inventan rutas privadas /checkout/ o /api/ para simular controles de seguridad.

## 4. Archivos de consulta para IA

Implementado: llms.txt incorpora enlaces válidos a categorías, sectores, blog, comparador, calculadora, guía presupuestal y catálogo extendido. Conserva correo, condiciones de cotización y nombres reales de producto.

llms-full.txt contiene datos publicados del catálogo. Es complementario; no sustituye HTML indexable, sitemap ni documentación comercial. No se afirma que sea un estándar obligatorio adoptado por todos los motores. Google indica que no se necesitan archivos especiales de IA para sus funcionalidades de búsqueda con IA.

## 5. Metadatos y datos estructurados

Implementado: títulos y descripciones específicos para las cinco categorías, sustituyendo el sufijo genérico «para tu proyecto». Se conserva el contenido visible y se actualiza la fecha de modificación de esas categorías al 17/11/2026.

Se mantienen Organization/LocalBusiness, Product, BreadcrumbList, ItemList, BlogPosting y FAQPage donde corresponden. El marcado refleja contenido visible; no se añade Offer sin precio y condiciones reales, InStock sin confirmación ni SKU/MPN inventados. No se presenta la existencia de schema como garantía de resultados enriquecidos o citas.

## 6. Contenido y evidencia

Las fichas ya tienen introducciones y especificaciones. Mejorar claridad a partir de esos datos, sin imponer cifras o una longitud de párrafo como supuesto requisito algorítmico.

Quedan excluidos del texto recibido:

- Reducción del 50% de compresión muscular o estrés articular atribuida al producto.
- Absorción de impacto superior al 70%, atenuación de 18/22 dB y propiedades antibacterianas sin ensayos del modelo.
- Certificación ASTM D178, clases de uso o protección hasta 36 kV sin certificado identificable del producto suministrado.
- Composición de nitrilo, densidad, temperatura, dureza Shore o porcentaje de drenaje no documentados.
- Supuesto cumplimiento NOM atribuido por el nombre de una familia de tapetes.

Las normas generales solo podrán explicarse con fuentes oficiales actualizadas y límites claros. Nunca se trasladan sus tablas al producto como certificación. Se preservan las fuentes CCOHS/HSE ya enlazadas en cuatro guías y su declaración de alcance.

## 7. Precios y documentación comercial

Pendiente del negocio: lista vigente, unidad de venta, IVA, mínimos, vigencia, descuentos, existencias, flete y plazos. Hasta entonces se mantiene cotización y no se publican cifras de ejemplo como tarifas.

Para fichas PDF se necesitan documentos originales o datos aprobados por el responsable del producto. Un PDF generado desde el catálogo puede describir ese catálogo, pero no convertirse en certificado o ensayo. No se crean garantías ni promesas de entrega de 24–48 horas.

## 8. Entidad local y autoridad externa

Mantener la misma identidad en web y perfiles confirmados. Auditar fichas existentes antes de crear nuevas para evitar duplicados. Cualquier corrección en Cosmos, AllBiz, LinkedIn o Google Business Profile exige verificar la ficha y contar con acceso; no se da por probada su titularidad o estado a partir del texto recibido.

Casos, testimonios, logotipos y fotos de instalaciones necesitan evidencia y permiso. No se solicitan reseñas ni se contacta a clientes sin autorización específica para esos mensajes.

## 9. Expansión editorial

Se elimina el objetivo arbitrario de 140 URL. Cada página debe aportar contenido distinto y evidencia suficiente.

Orden propuesto:

1. Optimizar las categorías existentes a partir de consultas reales de Search Console.
2. Completar las fichas con documentación y condiciones comerciales aprobadas.
3. Mejorar comparativas existentes antes de crear otra URL sobre el mismo tema.
4. Crear comparativas nuevas solo si el catálogo permite una comparación verificable.
5. Publicar casos reales antes que decenas de páginas genéricas de aplicaciones.
6. Crear páginas logísticas únicamente con costos, cobertura y plazos específicos confirmados.

Gimnasio y seguridad eléctrica ya tienen categorías dedicadas; no se crean dos sectores casi idénticos. Cocinas ya dispone de /sectores/cocinas.html. La calculadora de superficie y el comparador ya existen.

## 10. Medición y ejecución

Implementado: GA4 se habilita únicamente en matdepotmex.com y www.matdepotmex.com, siempre después del consentimiento. Versiones Vercel de prueba y localhost no cargan la etiqueta ni emiten eventos de producción. Esto no sustituye filtros de tráfico interno para personal que visite el dominio público.

Se mantienen UTM consentidas, lead_id y eventos del embudo. No se habilitan identificadores publicitarios con consentimiento publicitario denegado. La recepción efectiva del formulario requiere un envío identificado de prueba y acceso a la bandeja receptora; no se afirma comprobada.

Prioridades siguientes:

| Prioridad | Trabajo | Condición para cerrar |
|---|---|---|
| Inmediata | Rutas, metadatos, llms y aislamiento de QA | Pruebas y comprobación del despliegue |
| Alta | Revisar consultas/URL reales en GSC y eventos clave en GA4 | Acceso a propiedad, período y configuración |
| Alta | Verificar recepción y calidad de consultas | Envío de prueba autorizado y confirmación de bandeja |
| Alta | Piloto comercial de 3–5 productos | Precios y documentos aprobados por Mat Depot |
| Media | Fotografías responsive | Comparación visual y medición de rendimiento |
| Media | Perfiles locales y casos | Acceso a perfiles y materiales autorizados |
| Continua | Mejoras editoriales y GEO | Línea base comparable; no publicar por cuota de URL |

## 11. Indicadores y seguimiento GEO

Usar ventanas comparables en GSC y GA4: mismos países, tipo de búsqueda, duración y exclusiones internas. Registrar clics, impresiones, consultas, páginas, CTR y posición sin mezclar totales globales con México ni segmentos con el sitio completo.

Se mantiene el panel de 20 preguntas de docs/protocolo-geo.md: 16 sin marca y 4 de marca. Registrar plataforma/modelo, fecha, consulta exacta, mención, enlace, URL y errores. Medir por separado preguntas de marca y descubrimiento; no cambiar el panel a mitad de una comparación.

No se fijan 120 clics, 4,500 impresiones o 25% de presencia como resultados comprometidos: primero se necesita una línea base fechada y un escenario justificable. Citas en un benchmark académico no son una previsión de crecimiento para Mat Depot.

## Fuentes de criterio técnico

- Vercel, configuración de proyectos: https://vercel.com/docs/project-configuration
- Google, funcionalidades de IA y sitios web: https://developers.google.com/search/docs/appearance/ai-features
- Google, exclusión mediante noindex: https://developers.google.com/search/docs/crawling-indexing/block-indexing

El plan conserva acciones comprobables y separa claramente implementación técnica, hipótesis de mejora y decisiones pendientes del negocio.
