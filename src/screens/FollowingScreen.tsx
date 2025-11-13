import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { getOrCreateLocalId } from '../services/localAuth';

const FollowingScreen = () => {
  const route: any = useRoute();
  const uidParam = route.params?.uid;
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const uidToQuery = uidParam ?? await getOrCreateLocalId();
        const userRef = doc(db, 'users', uidToQuery);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          setFollowing([]);
          setLoading(false);
          return;
        }
        const userData = userSnap.data() as any;
        const followingIds: string[] = Array.isArray(userData.following) ? userData.following : [];

        const usersData = await Promise.all(
          followingIds.map(async fid => {
            try {
              const fRef = doc(db, 'users', fid);
              const fSnap = await getDoc(fRef);
              if (fSnap.exists()) {
                const d = fSnap.data() as any;
                return { uid: fid, fullName: d.fullName ?? 'Guest', username: d.username ?? 'guest' };
              }
            } catch (e) { /* ignore per-user error */ }
            return { uid: fid, fullName: 'Guest', username: 'guest' };
          })
        );

        setFollowing(usersData);
      } catch (err) {
        console.error('Following load error:', err);
        setFollowing([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [uidParam]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator/></View>;
  }

  return (
    <FlatList
      data={following}
      keyExtractor={item => item.uid}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.username}>@{item.username}</Text>
        </View>
      )}
      ListEmptyComponent={<View style={styles.center}><Text>No sigue a nadie</Text></View>}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontWeight: '700' },
  username: { color: '#666' },
});

export default FollowingScreen;
