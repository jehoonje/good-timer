(() => {
  /* ---------- Data ---------- */
  const PARTS = {
    back:     { name: "등",   en: "BACK",      tone: "--t-back",     view: "back" },
    chest:    { name: "가슴", en: "CHEST",     tone: "--t-chest",    view: "front" },
    shoulder: { name: "어깨", en: "SHOULDERS", tone: "--t-shoulder", view: "front" },
    legs:     { name: "하체", en: "LEGS",      tone: "--t-legs",     view: "front" }
  };
  // [id, 이름, 장비, 주 타깃]
  const EX = {
    back: [
      ["deadlift", "데드리프트", "barbell", "척추기립근 · 둔근"],
      ["pull-up", "풀업", "body", "광배근"],
      ["lat-pulldown", "랫풀다운", "cable", "광배근"],
      ["barbell-row", "바벨 로우", "barbell", "광배 · 능형근"],
      ["one-arm-db-row", "원암 덤벨 로우", "dumbbell", "광배근"],
      ["seated-cable-row", "시티드 케이블 로우", "cable", "중부 등"],
      ["t-bar-row", "T바 로우", "barbell", "중부 등"],
      ["straight-arm-pulldown", "스트레이트 암 풀다운", "cable", "광배근"],
      ["hyperextension", "백 익스텐션", "body", "척추기립근"],
      ["shrug", "슈러그", "dumbbell", "승모근"]
    ],
    chest: [
      ["bench-press", "벤치프레스", "barbell", "대흉근"],
      ["incline-bench", "인클라인 벤치프레스", "barbell", "윗가슴"],
      ["decline-bench", "디클라인 벤치프레스", "barbell", "아랫가슴"],
      ["db-press", "덤벨 프레스", "dumbbell", "대흉근"],
      ["incline-db-press", "인클라인 덤벨 프레스", "dumbbell", "윗가슴"],
      ["db-fly", "덤벨 플라이", "dumbbell", "가슴 안쪽"],
      ["cable-crossover", "케이블 크로스오버", "cable", "가슴 안쪽"],
      ["chest-press", "체스트 프레스 머신", "machine", "대흉근"],
      ["pec-deck", "펙덱 플라이", "machine", "가슴 안쪽"],
      ["dips", "딥스", "body", "아랫가슴 · 삼두"],
      ["push-up", "푸시업", "body", "대흉근"]
    ],
    shoulder: [
      ["ohp", "오버헤드 프레스", "barbell", "전면 · 측면 삼각근"],
      ["db-shoulder-press", "덤벨 숄더 프레스", "dumbbell", "전면 삼각근"],
      ["arnold-press", "아놀드 프레스", "dumbbell", "삼각근 전체"],
      ["machine-shoulder-press", "머신 숄더 프레스", "machine", "전면 삼각근"],
      ["lateral-raise", "사이드 레터럴 레이즈", "dumbbell", "측면 삼각근"],
      ["cable-lateral-raise", "케이블 레터럴 레이즈", "cable", "측면 삼각근"],
      ["front-raise", "프론트 레이즈", "dumbbell", "전면 삼각근"],
      ["rear-delt-fly", "리어 델트 플라이", "dumbbell", "후면 삼각근"],
      ["face-pull", "페이스 풀", "cable", "후면 삼각근"],
      ["upright-row", "업라이트 로우", "barbell", "측면 삼각근 · 승모"]
    ],
    legs: [
      ["back-squat", "백 스쿼트", "barbell", "대퇴사두 · 둔근"],
      ["front-squat", "프론트 스쿼트", "barbell", "대퇴사두"],
      ["leg-press", "레그 프레스", "machine", "대퇴사두"],
      ["hack-squat", "핵 스쿼트", "machine", "대퇴사두"],
      ["rdl", "루마니안 데드리프트", "barbell", "햄스트링 · 둔근"],
      ["lunge", "런지", "dumbbell", "대퇴사두 · 둔근"],
      ["bulgarian-split-squat", "불가리안 스플릿 스쿼트", "dumbbell", "대퇴사두 · 둔근"],
      ["leg-extension", "레그 익스텐션", "machine", "대퇴사두"],
      ["leg-curl", "레그 컬", "machine", "햄스트링"],
      ["hip-thrust", "힙 쓰러스트", "barbell", "둔근"],
      ["calf-raise", "카프 레이즈", "machine", "종아리"]
    ]
  };
  const EQUIP = {
    barbell: ["바벨", '<path d="M2 12h20"/><rect x="4" y="7" width="3" height="10" rx="1"/><rect x="17" y="7" width="3" height="10" rx="1"/>'],
    dumbbell: ["덤벨", '<path d="M8 12h8"/><rect x="4" y="8" width="4" height="8" rx="1.5"/><rect x="16" y="8" width="4" height="8" rx="1.5"/>'],
    cable: ["케이블", '<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V17"/><path d="M8 19h8"/>'],
    machine: ["머신", '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h6"/>'],
    body: ["맨몸", '<circle cx="12" cy="5" r="2.2"/><path d="M12 8v7M8 11h8M12 15l-3 5M12 15l3 5"/>']
  };
  const findEx = id => { for (const p in EX) for (const e of EX[p]) if (e[0] === id) return { id: e[0], name: e[1], equip: e[2], target: e[3], part: p }; return null; };

  /* ---------- Figure ---------- */
  function figure(part) {
    const v = PARTS[part].view;
    const hl = (k) => k === part ? "hl" : "b";
    const hla = (k) => k === part ? "a hla" : "a";
    const limbs = (cls, w1, w2) => `
      <path class="${cls}" stroke-width="${w1}" d="M28 44 L23 72"/><path class="${cls}" stroke-width="${w2}" d="M23 73 L21 96"/>
      <path class="${cls}" stroke-width="${w1}" d="M72 44 L77 72"/><path class="${cls}" stroke-width="${w2}" d="M77 73 L79 96"/>`;
    const legs = `
      <path class="${hla("legs")}" stroke-width="12" d="M42 92 L41 124"/><path class="${hla("legs")}" stroke-width="12" d="M58 92 L59 124"/>
      <path class="${hla("legs")}" stroke-width="9" d="M41 128 L41 152"/><path class="${hla("legs")}" stroke-width="9" d="M59 128 L59 152"/>`;
    const base = `
      <circle class="b" cx="50" cy="15" r="9"/>
      <rect class="b" x="45.5" y="23" width="9" height="8" rx="2"/>
      <path class="b" d="M32 33 Q50 28 68 33 L66 79 Q50 83 34 79 Z"/>
      <path class="b" d="M34 79 L66 79 L64 92 L36 92 Z"/>`;
    let detail;
    if (v === "back") {
      detail = `
        <path class="${hl("back")}" d="M41 30 L59 30 L56 43 L44 43 Z"/>
        <path class="${hl("back")}" d="M34 41 Q30 58 41 73 L48.5 70 L48.5 45 Z"/>
        <path class="${hl("back")}" d="M66 41 Q70 58 59 73 L51.5 70 L51.5 45 Z"/>`;
    } else {
      detail = `
        <path class="${hl("chest")}" d="M36 38 Q44 34.5 49 37.5 L49 50 Q42 54.5 36 50 Z"/>
        <path class="${hl("chest")}" d="M64 38 Q56 34.5 51 37.5 L51 50 Q58 54.5 64 50 Z"/>
        <path class="b" d="M44 56 h12 M44 63 h12 M44 70 h12" fill="none"/>`;
    }
    const delts = `<circle class="${hl("shoulder")}" cx="30" cy="38" r="6.5"/><circle class="${hl("shoulder")}" cx="70" cy="38" r="6.5"/>`;
    return `<svg class="figure" viewBox="0 0 100 160" style="--pt:var(${PARTS[part].tone})" aria-hidden="true">
      ${limbs("a", 8, 7)}${legs}${base}${detail}${delts}</svg>`;
  }

  /* ---------- State ---------- */
  const KEY = "set-break-timer-v3";
  const HKEY = "set-break-sessions-v1";
  const ORD = ["첫", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열"];
  const ordinal = n => (ORD[n - 1] || n) + "번째";
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

  /* ---------- Views ---------- */
  let view = "home", curPart = null;
  const setTone = part => document.body.style.setProperty("--tone", part ? `var(${PARTS[part].tone})` : "var(--cool)");

  function show(v) {
    view = v;
    $("home").hidden = v !== "home";
    $("list").hidden = v !== "list";
    $("pad").hidden = v !== "timer";
    document.body.classList.toggle("lock", v === "timer");
    document.body.dataset.phase = v === "timer" ? s.phase : "";
    window.scrollTo(0, 0);
  }

  function renderHome() {
    $("parts").innerHTML = Object.keys(PARTS).map(k => `
      <button class="card part" type="button" data-part="${k}" style="--pt:var(${PARTS[k].tone})">
        <div class="fig">${figure(k)}</div>
        <div><div class="name">${PARTS[k].name}</div>
        <div class="meta"><i>${PARTS[k].en}</i> · 운동 ${EX[k].length}개</div></div>
      </button>`).join("");
    renderResume();
    setTone(active() ? s.ex.part : null);
    show("home");
  }

  function renderResume() {
    const slot = $("resumeSlot");
    if (!active()) { slot.innerHTML = ""; return; }
    const ex = findEx(s.ex.id);
    const state = s.phase === "rest" ? `${s.set}세트 완료 · 브레이크 중` : `${s.set}세트 진행중`;
    slot.innerHTML = `<button class="resume" type="button" id="resumeBtn" style="--tone:var(${PARTS[ex.part].tone})">
      <span><b>${ex.name}</b><small>${state}</small></span><span class="t" id="resumeT"></span></button>`;
  }

  function lastFor(id) {
    const r = loadHistory().find(r => r.exercise_id === id);
    if (!r) return "";
    const d = new Date(r.started_at);
    return `최근 ${d.getMonth() + 1}/${d.getDate()} · ${r.set_count}세트`;
  }

  function renderList(part) {
    curPart = part;
    const P = PARTS[part];
    setTone(part);
    $("listFig").innerHTML = figure(part);
    $("listTitle").textContent = P.name;
    $("listSub").textContent = `${P.en} · ${EX[part].length}개 운동`;
    $("exs").innerHTML = EX[part].map(([id, name, eq, target]) => `
      <button class="card ex${active() && s.ex.id === id ? " active" : ""}" type="button" data-ex="${id}" style="--pt:var(${P.tone})">
        <span class="glyph"><svg viewBox="0 0 24 24">${EQUIP[eq][1]}</svg></span>
        <span><div class="name">${name}</div><div class="tags">${EQUIP[eq][0]} · ${target}</div></span>
        <span class="last">${active() && s.ex.id === id ? "진행 중" : lastFor(id)}</span>
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
    const t = $("toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2200);
  }

  document.addEventListener("click", e => {
    const p = e.target.closest("[data-part]");
    if (p) return renderList(p.dataset.part);
    const x = e.target.closest("[data-ex]");
    if (x) {
      if (active() && s.ex.id !== x.dataset.ex) {
        toast(`${s.ex.name}을(를) 먼저 끝내주세요`);
        return;
      }
      return openTimer(x.dataset.ex);
    }
    if (e.target.closest("#resumeBtn")) return openTimer(s.ex.id);
    if (e.target.closest("[data-history]")) { e.stopPropagation(); return openSheet(); }
  });
  $("listBack").addEventListener("click", renderHome);
  $("timerBack").addEventListener("click", e => {
    e.stopPropagation();
    if (!active()) s = fresh(), save();
    renderList(curPart);
  });

  /* ---------- Timer ---------- */
  const pad = $("pad"), statusEl = $("status"), hintEl = $("hint"), endBtn = $("endBtn");

  function renderStatus() {
    if (view === "timer") document.body.dataset.phase = s.phase;
    let html = "";
    if (s.phase === "idle") {
      html = `<div class="line now">1세트 진행중</div>`;
      $("setLabel").textContent = "SET 1";
      hintEl.textContent = "세트가 끝나면 두 번 탭";
    } else if (s.phase === "rest") {
      html = `<div class="line done">${s.set}세트 완료</div><div class="line now">${ordinal(s.set)} 브레이크 중</div>`;
      $("setLabel").textContent = "BREAK " + s.set;
      hintEl.textContent = "다음 세트 시작할 때 두 번 탭";
    } else {
      html = `<div class="line done">${s.set - 1}세트 완료</div><div class="line done">브레이크 완료</div>
              <div class="line now">${s.set}세트 진행중</div><div class="sub" id="setElapsed"></div>`;
      $("setLabel").textContent = "SET " + s.set;
      hintEl.textContent = "세트가 끝나면 두 번 탭";
    }
    statusEl.innerHTML = html;
    $("log").innerHTML = s.breaks.map(b => `<span><b>${b.n}</b>${fmt(b.duration_ms)}</span>`).join("");
    endBtn.disabled = s.phase === "idle";
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
        if (el) el.textContent = "세트 " + fmtShort(now - s.t0);
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
      lastTap = now; pad.dataset.armed = ""; hintEl.textContent = "한 번 더 탭";
      clearTimeout(armT);
      armT = setTimeout(() => { delete pad.dataset.armed; renderStatus(); }, GAP);
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

  function endSession() {
    const now = Date.now();
    if (s.phase === "work") s.sets.push({ n: s.set, started_at: iso(s.t0), ended_at: iso(now), duration_ms: now - s.t0 });
    // A break still running at the end is the cool-down after the last set and isn't kept.
    const ex = findEx(s.ex.id);
    const record = {
      id: uid(),
      exercise_id: ex.id,
      exercise_name: ex.name,
      body_part: ex.part,
      equipment: ex.equip,
      started_at: iso(s.startedAt),
      ended_at: iso(now),
      duration_ms: now - s.startedAt,
      set_count: s.sets.length,
      sets: s.sets,
      breaks: s.breaks,
      synced: false
    };
    const h = loadHistory(); h.unshift(record); saveHistory(h);
    if (window.GTSync) window.GTSync.sync();
    s = fresh(); save();
    renderList(ex.part);
    openSheet(record);
  }
  confirmable(endBtn, "끝내기", "한 번 더 누르면 저장", endSession);

  /* ---------- Sheet ---------- */
  const sheet = $("sheet"), summaryEl = $("summary"), histEl = $("hist"), copyBtn = $("copyBtn");
  const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  const dateLabel = t => { const d = new Date(t); return `${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };

  function renderHist() {
    const h = loadHistory();
    if (!h.length) { histEl.innerHTML = `<div class="empty">아직 저장된 기록이 없어요. 운동을 마치면 끝내기를 두 번 누르세요.</div>`; return; }
    histEl.innerHTML = h.map(r => `
      <div class="row">
        <span class="when">${r.exercise_name || "운동"}<small>${dateLabel(r.started_at)}${r.body_part && PARTS[r.body_part] ? " · " + PARTS[r.body_part].name : ""}</small></span>
        <span class="meta">${r.set_count}세트</span>
        <span class="meta">${fmtShort(r.duration_ms)}</span>
        <span class="rests">휴식 ${r.breaks.map(b => fmt(b.duration_ms)).join(" · ") || "없음"}</span>
      </div>`).join("");
  }
  function openSheet(record) {
    if (record) {
      $("sheetTitle").textContent = `${record.exercise_name} 저장 완료`;
      summaryEl.hidden = false;
      summaryEl.innerHTML = `
        <div><small>세트</small><span>${record.set_count}</span></div>
        <div><small>총 시간</small><span>${fmtShort(record.duration_ms)}</span></div>
        <div><small>평균 휴식</small><span>${fmtShort(avg(record.breaks.map(b => b.duration_ms)))}</span></div>`;
    } else {
      $("sheetTitle").textContent = "운동 기록";
      summaryEl.hidden = true;
    }
    renderHist();
    sheet.hidden = false;
  }
  $("closeSheet").addEventListener("click", () => sheet.hidden = true);
  sheet.addEventListener("click", e => { if (e.target === sheet) sheet.hidden = true; });
  copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(JSON.stringify(loadHistory(), null, 2)); copyBtn.textContent = "복사됨"; }
    catch (e) { copyBtn.textContent = "복사 안 됨"; }
    setTimeout(() => copyBtn.textContent = "JSON 복사", 1600);
  });
  confirmable($("clearBtn"), "전체 삭제", "한 번 더 누르면 삭제", async () => {
    if (window.GTSync) await window.GTSync.clearAll(); else saveHistory([]);
    renderHist();
  });

  /* ---------- Sync status ---------- */
  const syncNote = $("syncNote");
  if (window.GTSync) {
    window.GTSync.onChange(st => {
      const pend = st.pending ? ` · 대기 ${st.pending}개` : "";
      const text = {
        ok: st.pending ? `클라우드 동기화 대기${pend}` : "클라우드에 동기화됨",
        syncing: "동기화 중…",
        offline: `오프라인 · 이 기기에 저장됨${pend}`,
        error: `동기화 안 됨: ${st.message}${pend}`,
        off: `이 기기에만 저장됨${pend}`
      }[st.status] || "";
      syncNote.textContent = text;
      syncNote.style.color = st.status === "error" ? "var(--warm)" : "";
      if (!sheet.hidden && st.status === "ok") renderHist();
      if (view === "list" && st.status === "ok") {
        // refresh "최근" labels after a pull
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
