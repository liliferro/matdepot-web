/* Explicit catalogue-based rules. No inferred chemical, load or acoustic ratings. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MD_BLOG_RECOMMENDATIONS = factory();
})(typeof window !== 'undefined' ? window : this, function () {
  const products = {
    fatigue:'tapete-antifatiga-negro-de-uso-general', line:'tapete-esponjoso-con-franjas-amarillas', heavy:'tapete-de-seguridad-de-pvc-para-trafico-pesado',
    kitchen:'tapete-para-cocina', wet:'tapete-para-alberca-y-areas-humedas', grip:'tapete-antiderrapante-americano', ribbed:'tapete-antiderrapante-mil-rayas',
    seven:'tapete-para-gimnasio-modular-de-7-mm', thirteen:'tapete-para-gimnasio-modular-de-13-mm', colors:'tapete-modular-para-gimnasio-en-diferentes-colores',
    roll:'tapete-para-gimnasio-en-rollo-con-chispas-verdes', smooth:'tapete-gimnasio-negro-en-rollo-tipo-b', tile:'tapete-para-gimnasio-de-hule-reciclado'
  };
  function recommend(id, answers) {
    const a=answers.map(Number), items=[];
    const add=(key,reason,verify='')=>items.push({slug:products[key],reason,verify});
    let notice='Selección orientativa según las aplicaciones y medidas publicadas. Confirma cantidad e instalación al cotizar.';
    const chemical='No tenemos compatibilidad química documentada para recomendar un modelo con esa exposición. Envíanos la sustancia y las condiciones para revisar una opción adecuada.';
    const impact='Confirmar cargas, altura y frecuencia de caída; el espesor no garantiza por sí solo resistencia al impacto ni aislamiento acústico.';
    if(id==='selector') {
      if(a[2]===1){
        add('thirteen','Su ficha incluye pesas libres y peso muerto.',impact);
        if(a[0]===1)add('roll','Alternativa en rollo: su ficha incluye áreas de pesas libres.',impact);
      }else if(a[0]===1){
        add('roll','Formato en paños de 1 m de ancho para comparar la cobertura de un área continua.');
        add('smooth','Alternativa de rollo negro de 1 × 10 m y acabado liso.');
      }else if(a[0]===2){
        add('colors','Disponible en varios colores para distinguir zonas de entrenamiento.');
        add('seven','Alternativa modular negra para máquinas y cardio.','Confirmar las actividades de cada zona.');
      }else{
        add('seven','Losetas ensamblables de 50 × 50 cm para comparar reposición por piezas.','Confirmar disponibilidad y compatibilidad de piezas de reemplazo.');
        add('colors','Otra opción modular, con varios colores para tu distribución.');
      }
      if(a[1]===1)notice+=' Tu espacio tiene obstáculos: confirma el trazado de cortes.';
      if(a[1]===2)notice+=' Calcula cantidades por área; no asumas aprovechamiento de recortes entre zonas.';
      if(a[2]===2)notice+=' Define el uso de pesas antes de confirmar el modelo.';
    } else if(id==='ficha-uso') {
      if(a[0]===0){add('seven','Su ficha incluye máquinas, cardio y pasillos.','Confirmar peso y apoyos del equipo.');add('smooth','Alternativa en rollo para áreas con equipo de entrenamiento.','Confirmar apoyos y preparación de la base.');}
      if(a[0]===1){add('thirteen','Su ficha incluye pesas libres y peso muerto.',impact);add('tile','Loseta de hule reciclado para instalaciones permanentes y áreas de pesas.',impact);}
      if(a[0]===2){add('colors','Su ficha contempla áreas funcionales y zonificación por color.','Precisar saltos, arrastres y accesorios.');add('roll','Alternativa en rollo cuya ficha incluye áreas funcionales.','Confirmar compatibilidad con tus ejercicios.');}
      if(a[1]===1)notice+=' Para planta alta, evalúa por separado capacidad del inmueble y transmisión de ruido.';
      if(a[2]!==0)notice+=' Falta definir equipos y cargas para cerrar la selección.';
    } else if(id==='puesto') {
      if(a[1]===2)notice=chemical;
      else if(a[1]===1)add('kitchen','Su ficha combina uso antifatiga con orificios de drenaje.','Confirmar líquidos, limpieza y, si aplica, paso de equipos.');
      else if(a[2]===1)add('heavy','Su ficha incluye puestos de trabajo pesado y zonas de tránsito con carga.','La compatibilidad con tus ruedas, cargas y maniobras requiere confirmación.');
      else{
        if(a[0]===1){add('line','Formato de 90 cm de ancho y varias longitudes para distribuir a lo largo de una línea.');add('fatigue','Alternativa de piezas individuales si prefieres cubrir estaciones separadas.');}
        else{add('fatigue','Pieza de 90 cm × 1.20 m indicada en el catálogo para estaciones de trabajo.');add('line','Alternativa con franjas amarillas y distintas longitudes para delimitar el área.');}
        if(a[2]===2)notice+=' Confirma si pasan carritos antes de cerrar la selección.';
      }
    } else if(id==='funcion') {
      if(a[1]===2)notice=chemical;
      else if(a[1]===1)add('kitchen','Su ficha incluye funciones antifatiga, antiderrapante y drenaje para áreas de lavado.','Confirmar aplicación, líquido y condiciones de agarre.');
      else if(a[0]===1){add('grip','Hule estriado para pasillos y tránsito peatonal según su ficha.');add('ribbed','Otra opción estriada para comparar anchos y presentación.');}
      else{
        add('fatigue',a[0]===2?'La ficha describe una superficie antiderrapante en un tapete antifatiga.':'La ficha lo orienta a personal que trabaja de pie y estaciones de trabajo.');
        if(a[0]===0)add('line','Alternativa para delimitar líneas y estaciones con franjas amarillas.');
      }
    } else if(id==='exposicion') {
      if(a[0]!==0)notice=chemical;
      else if(a[3]===1)add('wet','Su ficha contempla perímetros de alberca, vestidores y regaderas.','Confirmar temperatura, productos de limpieza y drenaje.');
      else add('kitchen','Su ficha contempla lavado y cocinas, con orificios para drenar líquidos.','Confirmar ubicación, temperatura y productos de limpieza.');
      if(a[0]===0 && a[1]===1)notice+=' El contacto frecuente requiere revisar acumulación y limpieza debajo del tapete.';
      if(a[0]===0 && a[2]===1)notice+=' Confirma la temperatura de exposición antes de comprar.';
    } else if(id==='cocina') {
      add('kitchen',a[0]===0?'Su ficha incluye zona de lavaloza y drenaje.':a[0]===1?'Formato modular para evaluar cobertura de estaciones de cocina.':a[0]===2?'Modelo del catálogo para cocinas industriales; opción a validar para tu estación.':'Formato modular de cocina para revisar la distribución del área.',a[0]===2?'Confirmar expresamente compatibilidad con grasas y temperatura.':a[0]===3?'Confirmar carritos, ruedas, cargas, bordes y puertas.':'Confirmar limpieza y cobertura útil del ensamble.');
      notice+=' '+(a[1]===2?'Define la rutina de retiro y limpieza.':'Confirma peso y manipulación para el retiro previsto.')+' '+(a[2]===2?'Asigna quién realizará la limpieza.':'Comparte las instrucciones con el equipo responsable.');
    }
    return {items,notice};
  }
  return {recommend,slugs:Object.values(products)};
});
