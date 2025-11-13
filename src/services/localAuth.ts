import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const STORAGE_KEY = '@local_user_id';

function generateId() {
  return 'local_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function getLocalId(): Promise<string | null> {
  try {
    const v = await AsyncStorage.getItem(STORAGE_KEY);
    return v;
  } catch (e) {
    console.error('getLocalId error:', e);
    return null;
  }
}

export async function setLocalId(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, id);
  } catch (e) {
    console.error('setLocalId error:', e);
  }
}

export async function clearLocalId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('clearLocalId error:', e);
  }
}

// Crea un id local si no existe y asegura un documento básico en users/
export async function getOrCreateLocalId(): Promise<string> {
  try {
    let id = await getLocalId();
    if (id) return id;

    id = generateId();
    await setLocalId(id);

    // Crear doc básico en Firestore si no existe
    try {
      const ref = doc(db, 'users', id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: id,
          fullName: 'Guest User',
          username: id.slice(0, 8),
          email: null,
          followers: [],
          following: [],
          createdAt: new Date(),
          isLocal: true,
        });
      }
    } catch (e) {
      console.error('create local user doc error:', e);
    }

    return id;
  } catch (e) {
    console.error('getOrCreateLocalId error:', e);
    // fallback id
    const fallback = generateId();
    await setLocalId(fallback);
    return fallback;
  }
}
