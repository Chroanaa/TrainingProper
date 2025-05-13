import React from "react";
import { viewATR } from "../../firebase/ATR/viewATR";
import QuillComponent from "../components/ui/Quill";
import { useLoaderData } from "react-router-dom";
import { updateATR } from "../../firebase/ATR/updateATR";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { pdfExporter } from "quill-to-pdf";
import Swal from "sweetalert2";

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
  });
  
  const handleSave = async () => {
    try {
      const content = quillRef.current?.getHtml();
      const updatedData = {
        title: newTitle,
        createdAt: data.createdAt,
        content: content,
        updatedAt: new Date().toISOString(),
      };
      
      await updateATR(data.id, updatedData);
      
      // Show success message with SweetAlert
      Swal.fire({
        title: 'Saved!',
        text: 'Your ATR has been successfully saved.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4CAF50'
      });
    } catch (error) {
      // Show error message if save fails
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save your ATR. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F44336'
      });
      console.error("Error saving ATR:", error);
    }
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
      <div className='flex mb-2 gap-2'>
        <input 
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 " 
          type='text'
          value={newTitle} 
          onChange={handleOnChange}
          placeholder="Enter title" 
        />
        <div className='flex gap-1'>
          <Button variant='contained' onClick={handleSave}>
            Save
          </Button>
          <Button variant='contained' onClick={handleDownload}>
            Download as PDF
          </Button>
        </div>
      </div>
      <QuillComponent ref={quillRef} />
    </div>
  );
}

export default ViewATR;