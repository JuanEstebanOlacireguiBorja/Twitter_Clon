import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { getOrCreateLocalId, setLocalId } from '../services/localAuth';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Ingrese email y contraseña');
      return;
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      // guardar como id local para unificar sesión local/online
      await setLocalId(user.uid);
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'No se pudo iniciar sesión');
    }
  };

  const handleContinueLocal = async () => {
    try {
      const localId = await getOrCreateLocalId();
      // ya creado/guardado por getOrCreateLocalId
      navigation.navigate('Home');
    } catch (e) {
      console.error('Continuar local error:', e);
      Alert.alert('Error', 'No se pudo iniciar sesión localmente');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <Text style={styles.label}>Contraseña</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <View style={{ height: 12 }} />
      <Button title="Continuar sin cuenta" onPress={handleContinueLocal} />
      <View style={{ height: 12 }} />
      <Button title="Crear cuenta" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8 },
  label: { marginBottom: 4, fontWeight: '600' },
});

export default LoginScreen
