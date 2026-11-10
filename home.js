(function () {
  var env = document.getElementById('env');
  var wrap = document.getElementById('envWrap');
  var letter = document.getElementById('letter');

  function openLetter() {
    if (env.classList.contains('open')) return;
    env.classList.add('open');
    if (window.Snd) { Snd.resume(); Snd.music(false); Snd.pop(); }
    setTimeout(function () {
      wrap.style.display = 'none';
      letter.classList.add('show');
    }, 750);
  }
  env.addEventListener('click', openLetter);
  env.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetter(); }
  });

  // Fresh start every time she lands on the home page.
  var noCount = 0;

  var going = false;
  document.getElementById('yes').addEventListener('click', function () {
    if (going) return; going = true;
    function go() { window.location.href = 'yes.html'; }
    if (window.Snd) { Snd.resume(); Snd.bingbong(go); } else go();
  });

  // Coming back after a "no": a quiet nudge to try again.
  try {
    if (sessionStorage.getItem('claire.tryAgain') === '1') {
      sessionStorage.removeItem('claire.tryAgain');
      document.body.classList.add('retry');
    }
  } catch (e) {}

  // "No" looks clickable but does nothing, until the third click.
  document.getElementById('no').addEventListener('click', function () {
    noCount += 1;
    if (noCount >= 3) window.location.href = 'oh-no.html';
  });
})();
