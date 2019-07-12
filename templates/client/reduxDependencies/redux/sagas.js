import { fork } from 'redux-saga/effects';
// watchers
import { watcher as todos } from './todos/list';
import { watcher as createTodo } from './todos/create';
import { watcher as editTodo } from './todos/edit';
import { watcher as removeTodo } from './todos/remove';
import todoSagas from './todos/sagas';

export default function* () {
  yield [
    todos,
    createTodo,
    editTodo,
    removeTodo,
    todoSagas,
  ].map(watcher => fork(watcher));
}
