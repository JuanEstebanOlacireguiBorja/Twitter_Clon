import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, limit, orderBy, query, startAfter } from "firebase/firestore";

export const getFollowersUsers = async (uid, lastDoc = null) => {
  try {
    const followersRef = collection(db, "users", uid, "followers");
    const followersSnap = await getDocs(followersRef);

    const followerIds = followersSnap.docs.map((d) => d.id);

    if (followerIds.length === 0) {
      return { users: [], lastDoc: null };
    }

    const usersRef = collection(db, "users");
    let q = query(usersRef, orderBy("fullName"), limit(10));

    if (lastDoc) {
      q = query(usersRef, orderBy("fullName"), startAfter(lastDoc), limit(10));
    }

    const userSnap = await getDocs(q);

    const usersData = userSnap.docs
      .filter((d) => followerIds.includes(d.id))
      .map((d) => ({
        id: d.id,
        ...d.data(),
      }));

    const newLastDoc = userSnap.docs.length > 0
      ? userSnap.docs[userSnap.docs.length - 1]
      : null;

    return { users: usersData, lastDoc: newLastDoc };

  } catch (error) {
    console.log("Error loading followers:", error);
    return { users: [], lastDoc: null };
  }
};

export const followUser = async (currentUid, targetUid) => {
  try {
    // Add to following
    await setDoc(doc(db, "users", currentUid, "following", targetUid), {});

    // Add to follower count of target user
    await setDoc(doc(db, "users", targetUid, "followers", currentUid), {});

    return true;
  } catch (error) {
    console.log("Follow error:", error);
    return false;
  }
};

export const isFollowing = async (currentUid, targetUid) => {
  const ref = doc(db, "users", currentUid, "following", targetUid);
  const snap = await getDoc(ref);

  return snap.exists();
};
