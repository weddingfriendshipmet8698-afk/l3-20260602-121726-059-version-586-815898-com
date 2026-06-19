var hlsLoader = import('./hls-vendor-dru42stk.js')
    .then(function (module) {
        return module.H;
    })
    .catch(function () {
        return null;
    });

function readPlayerConfig() {
    var node = document.getElementById('movie-player-config');

    if (!node) {
        return null;
    }

    try {
        return JSON.parse(node.textContent || '{}');
    } catch (error) {
        return null;
    }
}

function bindPlayer() {
    var shell = document.querySelector('[data-player-shell]');
    var video = document.querySelector('[data-player-video]');
    var button = document.querySelector('[data-player-button]');
    var config = readPlayerConfig();

    if (!shell || !video || !button || !config || !config.source) {
        return;
    }

    var hasLoaded = false;

    async function loadAndPlay() {
        if (!hasLoaded) {
            hasLoaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = config.source;
            } else {
                var Hls = await hlsLoader;

                if (Hls && Hls.isSupported()) {
                    var hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: false
                    });

                    hls.loadSource(config.source);
                    hls.attachMedia(video);
                    shell.hlsInstance = hls;
                } else {
                    video.src = config.source;
                }
            }
        }

        button.classList.add('hidden');

        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                button.classList.remove('hidden');
            });
        }
    }

    button.addEventListener('click', loadAndPlay);
    video.addEventListener('click', function () {
        if (video.paused) {
            loadAndPlay();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindPlayer);
} else {
    bindPlayer();
}
