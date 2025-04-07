import React from "react";
import { insert } from "../../firebase/createDocument";
import { generateId } from "../hooks/generateId";
import { useNavigate } from "react-router-dom";
import QuillComponent from "../components/Quill";
function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("Untitled");
  const quillRef = React.useRef(null);
  const timeCreated = new Date().toISOString();
  const handleSave = async () => {
    const html = quillRef.current?.getHtml();
    const id = generateId();
    await insert({
      id: id,
      title: title,
      content: html,
      createdAt: timeCreated,
    });
    console.log("Document saved with ID:", id);
    navigate("/");
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
      <QuillComponent content={""} ref={quillRef} />
    </div>
  );
}

export default Create;
