/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import size from 'lodash/size';
import reduce from 'lodash/reduce';
import filter from 'lodash/filter';
import map from 'lodash/map';
import uniqueId from 'lodash/uniqueId';
import castArray from 'lodash/castArray';
import Footer from '../components/Footer';
import Header from '../components/Header';
import TodoList from '../components/TodoList';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants';


const newTodo = text => ({
  id: uniqueId(),
  completed: false,
  text,
});

const getVisibleTodos = (visibilityFilter, todos) => {
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
};

class MainSection extends Component {
  state = {
    todos: [],
    filter: SHOW_ALL,
  }

  addTodo = (text) => {
    this.setState({
      todos: [newTodo(text), ...this.state.todos],
    });
  }

  deleteTodo = (ids) => {
    this.setState({
      todos: filter(this.state.todos, todo => (castArray(ids) || []).indexOf(todo.id) === -1),
    });
  }

  editTodo = (payload) => {
    this.setState({
      todos: map(this.state.todos, todo => (todo.id === payload.id ? payload : todo)),
    });
  }

  handleFilterChange = val => this.setState({ filter: val })

  getTodosCount = () => size(this.state.todos)

  getCompletedTodoIDs = () => reduce(this.state.todos, (res, todo) => {
    if (todo.completed) {
      res.push(todo.id);
    }
    return res;
  }, [])

  render() {
    const todosCount = this.getTodosCount();
    const completedTodoIDs = this.getCompletedTodoIDs();
    const completedCount = size(completedTodoIDs);

    return (
      <div className="todoapp">
        <section className="main">
          <Header addTodo={this.addTodo} />
          <TodoList
            filteredTodos={getVisibleTodos(this.state.filter, this.state.todos)}
            actions={{
              editTodo: this.editTodo,
              deleteTodo: this.deleteTodo,
            }}
          />
          {
            !!todosCount
            && (
            <Footer
              completedCount={completedCount}
              activeCount={todosCount - completedCount}
              activeFilter={this.state.filter}
              onFilterChange={this.handleFilterChange}
              onClearCompleted={() => {
                if (size(completedTodoIDs)) {
                  this.deleteTodo(completedTodoIDs);
                }
              }}
            />
            )
          }
        </section>
      </div>
    );
  }
}

export default MainSection;
