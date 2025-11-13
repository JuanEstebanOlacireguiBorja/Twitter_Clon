import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { getOrCreateLocalId } from '../services/localAuth';

const TweetScreen = () => {
  const [tweet, setTweet] = useState('');

  const handlePublish = async () => {
    if (!tweet.trim()) {
      Alert.alert('Error', 'El tweet no puede estar vacío');
      return;
    }

    if (tweet.length > 280) {
      Alert.alert('Error', 'El tweet excede 280 caracteres');
      return;
    }

    try {
      const user = auth.currentUser;

      let uidToUse = 'guest';
      let fullName = 'Guest';
      let username = 'guest';

      if (user) {
        uidToUse = user.uid;
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const u = userSnap.data() as any;
          fullName = u.fullName ?? fullName;
          username = u.username ?? username;
        }
      } else {
        // usar id local persistente
        uidToUse = await getOrCreateLocalId();
        const userDocRef = doc(db, 'users', uidToUse);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const u = userSnap.data() as any;
          fullName = u.fullName ?? fullName;
          username = u.username ?? username;
        } else {
          // el servicio localAuth ya intentó crear un doc básico, por si acaso fallback
          username = uidToUse.slice(0, 8);
          fullName = 'Guest User';
        }
      }

      await addDoc(collection(db, 'tweets'), {
        content: tweet,
        uid: uidToUse,
        fullName,
        username,
        createdAt: Timestamp.now(),
      });

      setTweet('');
      Alert.alert('Éxito', 'Tweet publicado correctamente');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'No se pudo publicar el tweet');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={tweet}
        onChangeText={setTweet}
        style={styles.input}
        placeholder="What's happening?"
        multiline
      />
      <Button title="Publicar" onPress={handlePublish} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8, minHeight: 80 },
});

export default TweetScreen;
