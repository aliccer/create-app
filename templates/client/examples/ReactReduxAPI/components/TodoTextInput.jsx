/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class TodoTextInput extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    editing: PropTypes.bool,
    newTodo: PropTypes.bool,
  }

  static defaultProps = {
    text: '',
    placeholder: 'Type in',
    editing: false,
    newTodo: false,
  };

  state = {
    text: this.props.text || '',
  }

  handleSubmit = (e) => {
    const { newTodo, onSave } = this.props;
    const text = e.target.value.trim();
    if (e.which === 13) {
      onSave(text);
      if (newTodo) {
        this.setState({ text: '' });
      }
    }
  }

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  }

  handleBlur = (e) => {
    const { newTodo, onSave } = this.props;

    if (!newTodo) {
      onSave(e.target.value);
    }
  }

  render() {
    const { placeholder, editing, newTodo } = this.props;

    return (
      <input
        className={classnames({
          edit: editing,
          'new-todo': newTodo,
        })}
        type="text"
        placeholder={placeholder}
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit}
      />
    );
  }
}
