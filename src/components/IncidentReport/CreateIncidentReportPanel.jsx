import React from "react";
import CustomTabPanel from "../ui/CustomTabPanel";
import { createReport } from "../../../firebase/Report/createReport";
import ConfirmDialog from "../ui/ConfirmDialog";
import { saveToLocalStorage } from "../../utils/saveToLocalStorage";

function CreateIncidentReportPanel({ value }) {
  const [report, setReport] = React.useState({
    description: "",
    date: "",
    createdAt: new Date().toISOString(),
  });
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
    saveToLocalStorage("report", JSON.stringify(report));
  };

  React.useEffect(() => {
    if (value === 1) {
      const storedReport = localStorage.getItem("report");
      if (storedReport) {
        setReport(JSON.parse(storedReport));
      }
    }
  }, []);

  React.useEffect(() => {
    const storedReport = localStorage.getItem("report");
    if (storedReport) {
      setReport(JSON.parse(storedReport));
    }
  }, []);

  const handleSubmit = () => {
    createReport({
      id: `${report.description}-${report.date}`,
      title: report.title,
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

    setReport({
      description: "",
      date: "",
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div>
      <CustomTabPanel value={value} index={1}>
        <div className="max-w-2xl p-2 mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Create Incident Report
            </h2>
            <p className="text-gray-500">
              Fill out the form to create a new incident report.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="incident-title"
                className="block text-sm font-medium text-gray-700"
              >
                Incident Title
              </label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                value={report.title || ""}
                id="incident-title"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="incident-description"
                className="block text-sm font-medium text-gray-700"
              >
                Incident Description
              </label>
              <textarea
                id="incident-description"
                name="description"
                rows="4"
                cols="50"
                onChange={handleChange}
                value={report.description || ""}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="incident-date"
                className="block text-sm font-medium text-gray-700"
              >
                Incident Date
              </label>
              <input
                type="date"
                name="date"
                onChange={handleChange}
                value={report.date || ""}
                id="incident-date"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              onClick={() => setOpenConfirmDialog(true)}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Report
            </button>
          </div>

          <ConfirmDialog
            open={openConfirmDialog}
            onClose={() => setOpenConfirmDialog(false)}
            onConfirm={() => {
              handleSubmit();
              setOpenConfirmDialog(false);
            }}
            title="Confirm Submission"
            message="Are you sure you want to submit this report?"
          />
        </div>
      </CustomTabPanel>
    </div>
  );
}

export default CreateIncidentReportPanel;
