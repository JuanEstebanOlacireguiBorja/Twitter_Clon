import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TweetScreen from '../screens/TweetScreen';
import FeedScreen from '../screens/FeedScreen';
import FollowersScreen from '../screens/FollowerScreen';
import FollowingScreen from '../screens/FollowingScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tweet" component={TweetScreen} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name= "Followers" component={FollowersScreen}/>
        <Stack.Screen name="Following" component={FollowingScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
