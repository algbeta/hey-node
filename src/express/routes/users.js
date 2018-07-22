const jwt = require('jsonwebtoken');
const config = require('../../config');
const verifyTokenMiddleware = require('../middlewares/verify-token');
const UserModel = require('../mgs-models/user');

module.exports = (router, passport) => {
  router.post('/auth', (req, res) => {
    const { login, password } = req.body;
    UserModel.findOne({ login, password }).then(user => {
      if (user && user.id) {
        const payload = { userId: user.id };
        const token = jwt.sign(payload, config.secret, { expiresIn: 1000 });

        res.json({
          user: {
            name: user.name,
            login: user.login
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
    UserModel.find({}).then(users => {
      // don't send passwords
      const result = users.map(user => ({
        id: user.id,
        name: user.name,
        login: user.login
      }));
      res.json({
        result
      });
    }).catch((err) => {
      res.sendStatus(500);
      console.log(err && err.message);
    });
  });

  router.delete('/users/:id', verifyTokenMiddleware, (req, res) => {
    UserModel.findByIdAndRemove(req.params.id).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
  });
};
