import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../services/firebase";
import { collection, addDoc, Timestamp, doc, getDoc } from "firebase/firestore";

export default function TweetScreen({ navigation }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // User info from Firestore
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const uid = auth.currentUser.uid;
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserData(snap.data());
      }
    };

    loadUserData();
  }, []);

  const handlePublish = async () => {
    if (!text.trim()) {
      Alert.alert("Error", "Tweet cannot be empty.");
      return;
    }

    if (text.length > 280) {
      Alert.alert("Error", "Tweet cannot exceed 280 characters.");
      return;
    }

    if (!userData) {
      Alert.alert("Error", "Could not load user data.");
      return;
    }

    setLoading(true);

    try {
      const uid = auth.currentUser.uid;

      await addDoc(collection(db, "tweets"), {
        uid,
        fullName: userData.fullName,
        username: userData.username,
        text: text.trim(),
        createdAt: Timestamp.now(),
      });

      setLoading(false);

      Alert.alert("Success", "Tweet published successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Could not publish the tweet.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Write a Tweet</Text>

        <TextInput
          style={styles.textArea}
          placeholder="What's happening?"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={280}
        />

        <Text style={styles.counter}>{text.length} / 280</Text>

        <TouchableOpacity style={styles.button} onPress={handlePublish}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Publish</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

//Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#f2efe8",
  },
  title: {
    fontSize: 26,
    color: "#4d4030",
    fontWeight: "bold",
    marginBottom: 20,
  },
  textArea: {
    height: 180,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#c7b8a3",
    textAlignVertical: "top",
  },
  counter: {
    textAlign: "right",
    marginTop: 5,
    color: "#7f5539",
  },
  button: {
    backgroundColor: "#b08968",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
