import app from "../../config/firebase.js";
import { getDatabase, ref, set } from "firebase/database";

const db = getDatabase(app);
export const insertDocument = async (document) => {
  const { id, name, type, size, status } = document;
  const documentRef = ref(db, `documents/${id}`);
  try {
    await set(documentRef, {
      id,
      name,
      status,
    });
    console.log("Document inserted successfully");
  } catch (error) {
    console.error("Error inserting document:", error);
  }
};
