import { connect } from 'react-redux';
import Header from '../components/Header';
import { actions as createTodoActions } from '../redux/todos/create';

export default connect(null, { addTodo: createTodoActions.send })(Header);
