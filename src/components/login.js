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

        if (environment === 'production') {
          window.location.href = 'https://dropar.herokuapp.com/?#!userAssets'
        }
        else window.location.href = 'http://localhost:8080/?#!userAssets'
      }
      catch(err) {
        console.error(err);
      }
    });
  }
}

