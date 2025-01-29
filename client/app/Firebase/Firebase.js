// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHppSS2rtWB_wWo32gj25RrqvB62kTg8c",
  authDomain: "ielts-essay-automator.firebaseapp.com",
  projectId: "ielts-essay-automator",
  storageBucket: "ielts-essay-automator.firebasestorage.app",
  messagingSenderId: "190494860788",
  appId: "1:190494860788:web:01871c32b961bfc48dc5a1",
  measurementId: "G-TXBBGKMBG3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth(app);
