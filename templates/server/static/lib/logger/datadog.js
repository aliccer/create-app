/* eslint-disable camelcase */
const filter = require('lodash/filter');
const castArray = require('lodash/castArray');
const axios = require('axios');
const util = require('util');


class Datadog {
  constructor(options = {}) {
    this.options = {
      apiVersion: 'v1',
      apiBaseUrl: 'https://api.datadoghq.com',
      ...options,
    };

    if (!this.options.api_key || !this.options.application_key) {
      throw new Error('Application and Api keys required.');
    }

    if (!this.options.name) {
      throw new Error('Application name required.');
    }
  }

  send({
    alert_type = 'info', title, text, tags,
  } = {}) {
    const {
      name,
      apiVersion,
      apiBaseUrl,
      disabled,
      tags: initialTags,
      api_key,
      application_key,
    } = this.options;
    if (disabled) return Promise.resolve();
    // eslint-disable-next-line no-param-reassign
    tags = filter([
      ...castArray(initialTags),
      ...castArray(tags),
    ], val => typeof val === 'string')
      .map(item => `${name}:${item}`);

    const axiosOptions = {
      baseURL: apiBaseUrl,
      url: util.format('/api/%s%s', apiVersion, '/events'),
      method: 'POST',
      data: {
        title: typeof title === 'string' ? title : alert_type.toUpperCase(),
        alert_type,
        text,
        tags,
      },
      params: {
        api_key,
        application_key,
      },
      timeout: 3000,
    };

    return axios(axiosOptions)
      .then(() => true)
      .catch((err) => {
        global.console.log(err);
        return false;
      });
  }
}


module.exports = Datadog;
