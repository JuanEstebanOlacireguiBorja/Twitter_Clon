import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import { auth, db, addDoc, collection, serverTimestamp } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function NewTweetScreen() {
  const [text, setText] = useState("");
  const navigation = useNavigation();

  const onPost = async () => {
    if (!text.trim()) {
      Alert.alert("Validation", "Tweet cannot be empty.");
      return;
    }
    if (text.length > 280) {
      Alert.alert("Validation", "Tweet must be 280 characters or less.");
      return;
    }

    try {
      const tweetsRef = collection(db, "tweets");
      await addDoc(tweetsRef, {
        text,
        authorUid: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      Alert.alert("Success", "Tweet published.");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not publish tweet.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's happening?"
        multiline
        numberOfLines={4}
        maxLength={280}
        value={text}
        onChangeText={setText}
      />
      <Text style={{ alignSelf: "flex-end", marginBottom: 8 }}>{text.length}/280</Text>
      <TouchableOpacity style={styles.button} onPress={onPost}>
        <Text style={styles.buttonText}>Publish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F2F4F3" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, minHeight: 120, textAlignVertical: "top" },
  button: { backgroundColor: "#2D6A4F", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" }
});
