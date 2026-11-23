// Dynamic Island extension (home-screen app only).
// A web app can't drive the real Dynamic Island / Live Activities — that needs a native iOS app.
// Instead, on island iPhones running full-screen from the home screen, a black capsule is drawn
// around the island so it looks like it has expanded, showing the current set/break and its time.
(() => {
  const island = document.getElementById("island");
  const label = document.getElementById("islandLabel");
  const time = document.getElementById("islandTime");
  const pad = document.getElementById("pad");
  const setLabel = document.getElementById("setLabel");
  const mm = document.getElementById("mm");
  if (!island || !pad) return;

  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  // Island iPhones report a top safe area of ~59px+; notch phones ~44–50px.
  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;top:0;left:0;height:env(safe-area-inset-top,0px);width:0;visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  const hasIsland = () => probe.getBoundingClientRect().height >= 51;
  const forced = /[?&]island\b/.test(location.search);   // ?island to preview on any device

  let lastKey = "";
  function tick() {
    requestAnimationFrame(tick);
    const phase = document.body.dataset.phase;
    const on = (forced || (standalone && hasIsland())) && !pad.hidden && (phase === "work" || phase === "rest");
    if (island.hidden === on) island.hidden = !on;
    if (!on) { lastKey = ""; return; }
    const txt = (setLabel.textContent || "").trim();          // "SET 2" / "BREAK 1"
    const key = (txt.startsWith("BREAK") ? "B" : "S") + txt.replace(/\D/g, "");
    if (key !== lastKey) {
      label.textContent = key;
      island.dataset.kind = key[0] === "B" ? "rest" : "work";
      if (lastKey) { island.classList.remove("bump"); void island.offsetWidth; island.classList.add("bump"); }
      lastKey = key;
    }
    const t = mm.textContent;
    if (time.textContent !== t) time.textContent = t;
  }
  requestAnimationFrame(tick);
})();
