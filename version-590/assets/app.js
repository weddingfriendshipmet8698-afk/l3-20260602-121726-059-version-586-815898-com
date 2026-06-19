(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            var open = mobilePanel.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var hero = document.querySelector('[data-hero-carousel]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-slide')) || 0);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5800);
        }
    }

    var filterInput = document.querySelector('.filter-input');
    var sortableGrid = document.querySelector('.sortable-grid');

    function searchableText(card) {
        return [
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.textContent
        ].join(' ').toLowerCase();
    }

    function filterCards(value) {
        if (!sortableGrid) {
            return;
        }
        var query = (value || '').trim().toLowerCase();
        Array.prototype.slice.call(sortableGrid.children).forEach(function (card) {
            var visible = !query || searchableText(card).indexOf(query) !== -1;
            card.classList.toggle('hidden-card', !visible);
        });
    }

    if (filterInput) {
        var params = new URLSearchParams(window.location.search);
        var urlQuery = params.get('q') || '';
        if (urlQuery) {
            filterInput.value = urlQuery;
        }
        filterCards(filterInput.value);
        filterInput.addEventListener('input', function () {
            filterCards(filterInput.value);
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-keyword]')).forEach(function (button) {
        button.addEventListener('click', function () {
            if (!filterInput) {
                return;
            }
            filterInput.value = button.getAttribute('data-keyword') || '';
            filterCards(filterInput.value);
        });
    });

    Array.prototype.slice.call(document.querySelectorAll('[data-sort]')).forEach(function (button) {
        button.addEventListener('click', function () {
            if (!sortableGrid) {
                return;
            }
            var type = button.getAttribute('data-sort');
            var cards = Array.prototype.slice.call(sortableGrid.children);
            cards.sort(function (a, b) {
                if (type === 'year') {
                    return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
                }
                if (type === 'name') {
                    return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
                }
                return Number(b.getAttribute('data-views')) - Number(a.getAttribute('data-views'));
            });
            cards.forEach(function (card) {
                sortableGrid.appendChild(card);
            });
            Array.prototype.slice.call(button.parentNode.querySelectorAll('button')).forEach(function (btn) {
                btn.classList.toggle('active', btn === button);
            });
        });
    });

    function initPlayer(player) {
        var video = player.querySelector('video');
        var button = player.querySelector('.play-overlay');
        var status = player.querySelector('.player-status');
        var stream = player.getAttribute('data-stream');
        var ready = false;
        var hlsInstance = null;

        function setStatus(text) {
            if (status) {
                status.textContent = text || '';
            }
        }

        function prepareVideo() {
            if (ready) {
                return true;
            }
            if (!video || !stream) {
                setStatus('播放暂时不可用，请稍后再试');
                return false;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls();
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
                    if (data && data.fatal) {
                        setStatus('播放暂时不可用，请稍后再试');
                    }
                });
                ready = true;
                return true;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                ready = true;
                return true;
            }
            setStatus('播放暂时不可用，请稍后再试');
            return false;
        }

        function playVideo() {
            if (!prepareVideo()) {
                return;
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.then(function () {
                    player.classList.add('playing');
                    setStatus('');
                }).catch(function () {
                    setStatus('点击播放器继续播放');
                });
            } else {
                player.classList.add('playing');
                setStatus('');
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    playVideo();
                } else {
                    video.pause();
                }
            });
            video.addEventListener('play', function () {
                player.classList.add('playing');
            });
            video.addEventListener('pause', function () {
                player.classList.remove('playing');
            });
            window.addEventListener('beforeunload', function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        }
    }

    Array.prototype.slice.call(document.querySelectorAll('.movie-player')).forEach(initPlayer);
})();
