import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc, collection, where, query, getDocs } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { upLoadProfileImage } from "../services/upLoadImageService";

export default function EditProfileScreen({ navigation }) {
  const uid = auth.currentUser.uid;

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const loadUser = async () => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setFullName(snap.data().fullName);
      setUsername(snap.data().username);
      setEmail(snap.data().email);
      setProfileImage(snap.data().photoURL || null);
    }
    setLoading(false);
  };

  const validateUsername = async (newUsername) => {
    const q = query(
      collection(db, "users"),
      where("username", "==", newUsername)
    );

    const snap = await getDocs(q);

    if (snap.empty) return true;

    // If username exists but belongs to current user, OK
    if (snap.docs[0].id === uid) return true;

    return false;
  };

  const handleSave = async () => {

    let photoURL = profileImage;

    if (profileImage) {
      const uploadedURL = await upLoadProfileImage(uid, profileImage);
      if (uploadedURL) photoURL = uploadedURL;
    }

    if (!fullName.trim() || !username.trim() || !email.trim()) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      Alert.alert(
        "Invalid Username",
        "Username can only contain letters, numbers and underscore."
      );
      return;
    }

    setSaving(true);

    const usernameOK = await validateUsername(username.trim().toLowerCase());
    if (!usernameOK) {
      setSaving(false);
      Alert.alert("Error", "Username is already taken.");
      return;
    }

    try {
      await updateDoc(doc(db, "users", uid), {
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        photoURL: photoURL,
      });

      setSaving(false);
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setSaving(false);
      Alert.alert("Error", "Could not update profile.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7f5539" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* Profile Image */}
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <Text style={styles.addPhotoText}>Choose Photo</Text>
        )}
      </TouchableOpacity>

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
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2efe8",
    padding: 25,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4d4030",
    textAlign: "center",
    marginBottom: 30,
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
    backgroundColor: "#7f5539",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  imageBox: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#e6dccf",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 25,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 65,
  },
  addPhotoText: {
    color: "#7f5539",
    fontWeight: "bold",
  },
});
