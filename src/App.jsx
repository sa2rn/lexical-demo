import { useState } from 'react'
import { Editor } from './editor';

function App() {
  const [fields, setFields] = useState({ state: {}, html: '' });

  return (
    <div className="grid grid-cols-1 gap-2">
      <Editor onChange={setFields} />
      <label>state:</label>
      <textarea value={JSON.stringify(fields.state, null, 2)} readOnly rows="10" />
      <label>html:</label>
      <textarea value={fields.html} readOnly />
    </div>
  )
}

export default App
