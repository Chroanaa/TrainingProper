import app from "../../config/firebase";
import { getDatabase, ref, set } from "firebase/database";
export const updateATR = async (id, data) => {
  const db = getDatabase(app);
  const documentRef = ref(db, `ATR/${id}`);
  try {
    await set(documentRef, {
      id: id,
      title: data.title,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating document:", error);
  }
};
