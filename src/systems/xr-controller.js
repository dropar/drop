// require('rangeslider.js')



AFRAME.registerSystem('xr-controller', { // register a component named store
  state: {
    firstPinSelected: false,
    pinDetected: false,
    pinSelected: false,
    currentReality: 'magicWindow',
    reticle: undefined,
    reticleParent: undefined,
    meshContainer: undefined,
    currentMesh: undefined,
    meshContainerOrigPosition: undefined,
    meshContainerCurPosition: undefined,
    storePanelVR: undefined,
  },
  init: function () {
    console.log("--- init xrController")

    /* --- init STATE  --- */

    // 1. pin is "detected" when plane is detected.
    this.state.pinDetected = false;
    // 2. pin is "selected" when item is placed.
    this.state.pinSelected = false;
    // default to magic Window
    this.state.currentReality = 'magicWindow';

    /* --- DOM BINDINGS --- */

    // reticle binding using attribute selection b/c reticle is a component provided by
    // aframe-xr.js --> https://github.com/mozilla/aframe-xr/blob/master/src/components/reticle.js
    this.state.reticle = document.querySelector('[reticle]');

    // binding to meshContainer, aframe entity that groups all the 3d objects, which are
    // themselves aframe entities which wrap the three.js 3d objects. Since this wraps
    // all 3d objects, we can use it to set position of which ever 3d object is visible, and
    // of course toggle visibility of all, eg. when user clicks schematic thumbnail.
    this.state.meshContainer = document.querySelector('#meshContainer');
    this.state.meshContainerOrigPosition = this.state.meshContainer.getAttribute('position');


    /* --- INIT GEO LOAD --- */

    var self = this;
    this.sceneEl.addEventListener('loaded', function () { // inits for after scene loaded
      //
      // create magic window obj.
      var currentAsset = JSON.parse(localStorage.getItem('currentAsset'));
      document.getElementById('status').innerHTML += `<div> --- currentAsset: ${currentAsset.id} </div>`;

      // append geo to container
      // let geo = this.addGltfEntity({
      //   id: `currentAsset`,
      //   assetId: `#${currentAsset.id}`,
      //   visible: true,
      //   position: {x:0, y:0, z:0},
      //   scale: {x:1, y:1, z:1}
      // })
      document.getElementById('status').innerHTML += '<div> --- addGltfEntity </div>';

      //var container = document.querySelector('#meshContainer');
      var geo = document.createElement('a-entity');

      geo.setAttribute('id', `currentAsset`);
      geo.setAttribute('gltf-model', `#${currentAsset.id}`);
      geo.setAttribute('visible', true);
      geo.setAttribute('position', {x:0, y:0, z:0});
      geo.setAttribute('scale', {x:1, y:1, z:1});

      document.getElementById('status').innerHTML += '<div> --- --- append geo </div>';
      self.state.meshContainer.appendChild(geo);
      document.getElementById('status').innerHTML += '<div> --- --- set to cur </div>';
      self.state.currentMesh = geo;
      document.getElementById('status').innerHTML += `<div> --- --- cur id: ${self.state.currentMesh.id} </div>`;


    });

    /* --- REGISTER EVENT HANDLERS --- */

    // add click handlers to DOM elements
    this.addEvents();

    // listen for change in reality from aframe-xr. note:
    // threejs scene is accessible on a-frame elements as "sceneEl"
    // a-frame element is accessible on the a-frame component as "el"
    // so we access scene from inside any component with "this.el.sceneEl"
    // this.el.sceneEl.setAttribute('vr-mode-ui', {enabled: false});
    this.el.sceneEl.addEventListener('realityChanged', this.realityChanged.bind(this));

    // reset scene on back
    document.querySelector('.back-button a').addEventListener('click', this.clearScene.bind(this));
  },

  clearScene: function() {
    document.getElementById('status').innerHTML = '<div> --- clear scene </div>';
    while (this.state.meshContainer.firstChild) {
      document.getElementById('status').innerHTML += `<div> --- --- remove: ${meshContainer.firstChild.id} √ </div>`;
      meshContainer.removeChild(meshContainer.firstChild);
    }
    this.sceneEl.exitAR();
    this.sceneEl.exitVR();
    document.getElementById('status').innerHTML += '<div> --- --- done clearing scene √ </div>';
  },

  // handle change in reality btw "Magic Window", AR, and VR
  realityChanged: function (data) {
    console.log('--- reality changed', data)
    document.getElementById('status').innerHTML = '<div> Reality Change </div>';

    if (data.detail !== this.state.currentReality) {
      this.state.currentReality = data.detail;
      this.changeReality();
    } else {
      document.getElementById('status').innerHTML += '<div> --- init magic window </div>';
      // let geo = document.getElementById('currentAsset')
      // this.state.currentMesh = geo;
      // geo.setAttribute('visible', true)

      // load geometry into scene for magic window
      // this.initMagicWindow();
    }

  },
  changeReality: function () {
    // var productOptionArr = document.getElementsByClassName('productOption');

    // currentReality is actually the new reality we are switching to
    // b/c we set on realityChanged event above before calling changeReality.
    switch (this.state.currentReality) {

      case 'ar':
        document.getElementById('status').innerHTML += '<div> --- change to ar </div>';
        this.cleanupMagicWindow();
        this.renderAr();
        // update state

        break;

      case 'magicWindow':

        // reset
        // this.state.pinDetected = false;
        // this.state.pinSelected = false;

        document.getElementById('status').innerHTML += '<div> --- change to magic window </div>';
        // stop listening for touches
        this.state.reticle.removeEventListener('touched', this.touched);
        this.renderMagicWindow();
        this.disableVR();
        // update state
        // this.state.pinSelected = false;

        // console.log("--- final state: ", this.state)
        // document.getElementById('status').innerHTML += `<div> --- pinSelected: ${this.state.pinSelected} </div>`;
        // document.getElementById('status').innerHTML += `<div> --- pinDetected: ${this.state.pinDetected} </div>`;

        break;

      case 'vr':
        document.getElementById('status').innerHTML += '<div> --- change to vr </div>';
        this.enableVR();

        break;
    }
  },

  // function to add click handlers to DOM elements
  addEvents: function () {
    this.isAdded = false;

    this.buttonCartClicked = this.buttonCartClicked.bind(this);
    // document.getElementById('buttonCart').addEventListener('click', this.buttonCartClicked);
  },

  buttonCartClicked: function () {
    if (this.isAdded) {
      // document.getElementById('cart').innerHTML = '(0) Cart';
      // document.getElementById('cart').style.color = '#181818';
      // document.getElementById('cart').style.fontWeight = 'normal';
      // document.getElementById('buttonCart').innerHTML = 'Add to cart';
      // document.getElementById('buttonCart').style.backgroundColor = '#181818';
      document.querySelector('#addBtn-vr-bg').setAttribute('initialColor', '#181818');
      document.querySelector('#addBtn-vr-text').setAttribute('text', {value: 'Add to cart'});
      document.querySelector('#cart-vr').setAttribute('text', {value: '(0) Cart'});
    } else {
      // document.getElementById('cart').innerHTML = '(1) Cart';
      // document.getElementById('cart').style.color = '#b7374c';
      // document.getElementById('cart').style.fontWeight = 'bolder';
      // document.getElementById('buttonCart').innerHTML = 'Added!';
      // document.getElementById('buttonCart').style.backgroundColor = '#b7374c';
      document.querySelector('#addBtn-vr-bg').setAttribute('initialColor', '#b7374c');
      document.querySelector('#addBtn-vr-text').setAttribute('text', {value: 'Added!'});
      document.querySelector('#cart-vr').setAttribute('text', {value: '(1) Cart'});
    }
    this.isAdded = !this.isAdded;
  },
  registerAr: function (el) {
    console.log('--- ar-controller registered!')
    // this.planeDetected = el.planeDetected;
    // this.touched = el.touched;
    console.log('el', el)
    this.renderAr = el.renderAr;
    console.log('this.renderAr', this.renderAr)
    this.renderMagicWindow = el.renderMagicWindow;
    // this.initMagicWindow = el.initMagicWindow;
    this.cleanupMagicWindow = el.cleanupMagicWindow;
  },
  registerVr: function (el) {
    console.log('--- vr-controller registered!')
    this.enableVR = el.enableVR;
    this.disableVR = el.disableVR;
  },

  // unregisterMe: function (el) {
  //   var index = this.entities.indexOf(el);
  //   this.entities.splice(index, 1);
  // }

});
