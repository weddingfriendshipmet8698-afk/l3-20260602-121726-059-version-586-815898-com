(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var filterPanel = document.querySelector('[data-filter-panel]');
  var filterList = document.querySelector('[data-filter-list]');
  var emptyState = document.querySelector('[data-empty-state]');

  if (filterPanel && filterList) {
    var keywordInput = filterPanel.querySelector('[data-filter-keyword]');
    var categorySelect = filterPanel.querySelector('[data-filter-category]');
    var yearSelect = filterPanel.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(filterList.children);
    var params = new URLSearchParams(window.location.search);
    var firstQuery = params.get('q') || '';

    if (keywordInput && firstQuery) {
      keywordInput.value = firstQuery;
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
      var keyword = normalize(keywordInput ? keywordInput.value : '');
      var category = categorySelect ? categorySelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-category'),
          card.textContent
        ].join(' '));
        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchCategory = !category || card.getAttribute('data-category') === category;
        var matchYear = !year || card.getAttribute('data-year') === year;
        var shouldShow = matchKeyword && matchCategory && matchYear;
        card.style.display = shouldShow ? '' : 'none';
        if (shouldShow) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('visible', visible === 0);
      }
    }

    [keywordInput, categorySelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }
})();
