import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './src/services/firebaseConfig';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import TweetScreen from './src/screens/TweetScreen';
import FeedScreen from './src/screens/FeedScreen';
import FollowersScreen from './src/screens/FollowerScreen';
import FollowingScreen from './src/screens/FollowingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) return null; // o un splash

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={ LoginScreen } options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={ RegisterScreen } options={{ title: 'Register' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={ HomeScreen } options={{ title: 'Home' }} />
            <Stack.Screen name="Tweet" component={ TweetScreen } options={{ title: 'Tweet' }} />
            <Stack.Screen name="Feed" component={ FeedScreen } options={{ title: 'Feed' }} />
            <Stack.Screen name="Followers" component={ FollowersScreen } options={{ title: 'Followers' }} />
            <Stack.Screen name="Following" component={ FollowingScreen } options={{ title: 'Following' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
