const axios = require('axios')

module.exports = {
  uploadForm: () => {
    console.log('function run');
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const submitButton = document.getElementById('upload-submit');
    submitButton.addEventListener('click', event => {
      event.preventDefault();
      console.log('upload button clicked');
      const displayName = document.getElementById('displayName');
      const authorName = window.user.name;
      const assetUrl = document.getElementById('assetUrl');
      const thumbnailUrl = document.getElementById('thumbnailUrl');

      //upload post request
      try {
        axios.post(`/api/users/${window.user.id}/assets`, {
          displayName, authorName, assetUrl, thumbnailUrl
        })
        .then(() => {
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
