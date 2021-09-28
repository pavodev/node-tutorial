/* eslint-disable */

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      alert('Successful login!');
      window.setTimeout(() => {
        location.assign('/');
      }, 15);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault(); // prevents the form to load any page

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});
