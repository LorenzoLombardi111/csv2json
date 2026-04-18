const CACHE_NAME = 'freecsv2json-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/favicon.svg',
    '/favicon.png',
    '/og-image.svg',
    '/manifest.json',
    '/pages/vs-convertcsv',
    '/pages/vs-csvjsonio',
    '/pages/csv-to-json-for-developers',
    '/pages/json-to-csv-for-excel',
    '/pages/how-to-convert-csv-to-json',
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        caches.open(CACHE_NAME).then(cache =>
            cache.match(e.request).then(cached => {
                const networkFetch = fetch(e.request).then(response => {
                    if (response.ok) cache.put(e.request, response.clone());
                    return response;
                }).catch(() => cached);
                return cached || networkFetch;
            })
        )
    );
});

self.addEventListener('message', (e) => {
    if (e.data === 'skipWaiting') self.skipWaiting();
});
