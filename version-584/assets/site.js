(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
      });
    });
    show(0);
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function setupCardFilter() {
    var input = document.querySelector('[data-filter-input]');
    var select = document.querySelector('[data-filter-select]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var empty = document.querySelector('[data-empty-state]');
    if (!cards.length || (!input && !select)) {
      return;
    }
    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }
    function applyFilter() {
      var keyword = normalize(input ? input.value : '');
      var year = select ? select.value : '';
      var visibleCount = 0;
      cards.forEach(function (card) {
        var text = normalize(card.textContent + ' ' + card.getAttribute('data-meta'));
        var yearMatch = !year || text.indexOf(year.toLowerCase()) !== -1;
        var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
        var visible = yearMatch && keywordMatch;
        card.style.display = visible ? '' : 'none';
        if (visible) {
          visibleCount += 1;
        }
      });
      if (empty) {
        empty.style.display = visibleCount ? 'none' : 'block';
      }
    }
    if (input) {
      input.addEventListener('input', applyFilter);
    }
    if (select) {
      select.addEventListener('change', applyFilter);
    }
    applyFilter();
  }

  function setupSearchPage() {
    var root = document.querySelector('[data-search-results]');
    if (!root || !window.movieSearchData) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var input = document.querySelector('[data-search-page-input]');
    var count = document.querySelector('[data-search-count]');
    var query = params.get('q') || '';
    if (input) {
      input.value = query;
    }
    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }
    function card(item) {
      var tags = item.tags.slice(0, 4).map(function (tag) {
        return '<span>' + tag + '</span>';
      }).join('');
      return [
        '<article class="search-result-card">',
        '  <a href="' + item.url + '"><img src="' + item.cover + '" alt="' + item.title + '" loading="lazy"></a>',
        '  <div>',
        '    <h2><a href="' + item.url + '">' + item.title + '</a></h2>',
        '    <div class="movie-meta"><span>' + item.year + '</span><span>' + item.region + '</span><span>' + item.genre + '</span></div>',
        '    <p>' + item.oneLine + '</p>',
        '    <div class="tag-row">' + tags + '</div>',
        '  </div>',
        '</article>'
      ].join('');
    }
    function render() {
      var keyword = normalize(input ? input.value : query);
      var results = window.movieSearchData.filter(function (item) {
        return !keyword || normalize(item.text).indexOf(keyword) !== -1;
      }).slice(0, 120);
      root.innerHTML = results.map(card).join('');
      if (count) {
        count.textContent = String(results.length);
      }
    }
    if (input) {
      input.addEventListener('input', render);
    }
    render();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupCardFilter();
    setupSearchPage();
  });
})();
