import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Button = ({ active, children, setFilter }) => (
  <button
    type="button"
    className={classnames({ selected: active })}
    style={{ cursor: 'pointer' }}
    onClick={setFilter}
  >
    {children}
  </button>
);


Button.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  setFilter: PropTypes.func.isRequired,
};

export default Button;
