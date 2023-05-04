import React, { useCallback, useEffect, useState } from 'react';
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
} from 'lexical';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import ToolbarButton from '../ui/ToolbarButton';
import Divider from '../ui/Divider';
import ColorToolbarButton from '../ui/ColorToolbarButton';
import { CHANGE_BACKGROUND_COLOR, CHANGE_TEXT_COLOR } from './ColorPlugin';

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
  });

  const $updateToolbar = useCallback(() => {
    const newState = {};
    const selection = $getSelection();
    console.log($getSelection());
    if ($isRangeSelection(selection)) {
      newState.isBold = selection.hasFormat('bold');
      newState.isItalic = selection.hasFormat('italic');
      newState.isUnderline = selection.hasFormat('underline');
      newState.color = $getSelectionStyleValueForProperty(selection, 'color', '#fff');
      newState.backgroundColor = $getSelectionStyleValueForProperty(selection, 'background-color', '#000');
    }
    setToolbarState((prev) => ({ ...prev, ...newState }));
  }, []);

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
  ), [editor, $updateToolbar]);

  return toolbarState;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const {
    canRedo, canUndo, isBold, isItalic, isUnderline, color, backgroundColor,
  } = useToolbarState();

  return (
    <div className="flex sticky gap-1 mb-2 z-10">
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND);
        }}
        disabled={!canUndo}
      >
        <FaUndo />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND);
        }}
        disabled={!canRedo}
      >
        <FaRedo />
      </ToolbarButton>
      <Divider />
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        isActive={isBold}
      >
        <FaBold />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        isActive={isItalic}
      >
        <FaItalic />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        isActive={isUnderline}
      >
        <FaUnderline />
      </ToolbarButton>
      <Divider />
      <ColorToolbarButton
        onSelect={(selectedColor) => {
          editor.dispatchCommand(CHANGE_TEXT_COLOR, selectedColor);
        }}
        color={color}
      >
        <FaPencilAlt />
      </ColorToolbarButton>
      <ColorToolbarButton
        onSelect={(selectedColor) => {
          editor.dispatchCommand(CHANGE_BACKGROUND_COLOR, selectedColor);
        }}
        color={backgroundColor}
      >
        <FaPalette />
      </ColorToolbarButton>
      <Divider />
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
      >
        <FaAlignLeft />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
      >
        <FaAlignCenter />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
      >
        <FaAlignRight />
      </ToolbarButton>
    </div>
  );
}
