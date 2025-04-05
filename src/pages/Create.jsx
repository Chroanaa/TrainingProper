import React from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillResizeImage from "quill-resize-image";
import { insert } from "../../firebase/insert";
import { generateId } from "../hooks/generateId";
import { useNavigate } from "react-router-dom";
Quill.register("modules/resize", QuillResizeImage);
function Create() {
  const editorRef = React.useRef(null);
  const quillInstanceRef = React.useRef(null);
  const [title, setTitle] = React.useState("Untitled");
  const timeCreated = new Date().toISOString();

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
  const handleSave = () => {
    const html = quillInstanceRef.current.root.innerHTML;
    const id = generateId();
    insert({
      id: id,
      title: title,
      content: html,
      createdAt: timeCreated,
      updatedAt: null,
    })
      .then(() => {
        console.log("Data inserted successfully");
        const navigate = useNavigate();
        navigate("/TrainingList", { replace: true });
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
      });
  };
  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  return (
    <div>
      <h1>Create</h1>
      <input type='text' value={title} onChange={handleOnChange} />
      <button type='submit' onClick={handleSave}>
        Save
      </button>
      <div ref={editorRef} className='quill-editor'></div>
    </div>
  );
}

export default Create;
