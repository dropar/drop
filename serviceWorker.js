const CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/css/main.css',
  '/fav-16.png',
  '/fav-32.png',
  '/assets/apple-startup-images/splash-640x1136.png',
  '/assets/apple-startup-images/splash-750x1334.png',
  '/assets/apple-startup-images/splash-828x1792.png',
  '/assets/apple-startup-images/splash-1125x2436.png',
  '/assets/apple-startup-images/splash-1242x2208.png',
  '/assets/apple-startup-images/splash-1242x2208.png',
  '/assets/apple-startup-images/splash-1536x2048.png',
  '/assets/apple-startup-images/splash-1668x2224.png',
  '/assets/apple-startup-images/splash-2048x2732.png',
  '/assets/images/device-icon.png',
  '/assets/images/Icon150.png',
  '/assets/images/Icon152.png',
  '/assets/images/Icon167.png',
  '/assets/images/Icon180.png',
  '/assets/images/sky.jpg',
];

self.addEventListener('install', function(event) {
  console.log('event', event);
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
    .then(self.skipWaiting())
    .catch(err => console.log(err))
  )
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  )
})

