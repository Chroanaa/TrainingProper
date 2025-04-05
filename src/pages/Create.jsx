import React from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillResizeImage from "quill-resize-image";
Quill.register("modules/resize", QuillResizeImage);

function Create() {
  const editorRef = React.useRef(null);
  const quillInstanceRef = React.useRef(null);
  React.useEffect(() => {
    if (!editorRef.current) return;
    if (quillInstanceRef.current) return;
    quillInstanceRef.current = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
          ["clean"],
        ],
        resize: {
          modules: ["Resize", "DisplaySize", "Toolbar"], // Enable specific sub-modules
          handleStyles: {
            backgroundColor: "blue", // Customize handle styles
            border: "1px solid white",
          },
          minWidth: 50, // Set minimum width for resizing
          minHeight: 50, // Set minimum height for resizing
          maxWidth: 800, // Set maximum width for resizing
          maxHeight: 800, // Set maximum height for resizing
        },
      },
    });
  }, []);
  return <div ref={editorRef} className='quill-editor'></div>;
}

export default Create;
