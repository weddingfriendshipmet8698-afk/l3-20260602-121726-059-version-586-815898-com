(function () {
  function attachStream(video, src) {
    if (!src) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      video._hls = hls;
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }

    video.src = src;
  }

  document.querySelectorAll('[data-player]').forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.player-shade');
    var prepared = false;

    function prepare() {
      if (prepared || !video) {
        return;
      }
      prepared = true;
      attachStream(video, video.getAttribute('data-src'));
    }

    function start() {
      prepare();
      if (button) {
        button.classList.add('is-hidden');
      }
      video.setAttribute('controls', 'controls');
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {
          if (button) {
            button.classList.remove('is-hidden');
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }

    box.addEventListener('click', function (event) {
      if (event.target === video) {
        return;
      }
      start();
    });
  });
})();
