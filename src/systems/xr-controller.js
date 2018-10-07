AFRAME.registerSystem('xr-controller', { // register a component named store
  state: {
    pinDetected: false,
    pinSelected: false,
    currentReality: 'magicWindow',
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


    /* --- REGISTER EVENT HANDLERS --- */

    // add click handlers to DOM elements
    this.addEvents();

    // listen for change in reality from aframe-xr. note:
    // threejs scene is accessible on a-frame elements as "sceneEl"
    // a-frame element is accessible on the a-frame component as "el"
    // so we access scene from inside any component with "this.el.sceneEl"
    // this.el.sceneEl.setAttribute('vr-mode-ui', {enabled: false});
    this.el.sceneEl.addEventListener('realityChanged', this.realityChanged.bind(this));

  },

  // handle change in reality btw "Magic Window", AR, and VR
  realityChanged: function (data) {
    console.log('--- reality changed', data)
    console.log('--- pinSelected', this.state.pinSelected);
    document.getElementById('status').innerText = this.state.currentReality;

    if (data.detail !== this.state.currentReality) {
      this.state.currentReality = data.detail;
      this.changeReality();
    }
  },
  changeReality: function () {
    // var productOptionArr = document.getElementsByClassName('productOption');

    document.getElementById('status').innerText = this.state.pinSelected + ' ' + this.state.currentReality;
    console.log('--- currentReality', this.state.currentReality);
    console.log('--- pinSelected2', this.state.pinSelected);

    // currentReality is actually the new reality we are switching to
    // b/c we set on realityChanged event above before calling changeReality.
    switch (this.state.currentReality) {

      case 'ar':
        document.getElementById('status').innerText = 'change to AR';
        this.renderAr();
        // update state

        break;

      case 'magicWindow':
        document.getElementById('status').innerText = 'change to Magic Window';
        this.renderMagicWindow();
        this.disableVR();
        // update state
        this.state.pinSelected = false;

        break;

      case 'vr':
        document.getElementById('status').innerText = 'change to VR';
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
      document.getElementById('cart').innerHTML = '(0) Cart';
      document.getElementById('cart').style.color = '#181818';
      document.getElementById('cart').style.fontWeight = 'normal';
      // document.getElementById('buttonCart').innerHTML = 'Add to cart';
      // document.getElementById('buttonCart').style.backgroundColor = '#181818';
      document.querySelector('#addBtn-vr-bg').setAttribute('initialColor', '#181818');
      document.querySelector('#addBtn-vr-text').setAttribute('text', {value: 'Add to cart'});
      document.querySelector('#cart-vr').setAttribute('text', {value: '(0) Cart'});
    } else {
      document.getElementById('cart').innerHTML = '(1) Cart';
      document.getElementById('cart').style.color = '#b7374c';
      document.getElementById('cart').style.fontWeight = 'bolder';
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
