import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import FeedScreen from './FeedScreen';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { clearLocalId } from '../services/localAuth';

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign out error:', e);
      // continuar para limpiar localId incluso si no hay sesión Firebase
    }
    try {
      await clearLocalId();
    } catch (e) {
      console.error('Clear local id error:', e);
    }
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <FeedScreen />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Tweet')}
        accessibilityLabel="Nuevo tweet"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 22,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1da1f2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});

export default HomeScreen;
