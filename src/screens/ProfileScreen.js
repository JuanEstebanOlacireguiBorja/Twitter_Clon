import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../services/firebase";
import { doc, onSnapshot, collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user info in real time
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const userRef = doc(db, "users", uid);

    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user tweets
  const loadUserTweets = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, "tweets"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    const userTweets = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setTweets(userTweets);
    setLoading(false);
  };

  useEffect(() => {
    loadUserTweets();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toDate().toLocaleString();
  };

  if (loading || !userData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7f5539" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/*Profile Image*/}
      {userData.photoURL ? (
        <Image source={{ uri: userData.photoURL }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No Photo</Text>
        </View>
      )}

      {/* Header (user name + email + username) */}
      <View style={styles.header}>
        <Text style={styles.fullName}>{userData.fullName}</Text>
        <Text style={styles.username}>@{userData.username}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      {/* Counters */}
      <View style={styles.counters}>
        <TouchableOpacity
          style={styles.counterBox}
          onPress={() => navigation.navigate("FollowingList")}
        >
          <Text style={styles.count}>{userData.following}</Text>
          <Text style={styles.label}>Following</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.counterBox}
          onPress={() => navigation.navigate("FollowersList")}
        >
          <Text style={styles.count}>{userData.followers}</Text>
          <Text style={styles.label}>Followers</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.myTweetsLabel}>My Tweets</Text>

      <FlatList
        data={tweets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tweetBox}>
            <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
            <Text style={styles.tweetText}>{item.text}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2efe8",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2efe8",
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#c7b8a3",
  },
  fullName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4d4030",
  },
  username: {
    fontSize: 18,
    color: "#7f5539",
    marginTop: 5,
  },
  email: {
    fontSize: 14,
    color: "#7f5539",
    marginTop: 3,
  },
  counters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
  },
  counterBox: {
    alignItems: "center",
  },
  count: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4d4030",
  },
  label: {
    fontSize: 14,
    color: "#7f5539",
  },
  myTweetsLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4d4030",
    marginBottom: 15,
  },
  tweetBox: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c7b8a3",
  },
  date: {
    fontSize: 12,
    color: "#7f5539",
    marginBottom: 4,
  },
  tweetText: {
    fontSize: 16,
    color: "#4d4030",
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignSelf: "center",
    marginBottom: 20,
  },
  placeholderImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#e6dccf",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderText: {
    color: "#7f5539",
    fontWeight: "bold",
  },
});
