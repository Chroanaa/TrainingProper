import app from "../config/firebase";
import { getDatabase, get, ref, child } from "firebase/database";
export const getDocument = async (id) => {
  const db = ref(getDatabase(app));
  const snapshot = await get(child(db, `documents/${id}`));
  if (!snapshot.exists()) {
    console.log("No data available");
    return null;
  }
  const data = snapshot.val();
  const document = {
    id: id,
    title: data.title,
    content: data.content,
    createdAt: data.createdAt,
  };
  return document;
};
