import React, { useImperativeHandle, forwardRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillResizeImage from "quill-resize-image";
import { ref } from "firebase/database";
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";
Quill.register("modules/resize", QuillResizeImage);
Quill.register(
  {
    "modules/better-table": QuillBetterTable,
  },
  true
);
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
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          ["align"],
          ["color", "background"],
        ],
        "better-table": {
          operationMenu: {
            items: {
              unmergeCells: {
                text: "Unmerge cells",
                title: "Unmerge cells",
              },
            },
          },
        },
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
    getContents: () => {
      return quillInstanceRef.current.getContents();
    },
    onChange: (callback) => {
      quillInstanceRef.current.on("text-change", () => {
        const html = quillInstanceRef.current.root.innerHTML;
        callback(html);
      });
    },
    getTable: () => {
      const table = quillInstanceRef.current.getModule("better-table");

      return table;
    },
    quill: quillInstanceRef.current,
  }));
  return <div ref={editorRef} className='quill-editor'></div>;
}

export default forwardRef(QuillComponent, ref);
