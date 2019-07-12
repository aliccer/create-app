import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';
import { pluralize } from '../utils';

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed',
};

const Footer = (props) => {
  const {
    activeCount, completedCount, onClearCompleted, activeFilter, onFilterChange,
  } = props;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong>
        {' '}
        {pluralize('item', activeCount)}
        {' '}
        left
      </span>
      <ul className="filters">
        {Object.keys(FILTER_TITLES).map(filter => (
          <li key={filter}>
            <Button
              active={activeFilter === filter}
              setFilter={() => onFilterChange(filter)}
            >
              {FILTER_TITLES[filter]}
            </Button>
          </li>
        ))}
      </ul>
      {
        !!completedCount
        && (
          <button
            type="button"
            className="clear-completed"
            onClick={onClearCompleted}
          >
            Clear completed
          </button>
        )
      }
    </footer>
  );
};

Footer.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  completedCount: PropTypes.number.isRequired,
  activeCount: PropTypes.number.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default Footer;
