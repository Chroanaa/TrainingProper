import app from "../config/firebase";
import { getDatabase, ref, remove } from "firebase/database";
const db = getDatabase(app);

export const deleteATR = async (id) => {
  const atrRef = ref(db, `ATR/${id}`);
  try {
    await remove(atrRef);
    console.log("ATR deleted successfully");
  } catch (error) {
    console.error("Error deleting ATR:", error);
  }
};
