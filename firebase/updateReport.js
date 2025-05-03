import app from "../config/firebase";
import { getDatabase, ref, update } from "firebase/database";
export const updateReport = async (reportId, updatedReport) => {
  const db = getDatabase(app);
  const reportRef = ref(db, `reports/${reportId}`);
  try {
    await update(reportRef, updatedReport);
    console.log("Report updated successfully");
  } catch (error) {
    console.error("Error updating report:", error);
  }
};
