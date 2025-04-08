import { getDatabase, set, ref } from "firebase/database";
import app from "../config/firebase.js";
export async function saveSchedule(schedule) {
  const db = getDatabase(app);
  const scheduleRef = ref(
    db,
    `schedules/school-year${schedule.schoolYear}/schedule-${schedule.semester}/${schedule.id}`
  );
  await set(scheduleRef, {
    time: schedule.time,
    event: schedule.event,
  });
}
