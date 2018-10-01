AFRAME.registerSystem('gltfLoader', {
  init: function () {
    console.log("--- init loader");

    var self = this;
    this.sceneEl.addEventListener('loaded', function () { // inits for after scene loaded

      self.loadGeometry();
    });
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
});
