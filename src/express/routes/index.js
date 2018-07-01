const path = require('path');
const usersRoutes = require('./users');
const productRoutes = require('./products');

module.exports = (router, passport) => {
  usersRoutes(router, passport);
  productRoutes(router);

  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });

  router.get('*', (req, res) => {
    res.sendStatus(404);
  });
};
