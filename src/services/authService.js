import { auth, db } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export const loginWithUsername = async (username, password) => {
  try {
    // 1. Buscar el username en Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Username not found");
    }

    // 2. Obtener el email de ese usuario
    const userDoc = querySnapshot.docs[0];
    if (!userDoc) {
      throw new Error("User document not found");
    }
    const userData = userDoc.data();
    const email = userData?.email;
    if (!email) {
      throw new Error("Email not found for this username");
    }

    // 3. Iniciar sesión en Firebase Auth con email
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    return {
      success: true,
      user: userCredential.user,
    };

  } catch (error) {
    let message = "Login failed";

    if (error.message.includes("Username not found"))
      message = "Username does not exist";

    if (error.code === "auth/wrong-password")
      message = "Incorrect password";

    if (error.code === "auth/user-not-found")
      message = "Email not registered";

    return {
      success: false,
      message,
    };
  }
};
