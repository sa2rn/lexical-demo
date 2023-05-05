import React from 'react';
import { Editor } from './editor';

function App() {
  return (
    <div className="grid grid-cols-1 gap-2 p-2">
      <Editor onChange={console.log} />
    </div>
  );
}

export default App;
