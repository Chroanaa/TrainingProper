import React from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import the Quill CSS
function Create() {
  const editorRef = React.useRef(null);
  const quillInstanceRef = React.useRef(null);
  React.useEffect(() => {
    if (editorRef.current) {
      quillInstanceRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image", "code-block"],
            ["clean"],
          ],
        },
      });
    }
  }, []);
  return <div ref={editorRef} className='quill-editor'></div>;
}

export default Create;
