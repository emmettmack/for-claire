// A cube runs, jumps into the void, the void swallows the screen and reveals GFYS,
// then the whole thing rewinds and sends her back to the question.
// Everything is a pure function of time `t`, so playing it backwards is just t going down.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var gd = $('gd'), bg = $('bg'), ground = $('ground'), hole = $('hole'), cube = $('cube'),
      flash = $('flash'), lettersWrap = $('letters'), sparksWrap = $('sparks');
  var letters = [].slice.call(lettersWrap.children);
  var sparks = [];
  for (var s = 0; s < 18; s++) { var b = document.createElement('b'); sparksWrap.appendChild(b); sparks.push(b); }

  // Timeline (seconds)
  var RUN_END = 1.3, JUMP_END = 2.3, ABSORB_END = 2.9, EXPAND_END = 3.7, LETTERS_AT = 3.8, T = 6.4;
  var W, H, cs, groundY, hx, hy, hr, cover;

  function measure() {
    W = window.innerWidth; H = window.innerHeight;
    cs = Math.max(46, Math.min(66, W * 0.15));
    groundY = H * 0.76;
    hx = W * 0.74; hy = H * 0.40; hr = Math.max(48, Math.min(72, W * 0.17));
    cover = Math.hypot(W, H) / (2 * hr) * 1.15;
    hole.style.width = hole.style.height = (hr * 2) + 'px';
    cube.style.width = cube.style.height = cs + 'px';
  }
  measure(); window.addEventListener('resize', function () { measure(); render(t); });

  function clamp(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }
  function ease(x) { x = clamp(x); return x * x * (3 - 2 * x); }
  function easeOut(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
  function backOut(x) { x = clamp(x); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
  function lerp(a, b, u) { return a + (b - a) * u; }

  function render(t) {
    bg.style.backgroundPosition = (-t * 40) + 'px 0, 0 ' + (t * 20) + 'px, 0 0';
    ground.style.backgroundPosition = '0 0, ' + (-t * 300) + 'px 0, 0 0';

    // void
    var expand = ease((t - ABSORB_END) / (EXPAND_END - ABSORB_END));
    var pulse = t > JUMP_END && t < ABSORB_END ? 1 + 0.22 * Math.sin(((t - JUMP_END) / (ABSORB_END - JUMP_END)) * Math.PI) : 1;
    var vs = (1 + 0.04 * Math.sin(t * 5)) * pulse * (1 + expand * (cover - 1));
    hole.style.transform = 'translate(' + (hx - hr) + 'px,' + (hy - hr) + 'px) scale(' + vs + ') rotate(' + (t * 160) + 'deg)';

    // cube
    var cx, cy, rot = 0, sc = 1, show = t < ABSORB_END;
    var startY = groundY - cs / 2, startX = W * 0.26;
    if (t <= RUN_END) {
      cx = lerp(-cs, startX, ease(t / RUN_END)); cy = startY;
    } else if (t <= JUMP_END) {
      var u = (t - RUN_END) / (JUMP_END - RUN_END);
      cx = lerp(startX, hx, u);
      cy = lerp(startY, hy, u) - 4 * (H * 0.16) * u * (1 - u);
      rot = 360 * ease(u);
    } else {
      var a = clamp((t - JUMP_END) / (ABSORB_END - JUMP_END));
      cx = hx; cy = hy; rot = 360 + 720 * a; sc = 1 - ease(a);
    }
    cube.style.display = show ? 'block' : 'none';
    cube.style.transform = 'translate(' + (cx - cs / 2) + 'px,' + (cy - cs / 2) + 'px) rotate(' + rot + 'deg) scale(' + sc + ')';

    // flash as the void tears open
    var f = Math.max(0, 1 - Math.abs(t - (ABSORB_END + 0.05)) / 0.22) * 0.85;
    flash.style.opacity = f;

    // letters
    letters.forEach(function (el, i) {
      var p = clamp((t - LETTERS_AT - i * 0.26) / 0.45);
      el.style.opacity = p;
      el.style.transform = 'scale(' + (0.2 + 0.8 * backOut(p)) + ') translateY(' + ((1 - p) * 30) + 'px)';
    });

    // sparks burst from the middle
    var sp = clamp((t - LETTERS_AT) / 1.6);
    sparks.forEach(function (el, i) {
      var ang = (i / sparks.length) * Math.PI * 2 + (i % 2 ? 0.2 : 0);
      var r = easeOut(sp) * Math.min(W, H) * (0.35 + 0.25 * ((i * 7) % 5) / 4);
      var o = sp > 0 ? Math.max(0, 1 - sp) : 0;
      el.style.opacity = o;
      el.style.transform = 'translate(' + (W / 2 + Math.cos(ang) * r) + 'px,' + (H / 2 + Math.sin(ang) * r) + 'px) rotate(' + (sp * 360 + i * 20) + 'deg) scale(' + (0.6 + (i % 3) * 0.4) + ')';
    });
  }

  // ---- playback ----
  var t = 0, phase = 'fwd', last = 0, holdUntil = 0, done = false, fired = {};
  var params = new URLSearchParams(location.search);
  if (params.has('t')) { t = parseFloat(params.get('t')) || 0; measure(); render(t); return; }   // freeze-frame for testing

  function sfxAt(name, when, fn) { if (t >= when && !fired[name]) { fired[name] = true; fn(); } }
  function finish() {
    if (done) return; done = true;
    try { sessionStorage.setItem('claire.openLetter', '1'); } catch (e) {}
    window.location.replace('index.html');
  }
  if (window.Snd) Snd.whenReady(function () {}, true);
  // Safety net: if the browser throttles animation (battery saver, backgrounded), still send her back.
  setTimeout(finish, 15000);

  function frame(now) {
    if (!last) last = now;
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (phase === 'fwd') {
      t += dt;
      if (window.Snd) {
        sfxAt('jump', RUN_END, Snd.sfx.jump);
        sfxAt('suck', JUMP_END, Snd.sfx.suck);
        sfxAt('boom', ABSORB_END, Snd.sfx.boom);
        for (var i = 0; i < 4; i++) (function (i) { sfxAt('rv' + i, LETTERS_AT + i * 0.26, function () { Snd.sfx.reveal(i); }); })(i);
      }
      if (t >= T) { t = T; phase = 'hold'; holdUntil = now + 500; }
    } else if (phase === 'hold') {
      if (now >= holdUntil) {
        phase = 'rev'; gd.classList.add('rewinding');
        if (window.Snd) Snd.sfx.rewind();
      }
    } else {
      t -= dt * 2.1;
      if (t <= 0) { t = 0; render(0); finish(); return; }
    }
    render(t);
    requestAnimationFrame(frame);
  }
  render(0);
  requestAnimationFrame(frame);
})();
