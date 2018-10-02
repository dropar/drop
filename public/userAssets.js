const axios = require('axios')


const assetsDiv = document.getElementById('user-assets');
const userId = this.user.id;
let userAssets;
assetsDiv.addEventListener('load', () => {
  userAssets = axios.get(`api/users/${userId}/assets`)
  return userAssets;
})

userAssets.forEach((asset) => {
  const userAssetName = document.createElement('p')
  userAssetName.innerText = asset.name;
  const userAssetImg = new Image(100, 100);
  userAssetImg.src = asset.thumbnail;
  assetsDiv.appendChild(userAssetName);
  assetsDiv.appendChild(userAssetImg);
})
