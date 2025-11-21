import { useEffect, useState } from "react";
import { isFollowing, followUser, unfollowUser } from "../services/followService";
import { auth } from "../services/firebase";

export const useFollow = (targetUid) => {
  const currentUid = auth.currentUser.uid;
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check initial follow state
  useEffect(() => {
    const loadFollowState = async () => {
      const result = await isFollowing(currentUid, targetUid);
      setFollowing(result);
      setLoading(false);
    };
    loadFollowState();
  }, []);

  const follow = async () => {
    await followUser(currentUid, targetUid);
    setFollowing(true);
  };

  const unfollow = async () => {
    await unfollowUser(currentUid, targetUid);
    setFollowing(false);
  };

  return {
    following,
    loading,
    follow,
    unfollow,
  };
};
