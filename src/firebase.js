import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with Real Keys provided by User
const firebaseConfig = {
  apiKey: "AIzaSyA6uU13Dre7yVpk68d2Z46fOJxLT8FMdmw",
  authDomain: "bling-app-e40c6.firebaseapp.com",
  projectId: "bling-app-e40c6",
  storageBucket: "bling-app-e40c6.firebasestorage.app",
  messagingSenderId: "551671994384",
  appId: "1:551671994384:web:1d6a4abd2d5aa63357d295"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);