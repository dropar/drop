module.exports = {
  runSplash : () => {
    const environment = window.location.href.startsWith('http://localhost:8080') ? 'development' : 'production';
    const loginButton = document.getElementById('footer-login-button');
    const signUpButton = document.getElementById('footer-signup-button');

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
