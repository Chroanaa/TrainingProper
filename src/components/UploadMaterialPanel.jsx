import React from "react";
import CustomTabPanel from "./CustomTabPanel";
function UploadMaterialPanel({ value, index }) {
  const [file, setFile] = React.useState(null);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  return (
    <div>
      <CustomTabPanel value={value} index={0}>
        <h2 className='text-[1.5rem]'>Upload Material</h2>
        <p>Upload your course material here.</p>
        <input type='file' onChange={handleFileChange} />
      </CustomTabPanel>
    </div>
  );
}

export default UploadMaterialPanel;
