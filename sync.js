// Supabase sync for finished sessions, with access-code accounts.
// A device signs in anonymously, then redeems an access code; everyone signed in to the same
// code shares one history (RLS on public.gt_sessions is keyed by account_code).
// Local-first: sessions are written to this device's per-code cache with synced:false, then pushed.
(() => {
  const BASE = "set-break-sessions-v1";        // legacy single-user cache key
  const CODE_KEY = "gt-code";
  const cfg = window.GT_CONFIG || {};
  const listeners = new Set();
  const state = { status: "off", message: "", pending: 0 };

  const ls = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
    del: k => { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const normalize = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const code = () => ls.get(CODE_KEY);
  const key = () => (code() ? `${BASE}:${code()}` : BASE);
  window.GTStore = { key, code, normalize };

  const load = () => { try { return JSON.parse(ls.get(key())) || []; } catch (e) { return []; } };
  const store = h => ls.set(key(), JSON.stringify(h));
  const emit = () => {
    state.pending = load().filter(r => !r.synced).length;
    listeners.forEach(fn => { try { fn({ ...state }); } catch (e) {} });
  };
  const set = (status, message = "") => { state.status = status; state.message = message; emit(); };

  let client = null, ready = null, busy = false, linked = null;

  function init() {
    if (ready) return ready;
    ready = (async () => {
      if (!window.supabase || !cfg.supabaseUrl) { set("off", "couldn't load Supabase"); return false; }
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
        const msg = /anonymous/i.test(e.message || "") ? "anonymous sign-in is off" : "sign-in failed";
        set("error", msg);
        return false;
      }
    })();
    return ready;
  }

  // Make sure this device is linked to the stored code (e.g. after its anonymous session was renewed).
  async function ensureLinked() {
    const c = code();
    if (!c || linked === c) return !!c;
    const { data, error } = await client.rpc("gt_redeem", { p_code: c });
    if (error) throw error;
    if (data !== true) { signOut(); listeners.forEach(fn => { try { fn({ ...state, status: "revoked" }); } catch (e) {} }); return false; }
    linked = c;
    return true;
  }

  const toRow = r => ({
    id: r.id,
    account_code: code(),
    exercise_id: r.exercise_id || "unknown",
    exercise_name: r.exercise_name || "Workout",
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
    if (busy || !code()) return;
    if (!navigator.onLine) { set("offline", "offline"); return; }
    busy = true;
    set("syncing");
    try {
      if (!(await init())) return;
      if (!(await ensureLinked())) return;
      await push();
      await pull();
      set("ok");
    } catch (e) {
      set("error", e.message || "sync failed");
    } finally {
      busy = false;
    }
  }

  // Check a code with the server and sign this device in to it. Returns true / false; throws when offline.
  async function redeem(input) {
    const c = normalize(input);
    if (c.length !== 8) return false;
    if (!navigator.onLine) throw new Error("offline");
    if (!(await init())) throw new Error(state.message || "sign-in failed");
    const { data, error } = await client.rpc("gt_redeem", { p_code: c });
    if (error) throw error;
    if (data !== true) return false;
    // First sign-in on this device: carry over the history kept before codes existed.
    const legacy = ls.get(BASE);
    if (legacy && !ls.get(`${BASE}:${c}`)) { ls.set(`${BASE}:${c}`, legacy); ls.del(BASE); }
    ls.set(CODE_KEY, c);
    linked = c;
    sync();
    return true;
  }

  function signOut() { ls.del(CODE_KEY); linked = null; emit(); }

  async function clearAll() {
    store([]);
    emit();
    try {
      if (navigator.onLine && code() && (await init()) && (await ensureLinked())) {
        await client.from(cfg.table).delete().eq("account_code", code());
      }
    } catch (e) { set("error", "couldn't clear cloud history"); return; }
    set(state.status === "error" ? "error" : "ok");
  }

  window.addEventListener("online", sync);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) sync(); });

  window.GTSync = {
    sync, clearAll, redeem, signOut,
    onChange(fn) { listeners.add(fn); fn({ ...state, pending: load().filter(r => !r.synced).length }); return () => listeners.delete(fn); }
  };
  sync();
})();
