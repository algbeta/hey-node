const verifyTokenMiddleware = require('../middlewares/verify-token');
const ProductModel = require('../mgs-models/product');

module.exports = (router) => {
  router.get('/products', verifyTokenMiddleware, (req, res) => {
    ProductModel.find({}).then(products => {
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
      const newProduct = new ProductModel(product);
      newProduct.save().then(() => {
        res.json(newProduct);
      }).catch((err) => {
        res.sendStatus(500);
        console.log(err && err.message);
      });
    }
  });

  router.get('/products/:id', verifyTokenMiddleware, (req, res) => {
    ProductModel.find({ _id: req.params.id }).then(product => {
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

  router.delete('/products/:id', verifyTokenMiddleware, (req, res) => {
    ProductModel.findByIdAndRemove(req.params.id).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
  });
};
