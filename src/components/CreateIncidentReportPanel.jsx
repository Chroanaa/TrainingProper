import React from "react";
import CustomTabPanel from "./CustomTabPanel";
import { createReport } from "../../firebase/createReport";
function CreateIncidentReportPanel({ value }) {
  const [report, setReport] = React.useState({
    description: "",
    date: "",
    createdAt: new Date().toISOString(),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    createReport({
      id: `${report.description}-${report.date}`,
      description: report.description,
      date: report.date,
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        console.log("Report submitted successfully");
      })
      .catch((error) => {
        console.error("Error submitting report:", error);
      });
    console.log(report);
  };

  return (
    <div>
      <CustomTabPanel value={value} index={1}>
        <h2 className='text-[1.5rem]'>Create Incident Report</h2>
        <p>Fill out the form to create a new incident report.</p>

        <div>
          <label htmlFor='incident-description'>Incident Description:</label>
          <textarea
            id='incident-description'
            name='description'
            rows='4'
            cols='50'
            onChange={handleChange}
            value={report.description || ""}
          ></textarea>
        </div>
        <div>
          <label htmlFor='incident-date'>Incident Date:</label>
          <input
            type='date'
            name='date'
            onChange={handleChange}
            value={report.date || ""}
            id='incident-date'
          />
        </div>
        <button type='submit' onClick={handleSubmit}>
          Submit Report
        </button>
      </CustomTabPanel>
    </div>
  );
}

export default CreateIncidentReportPanel;
