const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');
const { useState } = React;

const handleLogin = (e) => {
  e.preventDefault();
  helper.hideError();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;

  if (!username || !pass) {
    helper.handleError('Username or password is Empty!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass });
  return false;
};

const handleSignup = (e) => {
  e.preventDefault();
  helper.hideError();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;
  const pass2 = e.target.querySelector('#pass2').value;
  const premium = e.target.querySelector('#premium').checked;
  if (!username || !pass || !pass2) {
    helper.handleError('All fields are required!');
    return false;
  }

  if (pass !== pass2) {
    helper.handleError('Passwords do not match!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass, pass2, premium});

  return false;
};

const LoginWindow = (props) => {
  return (
    <form id="loginForm"
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm">
      <label htmlFor="username">Username: </label>
      <input type="text" id='user' name='username' placeholder='username' />
      <label htmlFor="pass">Password: </label>
      <input type="text" id='pass' name='pass' placeholder='password' />
      <input type="submit" value="Sign in" className='formSubmit' />
      <p id='echoMessage' className='hidden'>All Fields Required!</p>
    </form>
  );
};



const SignupWindow = (props) => {
  const [agreed, setAgreed] = useState(false);

  const handleChange = (event) => {
    setAgreed(event.target.checked);
  };


  return (
    <form id="signupForm"
      name="signupForm"
      onSubmit={handleSignup}
      action="/signup"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id='user' type="text" name='username' placeholder='username' />
      <label htmlFor="pass">Current Password: </label>
      <input id='pass' type="password" name='pass' placeholder='password' />
      <label htmlFor="pass2">New Password: </label>
      <input id='pass2' type="password" name='pass2' placeholder='retype password' />
      <label htmlFor="pass2">Premium: </label>
      <input id='premium' type="checkbox" name='premium' checked={agreed} onChange={handleChange}/>
      <input type="submit" value="Sign Up" className='formSubmit' />
      <p id='echoMessage' className='hidden'>All Fields Required!</p>
    </form>
  );
};


const init = () => {
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');

  const root = createRoot(document.getElementById('content'));

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    root.render(<LoginWindow />);
    return false;
  });

  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    root.render(<SignupWindow />);
    return false;
  });

  root.render(<LoginWindow />);
};

window.onload = init;
