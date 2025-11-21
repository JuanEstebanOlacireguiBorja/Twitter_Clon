import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for realtime updates of the user's Firestore document
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const userRef = doc(db, "users", uid);

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigation.replace("Login");
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
      <View style={styles.header}>
        <Text style={styles.logo}>Twitter</Text>

        <View style={styles.userInfo}>
          <Text style={styles.username}>
            {userData.fullName}, @{userData.username}
          </Text>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Followers & Following */}
      <View style={styles.counters}>
        <TouchableOpacity
          style={styles.counterBox}
          onPress={() => navigation.navigate("FollowingList")}
        >
          <Text style={styles.counterNumber}>{userData.following}</Text>
          <Text style={styles.counterLabel}>Following</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.counterBox}
          onPress={() => navigation.navigate("FollowersList")}
        >
          <Text style={styles.counterNumber}>{userData.followers}</Text>
          <Text style={styles.counterLabel}>Followers</Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.tweetButton}
        onPress={() => navigation.navigate("TweetScreen")}
      >
        <Text style={styles.tweetButtonText}>Write a Tweet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.feedButton}
        onPress={() => navigation.navigate("FeedScreen")}
      >
        <Text style={styles.feedButtonText}>View Feed</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.profileButtonText}>My Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2efe8",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2efe8",
  },
  header: {
    paddingVertical: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#c7b8a3",
  },
  logo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4d4030",
  },
  userInfo: {
    marginTop: 10,
  },
  username: {
    fontSize: 18,
    color: "#7f5539",
  },
  logout: {
    marginTop: 5,
    fontSize: 14,
    color: "#b08968",
  },
  counters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 30,
  },
  counterBox: {
    alignItems: "center",
  },
  counterNumber: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4d4030",
  },
  counterLabel: {
    fontSize: 14,
    color: "#7f5539",
  },
  tweetButton: {
    backgroundColor: "#b08968",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  tweetButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  feedButton: {
    backgroundColor: "#7f5539",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  feedButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  profileButton: {
    backgroundColor: "#4d4030",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  profileButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#b08968",
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 15,
  },
    editButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
