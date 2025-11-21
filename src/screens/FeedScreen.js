import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  doc,
  getDoc
} from "firebase/firestore";

import { db, auth } from "../services/firebase";
import { useFollow } from "../hooks/useFollow";

export default function FeedScreen({ navigation }) {
  const currentUid = auth.currentUser.uid;

  const [tweets, setTweets] = useState([]);
  const [userProfiles, setUserProfiles] = useState({}); // cache de perfiles
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTweets();
  }, []);

  // Cargar usuario por UID (solo 1 vez → cache)
  const loadUserProfile = async (uid) => {
    if (userProfiles[uid]) return userProfiles[uid];

    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setUserProfiles((prev) => ({ ...prev, [uid]: data }));
      return data;
    }

    return null;
  };

  const loadTweets = async () => {
    setLoading(true);

    const q = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const snap = await getDocs(q);

    const newTweets = [];

    for (let d of snap.docs) {
      const tweetData = d.data();
      const profile = await loadUserProfile(tweetData.uid);

      newTweets.push({
        id: d.id,
        ...tweetData,
        user: profile,
      });
    }

    const lastVisible =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

    setTweets(newTweets);
    setLastDoc(lastVisible);
    setLoading(false);
  };

  const loadMore = async () => {
    if (!lastDoc || loadingMore) return;

    setLoadingMore(true);

    const q = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(10)
    );

    const snap = await getDocs(q);

    const moreTweets = [];

    for (let d of snap.docs) {
      const tweetData = d.data();
      const profile = await loadUserProfile(tweetData.uid);

      moreTweets.push({
        id: d.id,
        ...tweetData,
        user: profile,
      });
    }

    const lastVisible =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

    setTweets((prev) => [...prev, ...moreTweets]);
    setLastDoc(lastVisible);
    setLoadingMore(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setUserProfiles({});
    await loadTweets();
    setRefreshing(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toDate().toLocaleString();
  };

  const renderTweet = ({ item }) => {
    const isMine = item.uid === currentUid;

    // Hook follow (solo si no es mío)
    const { following, loading: followLoading, follow, unfollow } =
      !isMine ? useFollow(item.uid) : { following: false, loading: false };

    return (
      <View style={styles.tweetContainer}>
        {/* Foto + nombre */}
        <TouchableOpacity
          style={styles.userRow}
          onPress={() => navigation.navigate("UserTweets", { userId: item.uid })}
        >
          {item.user?.photoURL ? (
            <Image source={{ uri: item.user.photoURL }} style={styles.profileImage} />
          ) : (
            <View style={styles.noPhoto}>
              <Text style={styles.noPhotoText}>?</Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>
              {item.user?.fullName} @{item.user?.username}
            </Text>
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          </View>
        </TouchableOpacity>

        {/* Texto del tweet */}
        <Text style={styles.bodyText}>{item.text}</Text>

        {/* Botón Follow/Unfollow */}
        {!isMine && !followLoading && (
          <TouchableOpacity
            style={[
              styles.followButton,
              { backgroundColor: following ? "#b08968" : "#7f5539" },
            ]}
            onPress={following ? unfollow : follow}
          >
            <Text style={styles.followButtonText}>
              {following ? "Unfollow" : "Follow"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
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
      <FlatList
        data={tweets}
        renderItem={renderTweet}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore && <ActivityIndicator color="#7f5539" />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7f5539" />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2efe8",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* TWEET */
  tweetContainer: {
    backgroundColor: "#ffffff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c7b8a3",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },

  noPhoto: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#d6c7b3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  noPhotoText: {
    color: "#4d4030",
    fontWeight: "bold",
  },

  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4d4030",
  },
  dateText: {
    fontSize: 12,
    color: "#7f5539",
  },

  bodyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7f5539",
  },

  followButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  followButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
