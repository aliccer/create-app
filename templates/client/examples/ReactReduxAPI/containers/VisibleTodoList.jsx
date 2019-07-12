import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as editActions } from '../redux/todos/edit';
import { actions as deleteActions } from '../redux/todos/remove';
import TodoList from '../components/TodoList';
import { getVisibleTodos } from '../redux/todos/selectors';

const mapStateToProps = state => ({
  filteredTodos: getVisibleTodos(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    editTodo: editActions.send,
    deleteTodo: id => deleteActions.send({ ids: [id] }),
  }, dispatch),
});


const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TodoList);

export default VisibleTodoList;
