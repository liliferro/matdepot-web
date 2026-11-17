'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync('assets/motion.js','utf8');
function environment({reduce=false,saveData=false,supported=true,mobile=true}={}) {
 const listeners={},mediaListeners={},observed=new Set(),animations=[],queued=new Map();
 let next=0,observer;
 const make=(top,visible=true)=>({top,visible,focused:false,getClientRects(){return this.visible?[{}]:[];},getBoundingClientRect(){return {top:this.top};},contains(target){return target===this;},animate(frames,options){const a={frames,options,cancelled:false,cancel(){this.cancelled=true;this.oncancel?.();}};animations.push(a);return a;}});
 const first=make(100),later=make(1200),hidden=make(1500,false),count=make(200);
 const nodes=[first,later,hidden];
 const reduced={matches:reduce,addEventListener(_,fn){mediaListeners.change=fn;}};
 const document={hidden:false,readyState:'complete',activeElement:null,
 querySelectorAll(){return nodes;},getElementById(){return count;},
 addEventListener(event,fn){(listeners[event]??=[]).push(fn);}};
 const window={innerHeight:800,matchMedia(q){return q.includes('reduced')?reduced:{matches:mobile};}};
 function IO(callback){observer=this;this.callback=callback;this.observe=e=>observed.add(e);this.unobserve=e=>observed.delete(e);this.disconnect=()=>observed.clear();}
 if(supported)window.IntersectionObserver=IO;
 vm.runInNewContext(source,{window,document,navigator:{connection:{saveData}},Element:{prototype:{animate(){}}},
 IntersectionObserver:IO,requestAnimationFrame(fn){const id=++next;queued.set(id,fn);return id;},cancelAnimationFrame(id){queued.delete(id);},Map,WeakSet});
 return {first,later,hidden,nodes,document,reduced,observed,animations,
 intersect(e){observer.callback([{target:e,isIntersecting:true}]);},
 emit(event){for(const fn of listeners[event]||[])fn({target:document.activeElement});},
 flush(){for(const [id,fn]of queued){queued.delete(id);fn();}},
 preference(matches){reduced.matches=matches;mediaListeners.change?.();}};
}
let e=environment();
assert(!e.observed.has(e.first),'first viewport must remain immediate');
assert(e.observed.has(e.later),'below-fold content observed');
assert(!e.observed.has(e.hidden),'hidden filtered cards excluded');
e.intersect(e.later);assert.equal(e.animations.length,1);assert.equal(e.animations[0].options.duration,220);
assert.equal(e.animations[0].frames[0].transform,'translateY(6px)');
assert.equal(e.animations[0].options.fill,undefined,'no persistent hidden or transformed state');
e.intersect(e.later);assert.equal(e.animations.length,1,'once per element');
e.hidden.visible=true;e.emit('md:catalog-visible');e.flush();assert(e.observed.has(e.hidden),'show-more cards registered');
e.intersect(e.hidden);e.document.activeElement=e.hidden;e.emit('focusin');assert(e.animations[1].cancelled,'keyboard focus cancels active movement');
e.emit('md:catalog-filter');assert.equal(e.animations.at(-1).options.duration,160);
e.preference(true);assert.equal(e.observed.size,0);assert(e.animations.every(a=>a.cancelled));
e.emit('md:catalog-filter');assert.equal(e.animations.length,3,'reduced motion blocks feedback');
e=environment({reduce:true});assert.equal(e.observed.size,0);e.preference(false);e.flush();assert(e.observed.has(e.later));
e=environment({saveData:true});assert.equal(e.observed.size,0);assert.equal(e.animations.length,0);
e=environment({supported:false});assert.equal(e.observed.size,0);
e=environment({mobile:false});e.intersect(e.later);assert.equal(e.animations[0].options.duration,320);
e.document.hidden=true;e.emit('visibilitychange');assert(e.animations[0].cancelled);
e=environment();e.document.activeElement=e.later;e.intersect(e.later);assert.equal(e.animations.length,0);
console.log('Motion checks passed: initial viewport, one-time entry, mobile duration, hidden/filter cards, focus, reduced motion, preference changes, save-data, fallback and background cleanup.');
