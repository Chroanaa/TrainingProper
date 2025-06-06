import app from "../../config/firebase";
import { getDatabase, ref, onValue, off } from "firebase/database";

export const getSchedules = (callback) => {
  const db = getDatabase(app);
  const schedulesRef = ref(db, "schedules/");

  const listener = onValue(
    schedulesRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const schedules = Object.keys(data).map((trainingDay) => {
          const semesters = data[trainingDay];
          return Object.keys(semesters).map((semester) => {
            const schedule = semesters[semester];
            return {
              trainingDay: trainingDay,
              semester: semester,
              time: schedule.time,
              event: schedule.event,
            };
          });
        });
        callback(schedules.flat());
      } else {
        console.log("No schedules available");
        callback([]);
      }
    },
    (error) => {
      console.error("Error fetching schedules:", error);
    }
  );

  return () => {
    off(schedulesRef);
  };
};
