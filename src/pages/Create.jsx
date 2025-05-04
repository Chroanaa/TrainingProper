import React from "react";
import { insert } from "../../firebase/createATR";
import { generateId } from "../utils/generateId";
import { useNavigate } from "react-router-dom";
import QuillComponent from "../components/Quill";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { pdfExporter } from "quill-to-pdf";
import { getReports } from "../../firebase/getReports";
function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("Untitled");
  const [reports, setReports] = React.useState([]);
  React.useEffect(() => {
    const unsubscribe = getReports((data) => {
      setReports(data);
    });
    return () => {
      unsubscribe();
    };
  }, []);
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
    navigate("/TrainingReport");
  };
  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  const handleGetReports = () => {
    if (!reports || reports.length === 0) {
      quillRef.current?.setHtml("<h2>No Reports Available</h2>");
      return;
    }

    quillRef.current?.quill.insertText(0, "Reports", { header: 2 });
    let insertIndex = quillRef.current.quill.getLength();

    for (let i = 0; i < reports.length; i++) {
      const reportData = reports[i];

      quillRef.current?.quill.insertText(
        insertIndex,
        `\n Title: ${reportData.title}`,
        { header: 3 }
      );
      insertIndex = quillRef.current.quill.getLength();

      quillRef.current?.quill.insertText(
        insertIndex,
        `\n Description: ${reportData.description}`,
        { header: 4 }
      );
      insertIndex = quillRef.current.quill.getLength();

      quillRef.current?.quill.insertText(
        insertIndex,
        `\n Time Reported: ${new Date(reportData.createdAt).toLocaleString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        )}`,
        { header: 5 }
      );
      insertIndex = quillRef.current.quill.getLength();

      quillRef.current?.quill.insertText(insertIndex, "\n\n");
      insertIndex = quillRef.current.quill.getLength();
    }
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
    <div>
      <h1 className='text-[2rem] mb-[1rem]'>Report Creation</h1>

      <div class='rounded p-4 shadow-md'>
        <input
          type='text'
          value={title}
          onChange={handleOnChange}
          className='border border-gray-300 rounded p-2 mb-2 w-full'
        />

        <QuillComponent content={""} ref={quillRef} />

        <div class='mt-2 gap-1 flex flex-row justify-end'>
          <Button
            variant='contained'
            class='bg-[#556B2F] text-white px-5 p-2 rounded-b-sm'
            type='submit'
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            variant='contained'
            class='bg-[#2C2C2C] text-white px-5 p-2 rounded-b-sm'
            onClick={() => handleGetReports()}
          >
            Get Current Incident Reports
          </Button>
          <Button
            variant='contained'
            class='bg-[#2C2C2C]  text-white px-5 rounded-b-sm'
            onClick={() => handleDownload()}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Create;
