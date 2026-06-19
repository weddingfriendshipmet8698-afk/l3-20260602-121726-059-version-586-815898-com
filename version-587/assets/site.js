(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('img-hidden');
    }, { once: true });
  });

  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dots button'));
    var prev = carousel.querySelector('.hero-prev');
    var next = carousel.querySelector('.hero-next');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters(scope) {
    var queryInput = scope.querySelector('.local-filter') || document.querySelector('#searchInput');
    var typeSelect = scope.querySelector('.type-filter') || document.querySelector('#searchType');
    var regionSelect = scope.querySelector('.region-filter') || document.querySelector('#searchRegion');
    var target = scope.querySelector('.filter-target') || document.querySelector('.filter-target');

    if (!target) {
      return;
    }

    var cards = Array.prototype.slice.call(target.querySelectorAll('.movie-card'));

    function update() {
      var query = normalize(queryInput ? queryInput.value : '');
      var type = normalize(typeSelect ? typeSelect.value : '');
      var region = normalize(regionSelect ? regionSelect.value : '');

      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.type,
          card.dataset.year,
          card.dataset.region,
          card.dataset.tags,
          card.textContent
        ].join(' '));
        var okQuery = !query || haystack.indexOf(query) !== -1;
        var okType = !type || normalize(card.dataset.type) === type;
        var okRegion = !region || normalize(card.dataset.region) === region;
        card.classList.toggle('is-filtered-out', !(okQuery && okType && okRegion));
      });
    }

    if (queryInput) {
      queryInput.addEventListener('input', update);
    }
    if (typeSelect) {
      typeSelect.addEventListener('change', update);
    }
    if (regionSelect) {
      regionSelect.addEventListener('change', update);
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && queryInput) {
      queryInput.value = q;
    }
    update();
  }

  document.querySelectorAll('.content-section').forEach(applyFilters);
})();
