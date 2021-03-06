const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const config = require('../lib/config');
const {
  Knex,
} = require('../service/database');

module.exports = session({
  secret: config.get('session.secret'),
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: Knex,
  }),
});
