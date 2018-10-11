module.exports = {
  getUserAssets: () => {
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const userAssetDiv = document.getElementById('user-assets');
    let userId;
    if (window.user) {
      userId = window.user.id;
    }
    else userId = null;
    fetch(`api/users/${userId}/assets`, {
      method: "GET"
    })
    .then(response => {
      return response.json()
    })
    .then(resData => {
      resData.forEach(asset => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('one-asset');
        userDiv.classList.add('user-asset');
        userDiv.classList.add('row');
        userDiv.userAssetId = asset.id;
        const userAssetImgCol = document.createElement('div');
        userAssetImgCol.classList.add('col-xs-12');
        userAssetImgCol.classList.add('user-asset-img-col');
        const userAssetButtonCol = document.createElement('div');
        userAssetButtonCol.classList.add('col-xs-12');
        userAssetButtonCol.classList.add('user-asset-button-col');
        const userImgLink = document.createElement('a');
        userImgLink.href = environment === 'production' ? `https://dropar.herokuapp.com/?#!assets/${asset.id}` : `http://localhost:8080/?#!assets/${asset.id}`
        // userAssetName.innerText = asset.displayName;
        const userAssetImg = new Image(100, 100);
        userAssetImg.classList.add('asset-img');
        userAssetImg.src = asset.thumbnailUrl;
        userImgLink.appendChild(userAssetImg);
        userAssetImgCol.appendChild(userImgLink);
        const removeFromUserButton = document.createElement('button');
        removeFromUserButton.innerText = "Remove";
        removeFromUserButton.classList.add('remove-from-my-assets-button');
        removeFromUserButton.classList.add('btn');
        removeFromUserButton.classList.add('btn-default');
        removeFromUserButton.assetId = asset.id;
        userAssetButtonCol.appendChild(removeFromUserButton);
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
            .then(() => {
              const userAssets = document.getElementsByClassName("user-asset");
              const userAssetsArr = Array.prototype.slice.call(userAssets);
              let toRemove;
              for (let i = 0; i < userAssetsArr.length; i++) {
                if (userAssetsArr[i].userAssetId == asset.id) {
                  toRemove = userAssetsArr[i];
                }
              }
              toRemove.style.display = 'none';
            })
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
        // userDiv.appendChild(userAssetName);
        userDiv.appendChild(userAssetImgCol);
        userDiv.appendChild(userAssetButtonCol);
        userAssetDiv.appendChild(userDiv);
      })
    });
  },
  getAllAssets: () => {
    const assetGlobalDiv = document.getElementById('assets-container');
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const apiAssets = document.createElement('div');
    //const apiAssets = [];
    //const viewAsset = document.createElement('div');
    //fetch all assets from DB.
    fetch(`/api/assets`,
    {method: "GET"}).then((response) =>
      response.json())
    .then((resData) => {
        resData.forEach((asset) => {
          const assetDiv = document.createElement('div');
          assetDiv.classList.add('one-asset');
          assetDiv.classList.add('row');
          assetDiv.classList.add('public-asset');
          assetDiv.publicAssetId = asset.id;
          const assetDivImgCol = document.createElement('div');
          assetDivImgCol.classList.add('col-xs-12');
          assetDivImgCol.classList.add('asset-div-img-col');
          const assetDivButtonCol = document.createElement('div');
          assetDivButtonCol.classList.add('col-xs-12');
          assetDivButtonCol.classList.add('asset-div-button-col');
          // const assetName = document.createElement('a');
          // assetName.innerText = asset.displayName;
          const imgLink = document.createElement('a');
          const assetImg = new Image(100, 100);
          assetImg.src = asset.thumbnailUrl;
          assetImg.classList.add('asset-img');
          imgLink.href = environment === 'production' ? `https://dropar.herokuapp.com/?#!assets/${asset.id}` : `http://localhost:8080/?#!assets/${asset.id}`

          // const nextAssetButton = document.createElement('button');
          // nextAssetButton.id = 'toggle-asset-button';
          // nextAssetButton.innerText = 'next asset'
          // asset.id + 1 === resData.length - 1 ? nextAssetButton.assetId = asset.id : nextAssetButton.assetId = asset.id + 1;
          // const prevAssetButton = document.createElement('button');
          // prevAssetButton.id = 'toggle-asset-button';
          // prevAssetButton.innerText = 'previous asset'
          // asset.id - 1 === 0 ? prevAssetButton.assetId = asset.id : prevAssetButton.assetId = asset.id - 1;

          // assetDiv.appendChild(nextAssetButton);
          // assetDiv.appendChild(prevAssetButton);


          const assetAddToUserButton = document.createElement('button');
          imgLink.appendChild(assetImg);
          assetDivImgCol.appendChild(imgLink);

          assetAddToUserButton.classList.add('btn-default');
          assetAddToUserButton.classList.add('btn');
          assetAddToUserButton.classList.add('add-asset-button');
          assetAddToUserButton.innerText = 'Add to my assets';
          assetAddToUserButton.id = 'add-to-assets-button';
          assetAddToUserButton.assetId = asset.id;
          assetDivButtonCol.appendChild(assetAddToUserButton);

          assetDiv.addEventListener('click', (evt) => {
            if (evt.target === nextAssetButton || evt.target === prevAssetButton){
              viewAsset.insertBefore(apiAssets[evt.target.assetId], viewAsset.childNodes[0]);
            }
            if (evt.target === assetAddToUserButton) {
              fetch('api/assets/addToUser', {
                method: "POST",
                body: JSON.stringify({
                  id: event.target.assetId
                }),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              })
              .then(() => {
                const publicAssets = document.getElementsByClassName("public-asset");
                const publicAssetsArr = Array.prototype.slice.call(publicAssets);
                let toAdd;
                for (let i = 0; i < publicAssetsArr.length; i++) {
                  if (publicAssetsArr[i].publicAssetId == asset.id) {
                    toAdd = publicAssetsArr[i];
                  }
                }
                const toAddCopy = toAdd.cloneNode(true);
                const addCopyButtonDiv = toAddCopy.lastChild;
                const buttonToChange = addCopyButtonDiv.lastChild;
                buttonToChange.innerText = "Remove";
                buttonToChange.removeEventListener;

                const userAssets = document.getElementById('user-assets');
                userAssets.appendChild(toAddCopy);

                buttonToChange.addEventListener('click', evt => {
                  fetch('api/assets/removeFromUser', {
                    method: "PUT",
                    body: JSON.stringify({
                      id: event.target.assetId
                    }),
                    headers: {
                      "Content-Type": "application/json; charset=utf-8"
                    }
                  })
                  .then(() => {
                    toAddCopy.style.display = "none";
                  })
                })
              })
            // } else if (evt.target === nextAssetButton || evt.target === prevAssetButton){
            //     if (environment === 'production') {
            //       window.location.href = `https://dropar.herokuapp.com/?#!assets`;
            //     }
            //     else {
            //       window.location.href = `http://localhost:8080/?#!assets`;
            //     }
            } else {
              if (environment === 'production') {
                window.location.href = `https://dropar.herokuapp.com/?#!assets/${asset.id}`;
              }
              else {
                window.location.href = `http://localhost:8080/?#!assets/${asset.id}`;
              }
            }
          })
          // assetDiv.appendChild(assetName);
          assetDiv.appendChild(assetDivImgCol);
          assetDiv.appendChild(assetDivButtonCol);

          apiAssets.appendChild(assetDiv);
      })
      //const apiAssetsArr = [apiAssets];
      //console.log(apiAssetsArr[0].children[0])
      assetGlobalDiv.appendChild(apiAssets);
      //viewAsset.appendChild(apiAssets[0]);
      //assetGlobalDiv.appendChild(viewAsset)
    })


  },
  buttonListeners: () => {
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const logOutButton = document.getElementById('asset-log-out-button');
    logOutButton.addEventListener('click', evt => {
      evt.preventDefault();
      if (window.user) {
        fetch('/auth/logout', {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        })
        .then(() => {
          window.user = null;
          if (environment === 'production') {
            window.location.href = `https://dropar.herokuapp.com/?#!login`;
          }
          else {
            window.location.href = `http://localhost:8080/?#!login`;
          }
        })
      }
      else {
        if (environment === 'production') {
          window.location.href = `https://dropar.herokuapp.com/?#!login`;
        }
        else {
          window.location.href = `http://localhost:8080/?#!login`;
        }
      }
    });
    const uploadButton = document.getElementById('asset-upload-button');
    uploadButton.addEventListener('click', evt => {
      evt.preventDefault();
      console.log('button clicked');
      if (environment === 'production') {
        window.location.href = `https://dropar.herokuapp.com/?#!upload`;
      }
      else {
        window.location.href = `http://localhost:8080/?#!upload`;
      }
    })
  }
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


