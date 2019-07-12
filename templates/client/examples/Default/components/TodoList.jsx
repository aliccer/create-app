/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import TodoItem from './TodoItem';

const TodoList = ({ filteredTodos = [], actions }) => (
  <ul className="todo-list">
    {filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} {...actions} />)}
  </ul>
);

TodoList.propTypes = {
  filteredTodos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired),
  actions: PropTypes.object.isRequired,
};

TodoList.defaultProps = {
  filteredTodos: [],
};

export default TodoList;
