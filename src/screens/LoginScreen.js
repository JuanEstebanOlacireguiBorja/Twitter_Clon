import { useState } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { loginWithUsername } from "../services/authService";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlelogin = async () => {
    setLoading(true);
    setErrorMsg("");

    const result = await loginWithUsername(username.trim(), password);
    setLoading(false);
    if (!result.success) {
        setErrorMsg(result.message);
        return;
    }
    // Inicio de sesion exitoso, redirigir al usuario a la pantalla principal
    navigation.replace("Home");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Log in</Text>
        
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      {/*Username*/}
      <TextInput
        style={styles.input}
        placeholder= "Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      {/*Password*/}
      <TextInput
        style={styles.input}
        placeholder= "Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* Botón de inicio de sesión */}
      <TouchableOpacity style={styles.button} onPress={handlelogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Botón de registro */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>don't have an account? Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

//Estilos
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
  }
});
