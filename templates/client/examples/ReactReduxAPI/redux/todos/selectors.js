import get from 'lodash/get';
import size from 'lodash/size';
import reduce from 'lodash/reduce';
import { createSelector } from 'reselect';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../../constants';

export const isTodosFetched = createSelector(
  state => get(state, 'todos.list.sending'),
  state => get(state, 'todos.list.succeed'),
  (isSending, isSucceed) => isSending === false && isSucceed !== null,
);

export const isUpdated = createSelector(
  state => get(state, 'todos.update.sending'),
  state => get(state, 'todos.update.succeed'),
  (isSending, isSucceed) => isSending === false && isSucceed !== null,
);

export const isCreated = createSelector(
  state => get(state, 'todos.create.sending'),
  state => get(state, 'todos.create.succeed'),
  (isSending, isSucceed) => isSending === false && isSucceed !== null,
);

export const isRemoved = createSelector(
  state => get(state, 'todos.remove.sending'),
  state => get(state, 'todos.remove.succeed'),
  (isSending, isSucceed) => isSending === false && isSucceed !== null,
);

export const getTodos = state => get(state, 'todos.list.list');

const getVisibilityFilter = state => state.todos.visibilityFilter;

export const getVisibleTodos = createSelector(
  [getVisibilityFilter, getTodos],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case SHOW_ALL:
        return todos;
      case SHOW_COMPLETED:
        return todos.filter(t => t.completed);
      case SHOW_ACTIVE:
        return todos.filter(t => !t.completed);
      default:
        throw new Error(`Unknown filter: ${visibilityFilter}`);
    }
  },
);

export const getTodosCount = createSelector(
  [getTodos],
  todos => size(todos) || 0,
);

export const getCompletedTodoIDs = createSelector(
  [getTodos],
  todos => reduce(todos, (acc, todo) => {
    if (todo.completed) {
      acc.push(todo.id);
    }
    return acc;
  }, []),
);

export const getCompletedTodoCount = createSelector(
  [getCompletedTodoIDs],
  completedTodoIds => size(completedTodoIds) || 0,
);
