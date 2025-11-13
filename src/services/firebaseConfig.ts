import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyADBQPjFOI_uVB5Iy3brKrBULtcFR1FxrM",
  authDomain: "twitter-clon-f44e1.firebaseapp.com",
  projectId: "twitter-clon-f44e1",
  storageBucket: "twitter-clon-f44e1.firebasestorage.app",
  messagingSenderId: "361579329029",
  appId: "1:361579329029:web:aea6ca1a93743b3879ce6c",
  measurementId: "G-2E9HXEW8C2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Servicios que exporta la app
export const auth = getAuth(app);
export const db = getFirestore(app);
