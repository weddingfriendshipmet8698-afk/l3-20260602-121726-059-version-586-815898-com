(function () {
  var video = document.getElementById('movie-player');
  var trigger = document.querySelector('[data-player-trigger]');

  if (!video) {
    return;
  }

  var source = video.getAttribute('data-src');
  var mounted = false;

  function bindSource() {
    if (mounted || !source) {
      return;
    }

    mounted = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
    }
  }

  function startPlayback() {
    bindSource();

    if (trigger) {
      trigger.classList.add('hidden');
    }

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (trigger) {
    trigger.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener('play', function () {
    if (trigger) {
      trigger.classList.add('hidden');
    }
  });

  video.addEventListener('loadedmetadata', function () {
    if (trigger && !video.paused) {
      trigger.classList.add('hidden');
    }
  });
})();
