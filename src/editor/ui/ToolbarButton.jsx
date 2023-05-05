/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

export default function ToolbarButton({
  onClick, title, disabled = false, isActive = false, children,
}) {
  return (
    <button
      type="button"
      className={clsx('inline-flex items-center gap-1 p-2 text-base rounded', isActive ? 'bg-black/10 text-black' : 'text-gray-600', disabled && 'opacity-50')}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}

ToolbarButton.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
};
