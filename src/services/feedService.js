import { db } from "./firebase";
import { collection, query, where, orderBy, limit, startAfter, getDocs, doc, getDoc } from "firebase/firestore";

export const getFollowingIds = async (uid) => {
  const followingRef = collection(db, "users", uid, "following");
  const snap = await getDocs(followingRef);

  const ids = snap.docs.map((d) => d.id);
  return ids;
};

export const getFeedTweets = async (uids, lastDoc = null) => {
  try {
    const tweetsRef = collection(db, "tweets");

    let q = query(
      tweetsRef,
      where("uid", "in", uids),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    if (lastDoc) {
      q = query(
        tweetsRef,
        where("uid", "in", uids),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(10)
      );
    }

    const snap = await getDocs(q);

    return {
      tweets: snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      lastDoc: snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null,
    };
  } catch (error) {
    console.log("Feed error:", error);
    return { tweets: [], lastDoc: null };
  }
};
