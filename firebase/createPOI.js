import app from "../config/firebase.js";
import { ref, set, getDatabase } from "firebase/database";

export async function insert(document) {
  const db = getDatabase(app);
  await set(ref(db, "POI/" + document.id), {
    id: document.id,
    title: document.title,
    content: document.content,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt || null,
  });
}
