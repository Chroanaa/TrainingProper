import app from "../../config/firebase";
import { getDatabase, ref, get } from "firebase/database";

export const getReportByDate = async (date) => {
  const db = getDatabase(app);
  const reportRef = ref(db, "reports/");
  try {
    const snapshot = await get(reportRef);
    const reports = snapshot.val();

    if (!reports) return [];

    const reportList = Object.values(reports);
    const filteredReports = reportList
      .filter((report) => report.date === date)
      .map((report) => ({
        id: report.id,
        description: report.description,
        date: report.date,
        createdAt: report.createdAt,
        title: report.title,
      }));

    return filteredReports;
  } catch (error) {
    console.error("Error fetching report:", error);
    return [];
  }
};
