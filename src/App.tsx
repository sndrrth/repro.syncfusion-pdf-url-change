import { useState } from 'react';
import { PdfEditor } from './pdf-editor';

function App() {
  const [url, setUrl] = useState("");

  return (
    <div style={{ marginTop: 100 }}>
      <button onClick={() => setUrl("http://localhost:5173/document.pdf")}>Load document.pdf</button>
      <button onClick={() => setUrl("http://localhost:5173/sample.pdf")}>Load sample.pdf</button>
      <button onClick={() => setUrl("http://localhost:5173/sample2.pdf")}>Load sample2.pdf</button>

      <button onClick={() => setUrl("http://localhost:5173/dummy.pdf")}>Load dummy.pdf</button>
      <button onClick={() => setUrl("http://localhost:5173/dummy2.pdf")}>Load dummy2.pdf</button>

      {!!url && <PdfEditor
        fileName={url}
        pdfUrl={url}
      />}
    </div>
  );
}

export default App;
