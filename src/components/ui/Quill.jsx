import React, { useImperativeHandle, forwardRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillResizeImage from "quill-resize-image";
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";

Quill.register("modules/resize", QuillResizeImage);
Quill.register({
  "modules/better-table": QuillBetterTable,
}, true);

function QuillComponent(props, ref) {
  const editorRef = React.useRef(null);
  const quillInstanceRef = React.useRef(null);

  React.useEffect(() => {
    if (!editorRef.current || quillInstanceRef.current) return;

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
          color: {
            row: "#f4f4f4",
            column: "#f4f4f4",
          },
        },
        resize: {
          locale: {
            center: "center",
          },
        },
      },
    });

    // Add global table styles
    const style = document.createElement("style");
    style.innerHTML = `
      .quill-editor table {
        width: 100% !important;
        border-collapse: collapse;
        margin-top: 10px;
        border: 1px solid #ccc;
      }
      .quill-editor td, .quill-editor th {
        border: 1px solid #ccc;
        padding: 8px;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
  }, []);

  useImperativeHandle(ref, () => ({
    getHtml: () => quillInstanceRef.current.root.innerHTML,
    setHtml: (html) => {
      quillInstanceRef.current.root.innerHTML = html;
    },
    getContents: () => quillInstanceRef.current.getContents(),
    onChange: (callback) => {
      quillInstanceRef.current.on("text-change", () => {
        const html = quillInstanceRef.current.root.innerHTML;
        callback(html);
      });
    },
    getTable: () => quillInstanceRef.current.getModule("better-table"),
    quill: quillInstanceRef.current,
  }));

  return <div ref={editorRef} className="quill-editor"></div>;
}

export default forwardRef(QuillComponent);