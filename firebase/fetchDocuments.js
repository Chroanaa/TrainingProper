import { get, getDatabase, ref } from "firebase/database";
import app from "../config/firebase.js";
const db = getDatabase(app);
export const fetchDocuments = async () => {
  const dbRef = ref(db, "documents/");
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    const documents = Object.values(data || {});
    return documents;
  } else {
    console.log("No data available");
    return null;
  }
};
