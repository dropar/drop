// const axios = require('axios')

// module.exports = {
//   getAllAssets: async () => {
//     // const isGLTF = asset => (asset.formats.filter(format => format.formatType === "GLTF").length > 0)
//     // const assetUrlFilter = asset => asset.formats.filter(asset => asset.formatType === "GLTF")[0].root.url
//     // let validAssets = [];

//     // try {
//     //   const res = await axios.get
//     //   ('https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM');

//     //   const allAssetsFromAPI = res.data.assets;

//     //   allAssetsFromAPI.forEach(asset => {
//     //     if(isGLTF(asset)) {
//     //       validAssets.push({
//     //         displayName: asset.displayName,
//     //         authorName: asset.authorName,
//     //         thumbnailUrl: asset.thumbnail.url,
//     //         googleApiId: asset.name,
//     //         assetUrl: assetUrlFilter(asset),
//     //         category: 'N/A'
//     //       })
//     //     }
//     // })





//     // try {
//     //     Promise.all(validAssets)
//     //     .then(values => {
//     //         values.map(async asset => {
//     //             await fetch('/api/assets', {
//     //                 method: 'POST',
//     //                 headers: {
//     //                     "Content-Type": "application/json; charset-utf8"
//     //                 },
//     //                 body: JSON.stringify(asset);
//     //             })
//     //             if (environmeent === 'production') {
//     //                 window.location.href = "https://dropar.herokuapp.com"
//     //             }
//     //         })
//     //     })
//     // } catch (error) {
//     //        console.error(error)
//     //     }








// //////CHANGE AXIOS TO FETCH

//     console.log(`valid assets --->`, validAssets)
//       let allAssetsView = document.getElementById('all-assets-view');

//       validAssets.forEach(asset => {
//         let newDiv = document.createElement('div')

//         let assetThumbnail = document.createElement('img')
//             assetThumbnail.setAttribute('src', `${asset.thumbnailUrl}`)
//             assetThumbnail.setAttribute('class', 'asset-thumbnail')

//         let displayName = document.createTextNode(`${asset.displayName}`)
//         // ('h4')
//             // displayName.setAttribute('id', 'display-name')
//             // document.getElementById('display-name').innerHTML = `${asset.displayName}`

//         let authorName = document.createTextNode(` by ${asset.authorName}`)
//         // ('h2')
//             // authorName.setAttribute('id', 'author-name')
//             // document.getElementById('author-name').innerHTML = `by ${asset.authorName}`

//         newDiv.appendChild(assetThumbnail)
//         newDiv.appendChild(displayName)
//         newDiv.appendChild(authorName)

//         allAssetsView.appendChild(newDiv);
//         });


