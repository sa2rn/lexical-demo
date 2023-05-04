import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaRedo,
  FaUnderline,
  FaUndo
} from 'react-icons/fa';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import {
  mergeRegister,
} from '@lexical/utils';

function ToolbarButton({ onClick, disabled = false, isActive = false, children }) {
  return (
    <button
      className={clsx('flex p-2 text-base rounded', isActive ? 'bg-black/10 text-black' : 'text-gray-600')}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  );
}

ToolbarButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
};

function Divider() {
  return <div className="w-[1px] bg-gray-300" />
}

function useToolbarState() {
  const [editor] = useLexicalComposerContext();
  const [toolbarState, setToolbarState] = useState({
    canUndo: false,
    canRedo: false,
    isBold: false,
    isItalic: false,
    isUnderline: false,
  });

  const $updateToolbar = useCallback(() => {
      const newState = {};
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Update text format
        newState.isBold = selection.hasFormat('bold');
        newState.isItalic = selection.hasFormat('italic');
        newState.isUnderline = selection.hasFormat('underline');
      }
      setToolbarState((prev) => ({ ...prev, ...newState }));
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setToolbarState((prev) => ({ ...prev, canUndo: payload }));
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setToolbarState((prev) => ({ ...prev, canRedo: payload }));
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, $updateToolbar]);

  return toolbarState;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { canRedo, canUndo, isBold, isItalic, isUnderline } = useToolbarState();

  return (
    <div className="flex sticky gap-1 mb-2">
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND)
        }}
        disabled={!canUndo}>
        <FaUndo />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND)
        }}
        disabled={!canRedo}>
        <FaRedo />
      </ToolbarButton>
      <Divider />
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
        }}
        isActive={isBold}>
        <FaBold />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
        }}
        isActive={isItalic}>
        <FaItalic />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
        }}
        isActive={isUnderline}>
        <FaUnderline />
      </ToolbarButton>
      <Divider />
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
        }}>
        <FaAlignLeft />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
        }}>
        <FaAlignCenter />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
        }}>
        <FaAlignRight />
      </ToolbarButton>
    </div>
  )
}