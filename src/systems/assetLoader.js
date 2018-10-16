// import axios from 'axios'
const axios = require('axios');

AFRAME.registerSystem('assetLoader', {
  init: function () {
    var self = this;
    this.sceneEl.addEventListener('loaded', function () { // inits for after scene loaded
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

    var container = document.querySelector('#meshContainer');
    var geo = document.createElement('a-entity');

    geo.setAttribute('id', params.id);
    geo.setAttribute('visible', params.visible);

    geo.setAttribute('position', params.position);
    geo.setAttribute('scale', params.scale);

    // using gltf-model-legacy format instead of gltf
    // geo.setAttribute('gltf-model-legacy', "url(" + params.url + ")");
    geo.setAttribute('gltf-model', params.assetId);

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
    document.getElementById('status').innerHTML += '<div> --- loadGeometry </div>';
    var currentAsset = JSON.parse(localStorage.getItem('currentAsset'));
    this.addGltfAsset({
      id: currentAsset.id,
      name: currentAsset.name,
      url: currentAsset.assetUrl
    })
    document.getElementById('status').innerHTML += '<div> --- end loadGeometry </div>';
  }
});
