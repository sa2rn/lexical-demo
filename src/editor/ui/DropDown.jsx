/* eslint-disable react/jsx-props-no-spreading */
import React, {
  createContext, useCallback, useContext, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useClickAway } from 'react-use';

const DropDownContext = createContext({ isOpen: false, toggle: () => {} });

export function DropDownButton({ as: Component = 'button', ...rest }) {
  const { isOpen, toggle } = useContext(DropDownContext);
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

export function DropDownItem({ onClick, children }) {
  return (
    <button type="button" className="p-2 text-gray-600 hover:bg-black/20" onClick={onClick}>
      {children}
    </button>
  );
}

DropDownItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
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
  const { isOpen } = useContext(DropDownContext);

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
