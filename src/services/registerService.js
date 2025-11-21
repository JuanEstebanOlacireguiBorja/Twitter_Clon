import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";

/**
 * Register a new user in Firebase Auth and Firestore
 */
export const registerUser = async (fullName, username, email, password) => {
  try {
    // ---------- VALIDATE USERNAME ----------
    const usernameQuery = query(
      collection(db, "users"),
      where("username", "==", username)
    );
    const usernameSnap = await getDocs(usernameQuery);

    if (!usernameSnap.empty) {
      throw new Error("USERNAME_TAKEN");
    }

    // ---------- VALIDATE EMAIL ----------
    const emailQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const emailSnap = await getDocs(emailQuery);

    if (!emailSnap.empty) {
      throw new Error("EMAIL_TAKEN");
    }

    // ---------- CREATE AUTH USER ----------
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!userCredential.user || !userCredential.user.uid) {
      throw new Error("USER_CREATION_FAILED");
    }
    const uid = userCredential.user.uid;

    // ---------- CREATE USER PROFILE IN FIRESTORE ----------
    const userRef = doc(db, "users", uid);

    await setDoc(userRef, {
      fullName,
      username,
      email,
      followers: 0,
      following: 0,
      createdAt: Date.now(),
    });

    // ---------- INITIALIZE SUBCOLLECTIONS ----------
    // These subcollections exist logically by adding documents later.
    // No need to precreate them, but you can initialize empty data if desired.

    return {
      success: true,
      uid,
    };

  } catch (error) {
    // ---------- HANDLE ERROR CODES ----------
    let message = "Registration failed";

    if (error.code === "auth/weak-password")
      message = "The password is too weak";

    if (error.code === "auth/invalid-email")
      message = "Invalid email format";

    if (error.code === "auth/email-already-in-use")
      message = "Email is already registered";

    if (error.message === "USERNAME_TAKEN")
      message = "Username is already taken";

    if (error.message === "USER_CREATION_FAILED")
      message = "Failed to create user account";

    return {
      success: false,
      message,
    };
  }
};
