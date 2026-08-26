(() => {
  'use strict';

  const doc = document.documentElement;
  // The .js class arms the [data-reveal] hiding CSS; it must be added by the same
  // script that reveals, so a failed load can never strand content hidden.
  doc.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- Fallback path: reduced motion, or GSAP CDN failed ---------- */
  function fallback() {
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const reveal = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal.unobserve(entry.target);
          const delay = parseInt(entry.target.getAttribute('data-reveal') || '0', 10);
          entry.target.style.transitionDelay = delay + 'ms';
          entry.target.classList.add('is-in');
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      $$('[data-reveal]').forEach((el) => reveal.observe(el));

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
      $$('[data-count]').forEach((el) => counters.observe(el));
    } else {
      $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    }
    if (!reduceMotion && finePointer) {
      $$('[data-magnet]').forEach((btn) => {
        btn.addEventListener('mousemove', (ev) => {
          const r = btn.getBoundingClientRect();
          btn.style.transition = '';
          btn.style.transform = 'translate(' + ((ev.clientX - (r.left + r.width / 2)) * 0.12) + 'px,' + ((ev.clientY - (r.top + r.height / 2)) * 0.2) + 'px)';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transition = 'transform .4s cubic-bezier(.2,.7,.2,1)';
          btn.style.transform = 'translate(0,0)';
        });
      });
    }
  }

  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    fallback();
    return;
  }

  /* ================================================================
     Full cinematic path — GSAP + ScrollTrigger + Lenis
     ================================================================ */
  doc.classList.add('gsap');
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power2.out', duration: 0.6, overwrite: 'auto' });

  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }

  /* ---------- Scroll progress bar ---------- */
  gsap.to('.progress-fill', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: '.page', start: 'top top', end: 'bottom bottom', scrub: true }
  });

  /* ---------- Hero entrance timeline ---------- */
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  gsap.set('.line', { yPercent: 110 });
  gsap.set('.hero-ghost', { autoAlpha: 0, y: -34, scale: 1.05 });
  gsap.set(['.hero-lede', '.hero-meta', '.hero-scroll'], { autoAlpha: 0, y: 18 });
  gsap.set('.hero-top', { autoAlpha: 0, y: -12 });
  gsap.set('.hero-fx .beam', { autoAlpha: 0 });

  heroTl
    .to('.line-1', { yPercent: 0, duration: 0.9 }, 0.15)
    .to('.hero-ghost', { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }, 0.38)
    .to('.line-2', { yPercent: 0, duration: 0.9 }, 0.46)
    .to('.hero-fx .beam', { autoAlpha: 0.55, duration: 1.8, stagger: 0.22, ease: 'power1.out' }, 0.8)
    .to('.hero-lede', { autoAlpha: 1, y: 0, duration: 0.7 }, 1.0)
    .to('.hero-meta', { autoAlpha: 1, y: 0, duration: 0.6 }, 1.25)
    .to(['.hero-scroll', '.hero-top'], { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 }, 1.4);

  // Gold shimmer sweep across "working systems" — once, after the lede lands
  const shimmerHost = $('.shimmer');
  if (shimmerHost) {
    const sheen = document.createElement('i');
    sheen.className = 'sheen';
    sheen.setAttribute('aria-hidden', 'true');
    shimmerHost.appendChild(sheen);
    heroTl.fromTo(sheen, { xPercent: -130 }, { xPercent: 130, duration: 1.1, ease: 'power2.inOut' }, 1.55);
  }

  // Typewriter on the first mono meta line
  const meta = $('.hero-meta');
  if (meta && meta.innerHTML.includes('<br>')) {
    const parts = meta.innerHTML.split('<br>');
    const line1 = parts[0].replace(/<[^>]*>/g, '');
    meta.innerHTML = '<span class="tw"></span><span class="caret" aria-hidden="true"></span><br><span class="tw2">' + parts[1] + '</span>';
    const twEl = $('.tw', meta), tw2El = $('.tw2', meta), caretEl = $('.caret', meta);
    gsap.set(tw2El, { autoAlpha: 0 });
    const typing = { i: 0 };
    const caretBlink = gsap.to(caretEl, { autoAlpha: 0, duration: 0.45, repeat: -1, yoyo: true, ease: 'steps(1)', paused: true });
    heroTl.to(typing, {
      i: line1.length, duration: 1.15, ease: 'none',
      onStart: () => caretBlink.play(),
      onUpdate: () => { twEl.textContent = line1.slice(0, Math.round(typing.i)); }
    }, 1.3)
      .to(tw2El, { autoAlpha: 1, duration: 0.5 }, '>-0.1')
      .add(() => { caretBlink.kill(); gsap.to(caretEl, { autoAlpha: 0, duration: 0.3 }); }, '+=1.2');
  }

  /* ---------- Hero ambient + parallax ---------- */
  const beamTl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
  beamTl.to('.b1', { xPercent: 10, duration: 9 }, 0)
    .to('.b2', { xPercent: -9, duration: 11 }, 0)
    .to('.b3', { xPercent: 7, duration: 10 }, 0);
  ScrollTrigger.create({
    trigger: '.hero', start: 'top bottom', end: 'bottom top',
    onToggle: (s) => s.isActive ? beamTl.play() : beamTl.pause()
  });

  gsap.to('.hero-ghost', {
    yPercent: 26, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-stage', {
    yPercent: -5, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* ---------- 3D room: grid floor fades in through the case studies ---------- */
  const floor = $('.room-floor');
  if (floor) {
    ScrollTrigger.create({
      trigger: '.cases', start: 'top 65%', end: 'bottom 25%',
      onToggle: (s) => gsap.to(floor, { autoAlpha: s.isActive ? 1 : 0, duration: 0.6, overwrite: 'auto' })
    });
    gsap.fromTo('.room-grid', { y: 40 }, {
      y: -60, ease: 'none',
      scrollTrigger: { trigger: '.cases', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- Case studies: 3D screen flights + internal choreography ---------- */
  $$('.case').forEach((caseEl) => {
    gsap.set(caseEl, { transformOrigin: '50% 30%' });

    // Dolly in: rises from the depth of the room as you approach
    // (pseudo-depth scale/translate — pure 2D compositing, no 3D layers)
    gsap.fromTo(caseEl,
      { scale: 0.93, y: 70, autoAlpha: 0.12 },
      {
        scale: 1, y: 0, autoAlpha: 1, ease: 'none', overwrite: false,
        scrollTrigger: { trigger: caseEl, start: 'top 96%', end: 'top 45%', scrub: true }
      });

    // Dolly out: slides past the camera as you leave (range is disjoint from dolly-in)
    gsap.fromTo(caseEl,
      { scale: 1, y: 0, autoAlpha: 1 },
      {
        scale: 1.03, y: -44, autoAlpha: 0.3, ease: 'none', immediateRender: false, overwrite: false,
        scrollTrigger: { trigger: caseEl, start: 'bottom 40%', end: 'bottom 4%', scrub: true }
      });

    // Internal stagger: kicker → title → Arabic → meta → blocks → quote → stats → stack → CTA
    const top = $('.case-top', caseEl), title = $('.case-title h2', caseEl),
      ar = $('.case-ar', caseEl), titleRow = $('.case-title', caseEl),
      caseMeta = $('.case-meta', caseEl), blocks = $$('.block', caseEl),
      quote = $('.quote', caseEl), stats = $('.stats', caseEl),
      cells = $$('.stat', caseEl), stack = $('.stack', caseEl), cta = $('.cta', caseEl);

    gsap.set([top, caseMeta, ...blocks, quote, stack, cta], { autoAlpha: 0, y: 22 });
    gsap.set(titleRow, { autoAlpha: 1, y: 0 });
    gsap.set(title, { autoAlpha: 0, y: 36 });
    gsap.set(ar, { autoAlpha: 0, x: 26 });
    gsap.set(stats, { autoAlpha: 0, y: 14 });
    gsap.set(cells, { autoAlpha: 0, y: 14, scale: 0.97 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.55 },
      scrollTrigger: { trigger: caseEl, start: 'top 72%' }
    });
    tl.to(top, { autoAlpha: 1, y: 0 }, 0)
      .to(title, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.08)
      .to(ar, { autoAlpha: 1, x: 0, duration: 0.7 }, 0.18)
      .to(caseMeta, { autoAlpha: 1, y: 0 }, 0.26)
      .to(blocks, { autoAlpha: 1, y: 0, stagger: 0.14 }, 0.34)
      .to(quote, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.55)
      .to(stats, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.7)
      .to(cells, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08 }, 0.75)
      .to([stack, cta], { autoAlpha: 1, y: 0, stagger: 0.1 }, 0.9);

    // Parallax accent: the Arabic case tag drifts slower than the content
    gsap.to($('.case-top .ar-tag', caseEl), {
      yPercent: 60, ease: 'none',
      scrollTrigger: { trigger: caseEl, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ---------- "WHAT I DID" — scroll-scrubbed word highlight ---------- */
  $$('.case .did').forEach((p) => {
    const words = p.textContent.trim().split(/\s+/);
    p.innerHTML = words.map((w) => '<span class="w">' + w + '</span>').join(' ');
    gsap.fromTo($$('.w', p), { opacity: 0.32 }, {
      opacity: 1, stagger: 0.04, ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 52%', scrub: true }
    });
  });

  /* ---------- Stat counters (GSAP-driven, once) ---------- */
  $$('[data-count]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.2, ease: 'power2.out',
          onUpdate: () => { el.textContent = String(Math.round(obj.v)); }
        });
      }
    });
  });

  /* ---------- Sections outside the case studies ---------- */
  const rest = $$('[data-reveal]').filter((el) => !el.closest('.case'));
  gsap.set(rest, { autoAlpha: 0, y: 20 });
  ScrollTrigger.batch(rest, {
    start: 'top 88%', once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.09, duration: 0.6, ease: 'power3.out' })
  });

  /* ---------- Marquee band ---------- */
  const track = $('.marquee-track');
  if (track) {
    const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 24, repeat: -1 });
    ScrollTrigger.create({
      trigger: '.marquee-band', start: 'top bottom', end: 'bottom top',
      onToggle: (s) => s.isActive ? loop.play() : loop.pause()
    });
  }

  /* ---------- Magnetic buttons (quickTo — smoother than the old inline version) ---------- */
  if (finePointer) {
    $$('[data-magnet]').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });
      btn.addEventListener('mousemove', (ev) => {
        const r = btn.getBoundingClientRect();
        xTo((ev.clientX - (r.left + r.width / 2)) * 0.16);
        yTo((ev.clientY - (r.top + r.height / 2)) * 0.22);
      });
      btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });

    /* Attract particles: gold dots pulled toward the lane on hover */
    $$('.lane').forEach((lane) => {
      const pts = [];
      for (let i = 0; i < 7; i++) {
        const pt = document.createElement('span');
        pt.className = 'pt';
        pt.setAttribute('aria-hidden', 'true');
        lane.appendChild(pt);
        const angle = (i / 7) * Math.PI * 2 + 0.4;
        const home = { x: Math.cos(angle) * (70 + (i % 3) * 26), y: Math.sin(angle) * (34 + (i % 2) * 14) };
        gsap.set(pt, { x: home.x, y: home.y });
        pts.push({ el: pt, home });
      }
      lane.addEventListener('mouseenter', () => {
        pts.forEach((p, i) => gsap.to(p.el, {
          x: p.home.x * 0.22, y: p.home.y * 0.22, autoAlpha: 0.9,
          duration: 0.25, ease: 'power2.out', delay: i * 0.015, overwrite: 'auto'
        }));
      });
      lane.addEventListener('mouseleave', () => {
        pts.forEach((p) => gsap.to(p.el, {
          x: p.home.x, y: p.home.y, autoAlpha: 0,
          duration: 0.25, ease: 'power2.out', overwrite: 'auto'
        }));
      });
    });

    /* Also-built cards: cursor-reactive texture glow (Mouse Effect Card) */
    $$('.card').forEach((card) => {
      const fx = document.createElement('span');
      fx.className = 'card-fx';
      fx.setAttribute('aria-hidden', 'true');
      card.prepend(fx);
      const xTo = gsap.quickTo(fx, 'x', { duration: 0.2, ease: 'power2.out' });
      const yTo = gsap.quickTo(fx, 'y', { duration: 0.2, ease: 'power2.out' });
      card.addEventListener('pointermove', (ev) => {
        const r = card.getBoundingClientRect();
        xTo(ev.clientX - r.left - 110);
        yTo(ev.clientY - r.top - 110);
      });
      card.addEventListener('pointerenter', () => gsap.to(fx, { autoAlpha: 1, duration: 0.2, ease: 'power2.out' }));
      card.addEventListener('pointerleave', () => gsap.to(fx, { autoAlpha: 0, duration: 0.2, ease: 'power2.out' }));
    });
  }

  /* Recalculate positions once images/fonts have settled */
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
