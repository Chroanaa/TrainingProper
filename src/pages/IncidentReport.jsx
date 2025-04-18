import React from "react";
import IncidentReportTabs from "../components/IncidentReportTabs";
import CreateIncidentReportPanel from "../components/CreateIncidentReportPanel";
import ReportListPanel from "../components/ReportListPanel";
import { getReports } from "../../firebase/getReports";
function IncidentReport() {
  const [value, setValue] = React.useState(0);
  const [reports, setReports] = React.useState([]);
  React.useEffect(() => {
    const unsubscribe = getReports((data) => {
      setReports(data);
    });
    return () => unsubscribe();
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <IncidentReportTabs value={value} handleChange={handleChange} />
      <div className='flex flex-col gap-2'>
        <CreateIncidentReportPanel value={value} />
        <ReportListPanel value={value} reports={reports} />
      </div>
    </div>
  );
}

export default IncidentReport;
