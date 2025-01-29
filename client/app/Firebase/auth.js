import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { app } from "./Firebase";
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Sign-in
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-in Error:", error);
    return null;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
