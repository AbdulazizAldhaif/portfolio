(() => {
  'use strict';

  // The .js class arms the [data-reveal] hiding CSS; it must be added by the same
  // script that reveals, so a failed load can never strand content hidden.
  document.documentElement.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = 'cubic-bezier(.2,.7,.2,1)';

  if (!reduceMotion && 'IntersectionObserver' in window) {
    // Scroll reveal — .js [data-reveal] starts hidden in CSS; delay comes from the attribute.
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal.unobserve(entry.target);
        const delay = parseInt(entry.target.getAttribute('data-reveal') || '0', 10);
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('is-in');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el));

    // Stat count-up
    const counters = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counters.unobserve(entry.target);
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const t0 = performance.now(), dur = 1100;
        const step = (t) => {
          const p = Math.min(1, (t - t0) / dur), k = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(target * k));
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = '0';
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-count]').forEach((el) => counters.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  }

  // Magnetic buttons — pointer devices only
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-magnet]').forEach((btn) => {
      btn.addEventListener('mousemove', (ev) => {
        const r = btn.getBoundingClientRect();
        const dx = ev.clientX - (r.left + r.width / 2);
        const dy = ev.clientY - (r.top + r.height / 2);
        btn.style.transition = '';
        btn.style.transform = 'translate(' + (dx * 0.12) + 'px,' + (dy * 0.2) + 'px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform .4s ' + ease;
        btn.style.transform = 'translate(0,0)';
      });
    });
  }
})();
