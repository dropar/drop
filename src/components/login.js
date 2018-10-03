const axios = require('axios');

module.exports = {
  submitLoginForm: () => {
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const submitButton = document.getElementById('login-submit');
    submitButton.addEventListener('click', event => {
      event.preventDefault();
      const email = document.getElementById('email');
      const password = document.getElementById('password');

      //login post request
      try {
        axios.post('/auth/login', {
          email: email.value,
          password: password.value
        })
        .then(res => {
          window.user = res.data;
          console.log('user', window.user);
          if (environment === 'production') {
            window.location.href = 'https://dropar.herokuapp.com/?#!userAssets'
          }
          else window.location.href = 'http://localhost:8080/?#!userAssets'
        })

      }
      catch(err) {
        console.error(err);
      }
    });
  }
}

