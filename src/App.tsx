import { useState } from 'react';
import { PdfViewerComponent,} from "@syncfusion/ej2-react-pdfviewer";

const resourceUrl = `${window.location.origin}/ej2-pdfviewer-lib/24.1.41/`;

const PdfEditor = (props: { pdfUrl: string }) => {
	const {  pdfUrl } = props;
	return (
		<PdfViewerComponent
			height="500px"
			width="100%"
			documentPath={pdfUrl}
			resourceUrl={resourceUrl}
		/>
	);
};



function App() {
  const [url, setUrl] = useState("");

  return (
    <div style={{ marginTop: 100 }}>
      <button onClick={() => setUrl(`${window.location.origin}/dummy.pdf`)}>Load dummy.pdf</button>
      <button onClick={() => setUrl(`${window.location.origin}/dummy2.pdf`)}>Load dummy2.pdf</button>

      {!!url && <PdfEditor pdfUrl={url} />}
    </div>
  );
}

export default App;
