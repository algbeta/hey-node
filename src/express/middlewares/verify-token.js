const jwt = require('jsonwebtoken');
const config = require('../../config');

const returnError = (res) => {
  res.status(401).send({
    message: 'Not authorized!'
  });
};

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) {
    returnError(res);
  } else {
    jwt.verify(token, config.secret, (err) => {
      if (err) {
        returnError(res);
      } else {
        next();
      }
    });
  }
}

module.exports = verifyToken;
