(function () {
  var noCount = 0, going = false;

  if (window.Snd) Snd.whenReady(function () { Snd.music(false); }, true);

  // Coming back after a "no": a quiet nudge to try again.
  try {
    if (sessionStorage.getItem('claire.tryAgain') === '1') {
      sessionStorage.removeItem('claire.tryAgain');
      document.body.classList.add('retry');
    }
  } catch (e) {}

  // Yes: the clip starts the instant she taps (same tap = allowed to make sound), then the confetti scene appears.
  document.getElementById('yes').addEventListener('click', function () {
    if (going) return; going = true;
    if (window.Snd) { Snd.resume(); Snd.stopMusic(); Snd.bingbongLoop(); }
    showYes();
    try { history.pushState({ yes: 1 }, '', 'yes.html'); } catch (e) {}
    window.addEventListener('popstate', function () { window.location.reload(); });
  });

  // "No" looks clickable but does nothing, until the third click.
  document.getElementById('no').addEventListener('click', function () {
    noCount += 1;
    if (noCount >= 3) window.location.href = 'oh-no.html';
  });
})();
