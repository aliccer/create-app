import {
  createRequestConstants,
  createActions,
  createRequestReducer,
  createRequestWatcher,
} from '../../utils/redux';

export const constants = createRequestConstants('todos', 'update');
export const actions = createActions(constants);

export const watcher = createRequestWatcher(constants, actions, {
  endpoint: '/todos/:id',
  method: 'put',
});

export default createRequestReducer(constants);
