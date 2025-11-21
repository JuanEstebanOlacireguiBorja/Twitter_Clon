import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../services/firebase";
import { getFollowersUsers, followUser, isFollowing } from "../services/followerService";

export default function FollowersList({ navigation }) {
  const [users, setUsers] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const currentUid = auth.currentUser.uid;

  useEffect(() => {
    loadFollowers();
  }, []);

  const loadFollowers = async () => {
    setLoading(true);

    const { users: newUsers, lastDoc: newLast } =
      await getFollowersUsers(currentUid);

    setUsers(newUsers);
    setLastDoc(newLast);
    setLoading(false);
  };

  const loadMore = async () => {
    if (!lastDoc) return;

    setLoadingMore(true);

    const { users: moreUsers, lastDoc: newLast } =
      await getFollowersUsers(currentUid, lastDoc);

    setUsers([...users, ...moreUsers]);
    setLastDoc(newLast);
    setLoadingMore(false);
  };

  const handleFollow = async (targetUid) => {
    const alreadyFollowing = await isFollowing(currentUid, targetUid);
    if (alreadyFollowing) return;

    await followUser(currentUid, targetUid);
  };

  const renderUser = ({ item }) => (
    <View style={styles.userBox}>
      <TouchableOpacity
        onPress={() => navigation.navigate("UserTweets", { userId: item.id })}
      >
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.username}>@{item.username}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.followBtn}
        onPress={() => handleFollow(item.id)}
      >
        <Text style={styles.followText}>Follow</Text>
      </TouchableOpacity>
    </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4d4030",
  },
  username: {
    color: "#7f5539",
    marginTop: 3,
  },
  followBtn: {
    backgroundColor: "#b08968",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  followText: {
    color: "white",
    fontWeight: "bold",
  },
});
