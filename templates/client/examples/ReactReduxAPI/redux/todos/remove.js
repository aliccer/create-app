import {
  createRequestConstants,
  createActions,
  createRequestReducer,
  createRequestWatcher,
} from '../../utils/redux';

export const constants = createRequestConstants('todos', 'remove');
export const actions = createActions(constants);

export const watcher = createRequestWatcher(constants, actions, {
  endpoint: '/todos',
  method: 'delete',
});

export default createRequestReducer(constants);
