const JSON = require('circular-json');
// const noUiSlider = require('noUiSlider');
// const rangeslider = require('rangeslider.js')
const $ = require('jquery');
const crypto = require('crypto');



AFRAME.registerComponent('ar-controller', { // register a component named store

  // This component will be attached to the scene element, so scene and its children
  // will be initialized before this component!!!
  init: function () {
    console.log("--- init arController")

    // get the xr-controller
    this.system = document.querySelector('a-scene').systems['xr-controller'];
    this.system.registerAr(this);
    this.state = this.system.state;

    // listen for plane detection and touched events
    this.bindMethods();

    this.state.reticle.addEventListener('planeDetected', this.planeDetected);
    this.state.reticle.addEventListener('touched', this.touched);

    // init current mesh to meshContainer
    // this.state.currentMesh = this.state.meshContainer

    /* --- ON SCENE  --- */

    var self = this;
    this.el.sceneEl.addEventListener('loaded', function () { // inits for after scene loaded
      // add range sliders
      rangeSlider('rotation-y-slider', self.state.currentMesh, 'rotation', 'y');
      rangeSlider('position-y-slider', self.state.currentMesh, 'position', 'y');
      rangeSlider2('scale-slider', self.state.currentMesh, 'scale', ['x','y','z']);
    });

  },
  bindMethods: function () {
    this.planeDetected = this.planeDetected.bind(this);
    this.touched = this.touched.bind(this);
    this.renderAr = this.renderAr.bind(this);
    this.renderMagicWindow = this.renderMagicWindow.bind(this);
    this.addGltfEntity = this.addGltfEntity.bind(this);
    this.initMagicWindow = this.initMagicWindow.bind(this);
  },

  // handle plane detection event
  planeDetected: function () {
    document.getElementById('status').innerHTML += '<div> --- plane detected </div>';

    const waiting = !this.state.pinSelected && !this.state.pinDetected;
    const pinning = !this.state.pinSelected && this.state.pinDetected;
    const pinned = this.state.pinSelected;

    if (waiting || pinned) { // typical case: plane detected while waiting for it.
      document.getElementById('status').innerHTML += '<div> --- --- plane detected </div>';
      // go to step two.
      document.querySelector('#arui-step1').style.display = 'none';
      document.querySelector('#arui-step2').style.display = 'block';
      // start listening for pin (touched)
      this.state.reticle.addEventListener('touched', this.touched);

    } else if (pinning) {
      document.getElementById('status').innerHTML += '<div> --- --- plane detected BUT already pinning. ignore. </div>';
    } else { // pinned
      document.getElementById('status').innerHTML += '<div> --- --- plane detected BUT already pinned. ignore. </div>';
    }

    // stop listening for plane detected
    //this.state.reticle.removeEventListener('planeDetected', this.planeDetected);
    // update state
    this.state.pinDetected = true;

  },

  // handler for touched, ie. place after plane detected, event
  touched: function (evt) {
    document.getElementById('status').innerHTML = `<div> --- touch: ${JSON.stringify(evt.detail.target.type)} </div>`;

    var currentAsset = JSON.parse(localStorage.getItem('currentAsset'));


    if (evt.detail.target.type !== 'submit' &&
        evt.detail.target.type !== 'range') {
      document.getElementById('status').innerHTML += '<div> --- --- place new mesh </div>';

      // document.getElementById('status').innerHTML += `<div> --- --- --- curAss id: ${currentAsset} </div>`;
      // document.getElementById('status').innerHTML += `<div> --- --- --- ret pos: ${this.state.reticle.getAttribute('position')} </div>`;
      // document.getElementById('status').innerHTML += `<div> --- --- --- curMsh sc: ${this.state.currentMesh.getAttribute('scale')} </div>`;
      // remove the reticle, but save the parent.
      // this.state.reticleParent = this.state.reticle.parentNode;
      // this.state.reticle.parentNode.removeChild(this.state.reticle);

      // append geo to container with unique id
      var id = crypto.randomBytes(20).toString('hex');
      let newMesh = this.addGltfEntity({
        id,
        assetId: `#${currentAsset.id}`,
        visible: true,
        position: Object.assign({}, this.state.reticle.getAttribute('position')),
        scale: Object.assign({}, this.state.currentMesh.getAttribute('scale'))
      })

      // make current
      this.state.currentMesh = newMesh;
      rangeSlider('rotation-y-slider', newMesh, 'rotation', 'y');
      rangeSlider('position-y-slider', newMesh, 'position', 'y');
      rangeSlider2('scale-slider', newMesh, 'scale', ['x','y','z']);

      // show mesh and position at reticle and show AR UI.
      this.state.meshContainer.setAttribute('visible', true);
      // this.state.meshContainer.setAttribute('position', this.state.reticle.getAttribute('position'));

      // document.getElementById('status').innerHTML += `<div> --- --- --- curMesh: ${this.state.currentMesh.getAttribute('id')} </div>`;
      // document.getElementById('status').innerHTML += `<div> --- --- --- x position: ${JSON.stringify(this.state.currentMesh.getAttribute('position').x)} </div>`;
      // document.getElementById('status').innerHTML += `<div> --- --- --- y position: ${JSON.stringify(this.state.currentMesh.getAttribute('position').y)} </div>`;
      // document.getElementById('status').innerHTML += `<div> --- --- --- z position: ${JSON.stringify(this.state.currentMesh.getAttribute('position').z)} </div>`;

      this.showARUI();

      //update state
      this.state.pinSelected = true;
    }

    // stop listening whether pinned or dropped
    // this.state.reticle.removeEventListener('touched', this.touched);

  },

  showARUI: function () {
    document.getElementById('status').innerHTML += '<div> --- show AR UI </div>';

    document.getElementById('arui').style.display = 'none'; // hide instructions
    // document.getElementById('header').style.display = 'block';
    document.getElementById('productOptions').style.display = 'flex';
    document.getElementById('container').classList.add('ar');
  },

  renderAr: function () {
    // document.getElementById('status').innerText = 'mthfkr' + ' ' + this.state.pinSelected + ' ' + this.state.currentReality;
    document.getElementById('status').innerHTML += '<div> --- render Ar </div>';

    // add AR styles
    // document.getElementById('header').classList.add('ar');
    document.getElementById('visualSheet').classList.add('ar');
    document.getElementById('content3D').classList.add('ar');
    document.getElementById('productOptions').classList.add('ar');
    var productOptionArr = document.getElementsByClassName('productOption');
    for (var i = 0; i < productOptionArr.length; i++) {
      productOptionArr[i].classList.add('ar');
    }

    // temp set to waiting on return to ar everytime, since have to plane detect again anyway.
    // this.state.pinSelected = false;
    // this.state.pinDetected = false;

    const waiting = !this.state.pinSelected && !this.state.pinDetected;
    const pinning = !this.state.pinSelected && this.state.pinDetected;
    const pinned = this.state.pinSelected;

    if (waiting || pinned) {
      document.getElementById('status').innerHTML += '<div> --- --- try to detect plane </div>';
      document.getElementById('arui').style.display = 'block';
      document.querySelector('#arui-step1').style.display = 'block';
      document.querySelector('#arui-step2').style.display = 'none';
      // document.getElementById('header').style.display = 'none';
      document.getElementById('productOptions').style.display = 'none';
      // hide mesh.
      this.state.meshContainer.setAttribute('visible', false);
      // wait for plane detection
      this.state.reticle.addEventListener('planeDetected', this.planeDetected);

    } else if (pinning) {
      document.getElementById('status').innerHTML += '<div> --- --- plane already detected. bad state? </div>';
      document.getElementById('arui').style.display = 'block';
      document.querySelector('#arui-step1').style.display = 'none';
      document.querySelector('#arui-step2').style.display = 'block';
      // document.getElementById('header').style.display = 'none';
      document.getElementById('productOptions').style.display = 'none';
      // hide mesh.
      this.state.meshContainer.setAttribute('visible', false);
      // listen for touch
      this.state.reticle.addEventListener('touched', this.touched);

    } else { // pinned
      document.getElementById('status').innerHTML += '<div> --- --- obj already pinned </div>';
      // product option control panel only shows after object placed.
      document.getElementById('arui').style.display = 'none';
      document.getElementById('productOptions').style.display = 'flex';
      document.getElementById('container').classList.add('ar');

      // this.restoreAr();
      document.getElementById('status').innerHTML += '<div> --- restore AR </div>';

      // restore reticle
      if (this.state.reticleParent) {
        document.getElementById('status').innerHTML += '<div> --- --- restore reticle </div>';
        this.state.reticleParent.appendChild(this.state.reticle);
        this.state.reticle.setAttribute('visible', true);
      }

      // restore mesh
      if (this.state.meshContainerCurPosition) {
        document.getElementById('status').innerHTML += '<div> --- --- restore mesh </div>';
        this.state.meshContainer.setAttribute('visible', true);
        this.state.meshContainer.setAttribute('position', this.state.meshContainerCurPosition);

        // document.getElementById('status').innerHTML += `<div> --- --- --- visible: ${this.state.meshContainer.getAttribute('visible')} </div>`;
        // document.getElementById('status').innerHTML += `<div> --- --- --- position: ${JSON.stringify(this.state.meshContainer.getAttribute('position').x)} </div>`;
        // document.getElementById('status').innerHTML += `<div> --- --- --- y position: ${JSON.stringify(this.state.meshContainer.getAttribute('position').y)} </div>`;
        // document.getElementById('status').innerHTML += `<div> --- --- --- z position: ${JSON.stringify(this.state.meshContainer.getAttribute('position').z)} </div>`;
      }

      this.showARUI();
    }
  },
  restoreAr: function() {
    document.getElementById('status').innerHTML += '<div> --- restore AR </div>';
    //if (this.state.pinSelected) { // object already pinned
      document.getElementById('status').innerHTML += '<div> --- --- pin selected </div>';

      // jp: if we get plane detection but object already pinned, so...
      // show mesh and position at reticle and show AR UI.
      this.state.meshContainer.setAttribute('visible', true);
      document.getElementById('status').innerHTML += '<div> --- --- vis set </div>';
      // this.state.meshContainer.setAttribute('position', this.state.reticle.getAttribute('position'));
      this.state.meshContainer.setAttribute('position', this.state.meshContainerCurPosition);

      // document.getElementById('status').innerHTML += `<div> --- --- old visible: ${this.state.meshContainer.getAttribute('visible')} </div>`;
      // document.getElementById('status').innerHTML += `<div> --- --- old x position: ${JSON.stringify(this.state.meshContainer.getAttribute('position').x)} </div>`;
      // document.getElementById('status').innerHTML += `<div> --- --- old y position: ${JSON.stringify(this.state.meshContainer.getAttribute('position').y)} </div>`;
      // document.getElementById('status').innerHTML += `<div> --- --- old z position: ${JSON.stringify(this.state.meshContainer.getAttribute('position').z)} </div>`;

      this.showARUI();
    //}
  },

  cleanupMagicWindow: function() {
    document.getElementById('status').innerHTML += '<div> --- cleanupMagicWindow </div>';
    // create magic window obj.
    // var currentAsset = JSON.parse(localStorage.getItem('currentAsset'));
    var geo = document.getElementById('currentAsset')
    geo.setAttribute('visible', false)
    // this.state.meshContainer.removeChild(geo);
  },

  initMagicWindow: function() {
    // create magic window obj.
    var currentAsset = JSON.parse(localStorage.getItem('currentAsset'));
    document.getElementById('status').innerHTML += `<div> --- currentAsset.id: ${currentAsset.id} </div>`;

    // append geo to container
    let geo = this.addGltfEntity({
      id: `currentAsset`,
      assetId: `#${currentAsset.id}`,
      visible: true,
      position: {x:0, y:0, z:0},
      scale: {x:1, y:1, z:1}
    })

    // set currentMesh to new entity
    this.state.currentMesh = geo;
  },

  renderMagicWindow: function() {
    document.getElementById('status').innerHTML += '<div> --- renderMagicWindow </div>';

    // add magic window styles
    // document.getElementById('header').classList.remove('ar');
    document.getElementById('visualSheet').classList.remove('ar');
    document.getElementById('content3D').classList.remove('ar');
    document.getElementById('productOptions').classList.remove('ar');

    var productOptionArr = document.getElementsByClassName('productOption');
    for (var i = 0; i < productOptionArr.length; i++) {
      productOptionArr[i].classList.remove('ar');
    }

    document.getElementById('container').classList.remove('ar');
    // document.getElementById('header').style.display = 'block';
    document.getElementById('productOptions').style.display = 'block';
    document.getElementById('arui').style.display = 'none';

    // save current position
    this.state.meshContainerCurPosition = Object.assign({}, this.state.meshContainer.getAttribute('position'));

    // document.getElementById('status').innerHTML += `<div> --- --- cur x position: ${JSON.stringify(this.state.meshContainerCurPosition.x)} </div>`;
    // document.getElementById('status').innerHTML += `<div> --- --- cur y position: ${JSON.stringify(this.state.meshContainerCurPosition.y)} </div>`;
    // document.getElementById('status').innerHTML += `<div> --- --- cur z position: ${JSON.stringify(this.state.meshContainerCurPosition.z)} </div>`;

    // put mesh back to default magic window position
    // show it incase it is hidden, ie in ar but not yet placed!
    // this.state.meshContainer.setAttribute('position', this.state.meshContainerOrigPosition);
    // this.state.meshContainer.setAttribute('visible', true);

    // restore currentAsset for magic window
    var geo = document.getElementById('currentAsset')
    geo.setAttribute('position', this.state.meshContainerOrigPosition);
    geo.setAttribute('visible', true)

    // should we hide all other meshes???

    // restore reticle and hide
    if (this.state.reticleParent) {
      this.state.reticleParent.appendChild(this.state.reticle);
    }
    this.state.reticle.setAttribute('visible', false);

  },

  addGltfEntity: function (params) {
    document.getElementById('status').innerHTML += '<div> --- addGltfEntity </div>';

    //var container = document.querySelector('#meshContainer');
    var geo = document.createElement('a-entity');

    geo.setAttribute('id', params.id);
    geo.setAttribute('visible', params.visible);

    // updating position/scale directly via the three.js Object3D
    // position/scale vectors is recommended but not working, so
    // using set Attribute instead

    // geo.object3D.position.set(...params.position);
    // geo.object3D.scale.set(...params.scale);

    geo.setAttribute('position', params.position);
    geo.setAttribute('scale', params.scale);

    // using gltf-model-legacy format instead of gltf
    // geo.setAttribute('gltf-model-legacy', "url(" + params.url + ")");
    geo.setAttribute('gltf-model', params.assetId);

    document.getElementById('status').innerHTML += '<div> --- --- append geo </div>';
    this.state.meshContainer.appendChild(geo);
    document.getElementById('status').innerHTML += '<div> --- --- set to cur </div>';
    this.state.currentMesh = geo;
    document.getElementById('status').innerHTML += `<div> --- --- cur id: ${this.state.currentMesh.id} </div>`;

    return geo;
  },
});

