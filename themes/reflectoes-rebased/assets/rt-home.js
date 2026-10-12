/* ReflecToes homepage: day/night toggle, pointer light, scroll reveal. No dependencies. */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  var items = document.querySelectorAll('[data-reveal]');
  if (items.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add('is-in');
              io.unobserve(en.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  var hero = document.querySelector('.rth-hero');
  if (!hero) return;

  /* ---------- Day / night ---------- */
  var buttons = hero.querySelectorAll('.rth-toggle button');
  var cta = hero.querySelector('[data-rth-cta]');
  var ctaLabel = hero.querySelector('[data-rth-cta-label]');
  var dayImg = hero.querySelector('.rth-hero__img--day');
  var dayLoaded = false;

  function loadDay() {
    if (dayLoaded || !dayImg) return;
    dayLoaded = true;
    if (dayImg.dataset.srcset) dayImg.srcset = dayImg.dataset.srcset;
    if (dayImg.dataset.src) dayImg.src = dayImg.dataset.src;
  }

  function setMode(mode) {
    if (hero.dataset.mode === mode) return;
    if (mode === 'day') loadDay();
    hero.dataset.mode = mode;
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false');
    });
    if (cta && cta.dataset[mode + 'Href']) {
      cta.href = cta.dataset[mode + 'Href'];
      if (ctaLabel) ctaLabel.textContent = cta.dataset[mode + 'Label'];
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { hero.classList.add('is-switched'); setMode(b.dataset.mode); });
    b.addEventListener('pointerenter', loadDay, { once: true });
    b.addEventListener('focus', loadDay, { once: true });
  });

  var saveData = navigator.connection && navigator.connection.saveData;
  if (!saveData) {
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 2000); };
    var kick = function () { idle(loadDay); };
    if (document.readyState === 'complete') kick();
    else window.addEventListener('load', kick, { once: true });
  }

  /* ---------- Pointer light and tilt (mouse only) ---------- */
  var stage = hero.querySelector('[data-stage]');
  var tilt = hero.querySelector('[data-tilt]');
  var beam = hero.querySelector('.rth-beam');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!stage || !tilt || !beam || reduceMotion || !canHover) return;

  var raf = 0;
  var px = 0.5;
  var py = 0.5;
  var cx = 0;
  var cy = 0;

  function paint() {
    raf = 0;
    var r = tilt.getBoundingClientRect();
    var bw = beam.offsetWidth;
    var x = Math.min(r.width - bw * 0.4, Math.max(-bw * 0.6, cx - r.left - bw / 2));
    var y = Math.min(r.height - bw * 0.4, Math.max(-bw * 0.6, cy - r.top - bw / 2));
    beam.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    tilt.style.setProperty('--rth-ry', ((px - 0.5) * 7).toFixed(2) + 'deg');
    tilt.style.setProperty('--rth-rx', ((0.5 - py) * 5).toFixed(2) + 'deg');
  }

  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var r = stage.getBoundingClientRect();
    px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    cx = e.clientX;
    cy = e.clientY;
    hero.classList.add('is-pointer');
    if (!raf) raf = requestAnimationFrame(paint);
  });

  hero.addEventListener('pointerleave', function () {
    hero.classList.remove('is-pointer');
    beam.style.transform = '';
    tilt.style.removeProperty('--rth-ry');
    tilt.style.removeProperty('--rth-rx');
  });
})();
