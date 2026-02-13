// A simple service worker to pass the PWA install criteria
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installed');
});

self.addEventListener('fetch', (e) => {
    // For now, we just let the app fetch data normally
    e.respondWith(fetch(e.request));
});