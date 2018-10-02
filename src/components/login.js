const axios = require('axios');

module.exports = {
  submitLoginForm: () => {
    console.log('login page inside');
    const submitButton = document.getElementById('login-submit');

    const email = document.getElementById('email');
    console.log('email', email);

    console.log("submit-button", submitButton);

    submitButton.addEventListener('click', event => {
      event.preventDefault();
      console.log('submitted');
      // const email = document.getElementById('email');
      const password = document.getElementById('password');

      console.log(email.value, password.value);
      //login post request
      axios.post('/login', {
        email: email.value,
        password: password.value
      });
    });
  }
}

