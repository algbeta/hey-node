const verifyTokenMiddleware = require('../middlewares/verify-token');
const CityModel = require('../mgs-models/city');

module.exports = (router) => {
  router.get('/cities', verifyTokenMiddleware, (req, res) => {
    CityModel.find({}).then(cities => {
      res.json({
        cities
      });
    }).catch((err) => {
      res.sendStatus(500);
      console.log(err && err.message);
    });
  });

  router.post('/cities', (req, res) => {
    const city = req.body;
    if (!city || !city.name) {
      res.sendStatus(400);
    } else {
      const newCity = new CityModel(city);
      newCity.save().then(() => {
        res.json(newCity);
      }).catch((err) => {
        res.status(500).send({
          code: 500,
          message: err.message
        });
        console.log(err && err.message);
      });
    }
  });

  router.get('/cities/:id', verifyTokenMiddleware, (req, res) => {
    CityModel.findById(req.params.id).then(city => {
      if (!city) {
        res.send({});
      } else {
        res.send(city);
      }
    }).catch((err) => {
      res.status(500).send({
        code: 500,
        message: err.message
      });
      console.log(err && err.message);
    });
  });

  router.delete('/cities/:id', verifyTokenMiddleware, (req, res) => {
    CityModel.findByIdAndRemove(req.params.id).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
  });

  router.put('/cities/:id', verifyTokenMiddleware, (req, res) => {
    const city = req.body;
    CityModel.findByIdAndUpdate(req.params.id, {
      $setOnInsert: {
        name: city.name,
        capital: city.capital,
        country: city.country,
        lastModifiedDate: Date.now()
      }
    }, {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }, (err, result) => {
      res.json(result);
    }).catch(err => {
      res.status(500).send({
        code: 500,
        message: err.message
      });
      console.log(err && err.message);
    });
  });
};
