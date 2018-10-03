const axios = require('axios');

module.exports = {
  submitSignUpForm: () => {
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const error = document.getElementById('error-message');
    error.innerText = '';
    const submitButton = document.getElementById('signup-submit');
    submitButton.addEventListener('click', event => {
      event.preventDefault();
      const name = document.getElementById('fullName');
      const email = document.getElementById('signupEmail');
      const password = document.getElementById('signupPassword');
      const confirmPassword = document.getElementById('confirmSignupPassword');

      //check to see if passwords match
      if (password.value !== confirmPassword.value) {
        error.innerText = 'Passwords must match!'
        return;
      }
      else {
        try {
          //if passwords match, proceed to signup post request
          axios.post('auth/signup', {
            name: name.value,
            email: email.value,
            password: password.value
          })
          .then(() => {
            if (environment === 'production') {
              window.location.href = 'https://dropar.herokuapp.com/?#!login'
            }
            else window.location.href = 'http://localhost:8080/?#!login'
          })
        }
        catch(err) {
          console.error(err);
        }
      }
    })
  }
}
