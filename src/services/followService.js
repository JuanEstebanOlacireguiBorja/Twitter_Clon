import { db } from "./firebase";
import { setDoc, deleteDoc, doc, getDoc, updateDoc, increment } from "firebase/firestore";

/**
 * Check if current user follows target user
 */
export const isFollowing = async (currentUid, targetUid) => {
  const ref = doc(db, "users", currentUid, "following", targetUid);
  const snap = await getDoc(ref);
  return snap.exists();
};

/**
 * Follow user (global)
 */
export const followUser = async (currentUid, targetUid) => {
  try {
    // Add to current user's following
    await setDoc(doc(db, "users", currentUid, "following", targetUid), {});

    // Add follower reference in target user
    await setDoc(doc(db, "users", targetUid, "followers", currentUid), {});

    // Increment counters
    await updateDoc(doc(db, "users", currentUid), {
      following: increment(1),
    });

    await updateDoc(doc(db, "users", targetUid), {
      followers: increment(1),
    });

    return true;
  } catch (error) {
    console.log("Follow error:", error);
    return false;
  }
};

/**
 * Unfollow user (global)
 */
export const unfollowUser = async (currentUid, targetUid) => {
  try {
    // Remove from following
    await deleteDoc(doc(db, "users", currentUid, "following", targetUid));

    // Remove from target's followers
    await deleteDoc(doc(db, "users", targetUid, "followers", currentUid));

    // Decrement counters
    await updateDoc(doc(db, "users", currentUid), {
      following: increment(-1),
    });

    await updateDoc(doc(db, "users", targetUid), {
      followers: increment(-1),
    });

    return true;
  } catch (error) {
    console.log("Unfollow error:", error);
    return false;
  }
};
