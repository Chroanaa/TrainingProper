import app from "../config/firebase";
import { set, ref, getDatabase } from "firebase/database";

export const createReport = async (reportData) => {
  const db = getDatabase(app);
  const reportRef = ref(db, "reports/" + reportData.id);
  try {
    await set(reportRef, {
      id: reportData.id,
      title: reportData.title,
      description: reportData.description,
      date: reportData.date,
      createdAt: reportData.createdAt,
    });
    console.log("Report created successfully:", reportData);
  } catch (error) {
    console.error("Error creating report:", error);
  }
};
