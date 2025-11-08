import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { doc, getDoc, collection, query, where, orderBy, getDocs, addDoc, updateDoc } from "../firebase/firebaseConfig";
import { db, auth } from "../firebase/firebaseConfig";
import TweetItem from "../components/TweetItem";

export default function UserProfileScreen({ route, navigation }) {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const userSnap = await getDoc(doc(db, "users", userId));
      if (userSnap.exists()) setUser(userSnap.data());

      const tweetsRef = collection(db, "tweets");
      const q = query(tweetsRef, where("authorUid", "==", userId), orderBy("createdAt", "desc"), limit(10));
      const snap = await getDocs(q);
      setTweets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, [userId]);

  const onFollow = async () => {
    try {
      const followRef = collection(db, "follows");
      await addDoc(followRef, {
        followerUid: auth.currentUser.uid,
        followingUid: userId,
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, "users", userId), { followersCount: (user.followersCount || 0) + 1 });
      setFollowing(true);
      Alert.alert("Success", "You are now following this user.");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not follow user.");
    }
  };

  return (
    <View style={styles.container}>
      {user && (
        <>
          <View style={styles.header}>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text>@{user.username}</Text>
            <Text>{user.followersCount || 0} followers • {user.followingCount || 0} following</Text>
            {!following && (
              <TouchableOpacity style={styles.button} onPress={onFollow}>
                <Text style={styles.buttonText}>Follow</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={tweets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TweetItem tweet={item} />}
            contentContainerStyle={{ padding: 12 }}
          />
        </>
      )}
    </View>
  );
}

import { limit, serverTimestamp } from "firebase/firestore";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F4F3" },
  header: { padding: 12, backgroundColor: "#fff", margin: 12, borderRadius: 8 },
  name: { fontSize: 20, fontWeight: "700", color: "#354F52", marginBottom: 4 },
  button: { marginTop: 8, backgroundColor: "#2D6A4F", padding: 8, borderRadius: 8, alignSelf: "flex-start" },
  buttonText: { color: "#fff", fontWeight: "600" }
});
