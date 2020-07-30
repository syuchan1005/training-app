const debug = require('debug');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'development.sqlite',
    logging: debug('development:db'),
  },
  test: {
    dialect: 'sqlite',
    storage: 'test.sqlite',
  },
  production: {
    dialect: 'sqlite',
    storage: 'production.sqlite',
    logging: debug('production:db'),
  },
};
