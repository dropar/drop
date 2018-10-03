const axios = require('axios')

module.exports = {
  getAllAssets: async () => {

    try {
      const res = await axios.get
      ('https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4');

      const allAssetsFromAPI = res.data.assets;
      console.log(`res.data.assets--->`,allAssetsFromAPI)

      const allAssetsArray = allAssetsFromAPI.map(asset => ({
        displayName: asset.displayName,
        authorName: asset.authorName,
        thumbnailUrl: asset.thumbnail.url
      }));

      let allAssetsView  = document.getElementById('all-assets-view');

      allAssetsArray.forEach(asset => {
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
