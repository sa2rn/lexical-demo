import { useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  createCommand,
  COMMAND_PRIORITY_NORMAL,
} from 'lexical';
import { $patchStyleText } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';

export const CHANGE_TEXT_COLOR = createCommand('CHANGE_TEXT_COLOR');
export const CHANGE_BACKGROUND_COLOR = createCommand('CHANGE_BACKGROUND_COLOR');

export default function ColorPlugin() {
  const [editor] = useLexicalComposerContext();
  const applyStyleText = useCallback((styles) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, styles);
      }
    });
  }, [editor]);

  useEffect(() => mergeRegister(
    editor.registerCommand(
      CHANGE_TEXT_COLOR,
      (payload) => {
        applyStyleText({ color: payload });
      },
      COMMAND_PRIORITY_NORMAL,
    ),
    editor.registerCommand(
      CHANGE_BACKGROUND_COLOR,
      (payload) => {
        applyStyleText({ 'background-color': payload });
      },
      COMMAND_PRIORITY_NORMAL,
    ),
  ), [editor, applyStyleText]);

  return null;
}
