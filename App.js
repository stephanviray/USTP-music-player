import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

// Import Screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import LogoutScreen from './screens/LogoutScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import CustomDrawerContent from './CustomDrawerContent';
import TransactionScreen from './screens/TransactionScreen';  

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    profileImage: null,
  });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Load user profile from AsyncStorage
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (storedUser) {
          setUserProfile(JSON.parse(storedUser));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  if (!appIsReady) {
    return null; // Keep the splash screen visible until the app is ready
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          // Login and Signup Screens for unauthenticated users
          <>
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
              component={(props) => (
                <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
              )}
            />
            <Stack.Screen
              name="Signup"
              options={{ headerShown: false }}
              component={(props) => (
                <SignupScreen
                  {...props}
                  setIsLoggedIn={setIsLoggedIn}
                  setUserProfile={setUserProfile}
                />
              )}
            />
          </>
        ) : (
          // Drawer Navigator for authenticated users
          <Stack.Screen
            name="DrawerNav"
            options={{ headerShown: false }}
            component={(props) => (
              <DrawerNavigator
                {...props}
                setIsLoggedIn={setIsLoggedIn}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
              />
            )}
          />
        )}
 
        <Stack.Screen 
          name="TransactionScreen" 
          component={TransactionScreen} 
          options={{ headerShown: false }} // Optional: hides header if needed
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Drawer Navigator Component
const DrawerNavigator = ({ setIsLoggedIn, userProfile, setUserProfile }) => (
  <Drawer.Navigator
    drawerContent={(props) => (
      <CustomDrawerContent
        {...props}
        setIsLoggedIn={setIsLoggedIn}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
      />
    )}
  >
    <Drawer.Screen name="USTP Player" component={DashboardScreen} />
    <Drawer.Screen
      name="Profile Edit"
      component={(props) => (
        <ProfileEditScreen {...props} userProfile={userProfile} setUserProfile={setUserProfile} />
      )}
    />
    <Drawer.Screen name="Subscription Plan" component={SubscriptionScreen} />
    <Drawer.Screen
      name="TransactionScreen"
      component={(props) => (
        <TransactionScreen {...props} />
      )}
    />
    <Drawer.Screen
      name="Logout"
      options={{ headerShown: false }}
      component={(props) => <LogoutScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
    />
  </Drawer.Navigator>
);
