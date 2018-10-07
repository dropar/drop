const axios = require('axios');

// -- STATE --
// let currentAsset = {};
let userAssets = [];

module.exports = {
  fetchCurrentAsset: async (assetId) => {
    // fetch asset from db
    const {data: asset} = await axios.get(`/api/assets/${assetId}/`);
    // update state
    console.log(asset);
    localStorage.setItem('currentAsset', JSON.stringify(asset));
  },
  fetchUserAssets: async (userId) => {
    // fetch assets for user form db
    const {data: assets} = await axios.get(`/api/${userId}/assets/`)
    // filter by user here
    // ...
    // update state
    this.userAssets = assets
  },
}
