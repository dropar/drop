AFRAME.registerSystem('store', { // register a component named store
  init: function () {
    console.log("--- init FRAME.registerSystem('store', {...}")

    // mapping for mapping inputs to application-specific actions.
    // read about input mappings -> https://blog.mozvr.com/input-mapping/
    var mappings = {
      behaviours: {},
      mappings: {
        store: {
          common: {
            'grip.down': 'undo',
            'trigger.changed': 'select'
          },

          'vive-controls': {
            'axis.move': 'scale',
            'trackpad.touchstart': 'startScale',
            'menu.down': 'toggleMenu'
          },

          'daydream-controls': {
            'trackpad.changed': 'scale',
            'trackpad.down': 'startScale',
            'menu.down': 'toggleMenu'
          },

          'oculus-touch-controls': {
            'axis.move': 'scale',
            'abutton.down': 'toggleMenu',
            'xbutton.down': 'toggleMenu'
          },

          'windows-motion-controls': {
            'axis.move': 'scale',
            'menu.down': 'toggleMenu'
          },
        }
      }
    };

    /* --- STATE for surface detection and item placement --- */

    // 1. pin is "detected" when plane is detected.
    this.pinDetected = false;
    // 2. pin is "selected" when item is placed.
    this.pinSelected = false;

    /* --- CONSTANTS -- */

    // color constants
    this.colorArr = [0x66ca9c, 0xfa5784, 0x4db5d1];

    // default to magic Window
    this.currentReality = 'magicWindow';

    /* --- DOM BINDINGS --- */

    // binding to meshContainer, aframe entity that groups all the 3d objects, which are
    // themselves aframe entities which wrap the three.js 3d objects. Since this wraps
    // all 3d objects, we can use it to set position of which ever 3d object is visible, and
    // of course toggle visibility of all, eg. when user clicks schematic thumbnail.
    this.meshContainer = document.querySelector('#meshContainer');
    this.meshContainerOrigPosition = this.meshContainer.getAttribute('position');

    // reticle binding using attribute selection b/c reticle is a component provided by
    // aframe-xr.js --> https://github.com/mozilla/aframe-xr/blob/master/src/components/reticle.js
    this.reticle = document.querySelector('[reticle]');

    /* --- REGISTER EVENT HANDLERS --- */

    // listen for plane detection and touched events
    this.planeDetected = this.planeDetected.bind(this);
    this.touched = this.touched.bind(this);
    this.reticle.addEventListener('planeDetected', this.planeDetected);
    this.reticle.addEventListener('touched', this.touched);

    // listen for change in reality from aframe-xr. note:
    // threejs scene is accessible on a-frame elements as "sceneEl"
    // a-frame element is accessible on the a-frame component as "el"
    // so we access scene from inside any component with "this.el.sceneEl"
    // this.el.sceneEl.setAttribute('vr-mode-ui', {enabled: false});
    this.el.sceneEl.addEventListener('realityChanged', this.realityChanged.bind(this));

    // listen for XR initialized event from aframe-xr.
    this.el.sceneEl.addEventListener('xrInitialized', this.xrInitialized.bind(this));

    // add click handlers to DOM elements
    this.addEvents();

    var self = this;
    this.sceneEl.addEventListener('loaded', function () { // inits for after scene loaded
      console.log('--- store loaded event')
      // jp: map inputs to application-specific actions.
      // read about input mappings -> https://blog.mozvr.com/input-mapping/
      AFRAME.registerInputMappings(mappings);
      AFRAME.currentInputMapping = 'store';

      // console.log(AFRAME.components['ar-mode-ui'].Component.prototype.init);
      // this.sceneEl.setAttribute('ar-mode-ui', {enabled: false});
      // this.sceneEl.setAttribute('vr-mode-ui', {enabled: false});

      // set all object shading to flat
      self.flatMaterials();

      // dynamicaly add store panel
      self.addStorePanel();
      //self.loadGeometry();

      self.hasVRDisplays = false;
      navigator.getVRDisplays().then(function (displays) {
        if (displays.length) {
          if (displays[0].displayName.indexOf('Cardboard') !== -1) {
            self.hideVRIcon();
          } else {
            self.hasVRDisplays = true;
            self.replaceVRIcon();
          }
        }
      });
    });


  },

  // handle change in reality btw "Magic Window", AR, and VR
  realityChanged: function (data) {
    console.log('--- reality changed', data)
    if (data.detail !== this.currentReality) {
      this.currentReality = data.detail;
      this.changeReality();
    }
  },
  changeReality: function () {
    var productOptionArr = document.getElementsByClassName('productOption');

    // currentReality is actually the new reality we are switching to
    // b/c we set on realityChanged event above before calling changeReality.
    switch (this.currentReality) {

      case 'ar':

        // remove title and add "ar" class to to everything that stays
        document.getElementById('header').classList.add('ar');
        document.getElementById('title').style.display = 'none';
        document.getElementById('visualSheet').classList.add('ar');
        document.getElementById('content3D').classList.add('ar');
        document.getElementById('productOptions').classList.add('ar');
        for (var i = 0; i < productOptionArr.length; i++) {
          productOptionArr[i].classList.add('ar');
        }

        // remove more stuff. this should probably be wrapped
        document.getElementById('brand').style.display = 'none';
        document.getElementById('productName').style.display = 'none';
        document.getElementById('price').style.display = 'none';
        document.getElementById('comments').style.display = 'none';
        // document.getElementById('thumbs').classList.add('ar');
        document.getElementById('buttonCart').classList.add('ar');
        document.getElementById('footer').style.display = 'none';

        if (!this.pinSelected) { // object not yet placed.
          document.getElementById('arui').style.display = 'block';
          document.getElementById('header').style.display = 'none';
          document.getElementById('productOptions').style.display = 'none';
          document.getElementById('buttonCart').style.display = 'none';

          // hide mesh for now, will show it again after item is placed
          // this happens inside touched event handler.
          this.meshContainer.setAttribute('visible', false);

        } else { // object already placed.

          // product option control panel only shows after object placed.
          document.getElementById('productOptions').style.display = 'flex';

          // just used to change background on container after item placed.
          document.getElementById('container').classList.add('ar');
        }

        if(this.pinDetected){ // ???
          this.planeDetected();
        }

        break;

      case 'magicWindow':

        // show all the stuff on detail page thats gets hidden during ar
        // and remote all the ar class on everything else
        document.getElementById('header').classList.remove('ar');
        document.getElementById('title').style.display = 'block';
        document.getElementById('visualSheet').classList.remove('ar');
        document.getElementById('content3D').classList.remove('ar');
        document.getElementById('productOptions').classList.remove('ar');
        for (var i = 0; i < productOptionArr.length; i++) {
          productOptionArr[i].classList.remove('ar');
        }

        document.getElementById('brand').style.display = 'block';
        document.getElementById('productName').style.display = 'block';
        document.getElementById('price').style.display = 'block';
        document.getElementById('comments').style.display = 'block';
        // document.getElementById('thumbs').classList.remove('ar');
        document.getElementById('buttonCart').classList.remove('ar');
        document.getElementById('container').classList.remove('ar');
        document.getElementById('footer').style.display = 'block';
        document.getElementById('header').style.display = 'block';
        document.getElementById('productOptions').style.display = 'block';
        document.getElementById('buttonCart').style.display = 'block';

        document.getElementById('arui').style.display = 'none';

        // put mesh back to default magic window position
        // show it incase it is hidden, ie in ar but not yet placed!
        this.meshContainer.setAttribute('visible', true);
        this.meshContainer.setAttribute('position', this.meshContainerOrigPosition);

        // item not yet placed
        this.pinSelected = false;

        // save reticle and hide <---------------- ???
        if (this.reticleParent) {
          this.reticleParent.appendChild(this.reticle);
        }
        this.reticle.setAttribute('visible', false);

        // hide VR store panel
        this.storePanelVR.setAttribute('visible', false);

        break;

      case 'vr':

        // show vr panel
        this.storePanelVR.setAttribute('visible', true);

        // why not visibiliy settings here ???

        break;
    }
  },

  // function to add click handlers to DOM elements
  addEvents: function () {
    this.isAdded = false;

    this.buttonCartClicked = this.buttonCartClicked.bind(this);
    document.getElementById('buttonCart').addEventListener('click', this.buttonCartClicked);
  },

  // thumb0Clicked: function (evt) {
  //   console.log('--- thumb0Clicked')

  //   // remove class from prev selection
  //   this.removeSelected();

  //   // add selected class to new selection
  //   document.getElementById('thumb0').classList.add('selected');

  //   // replace magic window with static image by
  //   // removing the a-frame scene element and
  //   // setting background of div container, ie "content3d" to image.
  //   // document.getElementsByTagName('a-scene') selects all a-frame elements
  //   // could do document.querySelector('a-scene') if only one i think.
  //   document.getElementsByTagName('a-scene')[0].style.display = 'none';
  //   document.getElementById('content3D').style.background = 'url(assets/images/product-' + this.shapeSelected + '-' + this.colorSelected + '-0.png) no-repeat center #ffffff';

  //   // update state
  //   this.thumbSelected = 0;
  // },
  // thumb1Clicked: function (evt) {
  //   this.removeSelected();
  //   document.getElementById('thumb1').classList.add('selected');
  //   document.getElementsByTagName('a-scene')[0].style.display = 'none';
  //   document.getElementById('content3D').style.background = 'url(assets/images/product-' + this.shapeSelected + '-0-1.png) no-repeat center #ffffff';
  //   this.thumbSelected = 1;
  // },
  // thumb2Clicked: function (evt) {
  //   this.removeSelected();
  //   document.getElementById('content3D').style.background = 'none';
  //   document.getElementsByTagName('a-scene')[0].style.display = 'block';
  //   document.getElementById('thumb2').classList.add('selected');
  //   this.thumbSelected = 2;
  // },

  // remove "selected" class from cur selected thumb, (so can select smth else)
  // removeSelected: function () {
  //   document.getElementById('thumb' + this.thumbSelected).classList.remove('selected');
  // },

  // shape0Clicked: function (evt) {

  //   // update visibilties for ar and magic window
  //   this.changeShape(0);

  //   // update 3d plane controller for vr
  //   document.querySelector('#shapeBar-vr').getAttribute('position').x = -0.75;
  // },
  // shape1Clicked: function (evt) {
  //   this.changeShape(1);
  //   document.querySelector('#shapeBar-vr').getAttribute('position').x = -0.5;
  // },
  // shape2Clicked: function (evt) {
  //   this.changeShape(2);
  //   document.querySelector('#shapeBar-vr').getAttribute('position').x = -0.25;
  // },
  changeShape: function (i) {

    // reset visibility to false for all objects
    document.querySelector('#geo0').setAttribute('visible', true);
    document.querySelector('#geo1').setAttribute('visible', false);
    document.querySelector('#geo2').setAttribute('visible', false);

    document.getElementById('shape' + this.shapeSelected).classList.remove('optionSelected');

    // make selected object visible
    this.shapeSelected = i;
    document.querySelector('#geo' + i).setAttribute('visible', true);

    // add optionSelected class to corresponding shape
    document.getElementById('shape' + i).classList.add('optionSelected');

    // update thumbnails to display selected shape
    // this.updateThumbs();
  },

  // color0Clicked: function (evt) {
  //   this.changeColor(0);
  //   document.querySelector('#colorBar-vr').getAttribute('position').x = 0.25;
  // },
  // color1Clicked: function (evt) {
  //   this.changeColor(1);
  //   document.querySelector('#colorBar-vr').getAttribute('position').x = 0.5;
  // },
  // color2Clicked: function (evt) {
  //   this.changeColor(2);
  //   document.querySelector('#colorBar-vr').getAttribute('position').x = 0.75;
  // },
  // changeColor: function (i) {
  //   document.getElementById('color' + this.colorSelected).classList.remove('optionSelected');
  //   document.querySelector('#geo0').setAttribute('material', 'color', this.colorArr[i]);
  //   document.querySelector('#geo1').setAttribute('material', 'color', this.colorArr[i]);
  //   document.querySelector('#geo2').setAttribute('material', 'color', this.colorArr[i]);
  //   document.getElementById('color' + i).classList.add('optionSelected');
  //   this.colorSelected = i;
  //   // this.updateThumbs();
  //   this.flatMaterials(); // why do this everytime color changes <-------------------???
  // },

  // update thumbnails to display selected shape and color
  // updateThumbs: function () {
  //   document.querySelector('#thumb0').querySelector('img').src = 'assets/images/thumbs-' + this.shapeSelected + '-' + this.colorSelected + '-0.png';
  //   document.querySelector('#thumb1').querySelector('img').src = 'assets/images/thumbs-' + this.shapeSelected + '-0-1.png';
  //   document.querySelector('#thumb2').querySelector('img').src = 'assets/images/thumbs-' + this.shapeSelected + '-' + this.colorSelected + '-2.png';
  //   if (this.thumbSelected === 0) {
  //     document.getElementById('content3D').style.background = 'url(assets/images/product-' + this.shapeSelected + '-' + this.colorSelected + '-0.png) no-repeat center #ffffff';
  //   } else if (this.thumbSelected === 1) {
  //     document.getElementById('content3D').style.background = 'url(assets/images/product-' + this.shapeSelected + '-0-1.png) no-repeat center #ffffff';
  //   }
  // },

  buttonCartClicked: function () {
    if (this.isAdded) {
      document.getElementById('cart').innerHTML = '(0) Cart';
      document.getElementById('cart').style.color = '#181818';
      document.getElementById('cart').style.fontWeight = 'normal';
      document.getElementById('buttonCart').innerHTML = 'Add to cart';
      document.getElementById('buttonCart').style.backgroundColor = '#181818';
      document.querySelector('#addBtn-vr-bg').setAttribute('initialColor', '#181818');
      document.querySelector('#addBtn-vr-text').setAttribute('text', {value: 'Add to cart'});
      document.querySelector('#cart-vr').setAttribute('text', {value: '(0) Cart'});
    } else {
      document.getElementById('cart').innerHTML = '(1) Cart';
      document.getElementById('cart').style.color = '#b7374c';
      document.getElementById('cart').style.fontWeight = 'bolder';
      document.getElementById('buttonCart').innerHTML = 'Added!';
      document.getElementById('buttonCart').style.backgroundColor = '#b7374c';
      document.querySelector('#addBtn-vr-bg').setAttribute('initialColor', '#b7374c');
      document.querySelector('#addBtn-vr-text').setAttribute('text', {value: 'Added!'});
      document.querySelector('#cart-vr').setAttribute('text', {value: '(1) Cart'});
    }
    this.isAdded = !this.isAdded;
  },




  /* --- VR STORE PANEL --- */

  // add vr store panel
  addStorePanel: function () {

    // create an a-frame enitity for vr store panel
    var containerUI = document.createElement('a-entity');
    containerUI.setAttribute('id', 'storePanel');
    containerUI.setAttribute('position', '1.5 1.7 -2.75');
    containerUI.setAttribute('rotation', '0 -30 0');
    containerUI.setAttribute('visible', false);

    // bind to storePanelVR and add to scene
    this.storePanelVR = containerUI;
    this.el.sceneEl.appendChild(containerUI);

    this.addPlane({
      id: 'main-vr',
      width: 2,
      height: 1.5,
      color: 'white',
      parent: containerUI
    });
    this.addText({
      text: 'Mozilla',
      id: 'brand-vr',
      font: 'OpenSans-Bold',
      size: 2,
      color: '#181818',
      position: '0.15 0.55 0',
      parent: containerUI
    });
    this.addText({
      text: 'Basic Mesh',
      id: 'product-vr',
      font: 'OpenSans-Regular',
      size: 3,
      color: '#181818',
      position: '0.65 0.35 0',
      parent: containerUI
    });
    this.addText({
      text: '(0) Cart',
      id: 'cart-vr',
      font: 'OpenSans-Regular',
      size: 1.8,
      color: '#181818',
      position: '1.5 0.4 0',
      parent: containerUI
    });
    this.addText({
      text: 'Shape',
      id: 'shape-vr',
      font: 'OpenSans-Regular',
      size: 1.8,
      color: '#181818',
      position: '0.06 0.2 0',
      parent: containerUI
    });
    // this.addImage({
    //   id: 'shape0-vr',
    //   src: 'shape0',
    //   size: 0.25,
    //   position: '-0.75 0 0.01',
    //   collidable: true,
    //   onclick: this.shape0Clicked,
    //   parent: containerUI
    // });
    // this.addImage({
    //   id: 'shape1-vr',
    //   src: 'shape1',
    //   size: 0.25,
    //   position: '-0.5 0 0.01',
    //   collidable: true,
    //   onclick: this.shape1Clicked,
    //   parent: containerUI
    // });
    // this.addImage({
    //   id: 'shape2-vr',
    //   src: 'shape2',
    //   size: 0.25,
    //   position: '-0.25 0 0.01',
    //   collidable: true,
    //   onclick: this.shape2Clicked,
    //   parent: containerUI
    // });
    this.addPlane({
      id: 'shapeBar-vr',
      width: 0.2,
      height: 0.01,
      position: '-0.75 -0.15 0.01',
      color: '#181818',
      parent: containerUI
    });

    this.addText({
      text: 'Color',
      id: 'color-vr',
      font: 'OpenSans-Regular',
      size: 1.8,
      color: '#181818',
      position: '1.06 0.2 0',
      parent: containerUI
    });
    // this.addImage({
    //   id: 'color0-vr',
    //   src: 'color0',
    //   size: 0.25,
    //   position: '0.25 0 0.01',
    //   collidable: true,
    //   onclick: this.color0Clicked,
    //   parent: containerUI
    // });
    // this.addImage({
    //   id: 'color1-vr',
    //   src: 'color1',
    //   size: 0.25,
    //   position: '0.5 0 0.01',
    //   collidable: true,
    //   onclick: this.color1Clicked,
    //   parent: containerUI
    // });
    // this.addImage({
    //   id: 'color2-vr',
    //   src: 'color2',
    //   size: 0.25,
    //   position: '0.75 0 0.01',
    //   collidable: true,
    //   onclick: this.color2Clicked,
    //   parent: containerUI
    // });
    this.addPlane({
      id: 'colorBar-vr',
      width: 0.2,
      height: 0.01,
      position: '0.25 -0.15 0.01',
      color: '#181818',
      parent: containerUI
    });

    this.addText({
      text: 'Price: $0.00 + Shipping & Import Fees',
      id: 'price-vr',
      font: 'OpenSans-Regular',
      size: 1.2,
      color: '#181818',
      position: '-0.25 -0.3 0',
      parent: containerUI
    });
    this.addButton({
      id: 'addBtn-vr',
      text: 'Add to cart',
      textColor: '#ffffff',
      width: 0.8,
      height: 0.2,
      color: '#181818',
      parent: containerUI,
      position: '-0.45 -0.5 0.01',
      onclick: this.buttonCartClicked
    });
  },
  addPlane: function (params) {
    var uiEl = document.createElement('a-entity');
    uiEl.setAttribute('geometry', {
      primitive: 'plane',
      width: params.width,
      height: params.height
    });
    uiEl.setAttribute('id', params.id);
    uiEl.setAttribute('position', params.position || '0 0 0');
    uiEl.setAttribute('material', {
      shader: 'flat',
      transparent: true,
      color: params.color,
      side: 'double'
    });
    if (params.collidable) {
      uiEl.setAttribute('class', 'collidable');
      uiEl.setAttribute('intersect-color-change', '');
    }
    params.parent.appendChild(uiEl);
  },
  addText: function (params) {
    var uiEl = document.createElement('a-entity');

    uiEl.setAttribute('text', {
      value: params.text,
      font: 'assets/fonts/' + params.font + '.json',
      align: params.align || 'left',
      shader: 'msdf',
      color: params.color
    });
    uiEl.setAttribute('id', params.id);
    uiEl.setAttribute('scale', {
      x: params.size,
      y: params.size,
      z: params.size
    });
    if (params.collidable) {
      uiEl.setAttribute('class', 'collidable');
      uiEl.setAttribute('intersect-color-change', '');
    }
    uiEl.setAttribute('position', params.position || '0 0 0');
    params.parent.appendChild(uiEl);
  },
  addImage: function (params) {
    var uiEl = document.createElement('a-entity');

    uiEl.setAttribute('id', params.id);
    uiEl.setAttribute('geometry', {
      primitive: 'plane',
      width: params.size,
      height: params.size
    });
    if (params.onclick) {
      uiEl.addEventListener('mousedown', function (evt) {
        params.onclick();
      });
    }
    uiEl.setAttribute('material', {
      shader: 'flat',
      transparent: true,
      src: 'assets/images/' + params.src + '.png'
    });
    if (params.collidable) {
      uiEl.setAttribute('class', 'collidable');
      uiEl.setAttribute('intersect-color-change', '');
    }
    uiEl.setAttribute('position', params.position || '0 0 0');
    params.parent.appendChild(uiEl);
  },
  addButton: function (params) {
    var uiEl = document.createElement('a-entity');
    uiEl.setAttribute('id', params.id);
    params.parent.appendChild(uiEl);
    uiEl.setAttribute('position', params.position || '0 0 0');
    if (params.onclick) {
      uiEl.addEventListener('mousedown', function (evt) {
        params.onclick();
      });
    }
    this.addPlane({
      id: params.id + '-bg',
      width: params.width,
      height: params.height,
      color: params.color,
      collidable: true,
      parent: uiEl
    });
    this.addText({
      text: params.text,
      id: params.id + '-text',
      font: 'OpenSans-Bold',
      align: 'center',
      position: '0 -0.05 0',
      size: 1.4,
      color: params.textColor,
      collidable: true,
      parent: uiEl
    });
  },

  // <a-assets>
  //   <a-asset-item id="fs-obj" src="assets/models/fs.obj" crossorigin="anonymous"></a-asset-item>
  //   <a-asset-item id="fs-mtl" src="assets/models/fs.mtl" crossorigin="anonymous"></a-asset-item>
  // </a-assets>
  // add3dAsset: function (params) {
  //   var assets = document.querySelector('a-assets');
  //   var obj = document.createElement('a-asset-item');
  //   var mtl = document.createElement('a-asset-item');
  //   obj.setAttribute('id', params.id + '-obj')
  //   obj.setAttribute('src', params.objSrc)
  //   obj.setAttribute('crossorigin', "anonymous")
  //   mtl.setAttribute('id', params.id + '-mtl')
  //   mtl.setAttribute('src', params.mtlSrc)
  //   mtl.setAttribute('crossorigin', "anonymous")
  //   assets.appendChild(obj);
  //   assets.appendChild(mtl);
  // },
  // <a-asset-item id="tree" src="/path/to/tree.gltf"></a-asset-item>
  addGltfAsset: function (params) {
    var assets = document.querySelector('a-assets');
    var item = document.createElement('a-asset-item');
    item.setAttribute('id', params.id);
    item.setAttribute('src', params.url);
    item.setAttribute('crossorigin', "anonymous");
    assets.appendChild(item);
  },
  // <a-entity id="geo1" gltf-model-legacy="#tree" visible="true"></a-entity>
  addGltfEntity: function (params) {
    var container = document.querySelector('#meshContainer');
    var geo = document.createElement('a-entity');
    geo.setAttribute('id', params.id);
    geo.setAttribute('gltf-model-legacy', params.assetId);
    geo.setAttribute('visible', params.visible);
    container.appendChild(geo);
  },
  // <a-entity id="geo0" obj-model="obj: #fs-obj; mtl: #fs-mtl" material="color: #66ca9c" visible="true" scale="0.25 0.25 0.25" ></a-entity>
  loadGeometry: function () {
    this.addGltfAsset({
      id: 'test',
      url: 'https://poly.googleapis.com/downloads/5OP5JSQZZn-/bH019e0GhVf/tmp1435adba.gltf',
    })
    this.addGltfEntity({
      id: 'geo2',
      assetId: '#test',
      visible: true,
    })
  },

  xrInitialized: function (){

    // ???
    if (AFRAME.utils.getUrlParameter('ui') === 'false') {
      return;
    }
    // Add styles to support multiple buttons and to have consistent design
    // huh? adding huge inline style element for VR styles?? WHY?? < -------------------------- ???
    var sheet = document.createElement('style');
    sheet.innerHTML = '.a-enter-ar-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjIwNDhweCIgaGVpZ2h0PSIyMDQ4cHgiIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwNDggMjA0OCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPm1hc2s8L3RpdGxlPjxjaXJjbGUgb3BhY2l0eT0iMC40IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICIgY3g9IjEwMjQiIGN5PSIxMDI0IiByPSI4ODMuNTg4Ii8+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTg0Ny43NjEsMTMxNi40OTh2LTcxLjFoNjkuM2wtMzYtOTcuMTk5SDY0NS4yNjJsLTM4LjY5OSw5Ny4xOTloNzYuNXY3MS4xaC0yMTMuM3YtNzEuMWg1NGwxODQuNDk5LTQ0Mi43OTdoLTkwdi03MS4xMDFoMTc2LjM5OWwyMTAuNTk5LDUxMy44OTdoNTcuNjAxdjcxLjFIODQ3Ljc2MXogTTc2OC41NjIsODQ5LjQwMWgtNS40bC05My42LDIzNy41OThIODU3LjY2TDc2OC41NjIsODQ5LjQwMXoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTQ4NC4wNSwxMzE2LjQ5OGwtMTIzLjI5OS0yMzguNDk5aC0xMTEuNnYxNjcuMzk5aDczLjh2NzEuMWgtMjI2Ljc5OXYtNzEuMWg3MS4xVjgwMi42MDJoLTcxLjF2LTcxLjEwMWgyNTYuNDk5YzE0NC44OTcsMCwyMDkuNjk4LDY3LjUsMjA5LjY5OCwxNjkuMTk5YzAsNzYuNS00NC4xMDEsMTM4LjU5OS0xMjEuNSwxNjEuMDk5bDk3LjE5OSwxODMuNjAxaDcyLjg5OXY3MS4xTDE0ODQuMDUsMTMxNi40OThMMTQ4NC4wNSwxMzE2LjQ5OHogTTEzNDAuMDUxLDgwMi42MDJoLTkwLjg5OHYyMDguNzk4aDkxLjhjOTguMSwwLDEzNC4wOTktNDAuNSwxMzQuMDk5LTEwOC44OTlDMTQ3NS4wNSw4MzEuNDAxLDE0MzcuMjUsODAyLjYwMiwxMzQwLjA1MSw4MDIuNjAyeiIvPjwvZz48L3N2Zz4=) 100% 100%/100% 100% no-repeat;';
    sheet.innerHTML += 'border: 0;';
    sheet.innerHTML += 'bottom: 0;';
    sheet.innerHTML += 'cursor: pointer;';
    sheet.innerHTML += 'min-width: 40px;';
    sheet.innerHTML += 'min-height: 40px;';
    sheet.innerHTML += 'padding-right: 5%;';
    sheet.innerHTML += 'padding-top: 4%;';
    sheet.innerHTML += 'position: absolute;';
    sheet.innerHTML += 'right: 0;';
    sheet.innerHTML += 'z-index: 9999;';
    sheet.innerHTML += 'margin-right: 5px;}';
    sheet.innerHTML += '.a-enter-ar-button:active,.a-enter-ar-button:hover {opacity: 0.5}';

    sheet.innerHTML += '.a-exit-ar-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjIwNDhweCIgaGVpZ2h0PSIyMDQ4cHgiIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwNDggMjA0OCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPm1hc2s8L3RpdGxlPjxjaXJjbGUgb3BhY2l0eT0iMC40IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICIgY3g9IjEwMjQiIGN5PSIxMDI0IiByPSI4ODMuNTg4Ii8+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTEwOTUuMTA0LDEzMTYuNDk4di03MS4xaDYzLjg5OWwtMTM1Ljg5OS0xNzYuMzk5bC0xMjcuNzk5LDE3Ni4zOTloNjIuOTk5djcxLjFINzQ0LjEwNXYtNzEuMWg2MS4xOTlsMTc2LjM5OS0yMzAuMzk5TDgxMi41MDUsODAyLjYwMmgtNTcuNnYtNzEuMTAxaDIwOS42OTh2NzEuMTAxaC01Ny42TDEwMzAuMzAzLDk2MWwxMTYuMS0xNTguMzk4aC01My45OTl2LTcxLjEwMWgyMDYuOTk4djcxLjEwMWgtNjIuMTAxTDEwNzEuNzAyLDEwMTMuMmwxODMuNTk5LDIzMi4xOTloNTR2NzEuMUwxMDk1LjEwNCwxMzE2LjQ5OEwxMDk1LjEwNCwxMzE2LjQ5OHoiLz48L2c+PC9zdmc+) 100% 100%/100% 100% no-repeat !important;';
    sheet.innerHTML += 'border: 0;';
    sheet.innerHTML += 'top: 20px;';
    sheet.innerHTML += 'bottom: initial;';
    sheet.innerHTML += 'position: fixed;';
    sheet.innerHTML += 'left: 10px;';
    sheet.innerHTML += 'cursor: pointer;';
    sheet.innerHTML += 'min-width: 40px;';
    sheet.innerHTML += 'min-height: 40px;';
    sheet.innerHTML += 'padding-right: 5%;';
    sheet.innerHTML += 'padding-top: 4%;';
    sheet.innerHTML += 'transition: background-color .05s ease;';
    sheet.innerHTML += '-webkit-transition: background-color .05s ease;';
    sheet.innerHTML += 'z-index: 9999;';
    sheet.innerHTML += 'display: none;';
    sheet.innerHTML += 'margin-right: 0px;}';
    sheet.innerHTML += '.a-enter-ar-button:active,.a-enter-ar-button:hover {opacity: 0.5}';

    sheet.innerHTML += '.a-enter-vr-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjIwNDhweCIgaGVpZ2h0PSIyMDQ4cHgiIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwNDggMjA0OCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPm1hc2s8L3RpdGxlPjxjaXJjbGUgb3BhY2l0eT0iMC40IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICIgY3g9IjEwMjQiIGN5PSIxMDI0IiByPSI4ODMuNTg4Ii8+PGc+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTYwOS4xMDcsNjI1Ljc2OGg0MDIuOTY4djc0LjcwN0g2NzYuNzgzdjI4My40NDdoLTY3LjY3NlY2MjUuNzY4eiIvPjwvZz48Zz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTQzOC44OTMsMTQyMi4yMzJoLTQwMi45Njl2LTc0LjcwN2gzMzUuMjkzdi0yODMuNDQ2aDY3LjY3NlYxNDIyLjIzMnoiLz48L2c+PC9nPjwvc3ZnPg==) 100% 100%/100% 100% no-repeat;';
    sheet.innerHTML += 'border: 0;';
    sheet.innerHTML += 'bottom: 0;';
    sheet.innerHTML += 'cursor: pointer;';
    sheet.innerHTML += 'min-width: 40px;';
    sheet.innerHTML += 'min-height: 40px;';
    sheet.innerHTML += 'padding-right: 5%;';
    sheet.innerHTML += 'padding-top: 4%;';
    sheet.innerHTML += 'position: absolute;';
    sheet.innerHTML += 'right: 0;';
    sheet.innerHTML += 'z-index: 9999;';
    sheet.innerHTML += 'margin-right: 5px;}';
    sheet.innerHTML += '.a-enter-vr-button:active,.a-enter-vr-button:hover {background-color: rgba(0,0,0,0);opacity: 0.5}';
    document.body.appendChild(sheet);
    if (this.hasVRDisplays) {
      this.replaceVRIcon();
    }
    if (this.el.sceneEl.renderer.xr.totalSupportedDisplays) {
      this.showVRIcon();
    }
  },
  hideVRIcon: function (){
    var sheet = document.createElement('style');
    sheet.innerHTML = '.a-enter-vr {display: none;}';
    document.body.appendChild(sheet);
  },
  showVRIcon: function (){
    var sheet = document.createElement('style');
    sheet.innerHTML = '.a-enter-vr {display: block;}';
    document.body.appendChild(sheet);
  },
  replaceVRIcon: function () {
    var sheet = document.createElement('style');
    sheet.innerHTML = '.a-enter-vr-button {background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjIwNDhweCIgaGVpZ2h0PSIyMDQ4cHgiIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwNDggMjA0OCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRpdGxlPm1hc2s8L3RpdGxlPjxjaXJjbGUgb3BhY2l0eT0iMC40IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICIgY3g9IjEwMjQiIGN5PSIxMDI0IiByPSI4ODMuNTg4Ii8+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTEwMDMuNDYsODAyLjYwMmwtMjEwLjU5OSw1MTMuODk2aC02Mi4xMDFMNTIxLjA2Miw4MDIuNjAyaC01Ni42OTl2LTcxLjEwMWgyMTkuNTk5djcxLjEwMWgtNzIuODk5bDE1MywzOTAuNTk3aDUuMzk4TDkxOS43Niw4MDIuNjAyaC03NS42di03MS4xMDFoMjEzLjI5OXY3MS4xMDFIMTAwMy40NnoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTQ4My4xNTcsMTMxNi40OThsLTEyMy4zLTIzOC40OTloLTExMS42djE2Ny4zOTloNzMuODAxdjcxLjFIMTA5NS4yNnYtNzEuMWg3MS4xMDFWODAyLjYwMmgtNzEuMTAxdi03MS4xMDFoMjU2LjQ5OWMxNDQuODk4LDAsMjA5LjY5OCw2Ny41LDIwOS42OTgsMTY5LjE5OWMwLDc2LjUtNDQuMSwxMzguNTk5LTEyMS40OTksMTYxLjA5OWw5Ny4xOTksMTgzLjYwMWg3Mi44OTl2NzEuMUwxNDgzLjE1NywxMzE2LjQ5OEwxNDgzLjE1NywxMzE2LjQ5OHogTTEzMzkuMTU4LDgwMi42MDJoLTkwLjg5OXYyMDguNzk4aDkxLjhjOTguMTAxLDAsMTM0LjEtNDAuNSwxMzQuMS0xMDguODk5QzE0NzQuMTU3LDgzMS40MDEsMTQzNi4zNTcsODAyLjYwMiwxMzM5LjE1OCw4MDIuNjAyeiIvPjwvZz48L3N2Zz4=) 100% 100%/100% 100% no-repeat;';
    sheet.innerHTML += 'border: 0;';
    sheet.innerHTML += 'bottom: 0;';
    sheet.innerHTML += 'cursor: pointer;';
    sheet.innerHTML += 'min-width: 40px;';
    sheet.innerHTML += 'min-height: 40px;';
    sheet.innerHTML += 'padding-right: 5%;';
    sheet.innerHTML += 'padding-top: 4%;';
    sheet.innerHTML += 'position: absolute;';
    sheet.innerHTML += 'right: 0;';
    sheet.innerHTML += 'z-index: 9999;';
    sheet.innerHTML += 'margin-right: 5px;}';
    sheet.innerHTML += '.a-enter-vr-button:active,.a-enter-vr-button:hover {background-color: rgba(0,0,0,0);opacity: 0.5}';

    document.body.appendChild(sheet);
  },

  // handler for plane detection event
  planeDetected: function () {
    console.log('----- plane detected', this.pinDetected, this.pinSelected);
    if (this.pinSelected) {
      this.showARUI();
    } else {
      if (!this.pinDetected) { // pin NOT selected or detected

        this.pinDetected = true;

        // plane is detected so hide "move to find surface" instruction
        // and show "tap to place" instruction
        document.querySelector('#arui-step1').style.display = 'none';
        document.querySelector('#arui-step2').style.display = 'block';

      } else { // pin is detected by NOT selected
        // why add listener again here ??? its already been added in init.
        this.reticle.addEventListener('touched', this.touched);
      }
    }
  },

  // handler for touched, ie. place after plane detected, event
  touched: function (evt) {
    console.log('----- touched', evt.detail.target);

    if (evt.detail.target.type !== 'submit') {
      this.pinSelected = true;

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
  },

  showARUI: function () {
    document.getElementById('arui').style.display = 'none';
    document.getElementById('header').style.display = 'block';
    document.getElementById('productOptions').style.display = 'flex';
    document.getElementById('buttonCart').style.display = 'block';
    document.getElementById('container').classList.add('ar');
  }
});
