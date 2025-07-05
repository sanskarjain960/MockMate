

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVPTkj3a6rI4Q4FLGrJTFCZfUtOSTk_lw",
  authDomain: "mockmate-fca7e.firebaseapp.com",
  projectId: "mockmate-fca7e",
  storageBucket: "mockmate-fca7e.firebasestorage.app",
  messagingSenderId: "111823975735",
  appId: "1:111823975735:web:907ca079d886b5d20896b2",
  measurementId: "G-WX2X5KPRTQ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);