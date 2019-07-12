import get from 'lodash/get';
import { takeEvery, put } from 'redux-saga/effects';
import { constants as todosConstants } from './list';
import { constants as removeConstants } from './remove';
import { constants as createConstants } from './create';
import { constants as editConstants } from './edit';
import { ADD_TODO, REMOVE_TODO, EDIT_TODO } from '../../constants';


function* editTodoSaga({ payload }) {
  yield put({
    type: todosConstants[EDIT_TODO],
    payload,
  });
}

function* createTodoSaga({ payload }) {
  yield put({
    type: todosConstants[ADD_TODO],
    payload,
  });
}

function* removeTodoSaga({ payload }) {
  yield put({
    type: todosConstants[REMOVE_TODO],
    payload: get(payload, 'ids', []),
  });
}


export default function* root() {
  yield takeEvery(editConstants.SUCCEED, editTodoSaga);
  yield takeEvery(createConstants.SUCCEED, createTodoSaga);
  yield takeEvery(removeConstants.SUCCEED, removeTodoSaga);
}