// utils

var rangeSlider = function(wrapper, entity, attribute, key){
  var root = $('.' + wrapper)
  var slider = root.find('.range-slider'),
      range = root.find('.range-slider__range'),
      value = root.find('.range-slider__value');

  slider.each(function(){

    // init value elements with each corresponding range's value attr.
    value.each(function(){
      // this = value
      // var value = $(this).prev().attr('value');
      // $(this).html(value);
    });

    range.off('input');
    range.on('input', function(){
      // this = range
      switch (this.name) {
        case "rotation":
          $(this).next(value).html(this.value + "º");
          break;
        case "position-y":
          $(this).next(value).html(this.value + "m");
          break;
        case "scale":
        $(this).next(value).html((this.value * 10).toFixed(0) + "%");
        break;
      }
      // $(this).next(value).html(this.value);
      let val = entity.getAttribute(attribute);
      console.log('-----------val', val)
      let newVal = {...val, [key]: Number(this.value)}
      console.log('-----------meshcont rot bef', entity.getAttribute(attribute))
      entity.setAttribute(attribute, newVal)
      console.log('-----------meshcont rot aft', entity.getAttribute(attribute))
    });
  });
};

var rangeSlider2 = function(wrapper, entity, attribute, keys){
  var root = $('.' +wrapper)
  var slider = root.find('.range-slider'),
      range = root.find('.range-slider__range'),
      value = root.find('.range-slider__value');

  slider.each(function(){

    // init value elements with each corresponding range's value attr.
    value.each(function(){
      // this = value
      // var value = $(this).prev().attr('value');
      // $(this).html(value);
    });

    range.off('input');
    range.on('input', function(){
      // this = range
      switch (this.name) {
        case "rotation":
          $(this).next(value).html(this.value + "º");
          break;
        case "position-y":
          $(this).next(value).html(this.value + "m");
          break;
        case "scale":
        $(this).next(value).html((this.value * 10).toFixed(0) + "%");
        break;
      }
      let val = entity.getAttribute(attribute);
      console.log('-----------val', val)
      let newVal = {}
      keys.forEach(key => newVal[key] = Number(this.value))
      console.log('-----------meshcont rot bef', entity.getAttribute(attribute))
      entity.setAttribute(attribute, newVal)
      console.log('-----------meshcont rot aft', entity.getAttribute(attribute))
    });
  });
};
