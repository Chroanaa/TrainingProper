import app from "../../config/firebase";
import { get, ref, getDatabase } from "firebase/database";
import bcrypt from "bcryptjs";
export const auth = async (username, password) => {
  const db = getDatabase(app);
  const userRef = ref(db, "user");
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    const users = snapshot.val();
    if (users.username === username) {
      const isPasswordValid = await bcrypt.compare(password, users.password);
      if (isPasswordValid) {
        return true;
      } else {
        throw new Error("Invalid username or password");
      }
    }
  }
};
