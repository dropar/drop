// document.addEventListener("DOMContentLoaded", function(event) {
  // window.addEventListener('load', function() {

  // getElementById wrapper
const { getUserAssets, getAllAssets, buttonListeners } = require('../src/components/allAssets')
const { submitLoginForm }= require('../src/components/login');
const { submitSignUpForm } = require('../src/components/signup');
const assetFetcher = require('../src/components/assetFetcher.js');
const { uploadForm } = require('../src/components/upload');
const { runSplash } = require('../src/components/splash');

  function $id(id) {
    return document.getElementById(id);
  }

  // asyncrhonously fetch the html template partial from the file directory,
  // then set its contents to the html of the parent element
  function loadHTML(url, id) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = () => {
        $id(id).innerHTML = req.responseText;
        if (req.status >= 200 || req.status < 300) {
          resolve(req.response)
        }
        else {
          reject({
            status: req.status,
            statusText: req.statusText
          })
        }
      };
      req.send();
    })
  }

  // use #! to hash
  //change back
  const router = new Navigo(null, true, '#!');
  // const router = new Navigo();
  console.log('ROUTER-',router);
  router.on({
    // 'view' is the id of the div element inside which we render the HTML
    'home': () => {
      loadHTML('./templates/splash.html', 'view')
      .then(() => {
        console.log('home');
      })
    },
    'assets': () => {
      loadHTML('./templates/allAssets.html','view')
       .then(() => {
        getUserAssets();
        getAllAssets();
        buttonListeners();
      })
      },
    // 'assets/:category': (params) => {
    //   loadHTML('./templates/allAssets.html','view')
    //   .then(() => {
    //     allAssets.getAllAssetsCategory(params.category)
    //   })
    // },
    'firstroute': () => { loadHTML('./templates/first.html', 'view'); },
    'secondroute': () => { loadHTML('./templates/second.html', 'view'); },
    'thirdroute': () => { loadHTML('./templates/third.html', 'view'); },
    // 'userAssets': () => {
    //   loadHTML('./templates/userAssets.html', 'view').then(() => {
    //     userAssets.getUserAssets();
    //   })
    // },
    'login': () => {
      loadHTML('./templates/login.html', 'view')
      .then(() => {
        submitLoginForm();
      });
    },
    'assets/:id': (params) => {
      assetFetcher.fetchCurrentAsset(params.id)
      .then(() => {
        // assetFetcher.fetchUserAssets(window.user.id);
        loadHTML('./templates/singleAsset.html', 'view');
      })
    },
    'signup': () => {
      loadHTML('./templates/signup.html', 'view')
      .then(() => {
        submitSignUpForm();
      })
    },
    'upload': () => {
      loadHTML('./templates/upload.html', 'view')
      .then(() => {
        uploadForm();
        console.log('upload function run');
      })
    }
  });

  // set the default route
  router.on(() => {
    loadHTML('./templates/splash.html', 'view')
    .then(() => {
      runSplash();
    })
  });

  // set the 404 route
  router.notFound((query) => { $id('view').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>'; });

  router.resolve();
// });

module.exports = {
  router
}


