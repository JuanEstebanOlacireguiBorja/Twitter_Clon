import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { auth, db, createUserWithEmailAndPassword, doc, setDoc, collection } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onRegister = async () => {
    if (!fullName || !username || !email || !password) {
      Alert.alert("Validation", "Please fill all fields.");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        Alert.alert("Error", "Username already taken.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        fullName,
        username,
        email,
        followersCount: 0,
        followingCount: 0,
        createdAt: serverTimestamp()
      });

      Alert.alert("Success", "Account created.");
      navigation.replace("Home");
    } catch (error) {
      console.log(error);
      Alert.alert("Registration error", error.message || "An error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder="Full name" style={styles.input} value={fullName} onChangeText={setFullName} />
      <TextInput placeholder="Username (no @)" style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={onRegister}>
        <Text style={styles.buttonText}>Create account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 12 }}>
        <Text style={{ color: "#2D6A4F" }}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

import { query, where, getDocs, serverTimestamp } from "firebase/firestore";

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#F2F4F3" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20, color: "#354F52" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: "#2D6A4F", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" }
});
