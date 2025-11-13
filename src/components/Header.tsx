import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getOrCreateLocalId } from '../services/localAuth';

const Header = ({ username: propUsername }: { username?: string }) => {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState<string>(propUsername ?? 'guest');

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const ref = doc(db, 'users', user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const d = snap.data() as any;
            setUsername(d.username ?? propUsername ?? 'guest');
            return;
          }
        } catch (e) {
          console.error('Header user fetch error:', e);
        }
        setUsername(propUsername ?? 'guest');
      } else {
        // usar id local
        try {
          const localId = await getOrCreateLocalId();
          const ref = doc(db, 'users', localId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const d = snap.data() as any;
            setUsername(d.username ?? propUsername ?? localId.slice(0,8));
            return;
          }
          setUsername(propUsername ?? localId.slice(0,8));
        } catch (e) {
          console.error('Header local fetch error:', e);
          setUsername(propUsername ?? 'guest');
        }
      }
    };

    load();
  }, [propUsername]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('Logout error:', error?.message ?? error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/adaptive-icon.png')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.username}>@{username}</Text>

      <View style={styles.buttons}>
        <Button title="Inicio" onPress={() => navigation.navigate('Home')} />
        <Button title="Cerrar Sesión" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    backgroundColor: '#dfe6e9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#b2bec3',
    borderBottomWidth: 1,
  },
  logoContainer: {
    marginRight: 10,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default Header;
