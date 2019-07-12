/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import size from 'lodash/size';
import Footer from '../components/Footer';
import VisibleTodoList from './VisibleTodoList';
import { actions as removeTodoActions } from '../redux/todos/remove';
import { actions as todosActions } from '../redux/todos/list';
import { getCompletedTodoCount, getTodosCount, getCompletedTodoIDs } from '../redux/todos/selectors';


const mapStateToProps = state => ({
  todosCount: getTodosCount(state),
  completedCount: getCompletedTodoCount(state),
  completedTodoIDs: getCompletedTodoIDs(state),
});


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    clearCompleted: removeTodoActions.send,
    fetchTodos: todosActions.send,
  }, dispatch),
});


class MainSection extends Component {
  static propTypes = {
    todosCount: PropTypes.number.isRequired,
    completedCount: PropTypes.number.isRequired,
    completedTodoIDs: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.actions.fetchTodos();
  }

  render() {
    const {
      todosCount, completedCount, completedTodoIDs, actions,
    } = this.props;

    return (
      <section className="main">
        {
          !!todosCount
            && (
              <span>
                <input
                  className="toggle-all"
                  type="checkbox"
                  checked={completedCount === todosCount}
                  readOnly
                />
              </span>
            )
        }
        <VisibleTodoList />
        {
          !!todosCount
          && (
          <Footer
            completedCount={completedCount}
            activeCount={todosCount - completedCount}
            onClearCompleted={() => {
              if (size(completedTodoIDs)) {
                actions.clearCompleted({ ids: completedTodoIDs });
              }
            }}
          />
          )
        }
      </section>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainSection);
