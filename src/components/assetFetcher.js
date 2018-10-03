
// -- STATE --
let currentAsset = {
  id: 1,
  name: 'spaceCat',
  modelUrl: 'https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4`'
};
let userAssets = [];

module.exports = {
  fetchcurrentAsset: async (assetId) => {
    // fetch asset from db
    const {data: asset} = await axios.get(`/api/assets/${assetId}/`);
    // update state
    this.currentAsset = asset;
  },
  fetchUserAssets: async (userId) => {
    // fetch assets for user form db
    const {data: assets} = await axios.get(`/api/assets/`)
    // filter by user here
    // ...
    // update state
    this.userAssets = assets
  },
}
