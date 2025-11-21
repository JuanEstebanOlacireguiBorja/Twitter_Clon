import { db } from "./firebase";
import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";

export const getFollowingUsers = async (uid, lastDoc = null) => {
  try {
    const followingRef = collection(db, "users", uid, "following");
    const followingSnap = await getDocs(followingRef);

    // Extract followed user IDs
    const followedIds = followingSnap.docs.map((d) => d.id);

    if (followedIds.length === 0) {
      return { users: [], lastDoc: null };
    }

    // Now fetch full user profiles
    const usersRef = collection(db, "users");

    let q = query(
      usersRef,
      orderBy("fullName"),
      limit(10)
    );

    if (lastDoc) {
      q = query(
        usersRef,
        orderBy("fullName"),
        startAfter(lastDoc),
        limit(10)
      );
    }

    const usersSnap = await getDocs(q);

    // Filter only the users that are being followed
    const usersData = usersSnap.docs
      .filter((doc) => followedIds.includes(doc.id))
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    const newLastDoc = usersSnap.docs.length > 0
      ? usersSnap.docs[usersSnap.docs.length - 1]
      : null;

    return { users: usersData, lastDoc: newLastDoc };

  } catch (error) {
    console.log("Error loading following users:", error);
    return { users: [], lastDoc: null };
  }
};
