/* Mat Depot: progressive motion. Content stays visible without JS or animation support. */
(function () {
  'use strict';
  if (!window.matchMedia || !('IntersectionObserver' in window) ||
      !Element.prototype.animate || navigator.connection?.saveData) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 640px)');
  const seen = new WeakSet();
  const running = new Map();
  const targets = 'main h2, .pillar, .sector, .info-block, .cat-grid > .cat-card, .related > .cat-card, .catalog-card-wrap, .blog-card';
  let observer;
  let frame = 0;

  function finish(element) {
    const animation = running.get(element);
    if (animation) { running.delete(element); animation.cancel(); }
  }
  function reveal(element, feedback = false) {
    if (reduced.matches || document.hidden || element.contains(document.activeElement)) return;
    finish(element);
    const distance = compact.matches ? 6 : 10;
    const frames = feedback
      ? [{ opacity: .65 }, { opacity: 1 }]
      : [{ opacity: .65, transform: 'translateY(' + distance + 'px)' },
         { opacity: 1, transform: 'translateY(0)' }];
    const animation = element.animate(frames, {
      duration: feedback ? 160 : compact.matches ? 220 : 320,
      easing: 'cubic-bezier(.2,.7,.2,1)'
    });
    running.set(element, animation);
    animation.onfinish = () => { if (running.get(element) === animation) running.delete(element); };
    animation.oncancel = () => { if (running.get(element) === animation) running.delete(element); };
  }
  function scan() {
    if (reduced.matches) return;
    if (!observer) observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        observer.unobserve(element);
        if (seen.has(element)) return;
        seen.add(element);
        reveal(element);
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll(targets).forEach(element => {
      if (seen.has(element) || !element.getClientRects().length) return;
      const rect = element.getBoundingClientRect();
      // Never animate the first viewport, the hero or content already above it.
      if (rect.top < window.innerHeight) { seen.add(element); observer.unobserve(element); }
      else observer.observe(element);
    });
  }
  function refresh() {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; scan(); });
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      observer?.disconnect();
      observer = null;
      running.forEach(animation => animation.cancel());
      running.clear();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    } else refresh();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { running.forEach(animation => animation.cancel()); running.clear(); }
  });
  document.addEventListener('focusin', event => {
    running.forEach((animation, element) => { if (element.contains(event.target)) finish(element); });
  });
  document.addEventListener('md:catalog-visible', refresh);
  document.addEventListener('md:catalog-filter', () => {
    refresh();
    const count = document.getElementById('result-count');
    if (count) reveal(count, true);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan, { once: true });
  else scan();
})();
