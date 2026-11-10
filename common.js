// Original soft plush characters (bunny, bear, elephant, pig, lamb, cat) placed all around the page,
// with gentle blinking, ear wiggles and head tilts, plus floating hearts.
(function () {
  var PAL = {
    pink:  { body: '#ffb3cf', head: '#ffc2d8', light: '#ffe6f0', inner: '#ff8fb5' },
    blue:  { body: '#9fd5ff', head: '#b0deff', light: '#e0f2ff', inner: '#7cc3f5' },
    cream: { body: '#fbe9d3', head: '#fdf0e0', light: '#fffaf2', inner: '#f6c5b5' },
    tan:   { body: '#e3b184', head: '#ebbf94', light: '#f6dcc0', inner: '#d89c9c' },
    lav:   { body: '#cdbaff', head: '#d9c9ff', light: '#efe7ff', inner: '#b79cf7' },
    mint:  { body: '#a9e6cf', head: '#bcecda', light: '#e3f7ee', inner: '#f2a9bd' }
  };
  var LINE = 'rgba(110,60,120,.22)';
  var DARK = '#3b2a40';

  function ell(cx, cy, rx, ry, fill, extra) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '" stroke="' + LINE + '" stroke-width="1.5" ' + (extra || '') + '/>';
  }
  function earG(origin, anim, inner) {
    return '<g class="ear ' + anim + '" style="transform-origin:' + origin + '">' + inner + '</g>';
  }

  function build(shape, c, delay) {
    var body =
      '<ellipse cx="60" cy="123" rx="34" ry="6" fill="rgba(90,50,90,.16)"/>' +
      ell(42, 115, 14, 9, c.body) + ell(78, 115, 14, 9, c.body) +
      ell(60, 92, 30, 27, c.body) +
      '<ellipse cx="60" cy="99" rx="17" ry="14" fill="' + c.light + '" opacity=".9"/>' +
      ell(31, 94, 9, 15, c.body, 'transform="rotate(18 31 94)"') +
      ell(89, 94, 9, 15, c.body, 'transform="rotate(-18 89 94)"');

    var behind = '', head = '', front = '', eyeY = 52, mouth;
    var smile = '<path d="M55 63 Q60 68 65 63" fill="none" stroke="' + DARK + '" stroke-width="1.8" stroke-linecap="round"/>';

    if (shape === 'bunny') {
      behind =
        earG('46px 30px', 'wl', ell(38, 10, 10, 26, c.head, 'transform="rotate(-14 38 10)"') +
          '<ellipse cx="38" cy="12" rx="5" ry="17" fill="' + c.inner + '" opacity=".55" transform="rotate(-14 38 12)"/>') +
        earG('74px 30px', 'wr', ell(82, 10, 10, 26, c.head, 'transform="rotate(14 82 10)"') +
          '<ellipse cx="82" cy="12" rx="5" ry="17" fill="' + c.inner + '" opacity=".55" transform="rotate(14 82 12)"/>');
      head = ell(60, 52, 37, 33, c.head);
      front = '<ellipse cx="60" cy="58" rx="3.6" ry="2.6" fill="' + c.inner + '"/>';
      mouth = '<path d="M60 60 v3 M60 63 q-4 4 -8 1 M60 63 q4 4 8 1" fill="none" stroke="' + DARK + '" stroke-width="1.6" stroke-linecap="round"/>';
    } else if (shape === 'bear') {
      behind =
        earG('36px 34px', 'wl', ell(32, 26, 12, 12, c.body) + '<circle cx="32" cy="27" r="6" fill="' + c.light + '"/>') +
        earG('84px 34px', 'wr', ell(88, 26, 12, 12, c.body) + '<circle cx="88" cy="27" r="6" fill="' + c.light + '"/>');
      head = ell(60, 52, 37, 33, c.head);
      front = ell(60, 61, 15, 11, c.light) + '<ellipse cx="60" cy="56" rx="5" ry="3.4" fill="#4a3040"/>';
      mouth = '<path d="M60 58 v5 M60 63 q-4 4 -8 1 M60 63 q4 4 8 1" fill="none" stroke="#4a3040" stroke-width="1.6" stroke-linecap="round"/>';
    } else if (shape === 'elephant') {
      behind =
        earG('40px 52px', 'wl', ell(20, 54, 20, 22, c.head) + '<ellipse cx="21" cy="55" rx="12" ry="14" fill="' + c.inner + '" opacity=".35"/>') +
        earG('80px 52px', 'wr', ell(100, 54, 20, 22, c.head) + '<ellipse cx="99" cy="55" rx="12" ry="14" fill="' + c.inner + '" opacity=".35"/>');
      head = ell(60, 52, 36, 32, c.head);
      front =
        '<g class="trunk" style="transform-origin:60px 60px"><path d="M60 60 C60 80 48 84 50 98" fill="none" stroke="' + LINE + '" stroke-width="17" stroke-linecap="round"/>' +
        '<path d="M60 60 C60 80 48 84 50 98" fill="none" stroke="' + c.head + '" stroke-width="14" stroke-linecap="round"/></g>';
      eyeY = 46; mouth = '';
    } else if (shape === 'pig') {
      behind =
        earG('40px 30px', 'wl', ell(30, 24, 10, 14, c.head, 'transform="rotate(-35 30 24)"')) +
        earG('80px 30px', 'wr', ell(90, 24, 10, 14, c.head, 'transform="rotate(35 90 24)"'));
      head = ell(60, 52, 37, 33, c.head);
      front = ell(60, 60, 14, 10, c.inner, '') +
        '<ellipse cx="55" cy="60" rx="2" ry="3" fill="rgba(90,40,70,.55)"/><ellipse cx="65" cy="60" rx="2" ry="3" fill="rgba(90,40,70,.55)"/>';
      eyeY = 46; mouth = '';
    } else if (shape === 'lamb') {
      behind =
        ell(28, 40, 14, 14, c.light) + ell(40, 22, 14, 14, c.light) + ell(60, 16, 15, 15, c.light) +
        ell(80, 22, 14, 14, c.light) + ell(92, 40, 14, 14, c.light) +
        earG('36px 56px', 'wl', ell(24, 58, 13, 7, c.inner, 'transform="rotate(18 24 58)"')) +
        earG('84px 56px', 'wr', ell(96, 58, 13, 7, c.inner, 'transform="rotate(-18 96 58)"'));
      head = ell(60, 55, 29, 27, '#f7d9ca');
      front = '<ellipse cx="60" cy="60" rx="3.6" ry="2.6" fill="#7a5568"/>';
      eyeY = 52; mouth = '<path d="M55 64 Q60 68 65 64" fill="none" stroke="' + DARK + '" stroke-width="1.7" stroke-linecap="round"/>';
    } else { // cat
      behind =
        earG('44px 34px', 'wl', '<path d="M30 38 L26 10 L54 26 Z" fill="' + c.head + '" stroke="' + c.head + '" stroke-width="6" stroke-linejoin="round"/><path d="M33 31 L31 17 L45 26 Z" fill="' + c.inner + '" opacity=".6"/>') +
        earG('76px 34px', 'wr', '<path d="M90 38 L94 10 L66 26 Z" fill="' + c.head + '" stroke="' + c.head + '" stroke-width="6" stroke-linejoin="round"/><path d="M87 31 L89 17 L75 26 Z" fill="' + c.inner + '" opacity=".6"/>');
      head = ell(60, 52, 37, 32, c.head);
      front =
        '<path d="M22 56 L40 58 M22 64 L40 62 M98 56 L80 58 M98 64 L80 62" stroke="rgba(90,50,100,.35)" stroke-width="1.4" stroke-linecap="round"/>' +
        '<path d="M57 57 L63 57 L60 61 Z" fill="' + c.inner + '"/>';
      mouth = '<path d="M60 61 q-3 5 -7 2 M60 61 q3 5 7 2" fill="none" stroke="' + DARK + '" stroke-width="1.5" stroke-linecap="round"/>';
    }

    var face =
      '<g class="eyes" style="transform-origin:60px ' + eyeY + 'px;animation-delay:' + delay + 's">' +
        '<circle cx="46" cy="' + eyeY + '" r="3.8" fill="' + DARK + '"/><circle cx="74" cy="' + eyeY + '" r="3.8" fill="' + DARK + '"/>' +
        '<circle cx="47.3" cy="' + (eyeY - 1.4) + '" r="1.2" fill="#fff"/><circle cx="75.3" cy="' + (eyeY - 1.4) + '" r="1.2" fill="#fff"/>' +
      '</g>' +
      '<ellipse cx="35" cy="' + (eyeY + 10) + '" rx="6" ry="4" fill="#ff8fb5" opacity=".45"/>' +
      '<ellipse cx="85" cy="' + (eyeY + 10) + '" rx="6" ry="4" fill="#ff8fb5" opacity=".45"/>' +
      (mouth === undefined ? smile : mouth);

    var shine = '<ellipse cx="46" cy="36" rx="12" ry="6" fill="#fff" opacity=".22" transform="rotate(-20 46 36)"/>';
    return '<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      body + '<g class="head" style="transform-origin:60px 84px;animation-delay:' + delay + 's">' +
      behind + head + shine + front + face + '</g></svg>';
  }

  // [left%, top%, width px, rotation deg, delay s, shape, palette]
  var spots = [
    [2, 4, 84, -8, 0,   'bear',     'tan'],
    [78, 2, 92, 6, .4,  'bunny',    'pink'],
    [42, 1, 74, 0, .9,  'elephant', 'blue'],
    [88, 30, 82, 10, .2,'pig',      'pink'],
    [3, 19, 78, -6, 1.1,'lamb',     'cream'],
    [84, 56, 92, -5, .6,'cat',      'lav'],
    [3, 60, 90, 8, .3,  'bunny',    'blue'],
    [16, 80, 96, -10, 1.3,'bear',   'pink'],
    [70, 80, 90, 5, .8, 'elephant', 'pink'],
    [44, 85, 78, 0, 1.5,'pig',      'mint'],
    [27, 12, 62, -5, .5,'cat',      'cream'],
    [62, 13, 62, 5, 1.0,'lamb',     'blue']
  ];

  var frag = document.createDocumentFragment();
  spots.forEach(function (s, i) {
    var el = document.createElement('div');
    el.className = 'plush';
    el.style.cssText = 'left:' + s[0] + '%;top:' + s[1] + '%;width:' + s[2] + 'px;--r:' + s[3] + 'deg;animation-delay:' + s[4] + 's';
    el.innerHTML = build(s[5], PAL[s[6]], (i * 0.7).toFixed(1));
    frag.appendChild(el);
  });

  var heartColors = ['#ff8fb8', '#8fd3ff', '#ff5c9e', '#4fb3ff', '#ffd1e3'];
  for (var k = 0; k < 9; k++) {
    var h = document.createElement('div');
    h.className = 'heart-float';
    var size = 16 + Math.random() * 18;
    h.style.cssText = 'left:' + (Math.random() * 96) + '%;width:' + size + 'px;animation-duration:' + (9 + Math.random() * 8) + 's;animation-delay:' + (Math.random() * 8) + 's';
    h.innerHTML = '<svg viewBox="0 0 24 22"><path d="M12 21 C-3 11 3 0 12 6 C21 0 27 11 12 21Z" fill="' + heartColors[k % heartColors.length] + '"/></svg>';
    frag.appendChild(h);
  }
  document.body.appendChild(frag);
})();
