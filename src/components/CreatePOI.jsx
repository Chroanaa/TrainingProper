import React from "react";
import CustomTabPanel from "./CustomTabPanel";
import QuillComponent from "./Quill";
import { Button } from "@mui/material";
import { insert } from "../../firebase/createPOI";
import { generateId } from "../utils/generateId";
import { saveAs } from "file-saver";
import { pdfExporter } from "quill-to-pdf";
import { useNavigate } from "react-router";
import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
function UploadMaterialPanel({ value, index }) {
  const navigate = useNavigate();
  const quillRef = React.useRef(null);

  const [title, setTitle] = React.useState("Untitled");
  const [semester, setSemester] = React.useState("");
  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  const handleGetSemester = (e) => {
    setSemester(e.target.value);
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
    <div>
      <CustomTabPanel value={value} index={0}>
        <input type='text' value={title} onChange={handleOnChange} />
        <FormControl>
          <InputLabel id='demo-simple-select-outlined-label'>
            Get schedule for the semester
          </InputLabel>
          <Select
            value={semester || ""}
            className='w-[200px]'
            onChange={(event) => handleGetSemester(event.target.value)}
            label='Select Semester'
          >
            <MenuItem>1st Semester</MenuItem>
            <MenuItem>2nd Semester</MenuItem>
          </Select>
        </FormControl>
        <Button variant='contained' onClick={handleSave}>
          Save
        </Button>
        <Button variant='contained' onClick={handleDownload}>
          Download
        </Button>
        <QuillComponent ref={quillRef} />
      </CustomTabPanel>
    </div>
  );
}

export default UploadMaterialPanel;
