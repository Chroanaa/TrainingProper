import React from "react";
import { viewATR } from "../../firebase/ATR/viewATR";
import QuillComponent from "../components/ui/Quill";
import { useLoaderData } from "react-router-dom";
import { updateATR } from "../../firebase/ATR/updateATR";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { pdfExporter } from "quill-to-pdf";
export async function loader({ params }) {
  const { id } = params;
  const data = await viewATR(id);
  return data;
}
function ViewATR() {
  const data = useLoaderData();
  const [newTitle, setNewTitle] = React.useState(data.title);
  const handleOnChange = (e) => {
    setNewTitle(e.target.value);
  };
  const quillRef = React.useRef(null);
  React.useEffect(() => {
    if (quillRef.current) {
      quillRef.current?.setHtml(data.content);
    }
  }, []);
  const handleBeforeUnload = (event) => {
    const confirmationMessage = "Are you sure you want to leave? Your changes may not be saved.";
    event.returnValue = confirmationMessage; // For most browsers
    return confirmationMessage; // For some older browsers
  };
  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  })
  const handleSave = async () => {
    const content = quillRef.current?.getHtml();
    const updatedData = {
      title: newTitle,
      createdAt: data.createdAt,
      content: content,
      updatedAt: new Date().toISOString(),
    };
    await updateATR(data.id, updatedData);
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
      <Button variant='contained' onClick={handleSave}>
        Save
      </Button>
      <Button variant='contained' onClick={handleDownload}>
        Download as PDF
      </Button>
      <QuillComponent ref={quillRef} />
    </div>
  );
}

export default ViewATR;
