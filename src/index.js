
require('./components/intersect-color-change.js');
require('./components/store-controls.js');
require('./systems/singleAsset.js');
require('./systems/assetLoader.js');
require('./components/login.js');
require('../public/router.js');
require("../public/css/login.css");
require("../public/css/splash.css");

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

