import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { collection, query, where, getDocs, limit } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";

export default function FollowersScreen({ route }) {
  const { userId } = route.params;
  const [followers, setFollowers] = useState([]);
  const [pageSize] = useState(10);

  useEffect(() => {
    const loadFollowers = async () => {
      const ref = collection(db, "follows");
      const q = query(ref, where("followingUid", "==", userId), limit(pageSize));
      const snap = await getDocs(q);
      const hits = snap.docs.map(d => d.data());
      setFollowers(hits);
    };
    loadFollowers();
  }, [userId, pageSize]);

  return (
    <View style={styles.container}>
      <FlatList
        data={followers}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => <FollowerRow follower={item} />}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

function FollowerRow({ follower }) {
  return (
    <View style={styles.row}>
      <Text>{follower.followerUid}</Text>
      <TouchableOpacity style={styles.followButton}>
        <Text style={{ color: "#fff" }}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F4F3" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 8 },
  followButton: { backgroundColor: "#2D6A4F", padding: 8, borderRadius: 6 }
});
