import React from 'react';
import PropTypes from 'prop-types';

const NotFound = ({
  title,
  description = '',
}) => (
  <div className="not-found">
    <h1>{title}</h1>
    {description || null}
  </div>
);

NotFound.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

NotFound.defaultProps = {
  title: 'Page not found.',
  description: '',
};

export default NotFound;
