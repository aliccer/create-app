/**
 * HTTP client
 */
const axios = require('axios');

export default (endpoint, options) => axios({
  url: endpoint,
  responseType: 'json',
  method: 'GET',
  ...options,
});
