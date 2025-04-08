import React from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { getDocument } from "../../firebase/getDocument";
import QuillComponent from "../components/Quill";
import { updateDocument } from "../../firebase/updateDocument";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
export async function loader({ params }) {
  const { id } = params;
  const document = await getDocument(id);
  return document;
}

function ViewDocument() {
  const { content, id, title } = useLoaderData();
  const [newTitle, setNewTitle] = React.useState(title);
  const quillRef = React.useRef(null);
  const navigate = useNavigate();
  const handleOnChange = (e) => {
    setNewTitle(e.target.value);
  };
  React.useEffect(() => {
    if (quillRef.current) {
      quillRef.current?.setHtml(content);
    }
  }, []);
  const handleOnSave = async () => {
    const content = quillRef.current.getHtml();
    const data = {
      id: id,
      title: newTitle,
      content: content,
    };
    await updateDocument(id, data);
    navigate("/List");
  };
  return (
    <div>
      <input type='text' value={newTitle} onChange={handleOnChange} />
      <Button variant='contained' onClick={handleOnSave}>
        Save
      </Button>
      <QuillComponent ref={quillRef} />
    </div>
  );
}

export default ViewDocument;
