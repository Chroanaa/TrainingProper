import app from "../config/firebase";
import { getDatabase, ref, remove } from "firebase/database";

export const deleteReport = async (reportId) => {
  const db = getDatabase(app);
  const reportRef = ref(db, `reports/${reportId}`);
  await remove(reportRef);
};
