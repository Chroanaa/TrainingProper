import React, { useImperativeHandle, forwardRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillResizeImage from "quill-resize-image";
import { ref, set } from "firebase/database";
Quill.register("modules/resize", QuillResizeImage);

function QuillComponent(props, ref) {
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
          locale: {
            center: "center",
          },
        },
      },
    });
  }, []);
  useImperativeHandle(ref, () => ({
    getHtml: () => {
      return quillInstanceRef.current.root.innerHTML;
    },
    setHtml: (html) => {
      quillInstanceRef.current.root.innerHTML = html;
    },
  }));
  return <div ref={editorRef} className='quill-editor'></div>;
}

export default forwardRef(QuillComponent, ref);
