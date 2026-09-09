/*
 IZWI — eMhlabeni Theme Music
 Original browser-generated music only.
 No copyrighted recordings are included.
*/
(() => {
  let ctx = null, master = null, timer = null, step = 0, current = null;

  const tracks = {
    "uMhlaba": {
      name: "uMhlaba",
      style: "Original Zulu hip-hop inspired",
      bpm: 92,
      bass: [55,55,65,55,48,55,65,55],
      lead: [220,247,262,247,220,196,220,247]
    },
    "Amanzi": {
      name: "Amanzi Nights",
      style: "Original amapiano-inspired",
      bpm: 112,
      bass: [55,55,73,55,49,55,65,49],
      lead: [330,392,440,392,330,294,330,392]
    },
    "eMhlabeni": {
      name: "eMhlabeni",
      style: "Original cinematic homecoming",
      bpm: 78,
      bass: [65,73,82,73,55,65,73,55],
      lead: [196,220,247,262,247,220,196,175]
    }
  };

  function ensure() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.12;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
  }

  function tone(freq, duration, type="sine", volume=0.12, when=0) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), when + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    o.connect(g); g.connect(master);
    o.start(when); o.stop(when + duration + 0.03);
  }

  function kick(when) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(110, when);
    o.frequency.exponentialRampToValueAtTime(48, when + 0.12);
    g.gain.setValueAtTime(0.18, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.16);
    o.connect(g); g.connect(master); o.start(when); o.stop(when + 0.18);
  }

  function tick() {
    if (!current) return;
    const t = tracks[current];
    const now = ctx.currentTime;
    const beat = 60 / t.bpm;
    const i = step % 8;

    tone(t.bass[i], beat * 0.75, "triangle", 0.22, now);
    tone(t.lead[i], beat * 0.38, "sine", 0.045, now + beat * 0.15);
    if (i % 2 === 0) kick(now);
    if (t === tracks["Amanzi"] && i % 2 === 1) tone(1200, 0.035, "square", 0.018, now + beat * 0.5);

    step++;
    timer = setTimeout(tick, beat * 1000);
  }

  function stop() {
    if (timer) clearTimeout(timer);
    timer = null; current = null; step = 0;
  }

  window.IZWIThemeMusic = {
    tracks,
    play(id) {
      ensure();
      stop();
      current = tracks[id] ? id : "eMhlabeni";
      step = 0;
      tick();
    },
    stop,
    toggle(id) {
      if (current) stop(); else this.play(id || "eMhlabeni");
      return !!current;
    },
    current() { return current; }
  };
})();
