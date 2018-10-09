module.exports = {
  getUserAssets: () => {
    const userAssetDiv = document.getElementById('user-assets');
    const userId = window.user.id;
    fetch(`api/users/${userId}/assets`, {
      method: "GET"
    })
    .then(response => {
      return response.json()
    })
    .then(resData => {
      console.log(resData);
      resData.forEach(asset => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('one-asset');
        const userAssetName = document.createElement('a');
        userAssetName.innerText = asset.displayName;
        const userAssetImg = new Image(100, 100);
        userAssetImg.src = asset.thumbnailUrl;
        const removeFromUserButton = document.createElement('button');
        removeFromUserButton.innerText = "Remove";
        removeFromUserButton.classList.add('remove-from-my-assets-button');
        removeFromUserButton.classList.add('btn');
        removeFromUserButton.classList.add('btn-default');
        removeFromUserButton.assetId = asset.id;
        userDiv.addEventListener('click', evt => {
          if (evt.target === removeFromUserButton) {
            fetch('api/assets/removeFromUser', {
              method: "PUT",
              body: JSON.stringify({
                id: event.target.assetId
              }),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            })
            .then(function () {
              if (environment === 'production') {
                window.location.href = "https://dropar.herokuapp.com?#!assets";
              }
              else {
                window.location.href = "http://localhost:8080/?#!assets";
              }
            });
          }
          else {
            if (environment === 'production') {
              window.location.href = `https://dropar.herokuapp.com/?#!assets/${asset.id}`;
            }
            else {
              window.location.href = `http://localhost:8080/?#!assets/${asset.id}`;
            }
          }
        })
        userDiv.appendChild(userAssetName);
        userDiv.appendChild(userAssetImg);
        userDiv.appendChild(removeFromUserButton);
        userAssetDiv.appendChild(userDiv);
      })
    });
  },
  getAllAssets: () => {
    const assetGlobalDiv = document.getElementById('assets-container');
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const apiAssets = document.createElement('div');
    apiAssets.classList.add('col-xs-12');
    //fetch all assets from DB.
    fetch(`/api/assets`,
    {method: "GET"}).then((response) =>
      response.json())
    .then((resData) => {
      console.log("resData", resData);
        resData.forEach((asset) => {
          const assetDiv = document.createElement('div');
          assetDiv.classList.add('one-asset');

          const assetName = document.createElement('a');
          assetName.innerText = asset.displayName;

          const assetImg = new Image(100, 100);
          assetImg.src = asset.thumbnailUrl;

          const assetAddToUserButton = document.createElement('button');
          assetAddToUserButton.classList.add('btn-default');
          assetAddToUserButton.classList.add('btn');
          assetAddToUserButton.classList.add('add-asset-button');
          assetAddToUserButton.innerText = 'Add to my assets';
          assetAddToUserButton.id = 'add-to-assets-button';
          assetAddToUserButton.assetId = asset.id;

          assetDiv.addEventListener('click', (evt) => {
            if (evt.target === assetAddToUserButton) {
              fetch('api/assets/addToUser', {
                method: "POST",
                body: JSON.stringify({
                  id: event.target.assetId
                }),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              });
            }
            else {
              if (environment === 'production') {
                window.location.href = `https://dropar.herokuapp.com/?#!assets/${asset.id}`;
              }
              else {
                window.location.href = `http://localhost:8080/?#!assets/${asset.id}`;
              }
            }
          })
          assetDiv.appendChild(assetName);
          assetDiv.appendChild(assetImg);
          assetDiv.appendChild(assetAddToUserButton);
          apiAssets.appendChild(assetDiv);
      })
      assetGlobalDiv.appendChild(apiAssets);
    })
  },
  // getAllAssetsCategory: (category) => {
  //   const assetGlobalDiv = document.getElementById('all-assets');
  //   const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
  //   fetch(`/api/assets/${category}`,
  //   {
  //     method: "GET"
  //   })
  //   .then((response) =>
  //     response.text())
  //     .then((resData) => {
  //       console.log('all assets result',resData)
  //       resData.forEach((asset) => {
  //       const allAssetDiv = document.createElement('div');
  //       allAssetDiv.id = 'one-asset'
  //       const allAssetName = document.createElement('a');
  //       allAssetName.innerText = asset.displayName;
  //       const allAssetImg = new Image(100, 100);
  //       allAssetImg.src = asset.thumbnailUrl;
  //       var allAssetAddToUserButton = document.createElement('button');
  //       allAssetAddToUserButton.innerText = 'Add to my assets';
  //       allAssetAddToUserButton.id = 'add-to-assets-button';
  //       allAssetAddToUserButton.assetId = asset.id;
  //       allAssetDiv.addEventListener('click', function (evt) {
  //         if (evt.target === allAssetAddToUserButton) {
  //           fetch('api/assets/addToUser', {
  //             method: "POST",
  //             body: JSON.stringify({
  //               id: event.target.assetId
  //             }),
  //             headers: {
  //               "Content-Type": "application/json; charset=utf-8"
  //             }
  //           });
  //         } else {
  //           if (environment === 'production') {
  //             window.location.href = "https://dropar.herokuapp.com/?#!assets/".concat(asset.id);
  //           } else {
  //             window.location.href = "http://localhost:8080/?#!assets/".concat(asset.id);
  //           }
  //         }
  //       })
  //       allAssetDiv.appendChild(allAssetName);
  //       allAssetDiv.appendChild(allAssetImg);
  //       allAssetDiv.appendChild(allAssetAddToUserButton);
  //       assetGlobalDiv.appendChild(allAssetDiv);
  //     })
  //   })

  // getAssetsByCategory: (category) => {
  //   const assetGlobalDiv = document.getElementById('all-assets');
  //   if (assetsArr.length !== 0){
  //     const catFiltArr = assetsArr.filter(function(asset){
  //       return asset.category === category
  //     })
  //     catFiltArr.forEach((asset) => {
  //       const allAssetDiv = document.createElement('div');
  //       allAssetDiv.id = 'one-asset'
  //       allAssetDiv.addEventListener('click', () => {
  //         if (environment === 'production'){
  //           window.location.href = `https://dropar.herokuapp.com/?#!assets/${asset.id}`
  //         } else {
  //           window.location.href = `http://localhost:8080/?#!assets/${asset.id}`
  //         }});
  //       const allAssetName = document.createElement('a');
  //       allAssetName.href='https://google.com';
  //       allAssetName.innerText = asset.displayName;
  //       const allAssetImg = new Image(100, 100);
  //       allAssetImg.src = asset.thumbnailUrl;
  //       allAssetDiv.appendChild(allAssetName);
  //       allAssetDiv.appendChild(allAssetImg);
  //       assetGlobalDiv.appendChild(allAssetDiv)
  //     })
  //   } else {
  //     console.log('view all assets page first')
  //   }
  // }
}


