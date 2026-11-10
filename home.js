(function () {
  var env = document.getElementById('env');
  var wrap = document.getElementById('envWrap');
  var letter = document.getElementById('letter');
  var opening = false;

  function showLetter() { wrap.style.display = 'none'; letter.classList.add('show'); }

  function openLetter() {
    if (env.classList.contains('open')) return;
    env.classList.add('open');
    if (window.Snd) { Snd.resume(); Snd.music(false); Snd.pop(); }
    setTimeout(showLetter, 750);
  }
  env.addEventListener('click', openLetter);
  env.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetter(); }
  });

  // Coming back from the void page: skip the envelope and show the question again.
  var back = false;
  try {
    if (sessionStorage.getItem('claire.openLetter') === '1') {
      sessionStorage.removeItem('claire.openLetter');
      back = true;
    }
  } catch (e) {}
  if (back) {
    showLetter();
    if (window.Snd) Snd.whenReady(function () { Snd.music(false); }, true);
  }

  document.getElementById('hear').addEventListener('click', function () {
    if (opening) return; opening = true;
    window.location.href = 'ask.html';
  });
  document.getElementById('keep').addEventListener('click', function () {
    if (opening) return; opening = true;
    window.location.href = 'void.html';
  });
})();
