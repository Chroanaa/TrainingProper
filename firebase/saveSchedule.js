import { getDatabase, set, ref } from "firebase/database";
import app from "../config/firebase.js";

export async function saveSchedule(schedule) {
  const db = getDatabase(app);
  const scheduleRef = ref(
    db,
    `schedules/${schedule.semester}/${schedule.trainingDay}`
  );
  await set(scheduleRef, {
    trainingDay: schedule.trainingDay,
    semester: schedule.semester,
    time: schedule.time,
    event: schedule.event,
  });
}
