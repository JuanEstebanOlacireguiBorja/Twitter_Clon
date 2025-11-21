import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import FollowingList from "./src/screens/FollowingList";
import FollowersList from "./src/screens/FollowersList";
import TweetScreen from "./src/screens/TweetScreen";
import FeedScreen from "./src/screens/FeedScreen";
import UserTweets from "./src/screens/UserTweets";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen"

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TweetScreen"
          component={TweetScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FeedScreen"
          component={FeedScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserTweets"
          component={UserTweets}
          options={{ title: "User Tweets" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: "Edit Profile" }}
        />
        <Stack.Screen
          name="FollowingList"
          component={FollowingList}
          options={{title: "Following", headerTintColor: "#4d4030"}}
        />
        <Stack.Screen
          name="FollowersList"
          component={FollowersList}
          options={{title: "Followers", headerTintColor: "#4d4030"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
