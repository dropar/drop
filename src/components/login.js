module.exports = {
  submitLoginForm: () => {
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const submitButton = document.getElementById('login-submit');
    const loginButton = document.getElementById('login-form-footer-login-button');

    const signUpButton = document.getElementById('login-form-footer-signup-button');

    submitButton.addEventListener('click', event => {
      event.preventDefault();
      const email = document.getElementById('email');
      const password = document.getElementById('password');

      //login post request
        fetch('/auth/login', {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value
          })
        })
        .then(res => {
          return res.json();
        })
        .then(data => {
          window.user = data;
        })
        .then(() => {
          if (environment === 'production') {
            window.location.href = 'https://dropar.herokuapp.com/?#!assets'
          }
          else window.location.href = 'http://localhost:8080/?#!assets'
        })
        .catch(err => {
          const errorMessage = document.getElementById('login-error-message');
          errorMessage.style.visibility = 'visible';
          console.error(err);
        })
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

