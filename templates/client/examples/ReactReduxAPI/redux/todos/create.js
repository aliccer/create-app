import {
  createRequestConstants,
  createActions,
  createRequestReducer,
  createRequestWatcher,
} from '../../utils/redux';

export const constants = createRequestConstants('todos', 'create');
export const actions = createActions(constants);

export const watcher = createRequestWatcher(constants, actions, {
  endpoint: '/todos',
  method: 'post',
});

export default createRequestReducer(constants);
