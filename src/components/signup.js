const axios = require('axios');

module.exports = {
  submitSignUpForm: () => {
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const error = document.getElementById('error-message');
    error.innerText = '';
    const submitButton = document.getElementById('signup-submit');
    const loginButton = document.getElementById('signup-form-footer-login-button');
    const signUpButton = document.getElementById('signup-form-footer-signup-button');
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

          // axios.post('auth/signup', {
          //   name: name.value,
          //   email: email.value,
          //   password: password.value
          // })

          fetch('auth/signup', {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
              name: name.value,
              email: email.value,
              password: password.value
            })
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
    });
    loginButton.addEventListener('click', event => {
      event.preventDefault();
      if (environment === 'production') {
        window.location.href = 'https://dropar.herokuapp.com/?#!login'
      }
      else window.location.href = 'http://localhost:8080/?#!login';
    })

    signUpButton.addEventListener('click', event => {
      event.preventDefault();
      if (environment === 'production') {
        window.location.href = 'https://dropar.herokuapp.com/?#!signup'
      }
      else window.location.href = 'http://localhost:8080/?#!signup';
    })
  }
}
