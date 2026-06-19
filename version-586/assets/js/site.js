(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-site-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (input && input.value.trim().length === 0) {
                event.preventDefault();
                window.location.href = './search.html';
            }
        });
    });

    var carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        var slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var activeIndex = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === activeIndex);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === activeIndex);
            });
        }

        function restartTimer() {
            if (timer) {
                clearInterval(timer);
            }

            timer = setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                restartTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(activeIndex - 1);
                restartTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(activeIndex + 1);
                restartTimer();
            });
        }

        showSlide(0);
        restartTimer();
    }

    var filterPanel = document.querySelector('[data-filter-panel]');

    if (filterPanel) {
        var keywordInput = filterPanel.querySelector('[data-filter-keyword]');
        var yearSelect = filterPanel.querySelector('[data-filter-year]');
        var typeSelect = filterPanel.querySelector('[data-filter-type]');
        var count = filterPanel.querySelector('[data-result-count]');
        var cards = Array.from(document.querySelectorAll('[data-movie-card]'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (keywordInput && query) {
            keywordInput.value = query;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function cardText(card) {
            return normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags'),
                card.textContent
            ].join(' '));
        }

        function applyFilter() {
            var keyword = normalize(keywordInput && keywordInput.value);
            var year = yearSelect ? yearSelect.value : '';
            var type = typeSelect ? typeSelect.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var matchesKeyword = !keyword || cardText(card).indexOf(keyword) >= 0;
                var matchesYear = !year || card.getAttribute('data-year') === year;
                var matchesType = !type || card.getAttribute('data-type') === type;
                var ok = matchesKeyword && matchesYear && matchesType;

                card.classList.toggle('is-hidden', !ok);

                if (ok) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = String(visible);
            }
        }

        [keywordInput, yearSelect, typeSelect].forEach(function (item) {
            if (item) {
                item.addEventListener('input', applyFilter);
                item.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    }
})();
