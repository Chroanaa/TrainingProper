import app from "../config/firebase";
import { getDatabase, ref, remove } from "firebase/database";
export const deleteSchedule = async (semester, trainingDay) => {
  const db = getDatabase(app);
  const scheduleRef = ref(db, `schedules/${semester}/${trainingDay}`);
  await remove(scheduleRef);
};
