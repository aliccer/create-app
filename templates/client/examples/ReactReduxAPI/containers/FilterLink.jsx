import { connect } from 'react-redux';
import { actions as visibilityFilterActions } from '../redux/todos/visibilityFilter';
import Link from '../components/Button';

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.todos.visibilityFilter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setFilter: () => dispatch(
    visibilityFilterActions.setVisibilityFilter(ownProps.filter),
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Link);
