const CACHE_NAME = "smartkharch-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./lang.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(error => {
        console.log('Failed to cache some assets:', error);
        // Cache what we can
        return Promise.allSettled(ASSETS.map(url => cache.add(url)));
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(fetchRes => {
        // Cache new requests
        if (e.request.url.includes('chart.js') || e.request.url.includes('fonts.googleapis.com')) {
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, fetchRes.clone()));
        }
        return fetchRes;
      }).catch(() => {
        // Fallback for HTML requests
        if (e.request.destination === 'document') {
          return caches.match('./index.html');
        }
        // For other requests, return a simple offline response
        if (e.request.destination === 'script' && e.request.url.includes('chart.js')) {
          return new Response('// Chart.js unavailable offline', { status: 503 });
        }
      });
    })
  );
});
