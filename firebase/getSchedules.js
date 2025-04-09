import app from "../config/firebase";
import { getDatabase, ref, onValue } from "firebase/database";

export const getSchedules = () => {
  return new Promise((resolve, reject) => {
    const db = getDatabase(app);
    const schedulesRef = ref(db, "schedules/");
    onValue(
      schedulesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const schedules = Object.keys(data).map((schoolYear) => {
            const semesters = data[schoolYear];
            return Object.keys(semesters).map((semester) => {
              const schedule = semesters[semester];
              return {
                schoolyear: schoolYear,
                semester: semester,
                time: schedule.time,
                event: schedule.event,
              };
            });
          });
          resolve(schedules.flat());
        } else {
          console.log("No schedules available");
          resolve([]);
        }
      },
      (error) => {
        console.error("Error fetching schedules:", error);
        reject(error);
      }
    );
  });
};
