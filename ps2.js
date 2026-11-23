// PS2 night-city backdrop: a low-resolution canvas (upscaled with hard pixels) of a wet teal
// city at night — parallax towers, flickering windows, neon billboards, a rippling street
// reflection and datamosh smears. Runs at 24 fps and pauses when the tab is hidden.
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cv = document.createElement("canvas");
  cv.id = "scene";
  cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);
  const crt = document.createElement("div");
  crt.className = "crt";
  crt.setAttribute("aria-hidden", "true");
  document.body.appendChild(crt);

  const ctx = cv.getContext("2d", { alpha: false });
  ctx.imageSmoothingEnabled = false;

  // Seeded random so the skyline is the same on every visit.
  let seed = 20261123;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  let W = 144, H = 300, horizon = 170, layers = [], clouds = [];

  function build() {
    seed = 20261123;
    const conf = [
      { hMin: .10, hMax: .22, wMin: 5, wMax: 12, speed: 0.6, color: [7, 26, 38], win: .18 },
      { hMin: .16, hMax: .36, wMin: 7, wMax: 16, speed: 1.4, color: [5, 19, 29], win: .26 },
      { hMin: .24, hMax: .55, wMin: 12, wMax: 26, speed: 2.6, color: [3, 12, 19], win: .32 }
    ];
    layers = conf.map((c, d) => {
      const span = W * 2.4, bs = [];
      let x = 0;
      while (x < span) {
        const w = Math.round(c.wMin + rnd() * (c.wMax - c.wMin));
        const h = Math.round(horizon * (c.hMin + rnd() * (c.hMax - c.hMin)) * 1.6);
        const wins = [];
        for (let yy = 3; yy < h - 2; yy += 3) for (let xx = 2; xx < w - 1; xx += 2) {
          if (rnd() < c.win) wins.push({ x: xx, y: yy, warm: rnd() < .08, a: .35 + rnd() * .6, f: rnd() < .06 });
        }
        const sign = d > 0 && rnd() < (d === 2 ? .22 : .1)
          ? { y: Math.round(h * (.15 + rnd() * .35)), h: 3 + Math.round(rnd() * 6), red: rnd() < .35 } : null;
        bs.push({ x, w, h, wins, sign, antenna: rnd() < .25 ? 2 + Math.round(rnd() * 6) : 0 });
        x += w + Math.round(rnd() * 3);
      }
      return { ...c, bs, span: x };
    });
    clouds = Array.from({ length: 7 }, () => ({ x: rnd() * W, y: rnd() * horizon * .55, r: 18 + rnd() * 40, a: .05 + rnd() * .08, s: .6 + rnd() * 1.4 }));
  }

  function resize() {
    W = Math.round(Math.max(120, Math.min(200, innerWidth / 2.8)));
    H = Math.round(W * innerHeight / innerWidth);
    horizon = Math.round(H * .6);
    cv.width = W; cv.height = H;
    ctx.imageSmoothingEnabled = false;
    build();
  }

  // ---- glitch state ----
  let glitchUntil = 0, glitchPower = 0, nextIdle = performance.now() + 3000;
  function glitch(power = 1, ms = 360) {
    glitchUntil = performance.now() + ms;
    glitchPower = power;
  }
  window.PS2 = { glitch };

  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  function draw(t) {
    const phase = document.body.dataset.phase || "";
    const working = phase === "work" || phase === "idle";
    const sec = t / 1000;

    // sky
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, "#01050a");
    sky.addColorStop(.55, "#061f2e");
    sky.addColorStop(1, "#0d4458");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, horizon);

    // slow clouds
    for (const c of clouds) {
      const x = ((c.x + sec * c.s) % (W + c.r * 2)) - c.r;
      const g = ctx.createRadialGradient(x, c.y, 0, x, c.y, c.r);
      g.addColorStop(0, `rgba(70,170,200,${c.a})`);
      g.addColorStop(1, "rgba(70,170,200,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - c.r, c.y - c.r, c.r * 2, c.r * 2);
    }

    // horizon haze
    const haze = ctx.createLinearGradient(0, horizon - 40, 0, horizon);
    haze.addColorStop(0, "rgba(60,200,230,0)");
    haze.addColorStop(1, "rgba(60,200,230,.22)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizon - 40, W, 40);

    // towers, far to near
    for (const L of layers) {
      const off = (sec * L.speed) % L.span;
      for (let rep = 0; rep < 2; rep++) {
        for (const b of L.bs) {
          const x = Math.round(b.x - off + rep * L.span - W * .2);
          if (x > W || x + b.w < 0) continue;
          const y = horizon - b.h;
          ctx.fillStyle = rgba(L.color, 1);
          ctx.fillRect(x, y, b.w, b.h);
          ctx.fillStyle = "rgba(120,230,255,.10)";
          ctx.fillRect(x, y, b.w, 1);
          if (b.antenna) { ctx.fillStyle = rgba(L.color, 1); ctx.fillRect(x + (b.w >> 1), y - b.antenna, 1, b.antenna); }
          for (const w of b.wins) {
            let a = w.a;
            if (w.f) a *= (Math.sin(sec * 7 + w.x * 3 + w.y) > .2 ? 1 : .15);
            ctx.fillStyle = w.warm ? `rgba(255,214,160,${a * .8})` : `rgba(130,235,255,${a})`;
            ctx.fillRect(x + w.x, y + w.y, 1, 1);
          }
          if (b.sign) {
            const red = b.sign.red && working;
            const flick = Math.sin(sec * 11 + b.x) > -.85 ? 1 : .3;
            ctx.fillStyle = red ? `rgba(255,80,96,${.85 * flick})` : `rgba(90,235,255,${.85 * flick})`;
            ctx.fillRect(x + 1, y + b.sign.y, b.w - 2, b.sign.h);
            ctx.fillStyle = red ? "rgba(255,80,96,.18)" : "rgba(90,235,255,.18)";
            ctx.fillRect(x - 2, y + b.sign.y - 2, b.w + 4, b.sign.h + 4);
          }
        }
      }
    }

    // street + rippling reflection (row by row, offset by a wave)
    ctx.fillStyle = "#02070b";
    ctx.fillRect(0, horizon, W, H - horizon);
    const depth = H - horizon;
    for (let y = 0; y < depth; y++) {
      const src = horizon - 1 - Math.floor(y * 1.05);
      if (src < 0) break;
      const k = y / depth;
      const wave = Math.sin(y * .55 + sec * 2.2) * (0.6 + k * 2.4) + Math.sin(y * .13 - sec * 1.3) * k * 2;
      ctx.globalAlpha = .55 * (1 - k * .75);
      ctx.drawImage(cv, 0, src, W, 1, Math.round(wave), horizon + y, W, 1);
    }
    ctx.globalAlpha = 1;
    const floor = ctx.createLinearGradient(0, horizon, 0, H);
    floor.addColorStop(0, "rgba(2,8,12,0)");
    floor.addColorStop(1, "rgba(1,4,7,.85)");
    ctx.fillStyle = floor;
    ctx.fillRect(0, horizon, W, H - horizon);
    // puddle sheen
    const sheen = ctx.createRadialGradient(W * .55, horizon + depth * .35, 0, W * .55, horizon + depth * .35, W * .5);
    sheen.addColorStop(0, "rgba(90,220,240,.16)");
    sheen.addColorStop(1, "rgba(90,220,240,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, horizon, W, depth);

    // datamosh: horizontal smears and block shifts
    const now = performance.now();
    if (!reduced && now > nextIdle) { glitch(.45, 220 + Math.random() * 260); nextIdle = now + 3500 + Math.random() * 6000; }
    if (!reduced && now < glitchUntil) {
      const n = Math.round(2 + glitchPower * 6);
      for (let i = 0; i < n; i++) {
        const y = Math.floor(Math.random() * H), h = 1 + Math.floor(Math.random() * (3 + glitchPower * 10));
        if (Math.random() < .55) {
          const x0 = Math.floor(Math.random() * W), len = 6 + Math.floor(Math.random() * W * .6 * glitchPower);
          ctx.drawImage(cv, x0, y, 1, h, x0, y, len, h);          // pixel-drag smear
        } else {
          const dx = Math.round((Math.random() - .5) * 30 * glitchPower);
          ctx.drawImage(cv, 0, y, W, h, dx, y, W, h);             // band shift
        }
      }
    }
  }

  let last = 0, raf = 0;
  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (document.hidden || t - last < 1000 / 24) return;
    last = t;
    draw(t);
  }

  resize();
  addEventListener("resize", () => { resize(); if (reduced) draw(0); });
  if (reduced) draw(0); else raf = requestAnimationFrame(loop);

  // Glitch on view changes and on every set/break switch.
  const views = ["home", "list", "pad"].map(id => document.getElementById(id)).filter(Boolean);
  let vgT = 0;
  const viewObs = new MutationObserver(() => {
    glitch(1, 380);
    if (reduced) return;
    clearTimeout(vgT);
    document.body.classList.remove("vglitch"); void document.body.offsetWidth; document.body.classList.add("vglitch");
    vgT = setTimeout(() => document.body.classList.remove("vglitch"), 420);
  });
  views.forEach(v => viewObs.observe(v, { attributes: true, attributeFilter: ["hidden"] }));
  let lastPhase = document.body.dataset.phase;
  new MutationObserver(() => {
    const p = document.body.dataset.phase;
    if (p !== lastPhase && p) glitch(1.2, 480);
    lastPhase = p;
  }).observe(document.body, { attributes: true, attributeFilter: ["data-phase"] });
  void views;
})();
