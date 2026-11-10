// Builds the confetti scene in place. Used on the yes page, and by the ask page so the
// sound can start inside her tap (phones only allow sound that starts from a tap).
(function () {
  var built = false;
  window.showYes = function () {
    if (built) return; built = true;
    var letter = document.getElementById('letter'); if (letter) letter.style.display = 'none';
    var vh = document.getElementById('volHint'); if (vh) vh.remove();
    document.body.classList.add('party');
    document.title = 'She said YES';

    var canvas = document.createElement('canvas'); canvas.id = 'confetti';
    document.body.insertBefore(canvas, document.body.firstChild);

    var main = document.querySelector('main.stage');
    var yay = document.createElement('div'); yay.className = 'yay';
    yay.innerHTML = '<h1>YAYYYY!!!</h1><h2>Claire said YES!</h2><p>You\'re officially my girlfriend</p>' +
                    '<button class="btn more" id="more">More confetti!</button>';
    main.appendChild(yay);
    document.getElementById('more').addEventListener('click', function () {
      if (window.celebrate) window.celebrate();
      if (window.Snd) Snd.bingbong();
    });

    var s = document.createElement('script'); s.src = 'confetti.js?v=20261110c'; document.body.appendChild(s);
  };
})();
