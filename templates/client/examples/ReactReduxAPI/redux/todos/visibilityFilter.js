import {
  createConstants,
  createActions,
} from '../../utils/redux';
import { SHOW_ALL, SET_VISIBILITY_FILTER } from '../../constants';

export const constants = createConstants('todos', 'visibilityFilter', [SET_VISIBILITY_FILTER]);
export const actions = createActions(constants);

const visibilityFilter = (state = SHOW_ALL, action) => {
  switch (action.type) {
    case constants[SET_VISIBILITY_FILTER]:
      return action.payload;
    default:
      return state;
  }
};

export default visibilityFilter;
