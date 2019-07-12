import { combineReducers } from 'redux';
// reducers
import todos from './todos';

const appReducer = combineReducers({
  todos,
});

export default appReducer;
