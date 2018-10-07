module.exports = {
  getAllAssets: () => {
    const assetGlobalDiv = document.getElementById('all-assets');
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const allAssets = fetch(`api/assets`,
    {method: "GET"}).then((response) =>
      response.json())
      .then((resData) => {
        console.log('all assets result',resData)
        resData.forEach((asset) => {
        const allAssetDiv = document.createElement('div');
        allAssetDiv.id = 'one-asset'
        allAssetDiv.addEventListener('click', () => {
          if (environment === 'production'){
            window.location.href = `https://dropar.herokuapp.com/?#!assets/${asset.id}`
          } else {
            window.location.href = `http://localhost:8080/?#!assets/${asset.id}`
          }});
        const allAssetName = document.createElement('a');
        allAssetName.innerText = asset.displayName;
        const allAssetImg = new Image(100, 100);
        allAssetImg.src = asset.thumbnailUrl;
        allAssetDiv.appendChild(allAssetName);
        allAssetDiv.appendChild(allAssetImg);
        assetGlobalDiv.appendChild(allAssetDiv)
      })
    })
  },
  getAllAssetsCategory: (category) => {
    const assetGlobalDiv = document.getElementById('all-assets');
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    fetch(`/api/assets/${category}`,
    {
      method: "GET"
    })
    .then((response) =>
      response.text())
      .then((resData) => {
        console.log('all assets result',resData)
        resData.forEach((asset) => {
        const allAssetDiv = document.createElement('div');
        allAssetDiv.id = 'one-asset'
        allAssetDiv.addEventListener('click', () => {
          if (environment === 'production'){
            window.location.href = `https://dropar.herokuapp.com/?#!assets/${asset.id}`
          } else {
            window.location.href = `http://localhost:8080/?#!assets/${asset.id}`
          }});
        const allAssetName = document.createElement('a');
        allAssetName.innerText = asset.displayName;
        const allAssetImg = new Image(100, 100);
        allAssetImg.src = asset.thumbnailUrl;
        allAssetDiv.appendChild(allAssetName);
        allAssetDiv.appendChild(allAssetImg);
        assetGlobalDiv.appendChild(allAssetDiv)
      })
    })
  }
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
