import React from "react";
import CustomTabPanel from "./CustomTabPanel";
import QuillComponent from "./Quill";
import { Button } from "@mui/material";
import { insert } from "../../firebase/createPOI";
import { generateId } from "../utils/generateId";
function UploadMaterialPanel({ value, index }) {
  const quillRef = React.useRef(null);

  const [title, setTitle] = React.useState("Untitled");
  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  const handleSave = () => {
    const content = quillRef.current.getEditor().getContents();
    insert({
      id: generateId(),
      title: title,
      content: content,
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        console.log("Document saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving document:", error);
      });
  };
  return (
    <div>
      <CustomTabPanel value={value} index={0}>
        <input type='text' value={title} onChange={handleOnChange} />

        <Button variant='contained'>Save</Button>
        <QuillComponent content={""} ref={quillRef} />
      </CustomTabPanel>
    </div>
  );
}

export default UploadMaterialPanel;
