
require('./components/intersect-color-change.js');
require('./components/store-controls.js');
require('./components/test-component-2');
require('./systems/singleAsset.js');
require('./systems/assetLoader.js');
require('./components/login.js');
require('../public/router.js');
// require('./router.js');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('../serviceWorker.js')
    .then(function(registration) {
      console.log("ServiceWorker registration successful with scope: ", registration.scope);
    })
    .catch(function(err) {
      console.log('ServiceWorker registration failed: ', err);
    })
  })
}

