/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TodoTextInput from './TodoTextInput';

export default class TodoItem extends Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    todo: PropTypes.object.isRequired,
    editTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      todo: props.todo,
    };
  }

  handleDoubleClick = () => {
    this.setState({ editing: true });
  }

  handleSave = (updates) => {
    const { todo } = this.state;
    const { deleteTodo, editTodo } = this.props;

    if (get(updates, 'text.length') === 0) {
      deleteTodo(todo.id);
      this.setState({ editing: false });
    } else {
      this.setState(
        state => ({
          editing: false,
          todo: {
            ...state.todo,
            ...updates,
          },
        }),
        () => editTodo({
          ...todo,
          ...updates,
        }),
      );
    }
  }

  handleCreate = (text) => {
    const { todo } = this.state;

    this.handleSave({
      ...todo,
      text,
    });
  }


  toggleComplete = () => {
    const { todo } = this.state;

    this.handleSave({
      completed: !todo.completed,
    });
  }

  render() {
    const { deleteTodo } = this.props;
    const { todo, editing } = this.state;
    let element;

    if (editing) {
      element = (
        <TodoTextInput
          text={todo.text}
          editing={editing}
          onSave={this.handleCreate}
        />
      );
    } else {
      element = (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={this.toggleComplete}
          />
          <label onDoubleClick={this.handleDoubleClick}>
            {todo.text}
          </label>
          <button
            type="button"
            className="destroy"
            onClick={() => deleteTodo(todo.id)}
          />
        </div>
      );
    }

    return (
      <li className={classnames({
        completed: todo.completed,
        editing,
      })}
      >
        {element}
      </li>
    );
  }
}
