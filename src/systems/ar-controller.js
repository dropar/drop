const JSON = require('circular-json');

AFRAME.registerComponent('ar-controller', { // register a component named store

  // This component will be attached to the scene element, so scene and its children
  // will be initialized before this component!!!
  init: function () {
    console.log("--- init arController")

    // get the xrController
    this.system = document.querySelector('a-scene').systems['xr-controller'];
    // access system as this.system
    this.system.registerAr(this);

    // this.pinDetected = this.system.pinDetected;
    // this.pinSelected = this.system.pinSelected;
    // this.meshContainer = this.system.meshContainer;
    this.state = this.system.state;

    /* --- DOM BINDINGS --- */

    // reticle binding using attribute selection b/c reticle is a component provided by
    // aframe-xr.js --> https://github.com/mozilla/aframe-xr/blob/master/src/components/reticle.js
    this.reticle = document.querySelector('[reticle]');

    // binding to meshContainer, aframe entity that groups all the 3d objects, which are
    // themselves aframe entities which wrap the three.js 3d objects. Since this wraps
    // all 3d objects, we can use it to set position of which ever 3d object is visible, and
    // of course toggle visibility of all, eg. when user clicks schematic thumbnail.
    this.meshContainer = document.querySelector('#meshContainer');
    this.meshContainerOrigPosition = this.meshContainer.getAttribute('position');

    /* --- REGISTER EVENT HANDLERS --- */

    // listen for plane detection and touched events
    this.planeDetected = this.planeDetected.bind(this);
    this.touched = this.touched.bind(this);
    this.reticle.addEventListener('planeDetected', this.planeDetected);
    this.reticle.addEventListener('touched', this.touched);

    this.renderAr = this.renderAr.bind(this);
    this.renderMagicWindow = this.renderMagicWindow.bind(this);

    console.log('--- this ', JSON.stringify(this))
  },
  // handler for plane detection event
  planeDetected: function () {
    console.log('----- plane detected', this.state.pinDetected, this.state.pinSelected);
    document.getElementById('status').innerHTML += '<div> --- plane detected </div>';
    if (this.state.pinSelected) { // object already pinned

      // jp: if we get plane detection but object already pinned, so...
      // show mesh and position at reticle and show AR UI.
      this.meshContainer.setAttribute('visible', true);
      this.meshContainer.setAttribute('position', this.reticle.getAttribute('position'));

      this.showARUI();

    } else {
      if (!this.state.pinDetected) { // pin NOT selected or detected

        this.state.pinDetected = true;

        // plane is detected so hide "move to find surface" instruction
        // and show "tap to place" instruction
        document.querySelector('#arui-step1').style.display = 'none';
        document.querySelector('#arui-step2').style.display = 'block';

      } else { // pin is detected by NOT selected
        // why add listener again here ??? its already been added in init.
        // b/c it might have been removed!
        this.reticle.addEventListener('touched', this.touched);
      }
    }
  },

  // handler for touched, ie. place after plane detected, event
  touched: function (evt) {
    console.log('----- touched', evt.detail.target);
    document.getElementById('status').innerHTML += '<div> --- touched </div>';

    if (evt.detail.target.type !== 'submit') {
      document.getElementById('status').innerHTML += '<div> --- --- place mesh </div>';
      //state.pinSelected = true;

      // remove the reticle, but save the parent. WHY ???
      this.reticleParent = this.reticle.parentNode;
      this.reticle.parentNode.removeChild(this.reticle);

      // show mesh and position at reticle and show AR UI.
      this.meshContainer.setAttribute('visible', true);
      this.meshContainer.setAttribute('position', this.reticle.getAttribute('position'));
      this.showARUI();
    }
    // why add listener again here ??? its already been added in init.
    this.reticle.removeEventListener('touched', this.touched);
    // this.state.pinDetected = false;
    // this.state.pinSelected = false;
  },

  showARUI: function () {
    document.getElementById('status').innerHTML += '<div> --- show AR UI </div>';

    document.getElementById('arui').style.display = 'none';
    document.getElementById('header').style.display = 'block';
    document.getElementById('productOptions').style.display = 'flex';
    // document.getElementById('buttonCart').style.display = 'block';
    document.getElementById('container').classList.add('ar');
  },
  renderAr: function () {
    // document.getElementById('status').innerText = 'mthfkr' + ' ' + this.state.pinSelected + ' ' + this.state.currentReality;
    document.getElementById('status').innerHTML += '<div> --- renderAr </div>';

    // remove title and add "ar" class to to everything that stays
    document.getElementById('header').classList.add('ar');
    // document.getElementById('title').style.display = 'none';
    document.getElementById('visualSheet').classList.add('ar');
    document.getElementById('content3D').classList.add('ar');
    document.getElementById('productOptions').classList.add('ar');
    var productOptionArr = document.getElementsByClassName('productOption');
    for (var i = 0; i < productOptionArr.length; i++) {
      productOptionArr[i].classList.add('ar');
    }

    // remove more stuff. this should probably be wrapped
    // document.getElementById('brand').style.display = 'none';
    // document.getElementById('productName').style.display = 'none';
    // document.getElementById('price').style.display = 'none';
    // document.getElementById('comments').style.display = 'none';
    // document.getElementById('thumbs').classList.add('ar');
    // document.getElementById('buttonCart').classList.add('ar');
    // document.getElementById('footer').style.display = 'none';


      if (!this.state.pinSelected) { // object not yet placed.
        document.getElementById('status').innerHTML += '<div> --- --- obj not yet pinned (typ) </div>';

        document.getElementById('arui').style.display = 'block';
        document.getElementById('header').style.display = 'none';
        document.getElementById('productOptions').style.display = 'none';
        // document.getElementById('buttonCart').style.display = 'none';

        // hide mesh for now, will show it again after item is placed
        // this happens inside touched event handler.
        this.meshContainer.setAttribute('visible', false);

      } else { // object already placed.
        document.getElementById('status').innerHTML += '<div> --- --- obj already pinned </div>';

        // product option control panel only shows after object placed.
        document.getElementById('productOptions').style.display = 'flex';

        // just used to change background on container after item placed.
        document.getElementById('container').classList.add('ar');
      }

    if(this.state.pinDetected){ // ???
      document.getElementById('status').innerHTML += '<div> --- --- plane already detected </div>';
      this.planeDetected();
    }
  },
  renderMagicWindow: function() {
    document.getElementById('status').innerHTML += '<div> --- renderMagicWindow </div>';

    // show all the stuff on detail page thats gets hidden during ar
    // and remote all the ar class on everything else
    document.getElementById('header').classList.remove('ar');
    // document.getElementById('title').style.display = 'block';
    document.getElementById('visualSheet').classList.remove('ar');
    document.getElementById('content3D').classList.remove('ar');
    document.getElementById('productOptions').classList.remove('ar');
    var productOptionArr = document.getElementsByClassName('productOption');
    for (var i = 0; i < productOptionArr.length; i++) {
      productOptionArr[i].classList.remove('ar');
    }

    // document.getElementById('brand').style.display = 'block';
    // document.getElementById('productName').style.display = 'block';
    // document.getElementById('price').style.display = 'block';
    // document.getElementById('comments').style.display = 'block';
    // document.getElementById('thumbs').classList.remove('ar');
    // document.getElementById('buttonCart').classList.remove('ar');
    document.getElementById('container').classList.remove('ar');
    // document.getElementById('footer').style.display = 'block';
    document.getElementById('header').style.display = 'block';
    document.getElementById('productOptions').style.display = 'block';
    // document.getElementById('buttonCart').style.display = 'block';

    document.getElementById('arui').style.display = 'none';

    // document.getElementById('this').innerHTML += `<div> --- ${this} </div>`;

    // put mesh back to default magic window position
    // show it incase it is hidden, ie in ar but not yet placed!

    this.meshContainer.setAttribute('visible', true);
    this.meshContainer.setAttribute('position', this.meshContainerOrigPosition);

    // this.meshContainer.setAttribute('visible', true);
    // this.meshContainer.setAttribute('position', this.meshContainerOrigPosition);

    document.getElementById('status').innerHTML += `<div> renderMagicWindow this: ${JSON.stringify(this)} </div>`;
    // save reticle and hide <---------------- ???
    if (this.reticleParent) {
      this.reticleParent.appendChild(this.reticle);
    }
    this.reticle.setAttribute('visible', false);


    // hide VR store panel
    // this.storePanelVR.setAttribute('visible', false);
  }

});
