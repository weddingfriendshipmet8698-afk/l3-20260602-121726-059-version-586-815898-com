import { H as Hls } from './hls-dru42stk.js';

const setupPlayer = function (shell) {
  const video = shell.querySelector('video');
  const button = shell.querySelector('.player-cover');
  const source = shell.dataset.videoSrc;
  let loaded = false;
  let hls = null;

  if (!video || !source) {
    return;
  }

  const loadSource = function () {
    if (loaded) {
      return Promise.resolve();
    }

    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return Promise.resolve();
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return Promise.resolve();
    }

    video.src = source;
    return Promise.resolve();
  };

  const play = function () {
    loadSource().then(function () {
      button.classList.add('is-hidden');
      video.play().catch(function () {
        button.classList.remove('is-hidden');
      });
    });
  };

  button.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });
  video.addEventListener('pause', function () {
    if (!video.ended) {
      button.classList.remove('is-hidden');
    }
  });
  video.addEventListener('ended', function () {
    button.classList.remove('is-hidden');
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
};

document.querySelectorAll('[data-player]').forEach(setupPlayer);
