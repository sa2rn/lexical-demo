import PropTypes from 'prop-types';
import { HexColorPicker } from 'react-colorful';
import ToolbarButton from './ToolbarButton';
import { DropDown, DropDownButton, DropDownPanel } from './DropDown';

export default function ColorToolbarButton({
  children, title, color, onSelect,
}) {
  return (
    <DropDown>
      <DropDownButton as={ToolbarButton} title={title}>
        {children}
      </DropDownButton>
      <DropDownPanel>
        <HexColorPicker color={color} onChange={onSelect} />
      </DropDownPanel>
    </DropDown>
  );
}

ColorToolbarButton.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
