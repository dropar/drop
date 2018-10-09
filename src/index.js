
require('./systems/xr.js');
require('./components/ar-mode-ui.js');
require('./components/xr.js');
require('./components/anchor.js');
require('./components/reticle.js');

require('./components/intersect-color-change.js');
require('./components/store-controls.js');
// require('./systems/singleAsset.js');
require('./systems/xr-controller.js');
require('./systems/ar-controller.js');
require('./systems/vr-controller.js');
require('./systems/assetLoader.js');
require('./components/login.js');
require('../public/router.js');
require("../public/css/login.css");
require("../public/css/splash.css");
require("../public/css/signup.css");
require("../public/css/allAssets.css");
require("../public/css/singleAsset.css");
require("../public/css/upload.css");

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


// const isIos = () => {
//   const userAgent = window.navigator.userAgent.toLowerCase();
//   return /iphone|ipad|ipod/.test( userAgent );
// }
// // Detects if device is in standalone mode
// const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// // Checks if should display install popup notification:
// if (isIos() && !isInStandaloneMode()) {
//   this.setState({ showInstallMessage: true });
// }
