// Tiny confetti engine: pink, blue, white, lavender and gold pieces, plus hearts.
(function () {
  var canvas = document.getElementById('confetti');
  var ctx = canvas.getContext('2d');
  var W, H, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var colors = ['#ff8fb8', '#ff5c9e', '#ffd1e3', '#8fd3ff', '#4fb3ff', '#d9f1ff', '#ffffff', '#c9b6ff', '#ffe27a'];
  var parts = [];

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function burst(x, y, n, spread, power) {
    for (var i = 0; i < n; i++) {
      var a = (-Math.PI / 2) + (Math.random() - 0.5) * spread;
      var v = power * (0.45 + Math.random() * 0.75);
      parts.push({
        x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        w: 6 + Math.random() * 8, h: 8 + Math.random() * 10,
        rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3,
        c: colors[(Math.random() * colors.length) | 0],
        shape: Math.random() < 0.18 ? 'heart' : (Math.random() < 0.4 ? 'dot' : 'rect'),
        life: 0, max: 220 + Math.random() * 120, sway: Math.random() * 6.28
      });
    }
  }

  function heart(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.2, x - s, y - s * 0.2, x - s, y + s * 0.35);
    ctx.bezierCurveTo(x - s, y + s * 0.9, x, y + s * 1.1, x, y + s * 1.4);
    ctx.bezierCurveTo(x, y + s * 1.1, x + s, y + s * 0.9, x + s, y + s * 0.35);
    ctx.bezierCurveTo(x + s, y - s * 0.2, x, y - s * 0.2, x, y + s * 0.3);
    ctx.fill();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.life++;
      p.vy += 0.16; p.vx *= 0.992; p.vy *= 0.992;
      p.sway += 0.06;
      p.x += p.vx + Math.sin(p.sway) * 0.6; p.y += p.vy; p.rot += p.vr;
      if (p.y > H + 30 || p.life > p.max) { parts.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, (p.max - p.life) / 40);
      ctx.fillStyle = p.c;
      if (p.shape === 'rect') ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      else if (p.shape === 'dot') { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, 6.28); ctx.fill(); }
      else heart(0, -p.w / 2, p.w * 0.6);
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  frame();

  window.celebrate = function () {
    if (window.Snd) Snd.confettiPop();
    burst(W * 0.15, H * 0.9, 90, 1.5, 17);
    burst(W * 0.85, H * 0.9, 90, 1.5, 17);
    burst(W * 0.5, H * 0.6, 110, 2.6, 15);
  };

  // Big opening blast, then a steady shower.
  window.celebrate();
  setTimeout(window.celebrate, 500);
  setInterval(function () {
    burst(Math.random() * W, -10, 14, 0.4, -1);   // gentle rain from the top
    for (var i = parts.length - 14; i < parts.length; i++) { if (parts[i]) { parts[i].vy = 1 + Math.random() * 2; parts[i].vx = (Math.random() - 0.5) * 2; } }
  }, 260);
  setInterval(window.celebrate, 2600);
})();
