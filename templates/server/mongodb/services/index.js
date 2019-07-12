/**
 * Export service (like AWS clients, ElasticSearch client, etc.)
 */
const Database = require('./mongodb');

const services = {
  Database,
};

module.exports = services;
