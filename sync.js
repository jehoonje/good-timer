// Supabase sync for finished sessions.
// Local-first: every session is written to localStorage with synced:false,
// then pushed to public.gt_sessions under an anonymous Supabase user.
(() => {
  const HKEY = "set-break-sessions-v1";
  const cfg = window.GT_CONFIG || {};
  const listeners = new Set();
  const state = { status: "off", message: "", pending: 0 };

  const load = () => { try { return JSON.parse(localStorage.getItem(HKEY)) || []; } catch (e) { return []; } };
  const store = h => { try { localStorage.setItem(HKEY, JSON.stringify(h)); } catch (e) {} };
  const emit = () => {
    state.pending = load().filter(r => !r.synced).length;
    listeners.forEach(fn => { try { fn({ ...state }); } catch (e) {} });
  };
  const set = (status, message = "") => { state.status = status; state.message = message; emit(); };

  let client = null, ready = null, busy = false;

  function init() {
    if (ready) return ready;
    ready = (async () => {
      if (!window.supabase || !cfg.supabaseUrl) { set("off", "Supabase를 불러오지 못했어요"); return false; }
      client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
        auth: { persistSession: true, autoRefreshToken: true, storageKey: "gt-auth" }
      });
      try {
        const { data } = await client.auth.getSession();
        if (!data.session) {
          const { error } = await client.auth.signInAnonymously();
          if (error) throw error;
        }
        return true;
      } catch (e) {
        ready = null;
        const msg = /anonymous/i.test(e.message || "") ? "익명 로그인이 꺼져 있어요" : "로그인 실패";
        set("error", msg);
        return false;
      }
    })();
    return ready;
  }

  const toRow = r => ({
    id: r.id,
    exercise_id: r.exercise_id || "unknown",
    exercise_name: r.exercise_name || "운동",
    body_part: r.body_part || "back",
    equipment: r.equipment || null,
    started_at: r.started_at,
    ended_at: r.ended_at,
    duration_ms: Math.round(r.duration_ms || 0),
    set_count: r.set_count || 0,
    sets: r.sets || [],
    breaks: r.breaks || []
  });
  const fromRow = row => ({ ...row, synced: true });

  async function push() {
    const pending = load().filter(r => !r.synced && r.started_at);
    if (!pending.length) return;
    const { error } = await client.from(cfg.table)
      .upsert(pending.map(toRow), { onConflict: "id", ignoreDuplicates: true });
    if (error) throw error;
    const done = new Set(pending.map(r => r.id));
    store(load().map(r => done.has(r.id) ? { ...r, synced: true } : r));
  }

  async function pull() {
    const { data, error } = await client.from(cfg.table)
      .select("*").order("started_at", { ascending: false }).limit(500);
    if (error) throw error;
    const local = load();
    const ids = new Set(local.map(r => r.id));
    const merged = local.concat(data.filter(row => !ids.has(row.id)).map(fromRow));
    merged.sort((a, b) => (b.started_at || "").localeCompare(a.started_at || ""));
    store(merged);
  }

  async function sync() {
    if (busy) return;
    if (!navigator.onLine) { set("offline", "오프라인"); return; }
    busy = true;
    set("syncing");
    try {
      if (!(await init())) return;
      await push();
      await pull();
      set("ok");
    } catch (e) {
      set("error", e.message || "동기화 실패");
    } finally {
      busy = false;
    }
  }

  async function clearAll() {
    store([]);
    emit();
    try {
      if (navigator.onLine && (await init())) {
        const { data } = await client.auth.getUser();
        if (data && data.user) await client.from(cfg.table).delete().eq("user_id", data.user.id);
      }
    } catch (e) { set("error", "클라우드 기록 삭제 실패"); return; }
    set(state.status === "error" ? "error" : "ok");
  }

  window.addEventListener("online", sync);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) sync(); });

  window.GTSync = {
    sync, clearAll,
    onChange(fn) { listeners.add(fn); fn({ ...state, pending: load().filter(r => !r.synced).length }); return () => listeners.delete(fn); }
  };
  sync();
})();
