import app from "../../config/firebase";
import { getDatabase, ref, get, child } from "firebase/database";
export const viewATR = async (id) => {
  const db = getDatabase(app);
  const atrRef = ref(db, "ATR/");
  const atrSnapshot = await get(child(atrRef, id));
  if (atrSnapshot.exists()) {
    return atrSnapshot.val();
  } else {
    console.log("No ATR available");
    return null;
  }
};
