const axios = require('axios')

const getAllAssets = async () => {
  try{
    const res = await axios.get('https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4');
    const allAssets = res.data.assets;
    const allAssetsArray = allAssets.map(asset => ({
      displayName: asset.displayName,
      authorName: asset.authorName,
      thumbnailUrl: asset.thumbnail.url
    }));
    let allAssetsView  = document.getElementById('all-assets-view');
    let newDiv = document.createElement('div')
    allAssetsArray.forEach(asset => {
      let assetThumbnail = document.createElement('img')
      assetThumbnail.setAttribute('src', `${asset.thumbnail.url}`)
      let displayName = document.createTextNode(`${asset.displayName}`)
      let authorName = document.createTextNode(`by ${asset.authorName}`)
      newDiv.appendChild(displayName,authorName,assetThumbnail);
      });
    allAssetsView.appendChild(newDiv);
  } catch (error) {
    console.error(error)
  }
}

module.exports = getAllAssets;


