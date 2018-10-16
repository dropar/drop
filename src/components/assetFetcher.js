const axios = require('axios');

module.exports = {
  fetchCurrentAsset: async (assetId) => {
    // should only do this if id ! current id
    // fetch asset from db
    const {data: asset} = await axios.get(`/api/assets/${assetId}/`);
    // update state
    localStorage.setItem('currentAsset', JSON.stringify(asset));
  }
}
