import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { auth, signInWithEmailAndPassword } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation", "Please enter email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Home");
    } catch (error) {
      console.log(error);
      Alert.alert("Login error", error.message || "An error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 12 }}>
        <Text style={{ color: "#2D6A4F" }}>No account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#F2F4F3" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20, color: "#354F52" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: "#2D6A4F", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" }
});
