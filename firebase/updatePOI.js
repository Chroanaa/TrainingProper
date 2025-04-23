import app from "../config/firebase";
import { getDatabase, ref, set } from "firebase/database";
export const updatePOI = async (id, data) => {
  const db = getDatabase(app);
  const documentRef = ref(db, `POI/${id}`);
  try {
    await set(documentRef, {
      id: id,
      title: data.title,
      content: data.content,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating document:", error);
  }
};
