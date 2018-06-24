const jwt = require('jsonwebtoken');
const path = require('path');
const config = require('../../config');
const verifyTokenMiddleware = require('../middlewares/verify-token');
const db = require('../models');

module.exports = (router, passport) => {
  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });

  router.post('/auth', (req, res) => {
    const { login, password } = req.body;
    db.User.findOne({ where: { login, password } }).then(user => {
      if (user && user.id) {
        const payload = { userId: user.id };
        const token = jwt.sign(payload, config.secret, { expiresIn: 1000 });

        res.json({
          code: 200,
          message: 'OK',
          data: {
            user: {
              email: user.email,
              username: user.username
            }
          },
          token
        });
      } else {
        res.status(404).send({
          code: 404,
          message: 'Not Found'
        });
      }
    }).catch((err) => {
      res.sendStatus(500);
      console.log(err && err.message);
    });
  });

  router.get(
    '/auth/facebook',
    passport.authenticate('facebook')
  );

  router.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/'
    })
  );

  router.get('/auth/twitter', passport.authenticate('twitter'));

  router.get('/users', verifyTokenMiddleware, (req, res) => {
    db.User.findAll().then(users => {
      res.json({
        users
      });
    }).catch((err) => {
      res.sendStatus(500);
      console.log(err && err.message);
    });
  });

  router.get('/products', verifyTokenMiddleware, (req, res) => {
    db.Product.findAll().then(products => {
      res.json({
        products
      });
    }).catch((err) => {
      res.sendStatus(500);
      console.log(err && err.message);
    });
  });

  router.post('/products', (req, res) => {
    const product = req.body;
    if (!product || !product.name) {
      res.sendStatus('400');
    } else {
      const newProduct = db.Product.build(product);
      newProduct.save().then(() => {
        res.json(newProduct);
      }).catch((err) => {
        res.sendStatus(500);
        console.log(err && err.message);
      });
    }
  });

  router.get('/products/:id', verifyTokenMiddleware, (req, res) => {
    db.Product.findOne({ where: { id: req.params.id } }).then(product => {
      if (!product) {
        res.send({});
      } else {
        res.send(product);
      }
    }).catch((err) => {
      res.sendStatus(500);
      console.log(err && err.message);
    });
  });

  router.get('/products/:id/reviews', verifyTokenMiddleware, (req, res) => {
    db.Review.findAll({ where: { productId: req.params.id } }).then(reviews => {
      res.json({
        reviews
      });
    }).catch((err) => {
      res.sendStatus(500);
      console.log(err && err.message);
    });
  });

  router.get('*', (req, res) => {
    res.sendStatus(404);
  });
};
