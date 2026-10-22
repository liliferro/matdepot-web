const fs=require('node:fs'), assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const posts=require('../data/blog-posts.json');
for(const post of posts){
 const dom=new JSDOM(fs.readFileSync('public/blog/'+post.slug+'.html','utf8'),{runScripts:'outside-only',url:'https://www.matdepotmex.com/blog/'+post.slug+'.html'});
 const w=dom.window,d=w.document;w.eval(fs.readFileSync('assets/blog-tools.js','utf8'));
 const root=d.querySelector('[data-tool]'),form=root.querySelector('form'),result=root.querySelector('[data-tool-result]'),error=root.querySelector('[data-tool-error]');
 const config=JSON.parse(root.querySelector('[data-tool-config]').textContent);
 const submit=()=>form.dispatchEvent(new w.Event('submit',{cancelable:true,bubbles:true}));
 const set=(name,value)=>{const el=form.elements.namedItem(name);el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));};
 const output=()=>root.querySelector('[data-tool-output]').textContent;
 assert(!form.hidden);submit();
 if(config.type!=='checklist'){assert(!error.hidden);assert(result.hidden);}
 if(config.type==='planner'){
   config.fields.forEach((f,i)=>set('field-'+i,'0'));submit();assert(!result.hidden);
   config.fields.forEach(f=>assert(output().includes(f.options[0].note)));
   config.fields.forEach((f,i)=>set('field-'+i,String(f.options.length-1)));assert(result.hidden);submit();
   config.fields.forEach(f=>assert(output().includes(f.options.at(-1).note)));
 }
 if(config.type==='checklist'){
   assert(!result.hidden);config.items.forEach(([,note])=>assert(output().includes(note)));
   form.querySelectorAll('input').forEach(el=>el.checked=true);submit();assert(output().includes('no certifica'));
   form.querySelector('input').checked=false;submit();assert(output().includes(config.items[0][1]));
 }
 if(config.type==='brief'){
   config.fields.forEach((f,i)=>set('field-'+i,'<img src=x onerror=alert(1)>'));submit();
   assert(!result.hidden);assert.equal(root.querySelector('[data-tool-output] img'),null);assert(output().includes('<img'));
   set('field-0','   ');assert(result.hidden);submit();assert(!error.hidden);
 }
 if(config.type==='costs'){
   set('area','60');for(let k=0;k<2;k++)for(let i=0;i<5;i++)set(`cost-${k}-${i}`,'0');
   set('cost-0-0','12000');set('cost-1-0','9000');submit();
   assert(output().includes('$12,000.00'));assert(output().includes('$200.00'));assert(output().includes('$3,000.00'));
   set('cost-0-0','0,10');set('cost-0-1','0.20');submit();assert(output().includes('$0.30'));
   for(const bad of ['','-1','Infinity','1e3','1,000.00','0.001']){set('cost-0-0',bad);submit();assert(!error.hidden);assert(result.hidden);}
   set('cost-0-0','10');set('area','0');submit();assert(result.hidden);
 }
 dom.window.close();
}
console.log('Ten blog tools passed: tailored results, pending checks, validation, totals, decimal precision, safe text and stale-result prevention.');
