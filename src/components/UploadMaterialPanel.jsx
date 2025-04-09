import React from "react";
import CustomTabPanel from "./CustomTabPanel";
function UploadMaterialPanel({ value, index }) {
  return (
    <div>
      <CustomTabPanel value={value} index={0}>
        <h2 className='text-[1.5rem]'>Upload Material</h2>
        <p>Upload your course material here.</p>
        <input type='file' />
      </CustomTabPanel>
    </div>
  );
}

export default UploadMaterialPanel;
