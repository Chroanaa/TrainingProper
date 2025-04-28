import app from "../config/firebase";
import { getDatabase, ref, get, child } from "firebase/database";
export const getSchedule = async (semester) => {
  const db = ref(getDatabase(app));
  const snapshot = await get(child(db, `schedules/${semester}`));
  console.log(semester);
  if (!snapshot.exists()) {
    console.log("No data available");
    return null;
  }
  const data = snapshot.val();
  return data;
};
