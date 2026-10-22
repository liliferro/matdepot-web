const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {recommend,slugs}=require('../assets/blog-recommendations.js');
const configs=require('../data/blog-tools.json');
const scope={window:{}};vm.runInNewContext(fs.readFileSync('assets/catalogo.js','utf8'),scope);
for(const slug of slugs)assert(scope.window.MD_CATALOG.some(p=>p.slug===slug));
const ids=(id,answers)=>recommend(id,answers).items.map(item=>item.slug);
assert(ids('funcion',[0,0]).includes('tapete-antifatiga-negro-de-uso-general'));
assert(!ids('funcion',[1,0]).includes('tapete-antifatiga-negro-de-uso-general'));
assert(ids('funcion',[1,0]).includes('tapete-antiderrapante-americano'));
assert.deepEqual(ids('funcion',[0,1]),['tapete-para-cocina']);
assert.deepEqual(ids('funcion',[0,2]),[]);
assert(ids('puesto',[1,0,0])[0]==='tapete-esponjoso-con-franjas-amarillas');
assert(ids('puesto',[0,0,1])[0]==='tapete-de-seguridad-de-pvc-para-trafico-pesado');
assert(recommend('puesto',[0,0,1]).items[0].verify.includes('ruedas'));
assert.deepEqual(ids('exposicion',[0,0,0,1]),['tapete-para-alberca-y-areas-humedas']);
assert.deepEqual(ids('exposicion',[0,0,0,0]),['tapete-para-cocina']);
for(const substance of [1,2,3])assert.deepEqual(ids('exposicion',[substance,0,0,0]),[]);
assert(ids('selector',[0,0,1]).includes('tapete-para-gimnasio-modular-de-13-mm'));
assert(!ids('selector',[0,0,1]).includes('tapete-para-gimnasio-modular-de-7-mm'));
assert(ids('selector',[2,0,0]).includes('tapete-modular-para-gimnasio-en-diferentes-colores'));
assert(recommend('ficha-uso',[1,1,0]).notice.includes('planta alta'));
assert(recommend('cocina',[2,0,0]).items[0].verify.includes('grasas'));
let cases=0;
for(const [id,c]of Object.entries(configs).filter(([,c])=>c.type==='planner')){
 const combinations=c.fields.reduce((rows,f)=>rows.flatMap(row=>f.options.map((_,i)=>[...row,i])),[[]]);
 for(const answers of combinations){
  const result=recommend(id,answers);cases++;
  assert(result.notice);assert(result.items.length<=3);assert.equal(new Set(result.items.map(p=>p.slug)).size,result.items.length);
  for(const item of result.items){assert(slugs.includes(item.slug));assert(item.reason);}
 }
}
console.log(`Recommendation rules passed: ${cases} combinations, catalogue references, distinct needs, compatibility limits and conditional options.`);
