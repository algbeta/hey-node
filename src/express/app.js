const express = require('express');
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

app.use('/', router);

module.exports = app;
