const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getDomos', mid.requireLogin, controllers.Music.getMusics);

  app.get('/login', mid.requiresSecure, mid.requireLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requireLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requireLogout, controllers.Account.signup);

  app.get('/logout', mid.requireLogin, controllers.Account.logout);

  app.get('/maker', mid.requireLogin, controllers.Music.makerPage);
  app.post('/maker', mid.requireLogin, controllers.Music.makeMusic);

  app.get('/', mid.requiresSecure, mid.requireLogout, controllers.Account.loginPage);
};

module.exports = router;
