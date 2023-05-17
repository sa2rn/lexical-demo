import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView } from '@lexical/react/LexicalTreeView';

export default function TreeViewPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <TreeView
      viewClassName="block bg-gray-200 text-black p-2 text-xs mb-2 relative overflow-hidden"
      treeTypeButtonClassName="border-none p-0 text-xs mr-2 top-2 right-20 absolute text-black hover:underline"
      timeTravelPanelClassName="overflow-hidden pb-2 m-auto flex"
      timeTravelButtonClassName="border-none p-0 text-xs top-2 right-4 absolute text-black hover:underline"
      timeTravelPanelSliderClassName="p-0 flex"
      timeTravelPanelButtonClassName="p-0 border-none flex-1 text-black text-xs hover:underline"
      editor={editor}
    />
  );
}
