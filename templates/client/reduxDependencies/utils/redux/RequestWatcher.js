/* eslint-disable no-cond-assign */
/* eslint-disable no-param-reassign */
import { take, fork } from 'redux-saga/effects';
import manageResponse from './ManageResponse';
import api from '../callApi';


function reduceApiData(endpoint, payload, method = 'get') {
  let result = endpoint;
  let res;
  const regexp = /(?:\\:([A-z]\w+))/g;

  while (res = regexp.exec(endpoint)) {
    result = result.replace(res[0], payload[res[1]]);
    delete payload[res[1]];
  }

  if (method === 'get') {
    payload = {};
  }

  return {
    endpoint: result,
    payload,
  };
}

export default function (constants, actions, {
  endpoint,
  options,
  method,
}) {
  return function* watcher() {
    while (true) {
      const { payload } = yield take(constants.SEND);

      const {
        endpoint: resultEndpoint,
        payload: resultPayload,
      } = reduceApiData(endpoint, payload, method);

      yield fork(
        manageResponse,
        actions,
        api(resultEndpoint, options, method),
        resultPayload,
      );
    }
  };
}
