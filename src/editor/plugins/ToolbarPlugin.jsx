import { useCallback, useEffect, useState } from 'react';
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaRedo,
  FaUnderline,
  FaUndo,
  FaPencilAlt,
  FaPalette,
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
  COMMAND_PRIORITY_NORMAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
  ToolbarButton, Divider, ColorToolbarButton, BlockTypeToolbarButton,
} from '../ui';
import { CHANGE_BACKGROUND_COLOR, CHANGE_TEXT_COLOR } from './ColorPlugin';
import { CHANGE_BLOCK_TYPE } from './BlockTypePlugin';

function useToolbarState() {
  const [editor] = useLexicalComposerContext();
  const [toolbarState, setToolbarState] = useState({
    canUndo: false,
    canRedo: false,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    color: '#000',
    backgroundColor: '#fff',
    blockType: 'p',
  });

  const $updateToolbar = useCallback(() => {
    const newState = {};
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      newState.isBold = selection.hasFormat('bold');
      newState.isItalic = selection.hasFormat('italic');
      newState.isUnderline = selection.hasFormat('underline');
      newState.color = $getSelectionStyleValueForProperty(selection, 'color', '#fff');
      newState.backgroundColor = $getSelectionStyleValueForProperty(selection, 'background-color', '#000');
    }
    setToolbarState((prev) => ({ ...prev, ...newState }));
  }, []);

  useEffect(() => editor.registerCommand(
    SELECTION_CHANGE_COMMAND,
    (_payload, newEditor) => {
      console.log('selection changed', newEditor === editor);
      return false;
    },
    COMMAND_PRIORITY_CRITICAL,
  ), [editor]);

  useEffect(() => mergeRegister(
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateToolbar();
      });
    }),
    editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setToolbarState((prev) => ({ ...prev, canUndo: payload }));
      },
      COMMAND_PRIORITY_CRITICAL,
    ),
    editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setToolbarState((prev) => ({ ...prev, canRedo: payload }));
      },
      COMMAND_PRIORITY_CRITICAL,
    ),
    editor.registerCommand(
      CHANGE_TEXT_COLOR,
      (payload) => {
        setToolbarState((prev) => ({ ...prev, color: payload }));
      },
      COMMAND_PRIORITY_NORMAL,
    ),
    editor.registerCommand(
      CHANGE_BACKGROUND_COLOR,
      (payload) => {
        setToolbarState((prev) => ({ ...prev, backgroundColor: payload }));
      },
      COMMAND_PRIORITY_NORMAL,
    ),
    editor.registerCommand(
      CHANGE_BLOCK_TYPE,
      (payload) => {
        setToolbarState((prev) => ({ ...prev, blockType: payload }));
      },
      COMMAND_PRIORITY_NORMAL,
    ),
  ), [editor, $updateToolbar]);

  return toolbarState;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const {
    canRedo, canUndo, isBold, isItalic, isUnderline, color, backgroundColor, blockType,
  } = useToolbarState();

  return (
    <div className="flex sticky gap-1 mb-2 z-10">
      <ToolbarButton
        title="Undo"
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND);
        }}
        disabled={!canUndo}
      >
        <FaUndo />
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND);
        }}
        disabled={!canRedo}
      >
        <FaRedo />
      </ToolbarButton>
      <Divider />
      <BlockTypeToolbarButton
        title="Choose block type"
        blockType={blockType}
        onSelect={(newBlockType) => {
          editor.dispatchCommand(CHANGE_BLOCK_TYPE, newBlockType);
        }}
      />
      <Divider />
      <ToolbarButton
        title="Bold"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        isActive={isBold}
      >
        <FaBold />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        isActive={isItalic}
      >
        <FaItalic />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        isActive={isUnderline}
      >
        <FaUnderline />
      </ToolbarButton>
      <Divider />
      <ColorToolbarButton
        title="Text color"
        onSelect={(selectedColor) => {
          editor.dispatchCommand(CHANGE_TEXT_COLOR, selectedColor);
        }}
        color={color}
      >
        <FaPencilAlt />
      </ColorToolbarButton>
      <ColorToolbarButton
        title="Background color"
        onSelect={(selectedColor) => {
          editor.dispatchCommand(CHANGE_BACKGROUND_COLOR, selectedColor);
        }}
        color={backgroundColor}
      >
        <FaPalette />
      </ColorToolbarButton>
      <Divider />
      <ToolbarButton
        title="Align left"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
      >
        <FaAlignLeft />
      </ToolbarButton>
      <ToolbarButton
        title="Align center"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
      >
        <FaAlignCenter />
      </ToolbarButton>
      <ToolbarButton
        title="Align right"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
      >
        <FaAlignRight />
      </ToolbarButton>
    </div>
  );
}
