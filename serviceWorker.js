const CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/css/main.css',
  '/manifest.json',
  '/public/build.js',
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
  '/assets/images/color0.png',
  '/assets/images/color1.png',
  '/assets/images/color2.png',
  '/assets/images/device-icon.png',
  '/assets/images/floor.jpg',
  '/assets/images/Icon150.png',
  '/assets/images/Icon152.png',
  '/assets/images/Icon167.png',
  '/assets/images/Icon180.png',
  '/assets/images/product-0-0-0.png',
  '/assets/images/product-0-0-1.png',
  '/assets/images/product-0-1-0.png',
  '/assets/images/product-0-2-0.png',
  '/assets/images/product-1-0-0.png',
  '/assets/images/product-1-0-1.png',
  '/assets/images/product-1-1-0.png',
  '/assets/images/product-1-2-0.png',
  '/assets/images/product-2-0-0.png',
  '/assets/images/product-2-0-1.png',
  '/assets/images/product-2-1-0.png',
  '/assets/images/product-2-2-0.png',
  '/assets/images/shape0.png',
  '/assets/images/shape1.png',
  '/assets/images/shape2.png',
  '/assets/images/sky.jpg',
  '/assets/images/thumbs-0-0-0.png',
  '/assets/images/thumbs-0-0-1.png',
  '/assets/images/thumbs-0-0-2.png',
  '/assets/images/thumbs-0-1-0.png',
  '/assets/images/thumbs-0-1-2.png',
  '/assets/images/thumbs-0-2-0.png',
  '/assets/images/thumbs-0-2-2.png',
  '/assets/images/thumbs-1-0-0.png',
  '/assets/images/thumbs-1-0-1.png',
  '/assets/images/thumbs-1-0-2.png',
  '/assets/images/thumbs-1-1-0.png',
  '/assets/images/thumbs-1-1-2.png',
  '/assets/images/thumbs-1-2-0.png',
  '/assets/images/thumbs-1-2-2.png',
  '/assets/images/thumbs-2-0-0.png',
  '/assets/images/thumbs-2-0-1.png',
  '/assets/images/thumbs-2-0-2.png',
  '/assets/images/thumbs-2-1-0.png',
  '/assets/images/thumbs-2-1-2.png',
  '/assets/images/thumbs-2-2-0.png',
  '/assets/images/thumbs-2-2-2.png',
  '/assets/models/fs.mtl',
  '/assets/models/fs.obj',
  '/assets/models/fullstack_logo.obj',
  '/assets/models/Granite.png',
  '/assets/models/teleportHitEntity.obj',
  '/assets/models/Tile_bump.png',
  '/assets/models/Tile.png'
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

