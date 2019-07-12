import castArray from 'lodash/castArray';
import filter from 'lodash/filter';
import map from 'lodash/map';
import {
  createRequestConstants,
  createActions,
  createRequestReducer,
  createRequestWatcher,
} from '../../utils/redux';
import { ADD_TODO, REMOVE_TODO, EDIT_TODO } from '../../constants';


export const constants = createRequestConstants('todos', 'list', [
  ADD_TODO,
  REMOVE_TODO,
  EDIT_TODO,
]);
export const actions = createActions(constants);

export const watcher = createRequestWatcher(constants, actions, {
  endpoint: '/todos',
});

const requestReducer = createRequestReducer(constants);

const editTodo = (state, payload) => ({
  ...state,
  list: map(state.list, todo => (todo.id === payload.id ? payload : todo)),
});

const addTodo = (state, payload) => ({
  ...state,
  list: [payload, ...state.list],
});

const removeTodos = (state, payload) => {
  const idsToRemove = castArray(payload);
  const list = filter(state.list, todo => idsToRemove.indexOf(todo.id) === -1);

  return {
    ...state,
    list,
  };
};

export default (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case constants[ADD_TODO]: return addTodo(state, payload);
    case constants[REMOVE_TODO]: return removeTodos(state, payload);
    case constants[EDIT_TODO]: return editTodo(state, payload);

    default: return requestReducer(state, action);
  }
};
