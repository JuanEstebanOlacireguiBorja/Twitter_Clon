import { useEffect, useState } from "react";
import { isFollowing, followUser, unfollowUser } from "../services/followService";
import { auth } from "../services/firebase";

export const useFollow = (targetUid) => {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFollowState = async () => {
      const currentUid = auth.currentUser?.uid;
      if (!currentUid || !targetUid) {
        setFollowing(false);
        setLoading(false);
        return;
      }
      try {
        const result = await isFollowing(currentUid, targetUid);
        setFollowing(result);
      } catch (err) {
        // optional: report error
        console.error("Failed to load follow state", err);
        setFollowing(false);
      } finally {
        setLoading(false);
      }
    };
    loadFollowState();
  }, [targetUid, auth.currentUser?.uid]);

  const follow = async () => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || !targetUid) return;
    try {
      await followUser(currentUid, targetUid);
      setFollowing(true);
    } catch (err) {
      console.error("Failed to follow user", err);
    }
  };

  const unfollow = async () => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || !targetUid) return;
    try {
      await unfollowUser(currentUid, targetUid);
      setFollowing(false);
    } catch (err) {
      console.error("Failed to unfollow user", err);
    }
  };

  return {
    following,
    loading,
    follow,
    unfollow,
  };
};
