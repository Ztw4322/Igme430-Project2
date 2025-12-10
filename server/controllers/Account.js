const bcrypt = require('bcrypt');
const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Handle a user trying to log in
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // Check if both fields are filled
  if (!username || !pass) {
    return res.status(400).json({ error: 'All Fields are required!' });
  }

  // Check username and password against the database
  return Account.authenticate(username, pass, (err, account) => {
    // If login fails
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong Username or password!' });
    }

    req.session.account = Account.toAPI(account);

    // Redirect the user to the main app area
    return res.json({ redirect: '/maker' });
  });
};

// Handle a user trying to create a new account
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`; // Password confirmation
  const prem = req.body.premium;

  // Check for missing fields
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All Fields are required!' });
  }

  // Check if passwords match
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    // Hash the password for security
    const hash = await Account.generateHash(pass);
    // Create and save the new account in the database
    const newAccount = new Account({ username, password: hash, premium: prem });
    await newAccount.save();
  } catch (err) {
    console.log(err);
    // Handle case where username already exists
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
  }
  // Success: Redirect the new user
  return res.json({ redirect: '/maker' });
};

// Allow a user to change their password
const UpdatePassword = async (req, res) => {
  const username = req.body.user;
  const pass = req.body.oldPass;
  const newpass = req.body.newPass;

  // Find the user's account in the database
  const music = await Account.findOne({ username }).exec();

  // Verify the old password is correct
  if (!bcrypt.compare(pass, music.password)) {
    return res.status(400).json({ error: 'Not correct password' });
  }

  // Hash the new password and save it
  music.password = await Account.generateHash(newpass);
  await music.save();
  // Success
  return res.json({ redirect: '/maker' });
};

// Allow a user to change their username
const UpdateUser = async (req, res) => {
  const username = req.body.user;
  const newusername = req.body.newuser;
  const pass = req.body.password;

  // Find the user's account in the database
  const music = await Account.findOne({ username }).exec();

  // Verify the current password is correct
  if (!bcrypt.compare(pass, music.password)) {
    return res.status(400).json({ error: 'Not correct password' });
  }

  // Update the username and save it
  music.username = newusername;
  await music.save();
  return res.json({ redirect: '/maker' });
};

// Fetch the user's premium status
const getPrem = async (req, res) => {
  try {
    // Look up the account by ID from the current session
    const account = await Account.findById(req.session.account._id);
    const prem = account.premium;
    // Send back the status
    return res.json({ prem });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error' });
  }
};

module.exports = {
  loginPage,
  login,
  signup,
  logout,
  UpdatePassword,
  UpdateUser,
  getPrem,
};
