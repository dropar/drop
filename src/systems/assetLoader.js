// import axios from 'axios'
const axios = require('axios');

AFRAME.registerSystem('assetLoader', {
  init: function () {
    console.log("--- init loader");

    // -- STATE --
    this.currentAsset = {
      id: 1,
      name: 'spaceCat',
      modelUrl: 'https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4`'
    };
    this.userAssets = [];

    var self = this;
    this.sceneEl.addEventListener('loaded', function () { // inits for after scene loaded
      console.log('--- gltfloader loaded event')
      // self.loadAssetById();
      // self.loadAllUserAssets();
      self.loadGeometry();
    });
  },
  loadAssetById: async function () {
    const {data: asset} = await axios.get(`/api/asset/${this.currentAsset.id}`);
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
  // <a-entity id="geo1" gltf-model-legacy="#tree" visible="true"></a-entity>
  addGltfEntity: function (params) {
    var container = document.querySelector('#meshContainer');
    var geo = document.createElement('a-entity');
    geo.setAttribute('id', params.id);
    geo.setAttribute('gltf-model-legacy', params.assetId);
    // geo.setAttribute('gltf-model-legacy', "url(" + params.url + ")");
    geo.setAttribute('visible', params.visible);
    container.appendChild(geo);
  },
  // <a-entity id="geo0" obj-model="obj: #fs-obj; mtl: #fs-mtl" material="color: #66ca9c" visible="true" scale="0.25 0.25 0.25" ></a-entity>
  loadGeometry: function () {
    console.log('--- load geo')
    this.addGltfAsset({
      id: 'test',
      url: 'https://poly.googleapis.com/downloads/5OP5JSQZZn-/bH019e0GhVf/tmp1435adba.gltf',
    })
    this.addGltfEntity({
      id: 'geo2',
      assetId: '#test',
      visible: true,
      // url: 'https://poly.googleapis.com/downloads/5OP5JSQZZn-/bH019e0GhVf/tmp1435adba.gltf',
    })
  },
});