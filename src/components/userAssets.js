module.exports = {
  getUserAssets: () => {
    const mainDiv = document.getElementById('view')
    const assetsDiv = document.getElementById('user-assets');
    const userId = window.user.id;
    const userAssets = fetch(`api/users/${userId}/assets`,
    {method: "GET"}).then((response) =>
      response.json())
      .then((resData) => {
        console.log(resData)
        resData.forEach((asset) => {
        const userDiv = document.createElement('div');
        userDiv.id = 'one asset'
        userDiv.addEventListener('click', () => { fetch(`api/assets/${asset.id}`)});
        const userAssetName = document.createElement('a');
        userAssetName.href='https://google.com';
        userAssetName.innerText = asset.displayName;
        const userAssetImg = new Image(100, 100);
        userAssetImg.src = asset.thumbnailUrl;
        userDiv.appendChild(userAssetName);
        userDiv.appendChild(userAssetImg);
        assetsDiv.appendChild(userDiv)
        //mainDiv.appendChild(assetsDiv)
      })
    })
  }
}

//add event listener to each asset for routing to asset

// create div
// add onclick handling to //someurl.url for entire div
//divname.onclick = fetch(someurl.url)

// fetch(assets/:assetId, { method: 'GET' })

