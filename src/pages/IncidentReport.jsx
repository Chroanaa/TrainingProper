import React from "react";
import IncidentReportTabs from "../components/IncidentReport/IncidentReportTabs";
import CreateIncidentReportPanel from "../components/IncidentReport/CreateIncidentReportPanel";
import ReportListPanel from "../components/IncidentReport/ReportListPanel";
import { getReports } from "../../firebase/Report/getReports";
function IncidentReport() {
  const [value, setValue] = React.useState(0);
  const [reports, setReports] = React.useState([]);
  React.useEffect(() => {
    const unsubscribe = getReports((reports) => {
      setReports(reports);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <h1 className='text-[2rem] ml-[1rem]'>Incident Report</h1>

      <IncidentReportTabs value={value} handleChange={handleChange} />
      <div className='flex flex-col gap-2'>
        <CreateIncidentReportPanel value={value} />
        <ReportListPanel value={value} reports={reports} />
      </div>
    </div>
  );
}

export default IncidentReport;
