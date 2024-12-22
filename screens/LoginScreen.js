import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation, setIsLoggedIn }) => {
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!idNumber.trim() || !password.trim()) {
      Alert.alert('Login Failed', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const storedUsers = JSON.parse(await AsyncStorage.getItem('users')) || [];
      const user = storedUsers.find(
        (u) => u.idNumber === idNumber && u.password === password
      );

      if (user) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        Alert.alert('Login Successful', `Welcome back, ${user.fullName}!`);
        setIsLoggedIn(true);
      } else {
        Alert.alert('Login Failed', 'Invalid ID Number or Password.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>USTP Playlist Connect</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Enter ID Number"
          style={styles.input}
          value={idNumber}
          onChangeText={setIdNumber}
          placeholderTextColor="#95a5a6"
          keyboardType="default"
        />
        <TextInput
          placeholder="Enter Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#95a5a6"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#6200ea" />
        ) : (
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.redirectText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  input: {
    padding: 15,
    backgroundColor: '#34495e',
    borderRadius: 8,
    marginBottom: 15,
    color: '#ecf0f1',
  },
  button: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  redirectText: {
    color: '#ecf0f1',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;
