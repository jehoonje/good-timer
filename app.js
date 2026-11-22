(() => {
  /* ---------- Data ---------- */
  const PARTS = {
    back:     { name: "Back",      tone: "--t-back",     view: "back" },
    chest:    { name: "Chest",     tone: "--t-chest",    view: "front" },
    shoulder: { name: "Shoulders", tone: "--t-shoulder", view: "front" },
    legs:     { name: "Legs",      tone: "--t-legs",     view: "front" }
  };
  // [id, name, equipment, primary target]
  const EX = {
    back: [
      ["deadlift", "Deadlift", "barbell", "Lower back · Glutes"],
      ["pull-up", "Pull-up", "body", "Lats"],
      ["lat-pulldown", "Lat Pulldown", "cable", "Lats"],
      ["barbell-row", "Barbell Row", "barbell", "Lats · Rhomboids"],
      ["one-arm-db-row", "One-Arm Dumbbell Row", "dumbbell", "Lats"],
      ["seated-cable-row", "Seated Cable Row", "cable", "Mid back"],
      ["t-bar-row", "T-Bar Row", "barbell", "Mid back"],
      ["straight-arm-pulldown", "Straight-Arm Pulldown", "cable", "Lats"],
      ["hyperextension", "Back Extension", "body", "Lower back"],
      ["shrug", "Shrug", "dumbbell", "Traps"]
    ],
    chest: [
      ["bench-press", "Bench Press", "barbell", "Pecs"],
      ["incline-bench", "Incline Bench Press", "barbell", "Upper chest"],
      ["decline-bench", "Decline Bench Press", "barbell", "Lower chest"],
      ["db-press", "Dumbbell Press", "dumbbell", "Pecs"],
      ["incline-db-press", "Incline Dumbbell Press", "dumbbell", "Upper chest"],
      ["db-fly", "Dumbbell Fly", "dumbbell", "Inner chest"],
      ["cable-crossover", "Cable Crossover", "cable", "Inner chest"],
      ["chest-press", "Machine Chest Press", "machine", "Pecs"],
      ["pec-deck", "Pec Deck", "machine", "Inner chest"],
      ["dips", "Dips", "body", "Lower chest · Triceps"],
      ["push-up", "Push-up", "body", "Pecs"]
    ],
    shoulder: [
      ["ohp", "Overhead Press", "barbell", "Front · Side delts"],
      ["db-shoulder-press", "Dumbbell Shoulder Press", "dumbbell", "Front delts"],
      ["arnold-press", "Arnold Press", "dumbbell", "All delts"],
      ["machine-shoulder-press", "Machine Shoulder Press", "machine", "Front delts"],
      ["lateral-raise", "Lateral Raise", "dumbbell", "Side delts"],
      ["cable-lateral-raise", "Cable Lateral Raise", "cable", "Side delts"],
      ["front-raise", "Front Raise", "dumbbell", "Front delts"],
      ["rear-delt-fly", "Rear Delt Fly", "dumbbell", "Rear delts"],
      ["face-pull", "Face Pull", "cable", "Rear delts"],
      ["upright-row", "Upright Row", "barbell", "Side delts · Traps"]
    ],
    legs: [
      ["back-squat", "Back Squat", "barbell", "Quads · Glutes"],
      ["front-squat", "Front Squat", "barbell", "Quads"],
      ["leg-press", "Leg Press", "machine", "Quads"],
      ["hack-squat", "Hack Squat", "machine", "Quads"],
      ["rdl", "Romanian Deadlift", "barbell", "Hamstrings · Glutes"],
      ["lunge", "Lunge", "dumbbell", "Quads · Glutes"],
      ["bulgarian-split-squat", "Bulgarian Split Squat", "dumbbell", "Quads · Glutes"],
      ["leg-extension", "Leg Extension", "machine", "Quads"],
      ["leg-curl", "Leg Curl", "machine", "Hamstrings"],
      ["hip-thrust", "Hip Thrust", "barbell", "Glutes"],
      ["calf-raise", "Calf Raise", "machine", "Calves"]
    ]
  };
  const EQUIP = {
    barbell: ["Barbell", '<path d="M2 12h20"/><rect x="4" y="7" width="3" height="10" rx="1"/><rect x="17" y="7" width="3" height="10" rx="1"/>'],
    dumbbell: ["Dumbbell", '<path d="M8 12h8"/><rect x="4" y="8" width="4" height="8" rx="1.5"/><rect x="16" y="8" width="4" height="8" rx="1.5"/>'],
    cable: ["Cable", '<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V17"/><path d="M8 19h8"/>'],
    machine: ["Machine", '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h6"/>'],
    body: ["Bodyweight", '<circle cx="12" cy="5" r="2.2"/><path d="M12 8v7M8 11h8M12 15l-3 5M12 15l3 5"/>']
  };
  const findEx = id => { for (const p in EX) for (const e of EX[p]) if (e[0] === id) return { id: e[0], name: e[1], equip: e[2], target: e[3], part: p }; return null; };

  /* ---------- Figure ---------- */
  // Anatomy chart: left half drawn once, mirrored for the right. Each muscle names the part it belongs to.
  const FRONT = [
    ["", "M44.5 27 Q39 30 34 32.5 L44 32 Z"],
    ["shoulder", "M35 32.5 Q26 33 24.5 44 Q26.5 47.5 29.5 47 Q30.5 39 36.5 35.5 Z", "M33 34.5 Q28 37 26.5 43 M31 34 Q29 39 28.5 45"],
    ["chest", "M49.2 34.5 L38 35.5 Q31.5 39 32 47.5 Q38.5 53.5 49.2 50.5 Z", "M48 37.5 Q40 40 34 46 M48.5 42 Q41 44 35.5 49 M48.5 46.5 Q43 48 38.5 51"],
    ["", "M24.5 47.5 Q22 55 23 63 L28.5 63 Q30.5 55 30 48.5 Z"],
    ["", "M23 65 Q19.5 75 19.5 85 L23.5 85.5 Q27.5 75 28.5 65 Z"],
    ["", "M33 50 Q32.5 64 36 80 L42.5 83 L42.5 54 Q37 54 33 50 Z"],
    ["", "M43.6 53 h5.6 v6.5 h-5.6 Z"],
    ["", "M43.6 60.5 h5.6 v6.5 h-5.6 Z"],
    ["", "M43.6 68 h5.6 v6.5 h-5.6 Z"],
    ["", "M43.6 75.5 L49.2 75.5 L49.2 88 Q45 84 43.6 80 Z"],
    ["legs", "M42 88 Q35 96 35.5 110 Q36.5 120 39 125 L44 124 Q47.5 110 48.5 94 Q46 90 42 88 Z", "M42.5 92 Q39 106 40.5 122 M46 96 Q44 108 42.5 121"],
    ["legs", "M49 93 Q48.5 104 46.5 112 L49.2 108 Z"],
    ["legs", "M46.5 113 Q49.5 119 46 126.5 L43.8 124.5 Q45 118 46.5 113 Z"],
    ["legs", "M38.5 132 Q36 143 38.5 157 L41.2 158 Q40.8 144 41.8 132 Z"],
    ["legs", "M42.8 132 Q46.2 142 44.2 157 L42.2 158 Q41.8 145 42.8 132 Z"]
  ];
  const BACK = [
    ["back", "M50 22 L50 60 Q46.5 51 43.5 41 L35 33 Q42 29.5 46 24 Z", "M48 27 Q43 32 37 33.5 M49 36 Q46 40 44.5 44"],
    ["shoulder", "M35 32.5 Q26 33 24.5 44 Q26.5 47.5 29.5 47 Q30.5 39 36.5 35.5 Z"],
    ["back", "M43 41.5 Q37.5 37.5 34 41 Q34.5 47 40.5 49.5 L44.5 46.5 Z"],
    ["back", "M34 48.5 Q32.5 60 37 72 Q42 78.5 47.6 80.5 L47.2 63 Q44 53 40.5 50.5 Z", "M36 54 Q39 64 46 76 M39 52 Q42 61 47 70"],
    ["back", "M48.6 61.5 L49.4 61.5 L49.4 88 L46.6 88 Q47.6 74 48.6 61.5 Z"],
    ["", "M24.5 47.5 Q22 55 23 63 L28.5 63 Q30.5 55 30 48.5 Z"],
    ["", "M23 65 Q19.5 75 19.5 85 L23.5 85.5 Q27.5 75 28.5 65 Z"],
    ["legs", "M49.4 89 Q40 86 37 93.5 Q37.5 101 43 103 Q48 103 49.4 100 Z"],
    ["legs", "M48.5 104.5 Q40 103.5 37 106.5 Q35.5 116 39 126 L44 126 Q48 116 48.5 104.5 Z", "M42.5 105 Q41.5 115 41.5 125"],
    ["legs", "M38.5 131 Q35 140 38 150 L43.5 151 Q46.5 140 44.5 131 Z"]
  ];
  const SKIN = `
    <path class="sk" d="M45 21 L55 21 L56.5 30 L43.5 30 Z"/>
    <ellipse class="sk" cx="50" cy="13" rx="8.2" ry="10"/>`;
  const SKIN_HALF = `
    <ellipse class="sk" cx="21.2" cy="90.5" rx="3.1" ry="5"/>
    <ellipse class="sk" cx="41.6" cy="128.5" rx="3.4" ry="3"/>
    <path class="sk" d="M39.5 151.5 L42.8 151.5 L42.4 159.5 L39.8 159.5 Z"/>
    <ellipse class="sk" cx="41" cy="163" rx="4" ry="2.4"/>`;
  function figure(part) {
    const set = PARTS[part].view === "back" ? BACK : FRONT;
    const half = SKIN_HALF + set.map(([k, d, fib]) => {
      const on = k === part;
      return `<path class="${on ? "m hl" : "m"}" d="${d}"/>${on && fib ? `<path class="hl-fib" d="${fib}"/>` : ""}`;
    }).join("");
    return `<svg class="figure" viewBox="0 0 100 170" style="--pt:var(${PARTS[part].tone})" aria-hidden="true">
      ${SKIN}<g>${half}</g><g transform="translate(100 0) scale(-1 1)">${half}</g></svg>`;
  }

  /* ---------- State ---------- */
  const KEY = "set-break-timer-v3";
  const HKEY = "set-break-sessions-v1";
  const iso = t => t ? new Date(t).toISOString() : null;
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() :
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); }));

  const $ = id => document.getElementById(id);
  const fresh = (ex = null) => ({ ex, phase: "idle", set: 1, t0: 0, startedAt: 0, sets: [], breaks: [] });
  let s = fresh();
  try { const saved = JSON.parse(localStorage.getItem(KEY)); if (saved && saved.phase) s = saved; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  const active = () => s.ex && s.phase !== "idle";

  const loadHistory = () => { try { return JSON.parse(localStorage.getItem(HKEY)) || []; } catch (e) { return []; } };
  const saveHistory = h => { try { localStorage.setItem(HKEY, JSON.stringify(h)); } catch (e) {} };

  const split = ms => {
    ms = Math.max(0, ms);
    const cs = Math.floor(ms / 10) % 100, t = Math.floor(ms / 1000);
    return [Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"), "." + String(cs).padStart(2, "0")];
  };
  const fmt = ms => split(ms).join("");
  const fmtShort = ms => split(ms)[0];

  /* ---------- Views & motion ---------- */
  let view = "home", curPart = null;
  const setTone = part => document.body.style.setProperty("--tone", part ? `var(${PARTS[part].tone})` : "var(--cool)");
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show(v) {
    view = v;
    $("home").hidden = v !== "home";
    $("list").hidden = v !== "list";
    $("pad").hidden = v !== "timer";
    document.body.classList.toggle("lock", v === "timer");
    document.body.dataset.phase = v === "timer" ? s.phase : "";
    window.scrollTo(0, 0);
  }

  // Run a view change with a View Transition (shared hero figure + directional slide), or a CSS fallback.
  let navBusy = false;
  function go(dir, update) {
    if (navBusy) return;
    if (reduced() || !document.startViewTransition) {
      update();
      const el = { home: $("home"), list: $("list"), timer: $("pad") }[view];
      if (!reduced() && el) {
        el.classList.remove("enter", "enter-back"); void el.offsetWidth;
        el.classList.add(dir === "back" ? "enter-back" : "enter");
      }
      return;
    }
    navBusy = true;
    document.documentElement.dataset.dir = dir;
    const t = document.startViewTransition(update);
    t.finished.finally(() => {
      navBusy = false;
      document.querySelectorAll("[data-vt]").forEach(el => { el.style.viewTransitionName = ""; el.removeAttribute("data-vt"); });
    });
  }
  const nameHero = el => { if (el) { el.style.viewTransitionName = "hero-fig"; el.setAttribute("data-vt", ""); } };

  function renderHome() {
    $("parts").innerHTML = Object.keys(PARTS).map((k, i) => `
      <button class="card part rise" type="button" data-part="${k}" style="--pt:var(${PARTS[k].tone});--i:${i}">
        <div class="fig">${figure(k)}</div>
        <div class="label">
          <div class="name">${PARTS[k].name}</div>
          <span class="count">${EX[k].length} exercises</span>
        </div>
      </button>`).join("");
    renderResume();
    setTone(active() ? s.ex.part : null);
    show("home");
  }

  function renderResume() {
    const slot = $("resumeSlot");
    if (!active()) { slot.innerHTML = ""; return; }
    const ex = findEx(s.ex.id);
    const state = s.phase === "rest" ? `Set ${s.set} complete · Resting` : `Set ${s.set} in progress`;
    slot.innerHTML = `<button class="resume rise" type="button" id="resumeBtn" style="--tone:var(${PARTS[ex.part].tone})">
      <span><i class="dot"></i><span><b>${ex.name}</b><small>${state}</small></span></span><span class="t" id="resumeT"></span></button>`;
  }

  function lastFor(id) {
    const r = loadHistory().find(r => r.exercise_id === id);
    if (!r) return "";
    const d = new Date(r.started_at);
    return `Last ${d.getMonth() + 1}/${d.getDate()} · ${r.set_count} sets`;
  }

  function renderList(part) {
    curPart = part;
    const P = PARTS[part];
    setTone(part);
    $("listFig").innerHTML = figure(part);
    $("listFig").style.setProperty("--pt", `var(${P.tone})`);
    $("listTitle").textContent = P.name;
    $("listSub").textContent = `${EX[part].length} exercises`;
    $("exs").innerHTML = EX[part].map(([id, name, eq, target], i) => `
      <button class="card ex rise${active() && s.ex.id === id ? " active" : ""}" type="button" data-ex="${id}" style="--pt:var(${P.tone});--i:${i}">
        <span class="glyph"><svg viewBox="0 0 24 24">${EQUIP[eq][1]}</svg></span>
        <span><div class="name">${name}</div><div class="tags">${EQUIP[eq][0]} · ${target}</div></span>
        <span class="last">${active() && s.ex.id === id ? "In progress" : lastFor(id)}</span>
      </button>`).join("");
    show("list");
  }

  function openTimer(id) {
    const ex = findEx(id);
    if (!s.ex || s.ex.id !== id) { s = fresh({ id: ex.id, name: ex.name, part: ex.part }); save(); }
    curPart = ex.part;
    setTone(ex.part);
    $("exName").textContent = ex.name;
    show("timer");
    renderStatus();
  }

  let toastT = null;
  function toast(msg) {
    const t = $("toast"); t.hidden = true; void t.offsetWidth; t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2200);
  }

  document.addEventListener("click", e => {
    const p = e.target.closest("[data-part]");
    if (p) { nameHero(p.querySelector(".fig")); return go("fwd", () => renderList(p.dataset.part)); }
    const x = e.target.closest("[data-ex]");
    if (x) {
      if (active() && s.ex.id !== x.dataset.ex) {
        toast(`Finish ${s.ex.name} first`);
        const r = $("resumeBtn"); if (r) { r.classList.remove("pulse"); void r.offsetWidth; r.classList.add("pulse"); }
        return;
      }
      return go("fwd", () => openTimer(x.dataset.ex));
    }
    if (e.target.closest("#resumeBtn")) return go("fwd", () => openTimer(s.ex.id));
    if (e.target.closest("[data-history]")) { e.stopPropagation(); return openSheet(); }
  });
  $("listBack").addEventListener("click", () => go("back", () => {
    const from = curPart;
    renderHome();
    nameHero(document.querySelector(`[data-part="${from}"] .fig`));
  }));
  $("timerBack").addEventListener("click", e => {
    e.stopPropagation();
    if (!active()) s = fresh(), save();
    go("back", () => renderList(curPart));
  });

  /* ---------- Timer ---------- */
  const pad = $("pad"), statusEl = $("status"), hintEl = $("hint"), endBtn = $("endBtn");

  const hintFor = () => s.phase === "rest" ? "Double-tap to start the next set" : "Double-tap when the set is done";
  function renderStatus() {
    if (view === "timer") document.body.dataset.phase = s.phase;
    let html = "";
    if (s.phase === "idle") {
      html = `<div class="line now">Set 1 in progress</div>`;
      $("setLabel").textContent = "SET 1";
    } else if (s.phase === "rest") {
      html = `<div class="line done">Set ${s.set} complete</div><div class="line now" style="--i:1">Break ${s.set} in progress</div>`;
      $("setLabel").textContent = "BREAK " + s.set;
    } else {
      html = `<div class="line done">Set ${s.set - 1} complete</div><div class="line done" style="--i:1">Break complete</div>
              <div class="line now" style="--i:2">Set ${s.set} in progress</div><div class="sub" id="setElapsed"></div>`;
      $("setLabel").textContent = "SET " + s.set;
    }
    hintEl.textContent = hintFor();
    statusEl.innerHTML = html;
    $("log").innerHTML = s.breaks.map(b => `<span><b>${b.n}</b>${fmt(b.duration_ms)}</span>`).join("");
    endBtn.disabled = s.phase === "idle";
    $("timerBack").hidden = s.phase !== "idle";
  }

  const mmEl = $("mm"), csEl = $("cs");
  function frame() {
    const now = Date.now();
    if (view === "timer") {
      let ms = 0;
      if (s.phase === "rest") ms = now - s.t0;
      else if (s.phase === "work") {
        const last = s.breaks[s.breaks.length - 1];
        ms = last ? last.duration_ms : 0;
        const el = $("setElapsed");
        if (el) el.textContent = "Set time " + fmtShort(now - s.t0);
      }
      const [a, b] = split(ms);
      if (mmEl.textContent !== a) mmEl.textContent = a;
      if (csEl.textContent !== b) csEl.textContent = b;
    } else if (view === "home") {
      const r = $("resumeT");
      if (r && active()) r.textContent = fmtShort(now - s.t0);
    }
    requestAnimationFrame(frame);
  }

  let wake = null;
  async function keepAwake() {
    try { if ("wakeLock" in navigator && !wake) { wake = await navigator.wakeLock.request("screen"); wake.addEventListener("release", () => wake = null); } } catch (e) {}
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden && active()) keepAwake(); });

  function advance() {
    const now = Date.now();
    if (s.phase === "idle") {
      s.startedAt = now;
      s.sets.push({ n: 1, started_at: null, ended_at: iso(now), duration_ms: null });
      s.phase = "rest"; s.t0 = now;
    } else if (s.phase === "work") {
      s.sets.push({ n: s.set, started_at: iso(s.t0), ended_at: iso(now), duration_ms: now - s.t0 });
      s.phase = "rest"; s.t0 = now;
    } else {
      s.breaks.push({ n: s.set, started_at: iso(s.t0), ended_at: iso(now), duration_ms: now - s.t0 });
      s.set += 1; s.phase = "work"; s.t0 = now;
    }
    try { navigator.vibrate && navigator.vibrate(25); } catch (e) {}
    keepAwake(); save(); renderStatus();
  }

  const GAP = 380;
  let lastTap = 0, armT = null;
  pad.addEventListener("pointerup", e => {
    if (e.target.closest("button")) return;
    const now = performance.now();
    if (now - lastTap < GAP) {
      lastTap = 0; delete pad.dataset.armed; clearTimeout(armT); advance();
    } else {
      lastTap = now; pad.dataset.armed = ""; hintEl.textContent = "Tap again";
      clearTimeout(armT);
      armT = setTimeout(() => { delete pad.dataset.armed; hintEl.textContent = hintFor(); }, GAP);
    }
  });
  pad.addEventListener("keydown", e => {
    if (e.target !== pad) return;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); advance(); }
  });

  function confirmable(btn, idle, armed, action) {
    let t = null;
    btn.addEventListener("click", e => {
      e.stopPropagation();
      if (btn.dataset.armed !== undefined) {
        clearTimeout(t); delete btn.dataset.armed; btn.textContent = idle; action(); return;
      }
      btn.dataset.armed = ""; btn.textContent = armed;
      t = setTimeout(() => { delete btn.dataset.armed; btn.textContent = idle; }, 2500);
    });
  }

  /* ---------- End modal ---------- */
  const modal = $("endModal");
  let endAt = 0;
  const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  function setsUntil(now) {
    return s.phase === "work"
      ? s.sets.concat({ n: s.set, started_at: iso(s.t0), ended_at: iso(now), duration_ms: now - s.t0 })
      : s.sets.slice();
  }
  function openEnd() {
    endAt = Date.now();
    const sets = setsUntil(endAt);
    $("endEx").textContent = s.ex.name;
    $("endSummary").innerHTML = `
      <div><small>SETS</small><span>${sets.length}</span></div>
      <div><small>TOTAL</small><span>${fmtShort(endAt - s.startedAt)}</span></div>
      <div><small>AVG REST</small><span>${fmtShort(avg(s.breaks.map(b => b.duration_ms)))}</span></div>`;
    modal.hidden = false;
    $("saveBtn").focus({ preventScroll: true });
  }
  const closeEnd = () => { modal.hidden = true; };
  function finish(keep) {
    const ex = findEx(s.ex.id);
    // A break still running at the end is the cool-down after the last set and isn't kept.
    if (keep) {
      const sets = setsUntil(endAt);
      const record = {
        id: uid(),
        exercise_id: ex.id,
        exercise_name: ex.name,
        body_part: ex.part,
        equipment: ex.equip,
        started_at: iso(s.startedAt),
        ended_at: iso(endAt),
        duration_ms: endAt - s.startedAt,
        set_count: sets.length,
        sets,
        breaks: s.breaks,
        synced: false
      };
      const h = loadHistory(); h.unshift(record); saveHistory(h);
      if (window.GTSync) window.GTSync.sync();
    }
    s = fresh(); save();
    closeEnd();
    go("back", () => renderList(ex.part));
    toast(keep ? `Saved · ${ex.name}` : "Workout discarded");
  }
  confirmable(endBtn, "End", "Tap again", openEnd);
  $("saveBtn").addEventListener("click", () => finish(true));
  $("discardBtn").addEventListener("click", () => finish(false));
  $("keepBtn").addEventListener("click", closeEnd);
  modal.addEventListener("click", e => { if (e.target === modal) closeEnd(); });
  modal.addEventListener("pointerup", e => e.stopPropagation());

  /* ---------- Sheet ---------- */
  const sheet = $("sheet"), histEl = $("hist");
  const dateLabel = t => new Date(t).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });

  function renderHist() {
    const h = loadHistory();
    if (!h.length) { histEl.innerHTML = `<div class="empty">No workouts saved yet. Finish an exercise with End and choose Save.</div>`; return; }
    histEl.innerHTML = h.map(r => `
      <div class="row">
        <span class="when">${(findEx(r.exercise_id) || {}).name || r.exercise_name || "Workout"}<small>${dateLabel(r.started_at)}${r.body_part && PARTS[r.body_part] ? " · " + PARTS[r.body_part].name : ""}</small></span>
        <span class="meta">${r.set_count} sets</span>
        <span class="meta">${fmtShort(r.duration_ms)}</span>
        <span class="rests">${r.breaks.length ? "Rest " + r.breaks.map(b => fmt(b.duration_ms)).join(" · ") : "No rests"}</span>
      </div>`).join("");
  }
  function openSheet() {
    renderHist();
    sheet.hidden = false;
  }
  $("closeSheet").addEventListener("click", () => sheet.hidden = true);
  sheet.addEventListener("click", e => { if (e.target === sheet) sheet.hidden = true; });
  confirmable($("clearBtn"), "Clear all", "Tap again to clear", async () => {
    if (window.GTSync) await window.GTSync.clearAll(); else saveHistory([]);
    renderHist();
  });

  /* ---------- Sync status ---------- */
  const syncNote = $("syncNote");
  if (window.GTSync) {
    window.GTSync.onChange(st => {
      const pend = st.pending ? `${st.pending} waiting to sync` : "";
      const text = {
        ok: pend,
        syncing: "",
        offline: st.pending ? `Offline · ${pend}` : "",
        error: `Not synced: ${st.message}${pend ? " · " + pend : ""}`,
        off: pend
      }[st.status] || "";
      syncNote.textContent = text;
      syncNote.hidden = !text;
      syncNote.style.color = st.status === "error" ? "var(--warm)" : "";
      if (!sheet.hidden && st.status === "ok") renderHist();
      if (view === "list" && st.status === "ok") {
        // refresh "Last" labels after a pull
        document.querySelectorAll("[data-ex] .last").forEach(el => {
          const id = el.closest("[data-ex]").dataset.ex;
          if (!(active() && s.ex.id === id)) el.textContent = lastFor(id);
        });
      }
    });
  }

  /* ---------- Boot ---------- */
  if (s.ex && !findEx(s.ex.id)) s = fresh();
  if (active()) openTimer(s.ex.id); else { s = fresh(); save(); renderHome(); }
  requestAnimationFrame(frame);
})();
