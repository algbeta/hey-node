const express = require('express');
const uuidv1 = require('uuid/v1');
const router = express.Router();

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

router.get('/users', (req, res) => {
  res.json({
    users: data.users
  });
});

router.get('/products', (req, res) => {
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

router.get('/products/:id', (req, res) => {
  const product = data.products.find(item => item.id == req.params.id); // eslint-disable-line eqeqeq
  if (!product) {
    res.send({});
  } else {
    res.send(product);
  }
});

router.get('/products/:id/reviews', (req, res) => {
  const reviews = data.reviews.filter(item => item.productId == req.params.id); // eslint-disable-line eqeqeq
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

module.exports = router;
