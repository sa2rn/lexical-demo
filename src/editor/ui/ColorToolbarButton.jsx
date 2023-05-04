import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import ToolbarButton from './ToolbarButton';

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

function isValidColor(color) {
  return HEX_COLOR_REGEX.test(color);
}

export default function ColorToolbarButton({ children, color, onSelect }) {
  const [isOpen, toggle] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);

  const handleChange = useCallback((e) => {
    const newColor = e.hex;
    setCurrentColor(newColor);
    if (isValidColor(newColor)) {
      onSelect(newColor);
    }
  }, [onSelect]);

  return (
    <div className="relative">
      <ToolbarButton onClick={() => toggle((prev) => !prev)}>
        {children}
      </ToolbarButton>
      {isOpen && (
        <div className="absolute bg-white border border-gray-300">
          <SketchPicker color={currentColor} onChange={handleChange} />
        </div>
      )}
    </div>
  );
}

ColorToolbarButton.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
