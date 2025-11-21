import React, { useState } from "react";
import { Text,TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerUser } from "../services/registerService";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async () => {
    setErrorMsg("");

    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setErrorMsg("Username can only contain letters, numbers and underscore.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const result = await registerUser(
      fullName.trim(),
      username.trim().toLowerCase(),
      email.trim().toLowerCase(),
      password
    );

    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.message);
      return;
    }

    // Success → redirect to Home
    navigation.replace("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#f2efe8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#4d4030",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#c7b8a3",
  },
  button: {
    backgroundColor: "#b08968",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    color: "#7f5539",
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },
});
