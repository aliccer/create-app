/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { camelizeKeys } from 'humps';
import get from 'lodash/get';
import { isDevelopment } from '../config';
import request from './request';

const allowedMethods = [
  'get',
  'post',
  'delete',
  'options',
  'put',
  'patch',
];

const methodFilter = (method) => {
  const defaultMethod = 'get';
  if (typeof method !== 'string') {
    return defaultMethod;
  }
  method = method.toLowerCase();
  return allowedMethods.indexOf(method) === -1 ? defaultMethod : method;
};

// Fetches an API response and camelize keys of the result JSON.
// This makes every API response have the same shape, regardless of how nested it was.
const api = (endpoint, method, options) => ({
  send(payload) {
    method = methodFilter(method);

    if (isDevelopment) {
      console.group('API Request');
      console.info(`Endpoint: ${endpoint}`);
      console.info('Options:', options || 'No');
      console.info(`Type: ${method.toUpperCase()}`);
      console.groupEnd('API Request');
    }

    const requestConfig = {
      baseURL: '/api',
      url: endpoint,
      ...options,
      method,
      data: payload,
    };

    return request(endpoint, requestConfig)
      .then((response) => {
        const data = get(response, 'data.data');
        return camelizeKeys(data);
      })
      .catch(err => camelizeKeys(err.response));
  },
});

export default api;
