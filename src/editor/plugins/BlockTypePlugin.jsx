import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  createCommand,
  COMMAND_PRIORITY_NORMAL,
  $createParagraphNode,
} from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';

export const CHANGE_BLOCK_TYPE = createCommand('CHANGE_BLOCK_TYPE');

const HEADING_BLOCK_TYPES = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const isHeading = (blockType) => HEADING_BLOCK_TYPES.has(blockType);
const isParagraph = (blockType) => blockType === 'p';

export default function BlockTypePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => mergeRegister(
    editor.registerCommand(
      CHANGE_BLOCK_TYPE,
      (payload) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if (isHeading(payload)) {
              $setBlocksType(selection, () => $createHeadingNode(payload));
            } else if (isParagraph(payload)) {
              $setBlocksType(selection, () => $createParagraphNode());
            } else {
              throw new Error(`${payload} does not support yet`);
            }
          }
        });
      },
      COMMAND_PRIORITY_NORMAL,
    ),
  ), [editor]);

  return null;
}
