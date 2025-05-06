import app from "../../config/firebase";
import { getDatabase, onValue, off, ref } from "firebase/database";

export const getAllATR = async (callback) => {
  const db = getDatabase(app);
  const atrRef = ref(db, "ATR/");
  const listener = onValue(atrRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const atr = Object.values(data || {});
      callback(atr.flat());
    } else {
      console.log("No ATR available");
      callback([]);
    }
  });

  return () => {
    off(atrRef);
  };
};
