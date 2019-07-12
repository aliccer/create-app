import { combineReducers } from 'redux';

import list from './list';
import create from './create';
import edit from './edit';
import remove from './remove';
import visibilityFilter from './visibilityFilter';

export default combineReducers({
  list,
  create,
  edit,
  remove,
  visibilityFilter,
});
