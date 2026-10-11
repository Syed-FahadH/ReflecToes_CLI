/* ReflecToes animation engine v2.
   - Gait from published sagittal joint-angle curves (walk + run), Fourier-smoothed so motion is continuous.
   - Joints are 3D (x forward, y up, z to the walker's right), so any figure can be drawn from the side, front or back.
   - Always animates on load (like the live CSS demos): no reduced-motion pause. Pauses only while offscreen.
   On Shopify this becomes one theme asset (assets/rt-figures.js) shared by every demo. */
(function () {
  const RT = (window.RT = {});
  const TAU = Math.PI * 2, D2R = Math.PI / 180;
  RT.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  RT.ease = (v) => v * v * (3 - 2 * v);
  RT.approach = (cur, target, dt, rate) => cur + (target - cur) * (1 - Math.exp(-dt * rate));
  RT.lerp = (a, b, k) => a + (b - a) * k;

  /* ---------- Stage: starts immediately, pauses offscreen ---------- */
  RT.stage = function (canvas, render, opts = {}) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, last = 0, raf = 0, running = false, seen = false;
    const api = { t: opts.t0 || 0, speed: 1, paused: false, ctx };
    function resize() {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0, 0);
    }
    function draw(dt, rdt) { if (!w) return; ctx.clearRect(0, 0, w, h); render(ctx, w, h, api.t, dt, rdt); }
    function loop(now) {
      const rdt = Math.min(0.1, Math.max(0, (now - last) / 1000)); last = now;
      const dt = api.paused ? 0 : rdt * api.speed;
      api.t += dt;
      draw(dt, rdt);
      raf = requestAnimationFrame(loop);
    }
    function start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas); else addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => {
        if (es[0].isIntersecting) { start(); if (!seen) { seen = true; opts.onFirstView && opts.onFirstView(); } }
        else stop();
      }, { threshold: 0.15 }).observe(canvas);
    } else { start(); opts.onFirstView && opts.onFirstView(); }
    resize();
    api.redraw = () => draw(0, 0);
    return api;
  };

  /* ---------- Smooth periodic curves ---------- */
  function sampleKeys(keys) {
    const N = 240, s = [];
    for (let i = 0; i < N; i++) {
      const p = (i / N) * 100;
      let j = keys.length - 1;
      for (let m = 0; m < keys.length; m++) if (keys[m][0] <= p) j = m;
      const a = keys[j], b = keys[(j + 1) % keys.length];
      const bx = j + 1 < keys.length ? b[0] : b[0] + 100;
      const k = (p - a[0]) / (bx - a[0]);
      s.push(a[1] + (b[1] - a[1]) * k);
    }
    return s;
  }
  function fit(s, H) {
    const N = s.length, A = [], B = [];
    let a0 = 0; for (const v of s) a0 += v; a0 /= N;
    for (let k = 1; k <= H; k++) {
      let a = 0, b = 0;
      for (let i = 0; i < N; i++) { const t = (TAU * k * i) / N; a += s[i] * Math.cos(t); b += s[i] * Math.sin(t); }
      A.push((2 * a) / N); B.push((2 * b) / N);
    }
    return (p) => { let v = a0; for (let k = 1; k <= H; k++) { const t = TAU * k * p; v += A[k - 1] * Math.cos(t) + B[k - 1] * Math.sin(t); } return v; };
  }

  /* Joint angles (deg) over one stride, right leg, 0% = right heel strike.
     Walk: typical adult sagittal kinematics. Run: easy jog (~170 steps/min). */
  const GAIT = {
    walk: {
      f: 0.92, stance: 0.62, lean: 3, sway: 0.022, rot: 5, sh: [2, 16], el: [24, 10], armZ: [0.235, 0.225],
      hip: [[0, 28], [12, 22], [25, 12], [40, 0], [50, -8], [56, -11], [62, -4], [70, 10], [80, 25], [87, 31], [94, 29]],
      knee: [[0, 5], [8, 13], [15, 18], [25, 12], [38, 6], [48, 6], [55, 15], [62, 38], [70, 58], [75, 62], [82, 48], [90, 22], [96, 7]],
      ankle: [[0, 0], [7, -6], [15, 2], [30, 7], [45, 11], [52, 6], [58, -8], [64, -18], [70, -10], [78, 0], [88, 3]]
    },
    run: {
      f: 1.4, stance: 0.3, lean: 10, sway: 0.012, rot: 9, sh: [8, 38], el: [82, 18], armZ: [0.215, 0.17], flight: 3.2,
      hip: [[0, 34], [8, 26], [16, 12], [24, -4], [30, -16], [38, -14], [48, 4], [58, 26], [68, 46], [78, 56], [88, 48], [95, 40]],
      knee: [[0, 14], [8, 34], [14, 40], [22, 28], [30, 14], [40, 48], [50, 95], [60, 118], [68, 112], [78, 80], [88, 34], [95, 16]],
      ankle: [[0, 2], [8, 14], [14, 20], [22, 8], [30, -26], [40, -20], [52, -8], [68, 2], [85, 6]]
    }
  };
  const L = { thigh: 0.44, shank: 0.43, ankleH: 0.075, heel: 0.055, toe: 0.165, upper: 0.29, fore: 0.26, hand: 0.085, hipW: 0.09 };

  function legRel(h, k, a) {
    h *= D2R; k *= D2R; a *= D2R;
    const knee = { x: L.thigh * Math.sin(h), y: -L.thigh * Math.cos(h) };
    const s = h - k;
    const ankle = { x: knee.x + L.shank * Math.sin(s), y: knee.y - L.shank * Math.cos(s) };
    const f = s + a, ux = Math.cos(f), uy = Math.sin(f), dx = Math.sin(f), dy = -Math.cos(f);
    const heel = { x: ankle.x + dx * L.ankleH - ux * L.heel, y: ankle.y + dy * L.ankleH - uy * L.heel };
    const ball = { x: ankle.x + dx * L.ankleH + ux * 0.11, y: ankle.y + dy * L.ankleH + uy * 0.11 };
    const toe = { x: ankle.x + dx * L.ankleH * 0.7 + ux * L.toe, y: ankle.y + dy * L.ankleH * 0.7 + uy * L.toe };
    return { knee, ankle, heel, ball, toe };
  }

  function buildGait(name) {
    const g = GAIT[name];
    const H = fit(sampleKeys(g.hip), 7), K = fit(sampleKeys(g.knee), 7), A = fit(sampleKeys(g.ankle), 7);
    const N = 240, period = 1 / g.f, req = [];
    for (let i = 0; i < N; i++) {
      const p = i / N; let best = NaN;
      for (const off of [0, 0.5]) {
        const q = (p + off) % 1;
        if (q < g.stance) {
          const r = legRel(H(q), K(q), A(q));
          const v = -Math.min(r.heel.y, r.ball.y, r.toe.y);
          best = isNaN(best) ? v : Math.max(best, v);
        }
      }
      req.push(best);
    }
    // flight phases (running): ballistic arc between stance segments
    for (let i = 0; i < N; i++) {
      if (!isNaN(req[i])) continue;
      let j = i; while (isNaN(req[j % N])) j++;
      const y0 = req[(i - 1 + N) % N], y1 = req[j % N], T = ((j - i + 1) / N) * period;
      for (let m = i; m < j; m++) {
        const tt = ((m - i + 1) / N) * period, k = tt / T;
        req[m % N] = y0 + (y1 - y0) * k + 0.5 * 9.81 * (g.flight || 1) * tt * (T - tt);
      }
      i = j;
    }
    const hipY = fit(req, 10);
    // forward speed that keeps the stance foot planted
    const a = 0.1, b = g.stance - 0.1;
    const r0 = legRel(H(a), K(a), A(a)), r1 = legRel(H(b), K(b), A(b));
    const speed = (r0.ball.x - r1.ball.x) / ((b - a) * period);
    return { g, H, K, A, hipY, speed, period };
  }
  const G = { walk: buildGait('walk'), run: buildGait('run') };
  RT.gaitSpeed = (kind) => (G[kind] ? G[kind].speed : 6);

  /* 3D pose. Sides: R (right, +z) and L (left, -z). */
  RT.pose = function (t, kind = 'walk') {
    if (kind === 'cycle') return cyclePose(t);
    const M = G[kind], g = M.g;
    const p = (((t * g.f) % 1) + 1) % 1;
    const hy = M.hipY(p);
    const zoff = g.sway * Math.sin(TAU * p);
    const rot = g.rot * D2R * Math.cos(TAU * p);
    const pose = { kind, speed: M.speed, legs: {}, arms: {}, phase: p };
    for (const [side, sg, off] of [['R', 1, 0], ['L', -1, 0.5]]) {
      const q = (p + off) % 1;
      const r = legRel(M.H(q), M.K(q), M.A(q));
      const hx = sg * L.hipW * Math.sin(rot);
      const P3 = (v, z) => ({ x: hx + v.x, y: hy + v.y, z: z + zoff });
      pose.legs[side] = {
        hip: { x: hx, y: hy, z: sg * L.hipW + zoff }, knee: P3(r.knee, sg * 0.085), ankle: P3(r.ankle, sg * 0.08),
        heel: P3(r.heel, sg * 0.08), ball: P3(r.ball, sg * 0.085), toe: P3(r.toe, sg * 0.09)
      };
    }
    const lean = g.lean * D2R;
    const pel = { x: 0, y: hy + 0.04, z: zoff };
    const shC = { x: pel.x + 0.5 * Math.sin(lean), y: pel.y + 0.5 * Math.cos(lean), z: zoff * 0.4 };
    pose.pelvis = pel; pose.shC = shC; pose.lean = lean;
    pose.head = { x: shC.x + 0.03 + 0.2 * Math.sin(lean), y: shC.y + 0.22, z: shC.z };
    for (const [side, sg, off] of [['R', 1, 0], ['L', -1, 0.5]]) {
      const q = (p + off) % 1;
      const c = Math.cos(TAU * (q - 0.37));
      const th = (g.sh[0] + g.sh[1] * c) * D2R, el = (g.el[0] + g.el[1] * c) * D2R;
      const sx = -sg * 0.19 * Math.sin(rot * 0.8);
      const sh = { x: shC.x + sx, y: shC.y - 0.03, z: shC.z + sg * 0.2 };
      const elbow = { x: sh.x + L.upper * Math.sin(th), y: sh.y - L.upper * Math.cos(th), z: shC.z + sg * g.armZ[0] };
      const fa = th + el;
      const wrist = { x: elbow.x + L.fore * Math.sin(fa), y: elbow.y - L.fore * Math.cos(fa), z: shC.z + sg * g.armZ[1] };
      const hand = { x: wrist.x + L.hand * Math.sin(fa), y: wrist.y - L.hand * Math.cos(fa), z: wrist.z };
      pose.arms[side] = { sh, elbow, wrist, hand };
    }
    return pose;
  };

  function ik2(A, B, l1, l2, s) {
    const dx = B.x - A.x, dy = B.y - A.y, d = Math.min(Math.hypot(dx, dy), l1 + l2 - 1e-4);
    const a = Math.atan2(dy, dx), c = RT.clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1), ang = a + s * Math.acos(c);
    return { x: A.x + l1 * Math.cos(ang), y: A.y + l1 * Math.sin(ang) };
  }
  RT.ik2 = ik2;
  /* Cyclist on a road bike, bottom bracket at (0, 0.3). signal: 0..1 extends the left arm. */
  function cyclePose(t, signal = 0) {
    const ph = t * 1.4 * TAU;
    const hip2 = { x: -0.24, y: 0.98 }, pose = { kind: 'cycle', speed: 6, legs: {}, arms: {}, crank: -ph };
    for (const [side, sg, off] of [['R', 1, 0], ['L', -1, Math.PI]]) {
      const a = -ph + off;
      const pedal = { x: 0.17 * Math.cos(a), y: 0.3 + 0.17 * Math.sin(a) };
      const ank = { x: pedal.x - 0.05, y: pedal.y + 0.075 };
      const kn = ik2(hip2, ank, 0.45, 0.44, 1);
      const z = sg * 0.115;
      pose.legs[side] = {
        hip: { x: hip2.x, y: hip2.y, z: sg * 0.09 }, knee: { x: kn.x, y: kn.y, z: sg * 0.105 }, ankle: { x: ank.x, y: ank.y, z },
        heel: { x: pedal.x - 0.08, y: pedal.y + 0.015, z }, ball: { x: pedal.x + 0.03, y: pedal.y, z }, toe: { x: pedal.x + 0.1, y: pedal.y + 0.01, z }
      };
    }
    const lean = 1.0;
    const pel = { x: -0.22, y: 1.0, z: 0 };
    const shC = { x: pel.x + 0.55 * Math.sin(lean), y: pel.y + 0.55 * Math.cos(lean), z: 0 };
    pose.pelvis = pel; pose.shC = shC; pose.lean = lean;
    pose.head = { x: shC.x + 0.15, y: shC.y + 0.16, z: 0 };
    const bar = { x: 0.5, y: 1.0 };
    for (const [side, sg] of [['R', 1], ['L', -1]]) {
      const sh = { x: shC.x, y: shC.y - 0.02, z: sg * 0.19 };
      const e2 = ik2({ x: sh.x, y: sh.y }, bar, 0.29, 0.3, -1);
      let elbow = { x: e2.x, y: e2.y, z: sg * 0.24 }, wrist = { x: RT.lerp(e2.x, bar.x, 0.8), y: RT.lerp(e2.y, bar.y, 0.8), z: sg * 0.215 }, hand = { x: bar.x, y: bar.y, z: sg * 0.21 };
      if (side === 'L' && signal > 0) {
        const k = signal, ext = (d) => ({ x: sh.x + 0.03, y: sh.y - 0.02, z: sh.z - d });
        elbow = mix3(elbow, ext(0.29), k); wrist = mix3(wrist, ext(0.53), k); hand = mix3(hand, ext(0.62), k);
      }
      pose.arms[side] = { sh, elbow, wrist, hand };
    }
    return pose;
  }
  const mix3 = (a, b, k) => ({ x: RT.lerp(a.x, b.x, k), y: RT.lerp(a.y, b.y, k), z: RT.lerp(a.z, b.z, k) });
  RT.cyclePose = cyclePose;

  /* ---------- Projection ----------
     view (deg): 0 = side (moving right), 90 = back (moving away), -90 = front (moving toward you).
     tilt: camera looks slightly down, so depth becomes a vertical offset. */
  RT.camera = function (o, view = 0, tilt = 0) {
    const a = view * D2R, ca = Math.cos(a), sa = Math.sin(a);
    return {
      o, ca, sa, tilt,
      p(v) { const d = v.x * sa - v.z * ca; return { X: o.x + (v.x * ca + v.z * sa) * o.s, Y: o.y - (v.y + d * tilt) * o.s, D: d }; },
      facing(n) { return -(n.x * sa - n.z * ca); }
    };
  };

  /* ---------- Drawing ---------- */
  RT.glow = function (ctx, x, y, r, rgb, a) {
    if (a <= 0.01 || r <= 0) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${rgb},${0.85 * a})`); g.addColorStop(0.3, `rgba(${rgb},${0.38 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
  };
  const shade = (rgb, k) => `rgb(${rgb.map((v) => Math.round(RT.clamp(v * k, 0, 255))).join(',')})`;
  RT.shade = shade;

  /* Draw a figure through a camera.
     st: { light: fabric brightness 0..1, retro: headlight on reflective 0..1, fluorGlow: daylight fluorescence 0..1,
           top, sleeve, forearm, bottom, shin, shoe, skin, hair, helmet (rgb arrays),
           gear: { socks:'retro'|'fluor', bands, gloves:'retro'|'fluor', ledWrist, ledAnkle, vest:'full'|'strap', jersey:'fluor' },
           bodyAlpha: body opacity (gear is always drawn at full), t: time for LED blink } */
  RT.drawFigure = function (ctx, cam, pose, st) {
    const s = cam.o.s, items = [], gearItems = [];
    const lit = st.light == null ? 1 : st.light;
    const col = (rgb, k = 1) => shade(rgb, lit * k);
    const P = (v) => cam.p(v);
    const gear = st.gear || {}, retro = st.retro || 0, fl = st.fluorGlow || 0;
    const bodyA = st.bodyAlpha == null ? 1 : st.bodyAlpha;
    const seg = (a, b, wm, color) => { const A = P(a), B = P(b), d = (A.D + B.D) / 2; items.push({ d, body: true, f: () => { ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, wm * s); ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke(); } }); return d; };
    const poly = (ps, fill) => { ctx.fillStyle = fill; ctx.beginPath(); ps.forEach((q, i) => (i ? ctx.lineTo(q.X, q.Y) : ctx.moveTo(q.X, q.Y))); ctx.closePath(); ctx.fill(); };
    const ctr = (ps) => ({ X: ps.reduce((a, q) => a + q.X, 0) / ps.length, Y: ps.reduce((a, q) => a + q.Y, 0) / ps.length });

    // ----- torso: frustum from pelvis to shoulders -----
    const pel = pose.pelvis, shC = pose.shC, ln = pose.lean, fw = Math.cos(ln), fu = Math.sin(ln);
    const corner = (top, sx, sz) => { const c = top ? shC : pel, hw = top ? 0.165 : 0.135, hd = top ? 0.11 : 0.095; return { x: c.x + sx * hd * fw, y: c.y - sx * hd * fu, z: c.z + sz * hw }; };
    const faces = [
      { k: 'front', n: { x: fw, y: 0, z: 0 }, pts: [corner(0, 1, -1), corner(0, 1, 1), corner(1, 1, 1), corner(1, 1, -1)] },
      { k: 'back', n: { x: -fw, y: 0, z: 0 }, pts: [corner(0, -1, 1), corner(0, -1, -1), corner(1, -1, -1), corner(1, -1, 1)] },
      { k: 'right', n: { x: 0, y: 0, z: 1 }, pts: [corner(0, -1, 1), corner(0, 1, 1), corner(1, 1, 1), corner(1, -1, 1)] },
      { k: 'left', n: { x: 0, y: 0, z: -1 }, pts: [corner(0, 1, -1), corner(0, -1, -1), corner(1, -1, -1), corner(1, 1, -1)] }
    ];
    const topRgb = st.top || [40, 44, 52];
    faces.forEach((F) => {
      const fac = cam.facing(F.n);
      if (fac < -0.01) return;
      const pts = F.pts.map(P), d = pts.reduce((a, q) => a + q.D, 0) / 4;
      const side = F.k === 'left' || F.k === 'right';
      const panel = gear.vest === 'full';
      let rgb = topRgb;
      if (gear.vest === 'full') rgb = [176, 180, 184];
      if (gear.jersey === 'fluor') rgb = [214, 255, 30];
      const base = col(rgb, 0.78 + 0.22 * fac);
      items.push({ d, body: true, f: () => {
        poly(pts, base);
        ctx.strokeStyle = base; ctx.lineWidth = 0.085 * s; ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q.X, q.Y) : ctx.moveTo(q.X, q.Y))); ctx.closePath(); ctx.stroke();
      } });
      if (panel && retro > 0.01) {
        const k = retro * (0.08 + 0.92 * Math.pow(Math.max(0, fac), 0.7));
        gearItems.push({ d: d - 0.02, f: () => {
          ctx.save(); ctx.lineJoin = 'round'; ctx.shadowColor = `rgba(255,250,225,${k})`; ctx.shadowBlur = 26 * k + 4;
          poly(pts, `rgba(255,252,236,${RT.clamp(0.25 + 0.8 * k, 0, 1)})`);
          ctx.strokeStyle = `rgba(255,252,236,${RT.clamp(0.25 + 0.8 * k, 0, 1)})`; ctx.lineWidth = 0.05 * s; ctx.stroke();
          ctx.restore();
          const c = ctr(pts); RT.glow(ctx, c.X, c.Y, s * 0.6, '255,250,225', 0.5 * k);
        } });
      }
      if (gear.vest === 'full' && F.k === 'front' && fac > 0.2) {
        const a = P({ x: pel.x + 0.105 * fw, y: pel.y, z: pel.z }), b = P({ x: shC.x + 0.12 * fw, y: shC.y - 0.01, z: shC.z });
        gearItems.push({ d: d - 0.03, f: () => { ctx.strokeStyle = col([200, 235, 40]); ctx.lineWidth = 0.028 * s; ctx.beginPath(); ctx.moveTo(a.X, a.Y); ctx.lineTo(b.X, b.Y); ctx.stroke(); } });
      }
      if ((gear.jersey === 'fluor' || (gear.vest === 'full' && side)) && fl > 0.01) {
        gearItems.push({ d: d - 0.02, f: () => { const c = ctr(pts); RT.glow(ctx, c.X, c.Y, s * 0.42, '214,255,30', 0.38 * fl * Math.max(0.35, fac)); } });
      }
    });

    // strap vest: X straps front and back, over-shoulder straps, waist belt
    if (gear.vest === 'strap') {
      const yb = pel.y + 0.08, top = shC.y - 0.03;
      const shF = (sz) => ({ x: shC.x + 0.118 * fw, y: top, z: shC.z + sz * 0.1 }), shB = (sz) => ({ x: shC.x - 0.118 * fw, y: top, z: shC.z + sz * 0.1 });
      const shT = (sz) => ({ x: shC.x, y: shC.y + 0.03, z: shC.z + sz * 0.11 });
      const belt = (sx, sz) => ({ x: pel.x + sx * 0.108 * fw, y: yb, z: pel.z + sz * 0.158 });
      const nF = { x: 1, y: 0, z: 0 }, nB = { x: -1, y: 0, z: 0 }, nR = { x: 0, y: 0, z: 1 }, nL = { x: 0, y: 0, z: -1 };
      const strap = (a, b, n, any) => {
        const fac = cam.facing(n);
        if (!any && fac < -0.12) return;
        const A = P(a), B = P(b), k = retro * (0.5 + 0.5 * Math.max(0, fac));
        gearItems.push({ d: Math.min(A.D, B.D) - 0.03, f: () => {
          ctx.save(); ctx.lineCap = 'round';
          ctx.strokeStyle = col([150, 165, 55]); ctx.lineWidth = 0.05 * s; ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke();
          if (k > 0.01) {
            ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = `rgba(255,250,225,${k})`; ctx.shadowBlur = 16 * k + 3;
            ctx.strokeStyle = `rgba(255,250,225,${k})`; ctx.lineWidth = 0.035 * s; ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke();
          }
          ctx.restore();
        } });
      };
      const mid = { x: pel.x + 0.108 * fw, y: yb, z: pel.z };
      strap(shF(-1), mid, nF); strap(shF(1), mid, nF);
      strap(shB(-1), belt(-1, 1), nB); strap(shB(1), belt(-1, -1), nB);
      strap(shF(-1), shT(-1), nF, 1); strap(shT(-1), shB(-1), nB, 1); strap(shF(1), shT(1), nF, 1); strap(shT(1), shB(1), nB, 1);
      strap(belt(1, -1), belt(1, 1), nF); strap(belt(-1, -1), belt(-1, 1), nB);
      strap(belt(1, 1), belt(-1, 1), nR); strap(belt(1, -1), belt(-1, -1), nL);
    }

    // ----- limbs -----
    const skin = st.skin || [190, 150, 120], bottom = st.bottom || [30, 32, 38], shoe = st.shoe || [25, 25, 28];
    const sleeve = st.sleeve || topRgb;
    for (const side of ['R', 'L']) {
      const l = pose.legs[side], a = pose.arms[side];
      const up = (k) => ({ x: l.ankle.x + (l.knee.x - l.ankle.x) * k, y: l.ankle.y + (l.knee.y - l.ankle.y) * k, z: l.ankle.z + (l.knee.z - l.ankle.z) * k });
      seg(l.hip, l.knee, 0.145, col(bottom));
      const dShank = seg(l.knee, l.ankle, 0.108, col(st.shin || bottom));
      seg(l.ankle, l.heel, 0.095, col(shoe));
      seg(l.heel, l.toe, 0.085, col(shoe));
      if (gear.socks) band(l.ankle, up(0.27), 0.12, gear.socks, dShank);
      if (gear.bands) band(up(0.08), up(0.19), 0.125, 'retro', dShank);
      if (gear.decals) band(up(0.36), up(0.44), 0.115, 'retro', dShank);
      if (gear.ledAnkle) led(up(0.13), side === 'R' ? 0.065 : -0.065, side);
      seg(a.sh, a.elbow, 0.092, col(sleeve));
      const dFore = seg(a.elbow, a.wrist, 0.076, col(st.forearm || sleeve));
      if (gear.gloves) band(a.wrist, a.hand, 0.105, gear.gloves, dFore);
      else seg(a.wrist, a.hand, 0.085, col(st.hand || skin));
      if (gear.ledWrist) led(a.wrist, side === 'R' ? 0.045 : -0.045, side);
      if (gear.decals) { const m = (k) => ({ x: RT.lerp(a.elbow.x, a.wrist.x, k), y: RT.lerp(a.elbow.y, a.wrist.y, k), z: RT.lerp(a.elbow.z, a.wrist.z, k) }); band(m(0.55), m(0.75), 0.085, 'retro', dFore); }
    }
    function band(a, b, wm, kind, dRef) {
      const A = P(a), B = P(b);
      gearItems.push({ d: dRef != null ? dRef - 1e-4 : (A.D + B.D) / 2 - 0.01, f: () => {
        ctx.save(); ctx.lineCap = 'round';
        if (kind === 'fluor') {
          ctx.strokeStyle = col([214, 255, 30]); ctx.lineWidth = wm * s; ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke();
          if (fl > 0.01) RT.glow(ctx, (A.X + B.X) / 2, (A.Y + B.Y) / 2, s * 0.18, '214,255,30', 0.5 * fl);
        } else {
          ctx.strokeStyle = col([150, 154, 160]); ctx.lineWidth = wm * s; ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke();
          if (retro > 0.01) {
            ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = `rgba(255,250,225,${retro})`; ctx.shadowBlur = 20 * retro + 4;
            ctx.strokeStyle = `rgba(255,252,236,${retro})`; ctx.lineWidth = wm * s * 0.92; ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke();
            ctx.shadowBlur = 0; RT.glow(ctx, (A.X + B.X) / 2, (A.Y + B.Y) / 2, s * 0.26, '255,250,225', 0.5 * retro);
          }
        }
        ctx.restore();
      } });
    }
    function led(p3, dz, side) {
      const q = { x: p3.x, y: p3.y, z: p3.z + dz };
      const A = P(q), on = st.t == null ? 1 : (Math.sin((st.t + (side === 'R' ? 0 : 0.2)) * TAU * 2.2) > -0.3 ? 1 : 0.15);
      const vis = cam.facing({ x: 0, y: 0, z: Math.sign(dz) });
      gearItems.push({ d: A.D - 0.02, f: () => {
        ctx.fillStyle = '#2a0c0c'; ctx.fillRect(A.X - 0.022 * s, A.Y - 0.03 * s, 0.044 * s, 0.06 * s);
        const k = on * (0.45 + 0.55 * Math.max(0, vis));
        RT.glow(ctx, A.X, A.Y, s * 0.32, '255,40,30', k);
        ctx.fillStyle = `rgba(255,${on > 0.5 ? 175 : 60},${on > 0.5 ? 155 : 50},1)`; ctx.beginPath(); ctx.arc(A.X, A.Y, 0.017 * s, 0, TAU); ctx.fill();
      } });
    }
    // neck + head
    seg({ x: shC.x, y: shC.y, z: shC.z }, { x: pose.head.x - 0.02, y: pose.head.y - 0.1, z: pose.head.z }, 0.08, col(skin));
    const Hd = P(pose.head);
    items.push({ d: Hd.D, body: true, f: () => {
      ctx.fillStyle = col(skin); ctx.beginPath(); ctx.arc(Hd.X, Hd.Y, 0.105 * s, 0, TAU); ctx.fill();
      if (st.helmet) { ctx.fillStyle = col(st.helmet); ctx.beginPath(); ctx.ellipse(Hd.X, Hd.Y - 0.02 * s, 0.125 * s, 0.1 * s, 0, Math.PI, TAU); ctx.fill(); }
      else { ctx.fillStyle = col(st.hair || [45, 35, 28]); ctx.beginPath(); ctx.arc(Hd.X, Hd.Y - 0.015 * s, 0.108 * s, Math.PI * 1.05, Math.PI * 1.95); ctx.fill(); }
    } });

    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const all = items.concat(gearItems).sort((a, b) => b.d - a.d);
    for (const it of all) {
      ctx.globalAlpha = it.body ? bodyA : 1;
      if (it.body && bodyA <= 0.01) continue;
      it.f();
    }
    ctx.restore();
  };

  /* Bike through the same camera. */
  RT.drawBike = function (ctx, cam, pose, colr, alpha = 1) {
    const s = cam.o.s, P = (v) => cam.p(v);
    ctx.save(); ctx.globalAlpha *= alpha; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const R = 0.34, wheels = [{ x: -0.58, y: 0.34, z: 0 }, { x: 0.52, y: 0.34, z: 0 }];
    wheels.forEach((c) => {
      const C = P(c);
      ctx.strokeStyle = colr.tire; ctx.lineWidth = 0.04 * s;
      ctx.beginPath(); ctx.ellipse(C.X, C.Y, Math.max(0.02, R * Math.abs(cam.ca)) * s, R * s, 0, 0, TAU); ctx.stroke();
      if (Math.abs(cam.ca) > 0.3) {
        ctx.strokeStyle = colr.spoke; ctx.lineWidth = 1;
        for (let k = 0; k < 6; k++) {
          const a = pose.crank * 2.6 + (k * Math.PI) / 6;
          const p1 = P({ x: c.x + Math.cos(a) * R * 0.92, y: c.y + Math.sin(a) * R * 0.92, z: 0 }), p2 = P({ x: c.x - Math.cos(a) * R * 0.92, y: c.y - Math.sin(a) * R * 0.92, z: 0 });
          ctx.beginPath(); ctx.moveTo(p1.X, p1.Y); ctx.lineTo(p2.X, p2.Y); ctx.stroke();
        }
      }
    });
    const L2 = (a, b, wm) => { const A = P(a), B = P(b); ctx.strokeStyle = colr.frame; ctx.lineWidth = wm * s; ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke(); };
    const v = (x, y) => ({ x, y, z: 0 });
    L2(v(0, 0.3), v(-0.21, 0.9), 0.035); L2(v(-0.21, 0.88), v(0.4, 0.86), 0.035); L2(v(0, 0.3), v(0.43, 0.74), 0.038);
    L2(v(0, 0.3), wheels[0], 0.028); L2(v(-0.19, 0.84), wheels[0], 0.025); L2(v(0.4, 0.86), wheels[1], 0.028);
    L2(v(0.4, 0.86), v(0.47, 0.98), 0.03); L2({ x: 0.5, y: 1.0, z: -0.21 }, { x: 0.5, y: 1.0, z: 0.21 }, 0.03);
    L2(v(-0.33, 0.95), v(-0.12, 0.96), 0.045);
    ctx.restore();
  };

  /* Ground shadow / light pool helper under a figure. */
  RT.pool = function (ctx, x, y, rx, ry, rgb, a) {
    if (a <= 0.01) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
  };
  /* Night road seen from the driver's seat. k = headlights 0..1. opts: { lines, scroll, hz } returns horizon y.
     Headlights add two beam cones plus light spill pooling on the pavement. */
  RT.nightRoad = function (ctx, w, h, k, opts = {}) {
    const hz = h * (opts.hz || 0.42), cx = w / 2;
    const sky = ctx.createLinearGradient(0, 0, 0, hz);
    sky.addColorStop(0, '#03050a'); sky.addColorStop(1, '#0b111a');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, hz + 1);
    ctx.fillStyle = '#05070a'; ctx.fillRect(0, hz, w, h - hz);
    ctx.fillStyle = '#020304'; ctx.beginPath(); ctx.moveTo(0, hz);
    for (let x = 0; x <= w + 14; x += 14) ctx.lineTo(x, hz - 8 - 10 * Math.abs(Math.sin(x * 0.07)) - 6 * Math.abs(Math.sin(x * 0.19)));
    ctx.lineTo(w, hz); ctx.fill();
    // asphalt
    ctx.fillStyle = '#0c0f13';
    ctx.beginPath(); ctx.moveTo(cx - w * 0.05, hz); ctx.lineTo(cx + w * 0.05, hz); ctx.lineTo(cx + w * 1.0, h); ctx.lineTo(cx - w * 1.0, h); ctx.fill();
    if (k > 0.01) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      // beam cones
      for (const sx of [-1, 1]) {
        const ox = cx + sx * w * 0.2;
        const g = ctx.createLinearGradient(0, h, 0, hz);
        g.addColorStop(0, `rgba(255,240,205,${0.3 * k})`); g.addColorStop(0.55, `rgba(255,240,205,${0.1 * k})`); g.addColorStop(1, 'rgba(255,240,205,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ox - w * 0.16, h); ctx.lineTo(ox + w * 0.16, h); ctx.lineTo(cx + sx * w * 0.035 + w * 0.06, hz + 3); ctx.lineTo(cx + sx * w * 0.035 - w * 0.06, hz + 3); ctx.fill();
      }
      // light spill pooling on the pavement
      RT.pool(ctx, cx - w * 0.17, h * 0.97, w * 0.3, h * 0.12, '255,236,196', 0.32 * k);
      RT.pool(ctx, cx + w * 0.17, h * 0.97, w * 0.3, h * 0.12, '255,236,196', 0.32 * k);
      RT.pool(ctx, cx, hz + (h - hz) * 0.62, w * 0.5, (h - hz) * 0.22, '255,236,196', 0.16 * k);
      RT.pool(ctx, cx, hz + (h - hz) * 0.38, w * 0.4, (h - hz) * 0.12, '255,236,196', 0.08 * k);
      ctx.restore();
    }
    if (opts.lines !== false) {
      ctx.fillStyle = `rgba(230,225,200,${0.07 + 0.45 * k})`;
      for (let i = 0; i < 9; i++) {
        const z = (i + ((opts.scroll || 0) % 1)) / 9, z2 = z + 0.045;
        const y1 = hz + (h - hz) * z * z, y2 = hz + (h - hz) * z2 * z2, a = 1 + 5 * z, b = 1 + 5 * z2;
        ctx.beginPath(); ctx.moveTo(cx - a / 2, y1); ctx.lineTo(cx + a / 2, y1); ctx.lineTo(cx + b / 2, y2); ctx.lineTo(cx - b / 2, y2); ctx.fill();
      }
    }
    return hz;
  };
})();
