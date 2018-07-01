const path = require('path');
const usersRoutes = require('./users');
const productRoutes = require('./products');
const cityRoutes = require('./cities');

module.exports = (router, passport) => {
  usersRoutes(router, passport);
  productRoutes(router);
  cityRoutes(router);

  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });

  router.get('*', (req, res) => {
    res.sendStatus(404);
  });
};
