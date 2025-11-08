import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import TweetItem from "../components/TweetItem";
import { auth, db, collection, query, orderBy, limit, onSnapshot } from "../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tweetsRef = collection(db, "tweets");
    const q = query(tweetsRef, orderBy("createdAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTweets(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const goNewTweet = () => navigation.navigate("NewTweet");
  const logout = async () => {
    await auth.signOut();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Header title="Home" onLogout={logout} />
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={goNewTweet}>
          <Text style={styles.buttonText}>New Tweet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#6C7A89" }]} onPress={() => navigation.navigate("Following")}>
          <Text style={styles.buttonText}>Following</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={tweets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TweetItem tweet={item} />}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F4F3" },
  actions: { flexDirection: "row", justifyContent: "space-between", padding: 12 },
  button: { backgroundColor: "#2D6A4F", padding: 10, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "600" }
});
