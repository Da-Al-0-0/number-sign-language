const CACHE_NAME = 'sign-ai-cache-v1';

// 1. The exact files we want to download immediately
const urlsToCache = [
  '/number-sign-language/',
  '/number-sign-language/index.html',
  '/number-sign-language/manifest.json',
  '/number-sign-language/icon.png',
  '/number-sign-language/model.json',
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs',
  'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
];

// 2. INSTALL EVENT: Tell the phone to download the core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Pre-caching core files');
        return cache.addAll(urlsToCache);
      })
  );
});

// 3. ACTIVATE EVENT: Clean up any old, broken caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 4. FETCH EVENT: The Offline Brain
// When the app asks for a file, check the cache first. If it's not there, grab it from the internet and save it for next time.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache Hit: Return the saved offline file!
        if (response) {
          return response;
        }

        // Cache Miss: Fetch from the internet
        return fetch(event.request).then(
          (networkResponse) => {
            // Make sure it's a valid file before we save it
            if(!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Clone the response and save it to the cache for the future
            let responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Ignore weird Chrome extension requests
                if (event.request.url.startsWith('http')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return networkResponse;
          }
        ).catch(() => {
          // If the internet is down and we don't have the file cached, fail gracefully
          console.log('SW: You are completely offline and this file is missing.');
        });
      })
  );
});


