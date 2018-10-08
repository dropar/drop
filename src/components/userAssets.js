module.exports = {
  getUserAssets: () => {
    const mainDiv = document.getElementById('view')
    const assetsDiv = document.getElementById('user-assets');
    const userId = window.user.id;
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const userAssets = fetch(`api/users/${userId}/assets`,
    {method: "GET"}).then((response) =>
      response.json())
      .then((resData) => {
        console.log(resData)
        resData.forEach((asset) => {
        const userDiv = document.createElement('div');
        userDiv.id = 'one-asset'
        const userAssetName = document.createElement('a');
        userAssetName.href='https://google.com';
        userAssetName.innerText = asset.displayName;
        const userAssetImg = new Image(100, 100);
        userAssetImg.src = asset.thumbnailUrl;
        const removeFromUserButton = document.createElement('button');
        removeFromUserButton.innerText = 'Remove from my assets';
        removeFromUserButton.id = 'remove-from-my-assets-button';
        removeFromUserButton.assetId = asset.id;
        userDiv.addEventListener('click', (evt) => {
          if (evt.target === removeFromUserButton) {
            fetch('api/assets/removeFromUser', {
              method: "PUT",
              body: JSON.stringify({
                id: event.target.assetId
              }),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            }).then(function () {
              if (environment === 'production') {
                window.location.href = "https://dropar.herokuapp.com/?#!userAssets/";
              } else {
                window.location.href = "http://localhost:8080/?#!userAssets/";
              }
            });
          } else {
            if (environment === 'production') {
              window.location.href = "https://dropar.herokuapp.com/?#!assets/".concat(asset.id);
            } else {
              window.location.href = "http://localhost:8080/?#!assets/".concat(asset.id);
            }
          }
        });
        userDiv.appendChild(userAssetName);
        userDiv.appendChild(userAssetImg);
        userDiv.appendChild(removeFromUserButton)
        assetsDiv.appendChild(userDiv)
      })
    })
  }
}



