const bcrypt = require('bcrypt');
const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All Fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong Username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  const prem = req.body.premium;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All Fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash, premium: prem });
    await newAccount.save();
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
  }
  return res.json({ redirect: '/maker' });
};

const UpdatePassword = async (req, res) => {
  const username = req.body.user;
  const pass = req.body.oldPass;
  const newpass = req.body.newPass;
  const music = await Account.findOne({ username }).exec();

  if (!bcrypt.compare(pass, music.password)) {
    return res.status(400).json({ error: 'Not correct password' });
  }

  music.password = await Account.generateHash(newpass);
  await music.save();
  return res.json({ redirect: '/maker' });
};

const UpdateUser = async (req, res) => {
  const username = req.body.user;
  const newusername = req.body.newuser;
  const pass = req.body.password;

  const music = await Account.findOne({ username }).exec();

  if (!bcrypt.compare(pass, music.password)) {
    return res.status(400).json({ error: 'Not correct password' });
  }

  music.username = newusername;
  await music.save();
  return res.json({ redirect: '/maker' });
};

const getPrem = async (req, res) => {
  try {
    const account = await Account.findById(req.session.account._id);
    const prem = account.premium;
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
