const express = require('express');
const app = express();

const cookieMiddleware = require('./middlewares/cookie-parser');
const queryMiddleware = require('./middlewares/query-parser');
const routes = require('./routes');

app.use(express.json());
app.use(cookieMiddleware);
app.use(queryMiddleware);
app.use('/', routes);

module.exports = app;
