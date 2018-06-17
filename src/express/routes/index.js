const jwt = require('jsonwebtoken');
const path = require('path');
const uuidv1 = require('uuid/v1');
const userData = require('../../../data/users.json');
const config = require('../../config');
const verifyTokenMiddleware = require('../middlewares/verify-token');

const data = {
  users: [
    {
      id: 'natallia',
      name: 'natallia',
      status: 'admin'
    },
    {
      id: 'alex',
      name: 'alex',
      status: 'reader'
    }
  ],
  reviews: [
    {
      id: 1,
      productId: 1,
      text: 'very good and cheap'
    },
    {
      id: 2,
      productId: 2,
      text: 'was delivered in a bad state'
    },
    {
      id: 3,
      productId: 1,
      text: 'suggest to anyone!'
    }
  ],
  products: [
    {
      id: 1,
      name: 'sugar',
      type: 'white'
    },
    {
      id: 2,
      name: 'cinammon sugar',
      type: 'brown'
    }
  ]
};

module.exports = (router, passport) => {
  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });

  router.post('/auth', (req, res) => {
    const { login, password } = req.body;
    const user = userData.users.find(
      item => item.login === login && item.password === password
    );

    if (user) {
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

  router.get('/auth/twitter/callback', )

  router.get('/users', verifyTokenMiddleware, (req, res) => {
    res.json({
      users: data.users
    });
  });

  router.get('/products', verifyTokenMiddleware, (req, res) => {
    res.json({
      products: data.products
    });
  });

  router.post('/products', (req, res) => {
    const product = req.body;
    if (!product) {
      res.sendStatus('400');
    } else {
      product.id = uuidv1();
      data.products.push(product);
      res.json(product);
    }
  });

  router.get('/products/:id', verifyTokenMiddleware, (req, res) => {
    const product = data.products.find(item => item.id == req.params.id); // eslint-disable-line eqeqeq
    if (!product) {
      res.send({});
    } else {
      res.send(product);
    }
  });

  router.get('/products/:id/reviews', verifyTokenMiddleware, (req, res) => {
    const reviews = data.reviews.filter(
      item => item.productId == req.params.id
    ); // eslint-disable-line eqeqeq
    if (!reviews) {
      res.send({});
    } else {
      res.send({
        reviews
      });
    }
  });

  router.get('*', (req, res) => {
    res.sendStatus(404);
  });
};
