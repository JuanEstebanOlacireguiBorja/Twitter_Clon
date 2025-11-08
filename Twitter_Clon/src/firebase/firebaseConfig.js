import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/firestore";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  startAfter
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjBJOMpxEqBtL5IHVlhm7F5eHXahDVL7Y",
  authDomain: "twitterclon-f298e.firebaseapp.com",
  projectId: "twitterclon-f298e",
  storageBucket: "twitterclon-f298e.firebasestorage.app",
  messagingSenderId: "767277326490",
  appId: "1:767277326490:web:3b2f44a52e4bd3c4657f23",
  measurementId: "G-3KZEQ5S4G5"
};

const app = initializeApp(firebaseConfig);

export const storege = getStorage(app);
export const db = getFirestore(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  startAfter
};
