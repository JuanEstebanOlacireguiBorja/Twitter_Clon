import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3gL1TDbcEjvEDovHYjw9nz25HR8RidDo",
  authDomain: "twitterclon-cccad.firebaseapp.com",
  projectId: "twitterclon-cccad",
  storageBucket: "twitterclon-cccad.firebasestorage.app",
  messagingSenderId: "1018514795970",
  appId: "1:1018514795970:web:69bb841002249bc5b27a5b"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);
