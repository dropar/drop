const axios = require('axios')

module.exports = {
  getAllAssets: async () => {
    const isGLTF = asset => {
        console.log(`asset -->`,asset);
        console.log(`asset.format.filter --->`,asset.formats.filter(format => format.formatType === "GLTF"));
        return(asset.formats.filter(format => format.formatType === "GLTF").length > 0)}
    const isLowPoly = asset => (asset.formats.filter(asset => asset.formatComplexity.triangleCount < 100000).length > 0);
    const assetUrlFilter = asset => asset.formats.filter(asset => asset.formatType === "GLTF")[0].root.url
    let validAssets = [];
    try {
      const res = await axios.get
      ('https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4');

      const allAssetsFromAPI = res.data.assets;

      allAssetsFromAPI.forEach(asset => {
        console.log(isGLTF(asset))
        if(isGLTF(asset) && isLowPoly(asset)) {
          validAssets.push({
          displayName: asset.displayName,
          authorName: asset.authorName,
          thumbnailUrl: asset.thumbnail.url,
          id: asset.name,
          assetUrl: assetUrlFilter(asset)
          })
        }
    })
    console.log(`valid assets --->`, validAssets)
      let allAssetsView = document.getElementById('all-assets-view');

      validAssets.forEach(asset => {
        let newDiv = document.createElement('div')

        let assetThumbnail = document.createElement('img')
            assetThumbnail.setAttribute('src', `${asset.thumbnailUrl}`)

        let displayName = document.createTextNode(`${asset.displayName}`)
        // ('h4')
            // displayName.setAttribute('id', 'display-name')
            // document.getElementById('display-name').innerHTML = `${asset.displayName}`

        let authorName = document.createTextNode(`by ${asset.authorName}`)
        // ('h2')
            // authorName.setAttribute('id', 'author-name')
            // document.getElementById('author-name').innerHTML = `by ${asset.authorName}`

        newDiv.appendChild(displayName)
        newDiv.appendChild(assetThumbnail)
        newDiv.appendChild(authorName)

        allAssetsView.appendChild(newDiv);
        });


    } catch (error) {
        console.error(error)
    }
  }
}
