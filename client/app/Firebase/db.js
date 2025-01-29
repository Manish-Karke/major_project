import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import app from "./Firebase";
const db = getFirestore(app);

// Add a message to Firestore
export const addMessage = async (message, userId) => {
  try {
    await addDoc(collection(db, "messages"), {
      text: message,
      userId,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error adding message:", error);
  }
};

// Get messages from Firestore
export const getMessages = async () => {
  const querySnapshot = await getDocs(collection(db, "messages"));
  return querySnapshot.docs.map(doc => doc.data());
};
