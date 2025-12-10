const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getMusics', mid.requireLogin, controllers.Music.getMusics);

  app.get('/login', mid.requiresSecure, mid.requireLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requireLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requireLogout, controllers.Account.signup);

  app.get('/logout', mid.requireLogin, controllers.Account.logout);

  app.get('/maker', mid.requireLogin, controllers.Music.makerPage);
  app.post('/maker', mid.requireLogin, controllers.Music.makeMusic);

  app.post('/pass', mid.requireLogin, controllers.Account.UpdatePassword);
  app.post('/user', mid.requireLogin, controllers.Account.UpdateUser);

  app.post('/toggleListen', mid.requireLogin, controllers.Music.toggleListen);
  app.get('/', mid.requiresSecure, mid.requireLogout, controllers.Account.loginPage);
  app.get('/prem', mid.requireLogin, controllers.Account.getPrem);

  app.use((req, res) => res.redirect('/'));
};

module.exports = router;
