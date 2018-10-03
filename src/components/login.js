const axios = require('axios');

module.exports = {
  submitLoginForm: () => {
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
        })

      }
      catch(err) {
        console.error(err);
      }
    });
  }
}

