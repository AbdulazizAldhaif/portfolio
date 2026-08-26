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

  /* ================================================================
     i18n — full EN/AR content. In Arabic mode the accent language
     flips to English (mirroring the design's bilingual identity).
     ================================================================ */
  const EMAIL = 'abdulaziz.aldhif@gmail.com';
  const WA_AR = {
    hiring: 'مرحبًا عبدالعزيز — اطلعت على معرض أعمالك وأود التحدث عن وظيفة محلل أعمال.',
    coop: 'مرحبًا عبدالعزيز — أود مناقشة فرصة تدريب تعاوني.',
    collab: 'مرحبًا عبدالعزيز — لدي فكرة تعاون.'
  };
  const MAIL_AR = {
    hiring: { s: 'فرصة محلل أعمال — عبر معرض أعمالك', b: 'مرحبًا عبدالعزيز،\r\n\r\nاطلعت على معرض أعمالك وأود مناقشة فرصة محلل أعمال معك.\r\n\r\nالشركة: \r\nالمسمى الوظيفي: \r\n\r\nمع التحية،' },
    coop: { s: 'فرصة تدريب تعاوني — عبر معرض أعمالك', b: 'مرحبًا عبدالعزيز،\r\n\r\nنود مناقشة فرصة تدريب تعاوني معك.\r\n\r\nالجهة: \r\nالبرنامج / الفترة: \r\n\r\nمع التحية،' },
    collab: { s: 'مقترح تعاون', b: 'مرحبًا عبدالعزيز،\r\n\r\nلدي فكرة تعاون أود مشاركتها معك.\r\n\r\nالفكرة في سطر واحد: \r\n\r\nمع التحية،' }
  };
  // Accessible names in Arabic mode (keyed by the English aria-label in the HTML)
  const ARIA_AR = {
    'Selected work': 'أعمال مختارة', 'Also built': 'أعمال أخرى', 'Contact': 'تواصل',
    'WhatsApp': 'واتساب', 'LinkedIn': 'لينكدإن', 'GitHub': 'جيت هب', 'Email': 'البريد الإلكتروني',
    'WhatsApp — hiring': 'واتساب — توظيف', 'Email — hiring': 'بريد — توظيف',
    'WhatsApp — coop / training': 'واتساب — تدريب تعاوني', 'Email — coop / training': 'بريد — تدريب تعاوني',
    'WhatsApp — collaboration': 'واتساب — تعاون', 'Email — collaboration': 'بريد — تعاون'
  };

  const CASES = [
    {
      title: { en: 'Eidaah', ar: 'إيضاح' }, tag: { en: 'إيضاح', ar: 'Eidaah' },
      kicker: { en: 'SELECTED WORK — 01', ar: 'أعمال مختارة — 01' },
      meta: { en: 'AI study platform for Arabic-speaking university students — built by a 3-person team.', ar: 'منصة مذاكرة بالذكاء الاصطناعي لطلاب الجامعات الناطقين بالعربية — طوّره فريق من 3 أفراد.' },
      problem: { en: 'Course material lives in scattered slides and videos, with no interactive way to study it in Arabic.', ar: 'المحتوى الدراسي مبعثر بين شرائح وفيديوهات، دون طريقة تفاعلية لمذاكرته بالعربية.' },
      did: { en: 'Designed the 13-table database schema and security policies, built login and content governance — students upload, admins approve — and redesigned the analyzer that turns any PDF or PPTX into a 7-stage guided study flow with auto-graded quizzes.', ar: 'صممت قاعدة البيانات بجداولها الثلاثة عشر وسياسات الأمان، وبنيت تسجيل الدخول وحوكمة المحتوى — الطلاب يرفعون والمشرفون يعتمدون — وأعدت تصميم المحلل الذي يحول أي ملف PDF أو PPTX إلى مسار مذاكرة موجه من 7 مراحل مع اختبارات مصححة تلقائيًا.' },
      quote: { en: 'Every file is processed by the LLM <span class="gold">once at approval</span> and stored, so AI cost stays flat no matter how many students study it.', ar: 'كل ملف تتم معالجته بالنموذج اللغوي <span class="gold">مرة واحدة عند الاعتماد</span> ثم يُخزَّن، فتبقى تكلفة الذكاء الاصطناعي ثابتة مهما زاد عدد الطلاب.' },
      stats: { en: ['API ENDPOINTS', 'SCREENS', 'DB TABLES', 'PASSING TESTS'], ar: ['نقطة API', 'شاشة', 'جدول قاعدة بيانات', 'اختبارًا ناجحًا'] }
    },
    {
      title: { en: "Sahifat Itma'inn", ar: 'صحيفة اطمئن' }, tag: { en: 'صحيفة اطمئن', ar: "Sahifat Itma'inn" },
      kicker: { en: 'SELECTED WORK — 02', ar: 'أعمال مختارة — 02' },
      meta: { en: 'Bilingual newspaper platform plus internal newsroom system — built solo.', ar: 'منصة صحيفة ثنائية اللغة مع نظام داخلي لغرفة الأخبار — بناء فردي.' },
      problem: { en: '34 volunteers coordinated through spreadsheets and chat; articles had no tracked path to publication.', ar: '34 متطوعًا ينسقون عبر جداول ومحادثات؛ والمقالات بلا مسار واضح حتى النشر.' },
      did: { en: 'Built everything: the public reading site — page-flip reader, offline mode, email-code accounts — and the internal system with role management, schedules, and a 5-stage editorial pipeline: writing, sharia review, proofreading, translation, design.', ar: 'بنيت كل شيء: موقع القراءة العام — قارئ بتقليب الصفحات، ووضع دون اتصال، وحسابات برمز البريد — والنظام الداخلي بإدارة الأدوار والجداول ومسار تحريري من 5 مراحل: كتابة، مراجعة شرعية، تدقيق، ترجمة، تصميم.' },
      quote: { en: 'Permissions resolve through <span class="gold">one SQL function</span> mirrored client-side, so unknown roles fail closed and can never escalate.', ar: 'الصلاحيات تُحسم عبر <span class="gold">دالة SQL واحدة</span> تنعكس في الواجهة، فأي دور غير معروف يُرفض تلقائيًا ولا يمكنه تصعيد صلاحياته.' },
      stats: { en: ['SCREENS × LANGS', 'DB TABLES', 'COMMITS', 'DEVELOPER'], ar: ['شاشة × لغتين', 'جدول قاعدة بيانات', 'إيداعًا', 'مطور'] }
    },
    {
      title: { en: 'Masari', ar: 'مساري' }, tag: { en: 'مساري', ar: 'Masari' },
      kicker: { en: 'SELECTED WORK — 03', ar: 'أعمال مختارة — 03' },
      meta: { en: 'Turns an IMSIU degree plan into an interactive term-by-term graduation roadmap — 2-person project; I owned logic and data quality.', ar: 'يحوّل الخطة الدراسية في جامعة الإمام إلى خارطة تخرج تفاعلية فصلًا بفصل — مشروع من شخصين؛ توليت المنطق وجودة البيانات.' },
      problem: { en: 'Students plan registration from static PDFs and guess at prerequisite chains; one wrong guess delays graduation.', ar: 'يخطط الطلاب لتسجيلهم اعتمادًا على ملفات PDF ثابتة ويخمنون سلاسل المتطلبات السابقة؛ تخمين واحد خاطئ يؤخر التخرج.' },
      did: { en: 'Extracted the scheduling logic into tested modules with a 49-test CI suite, built prerequisite overrides and fastest-graduation mode, and wrote a validator that cross-checks our data against official PDFs — it caught 4 errors in the university’s own documents.', ar: 'فصلت منطق الجدولة في وحدات مختبرة بحزمة CI من 49 اختبارًا، وبنيت خاصية تجاوز المتطلبات السابقة ووضع أسرع تخرج، وكتبت مدققًا يقارن بياناتنا بملفات PDF الرسمية — فاكتشف 4 أخطاء في وثائق الجامعة نفسها.' },
      quote: { en: '<span class="gold">Never trust the source data.</span>', ar: '<span class="gold">لا تثق ببيانات المصدر أبدًا.</span>' },
      stats: { en: ['DEGREE PLANS', 'TESTS', 'CLOSED ISSUES'], ar: ['خطط دراسية', 'اختبارًا', 'مشكلة مغلقة'] }
    }
  ];

  const T = {
    city: { en: 'الرياض', ar: 'RIYADH' },
    toggle: { en: 'عربي', ar: 'EN' },
    name1: { en: 'Abdulaziz', ar: 'عبدالعزيز' },
    name2: { en: 'Aldhaif', ar: 'الضيف' },
    ghost: { en: 'عبدالعزيز الضيف', ar: 'Abdulaziz Aldhaif' },
    lede: { en: 'I turn messy processes into <span class="gold shimmer">working systems</span>.', ar: 'أحوّل العمليات الفوضوية إلى <span class="gold shimmer">أنظمة تعمل</span>.' },
    meta1: { en: 'Final-year Information Systems @ IMSIU', ar: 'سنة أخيرة — نظم المعلومات في جامعة الإمام' },
    meta2: { en: 'Business Analyst track · Riyadh', ar: 'مسار محلل الأعمال · الرياض' },
    scroll: { en: 'SCROLL', ar: 'مرر' },
    caseTag: { en: 'دراسة حالة', ar: 'CASE STUDY' },
    problemK: { en: 'PROBLEM', ar: 'المشكلة' },
    didK: { en: 'WHAT I DID', ar: 'ما قمت به' },
    quoteK: { en: "DECISION I'D DEFEND", ar: 'قرار أدافع عنه' },
    alsoK: { en: 'ALSO BUILT', ar: 'أعمال أخرى' },
    alsoTag: { en: 'أعمال أخرى', ar: 'ALSO BUILT' },
    alula: { en: 'Full-stack PHP/MySQL tourism site with booking, reviews, and a bilingual chatbot.', ar: 'موقع سياحي متكامل بـ PHP/MySQL مع حجوزات وتقييمات وروبوت محادثة ثنائي اللغة.' },
    sar: { en: 'Responsive front end simulating the Saudi Railways portal, framework-free.', ar: 'واجهة أمامية متجاوبة تحاكي بوابة الخطوط الحديدية السعودية، بدون أطر عمل.' },
    athar: { en: 'Arabic-first e-commerce storefront for a Saudi oud & perfume brand: filterable catalogue, guest cart and checkout with shipping rules, order tracking by order number + phone, and customer reviews. Payments simulated by design (course project). Next.js, Tailwind, Supabase with row-level security.', ar: 'متجر إلكتروني يضع العربية أولًا لعلامة سعودية للعود والعطور: كتالوج قابل للتصفية، وسلة وإتمام شراء كضيف مع قواعد شحن، وتتبع الطلب برقم الطلب والجوال، وتقييمات العملاء. الدفع محاكاة مقصودة (مشروع مقرر دراسي). Next.js وTailwind وSupabase مع أمان على مستوى الصفوف.' },
    contactK: { en: 'CONTACT', ar: 'تواصل' },
    contactTag: { en: 'تواصل معي', ar: 'CONTACT' },
    talk: { en: 'Talk to me', ar: 'تحدث معي' },
    sub: { en: 'Fastest reply on WhatsApp — pick a lane.', ar: 'أسرع رد عبر واتساب — اختر مسارك.' },
    hiring: { en: 'HIRING', ar: 'توظيف' },
    coop: { en: 'COOP / TRAINING', ar: 'تدريب تعاوني' },
    collab: { en: 'COLLABORATION', ar: 'تعاون' }
  };

  let lang = 'en';
  try { lang = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en'; } catch (e) { /* private mode */ }

  function applyLang(next) {
    lang = next;
    doc.lang = next;
    doc.dir = next === 'ar' ? 'rtl' : 'ltr';
    doc.classList.toggle('ar', next === 'ar');
    try { localStorage.setItem('lang', next); } catch (e) { /* private mode */ }

    const setText = (sel, val) => $$(sel).forEach((el) => { el.textContent = val; });
    // Accent elements hold the *other* language: flip their lang/dir with the text
    const accent = (el) => { el.lang = next === 'ar' ? 'en' : 'ar'; el.dir = next === 'ar' ? 'ltr' : 'rtl'; };
    $$('.i18n-city').forEach((el) => { el.textContent = T.city[next]; accent(el); });
    const toggle = $('.lang-toggle');
    if (toggle) {
      toggle.textContent = T.toggle[next];
      toggle.lang = next === 'ar' ? 'en' : 'ar';
      toggle.setAttribute('aria-label', next === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    }
    $('.line-1').textContent = T.name1[next];
    $('.line-2').textContent = T.name2[next];
    const ghost = $('.hero-ghost');
    ghost.textContent = T.ghost[next];
    ghost.lang = next === 'ar' ? 'en' : 'ar';
    ghost.dir = next === 'ar' ? 'ltr' : 'rtl';
    $('.hero-lede').innerHTML = T.lede[next];
    const meta = $('.hero-meta');
    meta.innerHTML = T.meta1[next] + '<br>' + T.meta2[next];
    setText('.i18n-scroll', T.scroll[next]);

    $$('.case').forEach((caseEl, i) => {
      const c = CASES[i];
      $('.kicker', caseEl).textContent = c.kicker[next];
      const caseTag = $('.case-top .ar-tag', caseEl);
      caseTag.textContent = T.caseTag[next];
      accent(caseTag);
      $('.case-title h2', caseEl).textContent = c.title[next];
      const tagEl = $('.case-ar', caseEl);
      tagEl.textContent = c.tag[next];
      tagEl.lang = next === 'ar' ? 'en' : 'ar';
      tagEl.dir = next === 'ar' ? 'ltr' : 'rtl';
      $('.case-meta', caseEl).textContent = c.meta[next];
      const kickers = $$('.kicker.dim', caseEl);
      kickers[0].textContent = T.problemK[next];
      kickers[1].textContent = T.didK[next];
      $('.kicker.gold-dim', caseEl).textContent = T.quoteK[next];
      $('.problem', caseEl).textContent = c.problem[next];
      $('.did', caseEl).textContent = c.did[next];
      $('.quote p', caseEl).innerHTML = c.quote[next];
      $$('.stat-label', caseEl).forEach((el, j) => { el.textContent = c.stats[next][j]; });
    });

    const alsoSection = $('.also');
    $('.kicker.gold', alsoSection).textContent = T.alsoK[next];
    const alsoTag = $('.ar-tag', alsoSection);
    alsoTag.textContent = T.alsoTag[next];
    alsoTag.lang = next === 'ar' ? 'en' : 'ar';
    alsoTag.dir = next === 'ar' ? 'ltr' : 'rtl';
    const descs = $$('.card-desc');
    descs[0].textContent = T.alula[next];
    descs[1].textContent = T.sar[next];
    descs[2].textContent = T.athar[next];
    // Athar card mirrors the case-title concept: brand text and accent swap languages
    const atharTitle = $('.card-title', descs[2].parentElement);
    const atharAccent = $('.card-ar', atharTitle);
    const atharText = Array.from(atharTitle.childNodes).find((n) => n.nodeType === 3 && n.nodeValue.trim());
    if (atharText) atharText.nodeValue = next === 'ar' ? 'أثَر ' : 'Athar ';
    atharAccent.textContent = next === 'ar' ? 'Athar' : 'أثَر';
    accent(atharAccent);

    // Accessible names follow the page language
    $$('[aria-label]').forEach((el) => {
      if (el.classList.contains('lang-toggle')) return;
      if (!el.dataset.ariaEn) el.dataset.ariaEn = el.getAttribute('aria-label');
      const en = el.dataset.ariaEn;
      el.setAttribute('aria-label', next === 'ar' && ARIA_AR[en] ? ARIA_AR[en] : en);
    });

    const contact = $('.contact');
    $('.kicker.gold', contact).textContent = T.contactK[next];
    const cTag = $('.case-top .ar-tag', contact);
    cTag.textContent = T.contactTag[next];
    cTag.lang = next === 'ar' ? 'en' : 'ar';
    cTag.dir = next === 'ar' ? 'ltr' : 'rtl';
    $('.contact-title').textContent = T.talk[next];
    $('.contact-sub').textContent = T.sub[next];

    $$('.lane').forEach((laneEl) => {
      const intent = laneEl.getAttribute('data-intent');
      $('.lane-label', laneEl).textContent = T[intent === 'hiring' ? 'hiring' : intent === 'coop' ? 'coop' : 'collab'][next];
      const wa = $('.lane-wa', laneEl), mail = $('.lane-mail', laneEl);
      if (!wa.dataset.hrefEn) { wa.dataset.hrefEn = wa.href; mail.dataset.hrefEn = mail.getAttribute('href'); }
      if (next === 'ar') {
        wa.href = 'https://wa.me/966590920825?text=' + encodeURIComponent(WA_AR[intent]);
        mail.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(MAIL_AR[intent].s) + '&body=' + encodeURIComponent(MAIL_AR[intent].b);
      } else {
        wa.href = wa.dataset.hrefEn;
        mail.setAttribute('href', mail.dataset.hrefEn);
      }
    });
  }

  /* ================================================================
     Fallback path: reduced motion, or the GSAP CDN failed
     ================================================================ */
  function fallback() {
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const reveal = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal.unobserve(entry.target);
          entry.target.style.transitionDelay = parseInt(entry.target.getAttribute('data-reveal') || '0', 10) + 'ms';
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
  }

  const toggleBtn = $('.lang-toggle');
  if (lang === 'ar') applyLang('ar');

  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    fallback();
    if (toggleBtn) toggleBtn.addEventListener('click', () => applyLang(lang === 'ar' ? 'en' : 'ar'));
    return;
  }

  /* ================================================================
     Full cinematic path — GSAP + ScrollTrigger + Lenis
     ================================================================ */
  doc.classList.add('gsap');
  gsap.registerPlugin(ScrollTrigger);
  // No global overwrite: the hero exit scrub and the entrance timeline touch the
  // same properties, and an auto-overwrite would kill the entrance on early scroll.
  gsap.defaults({ ease: 'power2.out', duration: 0.6 });
  let skipTextFx = false; // set while force-completing the hero timeline

  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }

  gsap.to('.progress-fill', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: '.page', start: 'top top', end: 'bottom bottom', scrub: true }
  });

  /* ---------- Hero entrance ---------- */
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

  function runShimmer() {
    const host = $('.shimmer');
    if (!host || skipTextFx) return;
    let sheen = $('.sheen', host);
    if (!sheen) {
      sheen = document.createElement('i');
      sheen.className = 'sheen';
      sheen.setAttribute('aria-hidden', 'true');
      host.appendChild(sheen);
    }
    gsap.fromTo(sheen, { xPercent: -130 }, { xPercent: 130, duration: 1.1, ease: 'power2.inOut' });
  }
  heroTl.add(runShimmer, 1.55);

  // Typewriter on the first meta line
  const metaEl = $('.hero-meta');
  function runTypewriter() {
    if (skipTextFx) return;
    const parts = metaEl.innerHTML.split('<br>');
    if (parts.length !== 2) return;
    const line1 = parts[0].replace(/<[^>]*>/g, '');
    metaEl.innerHTML = '<span class="tw"></span><span class="caret" aria-hidden="true"></span><br><span class="tw2">' + parts[1] + '</span>';
    const twEl = $('.tw', metaEl), tw2El = $('.tw2', metaEl), caretEl = $('.caret', metaEl);
    gsap.set(tw2El, { autoAlpha: 0 });
    const typing = { i: 0 };
    const blink = gsap.to(caretEl, { autoAlpha: 0, duration: 0.45, repeat: -1, yoyo: true, ease: 'steps(1)' });
    gsap.to(typing, {
      i: line1.length, duration: 1.15, ease: 'none',
      onUpdate: () => { twEl.textContent = line1.slice(0, Math.round(typing.i)); },
      onComplete: () => {
        gsap.to(tw2El, { autoAlpha: 1, duration: 0.5 });
        gsap.delayedCall(1.2, () => { blink.kill(); gsap.to(caretEl, { autoAlpha: 0, duration: 0.3 }); });
      }
    });
  }
  heroTl.add(runTypewriter, 1.3);

  /* ---------- Hero ambience, exit scrub, mouse parallax ---------- */
  const beamTl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
  beamTl.to('.b1', { xPercent: 10, duration: 9 }, 0)
    .to('.b2', { xPercent: -9, duration: 11 }, 0)
    .to('.b3', { xPercent: 7, duration: 10 }, 0);
  ScrollTrigger.create({
    trigger: '.hero', start: 'top bottom', end: 'bottom top',
    onToggle: (s) => s.isActive ? beamTl.play() : beamTl.pause()
  });

  // Cinematic exit: the ghost swells past the camera while the name sinks.
  // Explicit from-values + no immediate render so it never captures the
  // entrance's hidden state as its starting point.
  const finishHero = () => {
    if (heroTl.progress() < 1) { skipTextFx = true; heroTl.progress(1); skipTextFx = false; }
  };
  gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 25%', scrub: true, onEnter: finishHero },
    defaults: { ease: 'none', immediateRender: false }
  })
    .fromTo('.hero-ghost', { yPercent: 0, scale: 1, autoAlpha: 1 }, { yPercent: 30, scale: 1.22, autoAlpha: 0.25 }, 0)
    .fromTo('.hero-name', { yPercent: 0 }, { yPercent: -12 }, 0)
    .fromTo(['.hero-lede', '.hero-meta', '.hero-scroll'], { yPercent: 0, autoAlpha: 1 }, { yPercent: -18, autoAlpha: 0.35 }, 0)
    .fromTo('.hero-fx', { autoAlpha: 1 }, { autoAlpha: 0.25 }, 0);

  if (finePointer) {
    const gx = gsap.quickTo('.hero-ghost', 'x', { duration: 0.6, ease: 'power3.out' });
    const gy = gsap.quickTo('.hero-ghost', 'y', { duration: 0.6, ease: 'power3.out' });
    const fx = gsap.quickTo('.hero-fx', 'x', { duration: 0.9, ease: 'power3.out' });
    $('.hero').addEventListener('mousemove', (ev) => {
      const r = document.documentElement;
      const nx = (ev.clientX / r.clientWidth) - 0.5;
      const ny = (ev.clientY / r.clientHeight) - 0.5;
      gx(nx * -18); gy(ny * -10); fx(nx * 12);
    });
  }

  /* ---------- Case studies ---------- */
  const didTriggers = [];

  function splitTitle(h2) {
    // Latin only — Arabic ligatures must never be split per character.
    const text = h2.textContent;
    h2.textContent = '';
    h2.style.overflow = 'hidden';
    const frag = document.createDocumentFragment();
    for (const ch of text) {
      const s = document.createElement('span');
      s.className = 'ch';
      s.style.display = 'inline-block';
      s.style.whiteSpace = 'pre';
      s.textContent = ch;
      frag.appendChild(s);
    }
    h2.appendChild(frag);
    return $$('.ch', h2);
  }

  function buildDidScrub() {
    didTriggers.forEach((t) => t.kill());
    didTriggers.length = 0;
    $$('.case .did').forEach((p) => {
      const words = p.textContent.trim().split(/\s+/);
      p.innerHTML = words.map((w) => '<span class="w">' + w + '</span>').join(' ');
      const tween = gsap.fromTo($$('.w', p), { opacity: 0.32 }, {
        opacity: 1, stagger: 0.04, ease: 'none',
        scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 52%', scrub: true }
      });
      didTriggers.push(tween.scrollTrigger);
      didTriggers.push(tween);
    });
  }

  // Internal choreography is language-dependent (Latin titles split per character,
  // accents enter from the reading side), so it is built by a function that the
  // language toggle can re-run for cases that have not been revealed yet.
  const caseState = [];
  function buildCaseInternals(caseEl) {
    const top = $('.case-top', caseEl), titleRow = $('.case-title', caseEl),
      title = $('.case-title h2', caseEl), logo = $('.case-logo', caseEl),
      ar = $('.case-ar', caseEl), caseMeta = $('.case-meta', caseEl),
      blocks = $$('.block', caseEl), quote = $('.quote', caseEl),
      stats = $('.stats', caseEl), cells = $$('.stat', caseEl),
      stack = $('.stack', caseEl), cta = $('.cta', caseEl);

    let rule = $('.q-rule', quote);
    if (!rule) {
      rule = document.createElement('span');
      rule.className = 'q-rule';
      rule.setAttribute('aria-hidden', 'true');
      quote.prepend(rule);
    }

    gsap.set([top, caseMeta, ...blocks, quote, stack, cta], { autoAlpha: 0, y: 22 });
    gsap.set(titleRow, { autoAlpha: 1, y: 0 });
    gsap.set(logo, { autoAlpha: 0, scale: 0.7 });
    gsap.set(ar, { autoAlpha: 0, x: lang === 'ar' ? -26 : 26 });
    gsap.set(stats, { autoAlpha: 0, y: 14 });
    gsap.set(cells, { autoAlpha: 0, y: 14, scale: 0.97 });
    gsap.set(rule, { scaleX: 0, transformOrigin: lang === 'ar' ? '100% 50%' : '0% 50%' });

    let titleTargets, titleVars;
    if (lang === 'en') {
      titleTargets = splitTitle(title);
      gsap.set(titleTargets, { yPercent: 110 });
      titleVars = { yPercent: 0, duration: 0.7, stagger: 0.035, ease: 'power4.out' };
    } else {
      titleTargets = title;
      gsap.set(title, { autoAlpha: 0, y: 30 });
      titleVars = { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power4.out' };
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.55 },
      scrollTrigger: { trigger: caseEl, start: 'top 72%' }
    });
    tl.to(top, { autoAlpha: 1, y: 0 }, 0)
      .to(logo, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' }, 0.05)
      .to(titleTargets, titleVars, 0.08)
      .to(ar, { autoAlpha: 1, x: 0, duration: 0.7 }, 0.24)
      .to(caseMeta, { autoAlpha: 1, y: 0 }, 0.3)
      .to(blocks, { autoAlpha: 1, y: 0, stagger: 0.14 }, 0.38)
      .to(quote, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.58)
      .to(rule, { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, 0.62)
      .to(stats, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.72)
      .to(cells, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08 }, 0.77)
      .to([stack, cta], { autoAlpha: 1, y: 0, stagger: 0.1 }, 0.92);
    return tl;
  }

  /* Everything below the fold is built in idle time, in three short tasks, so
     startup never blocks the main thread while the hero is painting. The CSS
     pre-hides these sections, so deferring their setup is invisible. */
  function initBelowFold() {
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

  $$('.case').forEach((caseEl) => {
    gsap.set(caseEl, { transformOrigin: '50% 30%' });

    // Dolly in/out — pseudo-depth, pure 2D compositing
    gsap.fromTo(caseEl, { scale: 0.93, y: 70, autoAlpha: 0.12 }, {
      scale: 1, y: 0, autoAlpha: 1, ease: 'none', overwrite: false,
      scrollTrigger: { trigger: caseEl, start: 'top 96%', end: 'top 45%', scrub: true }
    });
    gsap.fromTo(caseEl, { scale: 1, y: 0, autoAlpha: 1 }, {
      scale: 1.03, y: -44, autoAlpha: 0.3, ease: 'none', immediateRender: false, overwrite: false,
      scrollTrigger: { trigger: caseEl, start: 'bottom 40%', end: 'bottom 4%', scrub: true }
    });

    // Giant numeral: parallax drift + fade-in
    const num = $('.case-num', caseEl);
    gsap.fromTo(num, { yPercent: 26, autoAlpha: 0 }, {
      yPercent: -20, autoAlpha: 1, ease: 'none',
      scrollTrigger: { trigger: caseEl, start: 'top 90%', end: 'bottom top', scrub: true }
    });

    caseState.push({ el: caseEl, tl: buildCaseInternals(caseEl) });

    gsap.to($('.case-top .ar-tag', caseEl), {
      yPercent: 60, ease: 'none',
      scrollTrigger: { trigger: caseEl, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  buildDidScrub();

  /* ---------- Counters ---------- */
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

  /* ---------- Reveals outside the cases ---------- */
  const rest = $$('[data-reveal]').filter((el) => !el.closest('.case'));
  gsap.set(rest, { autoAlpha: 0, y: 20 });
  ScrollTrigger.batch(rest, {
    start: 'top 88%', once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.09, duration: 0.6, ease: 'power3.out' })
  });

  }

  function initBandAndHint() {
  /* ---------- Marquee: fill the full bar, loop seamlessly, react to velocity ---------- */
  const track = $('.marquee-track');
  let marqueeLoop = null;
  if (track) {
    const groupHTML = track.innerHTML;
    const build = () => {
      if (marqueeLoop) marqueeLoop.kill();
      track.innerHTML = groupHTML;
      gsap.set(track, { x: 0 });
      const gw = track.scrollWidth;
      const copies = Math.max(2, Math.ceil((window.innerWidth * 2) / gw));
      track.innerHTML = groupHTML.repeat(copies);
      const shift = gw; // one group width = one seamless cycle
      marqueeLoop = gsap.to(track, {
        x: -shift, ease: 'none', repeat: -1, duration: Math.max(8, shift / 55),
        modifiers: { x: (x) => (parseFloat(x) % shift) + 'px' }
      });
    };
    build();
    let bandActive = false, lastW = window.innerWidth, rw = null;
    // Only rebuild on real width changes — mobile URL-bar show/hide fires resize too
    window.addEventListener('resize', () => {
      clearTimeout(rw);
      rw = setTimeout(() => {
        if (window.innerWidth === lastW) return;
        lastW = window.innerWidth;
        const p = marqueeLoop ? marqueeLoop.progress() : 0;
        build();
        marqueeLoop.progress(p);
        if (!bandActive) marqueeLoop.pause();
      }, 250);
    });
    ScrollTrigger.create({
      trigger: '.marquee-band', start: 'top bottom', end: 'bottom top',
      onToggle: (s) => { bandActive = s.isActive; if (marqueeLoop) s.isActive ? marqueeLoop.play() : marqueeLoop.pause(); }
    });
    // Scroll velocity nudges the belt
    if (lenis) {
      lenis.on('scroll', (e) => {
        if (!marqueeLoop) return;
        const boost = 1 + Math.min(3, Math.abs(e.velocity || 0) * 0.06);
        gsap.to(marqueeLoop, { timeScale: boost, duration: 0.2, overwrite: 'auto' });
      });
    }
  }

  /* ---------- First-visit scroll gesture hint ---------- */
  const hint = $('.scroll-hint');
  let hintSeen = false;
  try { hintSeen = localStorage.getItem('hintSeen') === '1'; } catch (e) { /* private mode */ }
  if (hint && !hintSeen) {
    hint.classList.add(window.matchMedia('(pointer: coarse)').matches ? 'hand' : 'mouse');
    const dot = $('.hint-dot', hint);
    const hand = $('.hint-hand', hint);
    const hintLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.5, paused: true });
    if (hint.classList.contains('mouse') && dot) {
      hintLoop.fromTo(dot, { y: 0, opacity: 1 }, { y: 14, opacity: 0, duration: 0.9, ease: 'power2.in' });
    } else if (hand) {
      hintLoop.fromTo(hand, { y: 8, opacity: 0.4 }, { y: -8, opacity: 1, duration: 0.7, ease: 'power2.out' })
        .to(hand, { opacity: 0.4, duration: 0.4 }, '+=0.15');
    }
    const show = gsap.delayedCall(3.2, () => { gsap.to(hint, { autoAlpha: 1, duration: 0.5 }); hintLoop.play(); });
    const dismiss = () => {
      show.kill();
      hintLoop.kill();
      gsap.to(hint, { autoAlpha: 0, duration: 0.3, onComplete: () => hint.remove() });
      try { localStorage.setItem('hintSeen', '1'); } catch (e) { /* private mode */ }
      window.removeEventListener('scroll', dismiss);
      if (lenis) lenis.off('scroll', dismiss);
    };
    window.addEventListener('scroll', dismiss, { once: true, passive: true });
    if (lenis) lenis.on('scroll', dismiss);
  }

  }

  function initPointerFx() {
  /* ---------- Magnetics, attract particles, card texture ---------- */
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

    $$('.lane').forEach((laneEl) => {
      const pts = [];
      for (let i = 0; i < 7; i++) {
        const pt = document.createElement('span');
        pt.className = 'pt';
        pt.setAttribute('aria-hidden', 'true');
        laneEl.appendChild(pt);
        const angle = (i / 7) * Math.PI * 2 + 0.4;
        const home = { x: Math.cos(angle) * (70 + (i % 3) * 26), y: Math.sin(angle) * (34 + (i % 2) * 14) };
        gsap.set(pt, { x: home.x, y: home.y });
        pts.push({ el: pt, home });
      }
      laneEl.addEventListener('mouseenter', () => {
        pts.forEach((p, i) => gsap.to(p.el, { x: p.home.x * 0.22, y: p.home.y * 0.22, autoAlpha: 0.9, duration: 0.25, ease: 'power2.out', delay: i * 0.015, overwrite: 'auto' }));
      });
      laneEl.addEventListener('mouseleave', () => {
        pts.forEach((p) => gsap.to(p.el, { x: p.home.x, y: p.home.y, autoAlpha: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto' }));
      });
    });

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

  }

  const idle = (fn) => ('requestIdleCallback' in window) ? requestIdleCallback(fn, { timeout: 900 }) : setTimeout(fn, 80);
  idle(() => {
    initBelowFold();
    ScrollTrigger.refresh();
    idle(() => { initBandAndHint(); idle(initPointerFx); });
  });

  /* ---------- Language toggle (full GSAP path) ---------- */
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      finishHero(); // complete any running entrance before swapping text
      const next = lang === 'ar' ? 'en' : 'ar';
      applyLang(next);
      caseState.forEach((s) => {
        const st = s.tl.scrollTrigger;
        const revealed = s.tl.progress() > 0 || (st && st.isActive);
        if (revealed) {
          // Already on screen: the new text simply stays visible
          gsap.set($('.case-title h2', s.el), { clearProps: 'all' });
        } else {
          // Not yet revealed: rebuild the entrance in the new language/direction
          if (st) st.kill();
          s.tl.kill();
          s.tl = buildCaseInternals(s.el);
        }
      });
      buildDidScrub();
      ScrollTrigger.refresh();
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
