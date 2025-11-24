import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKw5-wCI2zATnmMhjCk7U9yL5Vl8Xg4LA",
  authDomain: "recipes-9c905.firebaseapp.com",
  projectId: "recipes-9c905",
  storageBucket: "recipes-9c905.firebasestorage.app",
  messagingSenderId: "96496125023",
  appId: "1:96496125023:web:4a34cf58f21a42dfcbc7ea",
  measurementId: "G-LCBT8N8E43",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
