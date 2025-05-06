import app from "../../config/firebase";
import { getDatabase, ref, child, get } from "firebase/database";

export const getReport = async (reportId) => {
  const db = ref(getDatabase(app));

  try {
    const snapshot = await get(child(db, "reports/" + reportId));
    const report = snapshot.val();
    return report;
  } catch (error) {
    console.error("Error fetching report:", error);
    return null;
  }
};
