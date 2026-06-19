(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');

  if (menuButton && panel) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showHero(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function move(step) {
      showHero(current + step);
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        move(1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        move(-1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        move(1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    restart();
  }

  function normalize(text) {
    return String(text || '').toLowerCase().trim();
  }

  var localFilter = document.querySelector('.local-filter');
  var pageInput = document.querySelector('.search-page-input');
  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';

  if (pageInput && query) {
    pageInput.value = query;
  }

  if (localFilter && query) {
    localFilter.value = query;
  }

  function applyFilter(value) {
    var needle = normalize(value);
    var cards = document.querySelectorAll('[data-filter-card]');

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.textContent
      ].join(' '));

      card.hidden = needle && haystack.indexOf(needle) === -1;
    });
  }

  if (localFilter) {
    localFilter.addEventListener('input', function () {
      applyFilter(localFilter.value);
    });
    applyFilter(localFilter.value);
  } else if (query) {
    applyFilter(query);
  }

  function preparePlayer(box) {
    var video = box.querySelector('.movie-video');
    var button = box.querySelector('.player-button');
    var state = box.querySelector('.player-state');
    var started = false;
    var hls = null;

    if (!video) {
      return;
    }

    function setState(text) {
      if (state) {
        state.textContent = text || '';
      }
    }

    function start() {
      var src = video.getAttribute('data-stream');

      if (!src) {
        setState('播放暂不可用');
        return;
      }

      if (!started) {
        started = true;
        setState('正在载入');

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setState('');
            video.play().catch(function () {
              setState('点击画面继续播放');
            });
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setState('播放暂不可用');
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.addEventListener('loadedmetadata', function () {
            setState('');
            video.play().catch(function () {
              setState('点击画面继续播放');
            });
          }, { once: true });
        } else {
          setState('播放暂不可用');
        }
      } else {
        if (video.paused) {
          video.play().catch(function () {
            setState('点击画面继续播放');
          });
        } else {
          video.pause();
        }
      }
    }

    video.addEventListener('play', function () {
      box.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      box.classList.remove('is-playing');
    });

    video.addEventListener('ended', function () {
      box.classList.remove('is-playing');
    });

    video.addEventListener('click', start);

    if (button) {
      button.addEventListener('click', start);
    }

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.querySelectorAll('.video-box').forEach(preparePlayer);
})();
