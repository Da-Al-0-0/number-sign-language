// sw.js

// 1. The phone installs the service worker
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
});

// 2. The phone activates it
self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');
});

// 3. THIS IS THE SECRET PASSCODE! 
// Mobile browsers require a 'fetch' listener to exist before they allow you to install the app.
self.addEventListener('fetch', (e) => {
    // We are leaving this blank for now, which is all the phone needs to see!
});
