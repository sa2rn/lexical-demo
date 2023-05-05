/* eslint-disable react/jsx-props-no-spreading */
import React, {
  createContext, useCallback, useContext, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useClickAway } from 'react-use';

const DropDownContext = createContext({ isOpen: false, toggle: () => {} });

export function useDropDown() {
  return useContext(DropDownContext);
}

export function DropDownButton({ as: Component = 'button', ...rest }) {
  const { isOpen, toggle } = useDropDown();
  const handleClick = useCallback((e) => {
    e.preventDefault();
    toggle((prev) => !prev);
  }, [toggle]);

  return (
    <Component aria-expanded={isOpen} {...rest} onClick={handleClick} />
  );
}

DropDownButton.propTypes = {
  as: PropTypes.elementType,
};

export function DropDown({ children }) {
  const ref = useRef();
  const [isOpen, toggle] = useState();
  useClickAway(ref, () => {
    toggle(false);
  });
  const value = useMemo(() => ({ isOpen, toggle }), [isOpen]);

  return (
    <DropDownContext.Provider value={value}>
      <div ref={ref} className="relative">{children}</div>
    </DropDownContext.Provider>
  );
}

DropDown.propTypes = {
  children: PropTypes.node.isRequired,
};

export function DropDownPanel({ children }) {
  const { isOpen } = useDropDown();

  if (!isOpen) return null;

  return (
    <div className="absolute bg-white border border-gray-300">
      {children}
    </div>
  );
}

DropDownPanel.propTypes = {
  children: PropTypes.node.isRequired,
};

export function DropDownItem({
  children, value, isSelected = false, onSelect,
}) {
  const { toggle } = useDropDown();
  const handleClick = useCallback((e) => {
    e.preventDefault();
    toggle(false);
    onSelect(value);
  }, [toggle, onSelect, value]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSelected}
      className={clsx('p-2 text-left text-gray-600', isSelected ? 'bg-black/20' : 'hover:bg-black/20')}
    >
      {children}
    </button>
  );
}

DropDownItem.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};
