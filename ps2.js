// PS2 main-theme backdrop: a black void with a slowly orbiting field of translucent blue
// light towers (the boot-screen pillars) and drifting light orbs, softened by depth fog.
// Sets tint the field neon red at the core; breaks drain it to grey (via CSS filter).
// Runs at ~30 fps and pauses while the tab is hidden.
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

  let seed = 2000;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  // Towers on a grid, heights clustered like the boot screen (taller near the middle).
  const towers = [];
  const N = 7, GAP = 1.15;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    if (rnd() < .28) continue;
    const x = (i - (N - 1) / 2) * GAP, z = (j - (N - 1) / 2) * GAP;
    const d = Math.hypot(x, z);
    const h = Math.max(.3, (3.6 - d * .55) * (.45 + rnd() * .75));
    towers.push({ x, z, h, w: .32 + rnd() * .14, ph: rnd() * Math.PI * 2, sp: .4 + rnd() * .8 });
  }
  const orbs = Array.from({ length: 34 }, () => ({
    x: (rnd() - .5) * 10, y: rnd() * 5 - .5, z: (rnd() - .5) * 10,
    r: .02 + rnd() * .06, ph: rnd() * Math.PI * 2, vy: .05 + rnd() * .12
  }));

  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(1.5, devicePixelRatio || 1) * .6;   // soft, slightly low-res like a PS2 frame
    W = Math.round(innerWidth * DPR); H = Math.round(innerHeight * DPR);
    cv.width = W; cv.height = H;
  }

  let flash = 0;
  function pulse(p = 1) { flash = Math.max(flash, p); }
  window.PS2 = { glitch: pulse, pulse };

  function draw(t) {
    const sec = t / 1000;
    const phase = document.body.dataset.phase || "";
    const working = phase === "work" || phase === "idle";

    // void + faint floor fog
    ctx.globalCompositeOperation = "source-over";
    const bg = ctx.createRadialGradient(W * .5, H * .62, 0, W * .5, H * .62, Math.max(W, H) * .75);
    bg.addColorStop(0, "#071526");
    bg.addColorStop(.55, "#02060d");
    bg.addColorStop(1, "#000000");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // camera orbiting the field
    const ang = sec * .06, ca = Math.cos(ang), sa = Math.sin(ang);
    const camY = 2.6 + Math.sin(sec * .11) * .25, camD = 11;
    const pitch = .32, cp = Math.cos(pitch), sp = Math.sin(pitch);
    const f = Math.min(W, H) * 1.15;
    const cx = W * .5, cy = H * .5;
    const proj = (x, y, z) => {
      const rx = x * ca - z * sa, rz = x * sa + z * ca;          // orbit
      const yy = y - camY, zz = rz + camD;
      const py = yy * cp - zz * sp, pz = yy * sp + zz * cp;       // pitch down
      if (pz <= .1) return null;
      return { x: cx + rx * f / pz, y: cy - py * f / pz, s: f / pz, z: pz };
    };

    // towers, far to near, additive light
    const list = towers.map(tw => {
      const grow = tw.h * (.92 + .08 * Math.sin(sec * tw.sp + tw.ph));
      const b = proj(tw.x, 0, tw.z), top = proj(tw.x, grow, tw.z);
      return b && top ? { tw, b, top } : null;
    }).filter(Boolean).sort((a, b) => b.b.z - a.b.z);

    ctx.globalCompositeOperation = "lighter";
    for (const { tw, b, top } of list) {
      const fog = Math.max(0, Math.min(1, 1.6 - b.z / 14)) * Math.max(0, Math.min(1, (b.z - 6) / 3)) * .8;
      const w = Math.max(1, tw.w * b.s);
      const x = b.x - w / 2, y0 = top.y, y1 = b.y;
      const core = working ? [120, 170, 255] : [140, 180, 255];
      const g = ctx.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, `rgba(${core},${.55 * fog})`);
      g.addColorStop(.25, `rgba(40,110,255,${.22 * fog})`);
      g.addColorStop(1, `rgba(20,60,200,${.05 * fog})`);
      ctx.fillStyle = g;
      ctx.fillRect(x, y0, w, y1 - y0);
      // edges
      ctx.fillStyle = `rgba(150,200,255,${.25 * fog})`;
      ctx.fillRect(x, y0, 1, y1 - y0);
      ctx.fillRect(x + w - 1, y0, 1, y1 - y0);
      // glowing cap
      const capR = w * 1.6;
      const cg = ctx.createRadialGradient(b.x, y0, 0, b.x, y0, capR);
      cg.addColorStop(0, `rgba(200,225,255,${.55 * fog})`);
      cg.addColorStop(1, "rgba(60,120,255,0)");
      ctx.fillStyle = cg;
      ctx.fillRect(b.x - capR, y0 - capR, capR * 2, capR * 2);
      // floor reflection
      const rg = ctx.createLinearGradient(0, y1, 0, y1 + (y1 - y0) * .5);
      rg.addColorStop(0, `rgba(40,110,255,${.12 * fog})`);
      rg.addColorStop(1, "rgba(40,110,255,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(x, y1, w, (y1 - y0) * .5);
    }

    // a red heart in the field while working (sets glow red)
    if (working) {
      const c = proj(0, 1.2, 0);
      if (c) {
        const R = c.s * 2.2;
        const rg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, R);
        rg.addColorStop(0, "rgba(255,70,95,.16)");
        rg.addColorStop(1, "rgba(255,70,95,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(c.x - R, c.y - R, R * 2, R * 2);
      }
    }

    // drifting light orbs
    for (const o of orbs) {
      const y = ((o.y + sec * o.vy) % 5.5) - .5;
      const p = proj(o.x + Math.sin(sec * .3 + o.ph) * .3, y, o.z + Math.cos(sec * .25 + o.ph) * .3);
      if (!p) continue;
      const tw = .55 + .45 * Math.sin(sec * 2 + o.ph * 3);
      const R = Math.max(1.5, o.r * p.s * 4);
      const og = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
      og.addColorStop(0, `rgba(220,235,255,${.7 * tw})`);
      og.addColorStop(.35, `rgba(90,150,255,${.25 * tw})`);
      og.addColorStop(1, "rgba(60,120,255,0)");
      ctx.fillStyle = og;
      ctx.fillRect(p.x - R, p.y - R, R * 2, R * 2);
    }

    // bloom flash on transitions
    if (flash > .01) {
      ctx.fillStyle = `rgba(120,170,255,${flash * .35})`;
      ctx.fillRect(0, 0, W, H);
      flash *= .86;
    }
    ctx.globalCompositeOperation = "source-over";
  }

  let last = 0;
  function loop(t) {
    requestAnimationFrame(loop);
    if (document.hidden || t - last < 1000 / 30) return;
    last = t;
    draw(t);
  }

  resize();
  addEventListener("resize", () => { resize(); if (reduced) draw(0); });
  if (reduced) draw(0); else requestAnimationFrame(loop);

  // Light bloom on view changes and every set/break switch.
  const views = ["home", "list", "pad"].map(id => document.getElementById(id)).filter(Boolean);
  const viewObs = new MutationObserver(() => pulse(.8));
  views.forEach(v => viewObs.observe(v, { attributes: true, attributeFilter: ["hidden"] }));
  let lastPhase = document.body.dataset.phase;
  new MutationObserver(() => {
    const p = document.body.dataset.phase;
    if (p !== lastPhase && p) pulse(1);
    lastPhase = p;
  }).observe(document.body, { attributes: true, attributeFilter: ["data-phase"] });
})();
