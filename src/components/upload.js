const axios = require('axios')

module.exports = {
  uploadForm: () => {
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const submitButton = document.getElementById('upload-submit');
    console.log('upload function running');
    submitButton.addEventListener('click', event => {
      event.preventDefault();
      console.log('upload button clicked HOPEFULLY NOT TWICE');
      const displayName = document.getElementById('displayName');
      const assetUrl = document.getElementById('assetUrl');
      const thumbnailUrl = document.getElementById('thumbnailUrl');

      //upload post request
      try {
        fetch.post(`/api/users/${window.user.id}/assets`, {
          displayName: displayName.value,
          authorName: window.user.name,
          assetUrl: assetUrl.value,
          thumbnailUrl: thumbnailUrl.value
        })
        .then((res) => {
          console.log('asset', res.data);
          console.log('asset posted');
          if (environment === 'production') {
            window.location.href = 'https://dropar.herokuapp.com/?#!userAssets'
          }
        })
      }
      catch(err) {
        console.error(err);
      }
    })
  }
}
