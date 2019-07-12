/*
 * Function that transforms string action constants like this:
 * const HELLO = 'module/sub-module/HELLO'
 * const DEAR_ACTION = 'module/sub-module/DEAR_ACTION'
 *
 * into object with camel-cased keys of action creators like this:
 * {
 *   hello: createAction('module/sub-module/HELLO'),
 *   dearAction: createAction('module/sub-module/DEAR_ACTION'),
 * }
 * */
import { createAction } from 'redux-actions';
import camelCase from 'lodash/camelCase';

const createActions = constants => Object.keys(constants).reduce((acc, action) => {
  Object.defineProperty(acc, camelCase(action), {
    value: createAction(constants[action]),
    enumerable: true,
  });
  return acc;
}, {});

export default createActions;
