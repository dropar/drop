const CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/css/main.css',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon.ico',
  '/assets/images/color0.png',
  '/assets/images/color1.png',
  '/assets/images/color2.png',
  '/assets/images/device-icon.png',
  '/assets/images/floor.jpg',
  '/assets/images/Icon[48]48.png',
  '/assets/images/Icon[size]20.png',
  '/assets/images/Icon[size]29.png',
  '/assets/images/Icon[size]40.png',
  '/assets/images/Icon[size]58.png',
  '/assets/images/Icon[size]60.png',
  '/assets/images/Icon[size]76.png',
  '/assets/images/Icon[size]80.png',
  '/assets/images/Icon[size]87.png',
  '/assets/images/Icon[size]120.png',
  '/assets/images/Icon[size]152.png',
  '/assets/images/Icon[size]167.png',
  '/assets/images/Icon[size]180.png',
  '/assets/images/Icon[size]512.png',
  '/assets/images/Icon[size]1024.png',
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
    .catch(err => console.log(err))
  )
});

self.addEventListener('fetch', function(event) {
  console.log('sending fetch', location.href);
  fetch(event.request)
  .then(response => {
    if (response.status !== 200) {
      if (!location.href.startsWith('http://localhost:8080')) {
        event.respondWith(
          caches.match(event.request)
          .then(function(response) {
            if (response) {
              return response;
            }
            return fetch(event.request);
          })
          .catch(err => console.log(err))
        )
      }
    }
  })
})

