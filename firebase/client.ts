import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyCo_xAdN6KbrJP3bGxq233EyBZVGvR5Em8",
  authDomain: "mockee-4fef9.firebaseapp.com",
  projectId: "mockee-4fef9",
  storageBucket: "mockee-4fef9.firebasestorage.app",
  messagingSenderId: "798437934515",
  appId: "1:798437934515:web:39ae34a2cf78dfb8a3b7c6",
  measurementId: "G-96CJK37ERS"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);