import app from "../config/firebase";
import { getDatabase, ref, onValue, off } from "firebase/database";

export const getReports = (callback) => {
  const db = getDatabase(app);
  const reportsRef = ref(db, "reports");
  const listener = onValue(reportsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      console.log("No reports available");
      callback([]);
      return;
    }
    const reports = Object.keys(data).map((key) => {
      const report = data[key];
      return {
        id: key,
        description: report.description,
        date: report.date,
        createdAt: report.createdAt,
        title: report.title,
      };
    });
    callback(reports);
  });
  return () => {
    off(reportsRef, listener);
  };
};
