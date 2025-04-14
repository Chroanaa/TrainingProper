import React from "react";
import app from "../config/firebase.js";
import { useNavigate } from "react-router-dom";
import { ref, set, getDatabase } from "firebase/database";

export async function insert(document) {
  const db = getDatabase(app);
  await set(ref(db, "ATR/" + document.id), {
    id: document.id,
    title: document.title,
    content: document.content,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt || null,
  });
}
