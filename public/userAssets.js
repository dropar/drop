const axios = require('axios')


const assetsDiv = document.getElementById('user-assets');
const userId = this.user.id;
let userAssets;
assetsDiv.addEventListener('load', () => {
  userAssets = axios.get(`api/users/${userId}/assets`)
  return userAssets;
})

userAssets.forEach((asset) => {
  const userAssetNode = document.createElement('p')
  userAssetNode.innerText = asset.name;
  assetsDiv.appendChild(userAssetNode)
})
