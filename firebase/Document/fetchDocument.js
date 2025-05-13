import app from "../../config/firebase";
import { getDatabase, ref, onValue } from "firebase/database";

export const fetchDocument = () => {
  const listener = (callback) => {
    const db = getDatabase(app);
    const documentRef = ref(db, "documents");
    onValue(documentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const documents = Object.values(data);
        callback(documents);
      } else {
        callback([]);
      }
    });
  };
};
