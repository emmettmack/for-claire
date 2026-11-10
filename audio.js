// All sound is synthesized in the browser (Web Audio): no audio files, nothing to download.
// Browsers only allow sound after a tap, so music starts when she opens the envelope.
(function () {
  var KEY = 'claire.muted';
  var muted = false;
  try { muted = localStorage.getItem(KEY) === '1'; } catch (e) {}
  var ctx = null, master = null, timer = null, nextTime = 0, step = 0, eighth = 0.28;

  function ensure() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.9;
      master.connect(ctx.destination);
    }
    return ctx;
  }
  function resume() {
    var c = ensure();
    if (c && c.state !== 'running') { try { c.resume(); } catch (e) {} }
    return c;
  }
  function running() { return !!ctx && ctx.state === 'running'; }
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  // music-box style bell tone
  function bell(m, t, dur, vol) {
    var f = mtof(m);
    var o = ctx.createOscillator(), o2 = ctx.createOscillator();
    var g = ctx.createGain(), g2 = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f;
    o2.type = 'sine'; o2.frequency.value = f * 4; g2.gain.value = 0.16;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(master);
    o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }

  // Original 8-bar lullaby loop: C, Am, F, G, C, Am, F, G
  var BARS = [
    { c: [60, 64, 67], m: [84, 0, 79, 0, 76, 0, 79, 0] },
    { c: [57, 60, 64], m: [81, 0, 76, 0, 72, 0, 76, 0] },
    { c: [53, 57, 60], m: [77, 0, 81, 0, 84, 0, 81, 0] },
    { c: [55, 59, 62], m: [79, 0, 83, 0, 86, 0, 83, 79] },
    { c: [60, 64, 67], m: [88, 0, 84, 0, 79, 0, 84, 0] },
    { c: [57, 60, 64], m: [81, 0, 84, 0, 88, 0, 84, 0] },
    { c: [53, 57, 60], m: [84, 0, 81, 0, 77, 0, 81, 0] },
    { c: [55, 59, 62], m: [83, 0, 79, 0, 74, 0, 79, 0] }
  ];
  function scheduleStep(t) {
    var bar = BARS[Math.floor(step / 8) % BARS.length];
    var s = step % 8, c = bar.c;
    bell(c[s % 3 === 0 ? 0 : (s % 3 === 1 ? 1 : 2)] + 12, t, 0.9, 0.04);
    if (s === 0 || s === 4) bell(c[0] - 12, t, 1.4, 0.06);
    if (bar.m[s]) bell(bar.m[s], t, 1.2, 0.085);
    step++;
  }
  function tick() {
    if (!running()) { nextTime = ctx.currentTime + 0.05; return; }
    while (nextTime < ctx.currentTime + 0.4) { scheduleStep(nextTime); nextTime += eighth; }
  }
  function music(fast) {
    if (!ensure()) return;
    eighth = fast ? 0.2 : 0.28;
    if (timer) return;
    nextTime = ctx.currentTime + 0.1;
    timer = setInterval(tick, 100);
  }

  function noiseBurst(t, dur, freq, vol) {
    var n = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    var src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8; g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(master); src.start(t);
  }

  // If a real clip named bingbong.mp3 (or .m4a/.wav/.ogg) sits next to index.html, use it.
  var clip = null;
  (function findClip() {
    var names = ['bingbong.mp3', 'bingbong.m4a', 'bingbong.wav', 'bingbong.ogg'];
    (function next(i) {
      if (i >= names.length || !window.fetch) return;
      fetch(names[i], { method: 'HEAD' }).then(function (r) {
        if (r.ok) { clip = new Audio(names[i]); clip.preload = 'auto'; clip.muted = muted; clip.volume = 1; } else next(i + 1);
      }).catch(function () { next(i + 1); });
    })(0);
  })();

  var api = {
    resume: resume,
    music: music,
    whenReady: function (fn) {
      resume();
      if (running()) { fn(); return; }
      var done = false;
      function go() {
        if (done) return; done = true;
        window.removeEventListener('pointerdown', go, true);
        resume();
        setTimeout(function () { if (running()) fn(); }, 60);
        var h = document.querySelector('.sound-hint'); if (h) h.remove();
      }
      window.addEventListener('pointerdown', go, true);
      setTimeout(function () {
        if (!running() && !muted && !document.querySelector('.sound-hint')) {
          var h = document.createElement('div');
          h.className = 'sound-hint'; h.textContent = 'tap anywhere for sound';
          document.body.appendChild(h);
        }
      }, 500);
    },
    // The "BING BONG!" sound. Uses the real clip if present, otherwise a doorbell chime plus a spoken voice.
    bingbong: function (done) {
      if (muted) { if (done) setTimeout(done, 50); return; }
      var fired = false;
      function fin() { if (fired) return; fired = true; if (done) done(); }
      if (clip) {
        try { clip.currentTime = 0; var p = clip.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
        clip.onended = fin; setTimeout(fin, 1800); return;
      }
      resume();
      if (running()) {
        var t = ctx.currentTime + 0.02;
        bell(76, t, 1.3, 0.2); bell(72, t + 0.42, 1.8, 0.22);
      }
      try {
        if ('speechSynthesis' in window) {
          var u = new SpeechSynthesisUtterance('Bing bong!');
          u.rate = 1.0; u.pitch = 1.4; u.volume = 1;
          window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
        }
      } catch (e) {}
      setTimeout(fin, 1300);
    },
    // Keeps the bing bong repeating on the yes page. Retries on her first tap if the browser blocks autoplay.
    bingbongLoop: function () {
      var looping = false;
      function start() {
        if (looping) return;
        if (clip) {
          clip.loop = true; clip.muted = muted;
          var p = clip.play();
          if (p && p.then) {
            p.then(function () { looping = true; var h = document.querySelector('.sound-hint'); if (h) h.remove(); })
             .catch(function () { needTap(); });
          } else { looping = true; }
        } else {
          looping = true;
          api.bingbong();
          setInterval(function () { api.bingbong(); }, 2200);
        }
      }
      function needTap() {
        function again() { window.removeEventListener('pointerdown', again, true); start(); }
        window.addEventListener('pointerdown', again, true);
        if (!muted && !document.querySelector('.sound-hint')) {
          var h = document.createElement('div');
          h.className = 'sound-hint'; h.textContent = 'tap anywhere for sound';
          document.body.appendChild(h);
        }
      }
      // The clip is probed asynchronously; wait briefly for it to be found.
      var tries = 0;
      (function wait() { if (clip || tries++ > 12) start(); else setTimeout(wait, 100); })();
    },
    pop: function () {   // envelope opens
      if (!running()) return; var t = ctx.currentTime + 0.02;
      [84, 88, 91, 96].forEach(function (m, i) { bell(m, t + i * 0.08, 0.9, 0.12); });
    },
    yay: function () {   // she said yes
      if (!running()) return; var t = ctx.currentTime + 0.02;
      [72, 76, 79, 84, 88, 91, 96].forEach(function (m, i) { bell(m, t + i * 0.075, 1.1, 0.14); });
      noiseBurst(t + 0.35, 0.35, 2400, 0.25);
    },
    confettiPop: function () {
      if (!running()) return; var t = ctx.currentTime + 0.01;
      noiseBurst(t, 0.28, 1800 + Math.random() * 900, 0.22);
      var pent = [84, 86, 88, 91, 93, 96];
      bell(pent[(Math.random() * pent.length) | 0], t, 0.7, 0.09);
    },
    sad: function () {   // "wah wah wah waaah"
      if (!running()) return; var t = ctx.currentTime + 0.05;
      function note(f0, f1, start, dur) {
        var o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, start);
        o.frequency.linearRampToValueAtTime(f1, start + dur);
        lp.type = 'lowpass'; lp.frequency.setValueAtTime(500, start);
        lp.frequency.linearRampToValueAtTime(1100, start + dur * 0.35);
        lp.frequency.linearRampToValueAtTime(420, start + dur);
        g.gain.setValueAtTime(0.0001, start); g.gain.linearRampToValueAtTime(0.16, start + 0.05);
        g.gain.setValueAtTime(0.16, start + dur - 0.08); g.gain.linearRampToValueAtTime(0.0001, start + dur);
        o.connect(lp); lp.connect(g); g.connect(master); o.start(start); o.stop(start + dur + 0.02);
      }
      note(233, 233, t, 0.42); note(220, 220, t + 0.5, 0.42); note(208, 208, t + 1.0, 0.42);
      note(196, 150, t + 1.5, 1.3);
    }
  };
  window.Snd = api;

  // Mute button on every page.
  function speaker(on) {
    return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/>' +
      (on ? '<path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>' : '<path d="M17 9l5 6M22 9l-5 6"/>') + '</svg>';
  }
  function mountButton() {
    var b = document.createElement('button');
    b.className = 'mute-btn'; b.type = 'button';
    function paint() { b.innerHTML = speaker(!muted); b.setAttribute('aria-label', muted ? 'Turn sound on' : 'Turn sound off'); }
    paint();
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      muted = !muted;
      try { localStorage.setItem(KEY, muted ? '1' : '0'); } catch (err) {}
      ensure(); if (master) master.gain.value = muted ? 0 : 0.9;
      if (clip) clip.muted = muted;
      if (!muted) resume();
      paint();
    });
    document.body.appendChild(b);
  }
  if (document.body) mountButton(); else document.addEventListener('DOMContentLoaded', mountButton);
})();
