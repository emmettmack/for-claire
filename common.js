// Stuffed animals placed all around the page, plus floating hearts.
(function () {
  var animals = ['🧸','🐰','🐼','🦄','🐱','🐶','🐸','🐘','🐧','🐻','🐑','🦊','🐨','🐷','🦋','🐥'];
  // [left%, top%, size px, rotation deg, delay s]
  var spots = [
    [3,5,64,-10,0],[80,3,70,8,.4],[44,2,54,0,.9],[90,30,60,12,.2],[2,34,66,-8,1.1],
    [86,58,72,-6,.6],[4,62,70,10,.3],[16,80,76,-12,1.3],[70,80,68,6,.8],[44,86,60,0,1.5],
    [30,10,50,-6,.5],[62,12,50,6,1.0]
  ];
  var layer = document.createDocumentFragment();
  spots.forEach(function (s, i) {
    var el = document.createElement('div');
    el.className = 'plush';
    el.textContent = animals[i % animals.length];
    el.style.cssText = 'left:' + s[0] + '%;top:' + s[1] + '%;font-size:' + s[2] + 'px;--r:' + s[3] + 'deg;animation-delay:' + s[4] + 's';
    layer.appendChild(el);
  });
  var hearts = ['💗','💙','💖','🩷','💕'];
  for (var i = 0; i < 9; i++) {
    var h = document.createElement('div');
    h.className = 'heart-float';
    h.textContent = hearts[i % hearts.length];
    h.style.cssText = 'left:' + (Math.random() * 96) + '%;font-size:' + (16 + Math.random() * 18) + 'px;animation-duration:' + (9 + Math.random() * 8) + 's;animation-delay:' + (Math.random() * 8) + 's';
    layer.appendChild(h);
  }
  document.body.appendChild(layer);
})();
