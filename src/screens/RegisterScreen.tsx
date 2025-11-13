import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { setLocalId } from '../services/localAuth';

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!fullName || !userName || !email || !password) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar informacion adicional del usuario en la colección "users"
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        username: userName,
        email,
        uid: user.uid,
        followers: [],
        following: [],
        createdAt: new Date(),
      });

      // Integrar sesión local: marcar el localId como este uid
      await setLocalId(user.uid);

      Alert.alert('Éxito', 'Usuario registrado exitosamente');
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('Error en el registro', error?.message ?? 'Ocurrió un error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre completo</Text>
      <TextInput value={fullName} onChangeText={setFullName} style={styles.input} />
      <Text style={styles.label}>Usuario</Text>
      <TextInput value={userName} onChangeText={setUserName} style={styles.input} />
      <Text style={styles.label}>Email</Text>
      <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <Text style={styles.label}>Contraseña</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8 },
  label: { marginBottom: 4, fontWeight: '600' },
});

export default RegisterScreen;
