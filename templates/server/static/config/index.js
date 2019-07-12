/* eslint-disable import/no-dynamic-require */
const assign = require('lodash/assign');

const env = process.env.NODE_ENV || 'development';
const environmentConfig = require(`./${env}`);
const defaultConfig = {
  env,
  port: process.env.PORT || 8000,
  isProduction: env === 'production',
};

module.exports = assign({}, defaultConfig, environmentConfig);
