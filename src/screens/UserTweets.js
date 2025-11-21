import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { collection, query, where, orderBy, limit, getDocs, startAfter } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../services/firebase";

export default function UserTweets({ route }) {
  const { userId } = route.params;

  const [tweets, setTweets] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load user profile
  const loadUserInfo = async () => {
    const snap = await getDocs(
      query(collection(db, "users"), where("__name__", "==", userId))
    );

    if (!snap.empty) {
      setUserInfo(snap.docs[0].data());
    }
  };

  // Load tweets
  const loadTweets = async () => {
    const q = query(
      collection(db, "tweets"),
      where("uid", "==", userId),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const snap = await getDocs(q);

    const userTweets = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const lastVisible =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

    setTweets(userTweets);
    setLastDoc(lastVisible);
    setLoading(false);
  };

  // Load more tweets on scroll
  const loadMore = async () => {
    if (!lastDoc || loadingMore) return;

    setLoadingMore(true);

    const q = query(
      collection(db, "tweets"),
      where("uid", "==", userId),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(10)
    );

    const snap = await getDocs(q);

    const moreTweets = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const lastVisible =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

    setTweets((prev) => [...prev, ...moreTweets]);
    setLastDoc(lastVisible);
    setLoadingMore(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTweets();
    setRefreshing(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toDate().toLocaleString();
  };

  useEffect(() => {
    (async () => {
      await loadUserInfo();
      await loadTweets();
    })();
  }, []);

  const renderTweet = ({ item }) => (
    <View style={styles.tweetBox}>
      <Text style={styles.headerText}>
        {userInfo?.fullName}, @{userInfo?.username} -{" "}
        {formatDate(item.createdAt)}
      </Text>
      <Text style={styles.bodyText}>{item.text}</Text>
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
        {userInfo && (
            <Text style={styles.title}>
            Tweets by {userInfo.fullName} (@{userInfo.username})
            </Text>
        )}

        <FlatList
            data={tweets}
            renderItem={renderTweet}
            keyExtractor={(item) => item.id}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
            loadingMore && <ActivityIndicator color="#7f5539" />
            }
            refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#7f5539"
            />
            }
        />
        </View>
    </SafeAreaView>
  );
}

// Styles
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4d4030",
    marginBottom: 15,
  },
  tweetBox: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c7b8a3",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4d4030",
    marginBottom: 5,
  },
  bodyText: {
    fontSize: 16,
    color: "#7f5539",
  },
});
