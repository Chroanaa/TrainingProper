import React from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { viewPOI } from "../../firebase/POI/viewPOI";
import QuillComponent from "../components/ui/Quill";
import { updatePOI } from "../../firebase/POI/updatePOI";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { pdfExporter } from "quill-to-pdf";
export async function loader({ params }) {
  const { id } = params;
  const document = await viewPOI(id);
  return document;
}

function ViewPOI() {
  const { content, id, title } = useLoaderData();
  const [newTitle, setNewTitle] = React.useState(title);
  const quillRef = React.useRef(null);
  const navigate = useNavigate();
  const handleBeforeUnload = (event) => {
    const confirmationMessage = "Are you sure you want to leave? Your changes may not be saved.";
    event.returnValue = confirmationMessage; // For most browsers
    return confirmationMessage; // For some older browsers
  }
  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
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
    await updatePOI(id, data);
    navigate("/List");
  };
  const handleDownload = async () => {
    const quill = quillRef.current;
    const html = quill.getContents();
    const pdfBlob = await pdfExporter.generatePdf(html, {
      filename: `${newTitle}.pdf`,
      margin: 10,
      pageSize: "A4",
      pageOrientation: "portrait",
    });
    saveAs(pdfBlob, `${newTitle}.pdf`);
  };
  return (
    <div>
      <input type='text' value={newTitle} onChange={handleOnChange} />
      <Button variant='contained' onClick={handleOnSave}>
        Save
      </Button>
      <Button variant='contained' onClick={handleDownload}>
        Download
      </Button>
      <QuillComponent ref={quillRef} />
    </div>
  );
}

export default ViewPOI;
