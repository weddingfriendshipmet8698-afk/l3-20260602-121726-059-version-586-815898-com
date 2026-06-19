(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (player) {
      var video = player.querySelector('video[data-stream-url]');
      var button = player.querySelector('[data-player-start]');
      if (!video) {
        return;
      }
      var source = video.getAttribute('data-stream-url');
      var attached = false;
      var hlsInstance = null;

      async function attachStream() {
        if (attached || !source) {
          return;
        }
        attached = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          return;
        }
        try {
          var module = await import('./hls-dru42stk.js');
          var Hls = module.H;
          if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            return;
          }
        } catch (error) {
          attached = false;
        }
        video.src = source;
      }

      async function play() {
        if (button) {
          button.textContent = '正在播放';
          button.classList.add('hidden');
        }
        await attachStream();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            if (button) {
              button.textContent = '点击播放';
              button.classList.remove('hidden');
            }
          });
        }
      }

      if (button) {
        button.addEventListener('click', play);
      }
      video.addEventListener('click', function () {
        if (!attached) {
          play();
        }
      });
      window.addEventListener('beforeunload', function () {
        if (hlsInstance && typeof hlsInstance.destroy === 'function') {
          hlsInstance.destroy();
        }
      });
    });
  });
})();
