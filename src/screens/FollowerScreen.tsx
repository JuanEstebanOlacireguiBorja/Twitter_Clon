import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { getOrCreateLocalId } from '../services/localAuth';

const FollowersScreen = () => {
  const route: any = useRoute();
  const uidParam = route.params?.uid;
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const uidToQuery = uidParam ?? await getOrCreateLocalId();
        const userRef = doc(db, 'users', uidToQuery);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          setFollowers([]);
          setLoading(false);
          return;
        }
        const userData = userSnap.data() as any;
        const followerIds: string[] = Array.isArray(userData.followers) ? userData.followers : [];

        const usersData = await Promise.all(
          followerIds.map(async fid => {
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

        setFollowers(usersData);
      } catch (err) {
        console.error('Followers load error:', err);
        setFollowers([]);
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
      data={followers}
      keyExtractor={item => item.uid}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.username}>@{item.username}</Text>
        </View>
      )}
      ListEmptyComponent={<View style={styles.center}><Text>No hay seguidores</Text></View>}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontWeight: '700' },
  username: { color: '#666' },
});

export default FollowersScreen;
