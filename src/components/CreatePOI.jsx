import React from "react";
import CustomTabPanel from "./CustomTabPanel";
import QuillComponent from "./Quill";
function UploadMaterialPanel({ value, index }) {
  const [file, setFile] = React.useState(null);
  const quillRef = React.useRef(null);

  return (
    <div>
      <CustomTabPanel value={value} index={0}>
        <QuillComponent content={""} ref={quillRef} />
      </CustomTabPanel>
    </div>
  );
}

export default UploadMaterialPanel;
