// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg9QEeR5hyc23misNUixEAkYfgWaTw2tE",
  authDomain: "perfectfit-7c23c.firebaseapp.com",
  projectId: "perfectfit-7c23c",
  storageBucket: "perfectfit-7c23c.firebasestorage.app",
  messagingSenderId: "105772673127",
  appId: "1:105772673127:web:87dc50272cf34584690cc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth= getAuth();
export default app;