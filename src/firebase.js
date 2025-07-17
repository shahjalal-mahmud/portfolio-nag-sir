// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcb8IwbNZ40bWh2q2GPC3PwJMwQ1jqwoU",
  authDomain: "portfolio-nag-sir.firebaseapp.com",
  projectId: "portfolio-nag-sir",
  storageBucket: "portfolio-nag-sir.firebasestorage.app",
  messagingSenderId: "716075794237",
  appId: "1:716075794237:web:d2504f9a7257e608888f54",
  measurementId: "G-GFZR9V30XY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
