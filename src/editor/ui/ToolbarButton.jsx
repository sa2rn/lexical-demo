/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const ToolbarButton = forwardRef(({
  onClick, disabled = false, isActive = false, children, ...rest
}, ref) => (
  <button
    ref={ref}
    type="button"
    className={clsx('flex p-2 text-base rounded', isActive ? 'bg-black/10 text-black' : 'text-gray-600', disabled && 'opacity-50')}
    onClick={onClick}
    disabled={disabled}
    {...rest}
  >
    {children}
  </button>
));

ToolbarButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
};

export default ToolbarButton;
