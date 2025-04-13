import React from "react";
import CustomTabPanel from "./CustomTabPanel";
import AccordionExpand from "./ui/AccordionExpand";
function ReportListPanel({ value, reports }) {
  console.log(reports);
  return (
    <div>
      <CustomTabPanel value={value} index={0}>
        <h2 className='text-[1.5rem]'>Report List</h2>
        <p>Here is the list of reports.</p>
        <div className='flex flex-col gap-2'>
          {reports.map((report, index) => (
            <AccordionExpand
              key={index}
              title={report.title}
              content={report.description}
              id={index}
            />
          ))}
        </div>
      </CustomTabPanel>
    </div>
  );
}

export default ReportListPanel;
