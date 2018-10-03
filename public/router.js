// document.addEventListener("DOMContentLoaded", function(event) {
  // window.addEventListener('load', function() {

  // getElementById wrapper
const { submitLoginForm }= require('../src/components/login');
const assetQuery = require('../src/components/userAssets');
const { submitSignUpForm } = require('../src/components/signup');
const assetFetcher = require('../src/components/assetFetcher.js');

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
  const router = new Navigo(null, true, '#!');
  // const router = new Navigo();
  console.log(router);
  router.on({
    // 'view' is the id of the div element inside which we render the HTML
    'firstroute': () => { loadHTML('./templates/first.html', 'view'); },
    'secondroute': () => { loadHTML('./templates/second.html', 'view'); },
    'thirdroute': () => { loadHTML('./templates/third.html', 'view'); },
    'assets/:id': (params) => {
      // assetFetcher.fetchcurrentAsset(params.id);
      // assetFetcher.fetchUserAssets(window.user.id);
      loadHTML('./templates/singleAsset.html', 'view');
    },
    'userAssets': () => {
      loadHTML('./templates/userAssets.html', 'view').then(() => {
        assetQuery.getUserAssets();
      })
    },
    'login': () => {
      loadHTML('./templates/login.html', 'view')
      .then(() => {
        submitLoginForm();
      });
    },
    'signup': () => {
      loadHTML('./templates/signup.html', 'view')
      .then(() => {
        submitSignUpForm();
      })
    }
  });

  // set the default route
  router.on(() => { loadHTML('./templates/first.html', 'view'); });

  // set the 404 route
  router.notFound((query) => { $id('view').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>'; });

  router.resolve();
// });

module.exports = {
  router
}


