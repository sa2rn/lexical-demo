import PropTypes from 'prop-types';
import { FaCaretDown } from 'react-icons/fa';
import ToolbarButton from './ToolbarButton';
import {
  DropDown, DropDownButton, DropDownPanel, DropDownItem,
} from './DropDown';

const BLOCK_TYPES = {
  p: 'Paragraph',
  h1: 'Heading H1',
  h2: 'Heading H2',
  h3: 'Heading H3',
};

const BLOCK_TYPES_ENTRIES = Object.entries(BLOCK_TYPES);
const BLOCK_TYPES_KEYS = Object.keys(BLOCK_TYPES);

export default function BlockTypeToolbarButton({
  title, blockType, onSelect,
}) {
  return (
    <DropDown>
      <DropDownButton as={ToolbarButton} title={title}>
        {BLOCK_TYPES[blockType]}
        <FaCaretDown />
      </DropDownButton>
      <DropDownPanel>
        <div className="grid grid-cols-1 gap-1">
          {BLOCK_TYPES_ENTRIES.map(([value, label]) => (
            <DropDownItem
              key={value}
              value={value}
              isSelected={value === blockType}
              onSelect={onSelect}
            >
              {label}
            </DropDownItem>
          ))}
        </div>
      </DropDownPanel>
    </DropDown>
  );
}

BlockTypeToolbarButton.propTypes = {
  title: PropTypes.string,
  blockType: PropTypes.oneOf(BLOCK_TYPES_KEYS).isRequired,
  onSelect: PropTypes.func.isRequired,
};
