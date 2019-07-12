/* eslint-disable global-require */
/**
 * Export constants here
 */

const constants = {
  HTTP_CODES: require('./httpCode'),
  EVENTS: require('./events'),
  MESSAGES: require('./messages'),
};

module.exports = constants;
