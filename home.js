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

  document.getElementById('yes').addEventListener('click', function () {
    if (window.Snd) Snd.yay();
    setTimeout(function () { window.location.href = 'yes.html'; }, 450);
  });

  // "No" looks clickable but does nothing, until the third click.
  document.getElementById('no').addEventListener('click', function () {
    noCount += 1;
    if (noCount >= 3) window.location.href = 'oh-no.html';
  });
})();
