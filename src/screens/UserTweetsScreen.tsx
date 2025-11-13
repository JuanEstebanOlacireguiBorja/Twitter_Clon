import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useRoute } from '@react-navigation/native';

const PAGE_SIZE = 10;

const UserTweetsScreen = () => {
  const route: any = useRoute();
  const uidParam = route.params?.uid ?? 'guest';
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'tweets'),
      where('uid', '==', uidParam),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          content: data.content ?? '',
          uid: data.uid ?? 'guest',
          fullName: data.fullName ?? 'Guest',
          username: data.username ?? 'guest',
          createdAt: data.createdAt && (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) || new Date(0),
        };
      });
      setTweets(items);
      setLoading(false);
    }, err => {
      console.error('UserTweets onSnapshot error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uidParam]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={tweets}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.tweet}>
          <Text style={styles.name}>{item.fullName} @{item.username}</Text>
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.meta}>{item.createdAt.toLocaleString()}</Text>
        </View>
      )}
      ListEmptyComponent={<View style={styles.center}><Text>Este usuario no tiene tweets</Text></View>}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tweet: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontWeight: '700' },
  content: { marginTop: 4 },
  meta: { marginTop: 6, color: '#666', fontSize: 12 },
});

export default UserTweetsScreen;
