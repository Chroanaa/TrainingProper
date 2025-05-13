import app from "../../config/firebase.js";
import { getDatabase, ref, onValue, child, off } from "firebase/database";

export const getReportDates = async (callback) => {
  const db = getDatabase(app);
  const dbRef = ref(db, "reports");
  const listener = onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      console.log("No reports available");
      callback([]);
      return;
    }
    const reportDates = Object.keys(data).map((key) => {
      const report = data[key];
      return {
        id: key,
        date: report.date,
      };
    });
    const uniqueDates = [...new Set(reportDates.map((report) => report.date))];
    const sortedDates = uniqueDates.sort((a, b) => new Date(b) - new Date(a));
    callback(sortedDates);
  });
  return () => {
    off(dbRef);
  };
};
