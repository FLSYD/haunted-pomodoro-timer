(() => {
  "use strict";

  const DURATIONS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 }; // seconds
  const ROUNDS_BEFORE_LONG = 4;
  const STORAGE_KEY = "haunted-pomodoro-v1";
  const RING_CIRCUMFERENCE = 2 * Math.PI * 150;

  const LABELS = {
    focus: { idle: "Time to haunt your tasks", running: "Focusing... the spirits are watching" },
    short: { idle: "Short break: grab a treat", running: "Resting among the gravestones" },
    long: { idle: "Long break: you earned it", running: "Deep slumber in the crypt" },
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    time: $("time"),
    label: $("label"),
    ring: $("ring"),
    pumpkin: $("pumpkin"),
    start: $("startBtn"),
    reset: $("resetBtn"),
    dots: $("dots"),
    roundText: $("roundText"),
    today: $("todayCount"),
    clear: $("clearToday"),
    autoStart: $("autoStart"),
    tabs: document.querySelectorAll(".modes button"),
  };

  /* ---------- Persistence ---------- */

  const dayKey = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  // Stored shape: { date, count, cycle, autoStart }
  //   count: focus rounds completed today
  //   cycle: focus rounds completed in the current set of 4
  function loadStore() {
    const fresh = { date: dayKey(), count: 0, cycle: 0, autoStart: true };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved !== "object") return fresh;
      fresh.autoStart = saved.autoStart !== false;
      if (saved.date === fresh.date) {
        fresh.count = Math.max(0, Number(saved.count) || 0);
        fresh.cycle = Math.min(ROUNDS_BEFORE_LONG - 1, Math.max(0, Number(saved.cycle) || 0));
      }
    } catch (_) {
      /* corrupt or unavailable storage: start fresh */
    }
    return fresh;
  }

  function saveStore() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (_) {
      /* storage full or blocked: keep running in memory */
    }
  }

  const store = loadStore();

  // Roll over to a new day if midnight passed while the page was open.
  function rollDayIfNeeded() {
    if (store.date === dayKey()) return;
    store.date = dayKey();
    store.count = 0;
    store.cycle = 0;
    saveStore();
  }

  /* ---------- Timer state ---------- */

  const state = {
    mode: "focus",
    remaining: DURATIONS.focus, // seconds
    running: false,
    endAt: 0, // epoch ms, valid while running
    intervalId: null,
    notice: "", // one-off label shown after a phase ends
  };

  const formatTime = (sec) => {
    const s = Math.ceil(sec);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  function startTicking() {
    state.running = true;
    state.endAt = Date.now() + state.remaining * 1000;
    state.intervalId = setInterval(tick, 250);
  }

  function stopTicking() {
    state.running = false;
    clearInterval(state.intervalId);
    state.intervalId = null;
  }

  function tick() {
    state.remaining = Math.max(0, (state.endAt - Date.now()) / 1000);
    if (state.remaining === 0) {
      finishPhase();
    } else {
      renderTime();
    }
  }

  function start() {
    if (state.running) return;
    rollDayIfNeeded();
    state.notice = "";
    startTicking();
    render();
  }

  function pause() {
    if (!state.running) return;
    tick(); // sync remaining time before stopping
    if (!state.running) return; // tick may have finished the phase
    stopTicking();
    render();
  }

  function switchMode(mode, { autoRun = false } = {}) {
    stopTicking();
    state.mode = mode;
    state.remaining = DURATIONS[mode];
    if (autoRun) startTicking();
    render();
  }

  function reset() {
    stopTicking();
    state.remaining = DURATIONS[state.mode];
    state.notice = "";
    render();
  }

  // Called when a countdown reaches zero.
  function finishPhase() {
    rollDayIfNeeded();
    const finished = state.mode;
    let next = "focus";

    if (finished === "focus") {
      store.count += 1;
      store.cycle += 1;
      if (store.cycle >= ROUNDS_BEFORE_LONG) {
        store.cycle = 0;
        next = "long";
      } else {
        next = "short";
      }
      saveStore();
      animate(els.today, "bump");
    }

    playChime();
    animate(els.pumpkin, "done");

    switchMode(next, { autoRun: store.autoStart });
    state.notice =
      finished !== "focus"
        ? "Break over. Back to the hunt"
        : next === "long"
          ? "Four rounds done! Long break"
          : "Round complete! Break time";
    renderLabel();
  }

  /* ---------- Rendering ---------- */

  function animate(el, className) {
    el.classList.remove(className);
    void el.offsetWidth; // restart the CSS animation
    el.classList.add(className);
  }

  function renderTime() {
    const total = DURATIONS[state.mode];
    const text = formatTime(state.remaining);
    els.time.textContent = text;
    els.ring.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - state.remaining / total);
    document.title = `${text} · Haunted Pomodoro`;
  }

  function renderLabel() {
    const started = state.remaining < DURATIONS[state.mode];
    els.label.textContent =
      state.notice ||
      (!state.running && started ? "Paused. The spirits wait" : LABELS[state.mode][state.running ? "running" : "idle"]);
  }

  function renderRounds() {
    const inLong = state.mode === "long";
    const done = inLong ? ROUNDS_BEFORE_LONG : store.cycle;
    const current = state.mode === "focus" ? store.cycle : -1;

    if (els.dots.children.length !== ROUNDS_BEFORE_LONG) {
      els.dots.replaceChildren(
        ...Array.from({ length: ROUNDS_BEFORE_LONG }, () => document.createElement("span")),
      );
    }
    [...els.dots.children].forEach((dot, i) => {
      dot.className = "dot" + (i < done ? " done" : "") + (i === current ? " current" : "");
    });
    els.roundText.textContent = inLong
      ? "Set complete!"
      : `Round ${store.cycle + 1} of ${ROUNDS_BEFORE_LONG}`;
  }

  function render() {
    const total = DURATIONS[state.mode];
    document.body.dataset.mode = state.mode;
    document.body.classList.toggle("running", state.running);
    els.start.textContent = state.running ? "Pause" : state.remaining < total ? "Resume" : "Start";
    els.tabs.forEach((tab) => {
      const active = tab.dataset.mode === state.mode;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    els.today.textContent = store.count;
    els.autoStart.checked = store.autoStart;
    renderTime();
    renderLabel();
    renderRounds();
  }

  /* ---------- Sound (WebAudio, no assets) ---------- */

  let audioCtx = null;

  function ensureAudio() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
    } catch (_) {
      audioCtx = null;
    }
  }

  function playChime() {
    if (!audioCtx) return;
    [523.25, 392.0, 311.13].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const t = audioCtx.currentTime + i * 0.28;
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.75);
    });
  }

  /* ---------- Events ---------- */

  els.start.addEventListener("click", () => {
    ensureAudio(); // must be created from a user gesture
    state.running ? pause() : start();
  });

  els.reset.addEventListener("click", reset);

  els.tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      state.notice = "";
      switchMode(tab.dataset.mode);
    }),
  );

  els.autoStart.addEventListener("change", () => {
    store.autoStart = els.autoStart.checked;
    saveStore();
  });

  els.clear.addEventListener("click", () => {
    if (store.count > 0 && !confirm("Clear today's completed rounds?")) return;
    store.count = 0;
    store.cycle = 0;
    saveStore();
    render();
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && e.target === document.body) {
      e.preventDefault();
      els.start.click();
    }
  });

  // Keep multiple open tabs showing the same saved data.
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    Object.assign(store, loadStore());
    render();
  });

  // Browsers throttle timers in background tabs; re-sync when visible again.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && state.running) tick();
  });

  render();
})();
