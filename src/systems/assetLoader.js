// import axios from 'axios'
const axios = require('axios');

AFRAME.registerSystem('assetLoader', {
  init: function () {
    console.log("--- init loader");

    // // -- STATE --
    // this.currentAsset = {
    //   id: 1,
    //   name: 'spaceCat',
    //   modelUrl: 'https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4`'
    // };
    // this.userAssets = [];

    var self = this;
    this.sceneEl.addEventListener('loaded', function () { // inits for after scene loaded
      console.log('--- gltfloader loaded event')
      // self.loadAssetById();
      // self.loadAllUserAssets();
      self.loadGeometry();
    });
  },
  loadAssetById: async function (id) {
    // fetch asset from db
    const {data: asset} = await axios.get(`/api/assets/${id}`);
    // uidpate state
    this.currentAsset = asset;
  },
  loadAllUserAssets: async function () {
    // tbd: replace this with
    const {data: assets} = await axios.get(`https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4`)
    console.log(assets);
  },
  addGltfAsset: function (params) {
    var assets = document.querySelector('a-assets');
    var item = document.createElement('a-asset-item');

    item.setAttribute('id', params.id);
    item.setAttribute('src', params.url);
    item.setAttribute('crossorigin', "anonymous");

    assets.appendChild(item);
  },
  addGltfEntity: function (params) {
    console.log('--- position: ', params.position)
    console.log('--- scale: ', params.scale)

    var container = document.querySelector('#meshContainer');
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

    console.log('--- geo.object3D.: ', geo.object3D)
    container.appendChild(geo);
  },
  // keep for testing!!!
  // loadGeometry: function () {
  //   console.log('--- load geo')
  //   this.addGltfAsset({
  //     id: 'test',
  //     url: 'https://poly.googleapis.com/downloads/5OP5JSQZZn-/bH019e0GhVf/tmp1435adba.gltf',
  //   })
  //   this.addGltfEntity({
  //     id: 'geo2',
  //     assetId: '#test',
  //     visible: true,
  //     // url: 'https://poly.googleapis.com/downloads/5OP5JSQZZn-/bH019e0GhVf/tmp1435adba.gltf',
  //   })
  // },
  loadGeometry: function () {
    var currentAsset = JSON.parse(localStorage.getItem('currentAsset'));
    // console.log(`currentAsset: ${JSON.stringify(currentAsset)}`)
    this.addGltfAsset({
      id: currentAsset.id,
      name: currentAsset.name,
      url: currentAsset.assetUrl
    })
    this.addGltfEntity({
      id: 'currentAsset',
      assetId: `#${currentAsset.id}`,
      visible: true,
      position: {x:0, y:0, z:0},
      scale: {x:1, y:1, z:1}
    })
  }
});
