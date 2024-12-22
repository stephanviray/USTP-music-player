import React from 'react';
import { View, Text, Button, Alert } from 'react-native';

const LogoutScreen = ({ navigation, setIsLoggedIn }) => {
  const handleLogout = async () => {
    try {
      setIsLoggedIn(false);

      // Reset navigation stack to Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Navigation Error', 'Login screen not found in stack');
    }
  };

  return (
    <View>
      <Text>Logout</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default LogoutScreen;
