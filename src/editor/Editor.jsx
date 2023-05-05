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
import theme from './editorTheme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import ColorPlugin from './plugins/ColorPlugin';
import BlockPlugin from './plugins/BlockPlugin';

function onError(error) {
  console.error(error);
}

export default function Editor({ onChange }) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
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
    <div className="gap-2 bg-gray-200 rounded m-2 p-2">
      <style>{'#gtx-trans { display: none; }'}</style>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={<ContentEditable className="bg-white p-2 min-h-[140px] outline-0" />}
            placeholder={<div className="text-gray-400 absolute top-2 left-2">Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ColorPlugin />
          <BlockPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
};
