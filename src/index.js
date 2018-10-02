
require('./components/intersect-color-change.js');
require('./components/store-controls.js');
// require('./components/test-component-2');
require('./systems/store.js');
require('./systems/myLoader.js');
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

// const testPage = html`
//   <div>test Page</div>
// `;
// const testPage2 = html`
//   <div>test Page 2</div>
// `;

// const routes = {
//   '/test': testPage,
//   '/test2': testPage2,
// };


// const contentDiv = document.getElementById('testContent');

// window.onpopstate = () => {
//   contentDiv.innerHTML = routes[window.location.pathname];
// }

// const onNavItemClick = (pathName) => {
//   window.history.pushState({}, pathName, window.location.origin + pathName);
//   contentDiv.innerHTML = routes[pathName];
// }

// contentDiv.innerHTML = routes[window.location.pathname];


