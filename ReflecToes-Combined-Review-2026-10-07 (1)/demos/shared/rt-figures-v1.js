/* ReflecToes animation engine: canvas stage, gait/pedal kinematics, figure drawing.
   Units: meters, y up, ground at y=0. Screen: X = ox + x*s, Y = oy - y*s.
   On Shopify this becomes one theme asset (assets/rt-figures.js) shared by every demo. */
(function () {
  const RT = (window.RT = {});
  const TAU = Math.PI * 2;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches && !/[?&]motion=1/.test(location.search);
  RT.reduce = reduce;

  RT.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  RT.ease = (v) => v * v * (3 - 2 * v);
  RT.approach = (cur, target, dt, rate) => cur + (target - cur) * (1 - Math.exp(-dt * rate));

  /* Canvas stage: DPR-aware, pauses offscreen, honors reduced motion with a play button. */
  RT.stage = function (canvas, render, opts = {}) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, last = 0, raf = 0, running = false, seen = false;
    const api = { t: 0, speed: 1, paused: reduce && !opts.static, ctx, get w() { return w; }, get h() { return h; } };
    function resize() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    }
    function draw(dt, rdt) { ctx.clearRect(0, 0, w, h); render(ctx, w, h, api.t, dt, rdt == null ? dt : rdt); }
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!api.paused) api.t += dt * api.speed;
      draw(api.paused ? 0 : dt * api.speed, dt);
      raf = requestAnimationFrame(loop);
    }
    function start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver((es) => {
      if (es[0].isIntersecting) { start(); if (!seen) { seen = true; opts.onFirstView && opts.onFirstView(); } }
      else stop();
    }, { threshold: 0.25 }).observe(canvas);
    // Reduced motion: start paused; one play button per demo, and any demo button starts playback.
    const root = canvas.closest('.rt-demo');
    if (api.paused && root) {
      root._rtStages = root._rtStages || [];
      root._rtStages.push(api);
      if (!root._rtPlay) {
        const b = (root._rtPlay = document.createElement('button'));
        b.className = 'rt-play'; b.type = 'button'; b.textContent = 'Play animation';
        const set = (p) => { root._rtStages.forEach((s) => (s.paused = p)); b.textContent = p ? 'Play animation' : 'Pause animation'; };
        b.onclick = () => set(!root._rtStages[0].paused);
        root.addEventListener('click', (e) => { if (e.target.closest('.rt-btn')) set(false); });
        const bar = root.querySelector('.controls');
        if (bar) { b.className = 'rt-btn'; bar.prepend(b); } else root.appendChild(b);
      }
    }
    api.redraw = () => draw(0);
    resize();
    return api;
  };

  function ik(A, B, l1, l2, s) {
    const dx = B.x - A.x, dy = B.y - A.y;
    const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 1e-4);
    const a = Math.atan2(dy, dx);
    const c = RT.clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1);
    const ang = a + s * Math.acos(c);
    return { x: A.x + l1 * Math.cos(ang), y: A.y + l1 * Math.sin(ang) };
  }
  RT.ik = ik;
  const lerpP = (a, b, k) => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });

  /* Side-view gait. run: 0 walk, 1 run. Returns joints; index 0 = near side. */
  RT.walkPose = function (t, o = {}) {
    const run = o.run || 0;
    const f = run ? 1.4 : 0.92;
    const ph = t * f * TAU;
    const thA = run ? 0.6 : 0.42, kA = run ? 1.7 : 1.05;
    const L1 = 0.45, L2 = 0.45;
    const legs = [0, 1].map((i) => {
      const p = ph + i * Math.PI;
      const thigh = thA * Math.sin(p) + (run ? 0.12 : 0);
      const sw = Math.max(0, Math.cos(p + 0.35));
      const knee = 0.1 + kA * sw * sw;
      const kneeP = { x: L1 * Math.sin(thigh), y: -L1 * Math.cos(thigh) };
      const sa = thigh - knee;
      const ankle = { x: kneeP.x + L2 * Math.sin(sa), y: kneeP.y - L2 * Math.cos(sa) };
      const fa = sa + (run ? 0.2 : 0) * sw;
      const toe = { x: ankle.x + 0.15 * Math.cos(fa), y: ankle.y + 0.15 * Math.sin(fa) - 0.02 };
      return { knee: kneeP, ankle, toe };
    });
    const low = Math.min(legs[0].ankle.y, legs[1].ankle.y, legs[0].toe.y + 0.01, legs[1].toe.y + 0.01);
    const hy = 0.08 - low + (run ? 0.05 * Math.max(0, Math.sin(2 * ph)) : 0);
    const off = (p) => ({ x: p.x, y: p.y + hy });
    legs.forEach((l) => { l.knee = off(l.knee); l.ankle = off(l.ankle); l.toe = off(l.toe); });
    const hip = { x: 0, y: hy };
    const lean = run ? 0.2 : 0.05;
    const sh = { x: hip.x + 0.52 * Math.sin(lean), y: hip.y + 0.52 * Math.cos(lean) };
    const head = { x: sh.x + 0.04 + lean * 0.15, y: sh.y + 0.19 };
    const arms = [0, 1].map((i) => {
      const p = ph + i * Math.PI + Math.PI;
      const ua = (run ? 0.75 : 0.38) * Math.sin(p);
      const flex = run ? 1.45 + 0.15 * Math.sin(p) : 0.25 + 0.3 * Math.max(0, Math.sin(p));
      const elbow = { x: sh.x + 0.3 * Math.sin(ua), y: sh.y - 0.3 * Math.cos(ua) };
      const fa = ua + flex;
      const wrist = { x: elbow.x + 0.27 * Math.sin(fa), y: elbow.y - 0.27 * Math.cos(fa) };
      return { elbow, wrist, hand: { x: wrist.x + 0.06 * Math.sin(fa), y: wrist.y - 0.06 * Math.cos(fa) } };
    });
    return { kind: 'walk', hip, sh, head, legs, arms, speed: run ? 3.1 : 1.35 };
  };

  /* Side-view cyclist pose on the bike frame defined in drawBike. */
  RT.cyclePose = function (t, o = {}) {
    const ph = t * (o.cadence || 1.25) * TAU;
    const bb = { x: 0, y: 0.3 }, crank = 0.17;
    const hip = { x: -0.24, y: 0.98 };
    const legs = [0, 1].map((i) => {
      const a = -ph + i * Math.PI;
      const pedal = { x: bb.x + crank * Math.cos(a), y: bb.y + crank * Math.sin(a) };
      const ankle = { x: pedal.x - 0.04, y: pedal.y + 0.07 };
      const knee = ik(hip, ankle, 0.46, 0.45, 1);
      return { knee, ankle, toe: { x: pedal.x + 0.1, y: pedal.y + 0.01 }, pedal, a };
    });
    const lean = 1.0;
    const sh = { x: hip.x + 0.56 * Math.sin(lean), y: hip.y + 0.56 * Math.cos(lean) };
    const head = { x: sh.x + 0.13, y: sh.y + 0.15 };
    const bar = { x: 0.5, y: 1.0 };
    const arms = [0, 1].map(() => {
      const elbow = ik(sh, bar, 0.3, 0.29, -1);
      return { elbow, wrist: lerpP(elbow, bar, 0.82), hand: bar };
    });
    return { kind: 'cycle', hip, sh, head, legs, arms, crankA: -ph, bb, speed: 6 };
  };

  /* ---------- Drawing ---------- */
  const P = (o, p) => [o.x + p.x * o.s, o.y - p.y * o.s];
  function seg(ctx, o, a, b, wM, color) {
    const [x1, y1] = P(o, a), [x2, y2] = P(o, b);
    ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, wM * o.s);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  RT.seg = seg; RT.P = P;

  /* Glow primitive: additive radial blob. */
  RT.glow = function (ctx, x, y, r, color, a) {
    if (a <= 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${color},${0.9 * a})`);
    g.addColorStop(0.25, `rgba(${color},${0.45 * a})`);
    g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.restore();
  };

  /* Bright line with halo, for reflective bands and straps. */
  RT.glowSeg = function (ctx, o, a, b, wM, rgb, k) {
    if (k <= 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.shadowColor = `rgba(${rgb},${0.9 * k})`; ctx.shadowBlur = 18 * k + 4;
    seg(ctx, o, a, b, wM, `rgba(${rgb},${k})`);
    ctx.shadowBlur = 0;
    seg(ctx, o, a, b, wM * 0.45, `rgba(255,255,255,${0.9 * k})`);
    ctx.restore();
    const [x1, y1] = P(o, a), [x2, y2] = P(o, b);
    RT.glow(ctx, (x1 + x2) / 2, (y1 + y2) / 2, o.s * 0.35 * (0.5 + k), rgb, 0.35 * k);
  };

  /* Bike in side view. o = {x,y,s}. */
  RT.drawBike = function (ctx, o, pose, col, alpha = 1) {
    ctx.save(); ctx.globalAlpha *= alpha; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const rw = { x: -0.58, y: 0.34 }, fw = { x: 0.52, y: 0.34 }, R = 0.34;
    [rw, fw].forEach((c) => {
      const [cx, cy] = P(o, c);
      ctx.strokeStyle = col.tire; ctx.lineWidth = 0.045 * o.s; ctx.beginPath(); ctx.arc(cx, cy, R * o.s, 0, TAU); ctx.stroke();
      ctx.strokeStyle = col.spoke; ctx.lineWidth = 1;
      for (let k = 0; k < 6; k++) {
        const a = pose.crankA * 2.6 + (k * Math.PI) / 6;
        ctx.beginPath(); ctx.moveTo(cx - Math.cos(a) * R * 0.92 * o.s, cy - Math.sin(a) * R * 0.92 * o.s);
        ctx.lineTo(cx + Math.cos(a) * R * 0.92 * o.s, cy + Math.sin(a) * R * 0.92 * o.s); ctx.stroke();
      }
    });
    const bb = pose.bb, seat = { x: -0.21, y: 0.9 }, head = { x: 0.4, y: 0.86 }, headLo = { x: 0.43, y: 0.74 };
    const w = 0.035, c = col.frame;
    seg(ctx, o, bb, seat, w, c); seg(ctx, o, seat, head, w, c); seg(ctx, o, bb, headLo, w * 1.1, c);
    seg(ctx, o, bb, rw, w * 0.8, c); seg(ctx, o, { x: -0.19, y: 0.84 }, rw, w * 0.7, c);
    seg(ctx, o, head, fw, w * 0.8, c);
    seg(ctx, o, head, { x: 0.47, y: 0.98 }, w * 0.8, c); seg(ctx, o, { x: 0.46, y: 0.99 }, { x: 0.56, y: 0.97 }, w, c);
    seg(ctx, o, { x: -0.33, y: 0.95 }, { x: -0.12, y: 0.96 }, 0.045, col.saddle || c);
    ctx.restore();
  };

  /* Figure in side view (walk/run/cycle pose).
     st: { skin, top, bottom, shoe, sock, glove, alpha, farDim } colors as CSS strings; null = skip.  */
  RT.drawFigure = function (ctx, o, pose, st) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.globalAlpha *= st.alpha == null ? 1 : st.alpha;
    const order = [1, 0];
    const dim = st.farDim == null ? 0.72 : st.farDim;
    const limb = (i, fn) => { ctx.save(); if (i === 1) ctx.globalAlpha *= dim; fn(); ctx.restore(); };
    const arm = (i) => limb(i, () => {
      const a = pose.arms[i];
      seg(ctx, o, pose.sh, a.elbow, 0.085, st.sleeve || st.top);
      seg(ctx, o, a.elbow, a.wrist, 0.07, st.forearm || st.sleeve || st.skin);
      seg(ctx, o, a.wrist, a.hand, 0.085, st.glove || st.skin);
    });
    const leg = (i) => limb(i, () => {
      const l = pose.legs[i];
      seg(ctx, o, pose.hip, l.knee, 0.13, st.bottom);
      seg(ctx, o, l.knee, l.ankle, 0.1, st.shin || st.bottom);
      if (st.sock) seg(ctx, o, lerpP(l.ankle, l.knee, 0.28), l.ankle, 0.105, st.sock);
      seg(ctx, o, l.ankle, l.toe, 0.09, st.shoe);
    });
    arm(1); leg(1);
    // torso
    const hp = pose.hip, sp = pose.sh;
    seg(ctx, o, hp, sp, 0.3, st.top);
    // head
    const [hx, hy] = P(o, pose.head);
    ctx.fillStyle = st.skin; ctx.beginPath(); ctx.arc(hx, hy, 0.105 * o.s, 0, TAU); ctx.fill();
    if (st.helmet) { ctx.fillStyle = st.helmet; ctx.beginPath(); ctx.arc(hx, hy - 0.01 * o.s, 0.118 * o.s, Math.PI * 1.05, Math.PI * 2.05); ctx.fill(); }
    leg(0); arm(0);
    ctx.restore();
  };

  /* Joint lookup for markers. part: ankle|knee|wrist|elbow|hand|hip|shoulder; side 0 near / 1 far. */
  RT.joint = function (pose, part, side) {
    if (part === 'ankle' || part === 'knee' || part === 'toe') return pose.legs[side][part];
    if (part === 'wrist' || part === 'elbow' || part === 'hand') return pose.arms[side][part];
    if (part === 'hip') return pose.hip;
    if (part === 'shoulder') return pose.sh;
    return pose.head;
  };

  /* Retroreflective sock band and glove patch with headlight intensity k (0..1). */
  RT.drawReflectiveKit = function (ctx, o, pose, k, parts, rgb = '255,250,225') {
    parts.forEach(([part, side]) => {
      const dimK = side === 1 ? k * 0.75 : k;
      if (part === 'sock') {
        const l = pose.legs[side];
        RT.glowSeg(ctx, o, lerpP(l.ankle, l.knee, 0.26), lerpP(l.ankle, l.knee, 0.04), 0.1, rgb, dimK);
      } else if (part === 'glove') {
        const a = pose.arms[side];
        RT.glowSeg(ctx, o, a.wrist, a.hand, 0.1, rgb, dimK);
      } else {
        const j = RT.joint(pose, part, side); const [x, y] = P(o, j);
        RT.glow(ctx, x, y, Math.max(10, o.s * 0.12), rgb, dimK);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,255,255,${dimK})`;
        ctx.beginPath(); ctx.arc(x, y, Math.max(2, o.s * 0.03), 0, TAU); ctx.fill(); ctx.restore();
      }
    });
  };

  /* Strap-style vest (X straps + waist belt) as reflective strips on the torso. */
  RT.drawStrapVest = function (ctx, o, pose, k, rgb = '255,250,225', color) {
    const hp = pose.hip, sp = pose.sh;
    const along = (t, n) => {
      const dx = sp.x - hp.x, dy = sp.y - hp.y, L = Math.hypot(dx, dy);
      return { x: hp.x + dx * t + (-dy / L) * n, y: hp.y + dy * t + (dx / L) * n };
    };
    const a1 = along(0.95, -0.1), b1 = along(0.25, 0.1), a2 = along(0.95, 0.1), b2 = along(0.25, -0.1);
    const w1 = along(0.2, -0.14), w2 = along(0.2, 0.14);
    if (color) { ctx.save(); ctx.lineCap = 'round'; [[a1, b1], [a2, b2], [w1, w2]].forEach(([p, q]) => seg(ctx, o, p, q, 0.05, color)); ctx.restore(); }
    [[a1, b1], [a2, b2], [w1, w2]].forEach(([p, q]) => RT.glowSeg(ctx, o, p, q, 0.045, rgb, k * 0.9));
  };

  /* Full torso vest panel (packable vest). */
  RT.drawVestPanel = function (ctx, o, pose, k, fill, rgb = '255,250,225') {
    ctx.save(); ctx.lineCap = 'butt';
    seg(ctx, o, { x: pose.hip.x, y: pose.hip.y + 0.06 }, { x: pose.sh.x, y: pose.sh.y - 0.05 }, 0.31, fill);
    ctx.restore();
    const lo = { x: pose.hip.x + (pose.sh.x - pose.hip.x) * 0.35, y: pose.hip.y + (pose.sh.y - pose.hip.y) * 0.35 };
    const hi = { x: pose.hip.x + (pose.sh.x - pose.hip.x) * 0.62, y: pose.hip.y + (pose.sh.y - pose.hip.y) * 0.62 };
    RT.glowSeg(ctx, o, { x: lo.x - 0.13, y: lo.y }, { x: lo.x + 0.13, y: lo.y }, 0.045, rgb, k);
    RT.glowSeg(ctx, o, { x: hi.x - 0.13, y: hi.y }, { x: hi.x + 0.13, y: hi.y }, 0.045, rgb, k);
  };

  /* Night road in driver's-eye perspective. h = headlight level 0..1. */
  RT.drawNightRoad = function (ctx, w, h, k, scroll = 0) {
    const hz = h * 0.44;
    const sky = ctx.createLinearGradient(0, 0, 0, hz);
    sky.addColorStop(0, '#04060a'); sky.addColorStop(1, '#0b1018');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, hz);
    ctx.fillStyle = '#06080b'; ctx.fillRect(0, hz, w, h - hz);
    // tree line
    ctx.fillStyle = '#030405';
    ctx.beginPath(); ctx.moveTo(0, hz);
    for (let x = 0; x <= w; x += 14) ctx.lineTo(x, hz - 8 - 10 * Math.abs(Math.sin(x * 0.07)) - 6 * Math.abs(Math.sin(x * 0.19)));
    ctx.lineTo(w, hz); ctx.fill();
    // road trapezoid
    const cx = w / 2;
    ctx.fillStyle = '#0d1014';
    ctx.beginPath(); ctx.moveTo(cx - w * 0.04, hz); ctx.lineTo(cx + w * 0.04, hz); ctx.lineTo(cx + w * 0.95, h); ctx.lineTo(cx - w * 0.95, h); ctx.fill();
    // beams
    if (k > 0.01) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(cx, h * 1.15, h * 0.1, cx, h * 0.9, h * 0.75);
      g.addColorStop(0, `rgba(255,244,214,${0.34 * k})`); g.addColorStop(0.6, `rgba(255,240,205,${0.1 * k})`); g.addColorStop(1, 'rgba(255,240,200,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(cx - w * 0.06, hz + 2); ctx.lineTo(cx + w * 0.06, hz + 2); ctx.lineTo(cx + w * 0.9, h); ctx.lineTo(cx - w * 0.9, h); ctx.fill();
      ctx.restore();
    }
    // lane dashes
    ctx.fillStyle = `rgba(230,225,200,${0.08 + 0.4 * k})`;
    for (let i = 0; i < 9; i++) {
      const z = ((i + (scroll % 1)) / 9);
      const z2 = z + 0.045;
      const y1 = hz + (h - hz) * z * z, y2 = hz + (h - hz) * z2 * z2;
      const ww1 = 1 + 5 * z, ww2 = 1 + 5 * z2;
      ctx.beginPath(); ctx.moveTo(cx - ww1 / 2, y1); ctx.lineTo(cx + ww1 / 2, y1); ctx.lineTo(cx + ww2 / 2, y2); ctx.lineTo(cx - ww2 / 2, y2); ctx.fill();
    }
    return hz;
  };
})();
