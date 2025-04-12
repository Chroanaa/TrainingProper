import React from "react";
import CustomTabPanel from "./CustomTabPanel";
function ReportListPanel({ value }) {
  return (
    <div>
      <CustomTabPanel value={value} index={0}>
        <h2 className='text-[1.5rem]'>Report List</h2>
        <p>Here is the list of reports.</p>
      </CustomTabPanel>
    </div>
  );
}

export default ReportListPanel;
