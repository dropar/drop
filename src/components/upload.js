const axios = require('axios')

module.exports = {
  uploadForm: () => {
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const submitButton = document.getElementById('upload-submit');
    submitButton.addEventListener('click', event => {
      event.preventDefault();
      const displayName = document.getElementById('displayName');
      const authorName = window.user.name;
      const assetUrl = document.getElementById('assetUrl');
      const thumbnailUrl = document.getElementById('thumbnailUrl');

      //upload post request
      try {
        axios.post(`/users/${window.user.id}/assets`, {
          displayName, authorName, assetUrl, thumbnailUrl
        })
        .then(() => {

        })
      }
      catch(err) {
        console.error(err);
      }
    })
  }
}
