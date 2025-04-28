import React from "react";
import CustomTabPanel from "./CustomTabPanel";
import QuillComponent from "./Quill";
import { Button } from "@mui/material";
import { insert } from "../../firebase/createPOI";
import { generateId } from "../utils/generateId";
import { saveAs } from "file-saver";
import { pdfExporter } from "quill-to-pdf";
import { useNavigate } from "react-router";
function UploadMaterialPanel({ value, index }) {
  const navigate = useNavigate();
  const quillRef = React.useRef(null);

  const [title, setTitle] = React.useState("Untitled");
  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  const handleSave = () => {
    const content = quillRef.current?.getHtml();
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
    navigate("/List");
  };
  const handleDownload = async () => {
    const quill = quillRef.current;
    const html = quill.getContents();
    const pdfBlob = await pdfExporter.generatePdf(html, {
      filename: `${title}.pdf`,
      margin: 10,
      pageSize: "A4",
      pageOrientation: "portrait",
    });
    saveAs(pdfBlob, `${title}.pdf`);
  };
  return (
    <div className=' p-4 container'>
      <CustomTabPanel value={value} index={0}>
        <input 
          class="border border-gray-300 rounded p-2 mb-2 w-full"
          type='text' 
          value={title} 
          onChange={handleOnChange} />
        <QuillComponent ref={quillRef} />
        <div class="gap-1 rounded-lg p-4 flex justify-end">
        <Button class="bg-[#556B2F] text-white px-5 p-2 rounded-b-sm" variant='contained' onClick={handleSave}>
          Save
        </Button>
        <Button  class="bg-[#2C2C2C]  text-white px-5 rounded-b-sm" variant='contained' onClick={handleDownload}>
          Download
        </Button>
        </div>  

      </CustomTabPanel>
    </div>
  );
}

export default UploadMaterialPanel;
