const axios = require('axios')
module.exports = {
  getUserAssets: () => {
    const mainDiv = document.getElementById('view')
    const assetsDiv = document.getElementById('user-assets');
    console.log('assetsdiv', assetsDiv)
    const userId = window.user.id;


    const userAssets = axios.get(`api/users/${userId}/assets`)
    const parsedUserAssets = userAssets.data;
    console.log(parsedUserAssets)
    const assetsHTML = parsedUserAssets.forEach((asset) => {
      const userAssetName = document.createElement('p')
      userAssetName.innerText = asset.name;
      const userAssetImg = new Image(100, 100);
      userAssetImg.src = asset.thumbnail;
      assetsDiv.appendChild(userAssetName);
      assetsDiv.appendChild(userAssetImg);
    })
    mainDiv.appendChild(assetsHTML)
  }
}
