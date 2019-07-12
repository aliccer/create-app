const pick = require('lodash/pick');
const { logger } = require('./lib');
const CONSTANTS = require('./constants');
const config = require('./config');

//
// Register global variables
// -----------------------------------------------------------------------------
global.log = logger('app', pick(config, 'datadog'));
global.CONSTANTS = CONSTANTS;
