import app from "../config/firebase";
import { getDatabase, onValue, off, ref } from "firebase/database";

export const fetchPOIS = async (callback) => {
  const db = getDatabase(app);
  const atrRef = ref(db, "POI/");
  const listener = onValue(atrRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const atr = Object.values(data || {});
      callback(atr.flat());
    } else {
      callback([]);
    }
  });

  return () => {
    off(atrRef);
  };
};
