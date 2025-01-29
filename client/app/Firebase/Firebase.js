import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHppSS2rtWB_wWo32gj25RrqvB62kTg8c",
  authDomain: "ielts-essay-automator.firebaseapp.com",
  projectId: "ielts-essay-automator",
  storageBucket: "ielts-essay-automator.firebasestorage.app",
  messagingSenderId: "190494860788",
  appId: "1:190494860788:web:01871c32b961bfc48dc5a1",
  measurementId: "G-TXBBGKMBG3",
};

const app = initializeApp(firebaseConfig);
export { app };
export const auth = getAuth(app);
