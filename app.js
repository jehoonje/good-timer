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
  const fresh = (ex = null) => ({ ex, phase: "idle", set: 1, t0: 0, startedAt: 0, sets: [], breaks: [], repParts: [], reps: null, plan: null, setupStep: "sets", touched: [] });
  let s = fresh();
  try { const saved = JSON.parse(localStorage.getItem(KEY)); if (saved && saved.phase) s = saved; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  const active = () => s.ex && s.phase !== "idle";

  const histKey = () => (window.GTStore ? window.GTStore.key() : HKEY);   // per access-code cache
  const loadHistory = () => { try { return JSON.parse(localStorage.getItem(histKey())) || []; } catch (e) { return []; } };
  const saveHistory = h => { try { localStorage.setItem(histKey(), JSON.stringify(h)); } catch (e) {} };

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
    $("gate").hidden = v !== "gate";
    $("home").hidden = v !== "home";
    $("list").hidden = v !== "list";
    $("pad").hidden = v !== "timer";
    document.body.classList.toggle("lock", v === "timer");
    document.body.dataset.phase = v === "timer" ? s.phase : "";
    window.scrollTo(0, 0);
  }

  // Run a view change with a View Transition (shared hero figure + directional slide), or a CSS fallback.
  let navBusy = false;
  // View change without the View Transitions API: the snapshot swap at its end makes iOS Safari
  // flash once. Instead the new view fades in on the real DOM, and the body figure flies between
  // screens as a floating copy (transform + opacity only).
  function go(dir, update) {
    if (navBusy) return;
    const heroSvg = el => el && el.offsetParent !== null ? el.querySelector("svg") : null;
    const from = heroSvg(view === "list" ? $("listFig") : document.querySelector("[data-vt]"));
    const r0 = from && from.getBoundingClientRect();
    update();
    const to = heroSvg(view === "list" ? $("listFig") : document.querySelector("[data-vt]"));
    document.querySelectorAll("[data-vt]").forEach(el => el.removeAttribute("data-vt"));
    if (reduced()) return;
    const el = { home: $("home"), list: $("list"), timer: $("pad") }[view];
    if (el) {
      el.classList.remove("enter", "enter-back"); void el.offsetWidth;
      el.classList.add(dir === "back" ? "enter-back" : "enter");
    }
    if (from && to && r0 && r0.width) {
      // Measure where the figure will finally rest, ignoring the entry animations still in progress.
      const card = to.closest(".rise");
      if (card) card.style.animation = "none";              // the target card arrives in place at once
      el.classList.add("measuring");
      const r1 = to.getBoundingClientRect();
      el.classList.remove("measuring");
      if (!r1.width) return;
      navBusy = true;
      const clone = from.cloneNode(true);
      clone.classList.add("hero-fly");
      Object.assign(clone.style, { left: r0.left + "px", top: r0.top + "px", width: r0.width + "px", height: r0.height + "px" });
      clone.style.setProperty("--pt", getComputedStyle(from).getPropertyValue("--pt"));
      document.body.appendChild(clone);
      to.style.visibility = "hidden";
      // The figure is drawn aspect-fit (100:170) inside each box, and the two boxes differ in shape,
      // so match the drawn figure's height and center rather than the boxes.
      const drawnH = r => Math.min(r.height, r.width * 1.7);
      const k = drawnH(r1) / drawnH(r0);
      const dx = (r1.left + r1.width / 2) - (r0.left + r0.width / 2);
      const dy = (r1.top + r1.height / 2) - (r0.top + r0.height / 2);
      clone.style.transformOrigin = "50% 50%";
      clone.animate([
        { transform: "translate(0,0) scale(1)" },
        { transform: `translate(${dx}px, ${dy}px) scale(${k})` }
      ], { duration: 560, easing: "cubic-bezier(.3,.8,.2,1)", fill: "forwards" }).finished
        .catch(() => {}).finally(() => {
          to.style.visibility = "";
          // brief cross-fade so the hand-off to the real figure is seamless
          clone.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished
            .catch(() => {}).finally(() => { clone.remove(); navBusy = false; });
        });
      setTimeout(() => { if (clone.isConnected) { to.style.visibility = ""; clone.remove(); navBusy = false; } }, 1100);
    }
  }
  const nameHero = el => { if (el) el.setAttribute("data-vt", ""); };

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
    // whole calendar days between that session and today
    const day = t => { const x = new Date(t); x.setHours(0, 0, 0, 0); return x.getTime(); };
    const n = Math.round((day(Date.now()) - day(r.started_at)) / 86400000);
    const when = n <= 0 ? "Today" : n === 1 ? "Yesterday" : `${n} days ago`;
    return `${when} · ${r.set_count} sets`;
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
        <span><div class="name">${name}</div></span>
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
    if (view === "timer") {
      document.body.dataset.phase = s.phase;
      document.body.style.setProperty("--tone", s.phase === "rest" ? "var(--mist)" : "var(--red)");
    }
    let html = "";
    if (s.phase === "idle") {
      html = `<div class="line now">Set 1 in progress</div>`;
      $("setLabel").textContent = "SET 1";
    } else if (s.phase === "rest") {
      html = `<div class="line done">Set ${s.set} complete</div><div class="line now" style="--i:1">Break ${s.set} in progress</div>`;
      const nw = s.plan && s.set < s.plan.sets ? wFor(s.set + 1) : null;
      $("setLabel").textContent = "BREAK " + s.set + (nw != null ? ` · NEXT ${fmtKg(nw)} KG` : "");
    } else {
      html = s.set === 1 ? `<div class="line now">Set 1 in progress</div>`
        : `<div class="line done">Set ${s.set - 1} complete</div><div class="line done" style="--i:1">Break complete</div>
              <div class="line now" style="--i:2">Set ${s.set} in progress</div>`;
      const w = wFor(s.set);
      $("setLabel").textContent = `SET ${s.set}${s.plan ? " / " + s.plan.sets : ""}${w != null ? ` · ${fmtKg(w)} KG` : ""}`;
    }
    const planDone = !!(s.plan && s.phase === "rest" && s.set >= s.plan.sets);
    hintEl.textContent = planDone ? "All planned sets done · tap End" : hintFor();
    endBtn.classList.toggle("cue", planDone);
    statusEl.innerHTML = html;
    renderLog();
    endBtn.disabled = s.phase === "idle";
    const idle = s.phase === "idle";
    $("timerBack").hidden = !idle;
    [$("clock"), statusEl, $("foot"), endBtn, $("setLabel")].forEach(el => el.hidden = idle);
    setCallout();
    renderReps();
    renderSetup();
  }

  /* ---------- Pre-start setup: how many sets → kg for each → START ---------- */
  const fmtKg = v => { const n = +v; return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, ""); };
  const validKg = v => v !== "" && v != null && !isNaN(+v) && +v >= 0 && +v < 1000;
  function wFor(n) {
    if (!s.plan || !s.plan.weights) return null;
    const v = s.plan.weights[n - 1] ?? s.plan.weights[s.plan.weights.length - 1];
    return validKg(v) ? +v : null;
  }
  function lastPlanFor(id) {
    const r = loadHistory().find(r => r.exercise_id === id);
    if (!r) return null;
    const n = Math.min(10, Math.max(1, r.planned_sets || r.set_count || 4));
    return { sets: n, weights: (r.sets || []).map(x => x.weight == null ? "" : String(x.weight)).slice(0, n) };
  }
  function ensurePlan() {
    if (s.plan) return;
    const lp = s.ex && lastPlanFor(s.ex.id);
    s.plan = lp || { sets: 4, weights: [] };
    s.setupStep = "sets"; s.touched = [];
  }
  const setupEl = $("setup"), suList = $("suList");
  let suBuiltFor = -1;
  function renderSetup() {
    const idle = s.phase === "idle" && view === "timer";
    setupEl.hidden = !idle;
    if (!idle) { $("startBtn").hidden = true; suBuiltFor = -1; return; }
    ensurePlan();
    const step = s.setupStep || "sets";
    $("suSets").hidden = step !== "sets";
    $("suWeights").hidden = step !== "weights";
    $("suSummary").hidden = step !== "ready";
    $("startBtn").hidden = step !== "ready";
    if (step === "sets") {
      $("suNum").textContent = s.plan.sets;
      $("suMinus").disabled = s.plan.sets <= 1; $("suPlus").disabled = s.plan.sets >= 10;
      suBuiltFor = -1;
    } else if (step === "weights") {
      if (suBuiltFor !== s.plan.sets) buildWeights();
      updateDone();
    } else {
      const ws = s.plan.weights.slice(0, s.plan.sets).map(fmtKg);
      $("suSummary").innerHTML = `<b>${s.plan.sets}</b><small>SETS</small><span>${ws.join(" / ")} kg</span><em>EDIT</em>`;
    }
  }
  function buildWeights() {
    const n = s.plan.sets;
    while (s.plan.weights.length < n) s.plan.weights.push(s.plan.weights.length ? s.plan.weights[s.plan.weights.length - 1] : "");
    s.plan.weights.length = n;
    suList.innerHTML = Array.from({ length: n }, (_, i) => `
      <label class="su-row"><span>SET ${i + 1}</span>
        <input id="suw${i}" data-i="${i}" type="text" inputmode="decimal" autocomplete="off" enterkeyhint="${i < n - 1 ? "next" : "done"}" placeholder="0" value="${String(s.plan.weights[i] ?? "").replace(/"/g, "")}">
        <small>kg</small></label>`).join("");
    suBuiltFor = n;
  }
  function updateDone() { $("suDone").disabled = !s.plan.weights.slice(0, s.plan.sets).every(validKg); }
  const cleanNum = v => { v = v.replace(",", ".").replace(/[^0-9.]/g, ""); const p = v.split("."); return p.length > 2 ? p[0] + "." + p.slice(1).join("") : v; };
  suList.addEventListener("input", e => {
    const inp = e.target.closest("input"); if (!inp) return;
    const v = cleanNum(inp.value); if (v !== inp.value) inp.value = v;
    const i = +inp.dataset.i; s.plan.weights[i] = v; (s.touched = s.touched || [])[i] = true;
    // sets you haven't typed into yet follow the one above
    for (let j = i + 1; j < s.plan.sets; j++) if (!s.touched[j]) { s.plan.weights[j] = v; const o = $("suw" + j); if (o) o.value = v; }
    save(); updateDone();
  });
  suList.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    e.preventDefault(); e.stopPropagation();
    const i = +e.target.dataset.i, nx = $("suw" + (i + 1));
    if (nx) nx.focus(); else if (!$("suDone").disabled) $("suDone").click(); else e.target.blur();
  });
  const stop = el => ["pointerdown", "pointerup", "click", "keydown"].forEach(ev => el.addEventListener(ev, e => e.stopPropagation()));
  stop(setupEl);
  $("suMinus").addEventListener("click", () => { s.plan.sets = Math.max(1, s.plan.sets - 1); save(); renderSetup(); });
  $("suPlus").addEventListener("click", () => { s.plan.sets = Math.min(10, s.plan.sets + 1); save(); renderSetup(); });
  $("suNext").addEventListener("click", () => {
    s.setupStep = "weights"; save(); renderSetup();
    const first = s.plan.weights.findIndex(v => !validKg(v));
    setTimeout(() => { const el = $("suw" + (first < 0 ? 0 : first)); if (el && first >= 0) el.focus(); }, 60);
  });
  $("suBack").addEventListener("click", () => { s.setupStep = "sets"; save(); renderSetup(); });
  $("suDone").addEventListener("click", () => {
    if ($("suDone").disabled) return;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    s.plan.weights = s.plan.weights.slice(0, s.plan.sets).map(v => fmtKg(v));
    s.setupStep = "ready"; save(); renderSetup();
  });
  $("suSummary").addEventListener("click", () => { s.setupStep = "weights"; save(); renderSetup(); });

  /* ---------- Rep counter (sets only) ----------
     1 and 2 add up. Undo removes the last tap (hold it to clear), ✓ stores the count on the
     current set. A saved count collapses to a chip that reopens for editing. */
  let repsEditing = false;
  const repsEl = $("reps"), repsDone = $("repsDone");
  const repTotal = () => (s.repParts || []).reduce((a, b) => a + b, 0);
  function renderReps() {
    if (!s.repParts) s.repParts = [];
    const on = s.phase === "work";
    const committed = s.reps != null && !repsEditing;
    repsEl.hidden = !on || committed;
    repsDone.hidden = !on || !committed;
    if (!on) return;
    if (committed) { $("repsDoneNum").textContent = s.reps; return; }
    const total = repTotal();
    $("repsNum").textContent = total;
    $("repsOk").disabled = total === 0;
    $("repsUndo").disabled = s.repParts.length === 0;
    repsEl.classList.toggle("has", total > 0);
  }
  const tick = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };
  repsEl.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b || b.disabled) return;
    e.stopPropagation();
    if (b.dataset.rep) {
      if (repTotal() + +b.dataset.rep > 999) return;
      s.repParts.push(+b.dataset.rep); tick(8);
      const n = $("repsNum"); n.classList.remove("bump"); void n.offsetWidth; n.classList.add("bump");
    } else if (b.id === "repsUndo") { s.repParts.pop(); tick(8); }
    else if (b.id === "repsOk") { s.reps = repTotal(); repsEditing = false; tick([14, 40, 14]); }
    save(); renderReps();
  });
  repsDone.addEventListener("click", e => { e.stopPropagation(); repsEditing = true; renderReps(); });
  // Hold undo to clear everything
  let holdT = 0, held = false;
  const undo = $("repsUndo");
  undo.addEventListener("pointerdown", () => { held = false; holdT = setTimeout(() => { held = true; s.repParts = []; tick(20); save(); renderReps(); }, 550); });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => undo.addEventListener(ev, () => clearTimeout(holdT)));
  undo.addEventListener("click", e => { if (held) { e.stopImmediatePropagation(); held = false; } }, true);
  // Taps anywhere on the rep counter never count toward the background double-tap.
  [repsEl, repsDone].forEach(el => ["pointerdown", "pointerup"].forEach(ev => el.addEventListener(ev, e => e.stopPropagation())));

  /* ---------- 3D start button ---------- */
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const startBtn = $("startBtn");
  let starting = false;
  startBtn.addEventListener("pointerdown", () => startBtn.classList.add("pressed"));
  ["pointerleave", "pointercancel"].forEach(ev => startBtn.addEventListener(ev, () => { if (!starting) startBtn.classList.remove("pressed"); }));
  startBtn.addEventListener("pointerup", e => e.stopPropagation());
  startBtn.addEventListener("click", e => { e.stopPropagation(); begin(); });
  async function begin() {
    if (starting || s.phase !== "idle" || s.setupStep !== "ready") return;
    starting = true;
    const rm = reduced();
    startBtn.classList.add("pressed");
    try { navigator.vibrate && navigator.vibrate(30); } catch (e) {}
    if (!rm) {
      await wait(150);
      startBtn.classList.remove("pressed");
      startBtn.classList.add("launch");
      await wait(460);
    }
    const now = Date.now();
    s.phase = "work"; s.set = 1; s.t0 = now; s.startedAt = now; s.repParts = []; s.reps = null; repsEditing = false;
    save(); keepAwake();
    startBtn.classList.remove("launch", "pressed");
    renderStatus();
    if (!rm) [$("time"), statusEl, $("foot")].forEach((el, i) => el.animate(
      [{ opacity: 0, transform: "translateY(10px) scale(.98)" }, { opacity: 1, transform: "none" }],
      { duration: 700, delay: i * 90, easing: "cubic-bezier(.2,.7,.1,1)", fill: "backwards" }));
    starting = false;
    announce();
  }

  const mmEl = $("mm"), csEl = $("cs");
  function frame() {
    const now = Date.now();
    if (view === "timer") {
      const ms = s.t0 ? now - s.t0 : 0;
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
    const ghost = lift();
    if (s.phase === "idle") {
      if (!s.t0) s.t0 = now;
      s.startedAt = s.t0;
      s.sets.push({ n: 1, started_at: iso(s.t0), ended_at: iso(now), duration_ms: now - s.t0 });
      s.phase = "rest"; s.t0 = now;
    } else if (s.phase === "work") {
      s.sets.push({ n: s.set, started_at: iso(s.t0), ended_at: iso(now), duration_ms: now - s.t0, reps: s.reps ?? null, weight: wFor(s.set) });
      s.phase = "rest"; s.t0 = now; s.repParts = []; s.reps = null; repsEditing = false;
    } else {
      s.breaks.push({ n: s.set, started_at: iso(s.t0), ended_at: iso(now), duration_ms: now - s.t0 });
      s.set += 1; s.phase = "work"; s.t0 = now;
    }
    try { navigator.vibrate && navigator.vibrate(25); } catch (e) {}
    keepAwake(); save(); renderStatus();
    land(ghost);
    announce();
  }

  /* ---------- Fighting-game style fly-by above the clock ---------- */
  // "SET n" / "BREAK n" flies in from the right into its own lane above the clock,
  // lands with a flash and shake, holds, then flies off to the left.
  const stage = $("stage"), stageText = $("stageText"), stageBand = stage.querySelector(".stage-band");
  let stageRun = 0;
  function setCallout() {}
  function announce() {
    if (s.phase === "idle") return;
    const run = ++stageRun;
    stage.getAnimations({ subtree: true }).forEach(a => a.cancel());
    stage.dataset.kind = s.phase === "rest" ? "rest" : "work";
    stageText.textContent = (s.phase === "rest" ? "BREAK " : "SET ") + s.set;
    stage.hidden = false;
    const end = () => { if (run === stageRun) stage.hidden = true; };
    if (reduced()) {
      stageText.animate([{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 1200, fill: "both" }).finished.then(end, () => {});
      return;
    }
    // Same distance, duration and fast-start curve in and out; still in the middle.
    const IN = 180, HOLD = 900, D = IN * 2 + HOLD, T = IN / D;   // snap in, hard stop, hold, snap out
    stageText.animate([
      { transform: "translateX(85vw) skewX(-12deg) scaleX(1.1)", opacity: .55, easing: "linear" },
      { transform: "translateX(0) skewX(-12deg) scaleX(1)", opacity: 1, offset: T, easing: "linear" },
      { transform: "translateX(0) skewX(-12deg) scaleX(1)", opacity: 1, offset: 1 - T, easing: "linear" },
      { transform: "translateX(-85vw) skewX(-12deg) scaleX(1.1)", opacity: .55 }
    ], { duration: D, easing: "linear", fill: "both" }).finished.then(end, () => {});
    setTimeout(() => {
      if (run !== stageRun) return;
      try { navigator.vibrate && navigator.vibrate(20); } catch (e) {}
    }, D * T);
  }

  /* ---------- Log + "number drops into the log" motion ---------- */
  function renderLog() {
    const items = [];
    s.sets.forEach((st, i) => {
      const tail = st.weight != null && st.reps != null ? `${fmtKg(st.weight)}×${st.reps}` : st.reps != null ? `×${st.reps}` : st.weight != null ? `${fmtKg(st.weight)}kg` : "";
      items.push(`<span class="w"><b>S${st.n}</b><em>${st.duration_ms == null ? "—" : fmt(st.duration_ms)}</em>${tail ? `<u>${tail}</u>` : ""}</span>`);
      const br = s.breaks[i];
      if (br) items.push(`<span class="r"><b>B${br.n}</b><em>${fmt(br.duration_ms)}</em></span>`);
    });
    const log = $("log");
    log.innerHTML = items.join("");
    // Show only whole chips: drop the oldest until the row fits, and count them in a "+N" tag.
    if (log.clientWidth) {
      let dropped = 0;
      while (log.scrollWidth > log.clientWidth && log.children.length > 1) {
        if (log.firstElementChild.classList.contains("more")) log.firstElementChild.remove();
        log.firstElementChild.remove(); dropped++;
        log.insertAdjacentHTML("afterbegin", `<span class="more">+${dropped}</span>`);
      }
    }
  }
  // Freeze a copy of the big number where it sits, before the state changes.
  function lift() {
    if (view !== "timer" || reduced()) return null;
    const t = $("time"), r = t.getBoundingClientRect();
    const g = t.cloneNode(true);
    g.removeAttribute("id"); g.querySelectorAll("[id]").forEach(n => n.removeAttribute("id"));
    g.classList.add("ghost");
    const cs = getComputedStyle(t), ccs = getComputedStyle($("cs"));
    Object.assign(g.style, { left: r.left + "px", top: r.top + "px", color: cs.color, textShadow: cs.textShadow });
    g.querySelector(".cs").style.color = ccs.color;
    document.body.appendChild(g);
    return { g, r };
  }
  // Fly the frozen copy into the newest log chip, then reveal the chip and fade the fresh clock in.
  function land(ghost) {
    const t = $("time");
    if (!ghost) return;
    const chip = $("log").lastElementChild;
    t.animate([{ opacity: 0, transform: "translateY(10px) scale(.97)" },
               { opacity: 1, transform: "none" }],
              { duration: 520, delay: 220, easing: "cubic-bezier(.2,.7,.1,1)", fill: "backwards" });
    if (!chip) { ghost.g.remove(); return; }
    const em = chip.querySelector("em");
    chip.style.opacity = "0";
    const to = em.getBoundingClientRect(), from = ghost.r;
    const k = to.width / from.width;
    const dx = to.left - from.left, dy = to.top + to.height / 2 - (from.top + from.height * k / 2);
    const fly = ghost.g.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * .55}px, ${dy * .5}px) scale(${(1 + k) / 2})`, opacity: .9, offset: .55 },
      { transform: `translate(${dx}px, ${dy}px) scale(${k})`, opacity: 0 }
    ], { duration: 680, easing: "cubic-bezier(.55,0,.2,1)", fill: "forwards" });
    chip.animate([{ opacity: 0, transform: "scale(.85)" }, { opacity: 1, transform: "scale(1.06)", offset: .6 }, { opacity: 1, transform: "scale(1)" }],
                 { duration: 420, delay: 520, easing: "cubic-bezier(.2,.7,.1,1)", fill: "backwards" })
      .finished.finally(() => { chip.style.opacity = ""; });
    fly.finished.finally(() => ghost.g.remove());
  }

  const GAP = 380;
  let lastTap = 0, armT = null;
  pad.addEventListener("pointerup", e => {
    if (e.target.closest("button, .reps, .reps-done") || s.phase === "idle") return;
    pad.style.setProperty("--tx", e.clientX + "px");   // tap glow spreads from the finger
    pad.style.setProperty("--ty", e.clientY + "px");
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
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); s.phase === "idle" ? begin() : advance(); }
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
      ? s.sets.concat({ n: s.set, started_at: iso(s.t0), ended_at: iso(now), duration_ms: now - s.t0, reps: s.reps ?? null, weight: wFor(s.set) })
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
        planned_sets: s.plan ? s.plan.sets : null,
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
      <div class="row" data-id="${r.id}" role="button" tabindex="0">
        <span class="when">${(findEx(r.exercise_id) || {}).name || r.exercise_name || "Workout"}<small>${dateLabel(r.started_at)}${r.body_part && PARTS[r.body_part] ? " · " + PARTS[r.body_part].name : ""}</small></span>
        <span class="meta">${r.set_count} sets</span>
        <span class="meta">${fmtShort(r.duration_ms)}</span>
        <span class="rests">${setsLine(r)}${r.breaks.length ? "Rest " + r.breaks.map(b => fmt(b.duration_ms)).join(" · ") : "No rests"}</span>
      </div>`).join("");
  }
  function setsLine(r) {
    const S = r.sets || [];
    if (S.some(x => x.weight != null)) return "Sets " + S.map(x => (x.weight != null ? fmtKg(x.weight) : "–") + (x.reps != null ? "×" + x.reps : "")).join(" · ") + "<br>";
    if (S.some(x => x.reps != null)) return "Reps " + S.map(x => x.reps ?? "–").join(" · ") + "<br>";
    return "";
  }
  function openSheet() {
    closeDetail(true);
    renderHist();
    sheet.hidden = false;
  }

  /* ---------- History detail: edit kg / reps per set, or delete ---------- */
  let dtId = null;
  const dtEl = $("histDetail"), dtSets = $("dtSets");
  function openDetail(id) {
    const r = loadHistory().find(x => x.id === id); if (!r) return;
    dtId = id;
    $("dtTitle").textContent = (findEx(r.exercise_id) || {}).name || r.exercise_name || "Workout";
    $("dtSub").textContent = `${dateLabel(r.started_at)} · ${r.set_count} sets · ${fmtShort(r.duration_ms)}`;
    dtSets.innerHTML = (r.sets || []).map((x, i) => `
      <div class="dt-row"><span>S${x.n ?? i + 1}</span>
        <input data-i="${i}" data-k="weight" type="text" inputmode="decimal" autocomplete="off" placeholder="–" value="${x.weight ?? ""}" aria-label="Set ${i + 1} weight in kg">
        <input data-i="${i}" data-k="reps" type="text" inputmode="numeric" autocomplete="off" placeholder="–" value="${x.reps ?? ""}" aria-label="Set ${i + 1} reps">
        <em>${x.duration_ms != null ? fmtShort(x.duration_ms) : "—"}</em></div>`).join("") || `<div class="empty">No sets recorded.</div>`;
    histEl.hidden = true; $("mainActions").hidden = true; dtEl.hidden = false;
    $("sheetTitle").textContent = "Edit";
  }
  function closeDetail(quiet) {
    dtId = null; dtEl.hidden = true; histEl.hidden = false; $("mainActions").hidden = false;
    $("sheetTitle").textContent = "History";
    if (!quiet) renderHist();
  }
  histEl.addEventListener("click", e => { const row = e.target.closest(".row[data-id]"); if (row) openDetail(row.dataset.id); });
  histEl.addEventListener("keydown", e => { if (e.key === "Enter") { const row = e.target.closest(".row[data-id]"); if (row) openDetail(row.dataset.id); } });
  dtSets.addEventListener("input", e => {
    const inp = e.target.closest("input"); if (!inp) return;
    const v = inp.dataset.k === "reps" ? inp.value.replace(/[^0-9]/g, "") : cleanNum(inp.value);
    if (v !== inp.value) inp.value = v;
  });
  $("dtBack").addEventListener("click", () => closeDetail());
  $("dtSave").addEventListener("click", () => {
    const h = loadHistory(); const r = h.find(x => x.id === dtId);
    if (!r) return closeDetail();
    dtSets.querySelectorAll("input").forEach(inp => {
      const i = +inp.dataset.i, k = inp.dataset.k, v = inp.value.trim();
      r.sets[i][k] = v === "" ? null : k === "reps" ? Math.round(+v) : +(+v).toFixed(2);
    });
    r.synced = false; r.edited_at = new Date().toISOString();
    saveHistory(h);
    if (window.GTSync) window.GTSync.sync();
    toast("Saved"); closeDetail();
  });
  confirmable($("dtDelete"), "Delete", "Tap again to delete", () => {
    if (window.GTSync && window.GTSync.deleteOne) window.GTSync.deleteOne(dtId);
    else saveHistory(loadHistory().filter(x => x.id !== dtId));
    toast("Deleted"); closeDetail();
  });
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

  /* ---------- Access code ---------- */
  const gateInput = $("gateInput"), gateMsg = $("gateMsg"), gateForm = $("gateForm");
  const fmtCode = v => { const c = (window.GTStore ? window.GTStore.normalize(v) : v.toUpperCase()).slice(0, 8); return c.length > 4 ? c.slice(0, 4) + "-" + c.slice(4) : c; };
  function showGate(msg = "") {
    document.body.dataset.phase = "";
    gateInput.value = ""; gateMsg.textContent = msg; gateForm.classList.remove("busy", "bad");
    show("gate");
    setTimeout(() => { try { gateInput.focus({ preventScroll: true }); } catch (e) {} }, 350);
  }
  gateInput.addEventListener("input", () => {
    gateInput.value = fmtCode(gateInput.value);
    gateForm.classList.remove("bad"); gateMsg.textContent = "";
    gateForm.classList.toggle("ready", gateInput.value.length === 9);
  });
  gateForm.addEventListener("submit", async e => {
    e.preventDefault();
    if (gateForm.classList.contains("busy")) return;
    const v = gateInput.value;
    if ((window.GTStore ? window.GTStore.normalize(v) : v).length !== 8) { gateForm.classList.add("bad"); gateMsg.textContent = "Codes have 8 characters."; return; }
    gateForm.classList.add("busy"); gateMsg.textContent = "Checking…";
    try {
      const ok = await window.GTSync.redeem(v);
      if (!ok) { gateForm.classList.remove("busy"); gateForm.classList.add("bad"); gateMsg.textContent = "That code isn't valid."; gateInput.select(); return; }
      gateMsg.textContent = "";
      gateInput.blur();
      go("fwd", () => { s = fresh(); save(); renderHome(); });
    } catch (err) {
      gateForm.classList.remove("busy");
      gateMsg.textContent = /offline/i.test(err.message || "") || !navigator.onLine ? "You're offline. Connect to sign in." : "Couldn't reach the server. Try again.";
    }
  });
  $("signOutBtn").addEventListener("click", () => {
    if (active()) { toast("Finish the current exercise first"); return; }
    sheet.hidden = true;
    window.GTSync.signOut();
    showGate();
  });
  if (window.GTSync) window.GTSync.onChange(st => { if (st.status === "revoked") showGate("This code is no longer active."); });

  /* ---------- Boot ---------- */
  if (s.ex && !findEx(s.ex.id)) s = fresh();
  if (!window.GTStore || !window.GTStore.code()) showGate();
  else if (active()) openTimer(s.ex.id); else { s = fresh(); save(); renderHome(); }
  requestAnimationFrame(frame);
})();
