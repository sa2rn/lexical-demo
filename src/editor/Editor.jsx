import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { $generateHtmlFromNodes } from '@lexical/html';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import theme from './editorTheme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import ColorPlugin from './plugins/ColorPlugin';
import BlockTypePlugin from './plugins/BlockTypePlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';

function onError(error) {
  console.error(error);
}

export default function Editor({ onChange }) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
    ],
  };

  const handleChange = useCallback((editorState, editor) => {
    editorState.read(() => {
      onChange({
        state: editorState.toJSON(),
        html: $generateHtmlFromNodes(editor),
      });
    });
  }, [onChange]);

  return (
    <>
      <style>{'#gtx-trans { display: none; }'}</style>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="gap-2 bg-gray-200 rounded p-2">
          <ToolbarPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={<ContentEditable className="bg-white p-2 min-h-[140px] outline-0" />}
              placeholder={<div className="text-gray-400 absolute top-2 left-2">Enter some text...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </div>
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ColorPlugin />
        <BlockTypePlugin />
        <TreeViewPlugin />
      </LexicalComposer>
    </>
  );
}

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
};
