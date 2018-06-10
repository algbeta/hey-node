const express = require('express');
const app = express();

const cookieMiddleware = require('./middlewares/cookie-parser');
const queryMiddleware = require('./middlewares/query-parser');

app.use(cookieMiddleware);
app.use(queryMiddleware);

app.get('/', function (req, res) {
  res.send('hello world');
});

module.exports = app;

