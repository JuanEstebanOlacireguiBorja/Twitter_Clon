import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { db, doc, getDoc } from "../firebase/firebaseConfig";

export default function TweetItem({ tweet }) {
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadAuthor = async () => {
      try {
        const docRef = doc(db, "users", tweet.authorUid);
        const snap = await getDoc(docRef);
        if (snap.exists() && mounted) {
          setAuthor(snap.data());
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadAuthor();
    return () => (mounted = false);
  }, [tweet]);

  const ts = tweet.createdAt?.toDate ? tweet.createdAt.toDate().toLocaleString() : "";

  return (
    <View style={styles.card}>
      <Text style={styles.header}>
        {author ? author.fullName : "Unknown"}, @{author ? author.username : "unknown"} - {ts}
      </Text>
      <Text style={styles.body}>{tweet.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 10 },
  header: { fontWeight: "700", marginBottom: 8, color: "#354F52" },
  body: { color: "#333" }
});
