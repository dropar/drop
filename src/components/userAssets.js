const axios = require('axios')
module.exports = {
  getUserAssets: () => {
    const mainDiv = document.getElementById('view')
    const assetsDiv = document.getElementById('user-assets');
    const userId = window.user.id;
    const userAssets = axios.get(`api/users/${userId}/assets`).then((response) => {
      response.data.forEach((asset) => {
        console.log(asset.displayName)
        const userAssetName = document.createElement('p')
        userAssetName.innerText = asset.displayName;
        const userAssetImg = new Image(100, 100);
        userAssetImg.src = asset.thumbnailUrl;
        assetsDiv.appendChild(userAssetName);
        assetsDiv.appendChild(userAssetImg);
        //mainDiv.appendChild(assetsDiv)
      })
    })
  }
}
