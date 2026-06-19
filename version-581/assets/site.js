(function () {
  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let index = 0;

    const showSlide = function (nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.dataset.heroDot || 0));
      });
    });

    window.setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  const searchInput = document.querySelector('[data-page-search]');
  const scope = document.querySelector('[data-search-scope]');

  if (searchInput && scope) {
    const cards = Array.from(scope.querySelectorAll('.movie-card'));

    searchInput.addEventListener('input', function () {
      const keyword = searchInput.value.trim().toLowerCase();

      cards.forEach(function (card) {
        const text = [
          card.dataset.title || '',
          card.dataset.tags || '',
          card.dataset.year || '',
          card.textContent || ''
        ].join(' ').toLowerCase();

        card.classList.toggle('is-hidden-by-search', keyword && !text.includes(keyword));
      });
    });
  }
}());
