/* eslint-disable no-console */
import get from 'lodash/get';
import { put, call } from 'redux-saga/effects';
import { isDevelopment } from '../../config';

/**
 * WARNING! This will show alert on each failed response.
 * TODO: change this method to the one that will satisfy the requirements of the application
 */
const handleErrorResponse = (message, description) => {
  // eslint-disable-next-line no-alert
  window.alert(`${message}\n${description}`);
  console.error(message, description);
};

/*
 * The worker that intercepts API HTTP requests. The actions MUST follow such naming convention:
 * const actions = {
 *   succeed,
 *   rejected,
 *   errorEncountered,
 * }
 * The actions itself must be a plain object, contains action creators for
 * `succeed` (>= 200 and < 400 HTTP responses),
 * `rejected` (>= 400 and < 500)
 * and `errorEncountered` actions (for any errors, both server (>= 500) and client) accordingly
 * */

function* manageResponse(actions, api, payload) {
  const { succeed, rejected, errorEncountered } = actions;

  try {
    const response = yield call(api.send, payload);
    const status = get(response, 'data.code', response.status);
    const getEntity = get.bind(null, get(response, 'data'));
    const c = ['data', 'error'].reduce((acc, x) => {
      acc[x] = getEntity(x);
      return acc;
    }, {});

    if (status >= 200 && status < 400) {
      yield put(succeed(c.data));
    } else if (status >= 400 && status < 500) {
      if (isDevelopment) {
        console.warn(status, c.error || get(response, 'statusText'));
      }
      const { description = '', message = '' } = c.error || {};
      const error = { description, message, status };

      handleErrorResponse(message, description);
      yield put(rejected({ error }));
    } else {
      throw response;
    }
  } catch (err) {
    if (isDevelopment) console.error(err);
    handleErrorResponse('', get(err, 'message') || get(err, 'statusText'));

    yield put(errorEncountered(err));
  }
}

export default manageResponse;
