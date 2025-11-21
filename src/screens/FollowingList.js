import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "../services/firebase";
import { getFollowingUsers } from "../services/followingService";

export default function FollowingList({ navigation }) {
  const [users, setUsers] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const uid = auth.currentUser.uid;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);

    const { users: newUsers, lastDoc: newLast } = await getFollowingUsers(uid);

    setUsers(newUsers);
    setLastDoc(newLast);
    setLoading(false);
  };

  const loadMore = async () => {
    if (!lastDoc) return;

    setLoadingMore(true);

    const { users: moreUsers, lastDoc: newLast } = await getFollowingUsers(
      uid,
      lastDoc
    );

    setUsers([...users, ...moreUsers]);
    setLastDoc(newLast);
    setLoadingMore(false);
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userBox}
      onPress={() => navigation.navigate("UserTweets", { userId: item.id })}
    >
      <Text style={styles.name}>{item.fullName}</Text>
      <Text style={styles.username}>@{item.username}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7f5539" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={renderUser}
                keyExtractor={(item) => item.id}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loadingMore && <ActivityIndicator color="#7f5539" />
                }
            />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2efe8",
    padding: 15,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userBox: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c7b8a3",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4d4030",
  },
  username: {
    color: "#7f5539",
  },
});
