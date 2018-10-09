module.exports = {
  uploadForm: () => {
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const form = document.getElementById('upload-form');
    const formRow = document.getElementById('upload-row');
    const loginButton = document.getElementById('upload-form-footer-login-button');
    const backToAssets = document.getElementById('back-to-assets-button');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const displayName = document.getElementById('displayName');
      const assetUrl = document.getElementById('assetUrl');
      const thumbnailUrl = document.getElementById('thumbnailUrl');

      const body = JSON.stringify({
        displayName: displayName.value,
        authorName: window.user.name,
        assetUrl: assetUrl.value,
        thumbnailUrl: thumbnailUrl.value
      });

      console.log(body);

      //upload post request
      try {
        fetch(`/api/users/${window.user.id}/assets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: body
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
    loginButton.addEventListener('click', event => {
      event.preventDefault();
      if (environment === 'production') {
        window.location.href = 'https://dropar.herokuapp.com/?#!login'
      }
      else window.location.href = 'http://localhost:8080/?#!login';
    })

    backToAssets.addEventListener('click', event => {
      event.preventDefault();
      if (environment === 'production') {
        window.location.href = 'https://dropar.herokuapp.com/?#!assets'
      }
      else window.location.href = 'http://localhost:8080/?#!assets';
    })
  }
}
