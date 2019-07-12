const { Database } = require('../services');
const { logger } = require('../lib');
const { mongodb } = require('../config');

const log = logger('MongoDB');

module.exports = Database.connect(
  mongodb,
  {
    logSuccess: log.info,
    logError: log.error,
  },
)
  .then(instance => instance.connection);
