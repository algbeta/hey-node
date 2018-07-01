const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const app = express();
const passport = require('passport');
const session = require('express-session');
const router = express.Router();

require('./passport-setup')(passport);
require('./routes')(router, passport);

app.use(express.json());
app.use(session({ secret: 'sessionsecret' }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(`${config.mongodbUrl}/${config.mongodbName}`);

app.use('/', router);

module.exports = app;
