// Service Worker for GitHub Pages (subfolder safe)

const CACHE_NAME = 'tempmail-v2';
const BASE_PATH = '/-Team_Broken_Websit';

const ASSETS = [
    BASE_PATH + '/',
    BASE_PATH + '/index.html',
    BASE_PATH + '/css/main.css',
    BASE_PATH + '/js/app.js',
    BASE_PATH + '/js/api.js',
    BASE_PATH + '/js/otp.js',
    BASE_PATH + '/js/storage.js',
    BASE_PATH + '/manifest.json'
];

// Install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    // Never cache API calls
    if (event.request.url.includes('api.mail.tm')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then(cached => {
                    if (cached) return cached;

                    // Offline navigation fallback
                    if (event.request.mode === 'navigate') {
                        return caches.match(BASE_PATH + '/index.html');
                    }
                });
            })
    );
});
