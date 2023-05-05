import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { HexColorPicker } from 'react-colorful';
import ToolbarButton from './ToolbarButton';

export default function ColorToolbarButton({
  children, title, color, onSelect,
}) {
  const [isOpen, toggle] = useState(false);

  return (
    <div className="relative">
      <ToolbarButton title={title} onClick={() => toggle((prev) => !prev)}>
        {children}
      </ToolbarButton>
      {isOpen && (
        <div className="absolute bg-white border border-gray-300">
          <HexColorPicker color={color} onChange={onSelect} />
        </div>
      )}
    </div>
  );
}

ColorToolbarButton.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
