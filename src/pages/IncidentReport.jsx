import React from "react";
import IncidentReportTabs from "../components/IncidentReportTabs";
import CreateIncidentReportPanel from "../components/CreateIncidentReportPanel";
import ReportListPanel from "../components/ReportListPanel";
function IncidentReport() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <IncidentReportTabs value={value} handleChange={handleChange} />
      <div className='flex flex-col gap-2'>
        <CreateIncidentReportPanel value={value} />
        <ReportListPanel value={value} />
      </div>
    </div>
  );
}

export default IncidentReport;
